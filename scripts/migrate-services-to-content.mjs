/**
 * One-off migration: export the hardcoded services in `lib/services-data.ts`
 * into per-site content JSON so services become site-scoped like articles.
 *
 * Existing JSON files are never overwritten — CMS edits win over the legacy
 * TypeScript data. Run once per site that still relies on the legacy module.
 *
 *   node scripts/migrate-services-to-content.mjs <siteId> <locale>
 */
import fs from 'fs/promises';
import path from 'path';
import os from 'os';
import { existsSync } from 'fs';
import { execFileSync } from 'child_process';

const siteId = process.argv[2] || 'asylum-attorney-la';
const locale = process.argv[3] || 'zh';

/**
 * `lib/services-data.ts` is pure data with no imports, so compiling it alone
 * with the project's own TypeScript is enough — no extra dependency needed.
 */
async function loadLegacyServices() {
  const outDir = await fs.mkdtemp(path.join(os.tmpdir(), 'svc-migrate-'));
  execFileSync(
    'npx',
    [
      'tsc',
      'lib/services-data.ts',
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

  const compiled = path.join(outDir, 'services-data.js');
  const mod = await import(`file://${compiled}`);
  await fs.rm(outDir, { recursive: true, force: true }).catch(() => {});
  return mod.ALL_SERVICES;
}

const services = await loadLegacyServices();
const targetDir = path.join(process.cwd(), 'content', siteId, locale, 'services');
await fs.mkdir(targetDir, { recursive: true });

let written = 0;
let skipped = 0;

for (const [index, service] of services.entries()) {
  const filePath = path.join(targetDir, `${service.slug}.json`);
  if (existsSync(filePath)) {
    skipped += 1;
    console.log(`skip (already exists): ${service.slug}`);
    continue;
  }

  const payload = {
    slug: service.slug,
    title: service.title,
    titleEN: service.titleEN,
    icon: service.icon,
    description: service.description,
    category: service.category,
    order: index,
    seo: service.seo,
    whatIs: service.whatIs,
    whoNeeds: service.whoNeeds,
    processSteps: service.processSteps,
    requirements: service.requirements,
    commonMistakes: service.commonMistakes,
    howWeHelp: service.howWeHelp,
    testimonial: service.testimonial,
    faq: service.faq,
    relatedSlugs: service.relatedSlugs,
  };

  await fs.writeFile(filePath, `${JSON.stringify(payload, null, 2)}\n`, 'utf-8');
  written += 1;
  console.log(`wrote: ${service.slug}.json`);
}

console.log(`\nDone. ${written} written, ${skipped} skipped (existing CMS content kept).`);
console.log(`Target: content/${siteId}/${locale}/services/`);
