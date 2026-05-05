import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { loadPageContent, loadAllItems } from '@/lib/content';
import { isValidLocale, defaultLocale, type Locale } from '@/lib/i18n';
import SectionHeader from '@/components/shared/SectionHeader';
import FaqAccordion from '@/components/shared/FaqAccordion';
import HeroSection from '@/components/sections/HeroSection';
import { getYouTubeThumbnailUrl } from '@/lib/utils';

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

// Cache content for both metadata and page render
let cachedContent: any = null;
let cachedLocale: string = '';

async function getHomeContent(locale: string) {
  if (cachedContent && cachedLocale === locale) return cachedContent;
  cachedContent = await loadPageContent<any>('home', locale as Locale);
  cachedLocale = locale;
  return cachedContent;
}

export async function generateMetadata({
  params,
}: {
  params: { locale: string };
}): Promise<Metadata> {
  const locale = isValidLocale(params.locale) ? params.locale : defaultLocale;
  const content = await getHomeContent(locale);
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
  const content = await getHomeContent(locale);
  const sections = content?.sections ?? [];

  const hero = sections.find((s: any) => s.type === 'hero');
  const serviceOverview = sections.find((s: any) => s.type === 'serviceOverview');
  const whyUs = sections.find((s: any) => s.type === 'whyUs');
  const processTimeline = sections.find((s: any) => s.type === 'processTimeline');
  const attorneyBrief = sections.find((s: any) => s.type === 'attorneyBrief');
  const testimonials = sections.find((s: any) => s.type === 'testimonials');
  const faqPreview = sections.find((s: any) => s.type === 'faqPreview');
  const contactCta = sections.find((s: any) => s.type === 'contactCta');

  // Load dynamic content in parallel
  const siteId = 'asylum-attorney-la';
  const [articles, videos] = await Promise.all([
    loadAllItems<any>(siteId, locale as Locale, 'blog').catch(() => []),
    loadAllItems<any>(siteId, locale as Locale, 'videos').catch(() => []),
  ]);

  const latestArticles = [...articles]
    .sort((a, b) => (b.publishDate || '').localeCompare(a.publishDate || ''))
    .slice(0, 3);
  const latestVideos = [...videos]
    .sort((a, b) => (b.publishDate || '').localeCompare(a.publishDate || ''))
    .slice(0, 3);

  return (
    <main>
      {/* ── Section 1: Hero ── */}
      {hero && (
        <HeroSection
          variant={hero.variant ?? 'split-photo-right'}
          headline={hero.headline ?? ''}
          subheadline={hero.subheadline}
          image={hero.image}
          backgroundImage={hero.backgroundImage}
          gallery={Array.isArray(hero.gallery) ? hero.gallery : undefined}
          photoOverlayOpacity={
            typeof hero.photoOverlayOpacity === 'number' ? hero.photoOverlayOpacity : 0.6
          }
          photoContentPosition={
            hero.photoContentPosition === 'center' ||
            hero.photoContentPosition === 'center-below' ||
            hero.photoContentPosition === 'left' ||
            hero.photoContentPosition === 'left-below' ||
            hero.photoContentPosition === 'lower'
              ? hero.photoContentPosition
              : 'left'
          }
          cta={hero.cta}
          stats={hero.stats}
        />
      )}

      {/* ── Section 2: Service Overview ── */}
      {serviceOverview && (
        <section className="bg-white py-[80px]">
          <div className="max-w-[1200px] mx-auto px-6">
            <SectionHeader
              label="我们的服务"
              title={serviceOverview.headline ?? '庇护法律服务'}
              subtitle={serviceOverview.subheadline}
            />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {serviceOverview.services?.map((service: any, i: number) => (
                <Link
                  key={i}
                  href={`/${locale}${service.href}`}
                  className="group border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-all"
                >
                  <div
                    className="w-12 h-12 rounded-lg mb-4 flex items-center justify-center text-xl"
                    style={{ backgroundColor: 'rgba(27, 42, 74, 0.08)', color: '#1B2A4A' }}
                  >
                    {ICON_MAP[service.icon] ?? '📋'}
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-[#1B2A4A]">
                    {service.title}
                  </h3>
                  <p className="text-sm text-gray-500 leading-relaxed mb-3">
                    {service.description}
                  </p>
                  <span className="text-sm font-medium text-[#C9963B]">
                    了解更多 →
                  </span>
                </Link>
              ))}
            </div>
            <div className="text-center mt-10">
              <Link
                href={`/${locale}/services`}
                className="inline-block px-8 py-3 border-2 rounded-md font-semibold text-sm transition-colors"
                style={{ borderColor: '#1B2A4A', color: '#1B2A4A' }}
              >
                查看全部服务 →
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* ── Section 3: Why Us ── */}
      {whyUs && (
        <section className="py-[80px]" style={{ backgroundColor: '#F9FAFB' }}>
          <div className="max-w-[1200px] mx-auto px-6">
            <SectionHeader
              label="为什么选择我们"
              title={whyUs.headline ?? '为什么选择宇霞移民服务中心'}
              subtitle={whyUs.subheadline}
            />
            <div className="flex flex-wrap justify-center gap-6">
              {whyUs.pillars?.map((pillar: any, i: number) => (
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
      )}

      {/* ── Section 4: Process Timeline ── */}
      {processTimeline && (
        <section className="bg-white py-[80px]">
          <div className="max-w-[1200px] mx-auto px-6">
            <SectionHeader
              label="流程说明"
              title={processTimeline.headline ?? '庇护申请流程'}
              subtitle={processTimeline.subheadline}
            />
            <div className="max-w-[700px] mx-auto space-y-6">
              {processTimeline.steps?.map((step: any, i: number) => (
                <div key={i} className="flex gap-5 items-start">
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0"
                    style={{ backgroundColor: '#C9963B', color: '#FFFFFF' }}
                  >
                    {step.step}
                  </div>
                  <div className="flex-1 pb-4 border-b border-gray-100">
                    <h3 className="font-semibold text-gray-900 mb-1">{step.title}</h3>
                    <p className="text-sm text-gray-500 leading-relaxed">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── Section 5: Attorney Brief ── */}
      {attorneyBrief && (
        <section className="py-[80px]" style={{ backgroundColor: '#F9FAFB' }}>
          <div className="max-w-[1200px] mx-auto px-6">
            <div className="flex flex-col lg:flex-row gap-10 items-center lg:items-start">
              {/* Photo */}
              <div
                className="w-full lg:w-[320px] h-[400px] rounded-lg flex-shrink-0 flex items-center justify-center overflow-hidden"
                style={attorneyBrief.photo ? undefined : { background: 'linear-gradient(135deg, #1B2A4A, #0F1A32)' }}
              >
                {attorneyBrief.photo ? (
                  <Image
                    src={attorneyBrief.photo}
                    alt={attorneyBrief.headline ?? attorneyBrief.name ?? ''}
                    width={320}
                    height={400}
                    className="w-full h-full object-cover"
                    sizes="(max-width: 768px) 100vw, 320px"
                  />
                ) : (
                  <span className="text-white/30 text-sm">照片</span>
                )}
              </div>
              {/* Content */}
              <div className="flex-1">
                {attorneyBrief.sectionLabel && (
                  <span
                    className="inline-block text-xs font-semibold uppercase tracking-[0.1em] mb-3"
                    style={{ color: '#C9963B' }}
                  >
                    {attorneyBrief.sectionLabel}
                  </span>
                )}
                <h2
                  className="text-2xl font-bold text-gray-900 mb-2"
                  style={{ fontFamily: 'var(--font-heading)' }}
                >
                  {attorneyBrief.headline ?? attorneyBrief.name ?? ''}
                </h2>
                {attorneyBrief.title && (
                  <p className="font-semibold mb-4" style={{ color: '#C9963B' }}>
                    {attorneyBrief.title}
                  </p>
                )}
                <p className="text-gray-600 leading-relaxed mb-4">{attorneyBrief.bio}</p>
                <div className="flex flex-wrap gap-2 mb-6">
                  {attorneyBrief.credentials?.filter(Boolean).map((cred: string, i: number) => (
                    <span
                      key={i}
                      className="inline-block px-3 py-1 rounded-full text-xs font-medium"
                      style={{ backgroundColor: 'rgba(201, 150, 59, 0.1)', color: '#C9963B' }}
                    >
                      {cred}
                    </span>
                  ))}
                </div>
                <Link
                  href={attorneyBrief.cta?.href ?? '/about'}
                  className="inline-block px-8 py-3 border-2 rounded-md font-semibold text-sm transition-colors"
                  style={{ borderColor: '#1B2A4A', color: '#1B2A4A' }}
                >
                  {attorneyBrief.cta?.label ?? '了解更多'}
                </Link>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ── Section 6: Latest Articles (dynamic) ── */}
      {latestArticles.length > 0 && (
        <section className="bg-white py-[80px]">
          <div className="max-w-[1200px] mx-auto px-6">
            <SectionHeader label="知识中心" title="最新文章" />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {latestArticles.map((article: any, i: number) => (
                <Link
                  key={article.slug || i}
                  href={`/${locale}/articles/${article.slug}`}
                  className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
                >
                  <div
                    className="h-[180px] relative flex items-end p-4"
                    style={{
                      background: article.image
                        ? undefined
                        : ['linear-gradient(135deg, #1B2A4A, #2D4A7A)', 'linear-gradient(135deg, #8B5E3C, #C9963B)', 'linear-gradient(135deg, #2D5A3D, #4A8C6A)'][i % 3],
                      backgroundImage: article.image
                        ? `linear-gradient(rgba(10, 18, 36, 0.2), rgba(10, 18, 36, 0.2)), url("${article.image}")`
                        : undefined,
                      backgroundSize: article.image ? 'cover' : undefined,
                      backgroundPosition: article.image ? 'center' : undefined,
                    }}
                  >
                    <span className="inline-block text-xs font-semibold text-white bg-white/20 px-3 py-1 rounded-full">
                      {article.category || '法律知识'}
                    </span>
                  </div>
                  <div className="p-5">
                    <h3 className="font-semibold text-gray-900 mb-2 leading-snug line-clamp-2">
                      {article.title}
                    </h3>
                    <p className="text-sm text-gray-500 line-clamp-2 mb-3">
                      {article.excerpt || article.summary || ''}
                    </p>
                    <div className="text-xs text-gray-400">
                      {article.publishDate} · {article.readTime || '5分钟'}阅读
                    </div>
                  </div>
                </Link>
              ))}
            </div>
            <div className="text-center mt-10">
              <Link
                href={`/${locale}/articles`}
                className="inline-block px-8 py-3 border-2 rounded-md font-semibold text-sm transition-colors"
                style={{ borderColor: '#1B2A4A', color: '#1B2A4A' }}
              >
                查看所有文章 →
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* ── Section 7: Latest Videos (dynamic) ── */}
      {latestVideos.length > 0 && (
        <section className="py-[80px]" style={{ backgroundColor: '#F9FAFB' }}>
          <div className="max-w-[1200px] mx-auto px-6">
            <SectionHeader label="视频中心" title="最新视频" />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {latestVideos.map((video: any, i: number) => (
                (() => {
                  const thumbnailUrl = getYouTubeThumbnailUrl(video.videoUrl);
                  return (
                    <Link
                      key={video.slug || i}
                      href={`/${locale}/videos/${video.slug}`}
                      className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
                    >
                      <div
                        className="h-[180px] relative flex items-center justify-center overflow-hidden"
                        style={{
                          background: thumbnailUrl
                            ? undefined
                            : ['linear-gradient(135deg, #1B2A4A, #2D4A7A)', 'linear-gradient(135deg, #8B5E3C, #C9963B)', 'linear-gradient(135deg, #2D5A3D, #4A8C6A)'][i % 3],
                        }}
                      >
                        {thumbnailUrl && (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={thumbnailUrl}
                            alt={video.title}
                            className="absolute inset-0 w-full h-full object-cover"
                          />
                        )}
                        <div className="w-14 h-14 rounded-full bg-white flex items-center justify-center shadow-lg relative z-10">
                          <span className="text-[#1B2A4A] text-xl ml-1">▶</span>
                        </div>
                        {video.duration && (
                          <span className="absolute bottom-3 right-3 text-xs font-medium text-white bg-black/60 px-2 py-1 rounded z-10">
                            {video.duration}
                          </span>
                        )}
                      </div>
                      <div className="p-5">
                        <h3 className="font-semibold text-gray-900 mb-1 line-clamp-2">{video.title}</h3>
                        <p className="text-sm text-gray-500">{video.category || ''}</p>
                      </div>
                    </Link>
                  );
                })()
              ))}
            </div>
            <div className="text-center mt-10">
              <Link
                href={`/${locale}/videos`}
                className="inline-block px-8 py-3 border-2 rounded-md font-semibold text-sm transition-colors"
                style={{ borderColor: '#1B2A4A', color: '#1B2A4A' }}
              >
                查看所有视频 →
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* ── Section 8: Testimonials ── */}
      {testimonials && Array.isArray(testimonials.items) && testimonials.items.length > 0 && (
        <section className="py-[80px]" style={{ backgroundColor: '#0F1A32' }}>
          <div className="max-w-[1200px] mx-auto px-6">
            <SectionHeader
              light
              label={testimonials.label ?? '客户评价'}
              title={testimonials.headline ?? '听听他们怎么说'}
              subtitle={testimonials.subheadline}
            />
            <div className="flex gap-6 overflow-x-auto pb-4" style={{ scrollSnapType: 'x mandatory' }}>
              {testimonials.items.map((testimonial: any, i: number) => (
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
                  <div className="text-lg mb-4" style={{ color: '#C9963B' }}>
                    {testimonial.rating || '★★★★★'}
                  </div>
                  <p className="text-base text-gray-300 italic leading-relaxed mb-6 relative">
                    <span className="text-2xl absolute -top-2 -left-1" style={{ color: '#C9963B' }}>
                      &ldquo;
                    </span>
                    <span className="ml-4">{testimonial.quote}</span>
                  </p>
                  <div>
                    <span className="text-white font-bold">{testimonial.name}</span>
                    {(testimonial.type || testimonial.year) && (
                      <span className="text-gray-400 text-sm ml-2">
                        {[testimonial.type, testimonial.year].filter(Boolean).join(' · ')}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── Section 9: FAQ Preview ── */}
      {faqPreview && (
        <section className="bg-white py-[80px]">
          <div className="max-w-[1200px] mx-auto px-6">
            <SectionHeader
              label="常见问题"
              title={faqPreview.headline ?? '常见问题'}
              subtitle={faqPreview.subheadline}
            />
            <FaqAccordion questions={faqPreview.faqs?.slice(0, 5) ?? []} />
            <div className="text-center mt-10">
              <Link
                href={faqPreview.cta?.href ?? '/faq'}
                className="inline-block px-8 py-3 border-2 rounded-md font-semibold text-sm transition-colors"
                style={{ borderColor: '#1B2A4A', color: '#1B2A4A' }}
              >
                {faqPreview.cta?.label ?? '查看所有常见问题'} →
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* ── Section 10: Contact CTA ── */}
      {contactCta && (
        <section
          className="py-[80px]"
          style={{ background: 'linear-gradient(135deg, #1B2A4A 0%, #0F1A32 100%)' }}
        >
          <div className="max-w-[1200px] mx-auto px-6">
            <SectionHeader
              light
              title={contactCta.headline ?? '准备好开始您的庇护申请了吗？'}
              subtitle={contactCta.subheadline}
            />
            <div className="flex flex-wrap justify-center gap-4 mb-12">
              <Link
                href={contactCta.cta?.primary?.href ?? '/consultation'}
                className="inline-block px-[36px] py-[16px] text-white font-semibold rounded-md transition-colors"
                style={{ backgroundColor: '#B8373D' }}
              >
                {contactCta.cta?.primary?.label ?? '预约免费咨询'}
              </Link>
              <Link
                href={contactCta.cta?.secondary?.href ?? 'mailto:yuxiaris@gmail.com'}
                className="inline-block px-[36px] py-[16px] font-semibold rounded-md border border-white text-white bg-transparent transition-colors"
              >
                {contactCta.cta?.secondary?.label ?? '发送邮件咨询'}
              </Link>
            </div>
            <div className="max-w-[600px] mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
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
              <div className="flex items-center gap-4">
                <div className="w-[120px] h-[120px] bg-white rounded-lg overflow-hidden flex-shrink-0">
                  <Image
                    src="/images/wechat-qr.png"
                    alt="微信二维码"
                    width={120}
                    height={120}
                    sizes="120px"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <div className="text-white font-medium">微信咨询</div>
                  <div className="text-white/70 text-sm">
                    {contactCta.wechat?.id ?? 'yuxiaris'}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}
    </main>
  );
}
