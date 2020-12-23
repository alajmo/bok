import base from './base.ts';

export default function (site, page, pages) {
  return base(
    site,

    `
      <h1>Main Header</h2>
      <div>
        ${page.htmlContent}
      </div>
    `,
  );
}
