import { log } from "../../deps.ts";
import { serve } from "https://deno.land/std@0.83.0/http/server.ts";
import {
  acceptWebSocket,
  isWebSocketCloseEvent,
  WebSocket,
} from "https://deno.land/std@0.83.0/ws/mod.ts";

import { events } from "./event.ts";
import { Site } from "./config.ts";

export { websocket };

async function websocket(site: Site) {
  const port = site.serve.wsPort || "5001";
  log.debug(`websocket server is running on ${port}`);

  for await (const req of serve(`:${port}`)) {
    const { conn, r: bufReader, w: bufWriter, headers } = req;

    acceptWebSocket({
      conn,
      bufReader,
      bufWriter,
      headers,
    })
      .then(handleWs)
      .catch(async (err) => {
        log.error(`Failed to accept websocket: ${err}`);
        await req.respond({ status: 400 });
      });
  }
}

async function handleWs(sock: WebSocket) {
  log.debug("socket connected!");

  const handler = async () => {
    await sock.send(JSON.stringify({ type: "build_complete" }));
  };

  events.on("BUILD_COMPLETE", handler);

  try {
    for await (const ev of sock) {
      if (isWebSocketCloseEvent(ev)) {
        const { code, reason } = ev;
        log.debug("ws:Close", code, reason);
        events.off("BUILD_COMPLETE", handler);
      }
    }
  } catch (err) {
    console.error(`failed to receive frame: ${err}`);

    if (!sock.isClosed) {
      await sock.close(1000).catch(console.error);
    }
  }
}
