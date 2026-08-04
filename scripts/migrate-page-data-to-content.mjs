/**
 * One-off migration: lift inline data arrays out of page components into
 * per-site content JSON (FAQ categories and testimonials).
 *
 * The arrays are plain object literals with no identifiers, so slicing the
 * balanced bracket range and evaluating it is safe and exact.
 *
 *   node scripts/migrate-page-data-to-content.mjs <siteId> <locale>
 */
import fs from 'fs/promises';
import path from 'path';
import { existsSync } from 'fs';

const siteId = process.argv[2] || 'asylum-attorney-la';
const locale = process.argv[3] || 'zh';

/** Extract the array literal that follows `declaration` and evaluate it. */
function extractArray(source, declaration) {
  const start = source.indexOf(declaration);
  if (start === -1) throw new Error(`Declaration not found: ${declaration}`);

  // Start after the `=` so the `[]` in a type annotation (`Foo[] = [...]`)
  // isn't mistaken for the array literal.
  const assign = source.indexOf('=', start + declaration.length);
  if (assign === -1) throw new Error(`Assignment not found for: ${declaration}`);

  const open = source.indexOf('[', assign);
  if (open === -1) throw new Error(`Array literal not found after: ${declaration}`);

  let depth = 0;
  let inString = null;
  let end = -1;

  for (let i = open; i < source.length; i += 1) {
    const char = source[i];
    const prev = source[i - 1];

    if (inString) {
      if (char === inString && prev !== '\\') inString = null;
      continue;
    }
    if (char === "'" || char === '"' || char === '`') {
      inString = char;
      continue;
    }
    if (char === '[') depth += 1;
    if (char === ']') {
      depth -= 1;
      if (depth === 0) {
        end = i;
        break;
      }
    }
  }

  if (end === -1) throw new Error(`Unbalanced array literal for: ${declaration}`);

  const literal = source.slice(open, end + 1);
  // eslint-disable-next-line no-new-func
  return new Function(`return (${literal});`)();
}

async function writeContent(relativePath, data) {
  const filePath = path.join(
    process.cwd(),
    'content',
    siteId,
    locale,
    'pages',
    relativePath
  );
  if (existsSync(filePath)) {
    console.log(`skip (already exists): pages/${relativePath}`);
    return;
  }
  await fs.mkdir(path.dirname(filePath), { recursive: true });
  await fs.writeFile(filePath, `${JSON.stringify(data, null, 2)}\n`, 'utf-8');
  console.log(`wrote: pages/${relativePath}`);
}

const appDir = path.join(process.cwd(), 'app', '[locale]');

// ── FAQ ──
const faqSource = await fs.readFile(path.join(appDir, 'faq', 'page.tsx'), 'utf-8');
const faqCategories = extractArray(faqSource, 'const faqCategories');
await writeContent('faq.json', {
  seo: {
    title: '常见问题 | 宇霞移民服务中心',
    description:
      '关于美国庇护申请的常见问题解答，涵盖庇护基础知识、申请流程、面谈准备、常见风险及后续身份等。',
  },
  hero: {
    headline: '常见问题',
    subheadline: '关于庇护申请，您最想了解的问题都在这里',
  },
  categories: faqCategories,
});

// ── Testimonials ──
const testimonialSource = await fs.readFile(
  path.join(appDir, 'testimonials', 'page.tsx'),
  'utf-8'
);
const testimonials = extractArray(testimonialSource, 'const testimonials');
await writeContent('testimonials.json', {
  seo: {
    title: '客户评价 | 宇霞移民服务中心',
    description:
      '查看宇霞移民服务中心庇护移民案件客户的真实评价与反馈，了解我们如何帮助客户成功获得庇护身份。',
  },
  hero: {
    headline: '客户评价',
    subheadline: '来自真实客户的反馈',
  },
  testimonials,
});

console.log(
  `\nDone. ${faqCategories.length} FAQ categories, ${testimonials.length} testimonials.`
);
