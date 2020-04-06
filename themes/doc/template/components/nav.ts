import { generateToc, getGroups, parseHeaderLink } from '../components/toc.ts';

export default function (site, page, pages, pageLinks) {
  const groups = getGroups(pageLinks, [
    {
      header: 'Background',
      pages: [
        'intro',
        'philosophy',
      ],
    },
  ]);
  console.log(groups);

  const headers = pages.map(p => ({
    key: p.params.key,
    headers: p.tokens
      .filter(t => t.type === 'heading')
      .map(t => ({
        text: t.text,
        depth: t.depth,
        link: `${p.link}#${parseHeaderLink(t.text)}`,
      })),
  }));
  console.log(pageLinks.get(pages[0].link));

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
