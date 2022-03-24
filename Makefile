.PHONY: serve serve-debug build build-debug

serve:
	deno run --unstable --allow-all mod.ts serve themes/book/config.ts

serve-debug:
	deno run --unstable --no-check --watch --allow-all mod.ts serve themes/book/config.ts

build:
	deno run --unstable --no-check --allow-all mod.ts build examples/book/config.ts

build-debug:
	deno run --no-check --unstable --allow-all mod.ts build examples/book/config.ts

install:
	deno install --no-check --allow-all --force mod.ts

compile:
	deno compile --no-check --allow-all --output ~/.local/bin/bok mod.ts
