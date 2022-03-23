export default {
  name: 'basic',
  files: {
    type: 'walk',
  },

  paths: {
    assets: 'assets',
    layout: 'layout',
    defaultLayout: 'index.ts',
  },

  serve: {
    reload: true,
    port: 5000,
    wsPort: 5001,
  },

  hooks: {
    async beforeSite(site, pages, opts) {},

    async afterSite(site, pages, opts) {},

    async beforePage(site, page, pages, opts) {},

    async afterPage(site, page, pages, opts) {},
  },

  params: {},
};
