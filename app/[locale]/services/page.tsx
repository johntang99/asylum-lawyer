import { Metadata } from 'next';
import Link from 'next/link';
import { loadPageContent } from '@/lib/content';
import { isValidLocale, defaultLocale, type Locale } from '@/lib/i18n';
import SectionHeader from '@/components/shared/SectionHeader';
import {
  categoryHref,
  getServiceCategories,
  getServices,
  serviceHref,
} from '@/lib/services';

/* eslint-disable @typescript-eslint/no-explicit-any */

export async function generateMetadata({
  params,
}: {
  params: { locale: string };
}): Promise<Metadata> {
  const locale = isValidLocale(params.locale) ? params.locale : defaultLocale;
  const content = await loadPageContent<any>('services', locale as Locale);
  const seo = content?.seo;
  return {
    title: seo?.title ?? '庇护移民服务项目 | 洛杉矶中文庇护律师',
    description:
      seo?.description ??
      '宇霞移民服务中心提供全面的庇护移民法律服务，包括政治庇护、恐惧面谈、I-589申请等13项专业服务。',
  };
}

const PROCESS_STEPS = [
  {
    step: 1,
    title: '免费咨询评估',
    description:
      '与律师进行详细的案件评估，了解您的情况，确定最佳的法律策略和服务方案。',
    icon: '📞',
  },
  {
    step: 2,
    title: '制定专属方案',
    description:
      '根据您的具体情况制定个性化的法律方案，明确时间线、所需材料和预期结果。',
    icon: '📋',
  },
  {
    step: 3,
    title: '专业执行',
    description:
      '律师团队全程处理您的案件，包括文件准备、证据收集、面谈模拟和法庭代理。',
    icon: '⚖',
  },
  {
    step: 4,
    title: '持续跟进',
    description:
      '案件提交后持续跟进进展，及时处理补充要求，直至获得最终结果。',
    icon: '✅',
  },
];

