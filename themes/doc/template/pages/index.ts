import Nav from '../components/nav.ts';

export default function (site, page, pages) {
  return `
    <div class="site">
      ${Nav(site)}

      <main>
        ${page.htmlContent}
      </main>
    </div>
  `;
}
