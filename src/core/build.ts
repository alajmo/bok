import { parseFrontMatter } from '../lib/front-matter.ts';
import { validateConfig } from './validate.ts';
import { copy, walkSync, ensureDir, writeFileStr, readFileStrSync } from 'https://deno.land/std/fs/mod.ts';
import { relative, join, dirname, basename } from 'https://deno.land/std/path/mod.ts';
import { Marked } from '../lib/src/index.ts';

export { build };

async function build(sitePath: string, site: any, paths: string[]) {
  validateConfig(sitePaths);
  const pages = getPages(sitePaths);

  await clearOutput(sitePath, site);
  await createSite(sitePath, site, pages);
  await copyAssets(sitePath, site);
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

async function clearOutput(sitePath, site) {
  await Deno.remove(join(dirname(sitePath), site.output), { recursive: true });
}

async function copyAssets(sitePath, site) {
  await copy(join(dirname(sitePath), site.public), join(dirname(sitePath), site.output, site.public));
}

async function buildHtml(sitePath, site, baseTemplate, page) {
  const templatePath = join(dirname(sitePath), site.template, page.params.layout);
  const template = await import(templatePath);
  const templateContent = template.default(page.htmlContent);

  const pagePath = relative(join(dirname(sitePath), site.content), page.path);
  const outputPath = join(dirname(sitePath), site.output, dirname(pagePath), 'index.html')
  const pageHtml = baseTemplate(templateContent);

  await ensureDir(dirname(outputPath));
  await writeFileStr(outputPath, pageHtml);
}

async function createSite(sitePath, site, pages) {
  const baseTemplatePath = join(dirname(sitePath), site.template, 'base.ts');
  const baseTemplate = await import(baseTemplatePath);

  return Promise.all(
    pages.map(async page => buildHtml(sitePath, site, baseTemplate.default, page)),
  );
}
