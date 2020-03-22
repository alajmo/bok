import { configurePath } from '../lib/lib.ts';
import { validateConfig, validateContent } from './validate.ts';
import {
  walkSync,
  emptyDir,
  emptyDirSync,
  readFileStrSync,
} from 'https://deno.land/std/fs/mod.ts';
import { basename } from 'https://deno.land/std/path/mod.ts';
import { parse } from 'https://deno.land/std/encoding/yaml.ts';
import { Marked } from '../lib/src/index.ts';

console.log();

export { build };

function build(sitePath, site) {
  const sitePaths = configurePath(sitePath, site);
  validateConfig(sitePaths);
  const content = getContent(sitePaths);
  /* validateContent(contentTree) */
  /* copyAssets(assets) */
  /* buildCss(site) */
  /* createSite(contentTree); */
}

function getContent(sitePaths) {
  const content = [];
  for (const fileInfo of walkSync(sitePaths.content)) {
    if (fileInfo.info.isFile()) {
      const data = readFileStrSync(fileInfo.filename);
      console.log(data);
      // TODO: Parse yaml
      /* const fileData = parse(data); */
      /* console.log(fileData); */

      /* content.push({ */
      /*   name: basename(fileInfo.filename), */
      /*   path: fileInfo.filename, */
      /*   attr: { */
      /*     layout: 'post.ts', // fileData.layout */
      /*     name: 'lala', // fileData.title */
      /*     draft: false, // fileData.draft */
      /*     content: '## Lala World', // fileData.content */
      /*   }, */
      /* }); */
    }
  }

  return content;
}

function copyAssets() {}

function buildCss() {}

function buildPage(node) {
  // USE: ensureFileSync
  // 1. Create file node.path
  // 2. Write template/base.html to node.path
  // 3. Parse node.content with marked and get html output
  // 4. Evaluate node.layout and write output to node.path inside <div id="root"></div>
}

function validatePage(node) {
  // 1. Find dead links
  // 2. Find unused css
}

function createSite(contentTree) {
  // Loop through entries in contentTree and build a index.html page for each node
  /* contentTree.forEach((node => {
     buildPage()
     validatePage()
     })) */
}
