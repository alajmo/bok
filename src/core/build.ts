import { configurePath } from '../lib/lib.ts';
import { parseFrontMatter } from '../lib/front-matter.ts';
import { validateConfig } from './validate.ts';
import { walkSync, ensureDir, writeFileStr, readFileStrSync } from 'https://deno.land/std/fs/mod.ts';
import { relative, join, dirname, basename } from 'https://deno.land/std/path/mod.ts';
import { Marked } from '../lib/src/index.ts';

export { build };

function build(sitePath: string, site: any) {
  const sitePaths = configurePath(sitePath, site);
  validateConfig(sitePaths);
  const pages = getPages(sitePaths);
  createSite(sitePath, site, pages);
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

async function buildHtml(sitePath, site, baseTemplate, page) {
  const templatePath = join(dirname(sitePath), site.template, page.params.layout);
  const template = await import(templatePath);
  const templateContent = template.default();

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
