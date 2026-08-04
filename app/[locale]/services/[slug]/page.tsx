import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { isValidLocale, defaultLocale, type Locale } from '@/lib/i18n';
import { getRequestSiteId, loadSiteInfo } from '@/lib/content';
import {
  getRelatedServices,
  getServiceBySlug,
  getServiceCategoryBySlug,
  getServices,
  getServicesInCategory,
} from '@/lib/services';
import ServiceDetail from '@/components/services/ServiceDetail';
import CategoryHub from '@/components/services/CategoryHub';

/* eslint-disable @typescript-eslint/no-explicit-any */

/**
 * One URL segment under /services resolves to either:
 *  - a category hub (sites with a categorised taxonomy), or
 *  - a service detail page (sites with a flat service list).
 *
 * Keeping both on this route preserves existing /services/[slug] URLs while
 * letting new sites use /services/[category]/[slug] for their detail pages.
 */
async function resolveSegment(locale: Locale, slug: string) {
  const siteId = await getRequestSiteId();
  const category = await getServiceCategoryBySlug(locale, slug, siteId);
  if (category) return { kind: 'category' as const, category, siteId };

  const service = await getServiceBySlug(locale, slug, siteId);
  if (service) return { kind: 'service' as const, service, siteId };

  return { kind: 'none' as const, siteId };
}

export async function generateMetadata({
  params,
}: {
  params: { locale: string; slug: string };
}): Promise<Metadata> {
  const locale = (isValidLocale(params.locale) ? params.locale : defaultLocale) as Locale;
  const resolved = await resolveSegment(locale, params.slug);

  if (resolved.kind === 'category') {
    return {
      title: resolved.category.seo?.title || resolved.category.title,
      description: resolved.category.seo?.description || resolved.category.description,
    };
  }
  if (resolved.kind === 'service') {
    return {
      title: resolved.service.seo.title,
      description: resolved.service.seo.description,
    };
  }
  return { title: '页面未找到' };
}

export default async function ServiceSegmentPage({
  params,
}: {
  params: { locale: string; slug: string };
}) {
  const locale = (isValidLocale(params.locale) ? params.locale : defaultLocale) as Locale;
  const resolved = await resolveSegment(locale, params.slug);

  if (resolved.kind === 'none') {
    notFound();
  }

  const siteInfo = await loadSiteInfo(resolved.siteId, locale);

  if (resolved.kind === 'category') {
    const services = await getServices(locale, resolved.siteId);
    return (
      <CategoryHub
        locale={locale}
        category={resolved.category}
        services={getServicesInCategory(services, resolved.category.slug)}
        siteInfo={siteInfo}
      />
    );
  }

  const { service } = resolved;
  const [relatedServices, category] = await Promise.all([
    getRelatedServices(locale, service.relatedSlugs, resolved.siteId),
    service.categorySlug
      ? getServiceCategoryBySlug(locale, service.categorySlug, resolved.siteId)
      : Promise.resolve(null),
  ]);

  return (
    <ServiceDetail
      locale={locale}
      service={service}
      relatedServices={relatedServices}
      category={category}
      siteInfo={siteInfo}
    />
  );
}
