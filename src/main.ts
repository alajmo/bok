import { build } from './core/build.ts';
import { readFileStrSync } from 'https://deno.land/std/fs/mod.ts';

function buildSite(sitePath, site) {
  build(sitePath, site);
}

function main() {
  const { args } = Deno;
  const siteConfigPath = args[0];
  const sitePath = Deno.realpathSync(siteConfigPath);
  const siteStr = readFileStrSync(sitePath);
  const site = JSON.parse(siteStr);

  buildSite(sitePath, site);
}

main();
