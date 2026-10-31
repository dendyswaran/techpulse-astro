import type { APIRoute } from 'astro';
import { getSortedTips, sourceHandle } from '../../data/tips';

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
  const tips = await getSortedTips();
  const lastBuildDate = tips.length > 0 ? tips[0].data.pubDate.toUTCString() : new Date().toUTCString();

  const itemsXml = tips
    .map((tip) => {
      const url = `${SITE}/tips/${tip.slug}`;
      const categories = tip.data.tags.map((t) => `      <category>${escapeXml(t)}</category>`).join('\n');
      const credits = tip.data.sources
        .filter((s) => s.platform !== 'web')
        .map((s) => sourceHandle(s))
        .join(', ');
      const desc = credits ? `${tip.data.description} (Inspired by ${credits}.)` : tip.data.description;
      return `    <item>
      <title>${escapeXml(`Tip ${tip.label}: ${tip.data.title}`)}</title>
      <link>${url}</link>
      <guid isPermaLink="true">${url}</guid>
      <pubDate>${tip.data.pubDate.toUTCString()}</pubDate>
      <dc:creator>${escapeXml(tip.data.author.name)}</dc:creator>
      <description>${escapeXml(desc)}</description>
${categories}
    </item>`;
    })
    .join('\n');

  const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:dc="http://purl.org/dc/elements/1.1/">
  <channel>
    <title>TechPulse Daily Tips — Prompting &amp; AI Agent Orchestration</title>
    <link>${SITE}/tips</link>
    <description>Short, tested tips on prompting coding agents and orchestrating AI agents efficiently, curated daily with credit to the original authors.</description>
    <language>en-us</language>
    <lastBuildDate>${lastBuildDate}</lastBuildDate>
    <atom:link href="${SITE}/tips/rss.xml" rel="self" type="application/rss+xml" />
${itemsXml}
  </channel>
</rss>`;

  return new Response(rss, { headers: { 'Content-Type': 'application/rss+xml; charset=utf-8' } });
};
