export * as fs from "https://deno.land/std@0.131.0/fs/mod.ts";
export * as path from "https://deno.land/std@0.131.0/path/mod.ts";
export * as log from "https://deno.land/std@0.131.0/log/mod.ts";
export * as http from "https://deno.land/std@0.131.0/http/mod.ts";
// TODO: Upgrade https://doc.deno.land/deno/stable@v1.18.2/~/Deno.upgradeWebSocket
export * as ws from "https://deno.land/std@0.83.0/ws/mod.ts";

import { Command } from "https://deno.land/x/cliffy@v0.16.0/command/mod.ts";
import { Table } from "https://deno.land/x/cliffy@v0.16.0/table/mod.ts";
import {
  Confirm,
  Input,
  prompt,
  Select,
} from "https://deno.land/x/cliffy@v0.16.0/prompt/mod.ts";
import MarkdownIt from "https://dev.jspm.io/markdown-it@11.0.1";

export { Command, Confirm, Input, MarkdownIt, prompt, Select, Table };
