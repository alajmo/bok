import { promises as fsPromises } from "node:fs";
import { fs } from "./fs.ts";

export const sleep = (milliseconds: number) => {
  return new Promise((resolve) => setTimeout(resolve, milliseconds));
};

export const __dirname = () => import.meta.dir;

export async function exists(filePath: string): Promise<boolean> {
  return fsPromises.lstat(filePath)
    .then((): boolean => true)
    .catch((): boolean => false);
}

export async function clean(p: string) {
  if (fs.existsSync(p)) {
    await fsPromises.rm(p, { recursive: true });
  }
}
