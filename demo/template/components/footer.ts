export default function(site) {
  return `
    <footer>
      <div class="social">
        <ul>
          <li>
            <a href="${site.links.github}">
              <img
                class="social-icon"
                src="/assets/images/svg/github.svg"
                alt="github"
                width="auto"
                height="20"
              />
            </a>
          </li>

          <li>
            <a href="${site.links.stackoverflow}">
              <img
                class="social-icon"
                src="/assets/images/svg/stackoverflow.svg"
                alt="stackoverflow"
                width="auto"
                height="20"
              />
            </a>
          </li>

          <li>
            <a href="${site.links.linkedin}">
              <img
                class="social-icon"
                src="/assets/images/svg/linkedin.svg"
                alt="linkedin"
                width="auto"
                height="20"
              />
            </a>
          </li>

          <li>
            <a href="${site.links.rss}">
              <img
                class="social-icon"
                src="/assets/images/svg/rss.svg"
                alt="rss"
                width="auto"
                height="20"
              />
            </a>
          </li>
        </ul>
      </div>

      <img
        class="footer__image"
        src="/assets/images/gif/party-parrot.gif"
        alt="Party Parrot"
        height="42"
        width="42"
      />
    </footer>
  `;
}
