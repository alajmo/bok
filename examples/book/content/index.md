# markBook

`bok` is a simple static site generator implemented as a command line tool in
`Deno`. It converts Markdown (CommonMark specification) files to HTML files via
Javascript Template Literals. Main use cases for `bok` are personal blogs, documentation sites, etc.

It comes with a theme for creating HTML books from Markdown.

## Features

- Simple and minimal API
- Supports Markdown (with Front-matter)
- Vanilla JS Templating (or bring your own templating system and invoke it via
  Javascript)
- Easily extendable
- Auto-refresh browser client on file change
- Book Theme

## Philosophy

> In the beginning, all you want is results.
>
> In the end, all you want is control.

markBook single purpose is to transform **Markdown** documents to **HTML**
documents. As such, it should be easy for someone to download markBook, run a
command, and get quickly from Markdown to a presentable HTML document. Later, if
the user wants to extend his HTML somehow, there shouldn't be tons of
configuration necessary for him to read.

- Explicit over implicit
- Keep the core small
- Use plugins to extend behavior
