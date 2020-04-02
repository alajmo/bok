import { parseFrontMatter } from '../lib/front-matter.ts';
import { validateConfig } from './validate.ts';
import { existsSync, copy, walkSync, ensureDir, writeFileStr, readFileStrSync } from 'https://deno.land/std/fs/mod.ts';
import { relative, join, dirname, basename } from 'https://deno.land/std/path/mod.ts';
import { Marked } from '../../marked/index.ts';
import { getExcerpt, generateSitemap, generateRobotsTxt } from '../lib/utils.ts';

export { build };

async function build(site: any, paths: any) {
  validateConfig(paths);
  const pages = getPages(site, paths);

  await clearOutput(paths.output);
  await createSite(site, paths, pages);
  await copyAssets(site, paths);
  const xml = generateSitemap(site, paths, pages);
  await createSitemapFile(xml, paths);
  const robotsTxt = generateRobotsTxt(site, paths);
  await createRobotsFile(robotsTxt, paths);
}

function getPages(site: any, paths: any) {
  const pages = [];
  for (const fileInfo of walkSync(paths.content)) {
    if (fileInfo.info.isFile()) {
      const data = readFileStrSync(fileInfo.filename);
      const { params, content } = parseFrontMatter(data);
      const htmlContent = Marked.parse(content);

      let link = relative(paths.content, fileInfo.filename);
      link = join('/', dirname(link), basename(link, '.md'));
      const cleanedContent = content.replace(/^\s+|\s+$/g, '').replace('.', '');

      pages.push({
        name: basename(fileInfo.filename),
        path: fileInfo.filename,
        link,
        types: link.split('/'),
        excerpt: getExcerpt(cleanedContent, site.excerptionLength),
        numWords: cleanedContent.split(' ').length,
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

async function createSitemapFile(xml, paths) {
  await writeFileStr(paths.sitemap, xml);
}

async function createRobotsFile(robotsTxt, paths) {
  await writeFileStr(paths.robot, robotsTxt);
}

async function copyAssets(site, paths) {
  await copy(paths.public, join(paths.output, basename(paths.public)));
}

async function buildHtml(site, paths, baseTemplate, page, pages) {
  const templatePath = join(paths.template, page.params.layout);
  const template = await import(templatePath);
  const templateContent = template.default(site, page, pages);

  const pagePath = relative(paths.content, page.path);

  let outputPath;
  if (basename(pagePath) === 'index.md') {
    outputPath = join(paths.output, dirname(pagePath), 'index.html')
  } else {
    outputPath = join(paths.output, dirname(pagePath), basename(pagePath, '.md'), 'index.html');
  }

  const pageHtml = baseTemplate(templateContent);

  await ensureDir(dirname(outputPath));
  await writeFileStr(outputPath, pageHtml);
}

async function createSite(site, paths, pages) {
  await ensureDir(paths.output);

  const baseTemplatePath = join(paths.template, 'base.ts');
  const baseTemplate = await import(baseTemplatePath);

  return Promise.all(
    pages.map(async page => buildHtml(site, paths, baseTemplate.default, page, pages)),
  );
}
