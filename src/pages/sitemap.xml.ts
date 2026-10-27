import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';

const SITE = 'https://www.techpulsenews.tech';

function escapeXml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

export const GET: APIRoute = async () => {
  const articles = (await getCollection('articles')).sort(
    (a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf()
  );

  const latestDate =
    articles.length > 0
      ? (articles[0].data.updatedDate || articles[0].data.pubDate).toISOString()
      : new Date().toISOString();

  const staticPages = [
    { path: '/', priority: '1.0', changefreq: 'hourly', lastmod: latestDate },
    { path: '/security', priority: '0.9', changefreq: 'daily', lastmod: latestDate },
    { path: '/category/ai', priority: '0.8', changefreq: 'daily', lastmod: latestDate },
    { path: '/category/security', priority: '0.8', changefreq: 'daily', lastmod: latestDate },
    { path: '/category/tech-update', priority: '0.8', changefreq: 'daily', lastmod: latestDate },
    { path: '/category/tech-news', priority: '0.8', changefreq: 'daily', lastmod: latestDate },
  ];

  const staticEntries = staticPages
    .map(
      (page) => `  <url>
    <loc>${SITE}${page.path}</loc>
    <lastmod>${page.lastmod}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`
    )
    .join('\n');

  const articleEntries = articles
    .map((article) => {
      const loc = `${SITE}/articles/${article.slug}`;
      const lastmod = (article.data.updatedDate || article.data.pubDate).toISOString();
      const imageBlock = article.data.coverImage
        ? `\n    <image:image>
      <image:loc>${SITE}${article.data.coverImage}</image:loc>
      <image:title>${escapeXml(article.data.title)}</image:title>
      <image:caption>${escapeXml(article.data.coverCaption || article.data.coverAlt || article.data.subtitle)}</image:caption>
    </image:image>`
        : '';

      return `  <url>
    <loc>${loc}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>${imageBlock}
  </url>`;
    })
    .join('\n');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset
  xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
  xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"
>
${staticEntries}
${articleEntries}
</urlset>`;

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
    },
  });
};
