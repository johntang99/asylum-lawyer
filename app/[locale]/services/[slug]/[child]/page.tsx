import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { isValidLocale, defaultLocale, type Locale } from '@/lib/i18n';
import { getRequestSiteId, loadSiteInfo } from '@/lib/content';
import {
  getRelatedServices,
  getServiceBySlug,
  getServiceCategoryBySlug,
} from '@/lib/services';
import ServiceDetail from '@/components/services/ServiceDetail';

/* eslint-disable @typescript-eslint/no-explicit-any */

/**
 * Service detail page for sites using the two-tier taxonomy:
 * /services/[category]/[slug]. The service must actually belong to the
 * category in the URL, so a wrong pairing 404s instead of serving duplicate
 * content under two paths.
 */
async function resolveService(locale: Locale, categorySlug: string, slug: string) {
  const siteId = await getRequestSiteId();
  const [service, category] = await Promise.all([
    getServiceBySlug(locale, slug, siteId),
    getServiceCategoryBySlug(locale, categorySlug, siteId),
  ]);

  if (!service || !category) return null;
  if (service.categorySlug !== category.slug) return null;

  return { service, category, siteId };
}

export async function generateMetadata({
  params,
}: {
  params: { locale: string; slug: string; child: string };
}): Promise<Metadata> {
  const locale = (isValidLocale(params.locale) ? params.locale : defaultLocale) as Locale;
  // params.slug is the category segment; params.child is the service.
  const resolved = await resolveService(locale, params.slug, params.child);
  if (!resolved) return { title: '页面未找到' };

  return {
    title: resolved.service.seo.title,
    description: resolved.service.seo.description,
  };
}

export default async function CategorisedServicePage({
  params,
}: {
  params: { locale: string; slug: string; child: string };
}) {
  const locale = (isValidLocale(params.locale) ? params.locale : defaultLocale) as Locale;
  // params.slug is the category segment; params.child is the service.
  const resolved = await resolveService(locale, params.slug, params.child);

  if (!resolved) {
    notFound();
  }

  const [siteInfo, relatedServices] = await Promise.all([
    loadSiteInfo(resolved.siteId, locale),
    getRelatedServices(locale, resolved.service.relatedSlugs, resolved.siteId),
  ]);

  return (
    <ServiceDetail
      locale={locale}
      service={resolved.service}
      relatedServices={relatedServices}
      category={resolved.category}
      siteInfo={siteInfo}
    />
  );
}
