# bok

A fast, minimal static site generator built with Bun. Converts Markdown (CommonMark) files to HTML using TypeScript template literals.

Comes with a documentation/book theme similar to Rust's mdBook. [View demo](https://alajmo.github.io/bok).

## Installation

### From releases

Download the latest binary from [GitHub Releases](https://github.com/alajmo/bok/releases).

```bash
# Linux (x64)
curl -L https://github.com/alajmo/bok/releases/latest/download/bok-linux-x64 -o bok
chmod +x bok
sudo mv bok /usr/local/bin/

# macOS (arm64)
curl -L https://github.com/alajmo/bok/releases/latest/download/bok-darwin-arm64 -o bok
chmod +x bok
sudo mv bok /usr/local/bin/
```

### From source

```bash
# Install Bun
curl -fsSL https://bun.sh/install | bash

# Clone and install
git clone https://github.com/alajmo/bok
cd bok
bun install

# Install globally via bun
bun link

# Or compile to native binary
bun run compile
```

## Quick Start

```bash
# Create a new site (interactive prompts)
bok init

# Start dev server with live reload
bok serve config.ts

# Build static site
bok build config.ts
```

## Commands

```
Usage: bok [options] [command]

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

## Configuration

Configuration is done via TypeScript files, allowing type-safe configs with full IDE support.

```typescript
export default {
  // Extend a built-in theme ("basic", "book") or path to custom theme
  extends: 'book',

  // Base URL path (for sites not at root, e.g., GitHub Pages)
  rootUrl: '/my-site',

  // Full URL (enables sitemap, RSS, robots.txt generation)
  url: 'https://example.com/my-site',

  paths: {
    content: 'content', // Markdown files directory
    output: 'site', // Build output directory
    public: ['public'], // Additional assets to copy
  },

  // Dev server options
  serve: {
    reload: true, // Live reload on changes
    port: 5000,
    wsPort: 5001,
  },

  // Build lifecycle hooks
  hooks: {
    async beforeSite(site, pages, opts) {},
    async afterSite(site, pages, opts) {},
    async beforePage(site, page, i, pages, opts) {},
    async afterPage(site, page, i, pages, opts) {},
  },

  // Custom parameters (available in templates)
  params: {
    title: 'My Site',
    author: 'Author Name',
    description: 'Site description',
    github: 'https://github.com/user/repo',
  },
}
```

## Content Discovery

Three modes for collecting content files:

### 1. Walk (default)

Recursively iterate all `.md` files in the content directory.

### 2. Glob

Provide a glob pattern:

```typescript
export default {
  files: {
    type: 'glob',
    glob: '**/*.md',
  },
}
```

### 3. TOC file

Specify file order via a special markdown file. This enables:

- Custom ordering and hierarchy in the sidebar
- Section headers and separators
- Previous/next page navigation

```typescript
export default {
  files: {
    type: 'toc',
    file: 'toc.md',
  },
}
```

Example `toc.md`:

```markdown
# Book Title

[Introduction](index.md)

- [Getting Started](getting-started.md)

---

# Reference

- [Configuration](config/configuration.md)
  - [Options](config/options.md)
  - [Hooks](config/hooks.md)
```

## Themes

### Built-in Themes

- **basic** - Minimal starting point
- **book** - Documentation/book theme with sidebar navigation, dark mode, print view

### Using a Theme

```typescript
export default {
  extends: 'book',
  params: {
    title: 'My Docs',
    github: 'https://github.com/user/repo',
  },
}
```

### Creating Custom Themes

Themes define: `config.ts`, `layout/` (TypeScript template functions), `assets/` (CSS/JS/fonts).

Layout templates receive the site config, current page, and all pages:

```typescript
export default function (site: Site, page: Page, pages: Page[]) {
  return `<!DOCTYPE html>
<html>
  <head><title>${page.params.title || site.params.title}</title></head>
  <body>${page.htmlContent}</body>
</html>`
}
```

## Layout Selection

Layout precedence (highest to lowest):

1. `layout` in front-matter
2. Theme's `defaultLayout`

## Development

```bash
bun install              # Install dependencies
bun run serve            # Dev server with examples/book/
bun run build            # Build examples/book/
bun run compile          # Compile to native binary
```

## License

MIT
