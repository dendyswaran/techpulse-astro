import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const outDir = path.join(__dirname, '..', 'public', 'images', 'covers');

// Covers are stored as base64 in scripts/covers-manifest*.json (one file per batch).
const manifests = fs
  .readdirSync(__dirname)
  .filter((f) => /^covers-manifest.*\.json$/.test(f))
  .sort();

let count = 0;
if (manifests.length > 0) {
  fs.mkdirSync(outDir, { recursive: true });
  for (const file of manifests) {
    const manifest = JSON.parse(fs.readFileSync(path.join(__dirname, file), 'utf8'));
    for (const [filename, b64] of Object.entries(manifest)) {
      fs.writeFileSync(path.join(outDir, filename), Buffer.from(b64, 'base64'));
      count++;
    }
  }
  console.log(`[unpack-covers] Unpacked ${count} editorial cover illustrations from ${manifests.length} manifest(s) to public/images/covers/`);
}
