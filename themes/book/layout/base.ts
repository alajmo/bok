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

      <body data-root-url="${rootUrl}">
        <div class="book">
          ${content}
        </div>

        <div id="search-modal" class="search-modal hidden">
          <div class="search-backdrop" onclick="closeSearch();"></div>
          <div class="search-dialog">
            <div class="search-input-wrapper">
              <svg class="search-input-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="11" cy="11" r="8"/>
                <path d="M21 21l-4.35-4.35"/>
              </svg>
              <input type="text" id="search-input" class="search-input" placeholder="Search..." autocomplete="off" />
            </div>
            <div id="search-results" class="search-results"></div>
            <div class="search-footer">
              <span class="search-hint"><kbd>↑</kbd><kbd>↓</kbd> navigate</span>
              <span class="search-hint"><kbd>Enter</kbd> select</span>
              <span class="search-hint"><kbd>Esc</kbd> close</span>
            </div>
          </div>
        </div>

        <script defer src="${rootUrl}/assets/js/index.js"></script>
        <script defer src="${rootUrl}/assets/js/prism.min.js"></script>
      </body>
    </html>
  `;
}
