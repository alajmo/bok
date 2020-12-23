import { server } from "./server.ts";
import { build } from "./build.ts";

export async function serve(site, paths: [string]) {
  await build(site, paths);
  server(site, paths);

  const iter = Deno.watchFs([
    paths.config,
    paths.public,
    paths.content,
    paths.template,
  ]);

  for await (const event of iter) {
    await build(site, paths);
  }
}
