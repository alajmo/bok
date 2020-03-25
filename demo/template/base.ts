export default function(content) {
  return `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="description" rel="shortcut icon" content="" />

        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon-precomposed" href="/favicon.ico" />
        <meta name="msapplication-TileImage" content="/favicon.ico" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="stylesheet" type="text/css" href="/base.css" />
      </head>

      <body>${content}</body>

      <script defer src="/index.js"></script>
    </html>
  `;
}
