// ============================================
// SITE-AWARE NEAR-LOCATION LOADER
// ============================================
//
// Near-location SEO pages live in `content/[siteId]/[locale]/locations/*.json`.
// `lib/locations-data.ts` is retained only for its type; its data was migrated
// to content JSON by `scripts/migrate-locations-to-content.mjs`.

import type { Locale } from '@/lib/i18n';
import { getRequestSiteId, loadAllItems } from '@/lib/content';

export interface PublicLocation {
  slug: string;
  cityZH: string;
  cityEN: string;
  h1: string;
  intro: string;
  distance: string;
  order: number;
  seo: { title: string; description: string };
  /** Optional per-city testimonial; falls back to a generic one when absent. */
  testimonial?: { quote: string; name: string };
}

function asString(value: unknown, fallback = ''): string {
  return typeof value === 'string' ? value : fallback;
}

function normalizeLocation(
  raw: Record<string, unknown>,
  index: number
): PublicLocation | null {
  const slug = asString(raw.slug).trim();
  if (!slug) return null;

  const cityZH = asString(raw.cityZH) || asString(raw.city);
  const cityEN = asString(raw.cityEN) || cityZH;
  const seo = (raw.seo || {}) as Record<string, unknown>;
  const testimonial = (raw.testimonial || {}) as Record<string, unknown>;
  const quote = asString(testimonial.quote);

  return {
    slug,
    cityZH,
    cityEN,
    h1: asString(raw.h1, cityZH),
    intro: asString(raw.intro),
    distance: asString(raw.distance),
    order:
      typeof raw.order === 'number' && Number.isFinite(raw.order) ? raw.order : index,
    seo: {
      title: asString(seo.title, cityZH),
      description: asString(seo.description),
    },
    testimonial: quote
      ? { quote, name: asString(testimonial.name) }
      : undefined,
  };
}

export async function getLocations(
  locale: Locale,
  siteId?: string
): Promise<PublicLocation[]> {
  const resolvedSiteId = siteId || (await getRequestSiteId());
  const raw = await loadAllItems<Record<string, unknown>>(
    resolvedSiteId,
    locale,
    'locations'
  ).catch(() => []);

  return raw
    .map((item, index) => normalizeLocation(item, index))
    .filter((item): item is PublicLocation => item !== null)
    .sort((a, b) => a.order - b.order);
}

export async function getLocationBySlug(
  locale: Locale,
  slug: string,
  siteId?: string
): Promise<PublicLocation | null> {
  const locations = await getLocations(locale, siteId);
  return locations.find((location) => location.slug === slug) || null;
}
