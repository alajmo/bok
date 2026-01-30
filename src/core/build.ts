import * as path from "node:path";
import { promises as fsPromises } from "node:fs";
import MarkdownIt from "markdown-it";
import MarkdownItAnchor from "markdown-it-anchor";
import { fs } from "./fs.ts";
import { log } from "./log.ts";

import { parseToc, TocRender } from "../plugins/toc.ts";
import { generateSitemap } from "../plugins/sitemap.ts";
import { generateRobotsTxt } from "../plugins/robots.ts";
import { generateRssFeed } from "../plugins/rss.ts";

import { parseFrontMatter } from "./front-matter.ts";
import print from "./print.ts";
import { Page } from "./page.ts";
import { SearchFilesType, Site } from "./config.ts";
import { clean } from "./utils.ts";

export { build };

const MD = MarkdownIt({
  html: true,
  linkify: true,
}).use(MarkdownItAnchor, {
  permalink: MarkdownItAnchor.permalink.linkInsideHeader({
    symbol: "#",
    placement: "before",
    class: "header-anchor",
  }),
});

interface RightTocConfig {
  enabled?: boolean;
  title?: string;
  minHeadings?: number;
  levels?: number[];
}

const defaultRightTocConfig: RightTocConfig = {
  enabled: true,
  title: "On this page",
  minHeadings: 2,
  levels: [2, 3, 4, 5, 6],
};

function generateRightToc(tokens: any[], config: RightTocConfig): string {
  const cfg = { ...defaultRightTocConfig, ...config };

  if (!cfg.enabled) {
    return "";
  }

  const headings: { level: number; text: string; id: string }[] = [];

  for (let i = 0; i < tokens.length; i++) {
    const token = tokens[i];
    if (token.type === "heading_open") {
      const level = parseInt(token.tag.slice(1), 10);
      if (cfg.levels!.includes(level)) {
        const id = token.attrGet("id") || "";
        const inlineToken = tokens[i + 1];
        const text = (inlineToken?.children
          ?.filter((t: any) => t.type === "text" || t.type === "code_inline")
          .map((t: any) => t.content)
          .join("") || "").trim();

        if (text && id) {
          headings.push({ level, text, id });
        }
      }
    }
  }

  if (headings.length < cfg.minHeadings!) {
    return "";
  }

  const minLevel = Math.min(...headings.map((h) => h.level));

  let html = `<nav class="right-toc-nav">
    <h4 class="right-toc-title">${cfg.title}</h4>
    <ul class="right-toc-list">`;

  for (const heading of headings) {
    const indent = heading.level - minLevel;
    const indentClass = indent > 0 ? ` class="right-toc-indent-${indent}"` : "";
    html += `<li${indentClass}><a href="#${heading.id}">${heading.text}</a></li>`;
  }

  html += `</ul></nav>`;

  return html;
}

/**
 * Main function for generating a static site.
 */
async function build(site: Site) {
  log.info("Building");

  await clean(site.paths.output);
  const pages = getPages(site);
  await createSite(site, pages);
  await copyAssets(site);
  await generateSiteFiles(site, pages);

  print.build(site, pages);
}

/**
 * Generate sitemap.xml, robots.txt, feed.xml, and print.html.
 */
async function generateSiteFiles(site: Site, pages: Page[]) {
  await generatePrintPage(site, pages);

  const baseUrl = site.url || site.params?.url;

  if (!baseUrl) {
    return;
  }

  const sitemap = generateSitemap(site, pages);
  if (sitemap) {
    const sitemapPath = site.paths.sitemap
      ? path.join(site.paths.output, site.paths.sitemap)
      : path.join(site.paths.output, "sitemap.xml");
    await fsPromises.writeFile(sitemapPath, sitemap);
    log.info(`Generated ${path.basename(sitemapPath)}`);
  }

  const robotsTxt = generateRobotsTxt(site);
  await fsPromises.writeFile(path.join(site.paths.output, "robots.txt"), robotsTxt);
  log.info("Generated robots.txt");

  const rssFeed = generateRssFeed(site, pages);
  if (rssFeed) {
    await fsPromises.writeFile(path.join(site.paths.output, "feed.xml"), rssFeed);
    log.info("Generated feed.xml");
  }
}

/**
 * Generate a combined print page with all content.
 */
async function generatePrintPage(site: Site, pages: Page[]) {
  const printLayoutPath = path.join(site.paths.layout, "print.ts");
  if (!fs.existsSync(printLayoutPath)) {
    return;
  }

  const printLayout = await import(printLayoutPath);
  const printHtml = printLayout.default(site, pages);
  const printPath = path.join(site.paths.output, "print.html");
  await fsPromises.writeFile(printPath, printHtml);
  log.info("Generated print.html");
}

/**
 * Get all pages. */
