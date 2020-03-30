import { join, dirname } from 'https://deno.land/std/path/mod.ts';
import { readFileStrSync } from 'https://deno.land/std/fs/mod.ts';

export { parseConfig };

function parseConfig(siteConfigPath: string) {
  siteConfigPath = Deno.realpathSync(siteConfigPath);

  const sitePath = dirname(siteConfigPath);
  const siteStr = readFileStrSync(siteConfigPath);
  const site = JSON.parse(siteStr);
  const paths = getPaths(sitePath, site);

  return { site, paths };
}

function getPaths(sitePath: string, site: any) {
  return {
    root: sitePath,
    public: join(sitePath, site.public),
    content: join(sitePath, site.content),
    template: join(sitePath, site.template),
    output: join(sitePath, site.output),
  };
}
