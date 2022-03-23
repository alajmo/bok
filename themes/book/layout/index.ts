import base from "./base.ts";

export default function (site, page, pages) {
  return base({ rootUrl: site.rootUrl }, `
    <script type="text/javascript">
      const html = document.querySelector('html');
      const showSidebar = window.sessionStorage.getItem('showSidebar');
      html.setAttribute('data-show-sidebar', showSidebar);
    </script>

    <aside id="sidebar" class="sidebar">
      ${page.toc}
    </aside>

    <main id="content" class="content">
      <div class="menu">
          <button title="Toggle sidebar"
                  type="button"
                  class="icon-button"
                  onclick="sidebar.toggle();">
            <img
              class="menu-icon"
              src="${site.rootUrl}/assets/img/svg/menu.svg"
              alt="menu"
              width="auto"
              height="20"
            />
          </button>
      </div>

      <div class="page">
        ${PrevPageNav({ rootUrl: site.rootUrl, prevUrl: page.prevPage })}

        <div class="page-content">
          ${page.htmlContent}
        </div>

        ${NextPageNav({ rootUrl: site.rootUrl, nextUrl: page.nextPage })}
      </div>
    </main>
  `);
}

function PrevPageNav({ rootUrl, prevUrl }) {
  return prevUrl
    ? `
    <a href="${rootUrl}${prevUrl}" id="page-nav-prev" class="page-nav page-nav-prev">
      <img
        class="page-nav-icon"
        src="${rootUrl}/assets/img/svg/chevron-left.svg"
        alt="Previous chapter"
        width="auto"
        height="40"
      />
    </a>
  `
    : `<div class="page-nav page-nav-prev"></div>`;
}

function NextPageNav({ rootUrl, nextUrl }) {
  return nextUrl
    ? `
    <a href="${rootUrl}${nextUrl}" id="page-nav-next" class="page-nav page-nav-next">
      <img
        class="page-nav-icon"
        src="${rootUrl}/assets/img/svg/chevron-right.svg"
        alt="Previous chapter"
        width="auto"
        height="40"
      />
    </a>
  `
    : `<div class="page-nav page-nav-next"></div>`;
}
