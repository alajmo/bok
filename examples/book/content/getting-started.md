## Install

`bok` is based on Deno, so until the single-binary executable is available (and
stable) in Deno, we need to install Deno first:

```
curl -fsSL https://deno.land/x/install/install.sh | sh
```

Then install the latest version of `bok`

```
deno install --force --no-check --unstable --allow-all --name=bok https://deno.land/x/bok/mod.ts
```

## Getting Started

Run the following command to generate a new site.

```sh
# Create your site (outputs a config.ts)
bok init

# Start a HTTP server with auto-refresh on file changes
bok serve config.ts
```
