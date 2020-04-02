export default function(content) {
  return `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="description" rel="shortcut icon" content="" />

        <link rel="icon" href="/assets/images/ico/favicon.ico" />
        <link rel="apple-touch-icon-precomposed" href="/assets/images/ico/favicon.ico" />
        <meta name="msapplication-TileImage" content="/assets/images/ico/favicon.ico" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />

        <link rel="stylesheet" type="text/css" href="/assets/reset.css" />
        <link rel="stylesheet" type="text/css" href="/assets/prism.css" />
        <link rel="stylesheet" type="text/css" href="/assets/style.css" />

      </head>

      <body>${content}</body>

      <script defer src="/assets/index.js"></script>
      <script defer src="/assets/prism.min.js"></script>
    </html>
  `;
}
