function dateFormat(date) {
  const months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];

  const d = new Date(date);
  return `${months[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`;
}

export default function(site, posts) {
  return `
    <div class="index">
      <div class="content-list">
        ${posts
          .map(
            p => `
            <div>
                <a href="${p.link}">
                    <h3>
                      ${p.title}
                    </h3>

                    <div class="timestamp">
                        <div datetime="${p.date}" title="${p.date}">
                            <p>
                              ${dateFormat(p.date)}
                            </p>
                        </div>
                    </div>

                    <div class="post__snippet">
                        <p>
                          ${p.excerpt}
                        </p>
                    </div>
                </a>
            </div>`,
          )
          .join(' ')}
      </div>
    </div>
  `;
}
