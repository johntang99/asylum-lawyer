import { Metadata } from 'next';
import Link from 'next/link';
import { loadPageContent } from '@/lib/content';
import { isValidLocale, defaultLocale, type Locale } from '@/lib/i18n';

/* eslint-disable @typescript-eslint/no-explicit-any */

interface Testimonial {
  stars: number;
  quote: string;
  name: string;
  caseType: string;
  year: string;
}

interface TestimonialsContent {
  seo?: { title?: string; description?: string };
  hero?: { headline?: string; subheadline?: string };
  rating?: { score?: string; count?: string };
  testimonials?: Testimonial[];
}

function normalizeTestimonials(content: TestimonialsContent | null): Testimonial[] {
  const items = Array.isArray(content?.testimonials) ? content!.testimonials : [];
  return items
    .map((item) => ({
      stars:
        typeof item?.stars === 'number' && item.stars >= 1 && item.stars <= 5
          ? item.stars
          : 5,
      quote: typeof item?.quote === 'string' ? item.quote : '',
      name: typeof item?.name === 'string' ? item.name : '',
      caseType: typeof item?.caseType === 'string' ? item.caseType : '',
      year: typeof item?.year === 'string' ? item.year : '',
    }))
    .filter((item) => item.quote);
}

export async function generateMetadata({
  params,
}: {
  params: { locale: string };
}): Promise<Metadata> {
  const locale = (isValidLocale(params.locale) ? params.locale : defaultLocale) as Locale;
  const content = await loadPageContent<TestimonialsContent>('testimonials', locale);
  return {
    title: content?.seo?.title ?? '客户评价',
    description: content?.seo?.description ?? '',
  };
}

function StarRating({ count }: { count: number }) {
  return (
    <span className="text-lg" style={{ color: 'var(--secondary)' }}>
      {Array.from({ length: count }, () => '★').join('')}
      {Array.from({ length: 5 - count }, () => '☆').join('')}
    </span>
  );
}

export default async function TestimonialsPage({
  params,
}: {
  params: { locale: string };
}) {
  const locale = (isValidLocale(params.locale) ? params.locale : defaultLocale) as Locale;
  const content = await loadPageContent<TestimonialsContent>('testimonials', locale);
  const testimonials = normalizeTestimonials(content);
  const ratingScore = content?.rating?.score ?? '4.9';
  const ratingCount = content?.rating?.count ?? '';

  return (
    <>
      {/* ── Compact Hero ── */}
      <section
        className="flex items-center"
        style={{
          marginTop: '72px',
          minHeight: '280px',
          background:
            'linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%)',
        }}
      >
        <div className="max-w-[1200px] mx-auto px-6 py-16 w-full text-center">
          <h1
            className="text-[2.5rem] font-bold text-white mb-3 leading-tight"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            {content?.hero?.headline ?? '客户评价'}
          </h1>
          <p className="text-white/70 text-lg max-w-[600px] mx-auto">
            {content?.hero?.subheadline ?? ''}
          </p>
        </div>
      </section>

      {/* ── Breadcrumbs ── */}
      <div className="bg-gray-50 border-b border-gray-200">
        <div className="max-w-[1200px] mx-auto px-6 py-3">
          <nav className="text-sm text-gray-500">
            <Link href={`/${locale}`} className="hover:text-gray-700 transition-colors">
              首页
            </Link>
            <span className="mx-2">/</span>
            <span className="text-gray-900">客户评价</span>
          </nav>
        </div>
      </div>

      {/* ── Aggregate Rating ── */}
      <section className="bg-white py-10 border-b border-gray-100">
        <div className="max-w-[1200px] mx-auto px-6 text-center">
          <div className="inline-flex flex-col items-center">
            <span
              className="text-5xl font-bold mb-2"
              style={{ color: 'var(--primary)', fontFamily: 'var(--font-heading)' }}
            >
              {ratingScore}
            </span>
            <span className="text-2xl mb-2" style={{ color: 'var(--secondary)' }}>
              ★★★★★
            </span>
            {ratingCount && (
              <span className="text-gray-500 text-sm">{ratingCount}</span>
            )}
          </div>
        </div>
      </section>

      {/* ── Masonry Testimonial Wall ── */}
      <section className="py-[60px]" style={{ backgroundColor: '#F9FAFB' }}>
        <div className="max-w-[1200px] mx-auto px-6">
          {/* 3-col desktop, 2-col tablet, 1-col mobile */}
          <div className="columns-1 md:columns-2 lg:columns-3 gap-6 [column-fill:_balance]">
            {testimonials.map((t, i) => (
              <div
                key={i}
                className="break-inside-avoid mb-6 bg-white border border-gray-200 rounded-lg p-6"
                style={{ borderLeft: '3px solid var(--secondary)' }}
              >
                <div className="mb-3">
                  <StarRating count={t.stars} />
                </div>
                <p className="text-gray-700 italic leading-relaxed mb-4 text-[15px]">
                  &ldquo;{t.quote}&rdquo;
                </p>
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-semibold flex-shrink-0"
                    style={{ backgroundColor: 'var(--primary)' }}
                  >
                    {t.name.charAt(0)}
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900 text-sm">{t.name}</div>
                    <div className="text-xs text-gray-500">
                      {[t.caseType, t.year].filter(Boolean).join(' · ')}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section
        className="py-[60px]"
        style={{
          background:
            'linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%)',
        }}
      >
        <div className="max-w-[700px] mx-auto px-6 text-center">
          <h2
            className="text-2xl lg:text-3xl font-bold text-white mb-4"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            开始您的案件评估
          </h2>
          <p className="text-white/75 mb-8 leading-relaxed">
            免费初次咨询，让我们了解您的情况并制定专属方案
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href={`/${locale}/consultation`}
              className="inline-block px-[36px] py-[16px] text-white font-semibold rounded-md transition-colors"
              style={{ backgroundColor: 'var(--accent)' }}
            >
              预约免费咨询
            </Link>
            <Link
              href={`/${locale}/contact`}
              className="inline-block px-[36px] py-[16px] font-semibold rounded-md border border-white text-white bg-transparent transition-colors"
            >
              联系我们
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
