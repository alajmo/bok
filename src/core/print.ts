import { Table } from '../../deps.ts';
import { Site } from './config.ts';
import { Page } from './page.ts';

export default { build };

function build(site: Site, pages: Page[]) {
  new Table()
    .header(['', 'EN'])
    .body([
      ['# Pages', pages.length],
      /* ['# Sitemaps', '1'], */
    ])
    /* .maxColWidth(10) */
    .padding(1)
    .indent(1)
    .border(true)
    .render();
}
