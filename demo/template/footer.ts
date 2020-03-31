export default function(site) {
  return `
    <footer>
      <div class="social">
          <ul>
              <li>
                  <a href="${site.links.github}">
                      <i class="fa fa-github" aria-hidden="true"></i>
                  </a>
              </li>

              <li>
                  <a href="${site.links.stackoverflow}">
                      <i class="fa fa-stack-overflow" aria-hidden="true"></i>
                  </a>
              </li>

              <li>
                  <a href="${site.links.linkedin}">
                      <i class="fa fa-linkedin" aria-hidden="true"></i>
                  </a>
              </li>

              <li>
                  <a href="${site.links.rss}">
                      <i class="fa fa-rss" aria-hidden="true"></i>
                  </a>
              </li>
          </ul>
      </div>

      <img
        class="footer__image"
        src="assets/images/gif/party-parrot.gif"
        alt="Party Parrot"
        height="42"
        width="42"
      />
    </footer>
  `;
}
