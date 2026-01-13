# Themes

Themes control the look and feel of your bok site. They provide layouts, styles, and default configuration.

## Built-in Themes

### basic

A minimal theme with just the essentials.

```typescript
export default {
  extends: "basic",
};
```

Features:
- Simple HTML structure
- No styling
- Good starting point for custom themes

### book

A documentation theme inspired by mdBook and GitBook.

```typescript
export default {
  extends: "book",
};
```

Features:
- Sidebar navigation
- Previous/next page links
- Right-side table of contents
- Responsive design
- Syntax highlighting

See [Book Theme](book-theme.md) for details.

## Theme Structure

A theme consists of:

```
my-theme/
├── config.ts       # Theme configuration
├── layout/         # Template files
│   ├── index.ts    # Default layout
│   └── base.ts     # Base HTML wrapper
├── assets/         # Static assets
│   ├── css/
│   ├── js/
│   ├── img/
│   └── fonts/
└── content/        # Example content (for init)
    ├── toc.md
    └── index.md
```

## Extending vs Creating

### Extend (Recommended)

Use the theme's layouts and assets, customize only what you need:

```typescript
export default {
  extends: "book",
  params: {
    title: "My Docs",
  },
};
```

### Create

Copy theme files for full customization:

```bash
bok init --mode create --theme book
```

This copies all theme files to your project.

## Custom Themes

Create your own theme by:

1. Creating a theme directory with the structure above
2. Writing a `config.ts` with theme defaults
3. Creating layout templates
4. Adding assets

Reference your custom theme:

```typescript
export default {
  extends: "/path/to/my-theme/config.ts",
};
```

See [Creating Themes](creating-themes.md) for a complete guide.
