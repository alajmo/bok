# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [0.4.0] - 2026-01-31

### Changed

- Embed built-in themes in compiled binary
- Add clickable heading anchors with # permalink indicator

## [0.3.0] - 2026-01-30

### Changed

- Fix TOC parser multi-level dedent and auto-focus content for keyboard scrolling
- Include all heading levels (H2-H6) in right TOC by default

## [0.2.0] - 2026-01-28

### Changed

- Add search, sidebar scroll persistence, and disable dev caching
- Add changelog with automatic updates on release

## [0.1.0] - 2025-01-27

### Added

- Initial release
- Bun-based static site generator CLI
- Markdown to HTML conversion using TypeScript template literals
- Book theme similar to Rust's mdBook
- Live reload dev server
- TOC-based file discovery
- Right table of contents with scrollspy
- GitHub release workflow with cross-platform binaries

[Unreleased]: https://github.com/alajmo/bok/compare/v0.4.0...HEAD
[0.1.0]: https://github.com/alajmo/bok/releases/tag/v0.1.0
