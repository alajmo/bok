import * as path from "node:path";
import { fs } from "./fs.ts";
import { log } from "./log.ts";

import { Site } from "./config.ts";
import { exists } from "./utils.ts";

export { server };

const WS_CLIENT_CODE = `(function connect() {
  let ws = new WebSocket("ws://localhost:\${wsPort}/websocket");
  let retryDelay = 1000;

  ws.onopen = (event) => {
    console.log("Live reload ready");
  };

  ws.onmessage = (event) => {
    let data = JSON.parse(event.data);

    switch (data.type) {
      case "build_complete":
        ws.close(1000, "[DOCS] Reloading site...");
        console.log("Reloading page after receiving build_complete");
        location.reload(true);
        break;
      default:
        console.log("Don't know how to handle type '" + data.type + "'");
    }
  };

  ws.onclose = (event) => {
    console.log(
      "Websocket connection closed or unable to connect; " +
        "starting reconnect timeout",
    );
    ws = null;
    setTimeout(connect, retryDelay);
  };

  ws.onerror = (err) => console.log("WebSocket error:", err.error);
})();`;

const MEDIA_TYPES: Record<string, string> = {
  ".md": "text/markdown",
  ".html": "text/html",
  ".htm": "text/html",
  ".json": "application/json",
  ".map": "application/json",
  ".txt": "text/plain",
  ".ts": "text/typescript",
  ".tsx": "text/tsx",
  ".js": "application/javascript",
  ".jsx": "text/jsx",
  ".gz": "application/gzip",
  ".css": "text/css",
  ".wasm": "application/wasm",
  ".mjs": "application/javascript",
  ".svg": "image/svg+xml",
};

/** Returns the content-type based on the extension of a path. */
function contentType(p: string): string | undefined {
  return MEDIA_TYPES[path.extname(p)];
}

async function serveStatic(
  filePath: string,
  wsPort: number,
): Promise<Response> {
  const headers = new Headers();

  const ct = contentType(filePath);
  let body: BodyInit;

  // Handle html and assets (js, css, json, .etc differently)
  if (ct === "text/html") {
    body = fs.readFileSync(filePath, 'utf-8');
    body += `<script>${WS_CLIENT_CODE.replace('${wsPort}', String(wsPort))}</script>`;
  } else {
    body = fs.readFileSync(filePath);
  }

  // Disable caching in dev mode
  headers.set("cache-control", "no-cache, no-store, must-revalidate");

  if (ct) {
    headers.set("content-type", `${ct}; charset=utf-8`);
  }

  return new Response(body, { status: 200, headers });
}

async function serveFallback(
  paths: any,
  e: Error,
  wsPort: number,
): Promise<Response> {
  // Check if it's a "not found" type error
  if ((e as NodeJS.ErrnoException).code === 'ENOENT') {
    const fsPath = path.join(paths.output, "404", "index.html");
    const notFoundPageExists = await exists(fsPath);
    if (notFoundPageExists) {
      return serveStatic(fsPath, wsPort);
    }

    return new Response("Not found", { status: 404 });
  } else {
    return new Response("Internal server error", { status: 500 });
  }
}

function serverLog(req: Request, res: Response): void {
  const d = new Date().toISOString();
  const dateFmt = `[${d.slice(0, 10)} ${d.slice(11, 19)}]`;
  const url = new URL(req.url);
  const s = `${dateFmt} "${req.method} ${url.pathname} HTTP/1.1" ${res.status}`;
  log.debug(s);
}

function server(site: Site) {
  const rootUrl = site.rootUrl || "";

  const bunServer = Bun.serve({
    port: site.serve?.port || 5000,

    async fetch(req: Request): Promise<Response> {
      const url = new URL(req.url);
      let normalizedUrl = path.normalize(url.pathname);

      try {
        normalizedUrl = decodeURIComponent(normalizedUrl);
      } catch (e) {
        if (!(e instanceof URIError)) {
          throw e;
        }
      }

      // Strip rootUrl prefix for local serving
      if (rootUrl && normalizedUrl.startsWith(rootUrl)) {
        normalizedUrl = normalizedUrl.slice(rootUrl.length) || "/";
      }

      let fsPath = path.join(site.paths.output, normalizedUrl);

      let response: Response;
      try {
        const info = fs.statSync(fsPath);
        if (info.isDirectory()) {
          fsPath = path.join(fsPath, "index.html");
        }

        response = await serveStatic(fsPath, site.serve?.wsPort || 5001);
      } catch (e) {
        response = await serveFallback(site.paths, e as Error, site.serve?.wsPort || 5001);
      }

      serverLog(req, response);
      return response;
    },
  });

  log.info(`\nListening on http://localhost:${bunServer.port}`);
}
