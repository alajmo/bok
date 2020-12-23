.PHONY: serve serve-debug build build-debug

serve:
	deno run --unstable --allow-all mod.ts serve themes/doc/config.ts

serve-debug:
	deno run --no-check --unstable --watch --allow-all mod.ts serve themes/doc/config.ts

build:
	deno run --unstable --allow-all mod.ts build examples/book/config.ts

build-debug:
	deno run --no-check --unstable --allow-all mod.ts build examples/book/config.ts
