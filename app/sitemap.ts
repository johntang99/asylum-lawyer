import type { MetadataRoute } from 'next';
import { getRequestSiteId, loadAllItems } from '@/lib/content';
import { getServiceCategories, getServices } from '@/lib/services';
import { getLocations } from '@/lib/locations';
import { loadPublicArticles } from '@/lib/articles';
import type { Locale } from '@/lib/i18n';

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.yuxiaris.com';

const LOCALES = ['zh', 'en'] as const;

type ChangeFrequency =
  | 'always'
  | 'hourly'
  | 'daily'
  | 'weekly'
  | 'monthly'
  | 'yearly'
  | 'never';

interface RouteEntry {
  path: string;
  priority: number;
  changeFrequency: ChangeFrequency;
}

const STATIC_ROUTES: RouteEntry[] = [
  { path: '', priority: 1.0, changeFrequency: 'weekly' },
  { path: '/about', priority: 0.8, changeFrequency: 'monthly' },
  { path: '/services', priority: 0.8, changeFrequency: 'monthly' },
  { path: '/contact', priority: 0.8, changeFrequency: 'monthly' },
  { path: '/consultation', priority: 0.8, changeFrequency: 'monthly' },
  { path: '/faq', priority: 0.7, changeFrequency: 'monthly' },
  { path: '/testimonials', priority: 0.7, changeFrequency: 'monthly' },
  { path: '/remote-consultation', priority: 0.7, changeFrequency: 'monthly' },
  { path: '/privacy', priority: 0.3, changeFrequency: 'yearly' },
  { path: '/terms', priority: 0.3, changeFrequency: 'yearly' },
  { path: '/disclaimer', priority: 0.3, changeFrequency: 'yearly' },
];

/**
 * Collect every content-driven route for one locale of the current site.
 * Everything is read from per-site content, so each site's sitemap lists only
 * the pages that site actually publishes.
 */
async function routesForLocale(siteId: string, locale: Locale): Promise<RouteEntry[]> {
  const [services, categories, locations, articles, landings] = await Promise.all([
    getServices(locale, siteId).catch(() => []),
    getServiceCategories(locale, siteId).catch(() => []),
    getLocations(locale, siteId).catch(() => []),
    loadPublicArticles(locale, siteId).catch(() => []),
    loadAllItems<{ slug?: string }>(siteId, locale, 'landing').catch(() => []),
  ]);

  const categoryRoutes: RouteEntry[] = categories.map((category) => ({
    path: `/services/${category.slug}`,
    priority: 0.85,
    changeFrequency: 'monthly',
  }));

  const serviceRoutes: RouteEntry[] = services.map((service) => ({
    path: service.categorySlug
      ? `/services/${service.categorySlug}/${service.slug}`
      : `/services/${service.slug}`,
    priority: 0.8,
    changeFrequency: 'monthly',
  }));

  const articleRoutes: RouteEntry[] = articles.map((article) => ({
    path: `/articles/${article.slug}`,
    priority: 0.7,
    changeFrequency: 'weekly',
  }));

  const locationRoutes: RouteEntry[] = locations.map((location) => ({
    path: `/locations/${location.slug}`,
    priority: 0.6,
    changeFrequency: 'monthly',
  }));

  // Local SEO landings are top-priority acquisition pages.
  const landingRoutes: RouteEntry[] = landings
    .map((landing) => landing?.slug)
    .filter((slug): slug is string => typeof slug === 'string' && slug.length > 0)
    .map((slug) => ({
      path: `/${slug}`,
      priority: 0.9,
      changeFrequency: 'weekly' as ChangeFrequency,
    }));

  return [
    ...STATIC_ROUTES,
    ...landingRoutes,
    ...categoryRoutes,
    ...serviceRoutes,
    ...articleRoutes,
    ...locationRoutes,
  ];
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();
  const siteId = await getRequestSiteId();

  const perLocale = await Promise.all(
    LOCALES.map(async (locale) => {
      const routes = await routesForLocale(siteId, locale as Locale);
      return routes.map((route) => ({
        url: `${BASE_URL}/${locale}${route.path}`,
        lastModified: now,
        changeFrequency: route.changeFrequency,
        priority: route.priority,
      }));
    })
  );

  const entries: MetadataRoute.Sitemap = perLocale.flat();

  // De-duplicate in case a slug appears in more than one content collection.
  const seen = new Set<string>();
  const unique = entries.filter((entry) => {
    if (seen.has(entry.url)) return false;
    seen.add(entry.url);
    return true;
  });

  unique.sort((a, b) => (b.priority ?? 0) - (a.priority ?? 0));

  return unique;
}
