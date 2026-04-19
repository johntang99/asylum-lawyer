import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { loadPageContent } from '@/lib/content';
import { isValidLocale, defaultLocale, type Locale } from '@/lib/i18n';
import SectionHeader from '@/components/shared/SectionHeader';
import FaqAccordion from '@/components/shared/FaqAccordion';
import HeroSection from '@/components/sections/HeroSection';

/* eslint-disable @typescript-eslint/no-explicit-any */

const ICON_MAP: Record<string, string> = {
  shield: '🛡',
  'file-text': '📋',
  gavel: '⚖',
  'message-circle': '🎤',
  clipboard: '📄',
  refresh: '🔄',
};

const WHY_US_ICONS = ['🗣', '🎯', '📊', '✅', '💬'];

export async function generateMetadata({
  params,
}: {
  params: { locale: string };
}): Promise<Metadata> {
  const locale = isValidLocale(params.locale) ? params.locale : defaultLocale;
  const content = await loadPageContent<any>('home', locale as Locale);
  const seo = content?.seo;
  return {
    title: seo?.title ?? '洛杉矶中文庇护移民律师',
    description: seo?.description ?? '',
  };
}

export default async function HomePage({
  params,
}: {
  params: { locale: string };
}) {
  const locale = isValidLocale(params.locale) ? params.locale : defaultLocale;
  const content = await loadPageContent<any>('home', locale as Locale);
  const sections = content?.sections ?? [];

  const hero = sections.find((s: any) => s.type === 'hero');
  const serviceOverview = sections.find((s: any) => s.type === 'serviceOverview');
  const whyUs = sections.find((s: any) => s.type === 'whyUs');
  const processTimeline = sections.find((s: any) => s.type === 'processTimeline');
  const attorneyBrief = sections.find((s: any) => s.type === 'attorneyBrief');
  const faqPreview = sections.find((s: any) => s.type === 'faqPreview');
  const contactCta = sections.find((s: any) => s.type === 'contactCta');

  return (
    <main>
      {/* ── Section 1: Hero ── */}
      <HeroSection
        variant={hero?.variant || 'stats-bar'}
        headline={hero?.headline ?? '洛杉矶中文庇护移民律师'}
        subheadline={hero?.subheadline}
        image={hero?.image}
        backgroundImage={hero?.backgroundImage}
        video={hero?.video}
        cta={hero?.cta}
        stats={hero?.stats}
      />

      {/* ── Section 2: Service Overview ── */}
      <section className="bg-white py-[80px]">
        <div className="max-w-[1200px] mx-auto px-6">
          <SectionHeader
            label="服务项目"
            title={serviceOverview?.headline ?? '我们的庇护法律服务'}
            subtitle={serviceOverview?.subheadline}
          />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {serviceOverview?.services?.map((svc: any, i: number) => (
              <div
                key={i}
                className="bg-white border border-gray-200 rounded-lg text-center px-6 py-8 transition-all duration-200 hover:shadow-lg hover:-translate-y-1"
              >
                <div
                  className="w-14 h-14 rounded-lg mx-auto mb-5 flex items-center justify-center text-2xl"
                  style={{
                    background: 'linear-gradient(135deg, #1B2A4A, #0F1A32)',
                    color: '#C9963B',
                  }}
                >
                  {ICON_MAP[svc.icon] ?? '📌'}
                </div>
                <h3 className="text-[1.25rem] font-semibold text-gray-900 mb-2">{svc.title}</h3>
                <p className="text-sm text-gray-500 mb-4 leading-relaxed">{svc.description}</p>
                <Link
                  href={svc.href}
                  className="text-sm font-semibold"
                  style={{ color: '#C9963B' }}
                >
                  了解详情 →
                </Link>
              </div>
            ))}
          </div>
          <div className="text-center mt-10">
            <Link
              href="/services"
              className="inline-block px-8 py-3 border-2 rounded-md font-semibold text-sm transition-colors"
              style={{ borderColor: '#1B2A4A', color: '#1B2A4A' }}
            >
              查看全部服务 →
            </Link>
          </div>
        </div>
      </section>

      {/* ── Section 3: Why Choose Us ── */}
      <section className="py-[80px]" style={{ backgroundColor: '#F9FAFB' }}>
        <div className="max-w-[1200px] mx-auto px-6">
          <SectionHeader
            label="为什么选择我们"
            title={whyUs?.headline ?? '为什么选择正道移民服务中心'}
            subtitle={whyUs?.subheadline}
          />
          <div className="flex flex-wrap justify-center gap-6">
            {whyUs?.pillars?.map((pillar: any, i: number) => (
              <div key={i} className="text-center px-4 py-6 w-full sm:w-[calc(50%-12px)] md:w-[calc(33.333%-16px)] max-w-[300px]">
                <div
                  className="w-14 h-14 rounded-full mx-auto mb-4 flex items-center justify-center text-2xl"
                  style={{ backgroundColor: 'rgba(201, 150, 59, 0.1)', color: '#C9963B' }}
                >
                  {WHY_US_ICONS[i] ?? '✨'}
                </div>
                <h3 className="text-base font-semibold text-gray-900 mb-2">{pillar.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{pillar.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Section 4: Process Timeline ── */}
      <section className="bg-white py-[80px]">
        <div className="max-w-[1200px] mx-auto px-6">
          <SectionHeader
            label="流程说明"
            title={processTimeline?.headline ?? '庇护申请流程'}
            subtitle={processTimeline?.subheadline}
          />
          <div className="max-w-[700px] mx-auto relative">
            {/* Vertical connector line */}
            <div
              className="absolute left-6 top-6 bottom-6 w-0.5"
              style={{ backgroundColor: '#E5E7EB' }}
            />
            <div className="flex flex-col gap-8">
              {processTimeline?.steps?.map((step: any) => (
                <div key={step.step} className="flex gap-6 relative">
                  <div
                    className="w-12 h-12 rounded-full flex-shrink-0 flex items-center justify-center text-white font-bold z-10"
                    style={{ backgroundColor: '#1B2A4A' }}
                  >
                    {step.step}
                  </div>
                  <div className="pt-2">
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">{step.title}</h3>
                    <p className="text-sm text-gray-500 leading-relaxed">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Section 5: Attorney Brief ── */}
      <section className="py-[80px]" style={{ backgroundColor: '#F9FAFB' }}>
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="flex flex-col lg:flex-row gap-12 items-center">
            {/* Photo */}
            <div
              className="w-full lg:w-[320px] h-[400px] rounded-lg flex-shrink-0 flex items-center justify-center overflow-hidden"
              style={attorneyBrief?.photo ? undefined : { background: 'linear-gradient(135deg, #1B2A4A, #0F1A32)' }}
            >
              {attorneyBrief?.photo ? (
                <img
                  src={attorneyBrief.photo}
                  alt={attorneyBrief?.headline ?? attorneyBrief?.name ?? ''}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-white/30 text-sm">律师照片</span>
              )}
            </div>
            {/* Content */}
            <div className="flex-1">
              <span
                className="inline-block text-xs font-semibold uppercase tracking-[0.1em] mb-3"
                style={{ color: '#C9963B' }}
              >
                {attorneyBrief?.sectionLabel ?? '关于我们'}
              </span>
              <h2
                className="text-2xl font-bold text-gray-900 mb-2"
                style={{ fontFamily: 'var(--font-heading)' }}
              >
                {attorneyBrief?.headline ?? attorneyBrief?.name ?? ''}
              </h2>
              <p className="font-semibold mb-4" style={{ color: '#C9963B' }}>
                {attorneyBrief?.title}
              </p>
              <p className="text-gray-600 leading-relaxed mb-4">{attorneyBrief?.bio}</p>
              <div className="flex flex-wrap gap-2 mb-6">
                {attorneyBrief?.credentials?.map((cred: string, i: number) => (
                  <span
                    key={i}
                    className="inline-block text-xs font-medium px-3 py-1.5 rounded-full"
                    style={{ backgroundColor: 'rgba(201, 150, 59, 0.1)', color: '#C9963B' }}
                  >
                    {cred}
                  </span>
                ))}
              </div>
              <Link
                href={attorneyBrief?.cta?.href ?? '/about'}
                className="inline-block px-8 py-3 border-2 rounded-md font-semibold text-sm transition-colors"
                style={{ borderColor: '#1B2A4A', color: '#1B2A4A' }}
              >
                {attorneyBrief?.cta?.label ?? '了解更多'}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── Section 6: Latest Articles (placeholder) ── */}
      <section className="bg-white py-[80px]">
        <div className="max-w-[1200px] mx-auto px-6">
          <SectionHeader label="知识中心" title="最新文章" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { title: '2024年庇护申请最新政策变化解读', category: '政策更新', date: '2024年3月15日', readTime: '5分钟', gradient: 'linear-gradient(135deg, #1B2A4A, #2D4A7A)' },
              { title: '庇护面谈前必须了解的10个要点', category: '申请指南', date: '2024年3月10日', readTime: '8分钟', gradient: 'linear-gradient(135deg, #8B5E3C, #C9963B)' },
              { title: '政治庇护与难民身份的区别详解', category: '法律知识', date: '2024年3月5日', readTime: '6分钟', gradient: 'linear-gradient(135deg, #2D5A3D, #4A8C6A)' },
            ].map((article, i) => (
              <div key={i} className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
                <div
                  className="h-[200px] relative flex items-end p-4"
                  style={{ background: article.gradient }}
                >
                  <span className="inline-block text-xs font-semibold text-white bg-white/20 px-3 py-1 rounded-full">
                    {article.category}
                  </span>
                </div>
                <div className="p-5">
                  <h3 className="font-semibold text-gray-900 mb-2 leading-snug">
                    <Link href="/articles" className="hover:text-[#1B2A4A]">
                      {article.title}
                    </Link>
                  </h3>
                  <p className="text-sm text-gray-500 line-clamp-2 mb-3">
                    了解更多关于此主题的详细信息和法律分析...
                  </p>
                  <div className="text-xs text-gray-400">
                    {article.date} · {article.readTime}阅读
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center mt-10">
            <Link
              href="/articles"
              className="inline-block px-8 py-3 border-2 rounded-md font-semibold text-sm transition-colors"
              style={{ borderColor: '#1B2A4A', color: '#1B2A4A' }}
            >
              查看所有文章 →
            </Link>
          </div>
        </div>
      </section>

      {/* ── Section 7: Latest Videos (placeholder) ── */}
      <section className="py-[80px]" style={{ backgroundColor: '#F9FAFB' }}>
        <div className="max-w-[1200px] mx-auto px-6">
          <SectionHeader label="视频中心" title="最新视频" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { title: '庇护申请流程详解', category: '申请流程', duration: '12:30', gradient: 'linear-gradient(135deg, #1B2A4A, #2D4A7A)' },
              { title: '如何准备恐惧面谈', category: '面谈准备', duration: '15:45', gradient: 'linear-gradient(135deg, #8B5E3C, #C9963B)' },
              { title: '庇护申请常见错误分析', category: '注意事项', duration: '10:20', gradient: 'linear-gradient(135deg, #2D5A3D, #4A8C6A)' },
            ].map((video, i) => (
              <div key={i} className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
                <div
                  className="h-[200px] relative flex items-center justify-center"
                  style={{ background: video.gradient }}
                >
                  {/* Play button */}
                  <div className="w-14 h-14 rounded-full bg-white flex items-center justify-center shadow-lg">
                    <span className="text-[#1B2A4A] text-xl ml-1">▶</span>
                  </div>
                  {/* Duration badge */}
                  <span className="absolute bottom-3 right-3 text-xs font-medium text-white bg-black/60 px-2 py-1 rounded">
                    {video.duration}
                  </span>
                </div>
                <div className="p-5">
                  <h3 className="font-semibold text-gray-900 mb-1">{video.title}</h3>
                  <p className="text-sm text-gray-500">{video.category}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center mt-10">
            <Link
              href="/videos"
              className="inline-block px-8 py-3 border-2 rounded-md font-semibold text-sm transition-colors"
              style={{ borderColor: '#1B2A4A', color: '#1B2A4A' }}
            >
              查看所有视频 →
            </Link>
          </div>
        </div>
      </section>

      {/* ── Section 8: Testimonials ── */}
      <section className="py-[80px]" style={{ backgroundColor: '#0F1A32' }}>
        <div className="max-w-[1200px] mx-auto px-6">
          <SectionHeader light label="客户评价" title="听听他们怎么说" />
          <div className="flex gap-6 overflow-x-auto pb-4" style={{ scrollSnapType: 'x mandatory' }}>
            {[
              { name: '王女士', type: '政治庇护', year: '2023', quote: '律师非常专业和耐心，在整个庇护申请过程中给了我极大的帮助和信心。她的中文服务让我感到非常安心，不用担心语言障碍。' },
              { name: '李先生', type: '防御性庇护', year: '2023', quote: '在我面临递解的时候，律师帮我成功申请了庇护。她对案件的准备非常充分，每一个细节都考虑到了。非常感谢！' },
              { name: '陈女士', type: '主动庇护', year: '2024', quote: '从初次咨询到最终获批，律师全程跟进。她的专业知识和认真态度让我印象深刻。强烈推荐给需要庇护律师的朋友。' },
              { name: '赵先生', type: '恐惧面谈', year: '2024', quote: '律师帮我准备恐惧面谈，模拟面谈让我不再紧张。最终顺利通过了面谈，进入了庇护程序。非常感谢律师的专业服务。' },
            ].map((testimonial, i) => (
              <div
                key={i}
                className="min-w-[360px] rounded-lg p-8 flex-shrink-0"
                style={{
                  scrollSnapAlign: 'start',
                  backgroundColor: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderLeft: '3px solid #C9963B',
                }}
              >
                <div className="text-lg mb-4" style={{ color: '#C9963B' }}>★★★★★</div>
                <p className="text-base text-gray-300 italic leading-relaxed mb-6 relative">
                  <span className="text-2xl absolute -top-2 -left-1" style={{ color: '#C9963B' }}>&ldquo;</span>
                  <span className="ml-4">{testimonial.quote}</span>
                </p>
                <div>
                  <span className="text-white font-bold">{testimonial.name}</span>
                  <span className="text-gray-400 text-sm ml-2">
                    {testimonial.type} · {testimonial.year}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Section 9: FAQ Preview ── */}
      <section className="bg-white py-[80px]">
        <div className="max-w-[1200px] mx-auto px-6">
          <SectionHeader
            label="常见问题"
            title={faqPreview?.headline ?? '常见问题'}
            subtitle={faqPreview?.subheadline}
          />
          <FaqAccordion questions={faqPreview?.faqs?.slice(0, 5) ?? []} />
          <div className="text-center mt-10">
            <Link
              href={faqPreview?.cta?.href ?? '/faq'}
              className="inline-block px-8 py-3 border-2 rounded-md font-semibold text-sm transition-colors"
              style={{ borderColor: '#1B2A4A', color: '#1B2A4A' }}
            >
              {faqPreview?.cta?.label ?? '查看所有常见问题'} →
            </Link>
          </div>
        </div>
      </section>

      {/* ── Section 10: Contact CTA ── */}
      <section
        className="py-[80px]"
        style={{ background: 'linear-gradient(135deg, #1B2A4A 0%, #0F1A32 100%)' }}
      >
        <div className="max-w-[1200px] mx-auto px-6">
          <SectionHeader
            light
            title={contactCta?.headline ?? '准备好开始您的庇护申请了吗？'}
            subtitle={contactCta?.subheadline}
          />
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            <Link
              href={contactCta?.cta?.primary?.href ?? '/consultation'}
              className="inline-block px-[36px] py-[16px] text-white font-semibold rounded-md transition-colors"
              style={{ backgroundColor: '#B8373D' }}
            >
              {contactCta?.cta?.primary?.label ?? '预约免费咨询'}
            </Link>
            <Link
              href={contactCta?.cta?.secondary?.href ?? 'mailto:yuxiaris@gmail.com'}
              className="inline-block px-[36px] py-[16px] font-semibold rounded-md border border-white text-white bg-transparent transition-colors"
            >
              {contactCta?.cta?.secondary?.label ?? '发送邮件咨询'}
            </Link>
          </div>
          <div className="max-w-[600px] mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Email */}
            <div className="flex items-center gap-4">
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center text-xl flex-shrink-0"
                style={{ backgroundColor: '#C9963B' }}
              >
                ✉
              </div>
              <div>
                <div className="text-white font-medium">邮件咨询</div>
                <a href="mailto:yuxiaris@gmail.com" className="text-white/70 text-sm hover:text-white">yuxiaris@gmail.com</a>
              </div>
            </div>
            {/* WeChat */}
            <div className="flex items-center gap-4">
              <div className="w-[120px] h-[120px] bg-white rounded-lg overflow-hidden flex-shrink-0">
                <Image
                  src="/images/wechat-qr.png"
                  alt="微信二维码"
                  width={120}
                  height={120}
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <div className="text-white font-medium">微信咨询</div>
                <div className="text-white/70 text-sm">
                  {contactCta?.wechat?.id ?? 'yuxiaris'}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 11: Trust Bar — rendered by layout, not here */}
    </main>
  );
}
