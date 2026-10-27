import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const manifestPath = path.join(__dirname, 'covers-manifest.json');
const outDir = path.join(__dirname, '..', 'public', 'images', 'covers');

if (fs.existsSync(manifestPath)) {
  fs.mkdirSync(outDir, { recursive: true });
  const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
  for (const [filename, b64] of Object.entries(manifest)) {
    const outPath = path.join(outDir, filename);
    fs.writeFileSync(outPath, Buffer.from(b64, 'base64'));
  }
  console.log(`[unpack-covers] Unpacked ${Object.keys(manifest).length} editorial cover illustrations to public/images/covers/`);
}
