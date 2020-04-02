import Header from '../components/header.ts';
import Footer from '../components/footer.ts';

export default function(site, page) {
  return `
    <div class="root">
      ${Header(site)}

      <main>
        <h1>${page.params.title}</h1>
        ${page.htmlContent}
      </main>

      ${Footer(site)}
    </div>
  `;
}
