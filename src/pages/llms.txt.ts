import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { getMergedCveRecords } from '../data/cves';
import { AI_MODELS } from '../data/models';
import { getSortedTips, sourceHandle } from '../data/tips';

const SITE = 'https://www.techpulsenews.tech';

export const GET: APIRoute = async () => {
  const articles = (await getCollection('articles')).sort(
    (a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf()
  );

  const cveRecords = getMergedCveRecords(articles);
  const tips = await getSortedTips();

  const lines: string[] = [
    '# TechPulse — Systems, AI & Security Advisories',
    '',
    '> TechPulse (https://www.techpulsenews.tech) is an independent technical publication covering software systems, frontier AI models, autonomous agent architectures, GPU VRAM sizing, and critical runtime security advisories (CVEs) across Node.js, Bun, PHP, Java SE, UEFI, Veeam, and cloud-native infrastructure.',
    '',
    '## Primary Sections & Interactive Tools',
    `- [Home & Editorial Stream](${SITE}/): Full chronological feed of dispatches and advisories.`,
    `- [AI Model Pricing, 10M Context & Local GPU VRAM Calculator](${SITE}/models): Interactive API token cost calculator & local GPU VRAM/speed estimator (NVIDIA RTX 5060 Ti 16GB, RTX 4090, RTX 5090, Apple M4 Max, H100).`,
    `- [Daily Tips: Prompting & AI Agent Orchestration](${SITE}/tips): Short, verified techniques for prompting coding agents, managing context, subagents and cost, each crediting the original post.`,
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
    `- Tips RSS Feed: ${SITE}/tips/rss.xml`,
    '',
    '## AI Model Specifications, API Pricing & GPU VRAM Datasheets (/models/[id])',
    '',
  ];

  for (const model of AI_MODELS) {
    lines.push(
      `- [${model.name} (${model.provider})](${SITE}/models/${model.id}): ${model.paramsLabel} | Context: ${model.contextLabel} | API: $${model.inputPricePer1M.toFixed(2)}/1M in ($${model.cachedInputPricePer1M.toFixed(2)} cached), $${model.outputPricePer1M.toFixed(2)}/1M out | Hardware: ${model.recommendedGpu}`
    );
  }

  lines.push('');
  lines.push('## Daily Tips for Developers Using AI Agents (/tips/[slug])');
  lines.push('');

  for (const tip of tips) {
    const credits = tip.data.sources.map((s) => sourceHandle(s)).join(', ');
    lines.push(
      `- [Tip ${tip.label}: ${tip.data.title}](${SITE}/tips/${tip.slug}): ${tip.data.description} | Level: ${tip.data.difficulty} | Sources: ${credits}`
    );
  }

  lines.push('');
  lines.push('## Dedicated CVE Technical Datasheets (/cve/[id])');
  lines.push('');

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
