import { fs, path, log } from '../../deps.ts';
import { readSiteConfig, THEMES } from './config.ts';

export { init };

async function init(mode: string, theme: string, themePath: string) {
  log.info('Init');

  const configPath = theme === 'path' ? themePath : THEMES[theme];

  exitIfPathExists('./config.ts');

  const { siteConfig: config, siteDir } = await readSiteConfig(configPath, {});

  if (mode === 'extend') {
    extendSite(theme === 'path' ? themePath : theme, config, siteDir);
  } else if (mode === 'create') {
    createSite(configPath);
  }

  successfulCreateMessage(configPath);
}

async function extendSite(theme: string, config: any, siteDir: string) {
  const site = `
export default {
  extends: '${theme}',

  params: ${JSON.stringify(config.params, null, 2)},
};`;

  await Deno.writeTextFile('config.ts', site);

  const contentPath = path.join(Deno.cwd(), 'content');

  exitIfPathExists(contentPath);

  await fs.copy(path.join(siteDir, 'content'), contentPath);

  const p = Deno.run({
    cmd: ['deno', 'fmt', 'config.ts', '--quiet'],
  });

  await p.status();
}

async function createSite(configPath: string) {
  const dirname = path.dirname(configPath);

  for await (const entry of fs.walk(dirname, { maxDepth: 1 })) {
    // Just ignore the first result from fs.walk, which is the root directory of dirname
    if (entry.path !== dirname) {
      const p = path.join(Deno.cwd(), entry.name);
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
    Deno.exit(1);
  }
}
