import { generateMetaTags } from "../../../src/core/meta.ts";
import type { Site } from "../../../src/core/config.ts";
import type { Page } from "../../../src/core/page.ts";

export default function (
  { rootUrl, site, page }: { rootUrl: string; site?: Site; page?: Page },
  content: string
) {
  const metaTags = site && page ? generateMetaTags(site, page) : "";
  const pageTitle = page?.params?.title || site?.params?.title || "";
  const viewTransitionAnimation = site?.params?.viewTransitionAnimation !== false;

  const noAnimationStyles = !viewTransitionAnimation
    ? `<style>::view-transition-old(root), ::view-transition-new(root) { animation: none; }</style>`
    : "";

  return `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <title>${pageTitle}</title>
        ${metaTags}

        <link rel="icon" href="${rootUrl}/assets/img/ico/favicon.ico" />
        <link rel="apple-touch-icon-precomposed" href="${rootUrl}/assets/img/ico/favicon.ico" />
        <meta name="msapplication-TileImage" content="${rootUrl}/assets/img/ico/favicon.ico" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />

        <link rel="stylesheet" type="text/css" href="${rootUrl}/assets/css/reset.css" />
        <link rel="stylesheet" type="text/css" href="${rootUrl}/assets/fonts/fonts.css" />
        <link rel="stylesheet" type="text/css" href="${rootUrl}/assets/css/style.css" />
        ${noAnimationStyles}
      </head>

      <body>
        <div class="book">
          ${content}
        </div>

        <script defer src="${rootUrl}/assets/js/index.js"></script>
        <script defer src="${rootUrl}/assets/js/prism.min.js"></script>
      </body>
    </html>
  `;
}
