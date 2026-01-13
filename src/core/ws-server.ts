import { log } from "./log.ts";
import type { ServerWebSocket } from "bun";

import { events } from "./event.ts";
import { Site } from "./config.ts";

export { websocket };

const clients = new Set<ServerWebSocket<unknown>>();

function websocket(site: Site) {
  const port = site.serve?.wsPort || 5001;
  log.debug(`websocket server is running on ${port}`);

  // Set up event listener for build complete
  events.on("BUILD_COMPLETE", () => {
    for (const client of clients) {
      client.send(JSON.stringify({ type: "build_complete" }));
    }
  });

  Bun.serve({
    port,
    fetch(req, server) {
      // Upgrade the request to a WebSocket connection
      if (server.upgrade(req)) {
        return; // Return undefined if upgrade succeeds
      }
      return new Response("Upgrade failed", { status: 500 });
    },
    websocket: {
      open(ws) {
        log.debug("socket connected!");
        clients.add(ws);
      },
      message(ws, message) {
        // Handle incoming messages if needed
        log.debug("Received message:", message);
      },
      close(ws, code, reason) {
        log.debug("ws:Close", code, reason);
        clients.delete(ws);
      },
      error(ws, error) {
        console.error("WebSocket error:", error);
      },
    },
  });
}
