# Contributing

Contributions to bok are welcome!

## Development Setup

```bash
# Clone the repository
git clone https://github.com/alajmo/bok
cd bok

# Install dependencies
bun install

# Run the example site
make serve-debug
```

## Project Structure

```
bok/
├── mod.ts              # CLI entry point
├── deps.ts             # Centralized dependencies
├── src/
│   ├── mod.ts          # Main exports
│   ├── core/
│   │   ├── build.ts    # Build pipeline
│   │   ├── config.ts   # Configuration loading
│   │   ├── init.ts     # Site initialization
│   │   ├── server.ts   # HTTP server
│   │   ├── watch.ts    # File watching
│   │   ├── ws-server.ts # WebSocket server
│   │   └── utils.ts    # Utilities
│   └── plugins/
│       └── toc.ts      # TOC parser
├── themes/
│   ├── basic/          # Minimal theme
│   └── book/           # Documentation theme
└── examples/
    └── book/           # Example site
```

## Key Files

### deps.ts

All external dependencies are centralized here. This makes it easy to swap implementations.

### src/core/build.ts

The main build pipeline:
1. Clean output directory
2. Discover pages (walk/glob/toc)
3. Process each page (front matter → markdown → template)
4. Copy assets

### src/core/config.ts

Configuration loading and merging:
- Read user config
- Apply defaults
- Merge with theme config
- Validate paths

### src/plugins/toc.ts

Custom lexer and parser for the TOC format:
- `TocReader` - Character stream
- `TocLexer` - Tokenizer
- `TocParser` - AST builder
- `TocRender` - HTML generator

## Making Changes

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test with the example site
5. Submit a pull request

## Testing

Run the example site to test changes:

```bash
# Development server
make serve-debug

# Build only
make build
```

## Code Style

- TypeScript for all source files
- Use template literals for HTML generation
- Keep dependencies minimal
- Prefer explicit over implicit

## Reporting Issues

Open an issue on GitHub with:
- bok version
- Bun version
- Operating system
- Steps to reproduce
- Expected vs actual behavior
