export default {
  files: {
    type: 'toc',
    file: 'toc.md',
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
    async afterSite(site, page, pages, opts) {},
    async beforePage(site, page, i, pages, opts) {},
    async afterPage(site, page, i, pages, opts) {},
  },

  params: {
    title: 'book',
  },
};
