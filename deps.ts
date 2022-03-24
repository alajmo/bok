export * as fs from "https://deno.land/std@0.131.0/fs/mod.ts";
export * as path from "https://deno.land/std@0.131.0/path/mod.ts";
export * as log from "https://deno.land/std@0.131.0/log/mod.ts";
export * as http from "https://deno.land/std@0.131.0/http/mod.ts";
// TODO: Upgrade https://doc.deno.land/deno/stable@v1.18.2/~/Deno.upgradeWebSocket
export * as ws from "https://deno.land/std@0.83.0/ws/mod.ts";

import { Command } from "https://deno.land/x/cliffy@v0.22.2/command/mod.ts";
import { Table } from "https://deno.land/x/cliffy@v0.22.2/table/mod.ts";
import {
  Confirm,
  Input,
  prompt,
  Select,
} from "https://deno.land/x/cliffy@v0.22.2/prompt/mod.ts";
import MarkdownIt from "https://dev.jspm.io/markdown-it@12.3.2";
import MarkdownItAnchor from "https://dev.jspm.io/markdown-it-anchor@8.4.1";

export { Command, Confirm, Input, MarkdownIt, MarkdownItAnchor, prompt, Select, Table };
