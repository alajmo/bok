import { generateToc, getGroups, parseHeaderLink } from '../components/toc.ts';

export default function (site, page, pages, beforeBuild) {
  /* const toc = generateToc(beforeBuild); */
  const toc = '';

  return `
    <div class="sidebar">
      <header>Doc Theme</header>
      <nav>
        ${toc}
      </nav>
    </div>
  `;
}
