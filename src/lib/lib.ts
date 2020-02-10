import { join, dirname } from 'https://deno.land/std/path/mod.ts';

export { configurePath };

function configurePath(sitePath, site) {
  const rootPath = dirname(sitePath);

  const content = join(rootPath, site.content);
  const template = join(rootPath, site.template);

  return {
    content,
    template,
  };
}
