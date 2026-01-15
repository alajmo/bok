import type { Site } from "../../../src/core/config.ts";
import type { Page } from "../../../src/core/page.ts";
import base from "./base.ts";

export default function (site: Site, page: Page, _pages: Page[]) {
  return base(
    site,
    `
      <h1>Main Header</h2>
      <div>
        ${page.htmlContent}
      </div>
    `,
    page,
  );
}
