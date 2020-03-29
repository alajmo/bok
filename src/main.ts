import { build } from './core/build.ts';
import { parseConfig } from './lib/config.ts';

function buildSite(site: any, paths: any) {
  build(site, paths);
}

function main() {
  const { args } = Deno;
  const { site, paths } = parseConfig(args[0]);

  buildSite(site, paths);
}

main();
