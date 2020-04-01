export default function(site, projects) {
  return `
    <div class="project-list">
      <section>
        ${projects
          .map(
            p => `
            <article>
                <h3>
                  ${p.title}
                </h3>
                <p>
                  ${p.htmlContent}
                </p>
            </article>
            `,
          )
          .join(' ')}
      </section>
    </div class="project-list">
  `;
}
