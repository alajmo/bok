import { generateToc, getGroups, parseHeaderLink } from '../components/toc.ts';

export default function (site, page, pages, pageLinks, beforeBuild) {
  const toc = generateToc(beforeBuild);

  return `
    <div class="sidebar">
      <header>Doc Theme</header>
      <nav>
        ${toc}
      </nav>
    </div>
  `;
}
