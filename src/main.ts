import { build } from './core/build.ts';
import { serve } from './core/serve.ts';
import { parseConfig } from './lib/config.ts';

function main() {
  const { args } = Deno;

  const cmd = args[0];
  const { site, paths } = parseConfig(args[1]);

  switch (cmd) {
    case 'build':
      build(site, paths);
      break;
    case 'serve':
      serve(site, paths);
      break;
    default:
      console.log('Forgot command: build, serve');
  }
}

main();
