import * as path from "node:path";
import { promises as fsPromises } from "node:fs";
import { fs } from "./fs.ts";
import { log } from "./log.ts";
import { readSiteConfig, THEMES } from "./config.ts";

export { init };

async function init(mode: string, theme: string, themePath: string) {
  log.info("Init");

  const configPath = theme === "path" ? themePath : THEMES[theme];

  exitIfPathExists("./config.ts");

  const { siteConfig: config, siteDir } = await readSiteConfig(configPath);

  if (mode === "extend") {
    await extendSite(theme === "path" ? themePath : theme, config, siteDir);
  } else if (mode === "create") {
    await createSite(configPath);
  }

  successfulCreateMessage(configPath);
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
