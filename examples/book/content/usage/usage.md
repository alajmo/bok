# CLI Commands

bok provides a simple command-line interface for building and serving your site.

## Usage

```bash
bok <command> [config]
```

All commands except `init` accept an optional path to your config file. If not provided, it defaults to `config.ts` in the current directory.

## Available Commands

| Command | Description |
|---------|-------------|
| [init](init.md) | Initialize a new site |
| [build](build.md) | Build static HTML files |
| [watch](watch.md) | Build and rebuild on file changes |
| [serve](serve.md) | Build, serve, and live reload |
| [clean](clean.md) | Remove the output directory |

## Global Options

```bash
bok --help     # Show help
bok --version  # Show version
```

## Examples

```bash
# Initialize a new site
bok init

# Build using default config.ts
bok build

# Build with explicit config path
bok build ./my-site/config.ts

# Start development server
bok serve config.ts

# Start server with custom port
bok serve --port 3000 config.ts
```
