# Deno to Bun Migration Plan for `bok`

## Overview

Migrate the `bok` static site generator from Deno to Bun, enabling single binary compilation via `bun build --compile`.

## New Files to Create

### 1. `package.json`
```json
{
  "name": "bok",
  "version": "0.1.3",
  "type": "module",
  "bin": { "bok": "./mod.ts" },
  "dependencies": {
    "commander": "^12.1.0",
    "@inquirer/prompts": "^7.0.0",
    "cli-table3": "^0.6.5",
    "markdown-it": "^14.1.0",
    "markdown-it-anchor": "^9.2.0",
    "glob": "^11.0.0",
    "fs-extra": "^11.2.0",
    "chokidar": "^4.0.0"
  },
  "devDependencies": {
    "@types/bun": "latest",
    "@types/markdown-it": "^14.1.2",
    "@types/fs-extra": "^11.0.4"
  }
}
```

### 2. `tsconfig.json`
```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "noEmit": true,
    "strict": true,
    "skipLibCheck": true,
    "types": ["bun-types"]
  }
}
```

## Files to Modify (in order)

### Phase 1: Dependencies (`deps.ts`)

Replace Deno imports with npm packages:

| Deno Import | Bun/npm Replacement |
|-------------|---------------------|
| `deno.land/std/fs` | `node:fs` + `fs-extra` |
| `deno.land/std/path` | `node:path` |
| `deno.land/std/log` | Simple console wrapper |
| `deno.land/std/http` | `Bun.serve()` |
| `deno.land/std/ws` | Bun's built-in WebSocket |
| `cliffy` | `commander` + `@inquirer/prompts` + `cli-table3` |
| `markdown-it` (CDN) | `markdown-it` (npm) |

Custom implementations needed for:
- `fs.walk` / `fs.walkSync` - directory traversal generator
- `fs.expandGlobSync` - use `glob` package

### Phase 2: Core Utilities (`src/core/utils.ts`)

| Deno API | Bun Replacement |
|----------|-----------------|
| `path.fromFileUrl(import.meta.url)` | `import.meta.dir` or `fileURLToPath()` |
| `Deno.lstat()` | `fs.promises.lstat()` |
| `Deno.remove()` | `fs.promises.rm()` |

### Phase 3: Config (`src/core/config.ts`)

| Deno API | Bun Replacement |
|----------|-----------------|
| `Deno.realPathSync()` | `fs.realpathSync()` |
| `Deno.exit(1)` | `process.exit(1)` |

### Phase 4: Build (`src/core/build.ts`)

| Deno API | Bun Replacement |
|----------|-----------------|
| `Deno.statSync()` | `fs.statSync()` |
| `Deno.readTextFileSync()` | `fs.readFileSync(path, 'utf-8')` |
| `Deno.writeTextFile()` | `fs.promises.writeFile()` |

### Phase 5: Server (`src/core/server.ts`)

Complete rewrite using `Bun.serve()`:
```typescript
Bun.serve({
  port: site.serve?.port || 5000,
  async fetch(req: Request): Promise<Response> {
    // Serve static files from output directory
  }
});
```

### Phase 6: WebSocket (`src/core/ws-server.ts`)

Rewrite using Bun's native WebSocket:
```typescript
Bun.serve({
  port: wsPort,
  fetch(req, server) {
    server.upgrade(req);
  },
  websocket: {
    open(ws) { clients.add(ws); },
    close(ws) { clients.delete(ws); },
  }
});
```

### Phase 7: Watch (`src/core/watch.ts`)

| Deno API | Bun Replacement |
|----------|-----------------|
| `Deno.watchFs()` | `chokidar` package |

### Phase 8: Init (`src/core/init.ts`)

| Deno API | Bun Replacement |
|----------|-----------------|
| `Deno.writeTextFile()` | `fs.promises.writeFile()` |
| `Deno.cwd()` | `process.cwd()` |
| `Deno.run()` | `Bun.spawn()` |
| `Deno.exit(1)` | `process.exit(1)` |

### Phase 9: TOC Plugin (`src/plugins/toc.ts`)

| Deno API | Bun Replacement |
|----------|-----------------|
| `Deno.readTextFileSync()` | `fs.readFileSync()` |

### Phase 10: Print (`src/core/print.ts`)

Replace Cliffy `Table` with `cli-table3`.

### Phase 11: Entry Point (`mod.ts`)

| Deno API | Bun Replacement |
|----------|-----------------|
| `import.meta.main` | `import.meta.path === Bun.main` |
| `Deno.args` | `process.argv.slice(2)` |
| Cliffy `Command` | Commander.js |
| Cliffy prompts | `@inquirer/prompts` |

### Phase 12: Makefile

```makefile
serve-debug:
	bun --watch run mod.ts serve examples/book/config.ts

build:
	bun run mod.ts build examples/book/config.ts

compile:
	bun build --compile --outfile ~/.local/bin/bok mod.ts

install:
	bun link
```

## Verification

1. **Install dependencies**: `bun install`
2. **Build test**: `bun run mod.ts build examples/book/config.ts`
3. **Serve test**: `bun run mod.ts serve examples/book/config.ts` → visit http://localhost:5000
4. **Watch test**: Modify a file in `examples/book/content/` → verify rebuild
5. **Live reload test**: With `--reload` flag, verify browser refreshes
6. **Init test**: `cd /tmp && bun run /path/to/mod.ts init`
7. **Binary compilation**: `bun build --compile --outfile ./bok mod.ts && ./bok --help`

## Risk: Dynamic Imports in Compiled Binary

Bun's `--compile` may have issues with dynamic `import()` for theme configs at runtime. If this fails:
- Test early in migration
- May need to restructure config loading or use alternative approaches

## Summary

- **~12 files** to modify
- **2 new files** to create (package.json, tsconfig.json)
- **1 file to delete** after migration: `deps.ts` can be simplified or removed
- Key benefit: Single binary via `bun build --compile`
