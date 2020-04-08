import { join, dirname } from 'https://deno.land/std/path/mod.ts';
import { readFileStrSync } from 'https://deno.land/std/fs/mod.ts';

export { parseConfig };

async function parseConfig(siteConfigPath: string) {
  siteConfigPath = Deno.realpathSync(siteConfigPath);
  const sitePath = dirname(siteConfigPath);

  const siteFile = await import(siteConfigPath);
  const site = siteFile.config();
  const paths = getPaths(siteConfigPath, sitePath, site);

  return { site, paths };
}

function getPaths(siteConfigPath: string, sitePath: string, site: any) {
  return {
    root: sitePath,
    config: siteConfigPath,
    public: join(sitePath, site.public),
    content: join(sitePath, site.content),
    template: join(sitePath, site.template),
    output: join(sitePath, site.output),
    robot: join(sitePath, site.output, 'robots.txt'),
    sitemap: join(sitePath, site.output, 'sitemap.xml'),
  };
}
