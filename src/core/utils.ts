import { fs, path } from '../../deps.ts';

export const sleep = milliseconds => {
  return new Promise(resolve => setTimeout(resolve, milliseconds));
};

export const __dirname = () => path.dirname(path.fromFileUrl(import.meta.url));

export async function exists(filePath: string): Promise<boolean> {
  return Deno.lstat(filePath)
    .then((): boolean => true)
    .catch((): boolean => false);
}

export async function clean(path: string) {
  if (fs.existsSync(path)) {
    await Deno.remove(path, { recursive: true });
  }
}
