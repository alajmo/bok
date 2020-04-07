export { generateToc, getGroups, parseHeaderLink };

function getGroups(pageLinks, groups) {
  return groups.map(g => ({
    header: g.header,
    pages: g.pages.map(p => pageLinks.get(p)),
  }));
}

function generateToc(pages: any) {
  return `
  ${pages
    .map(
      (p: any) => `
<ul class="nav-list">
  <li class="nav-item">
    <div>${p.key}</div>
    ${pageList(p)}
  </li>
</ul>`,
    )
    .join('')}
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
