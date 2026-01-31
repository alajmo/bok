import * as path from "node:path";
import { promises as fsPromises } from "node:fs";
import { fs } from "./fs.ts";
import { log } from "./log.ts";
import { readSiteConfig, BUILTIN_THEMES } from "./config.ts";
import {
  isBuiltinTheme,
  builtinConfigs,
  extractBuiltinContent,
} from "../themes/registry.ts";

export { init };

async function init(mode: string, theme: string, themePath: string) {
  log.info("Init");

  exitIfPathExists("./config.ts");

  if (theme === "path") {
    // Custom theme path
    const configPath = themePath;
    const { siteConfig: config, siteDir } = await readSiteConfig(configPath);

    if (mode === "extend") {
      await extendSite(themePath, config, siteDir);
    } else if (mode === "create") {
      await createSite(configPath);
    }

    successfulCreateMessage(configPath);
  } else if (isBuiltinTheme(theme)) {
    // Built-in theme
    const config = builtinConfigs[theme];

    if (mode === "extend") {
      await extendSiteBuiltin(theme, config);
    } else if (mode === "create") {
      await createSiteBuiltin(theme, config);
    }

    successfulCreateMessage(theme);
  } else {
    log.error(`Unknown theme: ${theme}`);
    process.exit(1);
  }
}

async function extendSiteBuiltin(theme: string, config: any) {
  const site = `
export default {
  extends: '${theme}',

  params: ${JSON.stringify(config.params, null, 2)},
};`;

  await fsPromises.writeFile("config.ts", site);

  const contentPath = path.join(process.cwd(), "content");
  exitIfPathExists(contentPath);

  await extractBuiltinContent(theme, contentPath);

  // Format the config file using Bun
  const proc = Bun.spawn(["bun", "x", "prettier", "--write", "config.ts"], {
    stdout: "ignore",
    stderr: "ignore",
  });
  await proc.exited;
}

async function createSiteBuiltin(theme: string, config: any) {
  // For create mode with built-in themes, write config + extract content + extract assets
  const site = `
export default {
  params: ${JSON.stringify(config.params, null, 2)},

  paths: {
    assets: 'assets',
    layout: 'layout',
    defaultLayout: 'index.ts',
  },
};`;

  await fsPromises.writeFile("config.ts", site);

  const contentPath = path.join(process.cwd(), "content");
  exitIfPathExists(contentPath);
  await extractBuiltinContent(theme, contentPath);

  // Format the config file using Bun
  const proc = Bun.spawn(["bun", "x", "prettier", "--write", "config.ts"], {
    stdout: "ignore",
    stderr: "ignore",
  });
  await proc.exited;
}

async function extendSite(theme: string, config: any, siteDir: string) {
  const site = `
export default {
  extends: '${theme}',

  params: ${JSON.stringify(config.params, null, 2)},
};`;

  await fsPromises.writeFile("config.ts", site);

  const contentPath = path.join(process.cwd(), "content");

  exitIfPathExists(contentPath);

  await fs.copy(path.join(siteDir, "content"), contentPath);

  // Format the config file using Bun
  const proc = Bun.spawn(["bun", "x", "prettier", "--write", "config.ts"], {
    stdout: "ignore",
    stderr: "ignore",
  });

  await proc.exited;
}

async function createSite(configPath: string) {
  const dirname = path.dirname(configPath);

  for (const entry of fs.walkSync(dirname, { maxDepth: 1 })) {
    // Just ignore the first result from fs.walk, which is the root directory of dirname
    if (entry.path !== dirname) {
      const p = path.join(process.cwd(), entry.name);
      exitIfPathExists(p);
      await fs.copy(entry.path, p);
    }
  }
}

function successfulCreateMessage(configPath: string) {
  console.log(`
Your new bok site is created in ${configPath}!

Visit https://github.com/alajmo/docs for quickstart guide and full documentation.
`);
}

function exitIfPathExists(p: string) {
  if (fs.existsSync(p)) {
    log.error(`
It seems ${p} already exists in the current directory.
Remove it or choose a different directory to initialize a new site in.`);
    process.exit(1);
  }
}
