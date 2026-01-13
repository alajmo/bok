# build

Build your site into static HTML files.

## Usage

```bash
bok build [config]
```

## Arguments

| Argument | Description | Default |
|----------|-------------|---------|
| `config` | Path to config file | `config.ts` |

## What It Does

1. **Cleans** the output directory
2. **Discovers** pages based on your file discovery mode (walk, glob, or toc)
3. **Processes** each page:
   - Extracts front matter
   - Converts Markdown to HTML
   - Generates right-side table of contents
   - Applies the layout template
4. **Copies** assets (theme assets + public directories)
5. **Outputs** a summary table

## Output

After building, you'll see a summary:

```
[INFO] Building
┌─────────┬────┐
│         │ EN │
├─────────┼────┤
│ # Pages │ 12 │
└─────────┴────┘
```

## Output Directory

By default, files are output to `site/` relative to your config file. Configure this with `paths.output`:

```typescript
export default {
  paths: {
    output: "dist",  // Output to dist/ instead
  },
};
```

## URL Structure

### Pretty URLs (default)

```
content/getting-started.md  →  site/getting-started/index.html
content/guide/intro.md      →  site/guide/intro/index.html
content/index.md            →  site/index.html
```

### Ugly URLs

Set `uglyURLs: true` in your config:

```
content/getting-started.md  →  site/getting-started.html
content/guide/intro.md      →  site/guide/intro.html
```

## Examples

```bash
# Build with default config
bok build

# Build with explicit config
bok build ./docs/config.ts

# Build and then deploy
bok build config.ts && rsync -av site/ server:/var/www/
```
