# Creating Themes

Build custom themes for your bok sites.

## Theme Structure

```
my-theme/
├── config.ts       # Required: theme configuration
├── layout/         # Required: template files
│   └── index.ts    # Required: default layout
├── assets/         # Optional: static files
└── content/        # Optional: example content
```

## Theme Config

Create `config.ts`:

```typescript
export default {
  name: "my-theme",

  // File discovery mode
  files: {
    type: "walk",  // or "toc", "glob"
  },

  // Path defaults (relative to this file)
  paths: {
    assets: "assets",
    layout: "layout",
    defaultLayout: "index.ts",
  },

  // Dev server defaults
  serve: {
    reload: true,
    port: 5000,
    wsPort: 5001,
  },

  // Lifecycle hooks
  hooks: {
    async beforeSite(site, pages, opts) {},
    async afterSite(site, pages, opts) {},
    async beforePage(site, page, i, pages, opts) {},
    async afterPage(site, page, i, pages, opts) {},
  },

  // Default params (users can override)
  params: {
    title: "My Theme",
  },
};
```

## Layout Templates

Layouts are TypeScript files that export a function:

```typescript
// layout/index.ts
export default function(site, page, pages) {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <title>${page.params.title || site.params.title}</title>
        <link rel="stylesheet" href="${site.rootUrl}/assets/css/style.css">
      </head>
      <body>
        <main>
          ${page.htmlContent}
        </main>
      </body>
    </html>
  `;
}
```

### Template Parameters

#### site

The site configuration object:

```typescript
site.rootUrl      // URL prefix
site.params       // Site params from config
site.paths        // Directory paths
site.uglyURLs     // URL style boolean
```

#### page

The current page being rendered:

```typescript
page.name         // Filename
page.path         // Full file path
page.link         // URL path (e.g., "/getting-started")
page.params       // Front matter data
page.htmlContent  // Rendered markdown HTML
page.tokens       // markdown-it AST tokens
page.toc          // Left sidebar HTML (if using TOC mode)
page.rightToc     // Right-side TOC HTML
page.prevPage     // Previous page URL
page.nextPage     // Next page URL
```

#### pages

Array of all pages in the site.

## Composable Templates

Split templates into reusable parts:

```typescript
// layout/base.ts
export default function({ title, rootUrl }, content) {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <title>${title}</title>
        <link rel="stylesheet" href="${rootUrl}/assets/css/style.css">
      </head>
      <body>
        ${content}
      </body>
    </html>
  `;
}

// layout/index.ts
import base from "./base.ts";

export default function(site, page, pages) {
  return base(
    { title: page.params.title, rootUrl: site.rootUrl },
    `<main>${page.htmlContent}</main>`
  );
}
```

## Assets

Place static files in `assets/`:

```
assets/
├── css/
│   └── style.css
├── js/
│   └── main.js
├── img/
│   └── logo.svg
└── fonts/
    └── ...
```

Reference in templates:

```typescript
`<link rel="stylesheet" href="${site.rootUrl}/assets/css/style.css">`
`<script src="${site.rootUrl}/assets/js/main.js"></script>`
```

## Hooks

Use hooks for advanced processing:

```typescript
hooks: {
  // Generate sitemap after build
  async afterSite(site, pages, opts) {
    const sitemap = pages
      .map(p => `<url><loc>https://example.com${p.link}</loc></url>`)
      .join("\n");

    await Bun.write(
      `${site.paths.output}/sitemap.xml`,
      `<?xml version="1.0"?><urlset>${sitemap}</urlset>`
    );
  },

  // Add build timestamp to each page
  async beforePage(site, page, i, pages, opts) {
    page.params.buildTime = new Date().toISOString();
  },
}
```

## Using Your Theme

Reference by path:

```typescript
export default {
  extends: "/path/to/my-theme/config.ts",
  params: {
    title: "My Site",
  },
};
```

Or initialize with it:

```bash
bok init --mode extend --theme path --theme-path /path/to/my-theme/config.ts
```
