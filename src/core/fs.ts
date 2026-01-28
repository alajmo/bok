import * as nodeFs from "node:fs";
import * as path from "node:path";
import fsExtra from "fs-extra";
import { globSync } from "glob";

interface WalkEntry {
  path: string;
  name: string;
  isFile: boolean;
  isDirectory: boolean;
}

function* walkSync(
  dir: string,
  options: { maxDepth?: number } = {}
): Generator<WalkEntry> {
  const { maxDepth = Infinity } = options;

  function* walkDir(currentPath: string, depth: number): Generator<WalkEntry> {
    if (depth > maxDepth) return;

    const entries = nodeFs.readdirSync(currentPath, { withFileTypes: true });

    if (depth === 0) {
      yield {
        path: currentPath,
        name: path.basename(currentPath),
        isFile: false,
        isDirectory: true,
      };
    }

    for (const entry of entries) {
      const fullPath = path.join(currentPath, entry.name);
      const result = {
        path: fullPath,
        name: entry.name,
        isFile: entry.isFile(),
        isDirectory: entry.isDirectory(),
      };

      yield result;

      if (entry.isDirectory() && depth < maxDepth) {
        yield* walkDir(fullPath, depth + 1);
      }
    }
  }

  yield* walkDir(dir, 0);
}

function* expandGlobSync(pattern: string): Generator<WalkEntry> {
  const matches = globSync(pattern);
  for (const match of matches) {
    const stat = nodeFs.statSync(match);
    yield {
      path: match,
      name: path.basename(match),
      isFile: stat.isFile(),
      isDirectory: stat.isDirectory(),
    };
  }
}

export const fs = {
  ...nodeFs,
  ...fsExtra,
  walkSync,
  expandGlobSync,
};
