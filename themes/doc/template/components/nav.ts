export default function(site, page, pages) {
  const keyPages = pages.map(p => ({
    link: p.link,
    key: p.params.key,
    headers: p.tokens
      .filter(t => t.type === 'heading')
      .map(({ type, depth, text }) => ({ type, depth, text })),
  }));
  console.log(keyPages[5]);

  return `
    <div class="sidebar">
      <header>Doc Theme</header>
      <nav>
        <ul>
          <li>sdjhfkhsdf</li>
          <li>sdjhfkhsdf</li>
          <li>sdjhfkhsdf</li>
          <li>sdjhfkhsdf</li>
          <li>sdjhfkhsdf</li>
          <li>sdjhfkhsdf</li>
          <li>sdjhfkhsdf</li>
          <li>sdjhfkhsdf</li>
          <li>sdjhfkhsdflallaalal</li>
          <li>sdjhfkhsdf</li>
          <li>sdjhfkhsdf</li>
          <li>sdjhfkhsdf</li>
          <li>sdjhfkhsdf</li>
          <li>sdjhfkhsdf</li>
          <li>sdjhfkhsdf</li>
          <li>sdjhfkhsdf</li>
          <li>sdjhfkhsdf</li>
          <li>sdjhfkhsdf</li>
          <li>sdjhfkhsdf</li>
          <li>sdjhfkhsdf</li>
          <li>sdjhfkhsdf</li>
          <li>sdjhfkhsdf</li>
          <li>sdjhfkhsdf</li>
          <li>sdjhfkhsdf</li>
          <li>sdjhfkhsdf</li>
          <li>sdjhfkhsdf</li>
          <li>sdjhfkhsdf</li>
          <li>sdjhfkhsdf</li>
        </ul>
      </nav>
    </div>
  `;
}
