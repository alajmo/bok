import base from './base.ts';
import Nav from '../components/nav.ts';

export default function (site, page, pages, opts) {
  return base(`
    <div class="site">
      ${Nav(site, page, pages, opts)}

      <main>
        ${page.htmlContent}
      </main>
    </div>
  `);
}
