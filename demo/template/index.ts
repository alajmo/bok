import Header from './header.ts';
import Footer from './footer.ts';
import PostList from './post-list.ts';

export default function(site, page, pages) {
  const posts = pages
    .filter(p => p.types[0] === 'posts')
    .map(p => ({
      title: p.params.title,
      link: p.link,
      date: p.params.date,
      numWords: p.numWords,
      excerpt: p.excerpt,
    }));

  return `
    <div class="root">
      ${Header(site)}

      <main>
        ${PostList(site, posts)}
      </main>

      ${Footer(site)}
    </div>
  `;
}
