# bok

`bok` is a simple static site generator implemented as a command line tool in `Deno`. It converts Markdown (CommonMark specification) files to HTML files via Javascript Template Literals.

It comes with a theme for creating HTML books from Markdown, see [docz.demo.com](https://google.com).

Main use cases for `bok` are personal blogs, documentation sites, etc.

## Features

- Simple and minimal API
- Supports Markdown (with Front-matter)
- Vanilla JS Templating (or bring your own templating system and invoke it via Javascript)
- Easily extendable
- Auto-refresh browser client on file change
- Documentation Theme

## Install

`bok` is based on Deno, so until the single-binary executable is available (and stable) in Deno, we need to install Deno first:

```
curl -fsSL https://deno.land/x/install/install.sh | sh
```

Then install the latest version of `bok`

```
deno install --force --no-check --unstable --allow-all --name=docz https://deno.land/x/docz/mod.ts
```

## Quickstart

Run the following command to generate a new site.

```sh
# Create your site (outputs a config.ts)
docz init

# Start a HTTP server with auto-refresh on file changes
docz serve config.ts
```

## Documentation

### Commands

```sh
 Usage:   docz
 Version: v0.1.0

 Description:

   Static Site Generator

 Options:

   -h, --help     - Show this help.
   -V, --version  - Show the version number for this program.

 Commands:

   init                    - Build a static website
   build  [config:string]  - Build a static website
   watch  [config:string]  - Build a static website and rebuild on file changes
   serve  [config:string]  - Build a static website, serve it and rebuild on file changes
   clean  [config:string]  - Clean output directory
```

### Content

`bok` supports two methods for collecting content files:

1. Iterate all files in the content directory recursively [default]
2. Provide a glob string
3. Specify files via a special markdown file

### Layout

There's three ways to specify which layout to use for markdown content, ordered by precedence:

1. `layout` specified in front-matter
2. `layout` specified in config
3. `defaultLayout` specified in config

### Config

Configuration files are regular Typescript.

```typescript
export default {
  theme: 'name|path|url',

  paths: {
    content: 'content', // This is where you write your markdown files
    output: 'site', // This is where the site will be created
    assets: 'assets', // Public resources which will be copied to the output directory
    layout: 'layout', // Directory containing your layouts
    defaultLayout: 'index.ts', // If layout is not specified in the front-matter section of the markdown files, use this layout
  },

  serve: {
    reload: true, // Reload site on file change
    port: 5000, // Port to serve development on
    wsPort: 5001, // Port to serve websocket
  },

  hooks: {
    async beforeSite(site, pages) {},
    async afterSite(site, page, pages) {},
    async beforePage(site, page, pages) {},
    async afterPage(site, page, pages) {},
  },

  params: {
    title: 'Docs',
    author: 'Samir Alajmovic',
    description: 'This is the documentation theme',
    url: 'https://github.com/alajmo/docs',
  },
};
```

## Similar Projects

- [mdbook](https://github.com/rust-lang/mdBook)
- [pagic](https://github.com/xcatliu/pagic)
- [eleventy](https://github.com/11ty/eleventy)
- [Gitbook](https://www.gitbook.com)

## Development

All contributions are welcome.
