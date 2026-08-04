import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import LandingPage from '@/components/landing/LandingPage';
import { getRequestSiteId, loadItemBySlug } from '@/lib/content';
import { isValidLocale, defaultLocale, type Locale } from '@/lib/i18n';

/* eslint-disable @typescript-eslint/no-explicit-any */

/**
 * Slug-driven local SEO landing pages.
 *
 * Content lives in `content/[siteId]/[locale]/landing/[slug].json`, which keeps
 * these pages in their own namespace — this dynamic segment is the last route
 * matched at the locale level, so it must not shadow ordinary page content.
 * Static sibling routes (/about, /services, …) always win over this one.
 */
async function loadLanding(locale: Locale, slug: string) {
  const siteId = await getRequestSiteId();
  const content = await loadItemBySlug<any>(siteId, locale, 'landing', slug);
  return content ?? null;
}

export async function generateMetadata({
  params,
}: {
  params: { locale: string; landing: string };
}): Promise<Metadata> {
  const locale = (isValidLocale(params.locale) ? params.locale : defaultLocale) as Locale;
  const content = await loadLanding(locale, params.landing);
  if (!content) return { title: '页面未找到' };

  return {
    title: content?.seo?.title ?? '',
    description: content?.seo?.description ?? '',
  };
}

export default async function LocalLandingPage({
  params,
}: {
  params: { locale: string; landing: string };
}) {
  const locale = (isValidLocale(params.locale) ? params.locale : defaultLocale) as Locale;
  const content = await loadLanding(locale, params.landing);

  if (!content) {
    notFound();
  }

  return <LandingPage locale={locale} content={content} />;
}
