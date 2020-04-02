import Header from '../components/header.ts';
import Footer from '../components/footer.ts';
import { fullDateFormat } from '../util.ts';

export default function(site, page) {
  return `
    <div class="root">
      ${Header(site)}

      <main>
        <div class="post">
            <h1>${page.params.title}</h1>

            <div class="post__info">
                <div class="timestamp">
                    <time
                      datetime="${page.params.date}"
                      title="${page.params.date}">
                      ${fullDateFormat(page.params.date)}
                    </time>
                </div>

                <div class="opacity-dark">
                    &nbsp; &bull; &nbsp;
                </div>

                <div class="timestamp">
                    ${page.numWords} words
                </div>
            </div>

            <article>
              ${page.htmlContent}
            </article>
        </div>

      </main>

      ${Footer(site)}
    </div>
  `;
}
