import { fs, path, log, MarkdownIt } from "../../deps.ts";

/* import { Marked } from '../../marked/index.ts'; */
/* import { parseMarkdown } from 'https://deno.land/x/markdown_wasm@1.1.2/mod.ts'; */
import { parseToc, TocRender } from "../plugins/toc.ts";

import { parseFrontMatter } from "./front-matter.ts";
import print from "./print.ts";
import { Page } from "./page.ts";
import { Site, SearchFilesType } from "./config.ts";
import { clean } from "./utils.ts";

export { build };

const MD = MarkdownIt({
  html: true,
  linkify: true,
});

/**
 * Main function for generating a static site.
 */
async function build(site: Site) {
  log.info("Building");

  await clean(site.paths.output);
  const pages = getPages(site);
  await createSite(site, pages);
  await copyAssets(site);

  print.build(site, pages);
}

/**
 * Get all pages. */
function getPages(site: Site): Page[] {
  const pages: Page[] = [];

  switch (SearchFilesType[site.files.type]) {
    case SearchFilesType.toc:
      const { files, ast } = parseToc(site);
      const actualFiles = files.filter((f) => f.ref !== "");

      actualFiles.forEach((f: any, i: number) => {
        const filepath = path.join(site.paths.content, f.ref);
        const stat = Deno.statSync(filepath);
        const file = {
          name: filepath,
          path: filepath,
        };

        if (stat.isFile) {
          const { prevPage, nextPage } = getPageNav(i, actualFiles, site);

          // Render ToC for all pages since we need to highlight current page.
          const toc = TocRender(site, ast, file.name);
          const page = processPage(site, file, { toc, prevPage, nextPage });
          pages.push(page);
        }
      });
      break;
    case SearchFilesType.glob:
      for (const file of fs.expandGlobSync(
        path.join(site.paths.content, site.files.glob)
      )) {
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

function parseLink(site: Site, filename: string): string {
  let link = path.relative(site.paths.content, filename);
  link = path.join("/", path.dirname(link), path.basename(link, ".md"));

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
  const data = Deno.readTextFileSync(file.path);

  const { params, content } = parseFrontMatter(data);

  // TODO: Fix this, possibly fork markdown-it, so render returns parsed data as well.
  const parsedData = MD.render(content);
  let tokens = [];

  try {
    tokens = MD.parse(content);
  } catch (e) {}

  let link = path.relative(site.paths.content, file.path);
  link = path.join("/", path.dirname(link), path.basename(link, ".md"));

  const page: Page = {
    name: path.basename(file.name),
    path: file.path,
    link,
    params,
    htmlContent: parsedData,
    tokens,
    build: true,
    ...opts,
  };

  return page;
}

async function copyAssets(site: Site) {
  await fs.copy(
    site.paths.assets,
    path.join(site.paths.output, path.basename(site.paths.assets))
  );
}

async function buildHtml(site: Site, page: Page, pages: Page[], opts?: any) {
  // Page has specified layout
  if (typeof page.params.layout === "string") {
    let layoutPath = path.join(site.paths.layout, page.params.layout);
    if (fs.existsSync(layoutPath)) {
      convertToHtml(site, page, pages, layoutPath, opts);
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
      convertToHtml(site, page, pages, site.paths.defaultLayout, opts);
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
  opts: any
) {
  let layout = await import(layoutPath);
  const htmlContent = await layout.default(site, page, pages, opts);

  const pagePath = path.relative(site.paths.content, page.path);
  let outputPath: string;

  if (site.uglyURLs) {
    outputPath = path.join(
      site.paths.output,
      path.dirname(pagePath),
      path.basename(pagePath, ".md") + ".html"
    );
  } else if (path.basename(pagePath) === "index.md") {
    outputPath = path.join(
      site.paths.output,
      path.dirname(pagePath),
      "index.html"
    );
  } else {
    outputPath = path.join(
      site.paths.output,
      path.dirname(pagePath),
      path.basename(pagePath, ".md"),
      "index.html"
    );
  }

  await fs.ensureDir(path.dirname(outputPath));
  await Deno.writeTextFile(outputPath, htmlContent);
}

async function createSite(site: Site, pages: Page[]) {
  await fs.ensureDir(site.paths.output);

  const opts = {};

  await site.hooks.beforeSite(site, pages, opts);

  await Promise.all(
    pages.map(async (page: Page, i: number) => {
      await site.hooks.beforePage(site, page, i, pages, opts);

      if (page.build) {
        buildHtml(site, page, pages);
      }

      await site.hooks.afterPage(site, page, i, pages, opts);
    })
  );

  await site.hooks.afterSite(site, pages, opts);
}
