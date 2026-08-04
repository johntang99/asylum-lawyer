import { Metadata } from 'next';
import Link from 'next/link';
import FaqAccordion from '@/components/shared/FaqAccordion';
import { loadPageContent } from '@/lib/content';
import { isValidLocale, defaultLocale, type Locale } from '@/lib/i18n';

/* eslint-disable @typescript-eslint/no-explicit-any */

interface FaqItem {
  question: string;
  answer: string;
}

interface FaqCategory {
  id: string;
  label: string;
  questions: FaqItem[];
}

interface FaqContent {
  seo?: { title?: string; description?: string };
  hero?: { headline?: string; subheadline?: string };
  categories?: FaqCategory[];
}

function normalizeCategories(content: FaqContent | null): FaqCategory[] {
  const categories = Array.isArray(content?.categories) ? content!.categories : [];
  return categories
    .map((category, index) => ({
      id: category?.id || `category-${index}`,
      label: category?.label || '',
      questions: Array.isArray(category?.questions) ? category.questions : [],
    }))
    .filter((category) => category.label && category.questions.length > 0);
}

/** FAQPage schema built from whatever questions the site actually publishes. */
function buildFaqSchema(categories: FaqCategory[]) {
  const questions = categories.flatMap((category) => category.questions);
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: questions.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  };
}

export async function generateMetadata({
  params,
}: {
  params: { locale: string };
}): Promise<Metadata> {
  const locale = (isValidLocale(params.locale) ? params.locale : defaultLocale) as Locale;
  const content = await loadPageContent<FaqContent>('faq', locale);
  return {
    title: content?.seo?.title ?? '常见问题',
    description: content?.seo?.description ?? '',
  };
}

export default async function FaqPage({
  params,
  searchParams,
}: {
  params: { locale: string };
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const locale = (isValidLocale(params.locale) ? params.locale : defaultLocale) as Locale;
  const content = await loadPageContent<FaqContent>('faq', locale);
  const faqCategories = normalizeCategories(content);

  const activeCategory =
    typeof searchParams?.category === 'string' ? searchParams.category : 'all';

  const visibleCategories =
    activeCategory === 'all'
      ? faqCategories
      : faqCategories.filter((c) => c.id === activeCategory);

  return (
    <>
      {/* JSON-LD */}
      {faqCategories.length > 0 && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(buildFaqSchema(faqCategories)),
          }}
        />
      )}

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
            {content?.hero?.headline ?? '常见问题'}
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
            <span className="text-gray-900">常见问题</span>
          </nav>
        </div>
      </div>

      {/* ── Category Tabs ── */}
      {faqCategories.length > 1 && (
        <section className="bg-white border-b border-gray-200">
          <div className="max-w-[1200px] mx-auto px-6 py-6">
            <div className="flex flex-wrap justify-center gap-2">
              <Link
                href={`/${locale}/faq`}
                className={`inline-block px-5 py-2 rounded-full text-sm font-medium transition-colors ${
                  activeCategory === 'all'
                    ? 'text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
                style={
                  activeCategory === 'all'
                    ? { backgroundColor: 'var(--primary)' }
                    : undefined
                }
              >
                全部问题
              </Link>
              {faqCategories.map((cat) => (
                <Link
                  key={cat.id}
                  href={`/${locale}/faq?category=${cat.id}`}
                  className={`inline-block px-5 py-2 rounded-full text-sm font-medium transition-colors ${
                    activeCategory === cat.id
                      ? 'text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                  style={
                    activeCategory === cat.id
                      ? { backgroundColor: 'var(--primary)' }
                      : undefined
                  }
                >
                  {cat.label}
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── FAQ Content ── */}
      <section className="bg-white py-[60px]">
        <div className="max-w-[900px] mx-auto px-6">
          {visibleCategories.map((cat) => (
            <div key={cat.id} className="mb-12 last:mb-0">
              <h3
                className="text-xl font-bold text-gray-900 mb-6 pb-3 border-b-2"
                style={{
                  fontFamily: 'var(--font-heading)',
                  borderColor: 'var(--secondary)',
                }}
              >
                {cat.label}
              </h3>
              <FaqAccordion questions={cat.questions} defaultOpen={-1} />
            </div>
          ))}
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
            没有找到您的问题？直接咨询我们
          </h2>
          <p className="text-white/75 mb-8 leading-relaxed">
            每个案件都有其独特之处，我们可以针对您的具体情况提供专业解答
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
