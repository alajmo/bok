export default function(site) {
  return `
    <header>
      <div>
        <a href="/">
          <div class="logo">${site.author}</div>
        </a>
      </div>

      <div>
        <nav>
          <ul>
            <li>
              <a href="/articles">~/Posts</a>
            </li>
            <li>
              <a href="/projects">~/Projects</a>
            </li>
            <li>
              <a href="/about">~/About</a>
            </li>
          </ul>
        </nav>
      </div>
    </header>

  `;
}
