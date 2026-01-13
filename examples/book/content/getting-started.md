# Getting Started

This guide will help you create your first bok site.

## Prerequisites

You need [Bun](https://bun.sh) installed:

```bash
curl -fsSL https://bun.sh/install | bash
```

## Installation

### From Source

```bash
git clone https://github.com/alajmo/bok
cd bok
bun install
```

### Global Install

After cloning, you can install bok globally:

```bash
make install
```

This creates a `bok` command you can run from anywhere.

## Create a New Site

### Interactive Mode

Run the init command and follow the prompts:

```bash
bok init
```

You'll be asked to:
1. Choose **extend** (use existing theme) or **create** (copy theme files)
2. Select a theme: **basic** or **book**

### Non-Interactive Mode

```bash
# Extend the book theme
bok init --mode extend --theme book
```

## Project Structure

After initialization, your project looks like this:

```
my-site/
├── config.ts        # Site configuration
└── content/
    ├── toc.md       # Table of contents (page order)
    ├── index.md     # Home page
    └── ...          # Your markdown pages
```

## Development Workflow

### Start the Dev Server

```bash
bok serve config.ts
```

This will:
- Build your site to the output directory
- Start a local server at http://localhost:5000
- Watch for file changes and rebuild automatically
- Reload your browser when files change

### Build for Production

```bash
bok build config.ts
```

The generated site will be in the `site/` directory (or whatever you configured as `paths.output`).

## Adding Pages

1. Create a new `.md` file in `content/`:

```markdown
# My New Page

This is my new page content.
```

2. Add it to `content/toc.md`:

```markdown
- [My New Page](my-new-page.md)
```

3. Save and watch the browser reload with your new page.

## Next Steps

- Learn about [CLI Commands](usage/usage.md)
- Understand [Configuration](configuration/configuration.md)
- Explore the [Book Theme](themes/book-theme.md)
