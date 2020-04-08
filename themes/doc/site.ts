import { buildToc } from './template/components/toc.ts';

export function config() {
  return {
    title: 'Docs',
    author: 'Samir Alajmovic',
    description: 'Documentation Theme',
    version: '0.1.0',
    url: 'https://docs.com',

    public: 'assets',
    content: 'content',
    template: 'template',
    output: 'site',
    excerptionLength: 140,

    serve: {
      port: 5001,
    },

    beforeBuild: async (site, pages, pageLinks) => {
      return buildToc(site, pages, pageLinks);
    },

    links: {},
  };
}
