# bok

**bok** is a fast, minimal static site generator built with Bun. It converts Markdown files to HTML using TypeScript template literals, with a focus on documentation sites and books.

## Features

- **Fast** - Built on Bun for quick builds and hot reloading
- **Simple** - Markdown in, HTML out, minimal configuration
- **Flexible Templates** - Use TypeScript template literals for layouts
- **Live Reload** - Auto-refresh browser on file changes
- **Book Theme** - Built-in theme inspired by mdBook/GitBook
- **Table of Contents** - Define page order with a simple TOC file
- **Right-side Navigation** - Auto-generated on-page heading navigation
- **Front Matter** - Add metadata to pages with simple key-value pairs

## Quick Start

```bash
# Install bun if you haven't already
curl -fsSL https://bun.sh/install | bash

# Clone and install
git clone https://github.com/alajmo/bok
cd bok
bun install

# Create a new site
bun run mod.ts init

# Start development server
bun run mod.ts serve config.ts
```

## How It Works

1. **Configuration** - Define your site in `config.ts`
2. **Content** - Write pages in Markdown in the `content/` directory
3. **TOC** - Define page order in `content/toc.md`
4. **Build** - Run `bok build` to generate static HTML
5. **Serve** - Run `bok serve` for development with live reload

## Philosophy

> In the beginning, all you want is results.
> In the end, all you want is control.

bok aims to be:

- **Explicit over implicit** - No magic, clear configuration
- **Minimal core** - Do one thing well: Markdown to HTML
- **Extensible** - Hooks and custom layouts for advanced use cases
