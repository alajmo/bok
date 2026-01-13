title: Front Matter
---

# Front Matter

Front matter lets you add metadata to individual pages.

## Syntax

Add key-value pairs at the top of your markdown file, followed by `---`:

```markdown
title: My Page Title
layout: custom.ts
author: John Doe
---

# Page Content

Your markdown content here...
```

## Available Properties

### layout

Override the default layout template for this page.

```
layout: my-layout.ts
```

The path is relative to the `layout/` directory.

### Custom Properties

Add any custom properties you need:

```markdown
title: Getting Started
description: Learn how to get started with bok
author: Your Name
date: 2024-01-15
tags: tutorial, beginner
draft: true
---
```

Access these in templates via `page.params`:

```typescript
export default function(site, page, pages) {
  return `
    <article>
      <h1>${page.params.title}</h1>
      <p>By ${page.params.author}</p>
      ${page.htmlContent}
    </article>
  `;
}
```

## Parser Details

The front matter parser:

- Reads lines until it hits `---`
- Splits each line on the first `:`
- Trims whitespace from keys and values
- All values are strings

```markdown
key: value with spaces
another: value: with: colons
---
```

Results in:
```javascript
{
  key: "value with spaces",
  another: "value: with: colons"
}
```

## Examples

### Blog Post

```markdown
title: My First Post
date: 2024-01-15
author: Jane Doe
tags: announcement, news
---

# Welcome to My Blog

This is my first post...
```

### Custom Layout

```markdown
layout: landing.ts
---

# Welcome

This page uses a custom landing page layout.
```

### Documentation Page

```markdown
title: API Reference
description: Complete API documentation
order: 5
---

# API Reference

...
```

## No Front Matter

Front matter is optional. If omitted, the page uses:

- Default layout from config
- Empty `params` object

```markdown
# Just Content

This page has no front matter.
```
