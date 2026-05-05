import { Metadata } from 'next';
import Link from 'next/link';
import { isValidLocale, defaultLocale, type Locale } from '@/lib/i18n';
import { loadPageContent } from '@/lib/content';
import SectionHeader from '@/components/shared/SectionHeader';
import {
  getArticleDisplayDate,
  loadPublicArticles,
} from '@/lib/articles';

export async function generateMetadata({
  params,
}: {
  params: { locale: string };
}): Promise<Metadata> {
  const locale = (isValidLocale(params.locale) ? params.locale : defaultLocale) as Locale;
  const pageContent = await loadPageContent<any>('articles', locale);
  const seo = pageContent?.seo;
  return {
    title: seo?.title ?? '文章中心 | 宇霞移民服务中心',
    description:
      seo?.description ??
      '庇护移民知识库：了解美国政治庇护申请流程、I-589填写指南、庇护面谈准备、被拒补救方案等专业法律知识。',
  };
}

export default async function ArticlesPage({
  params,
  searchParams,
}: {
  params: { locale: string };
  searchParams: { category?: string };
}) {
  const locale = (isValidLocale(params.locale) ? params.locale : defaultLocale) as Locale;
  const pageContent = await loadPageContent<any>('articles', locale);
  const activeCategory = searchParams.category || 'all';
  const articles = await loadPublicArticles(locale);
  const categories = [
    { key: 'all', label: pageContent?.categories?.allLabel || '全部' },
    ...Array.from(
      new Set(
        articles
          .map((article) => article.category.trim())
          .filter(Boolean)
      )
    ).map((category) => ({
      key: category,
      label: category,
    })),
  ];
  const filteredArticles =
    activeCategory === 'all'
      ? articles
      : articles.filter((article) => article.category === activeCategory);

  return (
    <main>
      {/* ── Compact Hero ── */}
      <section
        className="flex items-center"
        style={{
          marginTop: '72px',
          background: 'linear-gradient(135deg, #1B2A4A 0%, #0F1A32 100%)',
        }}
      >
        <div className="max-w-[1200px] mx-auto px-6 py-16 w-full">
          <nav className="mb-4">
            <ol className="flex items-center gap-2 text-sm text-white/60">
              <li>
                <Link
                  href={`/${locale}`}
                  className="hover:text-white transition-colors"
                >
                  首页
                </Link>
              </li>
              <li>
                <span className="mx-1">&gt;</span>
              </li>
              <li className="text-white/90">文章中心</li>
            </ol>
          </nav>
          <h1
            className="text-[2.5rem] md:text-[3rem] font-bold text-white mb-3 leading-tight"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            {pageContent?.hero?.headline || '文章中心'}
          </h1>
          <p className="text-lg text-white/80 max-w-[600px] leading-relaxed">
            {pageContent?.hero?.subheadline ||
              '庇护移民知识库 — 专业法律知识，助您了解庇护申请的每一个环节'}
          </p>
        </div>
      </section>

      {/* ── Category Filter Pills ── */}
      <section className="bg-white border-b border-gray-200">
        <div className="max-w-[1200px] mx-auto px-6 py-5">
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => {
              const isActive = activeCategory === cat.key;
              return (
                <Link
                  key={cat.key}
                  href={
                    cat.key === 'all'
                      ? `/${locale}/articles`
                      : `/${locale}/articles?category=${encodeURIComponent(cat.key)}`
                  }
                  className={`inline-block px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    isActive
                      ? 'text-white'
                      : 'text-gray-600 bg-gray-100 hover:bg-gray-200'
                  }`}
                  style={
                    isActive
                      ? { backgroundColor: '#1B2A4A' }
                      : undefined
                  }
                >
                  {cat.label}
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Article Grid ── */}
      <section className="bg-white py-[80px]">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredArticles.map((article) => (
              <article
                key={article.slug}
                className="group border border-gray-200 rounded-lg overflow-hidden transition-all duration-200 hover:shadow-lg hover:-translate-y-1"
              >
                {/* Cover Image */}
                <div
                  className="relative h-[200px]"
                  style={{
                    background: article.image
                      ? undefined
                      : 'linear-gradient(135deg, #1B2A4A 0%, #2D4A7A 50%, #1B2A4A 100%)',
                    backgroundImage: article.image
                      ? `linear-gradient(rgba(10, 18, 36, 0.2), rgba(10, 18, 36, 0.2)), url("${article.image}")`
                      : undefined,
                    backgroundSize: article.image ? 'cover' : undefined,
                    backgroundPosition: article.image ? 'center' : undefined,
                  }}
                >
                  {/* Category Badge */}
                  <span
                    className="absolute top-4 left-4 inline-block px-3 py-1 text-xs font-semibold rounded-full text-white"
                    style={{ backgroundColor: 'rgba(201, 150, 59, 0.9)' }}
                  >
                    {article.category || '法律知识'}
                  </span>
                  {!article.image && (
                    <div className="absolute inset-0 flex items-center justify-center opacity-10">
                      <svg
                        width="120"
                        height="120"
                        viewBox="0 0 120 120"
                        fill="none"
                      >
                        <circle
                          cx="60"
                          cy="60"
                          r="50"
                          stroke="white"
                          strokeWidth="2"
                        />
                        <circle
                          cx="60"
                          cy="60"
                          r="30"
                          stroke="white"
                          strokeWidth="2"
                        />
                      </svg>
                    </div>
                  )}
                </div>

                {/* Card Body */}
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-[#1B2A4A] transition-colors">
                    <Link href={`/${locale}/articles/${article.slug}`}>
                      {article.title}
                    </Link>
                  </h3>
                  <p className="text-sm text-gray-500 leading-relaxed mb-4 line-clamp-2">
                    {article.excerpt}
                  </p>
                  <div className="flex items-center justify-between text-xs text-gray-400">
                    <span>{getArticleDisplayDate(article) || '-'}</span>
                    <span>{article.readTime || '5 分钟'}阅读</span>
                  </div>
                </div>
              </article>
            ))}
          </div>

          {filteredArticles.length === 0 && (
            <div className="text-center py-20">
              <p className="text-gray-400 text-lg">
                {pageContent?.emptyState?.message || '该分类下暂无文章'}
              </p>
            </div>
          )}
        </div>
      </section>

      {/* ── CTA Section ── */}
      <section
        className="py-[80px]"
        style={{
          background: 'linear-gradient(135deg, #1B2A4A 0%, #0F1A32 100%)',
        }}
      >
        <div className="max-w-[1200px] mx-auto px-6">
          <SectionHeader
            light
            title={pageContent?.cta?.headline || '需要个人法律建议？'}
            subtitle={
              pageContent?.cta?.subheadline ||
              '每个案件都是独特的。文章提供一般性信息，但无法替代专业律师针对您具体情况的法律建议。'
            }
          />
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href={pageContent?.cta?.primary?.href || `/${locale}/consultation`}
              className="inline-block px-[36px] py-[16px] text-white font-semibold rounded-md transition-colors"
              style={{ backgroundColor: '#B8373D' }}
            >
              {pageContent?.cta?.primary?.label || '预约免费咨询'}
            </Link>
            <Link
              href={pageContent?.cta?.secondary?.href || 'mailto:yuxiaris@gmail.com'}
              className="inline-block px-[36px] py-[16px] font-semibold rounded-md border border-white text-white bg-transparent transition-colors"
            >
              {pageContent?.cta?.secondary?.label || '发送邮件至 yuxiaris@gmail.com'}
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
