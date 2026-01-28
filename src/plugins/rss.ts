import { Site } from "../core/config.ts";
import { Page } from "../core/page.ts";

export { generateRssFeed };

function generateRssFeed(site: Site, pages: Page[]): string {
  const baseUrl = site.url || site.params?.url;

  if (!baseUrl) {
    return "";
  }

  const title = site.params?.title || "RSS Feed";
  const description = site.params?.description || "";
  const language = site.params?.language || "en";
  const buildDate = new Date().toUTCString();

  const items = pages
    .filter((page) => !page.params?.draft && !page.params?.archived && page.link !== "/404")
    .map((page) => {
      const pageUrl = buildPageUrl(baseUrl, page.link, site.uglyURLs);
      const pageTitle = page.params?.title || page.name.replace(".md", "");
      const pageDescription = page.params?.description || extractDescription(page);
      const dateStr = page.params?.date || page.params?.created;
      const pubDate = dateStr ? new Date(dateStr).toUTCString() : buildDate;

      return {
        xml: `    <item>
      <title><![CDATA[${pageTitle}]]></title>
      <link>${pageUrl}</link>
      <guid>${pageUrl}</guid>
      <description><![CDATA[${pageDescription}]]></description>
      <pubDate>${pubDate}</pubDate>
    </item>`,
        date: dateStr ? new Date(dateStr).getTime() : 0,
      };
    })
    .sort((a, b) => b.date - a.date)
    .map((item) => item.xml);

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title><![CDATA[${title}]]></title>
    <link>${baseUrl}</link>
    <description><![CDATA[${description}]]></description>
    <language>${language}</language>
    <lastBuildDate>${buildDate}</lastBuildDate>
    <atom:link href="${baseUrl}/feed.xml" rel="self" type="application/rss+xml"/>
${items.join("\n")}
  </channel>
</rss>
`;
}

function buildPageUrl(baseUrl: string, link: string, uglyURLs?: boolean): string {
  if (link === "/" || link === "/index") {
    return uglyURLs ? `${baseUrl}/index.html` : `${baseUrl}/`;
  }

  const cleanLink = link.startsWith("/") ? link.slice(1) : link;

  if (uglyURLs) {
    return `${baseUrl}/${cleanLink}.html`;
  }

  return `${baseUrl}/${cleanLink}/`;
}

function extractDescription(page: Page): string {
  for (const token of page.tokens) {
    if (token.type === "paragraph_open") {
      const index = page.tokens.indexOf(token);
      const inlineToken = page.tokens[index + 1];
      if (inlineToken?.type === "inline" && inlineToken.content) {
        const text = inlineToken.content.slice(0, 200);
        return text.length < inlineToken.content.length ? text + "..." : text;
      }
    }
  }
  return "";
}
