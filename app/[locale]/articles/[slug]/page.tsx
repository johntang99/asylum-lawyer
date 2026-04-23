import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { isValidLocale, defaultLocale } from '@/lib/i18n';
import SectionHeader from '@/components/shared/SectionHeader';
import {
  ALL_ARTICLES,
  getArticleBySlug,
  getRelatedArticles,
} from '@/lib/articles-data';

export async function generateStaticParams() {
  return ALL_ARTICLES.map((article) => ({ slug: article.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: { locale: string; slug: string };
}): Promise<Metadata> {
  const article = getArticleBySlug(params.slug);
  if (!article) {
    return { title: '文章未找到' };
  }
  return {
    title: `${article.title} | 宇霞移民服务中心`,
    description: article.excerpt,
  };
}

export default async function ArticleDetailPage({
  params,
}: {
  params: { locale: string; slug: string };
}) {
  const locale = isValidLocale(params.locale) ? params.locale : defaultLocale;
  const article = getArticleBySlug(params.slug);

  if (!article) {
    notFound();
  }

  const relatedArticles = getRelatedArticles(article.relatedSlugs);

  // Split content roughly at 40% for mid-article CTA insertion
  const contentParts = (() => {
    const allContent = article.content;
    const midPoint = Math.floor(allContent.length * 0.4);
    // Find the next closing tag after midpoint to avoid breaking HTML
    const breakIndex = allContent.indexOf('</p>', midPoint);
    if (breakIndex === -1) return [allContent, ''];
    const splitAt = breakIndex + 4;
    return [allContent.slice(0, splitAt), allContent.slice(splitAt)];
  })();

  return (
    <main>
      {/* ── Compact Hero with Breadcrumb ── */}
      <section
        className="flex items-center"
        style={{
          marginTop: '72px',
          background: 'linear-gradient(135deg, #1B2A4A 0%, #0F1A32 100%)',
        }}
      >
        <div className="max-w-[1200px] mx-auto px-6 py-16 w-full">
          {/* Breadcrumb */}
          <nav className="mb-4">
            <ol className="flex flex-wrap items-center gap-2 text-sm text-white/60">
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
              <li>
                <Link
                  href={`/${locale}/articles`}
                  className="hover:text-white transition-colors"
                >
                  文章中心
                </Link>
              </li>
              <li>
                <span className="mx-1">&gt;</span>
              </li>
              <li>
                <Link
                  href={`/${locale}/articles?category=${article.category}`}
                  className="hover:text-white transition-colors"
                >
                  {article.categoryLabel}
                </Link>
              </li>
              <li>
                <span className="mx-1">&gt;</span>
              </li>
              <li className="text-white/90">{article.title}</li>
            </ol>
          </nav>

          <h1
            className="text-[2rem] md:text-[2.5rem] font-bold text-white mb-4 leading-tight max-w-[800px]"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            {article.title}
          </h1>

          {/* Meta: category badge + date + read time */}
          <div className="flex flex-wrap items-center gap-3 mb-6">
            <span
              className="inline-block px-3 py-1 text-xs font-semibold rounded-full text-white"
              style={{ backgroundColor: 'rgba(201, 150, 59, 0.9)' }}
            >
              {article.categoryLabel}
            </span>
            <span className="text-sm text-white/60">{article.date}</span>
            <span className="text-sm text-white/60">
              阅读时间 {article.readTime}
            </span>
          </div>

          {/* Author Byline */}
          <div className="flex items-center gap-4">
            {/* Photo placeholder */}
            <div
              className="w-12 h-12 rounded-full flex-shrink-0 flex items-center justify-center text-white font-bold text-lg"
              style={{ backgroundColor: '#C9963B' }}
            >
              张
            </div>
            <div>
              <div className="text-white font-medium">宇霞</div>
              <div className="text-white/60 text-sm">
                美国司法部（DOJ）认证法律代表
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Article Body ── */}
      <section className="bg-white py-[60px]">
        <div className="max-w-[800px] mx-auto px-6">
          {/* First part of content (~40%) */}
          <div
            className="prose prose-lg max-w-none
              prose-headings:font-bold prose-headings:text-gray-900
              prose-h2:text-2xl prose-h2:mt-10 prose-h2:mb-4
              prose-h3:text-xl prose-h3:mt-8 prose-h3:mb-3
              prose-p:text-gray-600 prose-p:leading-relaxed prose-p:mb-4
              prose-ul:text-gray-600 prose-ul:mb-4 prose-ul:space-y-2
              prose-li:leading-relaxed
              prose-strong:text-gray-800"
            style={{ fontFamily: 'var(--font-body)' }}
            dangerouslySetInnerHTML={{ __html: contentParts[0] }}
          />

          {/* ── Mid-Article CTA ── */}
          <div
            className="my-10 p-6 rounded-lg border-2"
            style={{
              borderColor: '#C9963B',
              backgroundColor: 'rgba(201, 150, 59, 0.05)',
            }}
          >
            <p
              className="text-lg font-semibold mb-3"
              style={{ color: '#1B2A4A' }}
            >
              您的情况可能更复杂，立即咨询法律代表宇霞
            </p>
            <p className="text-sm text-gray-600 mb-4">
              每个庇护案件都有独特的情况。文章提供一般性指导，但专业法律代表可以根据您的具体情况制定最佳策略。
            </p>
            <Link
              href={`/${locale}/consultation`}
              className="inline-block px-6 py-3 text-white font-semibold rounded-md transition-colors text-sm"
              style={{ backgroundColor: '#B8373D' }}
            >
              预约免费咨询
            </Link>
          </div>

          {/* Second part of content (~60%) */}
          {contentParts[1] && (
            <div
              className="prose prose-lg max-w-none
                prose-headings:font-bold prose-headings:text-gray-900
                prose-h2:text-2xl prose-h2:mt-10 prose-h2:mb-4
                prose-h3:text-xl prose-h3:mt-8 prose-h3:mb-3
                prose-p:text-gray-600 prose-p:leading-relaxed prose-p:mb-4
                prose-ul:text-gray-600 prose-ul:mb-4 prose-ul:space-y-2
                prose-li:leading-relaxed
                prose-strong:text-gray-800"
              style={{ fontFamily: 'var(--font-body)' }}
              dangerouslySetInnerHTML={{ __html: contentParts[1] }}
            />
          )}
        </div>
      </section>

      {/* ── Topic Cluster Navigator ── */}
      <section style={{ backgroundColor: '#F9FAFB' }} className="py-[60px]">
        <div className="max-w-[800px] mx-auto px-6">
          <div className="bg-white border border-gray-200 rounded-lg p-8">
            <h2
              className="text-xl font-bold mb-6"
              style={{ color: '#1B2A4A', fontFamily: 'var(--font-heading)' }}
            >
              相关主题
            </h2>
            <div className="space-y-3">
              <Link
                href={`/${locale}/articles/asylum-complete-guide`}
                className="flex items-center justify-between py-3 px-4 rounded-lg hover:bg-gray-50 transition-colors group"
              >
                <span className="text-gray-700 group-hover:text-[#1B2A4A] transition-colors">
                  美国政治庇护申请完整指南
                </span>
                <span style={{ color: '#C9963B' }}>→</span>
              </Link>
              <Link
                href={`/${locale}/articles/i-589-guide`}
                className="flex items-center justify-between py-3 px-4 rounded-lg hover:bg-gray-50 transition-colors group"
              >
                <span className="text-gray-700 group-hover:text-[#1B2A4A] transition-colors">
                  I-589申请表填写指南
                </span>
                <span style={{ color: '#C9963B' }}>→</span>
              </Link>
              <Link
                href={`/${locale}/articles/credible-fear-guide`}
                className="flex items-center justify-between py-3 px-4 rounded-lg hover:bg-gray-50 transition-colors group"
              >
                <span className="text-gray-700 group-hover:text-[#1B2A4A] transition-colors">
                  恐惧面谈完整说明
                </span>
                <span style={{ color: '#C9963B' }}>→</span>
              </Link>
              <Link
                href={`/${locale}/articles/evidence-preparation`}
                className="flex items-center justify-between py-3 px-4 rounded-lg hover:bg-gray-50 transition-colors group"
              >
                <span className="text-gray-700 group-hover:text-[#1B2A4A] transition-colors">
                  庇护证据如何准备
                </span>
                <span style={{ color: '#C9963B' }}>→</span>
              </Link>
              <Link
                href={`/${locale}/articles/asylum-green-card`}
                className="flex items-center justify-between py-3 px-4 rounded-lg hover:bg-gray-50 transition-colors group"
              >
                <span className="text-gray-700 group-hover:text-[#1B2A4A] transition-colors">
                  庇护一年后绿卡申请指南
                </span>
                <span style={{ color: '#C9963B' }}>→</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── Related Articles ── */}
      {relatedArticles.length > 0 && (
        <section className="bg-white py-[80px]">
          <div className="max-w-[1200px] mx-auto px-6">
            <SectionHeader
              label="延伸阅读"
              title="相关文章推荐"
              subtitle="继续了解更多庇护移民相关知识"
            />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-[960px] mx-auto">
              {relatedArticles.slice(0, 3).map((related) => (
                <Link
                  key={related.slug}
                  href={`/${locale}/articles/${related.slug}`}
                  className="group block border border-gray-200 rounded-lg overflow-hidden transition-all duration-200 hover:shadow-lg hover:-translate-y-1"
                >
                  {/* Gradient placeholder */}
                  <div
                    className="h-[160px] relative"
                    style={{
                      background:
                        'linear-gradient(135deg, #1B2A4A 0%, #2D4A7A 50%, #1B2A4A 100%)',
                    }}
                  >
                    <span
                      className="absolute top-3 left-3 inline-block px-2 py-0.5 text-[11px] font-semibold rounded-full text-white"
                      style={{
                        backgroundColor: 'rgba(201, 150, 59, 0.9)',
                      }}
                    >
                      {related.categoryLabel}
                    </span>
                  </div>
                  <div className="p-5">
                    <h3 className="text-base font-semibold text-gray-900 mb-2 group-hover:text-[#1B2A4A] transition-colors">
                      {related.title}
                    </h3>
                    <p className="text-sm text-gray-500 line-clamp-2 mb-3">
                      {related.excerpt}
                    </p>
                    <span
                      className="text-sm font-semibold"
                      style={{ color: '#C9963B' }}
                    >
                      阅读全文 →
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── End CTA ── */}
      <section
        className="py-[80px]"
        style={{
          background: 'linear-gradient(135deg, #1B2A4A 0%, #0F1A32 100%)',
        }}
      >
        <div className="max-w-[1200px] mx-auto px-6">
          <SectionHeader
            light
            title="需要专业帮助？预约免费咨询"
            subtitle="让经验丰富的庇护法律代表为您评估案件，制定最佳法律策略。初次咨询完全免费，无任何义务。"
          />
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href={`/${locale}/consultation`}
              className="inline-block px-[36px] py-[16px] text-white font-semibold rounded-md transition-colors"
              style={{ backgroundColor: '#B8373D' }}
            >
              预约免费咨询
            </Link>
            <Link
              href="mailto:yuxiaris@gmail.com"
              className="inline-block px-[36px] py-[16px] font-semibold rounded-md border border-white text-white bg-transparent transition-colors"
            >
              发送邮件至 yuxiaris@gmail.com
            </Link>
          </div>
        </div>
      </section>

      {/* ── Legal Disclaimer ── */}
      <section className="bg-gray-50 py-8">
        <div className="max-w-[800px] mx-auto px-6">
          <p className="text-xs text-gray-400 leading-relaxed">
            本文仅供一般信息参考，不构成法律建议，也不建立律师与客户关系。每个案件的情况不同，法律结果可能因具体事实和情况而异。如果您需要针对您个人情况的法律建议，请咨询有资质的移民律师。本文中的信息基于撰写时的法律，相关法律法规可能已发生变化。宇霞移民服务中心不对因依赖本文信息而采取或未采取的任何行动承担责任。
          </p>
        </div>
      </section>
    </main>
  );
}
