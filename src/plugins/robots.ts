import * as path from "node:path";
import { Site } from "../core/config.ts";

export { generateRobotsTxt };

function generateRobotsTxt(site: Site): string {
  const baseUrl = site.url || site.params?.url;
  const sitemapFile = path.basename(site.paths.sitemap || "sitemap.xml");

  return `User-agent: *
Allow: /

Sitemap: ${baseUrl}/${sitemapFile}
`;
}
