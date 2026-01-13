# watch

Build your site and automatically rebuild when files change.

## Usage

```bash
bok watch [config]
```

## Arguments

| Argument | Description | Default |
|----------|-------------|---------|
| `config` | Path to config file | `config.ts` |

## What It Does

1. Performs an initial [build](build.md)
2. Watches these directories for changes:
   - `content/` - Your markdown files
   - `assets/` - Theme assets
   - `layout/` - Template files
3. Rebuilds when any file changes

## Debouncing

Changes are debounced with a 500ms interval to prevent multiple rapid rebuilds when saving multiple files.

## Differences from `serve`

| Feature | `watch` | `serve` |
|---------|---------|---------|
| Builds on change | Yes | Yes |
| HTTP server | No | Yes |
| Live reload | No | Yes |

Use `watch` when you:
- Have your own HTTP server
- Just want to rebuild files
- Are building for deployment

Use `serve` when you:
- Want a complete development environment
- Need live reload in browser

## Examples

```bash
# Watch with default config
bok watch

# Watch specific config
bok watch ./docs/config.ts
```
