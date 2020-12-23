import { build } from "./core/build.ts";
/* import { serve } from './core/serve.ts'; */
import { parseConfig } from "./core/config.ts";

async function main() {
  const { args } = Deno;

  const cmd = args[0];
  const configPath = args[1];

  const site = await parseConfig(configPath);

  switch (cmd) {
    case "build":
      build(site);
      break;
    case "serve":
      /* serve(site); */
      break;
    default:
      console.log("Forgot command: build, serve");
  }
}

main();
