import { parseFrontMatter } from '../lib/front-matter.ts';
import { validateConfig } from './validate.ts';
import { existsSync, copy, walkSync, ensureDir, writeFileStr, readFileStrSync } from 'https://deno.land/std/fs/mod.ts';
import { relative, join, dirname, basename } from 'https://deno.land/std/path/mod.ts';
import { Marked } from '../../marked/index.ts';

export { build };

async function build(site: any, paths: any) {
  validateConfig(paths);
  const pages = getPages(site, paths);

  await clearOutput(paths.output);
  await createSite(site, paths, pages);
  await copyAssets(site, paths);
}

function getPages(site: any, paths: any) {
  const pages = [];
  for (const fileInfo of walkSync(paths.content)) {
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

async function clearOutput(path) {
  if (existsSync(path)) {
    await Deno.remove(path, { recursive: true });
  }
}

async function copyAssets(site, paths) {
  await copy(paths.public, join(paths.output, basename(paths.public)));
}

async function buildHtml(site, paths, baseTemplate, page) {
  const templatePath = join(paths.template, page.params.layout);
  const template = await import(templatePath);
  const templateContent = template.default(site, page);

  const pagePath = relative(paths.content, page.path);
  const outputPath = join(paths.output, dirname(pagePath), 'index.html')
  const pageHtml = baseTemplate(templateContent);

  await ensureDir(dirname(outputPath));
  await writeFileStr(outputPath, pageHtml);
}

async function createSite(site, paths, pages) {
  await ensureDir(paths.output);

  const baseTemplatePath = join(paths.template, 'base.ts');
  const baseTemplate = await import(baseTemplatePath);

  return Promise.all(
    pages.map(async page => buildHtml(site, paths, baseTemplate.default, page)),
  );
}
