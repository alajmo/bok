# TOC Format

The Table of Contents file (`toc.md`) defines the structure and order of pages in your site.

## Basic Syntax

```markdown
# Section Title

[Link Text](filename.md)

- [Chapter Title](chapter.md)
  - [Subsection](subsection.md)

---
```

## Elements

### Headers

Create section titles that appear in the sidebar.

```markdown
# Getting Started

# API Reference

# Advanced Topics
```

### Links

Top-level links without list markers.

```markdown
[Introduction](index.md)
[About](about.md)
```

### List Items

Numbered chapters with nesting support.

```markdown
- [Chapter 1](chapter-1.md)
  - [Section 1.1](section-1-1.md)
  - [Section 1.2](section-1-2.md)
- [Chapter 2](chapter-2.md)
```

Renders as:
- **1.** Chapter 1
  - **1.1.** Section 1.1
  - **1.2.** Section 1.2
- **2.** Chapter 2

### Horizontal Rules

Visual separators between sections.

```markdown
- [Chapter 1](chapter-1.md)

---

# New Section

- [Chapter 2](chapter-2.md)
```

### Draft Pages

Empty parentheses create a draft entry (no link).

```markdown
- [Coming Soon]()
```

This appears in the sidebar but isn't clickable.

## Full Example

```markdown
# My Book

[Introduction](index.md)

- [Getting Started](getting-started.md)

---

# Core Concepts

- [Installation](install.md)
  - [macOS](install/macos.md)
  - [Linux](install/linux.md)
  - [Windows](install/windows.md)

- [Configuration](config.md)
  - [Basic Setup](config/basic.md)
  - [Advanced Options](config/advanced.md)

---

# API Reference

- [Functions](api/functions.md)
- [Types](api/types.md)
- [Examples](api/examples.md)

---

# Appendix

- [FAQ](faq.md)
- [Changelog](changelog.md)
- [Contributing](contributing.md)
```

## File Paths

Paths are relative to the `content/` directory.

```markdown
# If content/ structure is:
# content/
#   index.md
#   guide/
#     intro.md
#     advanced.md

[Home](index.md)
- [Intro](guide/intro.md)
- [Advanced](guide/advanced.md)
```

## Navigation

The TOC automatically generates:

- **Left sidebar** - Full navigation tree
- **Previous/Next links** - Based on page order
- **Active highlighting** - Current page is highlighted

Pages are ordered exactly as they appear in the TOC file.
