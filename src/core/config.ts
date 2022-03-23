import { fs, log, path } from "../../deps.ts";
import { __dirname } from "./utils.ts";

export {
  getSiteConfig,
  readSiteConfig,
  SearchFilesType,
  Site,
  SiteHooks,
  SitePaths,
  SiteServe,
};

interface Site {
  theme?: string;
  paths: SitePaths;
  public: string[];
  files: SiteFiles;
  serve?: SiteServe;
  hooks: SiteHooks;
  uglyURLs?: boolean;
  params?: any;
}

interface SitePaths {
  assets: string;

  content: string;
  toc?: string;
  404?: string;

  layout: string;
  defaultLayout?: string;

  output: string;
}

enum SearchFilesType {
  walk,
  glob,
  toc,
}

interface SiteFiles {
  type: SearchFilesType;
}

interface SiteServe {
  reload: boolean;
  port: number;
  wsPort: number;
}

interface SiteHooks {
  beforeSite: any;
  afterSite: any;
  beforePage: any;
  afterPage: any;
}

export const THEMES: any = {
  basic: path.join(__dirname(), "../../themes/basic/config.ts"),
  book: path.join(__dirname(), "../../themes/book/config.ts"),
};

/**
 * Parse, validate config and return Site object.
 */
async function getSiteConfig(
  config: string = "config.ts",
  options?: any,
): Promise<Site> {
  // 1. Read the config file
  const { siteConfig, siteDir } = await readSiteConfig(config);

  // 2. Add default values
  extendWithDefaultConfig(siteConfig, siteDir);

  // 3. Override with theme data
  if (siteConfig.extends) {
    await extendWithThemeConfig(siteConfig);
  }

  // 4. Override with options
  if (options) {
    overrideWithOptions(siteConfig, options);
  }

  // 5. Validate config file
  validateConfig(siteConfig.paths);

  // 6. Return site object
  const site: Site = {
    files: siteConfig.files,
    paths: siteConfig.paths,
    public: siteConfig.public,
    serve: siteConfig.serve,
    hooks: siteConfig.hooks,
    uglyURLs: siteConfig.uglyURLs,
    params: siteConfig.params,
  };

  return site;
}

function overrideWithOptions(siteConfig: any, options: any) {
  siteConfig.serve.reload = options.reload ?? siteConfig.serve.reload;
  siteConfig.serve.port = options.port ?? siteConfig.serve.port;
  siteConfig.serve.wsPort = options.wsPort ?? siteConfig.serve.wsPort;
}

function extendWithDefaultConfig(siteConfig: any, siteDir: string) {
  // Paths
  siteConfig.paths = siteConfig.paths ?? {};

  siteConfig.paths.content = setSitePath(
    siteConfig.paths.content,
    siteDir,
    "content",
  );

  siteConfig.paths.output = setSitePath(
    siteConfig.paths.output,
    siteDir,
    "site",
  );

  siteConfig.paths.assets = setSitePath(
    siteConfig.paths.assets,
    siteDir,
    "assets",
  );

  siteConfig.paths.layout = setSitePath(
    siteConfig.paths.layout,
    siteDir,
    "layout",
  );

  siteConfig.uglyURLs = siteConfig.uglyURLs ?? false;

  // default layout is relative to layout directory
  if (siteConfig.paths.defaultLayout) {
    siteConfig.paths.defaultLayout = path.join(
      siteConfig.paths.layout,
      siteConfig.paths.defaultLayout,
    );
  }

  // Files
  siteConfig.files = siteConfig.files ?? { type: SearchFilesType.walk };

  if (SearchFilesType[siteConfig.files.type] === SearchFilesType.toc) {
    siteConfig.files.file = path.join(
      siteConfig.paths.content,
      siteConfig.files.file,
    );
  }

  // Serve
  siteConfig.serve = siteConfig.serve ?? {};

  siteConfig.serve = {
    reload: siteConfig.serve.reload ?? true,
    port: siteConfig.serve.port ?? 5000,
    wsPort: siteConfig.serve.wsPort ?? 5001,
  };

  // Hooks
  siteConfig.hooks = siteConfig.hooks ?? {};

  siteConfig.hooks.beforeSite = siteConfig.hooks.beforeSite ?? function () {};
  siteConfig.hooks.afterSite = siteConfig.hooks.afterSite ?? function () {};
  siteConfig.hooks.beforePage = siteConfig.hooks.beforePage ?? function () {};
  siteConfig.hooks.afterPage = siteConfig.hooks.afterPage ?? function () {};

  siteConfig.params = siteConfig.params ?? {};
}

async function extendWithThemeConfig(siteConfig: any) {
  const configPath = THEMES[siteConfig.extends] ?? siteConfig.extends;
  const themeConfig = (await import(configPath)).default;
  const themeDir = path.dirname(configPath);

  siteConfig.hooks = themeConfig.hooks;

  siteConfig.paths.assets = setSitePath(
    themeConfig.paths.assets,
    themeDir,
    "assets",
  );

  siteConfig.paths.layout = setSitePath(
    themeConfig.paths.layout,
    themeDir,
    "layout",
  );

  siteConfig.paths.defaultLayout = setSitePath(
    themeConfig.paths.defaultLayout,
    siteConfig.paths.layout,
    "index.ts",
  );

  siteConfig.uglyURLs = themeConfig.uglyURLs ?? siteConfig.uglyURLs;

  if (themeConfig.files) {
    siteConfig.files = themeConfig.files;

    if (SearchFilesType[siteConfig.files.type] === SearchFilesType.toc) {
      siteConfig.files.file = path.join(
        siteConfig.paths.content,
        siteConfig.files.file,
      );
    }
  }
}

function setSitePath(
  value: string,
  siteDir: string,
  defaultValue: string,
): string {
  if (value) {
    if (!path.isAbsolute(value)) {
      return path.join(siteDir, value);
    }

    return value;
  }

  return path.join(siteDir, defaultValue);
}

async function readSiteConfig(siteConfigPath: string): Promise<any, string> {
  if (!fs.existsSync(siteConfigPath)) {
    log.error(`Could not find config file ${siteConfigPath}`);
    Deno.exit(1);
  }

  const realSitePath = Deno.realPathSync(siteConfigPath);
  const siteDir = path.dirname(realSitePath);

  try {
    const siteConfig = (await import(realSitePath)).default;

    return { siteConfig, siteDir };
  } catch (error) {
    log.error(`Configuration file is malformed:`);
    log.error(error);
    Deno.exit(1);
  }
}

function validateConfig(paths: any) {
  if (!fs.existsSync(paths.content)) {
    log.error("error: content directory is missing");
  }

  if (!fs.existsSync(paths.assets)) {
    log.error("error: assets directory is missing");
  }

  if (!fs.existsSync(paths.layout)) {
    log.error("error: layout directory is missing");
  }
}
