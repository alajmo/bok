import { generateToc, getGroups, parseHeaderLink } from '../components/toc.ts';

export default function (site, page, pages, pageLinks) {
  const groups = getGroups(pageLinks, [
    {
      type: 'header',
      text: 'Background',
    },
    {
      type: 'page',
      text: '/background/philosophy',
    },
    {
      type: 'page',
      text: '/background/background',
    },
  ]);

  /* console.log(groups[0].pages[0]); */

  const headers = groups.map(p => ({
    header: p.header,
    headers: p.pages
      .filter(t => t.type === 'heading')
      .map(t => ({
        text: t.text,
        depth: t.depth,
        link: `${p.link}#${parseHeaderLink(t.text)}`,
      })),
  }));
  /* console.log(pageLinks.get(pages[0].link)); */

  console.log(groups);
  /* console.log(headers); */

  const toc = generateToc(headers);

  return `
    <div class="sidebar">
      <header>Doc Theme</header>
      <nav>
        ${toc}
      </nav>
    </div>
  `;
}
