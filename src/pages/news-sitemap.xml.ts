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

  const entries = articles
    .map((article) => {
      const loc = `${SITE}/articles/${article.slug}`;
      const pubDate = article.data.pubDate.toISOString();
      const keywords = Array.from(new Set([
        ...(article.data.tags || []),
        ...(article.data.cveIds || []),
      ])).join(', ');
      const imageBlock = article.data.coverImage
        ? `\n    <image:image>
      <image:loc>${SITE}${article.data.coverImage}</image:loc>
      <image:title>${escapeXml(article.data.title)}</image:title>
    </image:image>`
        : '';

      return `  <url>
    <loc>${loc}</loc>
    <news:news>
      <news:publication>
        <news:name>TechPulse</news:name>
        <news:language>en</news:language>
      </news:publication>
      <news:publication_date>${pubDate}</news:publication_date>
      <news:title>${escapeXml(article.data.title)}</news:title>
      <news:keywords>${escapeXml(keywords)}</news:keywords>
    </news:news>${imageBlock}
  </url>`;
    })
    .join('\n');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset
  xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
  xmlns:news="http://www.google.com/schemas/sitemap-news/0.9"
  xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"
>
${entries}
</urlset>`;

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
    },
  });
};
