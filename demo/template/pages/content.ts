import Header from '../components/header.ts';
import Footer from '../components/footer.ts';

export default function(site, page) {
  return `
    <div class="root">
      ${Header(site)}

      <main>
        ${page.htmlContent}
      </main>

      ${Footer(site)}
    </div>
  `;
}
