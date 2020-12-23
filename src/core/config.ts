import * as path from 'https://deno.land/std@0.81.0/path/mod.ts';
import * as fs from 'https://deno.land/std@0.81.0/fs/mod.ts';

export { parseConfig, validateConfig };

export interface Site {
  title?: string;
  author?: string;
  description?: string;
  url?: string;
  paths: SitePaths;
  flags: SiteFlags;
  hooks: SiteHooks;
  custom: any;
}

export interface SiteConfig {
  flags: SiteFlags;
  hooks: any;
  custom: any;
}

export interface SiteFlags {
  sitemap?: boolean;
  robot?: boolean;
}

export interface SiteHooks {
  beforeSite?: any;
  afterSite?: any;
  beforePage?: any;
  afterPage?: any;
}

export interface SitePaths {
  root: string;
  public: string;
  content: string;
  template: string;
  output: string;
  robot: string;
  sitemap: string;
  toc?: string;
  defaultTemplate?: string;
}

/**
 * Parse, validate config and return monolithic Site object.
 */
async function parseConfig(siteConfigPath: string): Promise<Site> {
  const realSitePath = Deno.realPathSync(siteConfigPath);
  const sitePath = path.dirname(realSitePath);
  const siteConfig = (await import(realSitePath)).default();

  const paths = getSitePaths(sitePath, siteConfig);

  validateConfig(paths);

  const site: Site = {
    title: siteConfig.title,
    author: siteConfig.author,
    description: siteConfig.description,
    url: siteConfig.url,
    flags: siteConfig.flags,
    custom: siteConfig.custom,
    hooks: siteConfig.hooks,
    paths,
  };

  return site;
}

function validateConfig(paths: any) {
  if (!fs.existsSync(paths.content)) {
    console.error('error: content directory is missing');
  }

  if (!fs.existsSync(paths.template)) {
    console.error('error: template directory is missing');
  }
}

function getSitePaths(sitePath: string, siteConfig: SiteConfig): SitePaths {
  return {
    root: sitePath,
    public: path.join(sitePath, siteConfig.paths.public),
    content: path.join(sitePath, siteConfig.paths.content),
    template: path.join(sitePath, siteConfig.paths.template),
    output: path.join(sitePath, siteConfig.paths.output),
    robot: path.join(sitePath, siteConfig.paths.output, 'robots.txt'),
    sitemap: path.join(sitePath, siteConfig.paths.output, 'sitemap.xml'),
    toc: path.join(sitePath, siteConfig.paths.content, siteConfig.paths.toc),
    defaultTemplate: path.join(
      sitePath,
      siteConfig.paths.template,
      siteConfig.paths.defaultTemplate,
    ),
  };
}
