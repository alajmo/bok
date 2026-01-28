# Site Config

The `config.ts` file is the heart of your bok site. This page covers all configuration options in detail.

## Config Structure

```typescript
export default {
  // Theme to extend
  extends?: string,

  // URL prefix
  rootUrl?: string,

  // URL style
  uglyURLs?: boolean,

  // Directory paths
  paths?: {
    content?: string,
    output?: string,
    assets?: string,
    layout?: string,
    defaultLayout?: string,
    public?: string[],
  },

  // File discovery
  files?: {
    type: "walk" | "glob" | "toc",
    file?: string,  // for toc type
    glob?: string,  // for glob type
  },

  // Dev server
  serve?: {
    reload?: boolean,
    port?: number,
    wsPort?: number,
  },

  // Lifecycle hooks
  hooks?: {
    beforeSite?: Function,
    afterSite?: Function,
    beforePage?: Function,
    afterPage?: Function,
  },

  // Custom data for templates
  params?: Record<string, any>,
};
```

## Path Resolution

All paths in the config are resolved relative to the config file's directory.

```typescript
// If config is at /home/user/my-site/config.ts
paths: {
  content: "content",     // → /home/user/my-site/content
  output: "../docs",      // → /home/user/docs
  public: ["images"],     // → /home/user/my-site/images
}
```

## Extending Themes

When you extend a theme:

1. Theme's `hooks` are used
2. Theme's `paths.assets` and `paths.layout` are used
3. Theme's `files` config is used (if not overridden)
4. Theme's `params` are merged with yours (yours take precedence)

```typescript
// Theme config
params: {
  title: "Default Title",
  showToc: true,
}

// Your config
params: {
  title: "My Title",  // Overrides theme
  author: "Me",       // Added
  // showToc: true    // Inherited from theme
}
```

## File Discovery Modes

### TOC Mode

Best for books and documentation with a specific reading order.

```typescript
files: {
  type: "toc",
  file: "toc.md",  // Relative to content directory
}
```

The `toc.md` file defines:
- Page order
- Navigation structure
- Section groupings

See [TOC Format](toc-format.md) for details.

### Walk Mode

Recursively finds all markdown files.

```typescript
files: {
  type: "walk",
}
```

Good for blogs or sites without strict ordering.

### Glob Mode

Find files matching a pattern.

```typescript
files: {
  type: "glob",
  glob: "posts/**/*.md",
}
```

## Hooks

Hooks let you customize the build process.

### beforeSite

Called once before any pages are processed.

```typescript
hooks: {
  async beforeSite(site, pages, opts) {
    // Generate sitemap data
    // Set up shared resources
    console.log(`Building ${pages.length} pages`);
  },
}
```

### afterSite

Called once after all pages are processed.

```typescript
hooks: {
  async afterSite(site, pages, opts) {
    // Generate sitemap.xml
    // Generate RSS feed
    // Post-process output
  },
}
```

### beforePage / afterPage

Called for each page.

```typescript
hooks: {
  async beforePage(site, page, index, pages, opts) {
    // Modify page before rendering
    page.params.buildTime = new Date().toISOString();
  },

  async afterPage(site, page, index, pages, opts) {
    // Post-process individual page
  },
}
```

## Params

The `params` object is passed to all templates. Use it for:

- Site metadata (title, author, description)
- Theme configuration
- Custom data

```typescript
params: {
  // Metadata
  title: "My Site",
  author: "Your Name",
  description: "Site description",
  url: "https://example.com",

  // Theme options
  rightToc: {
    enabled: true,
    title: "Contents",
    levels: [2, 3, 4],
  },

  // Custom data
  socialLinks: {
    github: "https://github.com/you",
    twitter: "https://twitter.com/you",
  },
}
```
