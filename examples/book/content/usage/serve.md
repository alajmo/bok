# serve

Build, serve, and live reload your site during development.

## Usage

```bash
bok serve [options] [config]
```

## Arguments

| Argument | Description | Default |
|----------|-------------|---------|
| `config` | Path to config file | `config.ts` |

## Options

| Option | Description | Default |
|--------|-------------|---------|
| `--port <port>` | HTTP server port | `5000` |
| `--ws-port <port>` | WebSocket port for live reload | `5001` |
| `--reload` | Enable live reload | `true` |

## What It Does

1. Performs an initial [build](build.md)
2. Starts an HTTP server to serve your site
3. Starts a WebSocket server for live reload
4. Watches for file changes and rebuilds
5. Notifies the browser to reload after rebuilds

## Live Reload

When `--reload` is enabled (default), bok:

1. Injects a small JavaScript snippet into HTML pages
2. Opens a WebSocket connection to the dev server
3. Listens for build completion events
4. Automatically reloads the page when content changes

## Server Details

The HTTP server:
- Serves static files from the output directory
- Returns `index.html` for directory requests
- Serves `404/index.html` for missing pages (if it exists)
- Logs all requests to the console

## Examples

```bash
# Start with defaults (port 5000)
bok serve config.ts

# Custom HTTP port
bok serve --port 3000 config.ts

# Custom WebSocket port
bok serve --ws-port 3001 config.ts

# Disable live reload
bok serve --reload=false config.ts
```

## Configuration

You can also set serve options in your config file:

```typescript
export default {
  serve: {
    reload: true,
    port: 5000,
    wsPort: 5001,
  },
};
```

Command-line options override config file settings.
