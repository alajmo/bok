import { build } from './core/build.ts';
import { join, dirname } from 'https://deno.land/std/path/mod.ts';
import { readFileStrSync } from 'https://deno.land/std/fs/mod.ts';
import { parseConfig } from './lib/config.ts';

function buildSite(site, paths) {
  build(site, paths);
}

function main() {
  const { args } = Deno;
  const { site, paths } = parseConfig(args[0]);

  buildSite(site, paths);
}

main();
