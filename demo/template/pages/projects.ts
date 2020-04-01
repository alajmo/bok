import Header from '../components/header.ts';
import Footer from '../components/footer.ts';
import ProjectList from '../components/project-list.ts';

export default function(site, posts) {
  return `
    <div class="root">
      ${Header(site)}

      <main>
        ${ProjectList(site, posts)}
      </main>

      ${Footer(site)}
    </div>
  `;
}
