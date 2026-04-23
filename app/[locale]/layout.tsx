import { notFound } from 'next/navigation';
import { defaultLocale, isValidLocale, locales, type Locale } from '@/lib/i18n';
import { getDefaultSite, getSiteById } from '@/lib/sites';
import {
  getRequestSiteId,
  loadContent,
  loadFooter,
  loadSeo,
  loadTheme,
  loadSiteInfo,
} from '@/lib/content';
import type {
  SeoConfig,
  SiteInfo,
  ThemeConfig,
} from '@/lib/types';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type HeaderConfig = any;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type FooterConfig = any;
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import TrustBar from '@/components/shared/TrustBar';
import LegalDisclaimer from '@/components/shared/LegalDisclaimer';
import MobileStickyBar from '@/components/shared/MobileStickyBar';

export async function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: { locale: string };
}) {
  const requestSiteId = await getRequestSiteId();
  const site = (await getSiteById(requestSiteId)) || (await getDefaultSite());
  const locale = isValidLocale(params.locale) ? params.locale : defaultLocale;

  if (!site) {
    return {
      title: '宇霞移民服务中心',
      description: '专业庇护移民律师事务所',
    };
  }

  const [siteInfoRaw, seoRaw] = await Promise.all([
    loadSiteInfo(site.id, locale),
    loadSeo(site.id, locale),
  ]);
  const siteInfo = siteInfoRaw as any;
  const seo = seoRaw as any;

  const titleBase = (siteInfo as any)?.name || (siteInfo as any)?.businessName || site.name;
  const description =
    seo?.description ||
    siteInfo?.description ||
    '洛杉矶专业中文庇护移民律师，提供政治庇护、移民签证等法律服务。';
  const titleDefault = seo?.title || titleBase;
  const siteUrl = (seo as any)?.siteUrl || process.env.NEXT_PUBLIC_SITE_URL || '';
  const canonical = siteUrl ? `${siteUrl}/${locale}` : undefined;

  const languageAlternates = siteUrl
    ? locales.reduce<Record<string, string>>((acc, entry) => {
        acc[entry] = `${siteUrl}/${entry}`;
        return acc;
      }, {})
    : undefined;

  return {
    title: {
      default: titleDefault,
      template: `%s | ${titleBase}`,
    },
    description,
    alternates: {
      canonical,
      languages: languageAlternates
        ? {
            ...languageAlternates,
            'x-default': `${siteUrl}/${defaultLocale}`,
          }
        : undefined,
    },
    openGraph: {
      title: seo?.ogTitle || titleDefault,
      description: seo?.ogDescription || description,
      url: canonical,
      siteName: titleBase,
      locale,
      type: 'website',
      images: seo?.ogImage ? [{ url: seo.ogImage }] : undefined,
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  const { locale } = params;

  // Validate locale
  if (!isValidLocale(locale)) {
    notFound();
  }

  // Resolve site
  const requestSiteId = await getRequestSiteId();
  const site = (await getSiteById(requestSiteId)) || (await getDefaultSite());

  if (!site) {
    return <div>No site configured</div>;
  }

  // Load theme, siteInfo, seo, footer, header in parallel
  const [theme, siteInfoData, seoData, footer, headerConfig] = await Promise.all([
    loadTheme(site.id),
    loadSiteInfo(site.id, locale as Locale),
    loadSeo(site.id, locale as Locale),
    loadFooter(site.id, locale as Locale),
    loadContent<HeaderConfig>(site.id, locale as Locale, 'header.json'),
  ]);
  const siteInfo = siteInfoData as any;
  const seo = seoData as any;

  // Map spacing density
  const spacingDensityMap: Record<string, string> = {
    compact: '3rem',
    comfortable: '5rem',
    spacious: '8rem',
  };

  const themeSpacingDensity = String(theme?.layout?.spacingDensity || 'comfortable');
  const themeSectionPaddingY =
    spacingDensityMap[themeSpacingDensity] || spacingDensityMap.comfortable;
  const themeRadius = theme?.shape?.radius || '8px';
  const themeShadow = theme?.shape?.shadow || '0 4px 20px rgba(0,0,0,0.08)';

  // Generate inline style for theme CSS variables
  const themeStyle = theme
    ? `
    :root {
      /* Primary Colors */
      --primary: ${theme.colors.primary.DEFAULT};
      --primary-dark: ${theme.colors.primary.dark};
      --primary-light: ${theme.colors.primary.light};
      --primary-50: ${theme.colors.primary['50']};
      --primary-100: ${theme.colors.primary['100']};

      /* Secondary Colors */
      --secondary: ${theme.colors.secondary.DEFAULT};
      --secondary-dark: ${theme.colors.secondary.dark};
      --secondary-light: ${theme.colors.secondary.light};
      --secondary-50: ${theme.colors.secondary['50']};

      /* Accent Colors */
      --accent: ${theme.colors.accent.DEFAULT};
      --accent-dark: ${theme.colors.accent.dark};
      --accent-light: ${theme.colors.accent.light};

      /* Backdrop Colors */
      --backdrop-primary: ${theme.colors.backdrop.primary};
      --backdrop-secondary: ${theme.colors.backdrop.secondary};

      /* Typography */
      --text-display: ${theme.typography?.display || '3rem'};
      --text-heading: ${theme.typography?.heading || '2.25rem'};
      --text-subheading: ${theme.typography?.subheading || '1.25rem'};
      --text-body: ${theme.typography?.body || '1rem'};
      --text-small: ${theme.typography?.small || '0.875rem'};
      --font-heading: ${theme.typography?.fonts?.heading || "'Noto Serif SC', serif"};
      --font-body: ${theme.typography?.fonts?.body || "'Noto Sans SC', 'Inter', sans-serif"};

      /* Shape */
      --radius-base: ${themeRadius};
      --shadow-base: ${themeShadow};

      /* Layout */
      --section-padding-y: ${themeSectionPaddingY};
    }
  `
    : '';

  // Build JSON-LD for LocalBusiness
  const jsonLd = siteInfo
    ? {
        '@context': 'https://schema.org',
        '@type': 'LocalBusiness',
        '@id': seo?.siteUrl ? `${seo.siteUrl}/#organization` : undefined,
        name: siteInfo.name,
        description: siteInfo.description || seo?.description,
        telephone: siteInfo.phone,
        email: siteInfo.email,
        url: seo?.siteUrl || undefined,
        address: siteInfo.address
          ? {
              '@type': 'PostalAddress',
              streetAddress: siteInfo.address.street,
              addressLocality: siteInfo.address.city,
              addressRegion: siteInfo.address.state,
              postalCode: siteInfo.address.zip,
              addressCountry: siteInfo.address.country || 'US',
            }
          : undefined,
        openingHoursSpecification: siteInfo.hours
          ? [
              {
                '@type': 'OpeningHoursSpecification',
                dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
                opens: siteInfo.hours.weekday.split('-')[0]?.trim(),
                closes: siteInfo.hours.weekday.split('-')[1]?.trim(),
              },
            ]
          : undefined,
        knowsLanguage: siteInfo.languages,
        areaServed: siteInfo.serviceAreas,
      }
    : null;

  return (
    <>
      {/* Inject theme CSS variables */}
      {theme && <style dangerouslySetInnerHTML={{ __html: themeStyle }} />}

      {/* LocalBusiness JSON-LD */}
      {jsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      )}

      <div className="min-h-screen flex flex-col">
        <Header
          locale={locale}
          headerConfig={headerConfig ?? undefined}
        />
        <main className="flex-grow">{children}</main>
        <TrustBar />
        <LegalDisclaimer disclaimer={siteInfo?.legal?.disclaimer} />
        <Footer
          locale={locale}
          footerConfig={footer ?? undefined}
        />
        <MobileStickyBar phone={siteInfo?.phone} />
      </div>
    </>
  );
}
