#!/usr/bin/env bun
import { Command } from "commander";
import { select, input } from "@inquirer/prompts";
import { Bok } from "./src/mod.ts";

const isMain = import.meta.path === Bun.main;

if (isMain) {
  const bok = Bok();
  const program = new Command();

  program
    .name("bok")
    .version("0.2.0")
    .description("Static Site Generator");

  program
    .command("init")
    .description("Initialize a site in current directory")
    .option("--mode <string>", "Create or extend a theme")
    .option("--theme <string>", "bok theme to base site on")
    .option("--theme-path <string>", "Path to site config")
    .action(async (options: any) => {
      const mode: string = options.mode ??
        (await select({
          message: "Extend or create new site from scratch",
          choices: [
            { name: "create", value: "create" },
            { name: "extend", value: "extend" },
          ],
        }));

      const theme: string = options.theme ??
        (await select({
          message: "Choose template boilerplate",
          choices: [
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
          (await input({ message: "Enter absolute path to theme config" }));
      }

      bok.init(mode, theme, themePath);
    });

  program
    .command("build")
    .description("Build a static website")
    .argument("[config]", "Path to config file")
    .action((config: string, options: any) => {
      bok.build(options, config);
    });

  program
    .command("watch")
    .description("Build a static website and rebuild on file changes")
    .argument("[config]", "Path to config file")
    .action((config: string, options: any) => {
      bok.watch(options, config);
    });

  program
    .command("serve")
    .description("Build a static website, serve it and rebuild on file changes")
    .option("--port <port>", "Specify local port of HTTP server", parseInt)
    .option("--ws-port <port>", "Specify local port of websocket server", parseInt)
    .option("--reload", "Live-reload browser on change")
    .argument("[config]", "Path to config file")
    .action((config: string, options: any) => {
      bok.serve(options, config);
    });

  program
    .command("clean")
    .description("Clean output directory")
    .argument("[config]", "Path to config file")
    .action((config: string, options: any) => {
      bok.clean(options, config);
    });

  program.parse(process.argv);
}
