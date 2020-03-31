import Header from './header.ts';
import Footer from './footer.ts';

export default function(site, page, pages) {
  return `
    <div class="root">
      ${Header(site)}

      ${Footer(site)}
    </div>
  `;
}
