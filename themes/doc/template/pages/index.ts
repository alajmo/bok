import Nav from '../components/nav.ts';

export default function (site, page, pages, pageLinks, beforeBuild) {
  return `
    <div class="site">
      ${Nav(site, page, pages, pageLinks, beforeBuild)}

      <main>
        ${page.htmlContent}
      </main>
    </div>
  `;
}
