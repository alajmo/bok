import type { Site } from "../../src/core/config.ts";
import type { Page } from "../../src/core/page.ts";
import { writeFile } from "node:fs/promises";
import { join } from "node:path";

interface SearchEntry {
  title: string;
  link: string;
  headings: { text: string; id: string }[];
  content: string;
}

function stripHtml(html: string): string {
  return html
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, "")
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, "")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, " ")
    .trim();
}

function extractHeadings(tokens: any[]): { text: string; id: string }[] {
  const headings: { text: string; id: string }[] = [];

  for (let i = 0; i < tokens.length; i++) {
    const token = tokens[i];
    if (token.type === "heading_open" && (token.tag === "h2" || token.tag === "h3")) {
      const nextToken = tokens[i + 1];
      if (nextToken && nextToken.type === "inline") {
        const id = token.attrGet?.("id") || nextToken.content.toLowerCase().replace(/\s+/g, "-").replace(/[^\w-]/g, "");
        headings.push({
          text: nextToken.content,
          id: id,
        });
      }
    }
  }

  return headings;
}

function extractFirstH1(tokens: any[]): string | null {
  for (let i = 0; i < tokens.length; i++) {
    const token = tokens[i];
    if (token.type === "heading_open" && token.tag === "h1") {
      const nextToken = tokens[i + 1];
      if (nextToken && nextToken.type === "inline") {
        return nextToken.content;
      }
    }
  }
  return null;
}

export default {
  name: "book",

  files: {
    type: "toc",
    file: "toc.md",
  },

  paths: {
    assets: "assets",
    layout: "layout",
    defaultLayout: "index.ts",
  },

  serve: {
    reload: true,
    port: 5000,
    wsPort: 5001,
  },

  hooks: {
    async beforeSite(_site: Site, _pages: Page[], _opts: any) {},
    async afterSite(site: Site, pages: Page[], _opts: any) {
      const searchIndex: SearchEntry[] = [];

      for (const page of pages) {
        if (!page.build) continue;

        const title = page.params?.title || extractFirstH1(page.tokens || []) || page.name;
        const headings = extractHeadings(page.tokens || []);
        const plainText = stripHtml(page.htmlContent || "");
        const content = plainText.slice(0, 2000);

        searchIndex.push({
          title,
          link: page.link,
          headings,
          content,
        });
      }

      const outputPath = join(site.paths.output, "search-index.json");
      await writeFile(outputPath, JSON.stringify(searchIndex, null, 2));
    },
    async beforePage(_site: Site, _page: Page, _i: number, _pages: Page[], _opts: any) {},
    async afterPage(_site: Site, _page: Page, _i: number, _pages: Page[], _opts: any) {},
  },

  params: {
    title: "book",
    viewTransitionAnimation: false,
    rightToc: {
      enabled: true,
      title: "On this page",
      minHeadings: 2,
      levels: [2, 3],
    },
  },
};
