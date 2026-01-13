import Table from "cli-table3";
import { Site } from "./config.ts";
import { Page } from "./page.ts";

export default { build };

function build(site: Site, pages: Page[]) {
  const table = new Table({
    head: ["", "EN"],
    style: {
      head: [],
      border: [],
    },
  });

  table.push(
    ["# Pages", pages.length],
  );

  console.log(table.toString());
}
