import { Metadata } from 'next';
import Link from 'next/link';
import SectionHeader from '@/components/shared/SectionHeader';
import { loadPageContent } from '@/lib/content';
import { isValidLocale, defaultLocale, type Locale } from '@/lib/i18n';

/* eslint-disable @typescript-eslint/no-explicit-any */

const PAGE = 'remote-consultation';

export async function generateMetadata({
  params,
}: {
  params: { locale: string };
}): Promise<Metadata> {
  const locale = (isValidLocale(params.locale) ? params.locale : defaultLocale) as Locale;
  const content = await loadPageContent<any>(PAGE, locale);
  return {
    title: content?.seo?.title ?? '远程咨询',
    description: content?.seo?.description ?? '',
  };
}

export default async function RemoteConsultationPage({
  params,
}: {
  params: { locale: string };
}) {
  const locale = (isValidLocale(params.locale) ? params.locale : defaultLocale) as Locale;
  const content = await loadPageContent<any>(PAGE, locale);

  const steps: any[] = Array.isArray(content?.process?.steps)
    ? content.process.steps
    : [];
  const regions: string[] = Array.isArray(content?.coverage?.regions)
    ? content.coverage.regions
    : [];
  const platforms: any[] = Array.isArray(content?.platforms?.items)
    ? content.platforms.items
    : [];
  const badges: string[] = Array.isArray(content?.promise?.badges)
    ? content.promise.badges
    : [];
  const consultationHref = `/${locale}/consultation`;

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
        <div className="max-w-[1200px] mx-auto px-6 py-20 w-full text-center">
          <h1
            className="text-3xl md:text-[2.75rem] font-bold text-white mb-4 leading-tight"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            {content?.hero?.headline ?? ''}
          </h1>
          <p className="text-lg text-white/85 leading-relaxed max-w-[640px] mx-auto mb-8">
            {content?.hero?.subheadline ?? ''}
          </p>
          <Link
            href={consultationHref}
            className="inline-block px-10 py-4 text-white font-semibold rounded-md transition-colors text-lg"
            style={{ backgroundColor: 'var(--accent)' }}
          >
            {content?.hero?.ctaLabel ?? '预约咨询'}
          </Link>
        </div>
      </section>

      {/* ── How It Works ── */}
      {steps.length > 0 && (
        <section className="py-16 bg-white">
          <div className="max-w-[1200px] mx-auto px-6">
            <SectionHeader
              title={content?.process?.title ?? ''}
              subtitle={content?.process?.subtitle ?? ''}
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-10">
              {steps.map((step: any, i: number) => (
                <div key={step.num ?? i} className="relative text-center p-6">
                  <div
                    className="w-14 h-14 rounded-full flex items-center justify-center text-2xl mx-auto mb-4"
                    style={{ backgroundColor: 'rgba(27, 42, 74, 0.08)' }}
                  >
                    {step.icon}
                  </div>
                  <div
                    className="text-xs font-bold mb-2"
                    style={{ color: 'var(--secondary)' }}
                  >
                    STEP {step.num}
                  </div>
                  <h3
                    className="text-lg font-semibold mb-2"
                    style={{ color: 'var(--primary)' }}
                  >
                    {step.title}
                  </h3>
                  <p className="text-sm text-gray-600">{step.desc}</p>
                  {i < steps.length - 1 && (
                    <div className="hidden lg:block absolute top-12 -right-3 text-gray-300 text-2xl">
                      →
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── Coverage ── */}
      {content?.coverage && (
        <section className="py-16" style={{ backgroundColor: '#F8F6F0' }}>
          <div className="max-w-[1200px] mx-auto px-6">
            <SectionHeader
              title={content.coverage.title ?? ''}
              subtitle={content.coverage.subtitle ?? ''}
            />
            <div className="mt-10 flex flex-col md:flex-row items-center gap-10">
              <div
                className="flex-1 min-h-[240px] rounded-lg flex items-center justify-center text-6xl"
                style={{ backgroundColor: 'rgba(27, 42, 74, 0.06)' }}
              >
                {content.coverage.emoji ?? '🌎'}
              </div>
              <div className="flex-1">
                <p className="text-gray-700 mb-6 leading-relaxed">
                  {content.coverage.body ?? ''}
                </p>
                <div className="flex flex-wrap gap-2">
                  {regions.map((region: string) => (
                    <span
                      key={region}
                      className="px-3 py-1 rounded-full text-sm font-medium"
                      style={{
                        backgroundColor: 'rgba(27, 42, 74, 0.08)',
                        color: 'var(--primary)',
                      }}
                    >
                      {region}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ── Technology / Platforms ── */}
      {platforms.length > 0 && (
        <section className="py-16 bg-white">
          <div className="max-w-[1200px] mx-auto px-6">
            <SectionHeader
              title={content?.platforms?.title ?? ''}
              subtitle={content?.platforms?.subtitle ?? ''}
            />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10">
              {platforms.map((p: any) => (
                <div
                  key={p.title}
                  className="p-6 rounded-lg border border-gray-200 hover:shadow-md transition-all text-center"
                >
                  <div className="text-4xl mb-4">{p.icon}</div>
                  <h3
                    className="text-lg font-semibold mb-3"
                    style={{ color: 'var(--primary)' }}
                  >
                    {p.title}
                  </h3>
                  <p className="text-sm text-gray-600 leading-relaxed">{p.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── Same Quality Promise ── */}
      {content?.promise && (
        <section className="py-14" style={{ backgroundColor: '#F8F6F0' }}>
          <div className="max-w-[800px] mx-auto px-6 text-center">
            <h2
              className="text-2xl font-bold mb-4"
              style={{ color: 'var(--primary)', fontFamily: 'var(--font-heading)' }}
            >
              {content.promise.title ?? ''}
            </h2>
            <p className="text-gray-700 leading-relaxed mb-6">
              {content.promise.body ?? ''}
            </p>
            <div className="flex flex-wrap justify-center gap-6 text-sm text-gray-600">
              {badges.map((badge: string) => (
                <span key={badge} className="flex items-center gap-2">
                  ✅ {badge}
                </span>
              ))}
            </div>
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
            {content?.cta?.title ?? ''}
          </h2>
          <p className="text-white/80 mb-8">{content?.cta?.subtitle ?? ''}</p>
          <Link
            href={consultationHref}
            className="inline-block px-10 py-4 text-white font-semibold rounded-md transition-colors text-lg"
            style={{ backgroundColor: 'var(--accent)' }}
          >
            {content?.cta?.label ?? '预约咨询'}
          </Link>
        </div>
      </section>
    </main>
  );
}
