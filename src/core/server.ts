import { http, log, path } from "../../deps.ts";

import { Site } from "./config.ts";
import { __dirname, exists } from "./utils.ts";

export { server };

const encoder = new TextEncoder();
let WS_CLIENT_CODE = "";

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

function initWSClientCode() {
  const wsClientPath = path.join(__dirname(), "ws-client.js");
  WS_CLIENT_CODE = Deno.readTextFileSync(wsClientPath);
}

/** Returns the content-type based on the extension of a path. */
function contentType(p: string): string | undefined {
  return MEDIA_TYPES[path.extname(p)];
}

async function serveStatic(
  req: ServerRequest,
  filePath: string,
): Promise<Response> {
  let [file, fileInfo] = await Promise.all([
    Deno.open(filePath),
    Deno.stat(filePath),
  ]);

  const headers = new Headers();
  /* headers.set('content-length', fileInfo.size.toString()); */

  const ct = contentType(filePath);
  let body;
  if (ct === "text/html") {
    body = await Deno.readTextFile(filePath);
    body += `<script>${WS_CLIENT_CODE}</script>`;
  } else {
    body = file;
  }

  if (ct) {
    headers.set("content-type", ct);
  }

  const res = {
    body,
    status: 200,
    headers,
  };

  return res;
}

async function serveFallback(
  paths: any,
  req: ServerRequest,
  e: Error,
): Promise<Response> {
  if (e instanceof Deno.errors.NotFound) {
    const fsPath = path.join(paths.output, "404", "index.html");
    const notFoundPageExists = await exists(fsPath);
    if (notFoundPageExists) {
      return serveStatic(req, fsPath);
    }

    return Promise.resolve({
      status: 404,
      body: encoder.encode("Not found"),
    });
  } else {
    return Promise.resolve({
      status: 500,
      body: encoder.encode("Internal server error"),
    });
  }
}

function serverLog(req: ServerRequest, res: Response): void {
  const d = new Date().toISOString();
  const dateFmt = `[${d.slice(0, 10)} ${d.slice(11, 19)}]`;
  const s = `${dateFmt} "${req.method} ${req.url} ${req.proto}" ${res.status}`;
}

function server(site: Site) {
  if (site.serve.reload) {
    initWSClientCode();
  }

  const handler = async (req: Request): Promise<Response> => {
    let normalizedUrl = path.normalize(req.url);

    console.log(req.url);

    try {
      normalizedUrl = decodeURIComponent(normalizedUrl);
    } catch (e) {
      if (!(e instanceof URIError)) {
        throw e;
      }
    }

    let fsPath = path.join(site.paths.output, normalizedUrl);
    console.log(site.paths, normalizedUrl)

    let response: Response;
    try {
      const info = await Deno.stat(fsPath);
      if (info.isDirectory) {
        fsPath = path.join(fsPath, "index.html");
      }

      response = await serveStatic(req, fsPath);
    } catch (e) {
      response = await serveFallback(site.paths, req, e);
    } finally {
      serverLog(req, response!);
      return new Response(response.body, { status: response.status, header: response.header });
      // return new Response(response!);
      // req.respond(response!);
    }
  };

  http.listenAndServe({ port: site.serve?.port }, handler);

  log.info(`\nListening on http://localhost:${site.serve?.port}`);
}
