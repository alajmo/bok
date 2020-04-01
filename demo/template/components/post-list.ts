import { monthDateFormat } from '../util.ts';

export default function(site, posts, years) {
  return `
    <div class="article-list">

    ${years
      .map(
        year => `
        <h3 class="underline">
          ${year}
        </h3>

        <div class="article-list__items">
          ${posts
            .filter(p => year === new Date(p.date).getFullYear())
            .map(
              p => `
                <a href="${p.link}">
                  <div class="article-list__item">
                    <div class="article-list__item-title">
                      ${p.title}
                    </div>
                    <div class="article-list__item-time">
                      <div class="time" datetime="${p.date}" title="${p.date}">
                        ${monthDateFormat(p.date)}
                      </div>
                    </div>
                  </div>
                </a>
              `,
            )
            .join(' ')}
        </div>
      `,
      )
      .join(' ')}
    </div>
  `;
}
