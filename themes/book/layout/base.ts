export default function ({ rootUrl }: { rootUrl: string }, content: string) {
  return `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="description" rel="shortcut icon" content="" />

        <link rel="icon" href="${rootUrl}/assets/img/ico/favicon.ico" />
        <link rel="apple-touch-icon-precomposed" href="${rootUrl}/assets/img/ico/favicon.ico" />
        <meta name="msapplication-TileImage" content="${rootUrl}/assets/img/ico/favicon.ico" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />

        <link rel="stylesheet" type="text/css" href="${rootUrl}/assets/css/reset.css" />
        <link rel="stylesheet" type="text/css" href="${rootUrl}/assets/css/prism.css" />
        <link rel="stylesheet" type="text/css" href="${rootUrl}/assets/fonts/fonts.css" />
        <link rel="stylesheet" type="text/css" href="${rootUrl}/assets/css/variables.css" />
        <link rel="stylesheet" type="text/css" href="${rootUrl}/assets/css/general.css" />
        <link rel="stylesheet" type="text/css" href="${rootUrl}/assets/css/chrome.css" />
        <link rel="stylesheet" type="text/css" href="${rootUrl}/assets/css/base.css" />
        <link rel="stylesheet" type="text/css" href="${rootUrl}/assets/css/typography.css" />
        <link rel="stylesheet" type="text/css" href="${rootUrl}/assets/css/list.css" />
      </head>

      <body>
        <div class="book">
          ${content}
        </div>

        <script defer src="${rootUrl}/assets/js/index.js"></script>
        <script defer src="${rootUrl}/assets/js/prism.min.js"></script>
      </body>
    </html>
  `;
}
