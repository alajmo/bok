# Configuration

bok uses a TypeScript configuration file (`config.ts`) to define your site settings.

## Basic Config

```typescript
export default {
  extends: "book",

  paths: {
    output: "site",
  },

  params: {
    title: "My Documentation",
    author: "Your Name",
  },
};
```

## Configuration Options

### extends

Extend a built-in or custom theme.

```typescript
extends: "book"        // Built-in theme
extends: "basic"       // Built-in theme
extends: "/path/to/theme/config.ts"  // Custom theme
```

### rootUrl

Base URL prefix for all links. Useful when deploying to a subdirectory.

```typescript
rootUrl: "/docs"  // Site served at example.com/docs/
rootUrl: ""       // Site served at root (default)
```

### uglyURLs

Use `.html` extensions instead of directory-based URLs.

```typescript
uglyURLs: false  // /about/ (default)
uglyURLs: true   // /about.html
```

### paths

Configure directory locations.

```typescript
paths: {
  content: "content",     // Markdown files location
  output: "site",         // Build output directory
  assets: "assets",       // Theme assets (CSS, JS, images)
  layout: "layout",       // Template files
  defaultLayout: "index.ts",  // Default page template
  public: ["public"],     // Additional directories to copy
}
```

All paths are relative to the config file location.

### files

Configure how pages are discovered.

```typescript
// Table of contents mode (recommended for books)
files: {
  type: "toc",
  file: "toc.md",
}

// Walk all markdown files
files: {
  type: "walk",
}

// Glob pattern
files: {
  type: "glob",
  glob: "**/*.md",
}
```

### serve

Development server settings.

```typescript
serve: {
  reload: true,   // Enable live reload
  port: 5000,     // HTTP server port
  wsPort: 5001,   // WebSocket port
}
```

### hooks

Lifecycle hooks for custom processing.

```typescript
hooks: {
  async beforeSite(site, pages, opts) {
    // Called before building any pages
  },
  async afterSite(site, pages, opts) {
    // Called after all pages are built
  },
  async beforePage(site, page, index, pages, opts) {
    // Called before each page is processed
  },
  async afterPage(site, page, index, pages, opts) {
    // Called after each page is processed
  },
}
```

### params

Custom parameters passed to templates.

```typescript
params: {
  title: "My Site",
  author: "Your Name",
  description: "Site description",
  // Any custom data you need in templates
}
```

## Full Example

```typescript
export default {
  extends: "book",

  rootUrl: "",
  uglyURLs: false,

  paths: {
    output: "dist",
    public: ["images", "downloads"],
  },

  serve: {
    reload: true,
    port: 3000,
    wsPort: 3001,
  },

  params: {
    title: "My Documentation",
    author: "Your Name",
    description: "Comprehensive guide",
    rightToc: {
      enabled: true,
      title: "On this page",
      minHeadings: 2,
      levels: [2, 3],
    },
  },
};
```
