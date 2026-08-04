// ============================================
// SITE-AWARE SERVICES LOADER
// ============================================
//
// Services live in `content/[siteId]/[locale]/services/*.json` and optional
// category hubs in `content/[siteId]/[locale]/service-categories/*.json`.
//
// Sites with a small, flat service list (the original asylum site) keep their
// one-level URLs: /services/[slug]. Sites that define categories get a two-tier
// structure: /services/[category] hubs and /services/[category]/[slug] details.
//
// Content is the single source of truth. `lib/services-data.ts` is retained
// only for its ServiceData type; its data was migrated to content JSON by
// `scripts/migrate-services-to-content.mjs`.

import type { Locale } from '@/lib/i18n';
import { getRequestSiteId, loadAllItems } from '@/lib/content';
import type { ServiceData } from '@/lib/services-data';

export type { ServiceData };

export interface PublicService extends ServiceData {
  /** Category hub this service belongs to, when the site uses categories. */
  categorySlug?: string;
  /** Sort order within its category / the full list. */
  order: number;
  hero?: unknown;
}

/** A short service entry listed on a category hub without its own detail page. */
export interface CategoryItem {
  title: string;
  titleEN?: string;
  description?: string;
  slug?: string;
}

/** Optional sub-grouping for large categories (e.g. business disputes). */
export interface CategoryGroup {
  title: string;
  items: CategoryItem[];
}

export interface ServiceCategory {
  slug: string;
  title: string;
  titleEN?: string;
  icon: string;
  description: string;
  order: number;
  intro?: string;
  seo?: { title?: string; description?: string; h1?: string };
  /** Items covered on the hub page that have no detail page of their own. */
  items: CategoryItem[];
  /** When present, the hub renders these grouped instead of one flat list. */
  groups: CategoryGroup[];
}

function asString(value: unknown, fallback = ''): string {
  return typeof value === 'string' ? value : fallback;
}

function asArray<T>(value: unknown): T[] {
  return Array.isArray(value) ? (value as T[]) : [];
}

function asNumber(value: unknown, fallback: number): number {
  return typeof value === 'number' && Number.isFinite(value) ? value : fallback;
}

/**
 * Derive a one-line description when the JSON omits one, so cards never render
 * empty. Falls back through the most likely prose fields.
 */
function deriveDescription(raw: Record<string, unknown>): string {
  const explicit = asString(raw.description);
  if (explicit) return explicit;

  const seo = (raw.seo || {}) as Record<string, unknown>;
  const seoDescription = asString(seo.description);
  if (seoDescription) return seoDescription;

  const whatIs = (raw.whatIs || {}) as Record<string, unknown>;
  const content = asString(whatIs.content);
  if (!content) return '';
  return content.length > 120 ? `${content.slice(0, 120)}…` : content;
}

function normalizeService(raw: Record<string, unknown>, index: number): PublicService | null {
  const slug = asString(raw.slug).trim();
  const title = asString(raw.title).trim();
  if (!slug || !title) return null;

  const seo = (raw.seo || {}) as Record<string, unknown>;
  const whatIs = (raw.whatIs || {}) as Record<string, unknown>;
  const whoNeeds = (raw.whoNeeds || {}) as Record<string, unknown>;
  const howWeHelp = (raw.howWeHelp || {}) as Record<string, unknown>;
  const testimonial = (raw.testimonial || {}) as Record<string, unknown>;

  const legacyCategory = asString(raw.category);
  const categorySlug = asString(raw.categorySlug) || asString(raw.serviceCategory);

  return {
    slug,
    title,
    titleEN: asString(raw.titleEN) || undefined,
    icon: asString(raw.icon, '⚖'),
    description: deriveDescription(raw),
    // The legacy field doubled as a primary/additional flag; keep that meaning
    // and carry any real category hub separately.
    category: legacyCategory === 'additional' ? 'additional' : 'primary',
    categorySlug: categorySlug || undefined,
    order: asNumber(raw.order, index),
    seo: {
      title: asString(seo.title, title),
      description: asString(seo.description),
      h1: asString(seo.h1, title),
    },
    whatIs: {
      title: asString(whatIs.title),
      content: asString(whatIs.content),
      keyPoints: asArray(whatIs.keyPoints),
    },
    whoNeeds: { scenarios: asArray(whoNeeds.scenarios) },
    processSteps: asArray(raw.processSteps),
    requirements: asArray(raw.requirements),
    commonMistakes: asArray(raw.commonMistakes),
    howWeHelp: {
      content: asString(howWeHelp.content),
      points: asArray(howWeHelp.points),
    },
    testimonial: {
      quote: asString(testimonial.quote),
      name: asString(testimonial.name),
      caseType: asString(testimonial.caseType),
    },
    faq: asArray(raw.faq),
    relatedSlugs: asArray<string>(raw.relatedSlugs).filter(
      (value): value is string => typeof value === 'string'
    ),
    hero: raw.hero,
  };
}

