import { generateToc, getGroups, parseHeaderLink } from '../components/toc.ts';

export default function(site, page, pages, pageLinks, beforeBuild) {
  /* const toc = generateToc(headers); */
  /*       ${toc} */

  return `
    <div class="sidebar">
      <header>Doc Theme</header>
      <nav>
      </nav>
    </div>
  `;
}
