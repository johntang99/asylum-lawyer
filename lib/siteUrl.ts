// ============================================
// PER-SITE PUBLIC BASE URL
// ============================================
//
// Canonical URLs, hreflang, robots and the sitemap must all use the domain of
// the site being served. A single global NEXT_PUBLIC_SITE_URL is wrong as soon
// as one deployment serves more than one client: every site would advertise the
// same canonical host.
//
// Resolution order:
//   1. `siteUrl` in the site's seo.json (explicit override, e.g. a www host)
//   2. the site's own `domain` (sites table / _sites.json)
//   3. the incoming request host (correct behind a proxy via x-forwarded-*)
//   4. NEXT_PUBLIC_SITE_URL, for build-time contexts with no request
//   5. '' — callers should omit canonical rather than emit a wrong one
//
// Everything that publishes a URL (canonical, hreflang, sitemap, robots) must
// go through here, so a site can never advertise two different canonical hosts.

import { headers } from 'next/headers';
import { getSiteById } from './sites';
import { loadSeo } from './content';
import { defaultLocale } from './i18n';
import type { Locale } from './types';

function normalizeBase(value: string): string {
  const trimmed = value.trim().replace(/\/+$/, '');
  if (!trimmed) return '';
  return /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
}

/** The request's own origin, honouring proxy headers. */
function originFromRequest(): string {
  try {
    const h = headers();
    const host = h.get('x-forwarded-host') || h.get('host');
    if (!host) return '';
    const proto =
      h.get('x-forwarded-proto') ||
      (host.startsWith('localhost') || host.startsWith('127.0.0.1') ? 'http' : 'https');
    return `${proto}://${host}`;
  } catch {
    // No request scope (build-time metadata, generateStaticParams, etc.)
    return '';
  }
}

export async function getSiteBaseUrl(
  siteId?: string,
  locale: Locale = defaultLocale
): Promise<string> {
  if (siteId) {
    try {
      const seo = (await loadSeo(siteId, locale)) as { siteUrl?: string } | null;
      if (seo?.siteUrl) return normalizeBase(seo.siteUrl);
    } catch {
      // fall through
    }
    try {
      const site = await getSiteById(siteId);
      if (site?.domain) return normalizeBase(site.domain);
    } catch {
      // fall through
    }
  }

  const requestOrigin = originFromRequest();
  if (requestOrigin) return requestOrigin;

  const envUrl = process.env.NEXT_PUBLIC_SITE_URL;
  return envUrl ? normalizeBase(envUrl) : '';
}
