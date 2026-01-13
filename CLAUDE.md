# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

`bok` is a Bun-based static site generator CLI that converts Markdown files to HTML using TypeScript template literals. It includes a documentation/book theme similar to Rust's mdBook.

## Development Commands

```bash
bun install           # Install dependencies
bun run serve         # Dev server with live reload (examples/book/)
bun run build         # Build static site
bun link              # Install globally as 'bok' command
bun run compile       # Compile to native binary at ~/.local/bin/bok
```

Direct CLI usage:
```bash
bun run mod.ts <command> [config.ts]
```

Commands: `init`, `build`, `watch`, `serve`, `clean`

## Architecture

### Core Build Pipeline

1. **Config Loading** (`src/core/config.ts`) - Parse TypeScript config, merge with theme defaults
2. **File Discovery** - Three modes: `walk` (recursive), `glob`, or `toc` (ordered markdown file)
3. **Page Processing** (`src/core/build.ts`) - Front-matter extraction → Markdown rendering (markdown-it) → Right TOC generation → Template application
4. **Asset Copying** - Theme assets + public directories copied to output

### Key Directories

- `src/core/` - Build pipeline, config, server, WebSocket live reload
- `src/plugins/` - TOC parser (custom lexer/parser), sitemap, robots.txt
- `themes/` - Built-in themes (`basic`, `book`)
- `examples/book/` - Working example site for testing

### Theme System

Themes define: `config.ts` (settings, hooks), `layout/` (TS template functions), `assets/` (CSS/JS/fonts)

Sites extend themes via `extends: "book"` in config. User params merge with theme params (user takes precedence).

### Page Interface

Pages have: `name`, `path`, `link`, `params` (front-matter), `htmlContent`, `tokens` (markdown-it AST), `toc` (left sidebar), `rightToc` (on-page navigation), `prevPage`/`nextPage`

### Dependencies

Dependencies managed via `package.json`:
- `node:fs`, `node:path` - File system operations
- `fs-extra` - Extended file utilities
- `commander` - CLI framework
- `@inquirer/prompts` - Interactive prompts
- `cli-table3` - Table formatting
- `markdown-it`, `markdown-it-anchor` - Markdown rendering
- `chokidar` - File watching
- `glob` - Glob pattern matching
