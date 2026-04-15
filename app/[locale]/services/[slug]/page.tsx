import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { isValidLocale, defaultLocale } from '@/lib/i18n';
import SectionHeader from '@/components/shared/SectionHeader';
import FaqAccordion from '@/components/shared/FaqAccordion';
import {
  ALL_SERVICES,
  getServiceBySlug,
  getRelatedServices,
} from '@/lib/services-data';

/* eslint-disable @typescript-eslint/no-explicit-any */

export async function generateStaticParams() {
  return ALL_SERVICES.map((svc) => ({ slug: svc.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: { locale: string; slug: string };
}): Promise<Metadata> {
  const service = getServiceBySlug(params.slug);
  if (!service) {
    return { title: '服务未找到' };
  }
  return {
    title: service.seo.title,
    description: service.seo.description,
  };
}

export default async function ServiceDetailPage({
  params,
}: {
  params: { locale: string; slug: string };
}) {
  const locale = isValidLocale(params.locale) ? params.locale : defaultLocale;
  const service = getServiceBySlug(params.slug);

  if (!service) {
    notFound();
  }

  const relatedServices = getRelatedServices(service.relatedSlugs);

  return (
    <main>
      {/* ── Section 1: Compact Hero ── */}
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
              <li>
                <Link
                  href={`/${locale}/services`}
                  className="hover:text-white transition-colors"
                >
                  服务项目
                </Link>
              </li>
              <li>
                <span className="mx-1">&gt;</span>
              </li>
              <li className="text-white/90">{service.title}</li>
            </ol>
          </nav>

          <div className="flex items-center gap-4 mb-4">
            <span className="text-4xl">{service.icon}</span>
            <h1
              className="text-[2.25rem] md:text-[2.75rem] font-bold text-white leading-tight"
              style={{ fontFamily: 'var(--font-heading)' }}
            >
              {service.seo.h1}
            </h1>
          </div>
          <p className="text-lg text-white/80 max-w-[650px] leading-relaxed mb-8">
            {service.description}
          </p>
          <div className="flex flex-wrap gap-4">
            <Link
              href="/consultation"
              className="inline-block px-[32px] py-[14px] text-white font-semibold rounded-md transition-colors"
              style={{ backgroundColor: '#B8373D' }}
            >
              预约免费咨询
            </Link>
            <Link
              href="tel:+12135550188"
              className="inline-block px-[32px] py-[14px] font-semibold rounded-md border border-white text-white bg-transparent transition-colors"
            >
              致电 (213) 555-0188
            </Link>
          </div>
        </div>
      </section>

      {/* ── Section 2: What Is This ── */}
      <section className="bg-white py-[80px]">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="max-w-[800px]">
            <span
              className="inline-block text-xs font-semibold uppercase tracking-[0.1em] mb-3"
              style={{ color: '#C9963B' }}
            >
              服务介绍
            </span>
            <h2
              className="text-2xl md:text-3xl font-bold text-gray-900 mb-6"
              style={{ fontFamily: 'var(--font-heading)' }}
            >
              {service.whatIs.title}
            </h2>
            <p className="text-gray-600 leading-relaxed mb-8 text-[17px]">
              {service.whatIs.content}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {service.whatIs.keyPoints.map((point, i) => (
                <div
                  key={i}
                  className="flex items-start gap-3 p-4 rounded-lg"
                  style={{ backgroundColor: '#F9FAFB' }}
                >
                  <span className="text-xl flex-shrink-0 mt-0.5">
                    {point.icon}
                  </span>
                  <p className="text-sm text-gray-700 leading-relaxed">
                    {point.text}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Section 3: Who Needs This ── */}
      <section className="py-[80px]" style={{ backgroundColor: '#F9FAFB' }}>
        <div className="max-w-[1200px] mx-auto px-6">
          <SectionHeader
            label="适用对象"
            title="谁需要这项服务？"
            subtitle="以下情况的人士可能需要我们的帮助"
          />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-[960px] mx-auto">
            {service.whoNeeds.scenarios.map((scenario, i) => (
              <div
                key={i}
                className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
              >
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm mb-4"
                  style={{ backgroundColor: '#1B2A4A' }}
                >
                  {i + 1}
                </div>
                <h3 className="text-base font-semibold text-gray-900 mb-2">
                  {scenario.title}
                </h3>
                <p className="text-sm text-gray-500 leading-relaxed">
                  {scenario.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Section 4: Process Steps (Vertical Timeline) ── */}
      <section className="bg-white py-[80px]">
        <div className="max-w-[1200px] mx-auto px-6">
          <SectionHeader
            label="服务流程"
            title="申请流程"
            subtitle="我们将全程指导您完成每一个步骤"
          />
          <div className="max-w-[700px] mx-auto relative">
            {/* Vertical connector line */}
            <div
              className="absolute left-6 top-6 bottom-6 w-0.5"
              style={{ backgroundColor: '#E5E7EB' }}
            />
            <div className="flex flex-col gap-8">
              {service.processSteps.map((step) => (
                <div key={step.step} className="flex gap-6 relative">
                  <div
                    className="w-12 h-12 rounded-full flex-shrink-0 flex items-center justify-center text-white font-bold z-10"
                    style={{ backgroundColor: '#1B2A4A' }}
                  >
                    {step.step}
                  </div>
                  <div className="pt-2">
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">
                      {step.title}
                    </h3>
                    <p className="text-sm text-gray-500 leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Section 5: Requirements (3-column) ── */}
      <section className="py-[80px]" style={{ backgroundColor: '#F9FAFB' }}>
        <div className="max-w-[1200px] mx-auto px-6">
          <SectionHeader
            label="申请要求"
            title="所需条件与材料"
            subtitle="确保您准备好以下内容以顺利推进申请"
          />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {service.requirements.map((req, i) => (
              <div
                key={i}
                className="bg-white border border-gray-200 rounded-lg p-6"
              >
                <h3
                  className="text-base font-semibold mb-4 pb-3 border-b border-gray-100"
                  style={{ color: '#1B2A4A' }}
                >
                  {req.category}
                </h3>
                <ul className="space-y-3">
                  {req.items.map((item, j) => (
                    <li
                      key={j}
                      className="flex items-start gap-2 text-sm text-gray-600"
                    >
                      <span
                        className="mt-1 flex-shrink-0 text-xs"
                        style={{ color: '#C9963B' }}
                      >
                        ✓
                      </span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Section 6: Common Mistakes ── */}
      <section className="bg-white py-[80px]">
        <div className="max-w-[1200px] mx-auto px-6">
          <SectionHeader
            label="注意事项"
            title="常见错误与正确做法"
            subtitle="避免这些常见错误，提高申请成功率"
          />
          <div className="max-w-[800px] mx-auto space-y-4">
            {service.commonMistakes.map((item, i) => (
              <div
                key={i}
                className="border border-gray-200 rounded-lg overflow-hidden"
              >
                {/* Mistake (red tint) */}
                <div
                  className="px-6 py-4 flex items-start gap-3"
                  style={{ backgroundColor: 'rgba(184, 55, 61, 0.05)' }}
                >
                  <span className="text-lg flex-shrink-0 mt-0.5">✗</span>
                  <div>
                    <span
                      className="text-xs font-semibold uppercase tracking-wider"
                      style={{ color: '#B8373D' }}
                    >
                      常见错误
                    </span>
                    <p className="text-sm text-gray-800 mt-1">
                      {item.mistake}
                    </p>
                  </div>
                </div>
                {/* Correction (green tint) */}
                <div
                  className="px-6 py-4 flex items-start gap-3"
                  style={{ backgroundColor: 'rgba(34, 139, 34, 0.05)' }}
                >
                  <span className="text-lg flex-shrink-0 mt-0.5">✓</span>
                  <div>
                    <span
                      className="text-xs font-semibold uppercase tracking-wider"
                      style={{ color: '#228B22' }}
                    >
                      正确做法
                    </span>
                    <p className="text-sm text-gray-800 mt-1">
                      {item.correction}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Section 7: How We Help ── */}
      <section className="py-[80px]" style={{ backgroundColor: '#F9FAFB' }}>
        <div className="max-w-[1200px] mx-auto px-6">
          <SectionHeader
            label="我们的优势"
            title="我们如何帮助您"
          />
          <div className="max-w-[800px] mx-auto">
            <p className="text-gray-600 leading-relaxed mb-8 text-[17px]">
              {service.howWeHelp.content}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {service.howWeHelp.points.map((point, i) => (
                <div
                  key={i}
                  className="flex items-start gap-3 bg-white border border-gray-200 rounded-lg px-5 py-4"
                >
                  <span
                    className="flex-shrink-0 mt-0.5 font-bold"
                    style={{ color: '#C9963B' }}
                  >
                    ✓
                  </span>
                  <p className="text-sm text-gray-700">{point}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Section 8: Testimonial ── */}
      <section
        className="py-[60px]"
        style={{ backgroundColor: '#0F1A32' }}
      >
        <div className="max-w-[800px] mx-auto px-6 text-center">
          <div className="text-lg mb-4" style={{ color: '#C9963B' }}>
            ★★★★★
          </div>
          <p className="text-lg md:text-xl text-gray-300 italic leading-relaxed mb-6 relative">
            <span
              className="text-3xl absolute -top-4 -left-2"
              style={{ color: '#C9963B' }}
            >
              &ldquo;
            </span>
            <span className="ml-6">{service.testimonial.quote}</span>
            <span
              className="text-3xl ml-1"
              style={{ color: '#C9963B' }}
            >
              &rdquo;
            </span>
          </p>
          <div>
            <span className="text-white font-bold">
              {service.testimonial.name}
            </span>
            <span className="text-gray-400 text-sm ml-2">
              {service.testimonial.caseType}
            </span>
          </div>
        </div>
      </section>

      {/* ── Section 9: FAQ Accordion ── */}
      <section className="bg-white py-[80px]">
        <div className="max-w-[1200px] mx-auto px-6">
          <SectionHeader
            label="常见问题"
            title={`关于${service.title}的常见问题`}
          />
          <FaqAccordion questions={service.faq} />
        </div>
      </section>

      {/* ── Section 10: Related Services ── */}
      {relatedServices.length > 0 && (
        <section
          className="py-[80px]"
          style={{ backgroundColor: '#F9FAFB' }}
        >
          <div className="max-w-[1200px] mx-auto px-6">
            <SectionHeader
              label="相关服务"
              title="您可能还需要"
              subtitle="根据您的情况，以下服务可能对您有帮助"
            />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-[960px] mx-auto">
              {relatedServices.slice(0, 3).map((related) => (
                <Link
                  key={related.slug}
                  href={`/${locale}/services/${related.slug}`}
                  className="group block bg-white border border-gray-200 rounded-lg text-center px-6 py-8 transition-all duration-200 hover:shadow-lg hover:-translate-y-1"
                >
                  <div
                    className="w-14 h-14 rounded-lg mx-auto mb-5 flex items-center justify-center text-2xl"
                    style={{
                      background:
                        'linear-gradient(135deg, #1B2A4A, #0F1A32)',
                      color: '#C9963B',
                    }}
                  >
                    {related.icon}
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {related.title}
                  </h3>
                  <p className="text-sm text-gray-500 mb-3 leading-relaxed line-clamp-2">
                    {related.description}
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

      {/* ── Section 11: CTA ── */}
      <section
        className="py-[80px]"
        style={{
          background: 'linear-gradient(135deg, #1B2A4A 0%, #0F1A32 100%)',
        }}
      >
        <div className="max-w-[1200px] mx-auto px-6">
          <SectionHeader
            light
            title={`准备好开始您的${service.title}申请了吗？`}
            subtitle="预约免费咨询，让我们的律师为您制定专属的法律方案"
          />
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            <Link
              href="/consultation"
              className="inline-block px-[36px] py-[16px] text-white font-semibold rounded-md transition-colors"
              style={{ backgroundColor: '#B8373D' }}
            >
              预约免费咨询
            </Link>
            <Link
              href="tel:+12135550188"
              className="inline-block px-[36px] py-[16px] font-semibold rounded-md border border-white text-white bg-transparent transition-colors"
            >
              致电 (213) 555-0188
            </Link>
          </div>
          <div className="max-w-[600px] mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Phone */}
            <div className="flex items-center gap-4">
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center text-xl flex-shrink-0"
                style={{ backgroundColor: '#C9963B' }}
              >
                📞
              </div>
              <div>
                <div className="text-white font-medium">电话咨询</div>
                <div className="text-white/70 text-sm">(213) 555-0188</div>
              </div>
            </div>
            {/* WeChat */}
            <div className="flex items-center gap-4">
              <div className="w-[120px] h-[120px] bg-white rounded-lg flex items-center justify-center flex-shrink-0">
                <span className="text-gray-400 text-xs">二维码</span>
              </div>
              <div>
                <div className="text-white font-medium">微信咨询</div>
                <div className="text-white/70 text-sm">AsylumAttorneyLA</div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
