# clean

Remove the output directory.

## Usage

```bash
bok clean [config]
```

## Arguments

| Argument | Description | Default |
|----------|-------------|---------|
| `config` | Path to config file | `config.ts` |

## What It Does

Deletes the entire output directory (default: `site/`).

This is useful for:
- Cleaning up before a fresh build
- Removing stale files from deleted pages
- Resetting your project state

## Note

The `build` command already cleans the output directory before building, so you typically don't need to run `clean` manually.

## Examples

```bash
# Clean with default config
bok clean

# Clean specific project
bok clean ./docs/config.ts
```
