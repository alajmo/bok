export default function(site) {
  return `
    <div class="content-list">
    ${site.data.posts.map(
      post => `
        <div>
            <a href="/{{ post.path }}">
                <h3>
                    {{ post.title }}
                </h3>

                <div class="timestamp">
                    <div datetime="{{ date }}" title="{{ date }}">
                        <p>
                            {{ post.date | date('MMM DD, YYYY')  }}
                        </p>
                    </div>
                </div>

                <div class="post__snippet">
                    <p>
                    {{ post.snippet }}
                    </p>
                </div>
            </a>
        </div>`
    )}
    </div>
  `;
}
