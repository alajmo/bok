import * as path from "https://deno.land/std@0.81.0/path/mod.ts";

import {
  listenAndServe,
  Response,
  ServerRequest,
} from "https://deno.land/std/http/mod.ts";
import { exists } from "../lib/utils.ts";
const { stat, open } = Deno;

const encoder = new TextEncoder();

async function serveStatic(
  req: ServerRequest,
  filePath: string,
  contentType: string,
): Promise<Response> {
  const [file, fileInfo] = await Promise.all([open(filePath), stat(filePath)]);
  const headers = new Headers();
  headers.set("content-length", fileInfo.size.toString());

  if (contentType) {
    headers.set("content-type", contentType);
  }

  const res = {
    status: 200,
    body: file,
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
      const contentType = getContentType(fsPath);
      return serveStatic(req, fsPath, contentType);
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

function getContentType(fsPath: string | null) {
  switch (path.extname(fsPath)) {
    case ".svg":
      return "image/svg+xml";
    default:
      return null;
  }
}

export function server(site, paths) {
  const addr = `0.0.0.0:${site.serve.port}`;

  listenAndServe(
    addr,
    async (req): Promise<void> => {
      let normalizedUrl = path.normalize(req.url);

      try {
        normalizedUrl = decodeURIComponent(path.normalizedUrl);
      } catch (e) {
        if (!(e instanceof URIError)) {
          throw e;
        }
      }

      let fsPath = path.join(paths.output, path.normalizedUrl);
      let response: Response | undefined;
      try {
        const info = await stat(fsPath);

        if (info.isDirectory()) {
          fsPath = path.join(fsPath, "index.html");
        }

        const contentType = getContentType(fsPath);
        response = await serveStatic(req, fsPath, contentType);
      } catch (e) {
        response = await serveFallback(paths, req, e);
      } finally {
        /* serverLog(req, response!); */
        req.respond(response!);
      }
    },
  );

  console.log(`HTTP server listening on http://${addr}/`);
}
