import Nav from '../components/nav.ts';

export default function (site, page, pages, pageLinks) {
  return `
    <div class="site">
      ${Nav(site, page, pages, pageLinks)}

      <main>
        ${page.htmlContent}
      </main>
    </div>
  `;
}
