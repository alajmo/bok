import { existsSync } from 'https://deno.land/std/fs/mod.ts';

export { validateConfig };

function validateConfig(paths: any) {
  if (!existsSync(paths.content)) {
    console.error('error: content directory is missing');
  }

  if (!existsSync(paths.template)) {
    console.error('error: template directory is missing');
  }
}
