import Header from './header.ts';
import Footer from './footer.ts';
import PostList from './post-list.ts';

export default function(site, page) {
  console.log(site);

  return `
    <div class="root">
      ${Header(site)}

      ${PostList(site)}

      ${Footer(site)}
    </div>
  `;
}
