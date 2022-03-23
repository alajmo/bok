export default function (site, content) {
  return `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="description" content="${site.params.description}">
        <meta name="author" content="${site.params.author}">

        <title>${site.params.title}</title>

        <meta name="viewport" content="width=device-width, initial-scale=1" />

        <link rel="stylesheet" type="text/css" href="/assets/css/style.css" />
      </head>

      <body>
        ${content}
        <script defer src="/assets/js/index.js"></script>
      </body>
    </html>
  `;
}
