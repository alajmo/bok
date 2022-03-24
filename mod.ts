import { Command, Confirm, Input, log, prompt, Select } from "./deps.ts";
import { Bok } from "./src/mod.ts";

if (import.meta.main) {
  const bok = Bok();

  const init = new Command()
    .description("Initialize a site in current directory")
    .option("--mode <string>", "Create or extend a theme")
    .option("--theme <string>", "bok theme to base site on")
    .option("--theme-path <string>", "Path to site config")
    .action(async (options: any) => {
      const mode: string = options.mode ??
        (await Select.prompt({
          message: "Extend or create new site from scratch",
          options: [
            { name: "create", value: "create" },
            { name: "extend", value: "extend" },
          ],
        }));

      const theme: string = options.theme ??
        (await Select.prompt({
          message: "Choose template boilerplate",
          options: [
            { name: "basic (bare minimum to get started)", value: "basic" },
            { name: "book (a markdown book theme)", value: "book" },
            {
              name: "params path (provide absolute path to site config)",
              value: "path",
            },
          ],
        }));

      let themePath: string = "";
      if (theme === "path") {
        themePath = options.themePath ??
          (await Input.prompt("Enter absolute path to theme config"));
      }

      bok.init(mode, theme, themePath);
    });

  const build = new Command()
    .description("Build a static website")
    .arguments("[config]")
    .action((options: any, args: any) => {
      bok.build(options, args);
    });

  const watch = new Command()
    .description("Build a static website and rebuild on file changes")
    .arguments("[config]")
    .action((options: any, args: any) => {
      bok.watch(options, args);
    });

  const serve = new Command()
    .description("Build a static website, serve it and rebuild on file changes")
    .option("--port <port:number>", "Specify local port of HTTP server")
    .option("--ws-port <port:number>", "Specify local port of websocket server")
    .option("--reload <reload:boolean>", "Live-reload browser on change")
    .arguments("[config]")
    .action((options: any, args: any) => {
      bok.serve(options, args);
    });

  const clean = new Command()
    .description("Clean output directory")
    .arguments("[config]")
    .action((options: any, args: any) => {
      bok.clean(options, args);
    });

  await new Command()
    .name("bok")
    .version("0.1.1")
    .description("Static Site Generator")
    .command("init", init)
    .command("build", build)
    .command("watch", watch)
    .command("serve", serve)
    .command("clean", clean)
    .parse(Deno.args);
}
