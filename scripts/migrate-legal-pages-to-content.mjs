/**
 * One-off migration: convert the hand-written legal pages (privacy, terms,
 * disclaimer) into content JSON consumable by components/shared/LegalDocument.
 *
 * Only the body region of each page is parsed, in document order, pulling out
 * <h2>, <p>, <ul>/<ol> and <li> text. The pages contain no JSX interpolation
 * inside their prose, so plain text extraction is lossless here — the script
 * asserts that and fails loudly if it ever stops being true.
 *
 *   node scripts/migrate-legal-pages-to-content.mjs <siteId> <locale>
 */
import fs from 'fs/promises';
import path from 'path';
import { existsSync } from 'fs';

const siteId = process.argv[2] || 'asylum-attorney-la';
const locale = process.argv[3] || 'zh';

const PAGES = [
  { name: 'privacy', label: '隐私政策' },
  { name: 'terms', label: '使用条款' },
  { name: 'disclaimer', label: '法律免责声明' },
];

function decode(text) {
  return text
    .replace(/&ldquo;/g, '“')
    .replace(/&rdquo;/g, '”')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/\s+/g, ' ')
    .trim();
}

/** Strip a JSX tag's attributes, returning just its name. */
function tagName(raw) {
  const match = raw.match(/^<\/?([a-zA-Z0-9]+)/);
  return match ? match[1] : '';
}

function extractDocument(source) {
  // Body starts at the content section marker used by every legal page.
  const bodyStart = source.indexOf('── Content ──');
  if (bodyStart === -1) throw new Error('Content marker not found');
  const body = source.slice(bodyStart);

  const sections = [];
  let current = null;
  let notice = null;

  // Walk every h2 / p / li / ul / ol open tag in document order.
  const tagPattern = /<(h2|p|li|ul|ol)\b[^>]*>([\s\S]*?)<\/\1>/g;
  let match;
  const seen = new Set();

  while ((match = tagPattern.exec(body)) !== null) {
    const tag = match[1];
    const inner = match[2];

    // Skip nested matches already consumed as part of a list.
    if (seen.has(match.index)) continue;

    if (tag === 'ul' || tag === 'ol') {
      const items = [];
      const liPattern = /<li\b[^>]*>([\s\S]*?)<\/li>/g;
      let li;
      while ((li = liPattern.exec(inner)) !== null) {
        const text = decode(li[1]);
        if (text) items.push(text);
      }
      // Mark the inner <li> ranges as consumed.
      const innerStart = match.index + match[0].indexOf(inner);
      const liScan = /<li\b[^>]*>[\s\S]*?<\/li>/g;
      let scan;
      while ((scan = liScan.exec(inner)) !== null) {
        seen.add(innerStart + scan.index);
      }
      if (items.length && current) {
        current.blocks.push({ type: tag, items });
      }
      continue;
    }

    const text = decode(inner);
    if (!text || text.includes('{')) continue;

    if (tag === 'h2') {
      current = { heading: text, blocks: [] };
      sections.push(current);
      continue;
    }

    if (tag === 'p') {
      if (!current) {
        // Prose before the first heading is the highlighted notice box.
        if (!notice) notice = text;
        continue;
      }
      current.blocks.push({ type: 'p', text });
    }
  }

  return { sections, notice };
}

function extractMetadata(source) {
  const title = source.match(/title:\s*'([^']+)'/);
  const description = source.match(/description:\s*\n?\s*'([^']+)'/);
  const updated = source.match(/最后更新日期：[^<'\n]+/);
  const headline = source.match(
    /className="text-\[2\.5rem\] font-bold text-white mb-3 leading-tight"[\s\S]*?>\s*([^<{\n]+)\s*</
  );
  return {
    title: title ? title[1] : '',
    description: description ? description[1] : '',
    updated: updated ? updated[0].trim() : '',
    headline: headline ? headline[1].trim() : '',
  };
}

let total = 0;

for (const page of PAGES) {
  const sourcePath = path.join(
    process.cwd(),
    'app',
    '[locale]',
    page.name,
    'page.tsx'
  );
  const source = await fs.readFile(sourcePath, 'utf-8');
  const { sections, notice } = extractDocument(source);
  const meta = extractMetadata(source);

  if (sections.length === 0) {
    throw new Error(`No sections extracted from ${page.name} — aborting.`);
  }

  const payload = {
    seo: { title: meta.title, description: meta.description },
    hero: {
      headline: meta.headline || page.label,
      updated: meta.updated,
    },
    breadcrumbLabel: page.label,
    ...(notice ? { notice } : {}),
    sections,
  };

  const targetPath = path.join(
    process.cwd(),
    'content',
    siteId,
    locale,
    'pages',
    `${page.name}.json`
  );

  if (existsSync(targetPath)) {
    console.log(`skip (already exists): pages/${page.name}.json`);
    continue;
  }

  await fs.mkdir(path.dirname(targetPath), { recursive: true });
  await fs.writeFile(targetPath, `${JSON.stringify(payload, null, 2)}\n`, 'utf-8');
  const blocks = sections.reduce((sum, s) => sum + s.blocks.length, 0);
  console.log(
    `wrote: pages/${page.name}.json (${sections.length} sections, ${blocks} blocks)`
  );
  total += 1;
}

console.log(`\nDone. ${total} legal pages migrated.`);
