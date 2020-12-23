.PHONY: serve serve-debug build build-debug

serve:
	deno run --unstable --allow-all ./src/main.ts serve themes/doc/site.ts

serve-debug:
	deno run --no-check --unstable --allow-all ./src/main.ts serve themes/doc/site.ts

build:
	deno run --unstable --allow-all ./src/main.ts build themes/doc/site.ts

build-debug:
	deno run --no-check --unstable --allow-all ./src/main.ts build themes/doc/site.ts
