import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { getMergedCveRecords } from '../data/cves';

const SITE = 'https://www.techpulsenews.tech';

export const GET: APIRoute = async () => {
  const articles = (await getCollection('articles')).sort(
    (a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf()
  );

  const cveRecords = getMergedCveRecords(articles);

  const lines: string[] = [
    '# TechPulse — Systems, AI & Security Advisories',
    '',
    '> TechPulse (https://www.techpulsenews.tech) is an independent technical publication covering software systems, frontier AI models, autonomous agent architectures, and critical runtime security advisories (CVEs) across Node.js, Bun, PHP, Java SE, UEFI, Veeam, and cloud-native infrastructure.',
    '',
    '## Primary Sections',
    `- [Home & Editorial Stream](${SITE}/): Full chronological feed of dispatches and advisories.`,
    `- [CVE & Vulnerability Advisory Index](${SITE}/security): Structured matrix of active CVEs, CVSS scores, affected branches, and patched releases.`,
    `- [Artificial Intelligence](${SITE}/category/ai): Frontier models, agentic architectures, inference economics, and automated vulnerability discovery.`,
    `- [Security & Advisories](${SITE}/category/security): Zero-day exploits, CVE disclosures, cryptographic flaws, and runtime patches.`,
    `- [Systems & Runtimes](${SITE}/category/tech-update): Release notes and compiler/runtime engineering across Node.js, Bun, and Astro.`,
    `- [Industry & Infrastructure](${SITE}/category/tech-news): Enterprise AI deployment, S-1 filings, public-sector governance, and safety evaluations.`,
    '',
    '## Machine-Readable Feeds',
    `- Sitemap: ${SITE}/sitemap.xml`,
    `- Google News Sitemap: ${SITE}/news-sitemap.xml`,
    `- RSS 2.0 Feed: ${SITE}/rss.xml`,
    '',
    '## Dedicated CVE Technical Datasheets (/cve/[id])',
    '',
  ];

  for (const cve of cveRecords) {
    lines.push(
      `- [${cve.id} — ${cve.component} (${cve.severity}, CVSS ${cve.cvss})](${SITE}/cve/${cve.slugId}): Affected: ${cve.affected} | Patched: ${cve.patched}`
    );
  }

  lines.push('');
  lines.push('## Published Dispatches & Technical Advisories');
  lines.push('');

  for (const article of articles) {
    const url = `${SITE}/articles/${article.slug}`;
    const dateStr = article.data.pubDate.toISOString().split('T')[0];
    const cveMeta =
      article.data.cveIds && article.data.cveIds.length > 0
        ? ` | CVEs: ${article.data.cveIds.join(', ')}${article.data.cvss ? ` (CVSS ${article.data.cvss})` : ''}`
        : '';
    lines.push(`### [${article.data.title}](${url})`);
    lines.push(`- **Published**: ${dateStr} | **Author**: ${article.data.author.name} (${article.data.author.role})${cveMeta}`);
    lines.push(`- **Summary**: ${article.data.subtitle}`);
    if (article.data.tldr && article.data.tldr.length > 0) {
      lines.push(`- **Key Takeaways**: ${article.data.tldr.join(' ')}`);
    }
    lines.push('');
  }

  return new Response(lines.join('\n'), {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
    },
  });
};
