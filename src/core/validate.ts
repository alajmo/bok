import { existsSync } from 'https://deno.land/std/fs/mod.ts';

export { validateConfig, validateContent };

function validateConfig(sitePaths) {
  if (!existsSync(sitePaths.content)) {
    console.error('error: content directory is missing');
  }

  if (!existsSync(sitePaths.template)) {
    console.error('error: template directory is missing');
  }
}

function validateContent(tree) {
  // - All files have title
  // - All files have layout
  // - All dirs have children
}
