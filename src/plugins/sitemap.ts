import { Site } from '../core/config.ts';
import { Page } from '../core/page.ts';

export { generateSitemap };

function generateSitemap(site: Site, pages: Page[]): string {
  const urls = pages.map(p =>
    p.link === '/index'
      ? `${site.url}/index.html`
      : `${site.url}/${p.link}/index.html`,
  );

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${urls
    .map(
      url =>
        `
<url>
  <loc>${url}</loc>
</url>
`,
    )
    .join('')}
</urlset>
  `;

  return xml;
}
