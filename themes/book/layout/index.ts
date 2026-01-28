import type { Site } from "../../../src/core/config.ts";
import type { Page } from "../../../src/core/page.ts";
import base from "./base.ts";

export default function (site: Site, page: Page, _pages: Page[]) {
  const githubUrl = site.params?.github || null;
  const navTitle = site.params?.navTitle || site.params?.title || null;

  return base({ rootUrl: site.rootUrl, site, page }, `
    <script type="text/javascript">
      const html = document.querySelector('html');
      const showSidebar = window.sessionStorage.getItem('showSidebar');
      if (showSidebar !== null) {
        html.setAttribute('data-show-sidebar', showSidebar);
      }

      const savedTheme = window.localStorage.getItem('theme');
      if (savedTheme) {
        html.setAttribute('data-theme', savedTheme);
      } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
        html.setAttribute('data-theme', 'dark');
      }

      const focusMode = window.sessionStorage.getItem('focusMode');
      if (focusMode === 'true') {
        html.setAttribute('data-focus-mode', 'true');
      }
    </script>

    <aside id="sidebar" class="sidebar">
      ${page.toc || ''}
      <div class="sidebar-resize-handle"></div>
    </aside>

    <main id="content" class="content">
      <div class="menu">
        <div class="menu-left">
          <button title="Toggle sidebar (T)"
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

        ${navTitle ? `
        <div class="menu-center">
          <button type="button" class="menu-title" onclick="scrollToTop();">${navTitle}</button>
        </div>
        ` : ''}

        <div class="menu-right">
          <button title="Search (/ or Cmd+K)" type="button" class="icon-button" onclick="openSearch();">
            <svg class="menu-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="11" cy="11" r="8"/>
              <path d="M21 21l-4.35-4.35"/>
            </svg>
          </button>
          <button title="Toggle theme (D)" type="button" class="icon-button theme-toggle" onclick="toggleTheme();">
            <svg class="menu-icon theme-icon-light" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 3a1 1 0 0 1 1 1v1a1 1 0 1 1-2 0V4a1 1 0 0 1 1-1zm0 15a1 1 0 0 1 1 1v1a1 1 0 1 1-2 0v-1a1 1 0 0 1 1-1zm9-6a1 1 0 0 1-1 1h-1a1 1 0 1 1 0-2h1a1 1 0 0 1 1 1zM5 12a1 1 0 0 1-1 1H3a1 1 0 1 1 0-2h1a1 1 0 0 1 1 1zm14.07-5.66a1 1 0 0 1 0 1.41l-.71.71a1 1 0 1 1-1.41-1.41l.71-.71a1 1 0 0 1 1.41 0zM7.05 17.66a1 1 0 0 1 0 1.41l-.71.71a1 1 0 1 1-1.41-1.41l.71-.71a1 1 0 0 1 1.41 0zm11.9 1.41a1 1 0 0 1-1.41 0l-.71-.71a1 1 0 1 1 1.41-1.41l.71.71a1 1 0 0 1 0 1.41zM7.05 6.34a1 1 0 0 1-1.41 0l-.71-.71a1 1 0 0 1 1.41-1.41l.71.71a1 1 0 0 1 0 1.41zM12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8z"/>
            </svg>
            <svg class="menu-icon theme-icon-dark" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
            </svg>
          </button>
          <button title="Toggle focus mode (F)" type="button" class="icon-button focus-toggle" onclick="toggleFocusMode();">
            <svg class="menu-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="3"/>
              <path d="M12 5c-7 0-10 7-10 7s3 7 10 7 10-7 10-7-3-7-10-7z"/>
            </svg>
          </button>
          <a href="${site.rootUrl}/print.html" title="Print all pages" class="icon-button">
            <svg class="menu-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M6 9V2h12v7M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2M6 14h12v8H6z"/>
            </svg>
          </a>
          ${githubUrl ? `
          <a href="${githubUrl}" target="_blank" rel="noopener noreferrer" title="GitHub" class="icon-button">
            <svg class="menu-icon" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
            </svg>
          </a>
          ` : ''}
        </div>
      </div>

      <div class="page-wrapper">
        <div class="page">
          ${PrevPageNav({ rootUrl: site.rootUrl, prevUrl: page.prevPage })}

          <div class="page-content">
            ${page.htmlContent}
          </div>

          ${NextPageNav({ rootUrl: site.rootUrl, nextUrl: page.nextPage })}
        </div>

        ${page.rightToc ? `<aside class="right-toc">${page.rightToc}</aside>` : ""}
      </div>
    </main>
  `);
}

function PrevPageNav({ rootUrl, prevUrl }: { rootUrl: string; prevUrl?: string | null }) {
  return prevUrl
    ? `
    <a href="${rootUrl}${prevUrl}" id="page-nav-prev" class="page-nav page-nav-prev" title="Previous page (←)">
      <svg class="page-nav-icon" fill="none" viewBox="0 0 24 24" height="40" width="40" xmlns="http://www.w3.org/2000/svg">
        <path d="M14.7071 5.29289C15.0976 5.68342 15.0976 6.31658 14.7071 6.70711L9.41421 12L14.7071 17.2929C15.0976 17.6834 15.0976 18.3166 14.7071 18.7071C14.3166 19.0976 13.6834 19.0976 13.2929 18.7071L7.29289 12.7071C6.90237 12.3166 6.90237 11.6834 7.29289 11.2929L13.2929 5.29289C13.6834 4.90237 14.3166 4.90237 14.7071 5.29289Z" fill="currentColor"></path>
      </svg>
    </a>
  `
    : `<div class="page-nav page-nav-prev"></div>`;
}

function NextPageNav({ rootUrl, nextUrl }: { rootUrl: string; nextUrl?: string | null }) {
  return nextUrl
    ? `
    <a href="${rootUrl}${nextUrl}" id="page-nav-next" class="page-nav page-nav-next" title="Next page (→)">
      <svg class="page-nav-icon" fill="none" viewBox="0 0 24 24" height="40" width="40" xmlns="http://www.w3.org/2000/svg">
        <path d="M9.29289 18.7071C8.90237 18.3166 8.90237 17.6834 9.29289 17.2929L14.5858 12L9.29289 6.70711C8.90237 6.31658 8.90237 5.68342 9.29289 5.29289C9.68342 4.90237 10.3166 4.90237 10.7071 5.29289L16.7071 11.2929C17.0976 11.6834 17.0976 12.3166 16.7071 12.7071L10.7071 18.7071C10.3166 19.0976 9.68342 19.0976 9.29289 18.7071Z" fill="currentColor"></path>
      </svg>
    </a>
  `
    : `<div class="page-nav page-nav-next"></div>`;
}
