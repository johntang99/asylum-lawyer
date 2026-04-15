import type { MetadataRoute } from 'next';
import { ALL_SERVICES } from '@/lib/services-data';
import { ALL_ARTICLES } from '@/lib/articles-data';
import { allCitySlugs } from '@/lib/locations-data';

const BASE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || 'https://www.yuxiaris.com';

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

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticRoutes: RouteEntry[] = [
    // Homepage
    { path: '', priority: 1.0, changeFrequency: 'weekly' },
    // Core SEO landing
    {
      path: '/asylum-lawyer-los-angeles',
      priority: 0.9,
      changeFrequency: 'weekly',
    },
    // Main pages
    { path: '/about', priority: 0.8, changeFrequency: 'monthly' },
    { path: '/services', priority: 0.8, changeFrequency: 'monthly' },
    { path: '/contact', priority: 0.8, changeFrequency: 'monthly' },
    { path: '/consultation', priority: 0.8, changeFrequency: 'monthly' },
    // Secondary pages
    { path: '/faq', priority: 0.7, changeFrequency: 'monthly' },
    { path: '/testimonials', priority: 0.7, changeFrequency: 'monthly' },
    {
      path: '/remote-consultation',
      priority: 0.7,
      changeFrequency: 'monthly',
    },
    // Legal pages
    { path: '/privacy', priority: 0.3, changeFrequency: 'yearly' },
    { path: '/terms', priority: 0.3, changeFrequency: 'yearly' },
    { path: '/disclaimer', priority: 0.3, changeFrequency: 'yearly' },
  ];

  // Service detail pages
  const serviceRoutes: RouteEntry[] = ALL_SERVICES.map((service) => ({
    path: `/services/${service.slug}`,
    priority: 0.8,
    changeFrequency: 'monthly' as ChangeFrequency,
  }));

  // Article detail pages
  const articleRoutes: RouteEntry[] = ALL_ARTICLES.map((article) => ({
    path: `/articles/${article.slug}`,
    priority: 0.7,
    changeFrequency: 'weekly' as ChangeFrequency,
  }));

  // Location pages
  const locationRoutes: RouteEntry[] = allCitySlugs.map((slug) => ({
    path: `/locations/${slug}`,
    priority: 0.6,
    changeFrequency: 'monthly' as ChangeFrequency,
  }));

  const allRoutes = [
    ...staticRoutes,
    ...serviceRoutes,
    ...articleRoutes,
    ...locationRoutes,
  ];

  // Generate entries for both locales
  const entries: MetadataRoute.Sitemap = allRoutes.flatMap((route) =>
    LOCALES.map((locale) => ({
      url: `${BASE_URL}/${locale}${route.path}`,
      lastModified: now,
      changeFrequency: route.changeFrequency,
      priority: route.priority,
    }))
  );

  // Sort by priority descending
  entries.sort((a, b) => (b.priority ?? 0) - (a.priority ?? 0));

  return entries;
}
