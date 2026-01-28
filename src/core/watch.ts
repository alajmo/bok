import chokidar from "chokidar";
import { Site } from "./config.ts";
import { websocket } from "./ws-server.ts";
import { server } from "./server.ts";
import { build } from "./build.ts";
import { events } from "./event.ts";

export { serve, watch };

const INTERVAL = 500;

async function watch(site: Site) {
  await build(site);

  const dirs = [site.paths.assets, site.paths.content, site.paths.layout];
  let reloading = false;

  const watcher = chokidar.watch(dirs, {
    ignoreInitial: true,
  });

  watcher.on('change', async () => {
    if (!reloading) {
      reloading = true;
      await build(site);
      setTimeout(() => (reloading = false), INTERVAL);
    }
  });
}

async function serve(site: Site) {
  await build(site);
  if (site.serve?.reload) {
    websocket(site);
  }
  server(site);

  const dirs = [site.paths.content, site.paths.assets, site.paths.layout];

  let reloading = false;

  const watcher = chokidar.watch(dirs, {
    ignoreInitial: true,
  });

  watcher.on('change', async () => {
    if (!reloading) {
      reloading = true;

      await build(site);

      if (site.serve?.reload) {
        setTimeout(() => {
          events.emit("BUILD_COMPLETE");
        }, 500);
      }

      setTimeout(() => (reloading = false), INTERVAL);
    }
  });
}
