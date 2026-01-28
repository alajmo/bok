import type { Site } from "../../../src/core/config.ts";
import type { Page } from "../../../src/core/page.ts";
import base from "./base.ts";

export default function (site: Site, pages: Page[]) {
  const allContent = pages
    .map((page) => {
      const title = page.params?.title || page.name;
      return `
        <article class="print-chapter">
          <h1>${title}</h1>
          ${page.htmlContent}
        </article>
      `;
    })
    .join('<hr class="print-break">');

  return base({ rootUrl: site.rootUrl, site }, `
    <main class="print-content">
      ${allContent}
    </main>
  `);
}
