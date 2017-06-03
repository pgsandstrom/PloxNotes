import React from 'react';
import ReactDOMServer from 'react-dom/server';

import App from './../../client/src/app';

export default (server) => {
  server.get('/', (req, res, next) => {
    // eslint-disable-next-line react/jsx-filename-extension
    try {
      
      const reactHtml = ReactDOMServer.renderToString(<App />);
      // TODO format html? Keep in file?
      const html = `
      <!DOCTYPE html>
      <html lang="sv">
      <head>
      <meta name="viewport" content="width=device-width, user-scalable=no">
      <meta charset="utf-8"/>
      <title>Bös</title>
      <link rel="apple-touch-icon" sizes="57x57" href="/apple-icon-57x57.png">
      <link rel="apple-touch-icon" sizes="60x60" href="/apple-icon-60x60.png">
      <link rel="apple-touch-icon" sizes="72x72" href="/apple-icon-72x72.png">
      <link rel="apple-touch-icon" sizes="76x76" href="/apple-icon-76x76.png">
      <link rel="apple-touch-icon" sizes="114x114" href="/apple-icon-114x114.png">
      <link rel="apple-touch-icon" sizes="120x120" href="/apple-icon-120x120.png">
      <link rel="apple-touch-icon" sizes="144x144" href="/apple-icon-144x144.png">
      <link rel="apple-touch-icon" sizes="152x152" href="/apple-icon-152x152.png">
      <link rel="apple-touch-icon" sizes="180x180" href="/apple-icon-180x180.png">
      <link rel="icon" type="image/png" sizes="192x192" href="/android-icon-192x192.png">
      <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png">
      <link rel="icon" type="image/png" sizes="96x96" href="/favicon-96x96.png">
      <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png">
      <link rel="manifest" href="/manifest.json">
      <meta name="msapplication-TileColor" content="#ffffff">
      <meta name="msapplication-TileImage" content="/ms-icon-144x144.png">
      <meta name="theme-color" content="#ffffff">
      </head>
      <body>
      <div id="content">${reactHtml}</div>
      <script src="/assets/bundle_dev.js"></script>
      </body>
      </html>`;
      res.send(html);
      next();
    } catch (e) {
      console.log(`error: ${e}`);
      console.log(`error: ${e.message}`);
      console.log(`error: ${e.stack}`);
    }
  });
};
