# Book Theme

The book theme provides a complete documentation experience similar to mdBook or GitBook.

## Features

- **Sidebar navigation** - Collapsible table of contents
- **Page navigation** - Previous/next page arrows
- **Right TOC** - On-page heading navigation with scroll spy
- **Responsive** - Works on mobile and desktop
- **Syntax highlighting** - Via Prism.js
- **Toggle sidebar** - Hide/show for more reading space

## Configuration

### Basic Setup

```typescript
export default {
  extends: "book",

  params: {
    title: "My Documentation",
    author: "Your Name",
    description: "Project documentation",
  },
};
```

### Right Table of Contents

Configure the on-page heading navigation:

```typescript
params: {
  rightToc: {
    enabled: true,        // Show/hide right TOC
    title: "On this page", // Section title
    minHeadings: 2,       // Minimum headings to show TOC
    levels: [2, 3],       // Which heading levels to include
  },
}
```

## Layout Structure

The book theme uses two layout files:

### base.ts

The HTML wrapper with:
- Document head (meta, CSS, fonts)
- Script includes
- Body wrapper

### index.ts

The page structure:
- Sidebar with TOC
- Main content area
- Previous/next navigation
- Right-side TOC

## Styling

### CSS Files

| File | Purpose |
|------|---------|
| `reset.css` | CSS reset |
| `variables.css` | CSS custom properties |
| `base.css` | Core layout styles |
| `typography.css` | Text and heading styles |
| `list.css` | List styling |
| `prism.css` | Code highlighting |

### CSS Variables

Customize colors by overriding CSS variables:

```css
:root {
  --bg: #ffffff;
  --fg: #333333;
  --sidebar-bg: #f5f5f5;
  --link-color: #0066cc;
}
```

## JavaScript

### index.js

Handles:
- Sidebar toggle
- Keyboard navigation (left/right arrows)
- Session storage for sidebar state

### prism.min.js

Syntax highlighting for code blocks.

## Keyboard Shortcuts

| Key | Action |
|-----|--------|
| `←` | Previous page |
| `→` | Next page |
| `s` | Toggle sidebar |

## File Discovery

The book theme uses TOC mode by default:

```typescript
files: {
  type: "toc",
  file: "toc.md",
}
```

Your `content/toc.md` defines the sidebar structure.

## Example Site

See the `examples/book/` directory for a complete example site using this theme.
