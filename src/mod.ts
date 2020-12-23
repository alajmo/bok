import { clean } from './core/utils.ts';
import { init } from './core/init.ts';
import { build } from './core/build.ts';
import { serve, watch } from './core/watch.ts';
import { getSiteConfig } from './core/config.ts';

export { Docz };

function Docz() {
  return {
    init,

    build: async (config?: string, options: any) => {
      const site = await getSiteConfig(config, options);
      build(site);
    },

    watch: async (config?: string, options: any) => {
      const site = await getSiteConfig(config, options);
      watch(site);
    },

    serve: async (config?: string, options: any) => {
      const site = await getSiteConfig(config, options);
      serve(site);
    },

    clean: async (config?: string, options: any) => {
      const site = await getSiteConfig(config, options);
      clean(site.paths.output);
    },
  };
}
