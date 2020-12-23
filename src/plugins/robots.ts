export { generateRobotsTxt };

function generateRobotsTxt(site: Site) {
  return `User-agent: *
Sitemap: ${site.url}/${path.basename(site.paths.sitemap)}
  `;
}
