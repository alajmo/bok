export default function(content) {
  return `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="description" rel="shortcut icon" content="" />

        <link rel="icon" href="/assets/img/ico/favicon.ico" />
        <link rel="apple-touch-icon-precomposed" href="/assets/img/ico/favicon.ico" />
        <meta name="msapplication-TileImage" content="/assets/img/ico/favicon.ico" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />

        <link rel="stylesheet" type="text/css" href="/assets/css/reset.css" />
        <link rel="stylesheet" type="text/css" href="/assets/css/prism.css" />
        <link rel="stylesheet" type="text/css" href="/assets/fonts/fonts.css" />
        <link rel="stylesheet" type="text/css" href="/assets/css/variables.css" />
        <link rel="stylesheet" type="text/css" href="/assets/css/tufte.css" />
        <link rel="stylesheet" type="text/css" href="/assets/css/base.css" />
      </head>

      <body>
        <div class="book">
          ${content}
        </div>

        <script defer src="/assets/js/index.js"></script>
        <script defer src="/assets/js/prism.min.js"></script>
      </body>
    </html>
  `;
}
