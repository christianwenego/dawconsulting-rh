import { APP_BASE_HREF } from '@angular/common';
import { CommonEngine } from '@angular/ssr';
import express from 'express';
import { fileURLToPath } from 'node:url';
import { dirname, join, resolve } from 'node:path';
import bootstrap from './src/main.server';

export function app(): express.Express {
  const server = express();

  const serverDistFolder = dirname(fileURLToPath(import.meta.url));
  const browserDistFolder = resolve(serverDistFolder, '../browser');
  const indexHtml = join(serverDistFolder, 'index.server.html');

  const commonEngine = new CommonEngine();

  server.set('view engine', 'html');
  server.set('views', browserDistFolder);

  /*
   * ============================================================
   * SEO RESOURCES
   * ============================================================
   *
   * These routes MUST be declared before the Angular SSR fallback.
   */

  // robots.txt
  server.get('/robots.txt', (_req, res) => {
    res
      .type('text/plain')
      .send(
        [
          'User-agent: *',
          'Allow: /',
          '',
          'Disallow: /admin',
          'Disallow: /dashboard',
          'Disallow: /applications',
          'Disallow: /login',
          'Disallow: /api/',
          '',
          'Sitemap: https://dawconsultinghr.com/sitemap.xml',
        ].join('\n')
      );
  });

  // sitemap.xml
  server.get('/sitemap.xml', (_req, res) => {
    const baseUrl = 'https://dawconsultinghr.com';

    const urls = [
      '/',
      '/services',
      '/services/recrutement-cameroun',
      '/services/gestion-paie-cameroun',
      '/services/externalisation-rh-cameroun',
      '/services/interim-placement-cameroun',
      '/services/audit-cnps-cameroun',
      '/emplois',
      '/contact',
    ];

    const today = new Date().toISOString().split('T')[0];

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset
  xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">

${urls
  .map(
    (url) => `  <url>
    <loc>${baseUrl}${url}</loc>
    <lastmod>${today}</lastmod>
  </url>`
  )
  .join('\n')}

</urlset>`;

    res
      .type('application/xml')
      .send(xml);
  });

  /*
   * ============================================================
   * STATIC FILES
   * ============================================================
   */

  server.get(
    '*.*',
    express.static(browserDistFolder, {
      maxAge: '1y',
    })
  );

  /*
   * ============================================================
   * ANGULAR SSR FALLBACK
   * ============================================================
   */

  server.get('*', (req, res, next) => {
    const { protocol, originalUrl, baseUrl, headers } = req;

    commonEngine
      .render({
        bootstrap,
        documentFilePath: indexHtml,
        url: `${protocol}://${headers.host}${originalUrl}`,
        publicPath: browserDistFolder,
        providers: [
          {
            provide: APP_BASE_HREF,
            useValue: baseUrl,
          },
        ],
      })
      .then((html) => res.send(html))
      .catch((err) => next(err));
  });

  return server;
}

function run(): void {
  const port = process.env['PORT'] || 4000;

  const server = app();

  server.listen(port, () => {
    console.log(
      `Node Express server listening on http://localhost:${port}`
    );
  });
}

run();