const { args } = Deno;

import { build } from './core/build.ts';
import { readFileStrSync } from 'https://deno.land/std/fs/mod.ts';
import { parse } from 'https://deno.land/std/flags/mod.ts';

function serveSite(sitePath, site) {
  build(sitePath, site);
}

function buildSite(sitePath, site) {
  build(sitePath, site);
}

function help() {
  console.log('help');
}


const siteConfigPath = args[0];
const sitePath = Deno.realpathSync(siteConfigPath);
const site = readFileStrSync(sitePath);
const siteObj = JSON.parse(site);

if (true) {
  serveSite(sitePath, siteObj);
} else if (false) {
  buildSite(sitePath, siteObj);
} else {
  help();
}
