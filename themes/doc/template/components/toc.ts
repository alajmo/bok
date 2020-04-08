export { buildToc, generateToc, getGroups, parseHeaderLink };

function buildToc(site, pages, pageLinks) {
  return getGroups(pageLinks, [
    {
      type: 'directory',
      text: 'Background',

      pages: [
        {
          type: 'page',
          text: 'Philosophy',
          key: '/background/philosophy',
        },

        {
          type: 'page',
          text: 'Background',
          key: '/background/background',
        },

        {
          type: 'page',
          text: 'Intro',
          key: '/background/intro',
        },
      ],
    },

    {
      type: 'page',
      text: 'Setup',
      key: '/guide/setup',
    },
  ]);
}

function getGroups(pageLinks, groups) {
  return groups.map(g => {
    if (g.type === 'directory') {
      return {
        type: g.type,
        text: g.text,
        pages: g.pages.map(p => {
          const page = pageLinks.get(p.key);
          return getPage(page);
        }),
      };
    } else {
      const page = pageLinks.get(g.key);
      return getPage(page);
    }
  });
}

function getPage(page) {
  return {
    text: page.text,
    type: 'page',
    headers: page.tokens
      .filter(t => t.type === 'heading')
      .map(t => ({
        type: 'header',
        text: t.text,
        depth: t.depth,
        link: `${page.link}#${parseHeaderLink(t.text)}`,
      })),
  };
}

function generateToc(headers: any) {
  console.log(headers);
  return `<div>lala</div>`;

  return `
<ul class="nav-list">
  ${headers
    .map(
      (g: any) => `
  <li class="nav-item">
    ${
      g.type === 'directory'
        ? `
        ${g.text}
      `
        : `
        ${pageList(g)}
        `
    }
  </li>
`,
    )
    .join('')}
</ul>
  `;
}

function pageList(page: any) {
  return `
    <ul class="nav-page-list">
    ${page.headers
      .map(
        (header: any) => `
      <li class="nav-page-item-${header.depth}">
        <a href="${header.link}">${header.text}</a>
      </li>
  `,
      )
      .join('')}
    </ul>
  `;
}

function parseHeaderLink(text: string) {
  return text.toLowerCase().replace(/ /g, '-');
}