function normalizeCategory(raw: Record<string, unknown>, index: number): ServiceCategory | null {
  const slug = asString(raw.slug).trim();
  const title = asString(raw.title).trim();
  if (!slug || !title) return null;

  const seo = (raw.seo || {}) as Record<string, unknown>;

  return {
    slug,
    title,
    titleEN: asString(raw.titleEN) || undefined,
    icon: asString(raw.icon, '⚖'),
    description: asString(raw.description),
    order: asNumber(raw.order, index),
    intro: asString(raw.intro) || undefined,
    seo: {
      title: asString(seo.title, title),
      description: asString(seo.description),
      h1: asString(seo.h1, title),
    },
    items: normalizeItems(raw.items),
    groups: asArray<Record<string, unknown>>(raw.groups)
      .map((group) => ({
        title: asString(group.title),
        items: normalizeItems(group.items),
      }))
      .filter((group) => group.title && group.items.length > 0),
  };
}

function normalizeItems(value: unknown): CategoryItem[] {
  return asArray<Record<string, unknown>>(value)
    .map((item) => ({
      title: asString(item.title),
      titleEN: asString(item.titleEN) || undefined,
      description: asString(item.description) || undefined,
      slug: asString(item.slug) || undefined,
    }))
    .filter((item) => Boolean(item.title));
}

export async function getServices(
  locale: Locale,
  siteId?: string
): Promise<PublicService[]> {
  const resolvedSiteId = siteId || (await getRequestSiteId());
  const raw = await loadAllItems<Record<string, unknown>>(
    resolvedSiteId,
    locale,
    'services'
  ).catch(() => []);

  return raw
    .map((item, index) => normalizeService(item, index))
    .filter((item): item is PublicService => item !== null)
    .sort((a, b) => a.order - b.order);
}

export async function getServiceCategories(
  locale: Locale,
  siteId?: string
): Promise<ServiceCategory[]> {
  const resolvedSiteId = siteId || (await getRequestSiteId());
  const raw = await loadAllItems<Record<string, unknown>>(
    resolvedSiteId,
    locale,
    'service-categories'
  ).catch(() => []);

  return raw
    .map((item, index) => normalizeCategory(item, index))
    .filter((item): item is ServiceCategory => item !== null)
    .sort((a, b) => a.order - b.order);
}

export async function getServiceBySlug(
  locale: Locale,
  slug: string,
  siteId?: string
): Promise<PublicService | null> {
  const services = await getServices(locale, siteId);
  return services.find((service) => service.slug === slug) || null;
}

export async function getServiceCategoryBySlug(
  locale: Locale,
  slug: string,
  siteId?: string
): Promise<ServiceCategory | null> {
  const categories = await getServiceCategories(locale, siteId);
  return categories.find((category) => category.slug === slug) || null;
}

export async function getRelatedServices(
  locale: Locale,
  slugs: string[],
  siteId?: string
): Promise<PublicService[]> {
  if (!slugs.length) return [];
  const services = await getServices(locale, siteId);
  return slugs
    .map((slug) => services.find((service) => service.slug === slug))
    .filter((service): service is PublicService => Boolean(service));
}

export function getServicesInCategory(
  services: PublicService[],
  categorySlug: string
): PublicService[] {
  return services.filter((service) => service.categorySlug === categorySlug);
}

/**
 * Canonical URL for a service. Two-tier when the service belongs to a category
 * hub, one-tier otherwise — this is what keeps existing /services/[slug] URLs
 * intact for sites that never adopted categories.
 */
export function serviceHref(locale: string, service: PublicService): string {
  return service.categorySlug
    ? `/${locale}/services/${service.categorySlug}/${service.slug}`
    : `/${locale}/services/${service.slug}`;
}

export function categoryHref(locale: string, category: ServiceCategory): string {
  return `/${locale}/services/${category.slug}`;
}
