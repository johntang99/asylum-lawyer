/**
 * One-off migration: export the hardcoded near-location pages in
 * `lib/locations-data.ts` into per-site content JSON.
 *
 * Existing JSON files are never overwritten — CMS edits win.
 *
 *   node scripts/migrate-locations-to-content.mjs <siteId> <locale>
 */
import fs from 'fs/promises';
import path from 'path';
import os from 'os';
import { existsSync } from 'fs';
import { execFileSync } from 'child_process';

const siteId = process.argv[2] || 'asylum-attorney-la';
const locale = process.argv[3] || 'zh';

async function loadLegacyLocations() {
  const outDir = await fs.mkdtemp(path.join(os.tmpdir(), 'loc-migrate-'));
  execFileSync(
    'npx',
    [
      'tsc',
      'lib/locations-data.ts',
      '--outDir',
      outDir,
      '--module',
      'esnext',
      '--target',
      'es2020',
      '--moduleResolution',
      'bundler',
      '--skipLibCheck',
    ],
    { cwd: process.cwd(), stdio: 'inherit' }
  );

  const compiled = path.join(outDir, 'locations-data.js');
  const mod = await import(`file://${compiled}`);
  await fs.rm(outDir, { recursive: true, force: true }).catch(() => {});
  return mod.locationsData;
}

const locations = await loadLegacyLocations();
const targetDir = path.join(process.cwd(), 'content', siteId, locale, 'locations');
await fs.mkdir(targetDir, { recursive: true });

let written = 0;
let skipped = 0;

for (const [index, location] of Object.values(locations).entries()) {
  const filePath = path.join(targetDir, `${location.slug}.json`);
  if (existsSync(filePath)) {
    skipped += 1;
    console.log(`skip (already exists): ${location.slug}`);
    continue;
  }

  await fs.writeFile(
    filePath,
    `${JSON.stringify({ ...location, order: index }, null, 2)}\n`,
    'utf-8'
  );
  written += 1;
  console.log(`wrote: ${location.slug}.json`);
}

console.log(`\nDone. ${written} written, ${skipped} skipped.`);
console.log(`Target: content/${siteId}/${locale}/locations/`);
