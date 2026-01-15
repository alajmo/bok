import { generateMetaTags } from "../../../src/core/meta.ts";
import type { Site } from "../../../src/core/config.ts";
import type { Page } from "../../../src/core/page.ts";

export default function (site: Site, content: string, page?: Page) {
  const metaTags = page
    ? generateMetaTags(site, page)
    : `<meta name="description" content="${site.params.description}">`;
  const pageTitle = page?.params?.title || site.params.title;

  return `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        ${metaTags}
        <meta name="author" content="${site.params.author}">

        <title>${pageTitle}</title>

        <meta name="viewport" content="width=device-width, initial-scale=1" />

        <link rel="stylesheet" type="text/css" href="/assets/css/style.css" />
      </head>

      <body>
        ${content}
        <script defer src="/assets/js/index.js"></script>
      </body>
    </html>
  `;
}
