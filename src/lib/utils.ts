import { basename } from 'https://deno.land/std/path/mod.ts';
export { exists, getExcerpt, generateSitemap, generateRobotsTxt };

async function exists(filePath: string): Promise<boolean> {
  return Deno.lstat(filePath)
    .then((): boolean => true)
    .catch((): boolean => false);
}

function getExcerpt(text: string, excerptionLength: number) {
  const words = text.substring(0, excerptionLength + 1).split(' ');
  return `${words.splice(0, words.length - 1).join(' ')}...`.replace(/\*/g, '');
}

function generateSitemap(site, paths, pages) {
  const urls = pages.map(p =>
    p.link === 'index'
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

function generateRobotsTxt(site, paths) {
  return `User-agent: *
Sitemap: ${site.url}/${basename(paths.sitemap)}
  `;
}
