import { Metadata } from 'next';
import Link from 'next/link';
import { loadPageContent } from '@/lib/content';
import { isValidLocale, defaultLocale, type Locale } from '@/lib/i18n';
import SectionHeader from '@/components/shared/SectionHeader';

/* eslint-disable @typescript-eslint/no-explicit-any */

export async function generateMetadata({
  params,
}: {
  params: { locale: string };
}): Promise<Metadata> {
  const locale = isValidLocale(params.locale) ? params.locale : defaultLocale;
  const content = await loadPageContent<any>('case-studies', locale as Locale);
  const seo = content?.seo;
  return {
    title: seo?.title ?? '案件经验 | 宇霞移民服务中心',
    description: seo?.description ?? '',
  };
}

export default async function CaseStudiesPage({
  params,
}: {
  params: { locale: string };
}) {
  const locale = isValidLocale(params.locale) ? params.locale : defaultLocale;
  const content = await loadPageContent<any>('case-studies', locale as Locale);

  const hero = content?.hero;
  const categories = content?.categories ?? [];
  const caseStudies = content?.caseStudies ?? [];
  const statistics = content?.statistics;
  const disclaimer = content?.disclaimer;
  const cta = content?.cta;

  return (
    <>
      {/* ── Compact Hero ── */}
      <section
        className="flex items-center"
        style={{
          marginTop: '72px',
          background: 'linear-gradient(135deg, var(--primary, #1B2A4A) 0%, var(--primary-dark, #0F1A32) 100%)',
        }}
      >
        <div className="max-w-[1200px] mx-auto px-6 py-14 w-full text-center">
          <h1
            className="text-[2rem] lg:text-[2.5rem] font-bold text-white mb-3"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            {hero?.title ?? '案件处理经验'}
          </h1>
          {hero?.subtitle && (
            <p className="text-white/75 text-base max-w-[600px] mx-auto leading-relaxed">
              {hero.subtitle}
            </p>
          )}
        </div>
      </section>

      {/* ── Disclaimer Banner ── */}
      {disclaimer && (
        <section className="bg-red-50 border-b border-red-200">
          <div className="max-w-[1200px] mx-auto px-6 py-4">
            <div className="flex items-start gap-3">
              <span className="flex-shrink-0 mt-0.5 w-5 h-5 rounded-full bg-red-100 flex items-center justify-center">
                <svg
                  className="w-3 h-3 text-red-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01M12 3l9.66 16.59A1 1 0 0120.66 21H3.34a1 1 0 01-.86-1.41L12 3z"
                  />
                </svg>
              </span>
              <p className="text-sm text-red-800 leading-relaxed">{disclaimer}</p>
            </div>
          </div>
        </section>
      )}

      {/* ── Category Filter Pills ── */}
      <section className="bg-white border-b border-gray-100">
        <div className="max-w-[1200px] mx-auto px-6 py-6">
          <div className="flex flex-wrap justify-center gap-3">
            {categories.map((cat: any) => (
              <button
                key={cat.id}
                className="inline-block text-sm font-medium px-5 py-2 rounded-full border border-gray-200 text-gray-600 transition-all duration-200 hover:border-[var(--accent,#C9963B)] hover:text-[var(--accent,#C9963B)] hover:bg-amber-50"
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ── Case Studies Grid ── */}
      <section className="py-[60px]" style={{ backgroundColor: '#F9FAFB' }}>
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {caseStudies.map((cs: any) => {
              const category = categories.find(
                (c: any) => c.id === cs.category
              );
              return (
                <div
                  key={cs.id}
                  className="bg-white border border-gray-200 rounded-lg p-6 transition-all duration-200 hover:shadow-lg hover:-translate-y-1"
                >
                  {/* Category Badge */}
                  <span
                    className="inline-block text-xs font-semibold uppercase tracking-wider px-3 py-1 rounded-full mb-4"
                    style={{
                      backgroundColor: 'rgba(27, 42, 74, 0.08)',
                      color: 'var(--primary, #1B2A4A)',
                    }}
                  >
                    {category?.name ?? cs.category}
                  </span>

                  {/* Condition Title */}
                  <h3
                    className="text-lg font-bold text-gray-900 mb-3"
                    style={{ fontFamily: 'var(--font-heading)' }}
                  >
                    {cs.condition}
                  </h3>

                  {/* Summary */}
                  <p className="text-sm text-gray-600 leading-relaxed mb-4">
                    {cs.summary}
                  </p>

                  {/* Footer: Outcome + Duration */}
                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    {/* Outcome Badge (green) */}
                    <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full bg-green-50 text-green-700">
                      <svg
                        className="w-3 h-3"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                      {cs.outcome}
                    </span>

                    {/* Duration */}
                    <span className="text-xs text-gray-400">{cs.duration}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Statistics Section ── */}
      {statistics && (
        <section
          className="py-[60px]"
          style={{
            background: 'linear-gradient(135deg, var(--primary, #1B2A4A) 0%, var(--primary-dark, #0F1A32) 100%)',
          }}
        >
          <div className="max-w-[900px] mx-auto px-6">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div
                  className="text-[2.5rem] font-bold mb-2"
                  style={{
                    color: 'var(--accent, #C9963B)',
                    fontFamily: 'var(--font-body, Inter, sans-serif)',
                  }}
                >
                  {statistics.totalCases}
                </div>
                <div className="text-sm text-white/60 uppercase tracking-widest">
                  处理案件
                </div>
              </div>
              <div className="text-center">
                <div
                  className="text-[2.5rem] font-bold mb-2"
                  style={{
                    color: 'var(--accent, #C9963B)',
                    fontFamily: 'var(--font-body, Inter, sans-serif)',
                  }}
                >
                  {statistics.yearsExperience}
                </div>
                <div className="text-sm text-white/60 uppercase tracking-widest">
                  年执业经验
                </div>
              </div>
              <div className="text-center col-span-2 md:col-span-1">
                <div
                  className="text-[2.5rem] font-bold mb-2"
                  style={{
                    color: 'var(--accent, #C9963B)',
                    fontFamily: 'var(--font-body, Inter, sans-serif)',
                  }}
                >
                  {statistics.successRate}
                </div>
                <div className="text-sm text-white/60 uppercase tracking-widest">
                  成功率
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ── CTA Section ── */}
      {cta && (
        <section className="bg-white py-[80px]">
          <div className="max-w-[700px] mx-auto px-6 text-center">
            <h2
              className="text-2xl lg:text-3xl font-bold mb-6"
              style={{
                color: 'var(--primary, #1B2A4A)',
                fontFamily: 'var(--font-heading)',
              }}
            >
              {cta.title}
            </h2>
            <Link
              href={cta.primary?.href ?? '/consultation'}
              className="inline-block px-[36px] py-[16px] font-semibold rounded-md text-white transition-colors"
              style={{ backgroundColor: 'var(--secondary, #B8373D)' }}
            >
              {cta.primary?.label ?? '预约免费咨询'}
            </Link>
          </div>
        </section>
      )}
    </>
  );
}
