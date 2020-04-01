import Header from '../components/header.ts';
import Footer from '../components/footer.ts';

export default function(site, page, pages) {
  return `
    <div class="root">
      ${Header(site)}

      ${Footer(site)}
    </div>
  `;
}
