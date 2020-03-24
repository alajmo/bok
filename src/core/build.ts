import { configurePath } from '../lib/lib.ts';
import { parseFrontMatter } from '../lib/front-matter.ts';
import { validateConfig } from './validate.ts';
import { walkSync, readFileStrSync } from 'https://deno.land/std/fs/mod.ts';
import { basename } from 'https://deno.land/std/path/mod.ts';
import { Marked } from '../lib/src/index.ts';

export { build };

function build(sitePath, site) {
  const sitePaths = configurePath(sitePath, site);
  validateConfig(sitePaths);
  const pages = getPages(sitePaths);
  createSite(pages);
}

function getPages(sitePaths) {
  const pages = [];
  for (const fileInfo of walkSync(sitePaths.content)) {
    if (fileInfo.info.isFile()) {
      const data = readFileStrSync(fileInfo.filename);
      const { params, content } = parseFrontMatter(data);
      const htmlContent = Marked.parse(content);

      pages.push({
        name: basename(fileInfo.filename),
        path: fileInfo.filename,
        params,
        htmlContent,
      });
    }
  }

  return pages;
}

async function buildHtml(page) {
  // USE: ensureFileSync
  // 1. Create file node.path
  // 2. Write template/base.html to node.path
  // 3. Parse node.content with marked and get html output
  // 4. Evaluate node.layout and write output to node.path inside <div id="root"></div>
}

function createSite(pages) {
  return Promises.all(pages.map(async page => buildHtml(page)));
}
