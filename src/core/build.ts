import * as fs from 'https://deno.land/std@0.81.0/fs/mod.ts';
import * as path from 'https://deno.land/std@0.81.0/path/mod.ts';
import * as log from 'https://deno.land/std@0.81.0/log/mod.ts';
import { parseMarkdown } from 'https://deno.land/x/markdown_wasm@1.1.2/mod.ts';

/* import { Marked } from '../../marked/index.ts'; */
import { parseFrontMatter } from './front-matter.ts';
import { Page } from './page.ts';
import { Site } from './config.ts';
import * as utils from '../lib/utils.ts';

export { build };

/**
 * Main function for generating a static site.
 */
async function build(site: Site) {
  await clearOutput(site.paths.output);

  const { toc, pages } = getPages(site);
  await createSite(site, pages, toc);
  await copyAssets(site);

  if (site.flags.sitemap) {
    const xml = utils.generateSitemap(site, pages);
    await createSitemapFile(site, xml);
  }

  if (site.flags.robot) {
    const robotsTxt = utils.generateRobotsTxt(site);
    await createRobotsFile(site, robotsTxt);
  }
}

/**
 * Crawl directory to get all pages.
 */
function getPages(site: Site): { toc: any; pages: Page[] } {
  const pages: Page[] = [];

  let toc = {};
  for (const fileInfo of fs.walkSync(site.paths.content)) {
    if (fileInfo.isFile && fileInfo.path !== site.paths.toc) {
      const data = Deno.readTextFileSync(fileInfo.path);

      const { params, content } = parseFrontMatter(data);
      const parsedData = parseMarkdown(content);

      let link = path.relative(site.paths.content, fileInfo.name);
      link = path.join('/', path.dirname(link), path.basename(link, '.md'));
      const cleanedContent = content.replace(/^\s+|\s+$/g, '').replace('.', '');

      const page: Page = {
        name: path.basename(fileInfo.name),
        path: fileInfo.path,
        link,
        types: link.split('/'),
        numWords: cleanedContent.split(' ').length,
        params,
        htmlContent: parsedData,
        /* excerpt: utils.getExcerpt(cleanedContent, site.excerptionLength), */
        /* tokens: parsedData.tokens, */
      };

      pages.push(page);
    } else {
      // TODO: Parse toc and create json object
    }
  }

  return { toc, pages };
}

async function clearOutput(path: string) {
  if (fs.existsSync(path)) {
    await Deno.remove(path, { recursive: true });
  }
}

async function createSitemapFile(site: Site, xml: any) {
  await Deno.writeTextFile(site.paths.sitemap, xml);
}

async function createRobotsFile(site: Site, robotsTxt: string) {
  await Deno.writeTextFile(site.paths.robot, robotsTxt);
}

async function copyAssets(site: Site) {
  await fs.copy(
    site.paths.public,
    path.join(site.paths.output, path.basename(site.paths.public)),
  );
}

async function buildHtml(site: Site, page: Page, pages: Page[], opts: any) {
  // TODO: Skip toc file

  // Page has specified template
  if (typeof page.params.layout === 'string') {
    let templatePath = path.join(site.paths.template, page.params.layout);
    if (fs.existsSync(templatePath)) {
      convertToHtml(site, page, pages, templatePath, opts);
    } else {
      log.error(`Encountered error when processing file ${page.path}.
Could not find referenced layout: ${page.params.layout}
`);
    }
  } else {
    // Use default template
    if (
      typeof site.paths.defaultTemplate === 'string' &&
      fs.existsSync(site.paths.defaultTemplate)
    ) {
      convertToHtml(site, page, pages, site.paths.defaultTemplate, opts);
    } else {
      log.error(`Encountered error when processing file ${page.path}.
Since there was no layout specified, it tried to use the default template, but the default template ${site.paths.defaultTemplate}
does not exist.
`);
    }
  }
}

async function convertToHtml(
  site: Site,
  page: Page,
  pages: Page[],
  templatePath: string,
  opts: any,
) {
  const template = await import(templatePath);
  const htmlContent = await template.default(site, page, pages, opts);

  const pagePath = path.relative(site.paths.content, page.path);
  let outputPath: string;
  if (path.basename(pagePath) === 'index.md') {
    outputPath = path.join(
      site.paths.output,
      path.dirname(pagePath),
      'index.html',
    );
  } else {
    outputPath = path.join(
      site.paths.output,
      path.dirname(pagePath),
      path.basename(pagePath, '.md'),
      'index.html',
    );
  }

  await fs.ensureDir(path.dirname(outputPath));
  await Deno.writeTextFile(outputPath, htmlContent);
}

async function createSite(site: Site, pages: Page[], toc: any) {
  await fs.ensureDir(site.paths.output);

  if (site.hooks.beforeSite) {
    const beforeSite = await site.hooks.beforeSite(site, pages, { toc });
  }

  await Promise.all(
    pages.map(async (page: Page) => {
      if (site.hooks.beforePage) {
        const beforePage = await site.hooks.beforePage(site, page, pages, {
          toc,
        });
      }

      buildHtml(site, page, pages, { toc });

      if (site.hooks.afterPage) {
        const afterPage = await site.hooks.afterPage(site, page, pages, {
          toc,
        });
      }
    }),
  );

  if (site.hooks.afterSite) {
    const afterSite = await site.hooks.afterSite(site, pages, { toc });
  }
}
