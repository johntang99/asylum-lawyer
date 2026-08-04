import Link from 'next/link';
import { getSites } from '@/lib/sites';
import { getSession } from '@/lib/admin/auth';
import { filterSitesForUser } from '@/lib/admin/permissions';
import { loadAllItems, loadContent } from '@/lib/content';
import type { Locale, SiteConfig } from '@/lib/types';

/* eslint-disable @typescript-eslint/no-explicit-any */

const REQUIRED_PAGES = [
  'home',
  'about',
  'services',
  'contact',
  'consultation',
  'faq',
  'privacy',
  'terms',
  'disclaimer',
];

interface CheckRow {
  label: string;
  ok: boolean;
  detail: string;
}

/** Recursively count TODO_ placeholders left in a content blob. */
function countPlaceholders(value: unknown): number {
  if (typeof value === 'string') return value.includes('TODO_') ? 1 : 0;
  if (Array.isArray(value)) return value.reduce<number>((sum, v) => sum + countPlaceholders(v), 0);
  if (value && typeof value === 'object') {
    return Object.values(value as Record<string, unknown>).reduce<number>(
      (sum, v) => sum + countPlaceholders(v),
      0
    );
  }
  return 0;
}

async function auditSite(site: SiteConfig): Promise<CheckRow[]> {
  const locale = (site.defaultLocale || 'zh') as Locale;
  const rows: CheckRow[] = [];

  const [siteInfo, header, footer, seo] = await Promise.all([
    loadContent<any>(site.id, locale, 'site.json', false).catch(() => null),
    loadContent<any>(site.id, locale, 'header.json', false).catch(() => null),
    loadContent<any>(site.id, locale, 'footer.json', false).catch(() => null),
    loadContent<any>(site.id, locale, 'seo.json', false).catch(() => null),
  ]);

  rows.push({
    label: 'Identity files',
    ok: Boolean(siteInfo && header && footer && seo),
    detail: [
      siteInfo ? null : 'site.json',
      header ? null : 'header.json',
      footer ? null : 'footer.json',
      seo ? null : 'seo.json',
    ]
      .filter(Boolean)
      .join(', ') || 'site, header, footer, seo present',
  });

  const napFields: Array<[string, unknown]> = [
    ['phone', siteInfo?.phone],
    ['email', siteInfo?.email],
    ['address', siteInfo?.address?.street],
  ];
  const missingNap = napFields
    .filter(([, v]) => !v || String(v).includes('TODO_'))
    .map(([k]) => k);
  rows.push({
    label: 'Contact details (NAP)',
    ok: missingNap.length === 0,
    detail: missingNap.length ? `still placeholder: ${missingNap.join(', ')}` : 'complete',
  });

  const pageResults = await Promise.all(
    REQUIRED_PAGES.map(async (page) => ({
      page,
      data: await loadContent<any>(site.id, locale, `pages/${page}.json`, false).catch(() => null),
    }))
  );
  const missingPages = pageResults.filter((p) => !p.data).map((p) => p.page);
  rows.push({
    label: 'Core pages',
    ok: missingPages.length === 0,
    detail: missingPages.length
      ? `missing: ${missingPages.join(', ')}`
      : `all ${REQUIRED_PAGES.length} present`,
  });

  const [services, categories, locations] = await Promise.all([
    loadAllItems<any>(site.id, locale, 'services', false).catch(() => []),
    loadAllItems<any>(site.id, locale, 'service-categories', false).catch(() => []),
    loadAllItems<any>(site.id, locale, 'locations', false).catch(() => []),
  ]);
  rows.push({
    label: 'Services',
    ok: services.length > 0,
    detail: `${services.length} service pages, ${categories.length} category hubs`,
  });
  rows.push({
    label: 'Location pages',
    ok: locations.length > 0,
    detail: `${locations.length} near-location pages`,
  });

  const placeholderCount =
    countPlaceholders(siteInfo) +
    countPlaceholders(footer) +
    pageResults.reduce((sum, p) => sum + countPlaceholders(p.data), 0);
  rows.push({
    label: 'Placeholders resolved',
    ok: placeholderCount === 0,
    detail: placeholderCount ? `${placeholderCount} TODO_ values remaining` : 'none remaining',
  });

  const aliases = site.domainAliases || [];
  rows.push({
    label: 'Domains',
    ok: Boolean(site.domain) || aliases.some((a) => a.environment === 'prod'),
    detail: site.domain
      ? `${site.domain}${aliases.length ? ` (+${aliases.length} alias)` : ''}`
      : 'no production domain set',
  });

  return rows;
}

export default async function OnboardingChecklistPage() {
  const session = await getSession();
  const allSites = await getSites();
  const sites = session ? filterSitesForUser(allSites, session.user) : allSites;

  const audits = await Promise.all(
    sites.map(async (site) => ({ site, rows: await auditSite(site) }))
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Onboarding QA Checklist</h1>
        <p className="text-sm text-gray-600">
          Launch readiness per site, checked against the content that is actually
          published. A site is ready when every row is green.
        </p>
      </div>

      {audits.length === 0 && (
        <div className="bg-white border border-gray-200 rounded-xl p-6 text-sm text-gray-600">
          No sites yet.{' '}
          <Link href="/admin/onboarding" className="text-blue-600 underline">
            Onboard one
          </Link>
          .
        </div>
      )}

      {audits.map(({ site, rows }) => {
        const passing = rows.filter((r) => r.ok).length;
        const ready = passing === rows.length;
        return (
          <div key={site.id} className="bg-white border border-gray-200 rounded-xl p-6">
            <div className="flex items-start justify-between gap-4 mb-4">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">{site.name}</h2>
                <p className="text-xs text-gray-500 mt-0.5">
                  {site.id} · default locale {site.defaultLocale}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <span
                  className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                    ready ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-800'
                  }`}
                >
                  {passing}/{rows.length} {ready ? 'ready' : 'incomplete'}
                </span>
                <Link
                  href={`/${site.defaultLocale}?site=${site.id}`}
                  target="_blank"
                  className="text-sm text-blue-600 underline"
                >
                  Preview
                </Link>
              </div>
            </div>

            <ul className="divide-y divide-gray-100">
              {rows.map((row) => (
                <li key={row.label} className="flex items-start gap-3 py-2.5">
                  <span
                    className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                      row.ok ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
                    }`}
                  >
                    {row.ok ? '✓' : '!'}
                  </span>
                  <div className="min-w-0">
                    <div className="text-sm font-medium text-gray-900">{row.label}</div>
                    <div className="text-xs text-gray-500">{row.detail}</div>
                  </div>
                </li>
              ))}
            </ul>

            <div className="mt-4 flex gap-3">
              <Link
                href={`/admin/content?siteId=${site.id}&locale=${site.defaultLocale}`}
                className="text-sm px-3 py-1.5 rounded-md border border-gray-300 text-gray-700"
              >
                Edit content
              </Link>
              <Link
                href={`/admin/sites/${site.id}`}
                className="text-sm px-3 py-1.5 rounded-md border border-gray-300 text-gray-700"
              >
                Site settings
              </Link>
            </div>
          </div>
        );
      })}
    </div>
  );
}
