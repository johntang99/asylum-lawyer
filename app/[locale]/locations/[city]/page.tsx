import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import SectionHeader from '@/components/shared/SectionHeader';
import { isValidLocale, defaultLocale, type Locale } from '@/lib/i18n';
import { getRequestSiteId, loadSiteInfo } from '@/lib/content';
import { getLocationBySlug } from '@/lib/locations';
import { getServices, serviceHref } from '@/lib/services';
import { getSiteDisplayName } from '@/lib/siteInfo';

/* eslint-disable @typescript-eslint/no-explicit-any */

/** Formats the site's address object (or string) into one display line. */
function formatAddress(siteInfo: any): string {
  const address = siteInfo?.address;
  if (!address) return '';
  if (typeof address === 'string') return address;
  return [address.street, address.city, address.state, address.zip]
    .filter(Boolean)
    .join(', ');
}

export async function generateMetadata({
  params,
}: {
  params: { locale: string; city: string };
}): Promise<Metadata> {
  const locale = (isValidLocale(params.locale) ? params.locale : defaultLocale) as Locale;
  const data = await getLocationBySlug(locale, params.city);
  if (!data) {
    return { title: '页面未找到' };
  }
  return {
    title: data.seo.title,
    description: data.seo.description,
  };
}

export default async function NearLocationPage({
  params,
}: {
  params: { locale: string; city: string };
}) {
  const locale = (isValidLocale(params.locale) ? params.locale : defaultLocale) as Locale;
  const siteId = await getRequestSiteId();
  const data = await getLocationBySlug(locale, params.city, siteId);

  if (!data) {
    notFound();
  }

  const [siteInfo, allServices] = await Promise.all([
    loadSiteInfo(siteId, locale),
    getServices(locale, siteId),
  ]);

  // Feature the site's primary services rather than a hardcoded list, so these
  // pages always link to services that actually exist.
  const featuredServices = allServices
    .filter((service) => service.category === 'primary')
    .slice(0, 6);

  const businessName = getSiteDisplayName(
    { businessName: (siteInfo as any)?.name },
    ''
  );
  const addressLine = formatAddress(siteInfo);
  const email = (siteInfo as any)?.email || '';
  const phone = (siteInfo as any)?.phone || '';

  return (
    <main>
      {/* ── Hero ── */}
      <section
        className="flex items-center"
        style={{
          marginTop: '72px',
          background:
            'linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%)',
        }}
      >
        <div className="max-w-[1200px] mx-auto px-6 py-16 w-full">
          <h1
            className="text-3xl md:text-4xl font-bold text-white mb-4 leading-tight"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            {data.h1}
          </h1>
          <p className="text-base md:text-lg text-white/85 leading-relaxed mb-6 max-w-[700px]">
            {data.intro}
          </p>
          {data.distance && (
            <span
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium"
              style={{
                backgroundColor: 'rgba(184, 150, 56, 0.2)',
                color: 'var(--secondary-light)',
              }}
            >
              📍 {data.distance}
            </span>
          )}
        </div>
      </section>

      {/* ── Core Services ── */}
      {featuredServices.length > 0 && (
        <section className="py-16 bg-white">
          <div className="max-w-[1200px] mx-auto px-6">
            <SectionHeader
              title="我们的服务"
              subtitle="为您提供全方位的专业法律支持"
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-10">
              {featuredServices.map((svc) => (
                <Link
                  key={svc.slug}
                  href={serviceHref(locale, svc)}
                  className="block p-6 rounded-lg border border-gray-200 hover:shadow-md transition-all"
                >
                  <div className="text-3xl mb-3">{svc.icon}</div>
                  <h3
                    className="text-lg font-semibold mb-2"
                    style={{ color: 'var(--primary)' }}
                  >
                    {svc.title}
                  </h3>
                  <p className="text-sm text-gray-600 line-clamp-2">
                    {svc.description}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── NAP Block ── */}
      <section className="py-12" style={{ backgroundColor: '#F8F6F0' }}>
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-8">
            <div className="flex-1">
              {businessName && (
                <h2
                  className="text-2xl font-bold mb-3"
                  style={{
                    color: 'var(--primary)',
                    fontFamily: 'var(--font-heading)',
                  }}
                >
                  {businessName}
                </h2>
              )}
              {addressLine && <p className="text-gray-700 mb-1">📍 {addressLine}</p>}
              {phone && <p className="text-gray-700 mb-1">📞 {phone}</p>}
              {email && <p className="text-gray-700">📧 {email}</p>}
            </div>
            <div className="flex-shrink-0">
              <Link
                href={`/${locale}/consultation`}
                className="inline-block px-8 py-3 text-white font-semibold rounded-md transition-colors"
                style={{ backgroundColor: 'var(--accent)' }}
              >
                预约咨询
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── Testimonial ── */}
      {data.testimonial && (
        <section className="py-14 bg-white">
          <div className="max-w-[800px] mx-auto px-6 text-center">
            <div className="text-4xl mb-4" style={{ color: 'var(--secondary)' }}>
              &ldquo;
            </div>
            <blockquote className="text-lg text-gray-700 italic leading-relaxed mb-4">
              {data.testimonial.quote}
            </blockquote>
            <p className="text-sm font-medium" style={{ color: 'var(--primary)' }}>
              — {data.testimonial.name}
            </p>
          </div>
        </section>
      )}

      {/* ── CTA ── */}
      <section
        className="py-14"
        style={{
          background:
            'linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%)',
        }}
      >
        <div className="max-w-[800px] mx-auto px-6 text-center">
          <h2
            className="text-2xl md:text-3xl font-bold text-white mb-4"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            为{data.cityZH}华人社区提供专业法律服务
          </h2>
          <p className="text-white/80 mb-8">
            无论您身在{data.cityZH}还是周边地区，我们都能为您提供专业的中文法律服务。
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href={`/${locale}/consultation`}
              className="inline-block px-8 py-3 text-white font-semibold rounded-md transition-colors"
              style={{ backgroundColor: 'var(--accent)' }}
            >
              预约咨询
            </Link>
            <Link
              href={`/${locale}/services`}
              className="inline-block px-8 py-3 font-semibold rounded-md border border-white/40 text-white hover:bg-white/10 transition-colors"
            >
              查看全部服务
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
