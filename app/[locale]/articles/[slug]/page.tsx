import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { isValidLocale, defaultLocale, type Locale } from '@/lib/i18n';
import SectionHeader from '@/components/shared/SectionHeader';
import {
  getArticleDisplayDate,
  loadPublicArticle,
  loadPublicArticles,
} from '@/lib/articles';
import { getRequestSiteId } from '@/lib/content';

function normalizeArticleMarkdown(markdown: string): string {
  const withoutLeadingTitle = markdown.replace(/^#\s+.+\n+/, '');
  const demotedHeadings = withoutLeadingTitle.replace(
    /^(#{1,6})\s+/gm,
    (_match, hashes: string) => `${'#'.repeat(Math.min(hashes.length + 1, 6))} `
  );
  return demotedHeadings.replace(/\n{3,}/g, '\n\n');
}

export async function generateStaticParams() {
  const siteId = await getRequestSiteId();
  const [zhArticles, enArticles] = await Promise.all([
    loadPublicArticles('zh', siteId),
    loadPublicArticles('en', siteId),
  ]);
  const slugs = Array.from(
    new Set([...zhArticles, ...enArticles].map((article) => article.slug))
  );
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: { locale: string; slug: string };
}): Promise<Metadata> {
  const locale = (isValidLocale(params.locale) ? params.locale : defaultLocale) as Locale;
  const article = await loadPublicArticle(locale, params.slug);
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
  const locale = (isValidLocale(params.locale) ? params.locale : defaultLocale) as Locale;
  const article = await loadPublicArticle(locale, params.slug);

  if (!article) {
    notFound();
  }

  const allArticles = await loadPublicArticles(locale);
  const relatedBySlug = article.relatedSlugs
    .map((slug) => allArticles.find((entry) => entry.slug === slug))
    .filter((entry): entry is NonNullable<typeof entry> => Boolean(entry));
  const fallbackRelated = allArticles.filter(
    (entry) =>
      entry.slug !== article.slug &&
      entry.category &&
      entry.category === article.category &&
      !relatedBySlug.some((related) => related.slug === entry.slug)
  );
  const relatedArticles = [...relatedBySlug, ...fallbackRelated].slice(0, 5);
  const articleCategoryLabel = article.category || '法律知识';
  const markdownBody = normalizeArticleMarkdown(article.contentMarkdown);

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
                {article.category ? (
                  <Link
                    href={`/${locale}/articles?category=${encodeURIComponent(article.category)}`}
                    className="hover:text-white transition-colors"
                  >
                    {articleCategoryLabel}
                  </Link>
                ) : (
                  <span className="text-white/70">{articleCategoryLabel}</span>
                )}
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
              {articleCategoryLabel}
            </span>
            <span className="text-sm text-white/60">
              {getArticleDisplayDate(article) || '-'}
            </span>
            <span className="text-sm text-white/60">
              阅读时间 {article.readTime || '5 分钟'}
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
          {article.image && (
            <div
              className="mb-8 h-[300px] w-full overflow-hidden rounded-lg border border-gray-200"
              style={{
                backgroundImage: `url("${article.image}")`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }}
            />
          )}
          {article.contentMarkdown ? (
            <div
              className="prose prose-lg max-w-none
                prose-headings:font-bold prose-headings:text-gray-900
                prose-h2:text-2xl prose-h2:mt-10 prose-h2:mb-4
                prose-h3:text-xl prose-h3:mt-8 prose-h3:mb-3
                prose-p:text-gray-600 prose-p:leading-relaxed prose-p:mb-4
                prose-ul:text-gray-600 prose-ul:mb-4 prose-ul:space-y-2
                prose-li:leading-relaxed
                prose-strong:text-gray-800"
            >
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                  h1: (props) => (
                    <h2
                      className="mt-10 mb-4 text-2xl font-bold text-gray-900"
                      {...props}
                    />
                  ),
                  h2: (props) => (
                    <h3
                      className="mt-8 mb-3 text-xl font-semibold text-gray-900"
                      {...props}
                    />
                  ),
                  h3: (props) => (
                    <h4
                      className="mt-6 mb-2 text-lg font-semibold text-gray-900"
                      {...props}
                    />
                  ),
                  p: (props) => (
                    <p className="mb-4 leading-8 text-gray-700" {...props} />
                  ),
                  ul: (props) => (
                    <ul className="mb-4 list-disc pl-6 text-gray-700" {...props} />
                  ),
                  ol: (props) => (
                    <ol className="mb-4 list-decimal pl-6 text-gray-700" {...props} />
                  ),
                  li: (props) => <li className="mb-1.5 leading-7" {...props} />,
                  hr: (props) => (
                    <hr className="my-7 border-gray-200" {...props} />
                  ),
                  blockquote: (props) => (
                    <blockquote
                      className="my-5 border-l-4 border-amber-400 bg-amber-50 px-4 py-3 text-gray-700"
                      {...props}
                    />
                  ),
                  strong: (props) => (
                    <strong className="font-semibold text-gray-900" {...props} />
                  ),
                }}
              >
                {markdownBody}
              </ReactMarkdown>
            </div>
          ) : article.content ? (
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
              dangerouslySetInnerHTML={{ __html: article.content }}
            />
          ) : (
            <div className="rounded-md border border-gray-200 bg-gray-50 px-4 py-5 text-sm text-gray-500">
              暂无正文内容。
            </div>
          )}

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
                  {/* Related cover */}
                  <div
                    className="h-[160px] relative"
                    style={{
                      background: related.image
                        ? undefined
                        : 'linear-gradient(135deg, #1B2A4A 0%, #2D4A7A 50%, #1B2A4A 100%)',
                      backgroundImage: related.image
                        ? `linear-gradient(rgba(10, 18, 36, 0.2), rgba(10, 18, 36, 0.2)), url("${related.image}")`
                        : undefined,
                      backgroundSize: related.image ? 'cover' : undefined,
                      backgroundPosition: related.image ? 'center' : undefined,
                    }}
                  >
                    <span
                      className="absolute top-3 left-3 inline-block px-2 py-0.5 text-[11px] font-semibold rounded-full text-white"
                      style={{
                        backgroundColor: 'rgba(201, 150, 59, 0.9)',
                      }}
                    >
                      {related.category || '法律知识'}
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
