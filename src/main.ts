import { build } from './core/build.ts';
import { join, dirname } from 'https://deno.land/std/path/mod.ts';
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
  const paths = {
    public: join(dirname(siteConfigPath), site.public),
    content: join(dirname(siteConfigPath), site.content),
    template: join(dirname(siteConfigPath), site.template),
    output: join(dirname(siteConfigPath), site.output),
  };

  buildSite(sitePath, site, paths);
}

main();
