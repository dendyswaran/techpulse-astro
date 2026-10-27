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

  const lastBuildDate =
    articles.length > 0
      ? articles[0].data.pubDate.toUTCString()
      : new Date().toUTCString();

  const itemsXml = articles
    .map((article) => {
      const url = `${SITE}/articles/${article.slug}`;
      const coverUrl = article.data.coverImage
        ? `${SITE}${article.data.coverImage}`
        : null;
      const categories = Array.from(new Set([
        article.data.category,
        ...(article.data.tags || []),
        ...(article.data.cveIds || []),
      ]))
        .map((c) => `      <category>${escapeXml(c)}</category>`)
        .join('\n');

      const briefSummary =
        article.data.tldr && article.data.tldr.length > 0
          ? `${article.data.subtitle} — Key takeaways: ${article.data.tldr.join(' ')}`
          : article.data.subtitle;

      const mediaTag = coverUrl
        ? `\n      <enclosure url="${coverUrl}" type="image/webp" length="95000" />\n      <media:content url="${coverUrl}" medium="image" type="image/webp" width="1200" height="675" />`
        : '';

      return `    <item>
      <title>${escapeXml(article.data.title)}</title>
      <link>${url}</link>
      <guid isPermaLink="true">${url}</guid>
      <pubDate>${article.data.pubDate.toUTCString()}</pubDate>
      <dc:creator>${escapeXml(article.data.author.name)}</dc:creator>
      <description>${escapeXml(briefSummary)}</description>
${categories}${mediaTag}
    </item>`;
    })
    .join('\n');

  const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss
  version="2.0"
  xmlns:atom="http://www.w3.org/2005/Atom"
  xmlns:dc="http://purl.org/dc/elements/1.1/"
  xmlns:media="http://search.yahoo.com/mrss/"
>
  <channel>
    <title>TechPulse — Systems, AI &amp; Security Advisories</title>
    <link>${SITE}/</link>
    <description>Independent engineering reporting on software systems, foundation models, and runtime security advisories (Node.js, Bun, PHP, Java SE, AI Agent Infrastructure).</description>
    <language>en-us</language>
    <lastBuildDate>${lastBuildDate}</lastBuildDate>
    <atom:link href="${SITE}/rss.xml" rel="self" type="application/rss+xml" />
${itemsXml}
  </channel>
</rss>`;

  return new Response(rss, {
    headers: {
      'Content-Type': 'application/rss+xml; charset=utf-8',
    },
  });
};
