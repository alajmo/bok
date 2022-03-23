import { clean } from "./core/utils.ts";
import { init } from "./core/init.ts";
import { build } from "./core/build.ts";
import { serve, watch } from "./core/watch.ts";
import { getSiteConfig } from "./core/config.ts";

export { Bok };

function Bok() {
  return {
    init,

    build: async (options: any, config?: string) => {
      const site = await getSiteConfig(config, options);
      build(site);
    },

    watch: async (options: any, config?: string) => {
      const site = await getSiteConfig(config, options);
      watch(site);
    },

    serve: async (options: any, config?: string) => {
      const site = await getSiteConfig(config, options);
      serve(site);
    },

    clean: async (options: any, config: string) => {
      const site = await getSiteConfig(config, options);
      clean(site.paths.output);
    },
  };
}
