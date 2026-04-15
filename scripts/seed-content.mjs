import { readFileSync, readdirSync, statSync, existsSync } from 'fs';
import { join, relative } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const ROOT = join(__dirname, '..');

// ---------------------------------------------------------------------------
// 1. Parse .env.local for Supabase credentials
// ---------------------------------------------------------------------------
function loadEnv() {
  const envPath = join(ROOT, '.env.local');
  if (!existsSync(envPath)) {
    throw new Error(`.env.local not found at ${envPath}`);
  }
  const env = {};
  const lines = readFileSync(envPath, 'utf-8').split('\n');
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eqIndex = trimmed.indexOf('=');
    if (eqIndex === -1) continue;
    const key = trimmed.slice(0, eqIndex).trim();
    let value = trimmed.slice(eqIndex + 1).trim();
    // Strip surrounding quotes if present
    if ((value.startsWith('"') && value.endsWith('"')) ||
        (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
    }
    env[key] = value;
  }
  return env;
}

// ---------------------------------------------------------------------------
// 2. Recursively collect all .json files under a directory
// ---------------------------------------------------------------------------
function walkJson(dir) {
  const results = [];
  if (!existsSync(dir)) return results;
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) {
      results.push(...walkJson(full));
    } else if (entry.endsWith('.json')) {
      results.push(full);
    }
  }
  return results;
}

// ---------------------------------------------------------------------------
// 3. Main
// ---------------------------------------------------------------------------
async function main() {
  const env = loadEnv();
  const supabaseUrl = env.SUPABASE_URL || env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseKey) {
    throw new Error('Missing SUPABASE_URL / NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local');
  }

  const { createClient } = await import('@supabase/supabase-js');
  const supabase = createClient(supabaseUrl, supabaseKey);

  const SITE_ID = 'asylum-attorney-la';
  const LOCALE = 'zh';
  const contentBase = join(ROOT, 'content', SITE_ID);
  const localeDir = join(contentBase, LOCALE);

  const rows = [];

  // --- Locale files (zh/**/*.json) ---
  const localeFiles = walkJson(localeDir);
  for (const filePath of localeFiles) {
    const contentPath = relative(localeDir, filePath); // e.g. "pages/home.json"
    const data = JSON.parse(readFileSync(filePath, 'utf-8'));
    rows.push({ site_id: SITE_ID, locale: LOCALE, path: contentPath, data });
  }

  // --- theme.json (no locale prefix) ---
  const themePath = join(contentBase, 'theme.json');
  if (existsSync(themePath)) {
    const data = JSON.parse(readFileSync(themePath, 'utf-8'));
    rows.push({ site_id: SITE_ID, locale: LOCALE, path: 'theme.json', data });
  }

  if (rows.length === 0) {
    console.log('No content files found. Nothing to seed.');
    return;
  }

  let seeded = 0;

  for (const row of rows) {
    const { error } = await supabase
      .from('content_entries')
      .upsert(row, { onConflict: 'site_id,locale,path' });

    if (error) {
      console.error(`✗ Failed: ${row.locale}/${row.path} — ${error.message}`);
    } else {
      console.log(`✓ Seeded: ${row.locale}/${row.path}`);
      seeded++;
    }
  }

  console.log(`\nSeeded ${seeded} files`);
}

main().catch((err) => {
  console.error('Seed failed:', err.message);
  process.exit(1);
});
