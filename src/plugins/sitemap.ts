import { Site } from "../core/config.ts";
import { Page } from "../core/page.ts";

export { generateSitemap };

interface SitemapEntry {
  loc: string;
  lastmod?: string;
  changefreq?: string;
  priority?: number;
}

function generateSitemap(site: Site, pages: Page[]): string {
  const baseUrl = site.url || site.params?.url;

  if (!baseUrl) {
    return "";
  }

  const sitemapDefaults = site.params?.sitemap || {};
  const defaultChangefreq = sitemapDefaults.changefreq || "monthly";
  const defaultPriority = sitemapDefaults.priority || 0.5;

  const entries: SitemapEntry[] = pages
    .filter((page) => !page.params?.draft && !page.params?.archived && page.link !== "/404")
    .map((page) => {
      let loc: string;

      if (page.link === "/" || page.link === "/index") {
        loc = site.uglyURLs ? `${baseUrl}/index.html` : `${baseUrl}/`;
      } else {
        const link = page.link.startsWith("/") ? page.link.slice(1) : page.link;
        loc = site.uglyURLs ? `${baseUrl}/${link}.html` : `${baseUrl}/${link}/`;
      }

      const lastmod = page.params?.lastmod
        ? new Date(page.params.lastmod).toISOString()
        : page.lastmod?.toISOString();

      const isPost = !!page.params?.date;
      const changefreq = page.params?.changefreq || (isPost ? "never" : defaultChangefreq);
      const priority = page.params?.priority ?? defaultPriority;

      return { loc, lastmod, changefreq, priority };
    });

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries.map((entry) => `  <url>
    <loc>${entry.loc}</loc>${entry.lastmod ? `
    <lastmod>${entry.lastmod}</lastmod>` : ""}
    <changefreq>${entry.changefreq}</changefreq>
    <priority>${entry.priority}</priority>
  </url>`).join("\n")}
</urlset>
`;

  return xml;
}
