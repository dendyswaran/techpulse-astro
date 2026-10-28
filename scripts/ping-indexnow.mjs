import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.join(__dirname, '..');

const HOST = 'www.techpulsenews.tech';
const SITE = `https://${HOST}`;
const KEY = 'a7f9e2d4c8b140369e5d2c7a8b4f1023';
const KEY_LOCATION = `${SITE}/${KEY}.txt`;

function collectCanonicalUrls() {
  const urls = new Set([
    `${SITE}/`,
    `${SITE}/models`,
    `${SITE}/security`,
    `${SITE}/category/ai`,
    `${SITE}/category/security`,
    `${SITE}/category/tech-update`,
    `${SITE}/category/tech-news`,
    `${SITE}/rss.xml`,
    `${SITE}/sitemap.xml`,
    `${SITE}/news-sitemap.xml`,
    `${SITE}/llms.txt`,
  ]);

  // 1. Collect all article slugs + frontmatter cveIds
  const articlesDir = path.join(rootDir, 'src', 'content', 'articles');
  if (fs.existsSync(articlesDir)) {
    const files = fs.readdirSync(articlesDir).filter((f) => f.endsWith('.md'));
    for (const file of files) {
      const slug = file.replace(/\.md$/, '');
      urls.add(`${SITE}/articles/${slug}`);

      const raw = fs.readFileSync(path.join(articlesDir, file), 'utf8');
      const cveMatch = raw.match(/cveIds:\s*\[([^\]]+)\]/);
      if (cveMatch) {
        const ids = cveMatch[1]
          .split(',')
          .map((s) => s.replace(/['"\s]/g, '').trim().toLowerCase())
          .filter(Boolean);
        for (const id of ids) {
          urls.add(`${SITE}/cve/${id}`);
        }
      }
    }
  }

  // 2. Collect all curated CVE slugIds from src/data/cves.ts
  const cvesTsPath = path.join(rootDir, 'src', 'data', 'cves.ts');
  if (fs.existsSync(cvesTsPath)) {
    const rawCves = fs.readFileSync(cvesTsPath, 'utf8');
    const regex = /slugId:\s*'([^']+)'/g;
    let m;
    while ((m = regex.exec(rawCves)) !== null) {
      urls.add(`${SITE}/cve/${m[1].toLowerCase()}`);
    }
  }

  // 3. Collect all AI model IDs from src/data/models.ts
  const modelsTsPath = path.join(rootDir, 'src', 'data', 'models.ts');
  if (fs.existsSync(modelsTsPath)) {
    const rawModels = fs.readFileSync(modelsTsPath, 'utf8');
    const modelsBlock = rawModels.split('export const AI_MODELS')[1] || '';
    const idRegex = /\bid:\s*'([^']+)'/g;
    let m;
    while ((m = idRegex.exec(modelsBlock)) !== null) {
      urls.add(`${SITE}/models/${m[1]}`);
    }
  }

  return Array.from(urls);
}

async function main() {
  const urlList = collectCanonicalUrls();
  console.log(`[IndexNow] Submitting ${urlList.length} canonical URLs for ${HOST}...`);

  const payload = {
    host: HOST,
    key: KEY,
    keyLocation: KEY_LOCATION,
    urlList,
  };

  const res = await fetch('https://api.indexnow.org/indexnow', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
    },
    body: JSON.stringify(payload),
  });

  const bodyText = await res.text();
  console.log(`[IndexNow] Response HTTP ${res.status} (${res.statusText})`);
  if (bodyText) {
    console.log(`[IndexNow] Response Body: ${bodyText}`);
  }
  console.log(`[IndexNow] Key Location: ${KEY_LOCATION}`);
  console.log(`[IndexNow] Sample URLs submitted:\n  - ${urlList.slice(0, 10).join('\n  - ')}`);

  if (!res.ok && res.status !== 202) {
    process.exitCode = 1;
  }
}

main().catch((err) => {
  console.error('[IndexNow] Error:', err);
  process.exitCode = 1;
});
