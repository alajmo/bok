import Header from '../components/header.ts';
import Footer from '../components/footer.ts';
import PostList from '../components/post-list.ts';

export default function(site, page, pages) {
  const posts = pages
    .filter(p => p.params.type === 'post')
    .map(p => ({
      title: p.params.title,
      date: p.params.date,
      link: p.link,
    }));

  const years = Array.from(
    new Set(
      pages
        .filter(p => p.params.type === 'post')
        .map(p => new Date(p.params.date).getFullYear()),
    ),
  )
    .sort()
    .reverse();

  return `
    <div class="root">
      ${Header(site)}

      <main>
        ${PostList(site, posts, years)}
      </main>

      ${Footer(site)}
    </div>
  `;
}
