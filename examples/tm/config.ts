import type { Site } from "../../src/core/config.ts";
import type { Page } from "../../src/core/page.ts";

export default {
  name: "basic",
  files: {
    type: "walk",
  },

  paths: {
    assets: "assets",
    layout: "layout",
    defaultLayout: "index.ts",
  },

  serve: {
    reload: true,
    port: 5000,
    wsPort: 5001,
  },

  hooks: {
    async beforeSite(_site: Site, _pages: Page[], _opts: any) {},

    async afterSite(_site: Site, _pages: Page[], _opts: any) {},

    async beforePage(_site: Site, _page: Page, _pages: Page[], _opts: any) {},

    async afterPage(_site: Site, _page: Page, _pages: Page[], _opts: any) {},
  },

  params: {},
};