export default async function ServicesPage({
  params,
}: {
  params: { locale: string };
}) {
  const locale = isValidLocale(params.locale) ? params.locale : defaultLocale;
  const [content, categories, services] = await Promise.all([
    loadPageContent<any>('services', locale as Locale),
    getServiceCategories(locale as Locale),
    getServices(locale as Locale),
  ]);

  // Sites that define category hubs get a two-tier layout; sites without them
  // keep the original primary/additional split.
  const useCategories = categories.length > 0;
  const primaryServices = services.filter((svc) => svc.category === 'primary');
  const additionalServices = services.filter((svc) => svc.category === 'additional');

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
              <li className="text-white/90">服务项目</li>
            </ol>
          </nav>
          <h1
            className="text-[2.5rem] md:text-[3rem] font-bold text-white mb-3 leading-tight"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            {content?.hero?.headline ?? '我们的庇护移民服务'}
          </h1>
          <p className="text-lg text-white/80 max-w-[600px] leading-relaxed">
            {content?.hero?.subheadline ??
              '从初次咨询到身份获批，我们为您提供全方位的庇护移民法律服务'}
          </p>
        </div>
      </section>

      {/* ── Category Hubs (sites with a categorised service taxonomy) ── */}
      {useCategories && (
        <section className="bg-white py-[80px]">
          <div className="max-w-[1200px] mx-auto px-6">
            <SectionHeader
              label={content?.sections?.primaryLabel ?? '服务领域'}
              title={content?.sections?.primaryTitle ?? '我们处理的纠纷类型'}
              subtitle={
                content?.sections?.primarySubtitle ??
                '选择您遇到的问题类别，查看我们能提供的具体帮助'
              }
            />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {categories.map((category) => (
                <Link
                  key={category.slug}
                  href={categoryHref(locale, category)}
                  className="group block bg-white border border-gray-200 rounded-lg px-6 py-8 transition-all duration-200 hover:shadow-lg hover:-translate-y-1"
                >
                  <div
                    className="w-14 h-14 rounded-lg mb-5 flex items-center justify-center text-2xl"
                    style={{
                      background: 'linear-gradient(135deg, var(--primary), var(--primary-dark))',
                      color: 'var(--secondary)',
                    }}
                  >
                    {category.icon}
                  </div>
                  <h3 className="text-[1.25rem] font-semibold text-gray-900 mb-2">
                    {category.title}
                  </h3>
                  <p className="text-sm text-gray-500 mb-4 leading-relaxed line-clamp-3">
                    {category.description}
                  </p>
                  {category.items.length > 0 && (
                    <ul className="text-sm text-gray-600 space-y-1 mb-4">
                      {category.items.slice(0, 4).map((item, i) => (
                        <li key={i} className="flex gap-2">
                          <span style={{ color: 'var(--secondary)' }}>·</span>
                          <span className="line-clamp-1">{item.title}</span>
                        </li>
                      ))}
                      {category.items.length > 4 && (
                        <li className="text-gray-400">
                          等 {category.items.length} 项
                        </li>
                      )}
                    </ul>
                  )}
                  <span
                    className="text-sm font-semibold"
                    style={{ color: 'var(--secondary)' }}
                  >
                    了解详情 →
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── Primary Services (核心服务) ── */}
      {!useCategories && (
      <section className="bg-white py-[80px]">
        <div className="max-w-[1200px] mx-auto px-6">
          <SectionHeader
            label={content?.sections?.primaryLabel ?? '核心服务'}
            title="为您提供专业的庇护法律服务"
            subtitle="涵盖庇护申请的每一个关键环节"
          />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {primaryServices.map((svc) => (
              <Link
                key={svc.slug}
                href={serviceHref(locale, svc)}
                className="group block bg-white border border-gray-200 rounded-lg text-center px-6 py-8 transition-all duration-200 hover:shadow-lg hover:-translate-y-1"
              >
                <div
                  className="w-14 h-14 rounded-lg mx-auto mb-5 flex items-center justify-center text-2xl"
                  style={{
                    background: 'linear-gradient(135deg, #1B2A4A, #0F1A32)',
                    color: '#C9963B',
                  }}
                >
                  {svc.icon}
                </div>
                <h3 className="text-[1.25rem] font-semibold text-gray-900 mb-2">
                  {svc.title}
                </h3>
                <p className="text-sm text-gray-500 mb-4 leading-relaxed line-clamp-3">
                  {svc.description}
                </p>
                <span
                  className="text-sm font-semibold"
                  style={{ color: '#C9963B' }}
                >
                  了解详情 →
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>
      )}

      {/* ── Divider: 其他相关服务 ── */}
      {!useCategories && (
      <section className="py-[80px]" style={{ backgroundColor: '#F9FAFB' }}>
        <div className="max-w-[1200px] mx-auto px-6">
          <SectionHeader
            label={content?.sections?.additionalLabel ?? '其他相关服务'}
            title="更多移民法律服务"
            subtitle="除核心庇护服务外，我们还提供以下相关法律服务"
          />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {additionalServices.map((svc) => (
              <Link
                key={svc.slug}
                href={serviceHref(locale, svc)}
                className="group block bg-gray-50 border border-gray-100 rounded-lg text-center px-6 py-8 transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 hover:bg-white"
              >
                <div
                  className="w-12 h-12 rounded-lg mx-auto mb-4 flex items-center justify-center text-xl"
                  style={{
                    backgroundColor: 'rgba(27, 42, 74, 0.08)',
                    color: '#1B2A4A',
                  }}
                >
                  {svc.icon}
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {svc.title}
                </h3>
                <p className="text-sm text-gray-500 mb-3 leading-relaxed line-clamp-2">
                  {svc.description}
                </p>
                <span
                  className="text-sm font-semibold"
                  style={{ color: '#C9963B' }}
                >
                  了解详情 →
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>
      )}

      {/* ── How We Help: 4-step process ── */}
      <section className="bg-white py-[80px]">
        <div className="max-w-[1200px] mx-auto px-6">
          <SectionHeader
            label="服务流程"
            title={content?.sections?.processTitle ?? '我们如何帮助您'}
            subtitle={
              content?.sections?.processSubtitle ??
              '从初次咨询到案件成功，四步为您保驾护航'
            }
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {(content?.process ?? PROCESS_STEPS).map(
              (step: any, i: number) => (
                <div
                  key={i}
                  className="relative bg-white border border-gray-200 rounded-lg p-6 text-center"
                >
                  {/* Step number */}
                  <div
                    className="w-10 h-10 rounded-full mx-auto mb-4 flex items-center justify-center text-white font-bold text-sm"
                    style={{ backgroundColor: '#1B2A4A' }}
                  >
                    {step.step}
                  </div>
                  <h3 className="text-base font-semibold text-gray-900 mb-2">
                    {step.title}
                  </h3>
                  <p className="text-sm text-gray-500 leading-relaxed">
                    {step.description}
                  </p>
                  {/* Arrow connector (hidden on last item and mobile) */}
                  {i < 3 && (
                    <div className="hidden lg:block absolute top-1/2 -right-3 transform -translate-y-1/2 text-gray-300 text-xl">
                      →
                    </div>
                  )}
                </div>
              )
            )}
          </div>
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
            title={content?.cta?.headline ?? '不确定需要哪项服务？'}
            subtitle={
              content?.cta?.subheadline ??
              '每个案件都是独特的。预约免费咨询，让我们的律师为您评估情况并推荐最适合的服务方案。'
            }
          />
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href={content?.cta?.primary?.href ?? '/consultation'}
              className="inline-block px-[36px] py-[16px] text-white font-semibold rounded-md transition-colors"
              style={{ backgroundColor: '#B8373D' }}
            >
              {content?.cta?.primary?.label ?? '预约免费咨询'}
            </Link>
            <Link
              href={content?.cta?.secondary?.href ?? 'mailto:yuxiaris@gmail.com'}
              className="inline-block px-[36px] py-[16px] font-semibold rounded-md border border-white text-white bg-transparent transition-colors"
            >
              {content?.cta?.secondary?.label ?? '发送邮件咨询'}
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
