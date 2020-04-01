import { server } from './server.ts';
import { build } from './build.ts';

export async function serve(site, paths) {
  await build(site, paths);
  server(site, paths);

  const iter = Deno.fsEvents([
    paths.config,
    paths.public,
    paths.content,
    paths.template,
  ]);

  for await (const event of iter) {
    /* console.log('>>>> event', event); //e.g. { kind: "create", paths: [ "/foo.txt" ] } */
    await build(site, paths);
  }
}
