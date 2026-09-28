import { loadPublicArticles } from '@/lib/articles';
import { getRequestSiteId, loadAllItems, loadSiteInfo } from '@/lib/content';
import { defaultLocale, locales } from '@/lib/i18n';
import { getLocations } from '@/lib/locations';
import { getSiteDisplayName } from '@/lib/siteInfo';
import { getSiteBaseUrl } from '@/lib/siteUrl';
import { getSiteById } from '@/lib/sites';
import { getServiceCategories, getServices } from '@/lib/services';
import type { Locale, SiteInfo } from '@/lib/types';

export const dynamic = 'force-dynamic';

type LandingEntry = {
  slug?: string;
  title?: string;
  seo?: { h1?: string };
};

type SiteInfoLike = Omit<Partial<SiteInfo>, 'address'> & {
  name?: string;
  nameEN?: string;
  taglineEN?: string;
  serviceAreas?: string[];
  languages?: string[];
  address?: string | { street?: string; city?: string; state?: string; zip?: string; country?: string };
};

function isLocale(value: string | undefined): value is Locale {
  return locales.includes(value as Locale);
}

function normalizeBaseUrl(value: string): string {
  const trimmed = value.trim().replace(/\/+$/, '');
  return trimmed || 'http://localhost:3006';
}

function absoluteUrl(baseUrl: string, locale: Locale, path = ''): string {
  const normalizedPath = path ? (path.startsWith('/') ? path : `/${path}`) : '';
  return `${baseUrl}/${locale}${normalizedPath}`;
}

function formatAddress(info: SiteInfoLike): string {
  if (typeof info.address === 'string' && info.address.trim()) {
    return info.address.trim();
  }
  if (info.address && typeof info.address === 'object') {
    const parts = [
      info.address.street,
      info.address.city,
      info.address.state,
      info.address.zip,
      info.address.country,
    ].filter((part): part is string => typeof part === 'string' && part.trim().length > 0);
    if (parts.length > 0) return parts.join(', ');
  }
  const fallback = [info.city, info.state, info.zip].filter(
    (part): part is string => typeof part === 'string' && part.trim().length > 0
  );
  return fallback.join(', ');
}

function cleanSingleLine(value: string): string {
  return value.replace(/\s*\n\s*/g, ' ').trim();
}

export async function GET(): Promise<Response> {
  const siteId = await getRequestSiteId();
  const site = await getSiteById(siteId);
  const supported = Array.isArray(site?.supportedLocales)
    ? site.supportedLocales.filter((entry): entry is Locale => isLocale(entry))
    : [];
  const locale = isLocale(site?.defaultLocale) ? site.defaultLocale : supported[0] || defaultLocale;
  const baseUrl = normalizeBaseUrl(await getSiteBaseUrl(siteId, locale));

  const [rawSiteInfo, services, categories, locations, articles, landings] = await Promise.all([
    loadSiteInfo(siteId, locale) as Promise<SiteInfoLike | null>,
    getServices(locale, siteId).catch(() => []),
    getServiceCategories(locale, siteId).catch(() => []),
    getLocations(locale, siteId).catch(() => []),
    loadPublicArticles(locale, siteId).catch(() => []),
    loadAllItems<LandingEntry>(siteId, locale, 'landing').catch(() => []),
  ]);

  const info: SiteInfoLike = rawSiteInfo || {};
  const displayName =
    getSiteDisplayName(
      rawSiteInfo
        ? {
            businessName: rawSiteInfo.businessName,
            clinicName: rawSiteInfo.clinicName,
          }
        : null,
      site?.name || siteId
    ) || siteId;
  const lines: string[] = [`# ${displayName}`];

  const description = typeof info.description === 'string' ? cleanSingleLine(info.description) : '';
  if (description) lines.push('', `> ${description}`);

  const tagline =
    locale === 'en'
      ? (typeof info.taglineEN === 'string' ? info.taglineEN : info.tagline)
      : info.tagline;
  if (typeof tagline === 'string' && tagline.trim()) {
    lines.push('', `Tagline: ${cleanSingleLine(tagline)}`);
  }

  const contact: string[] = [];
  if (typeof info.phone === 'string' && info.phone.trim()) contact.push(`- Phone: ${info.phone.trim()}`);
  if (typeof info.email === 'string' && info.email.trim()) contact.push(`- Email: ${info.email.trim()}`);
  const address = formatAddress(info);
  if (address) contact.push(`- Address: ${address}`);
  if (Array.isArray(info.serviceAreas) && info.serviceAreas.length > 0) {
    contact.push(`- Service areas: ${info.serviceAreas.slice(0, 8).join(', ')}`);
  }
  if (contact.length > 0) lines.push('', '## Contact', ...contact);

  const keyPages = [
    ['Home', ''],
    ['About', '/about'],
    ['Services', '/services'],
    ['Consultation', '/consultation'],
    ['Articles', '/articles'],
    ['FAQ', '/faq'],
    ['Testimonials', '/testimonials'],
    ['Contact', '/contact'],
  ] as const;
  lines.push('', '## Key pages', ...keyPages.map(([label, route]) => `- [${label}](${absoluteUrl(baseUrl, locale, route)})`));

  if (categories.length > 0) {
    lines.push('', '## Practice areas');
    for (const category of categories.slice(0, 20)) {
      lines.push(`- [${category.title}](${absoluteUrl(baseUrl, locale, `/services/${category.slug}`)})`);
    }
  }

  if (services.length > 0) {
    lines.push('', '## Services');
    for (const service of services.slice(0, 25)) {
      const route = service.categorySlug
        ? `/services/${service.categorySlug}/${service.slug}`
        : `/services/${service.slug}`;
      const title = locale === 'en' ? service.titleEN || service.title : service.title;
      lines.push(`- [${title}](${absoluteUrl(baseUrl, locale, route)})`);
    }
  }

  if (articles.length > 0) {
    lines.push('', '## Articles');
    for (const article of articles.slice(0, 20)) {
      lines.push(`- [${article.title}](${absoluteUrl(baseUrl, locale, `/articles/${article.slug}`)})`);
    }
  }

  if (locations.length > 0) {
    lines.push('', '## Nearby areas');
    for (const location of locations.slice(0, 12)) {
      const label = locale === 'en' ? location.cityEN || location.h1 : location.cityZH || location.h1;
      lines.push(`- [${label}](${absoluteUrl(baseUrl, locale, `/locations/${location.slug}`)})`);
    }
  }

  const landingLinks = landings
    .map((landing) => landing.slug)
    .filter((slug): slug is string => typeof slug === 'string' && slug.trim().length > 0);
  if (landingLinks.length > 0) {
    lines.push('', '## SEO landing pages');
    for (const slug of landingLinks.slice(0, 12)) {
      lines.push(`- [${slug}](${absoluteUrl(baseUrl, locale, `/${slug}`)})`);
    }
  }

  lines.push(
    '',
    '## Site',
    `- Sitemap: ${baseUrl}/sitemap.xml`,
    `- Robots: ${baseUrl}/robots.txt`,
    `- Languages: ${(supported.length > 0 ? supported : [locale]).join(', ')}`,
    '- Private paths excluded from crawling: /admin/, /api/admin/'
  );

  return new Response(`${lines.join('\n')}\n`, {
    headers: {
      'content-type': 'text/plain; charset=utf-8',
      'cache-control': 'public, max-age=3600, s-maxage=86400',
    },
  });
}
