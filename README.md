# bok

`bok` is a simple static site generator CLI built with Bun. It converts Markdown (CommonMark) files to HTML using TypeScript template literals.

It comes with a theme for creating HTML books from Markdown, checkout [demo](https://alajmo.github.io/bok).

Main use cases for `bok` are personal blogs, documentation sites, etc.

## Features

- Simple and minimal API
- Supports Markdown (with Front-matter)
- Vanilla TS/JS Templating (or bring your own templating system)
- Easily extendable
- Auto-refresh browser on file change
- Documentation/Book Theme, similar to rust's [mdbook](https://github.com/rust-lang/mdBook)

## Install

```bash
# Install Bun
curl -fsSL https://bun.sh/install | bash

# Clone and install
git clone https://github.com/alajmo/bok
cd bok
bun install

# Install globally
bun link

# Or compile to native binary
bun run compile
```

## Quickstart

```sh
# Create your site (outputs a config.ts)
bok init

# Start a HTTP server with auto-refresh on file changes
bok serve config.ts

# Build static site
bok build config.ts
```

## Commands

```
Usage: bok [options] [command]

Static Site Generator

Options:
  -V, --version        output the version number
  -h, --help           display help for command

Commands:
  init                 Initialize a site in current directory
  build [config]       Build a static website
  watch [config]       Build a static website and rebuild on file changes
  serve [config]       Build a static website, serve it and rebuild on file changes
  clean [config]       Clean output directory
```

## Content

`bok` supports three methods for collecting content files:

1. Iterate all files in the content directory recursively [default]
2. Provide a glob string
3. Specify files via a special markdown file (toc)

## Layout

There's three ways to specify which layout to use for markdown content, ordered by precedence:

1. `layout` specified in front-matter
2. `layout` specified in config
3. `defaultLayout` specified in config

## Config

Configuration files are TypeScript:

```typescript
export default {
  extends: "book", // Extend a built-in theme (basic, book) or path to custom theme

  paths: {
    content: "content",
    output: "site",
    assets: "assets",
    layout: "layout",
    defaultLayout: "index.ts",
  },

  serve: {
    reload: true,
    port: 5000,
    wsPort: 5001,
  },

  hooks: {
    async beforeSite(site, pages) {},
    async afterSite(site, page, pages) {},
    async beforePage(site, page, pages) {},
    async afterPage(site, page, pages) {},
  },

  params: {
    title: "My Site",
    author: "Author Name",
    description: "Site description",
  },
};
```

## Development

```bash
bun install
bun run serve    # Serve example book
bun run build    # Build example book
```

## Similar Projects

- [mdbook](https://github.com/rust-lang/mdBook)
- [eleventy](https://github.com/11ty/eleventy)
- [Gitbook](https://www.gitbook.com)
