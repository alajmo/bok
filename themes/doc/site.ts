export default function () {
  return {
    title: 'Docs',
    author: 'Samir Alajmovic',
    description: 'This is the documentation theme',
    url: 'https://github.com/alajmo/docs',

    paths: {
      public: 'assets', // These are your public assets, public directory will be copied to the output
      content: 'content', // This is where you write your markdown files
      template: 'template', // This is the template theme that you use for styling your site
      output: 'site', // This is where the site will be created
      toc: './toc.md', // Relative to content
      defaultTemplate: './pages/index.ts', // Relative to template
    },

    flags: {
      sitemap: false, // Generate sitemap
      robot: false, // Generate robots.txt
    },

    commands: {
      build: {},

      serve: {
        port: 5001, // Port to serve development on
      },
    },

    hooks: {
      /* This runs before a site is built */
      async beforeSite(site, pages) {},

      /* This runs after the site has been built */
      async afterSite(site, page, pages) {},

      /* This runs before each page is built */
      async beforePage(site, page, pages) {},

      /* This runs after each page is built */
      async afterPage(site, page, pages) {},
    },

    custom: {
      excerptionLength: 140,
    },
  };
}
