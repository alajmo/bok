# Static Site Builder

docz is a static site generator with a focus on x, y and z, in that order. It supports markdown as well as front-matter. It comes with no default theme and asks you to bring your own, although there are some in the examples directory that you are free to use. Use cases are personal blogs, documentation/info sites, etc.

- Explicit over implicit
- No magic, sometimes debugging static template generator is hard
- No big encompassing goal to cover all static site
- Easy of start over some overreaching goal of being modifiable
- ToC
- Full control over templating and styling

- Supports Markdown
- Supports Front-matter
- Use whatever template system you want
- Bring your own theme

## Install

Download binaries from release.

Alternatively,

## Usage

### Generate a new site

Run the following command to generate a new site.

```sh
docs init
```

### Serve site

```sh
# Serve a theme locally
docs serve ./site.json

# or let docs attempt to find a local `site.json` file
docs serve
```

## Concepts

`docs` has few mandatory options:

- content/
- template/
- site.json

## Similar Projects

- mdbook

## Development

All contributions are welcome.
