import Header from '../components/header.ts';
import Footer from '../components/footer.ts';
import ProjectList from '../components/project-list.ts';

export default function(site, page, pages) {
  const projects = pages
    .filter(p => p.params.type === 'project')
    .map(p => ({
      title: p.params.title,
      link: p.link,
      htmlContent: p.htmlContent,
    }));

  return `
    <div class="root">
      ${Header(site)}

      <main>
        ${ProjectList(site, projects)}
      </main>

      ${Footer(site)}
    </div>
  `;
}
