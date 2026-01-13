# init

Initialize a new bok site in the current directory.

## Usage

```bash
bok init [options]
```

## Options

| Option | Description |
|--------|-------------|
| `--mode <string>` | Create mode: `extend` or `create` |
| `--theme <string>` | Theme to use: `basic`, `book`, or `path` |
| `--theme-path <string>` | Path to custom theme config (when theme is `path`) |

## Modes

### Extend Mode (Recommended)

Extends an existing theme. Creates a minimal `config.ts` and copies the theme's content directory.

```bash
bok init --mode extend --theme book
```

This creates:
- `config.ts` - References the theme, lets you override params
- `content/` - Copy of the theme's example content

Your config will look like:

```typescript
export default {
  extends: "book",
  params: {
    title: "My Site",
  },
};
```

### Create Mode

Copies all theme files into your project for full customization.

```bash
bok init --mode create --theme book
```

This creates:
- `config.ts` - Full configuration
- `content/` - Content directory
- `layout/` - Template files
- `assets/` - CSS, JS, images

## Interactive Mode

Run without options to use interactive prompts:

```bash
bok init
```

You'll be asked:
1. **Mode**: Extend or create from scratch?
2. **Theme**: Which theme to use?

## Using a Custom Theme

Point to your own theme config:

```bash
bok init --mode extend --theme path --theme-path /path/to/theme/config.ts
```

## Examples

```bash
# Interactive mode
bok init

# Quick start with book theme
bok init --mode extend --theme book

# Full theme customization
bok init --mode create --theme basic
```
