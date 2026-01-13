import * as path from "node:path";
import { Site } from "../core/config.ts";

export { generateRobotsTxt };

function generateRobotsTxt(site: Site) {
  return `User-agent: *
Sitemap: ${site.url}/${path.basename(site.paths.sitemap || 'sitemap.xml')}
  `;
}