function getPages(site: Site): Page[] {
  const pages: Page[] = [];

  switch (site.files.type) {
    case SearchFilesType.toc:
      const { files, ast } = parseToc(site);
      const actualFiles = files.filter((f: any) => f.ref !== "");

      actualFiles.forEach((f: any, i: number) => {
        const filepath = path.join(site.paths.content, f.ref);
        const stat = fs.statSync(filepath);
        const file = {
          name: filepath,
          path: filepath,
        };

        if (stat.isFile()) {
          const { prevPage, nextPage } = getPageNav(i, actualFiles, site);

          // Render ToC for all pages since we need to highlight current page.
          const toc = TocRender(site, ast, file.name);
          const page = processPage(site, file, { toc, prevPage, nextPage });
          pages.push(page);
        }
      });
      break;
    case SearchFilesType.glob:
      for (
        const file of fs.expandGlobSync(
          path.join(site.paths.content, site.files.glob!),
        )
      ) {
        if (file.isFile) {
          const page = processPage(site, file);
          pages.push(page);
        }
      }

      break;
    default:
      for (const file of fs.walkSync(site.paths.content)) {
        if (file.isFile) {
          const page = processPage(site, file);
          pages.push(page);
        }
      }
  }

  return pages;
}

function parseLink(site: Site, filepath: string): string {
  let link = path.join("/", path.dirname(filepath), path.basename(filepath, ".md"));

  if (site.uglyURLs) {
    link += ".html";
  }

  // We treat /index as /
  return link === "/index" ? "/" : link;
}

function getPageNav(i: number, files: any, site: Site) {
  return {
    prevPage: i === 0 ? null : parseLink(site, files[i - 1].ref),
    nextPage: i === files.length - 1 ? null : parseLink(site, files[i + 1].ref),
  };
}

function processPage(site: Site, file: any, opts?: any) {
  const data = fs.readFileSync(file.path, 'utf-8');
  const stat = fs.statSync(file.path);

  const { params, content } = parseFrontMatter(data);

  // TODO: Fix this, possibly fork markdown-it, so render returns parsed data as well.
  const parsedData = MD.render(content);
  let tokens: any[] = [];

  try {
    tokens = MD.parse(content, {});
  } catch (e) {}

  let link = path.relative(site.paths.content, file.path);
  link = path.join("/", path.dirname(link), path.basename(link, ".md"));

  const rightTocConfig = site.params?.rightToc || {};
  const rightToc = generateRightToc(tokens, rightTocConfig);

  const page: Page = {
    name: path.basename(file.name),
    path: file.path,
    link,
    params,
    htmlContent: parsedData,
    tokens,
    build: true,
    rightToc,
    lastmod: stat.mtime,
    ...opts,
  };

  return page;
}

async function copyAssets(site: Site) {
  await fs.copy(
    site.paths.assets,
    path.join(site.paths.output, path.basename(site.paths.assets)),
  );

  await Promise.all(site.paths.public.map(async (dir: string) => {
    await fs.copy(
      dir,
      path.join(site.paths.output, path.basename(dir)),
    );
  }));
}

async function buildHtml(site: Site, page: Page, pages: Page[], opts?: any) {
  // Page has specified layout
  if (typeof page.params.layout === "string") {
    let layoutPath = path.join(site.paths.layout, page.params.layout);
    if (fs.existsSync(layoutPath)) {
      await convertToHtml(site, page, pages, layoutPath, opts);
    } else {
      log.error(`Encountered error when processing file ${page.path}.
Could not find referenced layout: ${page.params.layout}
`);
    }
  } else {
    // Use default layout
    if (
      typeof site.paths.defaultLayout === "string" &&
      fs.existsSync(site.paths.defaultLayout)
    ) {
      await convertToHtml(site, page, pages, site.paths.defaultLayout, opts);
    } else {
      log.error(`Encountered error when processing file ${page.path}.
Since there was no layout specified, it tried to use the default layout, but the default layout ${site.paths.defaultLayout}
does not exist.
`);
    }
  }
}

async function convertToHtml(
  site: Site,
  page: Page,
  pages: Page[],
  layoutPath: string,
  opts: any,
) {
  let layout = await import(layoutPath);
  const htmlContent = await layout.default(site, page, pages, opts);

  const pagePath = path.relative(site.paths.content, page.path);
  let outputPath: string;

  if (site.uglyURLs) {
    outputPath = path.join(
      site.paths.output,
      path.dirname(pagePath),
      path.basename(pagePath, ".md") + ".html",
    );
  } else if (path.basename(pagePath) === "index.md") {
    outputPath = path.join(
      site.paths.output,
      path.dirname(pagePath),
      "index.html",
    );
  } else {
    outputPath = path.join(
      site.paths.output,
      path.dirname(pagePath),
      path.basename(pagePath, ".md"),
      "index.html",
    );
  }

  await fs.ensureDir(path.dirname(outputPath));
  await fsPromises.writeFile(outputPath, htmlContent);
}

async function createSite(site: Site, pages: Page[]) {
  await fs.ensureDir(site.paths.output);

  const opts = {};

  await site.hooks.beforeSite(site, pages, opts);

  await Promise.all(
    pages.map(async (page: Page, i: number) => {
      await site.hooks.beforePage(site, page, i, pages, opts);

      if (page.build) {
        await buildHtml(site, page, pages);
      }

      await site.hooks.afterPage(site, page, i, pages, opts);
    }),
  );

  await site.hooks.afterSite(site, pages, opts);
}
