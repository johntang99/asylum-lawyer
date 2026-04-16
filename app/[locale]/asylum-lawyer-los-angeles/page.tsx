import { Metadata } from 'next';
import Link from 'next/link';
import { loadPageContent } from '@/lib/content';
import { isValidLocale, defaultLocale, type Locale } from '@/lib/i18n';
import SectionHeader from '@/components/shared/SectionHeader';
import FaqAccordion from '@/components/shared/FaqAccordion';

/* eslint-disable @typescript-eslint/no-explicit-any */

export async function generateMetadata({
  params,
}: {
  params: { locale: string };
}): Promise<Metadata> {
  const locale = isValidLocale(params.locale) ? params.locale : defaultLocale;
  const content = await loadPageContent<any>('asylum-lawyer-los-angeles', locale as Locale);
  const seo = content?.seo;
  return {
    title: seo?.title ?? '洛杉矶中文庇护律师 | 宇律师事务所',
    description: seo?.description ?? '',
  };
}

export default async function AsylumLawyerLosAngelesPage({
  params,
}: {
  params: { locale: string };
}) {
  const locale = isValidLocale(params.locale) ? params.locale : defaultLocale;
  const content = await loadPageContent<any>('asylum-lawyer-los-angeles', locale as Locale);

  const hero = content?.hero ?? {
    headline: '洛杉矶中文庇护移民律师',
    subheadline: '宇律师事务所专注为洛杉矶华人社区提供政治庇护法律服务。',
    cta: {
      primary: { label: '预约免费咨询', href: '/consultation' },
      secondary: { label: '发送邮件至 yuxiaris@gmail.com', href: 'mailto:yuxiaris@gmail.com' },
    },
  };

  const trustBar = content?.trustBar ?? [
    { icon: '🏆', label: '10+ 年经验' },
    { icon: '⚖', label: 'CA 执照律师' },
    { icon: '⭐', label: '4.9 评分' },
    { icon: '📋', label: '500+ 案件' },
  ];

  const services = content?.services ?? [];
  const whyUs = content?.whyUs ?? [];
  const testimonials = content?.testimonials ?? [];
  const faqs = content?.faqs ?? [];
  const location = content?.location ?? {
    address: '888 S. Figueroa St, Suite 1200',
    city: 'Los Angeles, CA 90017',
    phone: 'yuxiaris@gmail.com',
    email: 'yuxiaris@gmail.com',
    hours: [
      { day: '周一至周五', time: '9:00 AM – 6:00 PM' },
      { day: '周六', time: '10:00 AM – 2:00 PM（仅预约）' },
      { day: '周日', time: '休息' },
    ],
  };

  const WHY_US_ICONS = ['🎯', '🗣', '📊', '💰'];

  return (
    <main>
      {/* ── Hero ── */}
      <section
        className="min-h-[520px] flex items-center"
        style={{
          marginTop: '72px',
          background: 'linear-gradient(135deg, #1B2A4A 0%, #0F1A32 100%)',
        }}
      >
        <div className="max-w-[1200px] mx-auto px-6 py-20 w-full">
          <div className="max-w-[700px]">
            <h1
              className="text-[2.75rem] md:text-[3rem] font-bold text-white mb-4 leading-tight"
              style={{ fontFamily: 'var(--font-heading)' }}
            >
              {hero.headline}
            </h1>
            <p className="text-[1.125rem] text-white/85 leading-relaxed mb-8">
              {hero.subheadline}
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                href={hero.cta?.primary?.href ?? '/consultation'}
                className="inline-block px-[36px] py-[16px] text-white font-semibold rounded-md transition-colors"
                style={{ backgroundColor: '#B8373D' }}
              >
                {hero.cta?.primary?.label ?? '预约免费咨询'}
              </Link>
              <Link
                href={hero.cta?.secondary?.href ?? 'mailto:yuxiaris@gmail.com'}
                className="inline-block px-[36px] py-[16px] font-semibold rounded-md border border-white text-white bg-transparent transition-colors"
              >
                {hero.cta?.secondary?.label ?? '发送邮件咨询'}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── Trust Bar ── */}
      <section style={{ backgroundColor: '#1B2A4A' }} className="py-5 border-t border-white/10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-wrap justify-center items-center gap-6 md:gap-12">
            {trustBar.map((item: any, i: number) => (
              <div key={i} className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center shrink-0 text-base"
                  style={{
                    backgroundColor: 'rgba(201,150,59,0.15)',
                    border: '1px solid #C9963B',
                    color: '#C9963B',
                  }}
                >
                  {item.icon}
                </div>
                <span
                  className="text-sm font-medium whitespace-nowrap"
                  style={{ color: 'rgba(255,255,255,0.85)' }}
                >
                  {item.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Body Copy / Intro ── */}
      <section className="bg-white py-[60px]">
        <div className="max-w-[800px] mx-auto px-6">
          <div className="prose prose-gray max-w-none text-gray-600 leading-relaxed space-y-4">
            <p>
              如果您正在洛杉矶寻找一位经验丰富、能用中文沟通的庇护移民律师，宇律师事务所是您值得信赖的选择。我们位于洛杉矶市中心，专注于为华人社区提供全面的政治庇护法律服务，包括主动庇护申请、防御性庇护、恐惧面谈准备、I-589表格填写以及庇护上诉等。
            </p>
            <p>
              宇律师拥有超过十年的庇护移民法执业经验，是加州律师协会认证律师和美国移民律师协会（AILA）会员。精通普通话、粤语和英语，能够确保在整个法律程序中与您保持无障碍的沟通。从初次免费咨询到最终案件结果，宇律师团队始终为您提供个性化的法律策略和贴心的跟踪服务。
            </p>
            <p>
              在过去的十余年中，我们已成功办理超过500件庇护案件，帮助众多洛杉矶及周边地区的华人家庭和个人获得庇护身份。我们深入了解洛杉矶移民法庭和USCIS庇护办公室的运作流程，能够为您制定最有效的法律方案。无论您面临何种庇护需求，宇律师事务所都致力于用专业知识和真诚态度为您争取最好的结果。
            </p>
          </div>
        </div>
      </section>

      {/* ── Services ── */}
      <section className="py-[80px]" style={{ backgroundColor: '#F9FAFB' }}>
        <div className="max-w-[1200px] mx-auto px-6">
          <SectionHeader
            label="服务项目"
            title="洛杉矶庇护法律服务"
            subtitle="全面的中文庇护移民法律服务，从初次咨询到案件完结"
          />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((svc: any, i: number) => (
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
                  {svc.icon}
                </div>
                <h3 className="text-[1.15rem] font-semibold text-gray-900 mb-2">{svc.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{svc.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Why Choose Us ── */}
      <section className="bg-white py-[80px]">
        <div className="max-w-[1200px] mx-auto px-6">
          <SectionHeader
            label="为什么选择我们"
            title="选择洛杉矶宇律师事务所的理由"
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-[900px] mx-auto">
            {whyUs.map((item: any, i: number) => (
              <div key={i} className="flex gap-5">
                <div
                  className="w-12 h-12 rounded-full flex-shrink-0 flex items-center justify-center text-xl"
                  style={{ backgroundColor: 'rgba(201, 150, 59, 0.1)', color: '#C9963B' }}
                >
                  {WHY_US_ICONS[i] ?? '✅'}
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">{item.title}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Testimonials ── */}
      <section className="py-[80px]" style={{ backgroundColor: '#0F1A32' }}>
        <div className="max-w-[1200px] mx-auto px-6">
          <SectionHeader
            light
            label="客户评价"
            title="洛杉矶客户怎么说"
          />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t: any, i: number) => (
              <div
                key={i}
                className="rounded-lg p-8"
                style={{
                  backgroundColor: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderLeft: '3px solid #C9963B',
                }}
              >
                <div className="text-lg mb-4" style={{ color: '#C9963B' }}>★★★★★</div>
                <p className="text-base text-gray-300 italic leading-relaxed mb-6 relative">
                  <span className="text-2xl absolute -top-2 -left-1" style={{ color: '#C9963B' }}>&ldquo;</span>
                  <span className="ml-4">{t.quote}</span>
                </p>
                <div>
                  <span className="text-white font-bold">{t.name}</span>
                  <span className="text-gray-400 text-sm ml-2">
                    {t.type} · {t.year}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="bg-white py-[80px]">
        <div className="max-w-[1200px] mx-auto px-6">
          <SectionHeader
            label="常见问题"
            title="洛杉矶庇护申请常见问题"
            subtitle="关于在洛杉矶申请庇护，客户最常问的问题"
          />
          <FaqAccordion questions={faqs} />
        </div>
      </section>

      {/* ── Location ── */}
      <section className="py-[80px]" style={{ backgroundColor: '#F9FAFB' }}>
        <div className="max-w-[1200px] mx-auto px-6">
          <SectionHeader
            label="办公地点"
            title="洛杉矶办公室"
          />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Map placeholder */}
            <div
              className="bg-gray-200 rounded-lg flex items-center justify-center"
              style={{ minHeight: '300px' }}
            >
              <span className="text-gray-400 text-sm">地图加载中...</span>
            </div>

            {/* NAP block */}
            <div className="space-y-6">
              <div>
                <h3 className="font-bold text-gray-900 mb-3 text-lg">宇律师事务所</h3>
                <div className="space-y-3 text-sm text-gray-600">
                  <div className="flex items-start gap-3">
                    <span className="text-lg mt-0.5">📍</span>
                    <span>
                      {location.address}
                      <br />
                      {location.city}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-lg">📞</span>
                    <Link href="mailto:yuxiaris@gmail.com" style={{ color: '#1B2A4A' }}>
                      {location.phone}
                    </Link>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-lg">📧</span>
                    <Link href={`mailto:${location.email}`} style={{ color: '#1B2A4A' }}>
                      {location.email}
                    </Link>
                  </div>
                </div>
              </div>

              {/* Hours */}
              <div>
                <h4 className="font-semibold text-gray-900 mb-3">营业时间</h4>
                <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                  {location.hours.map((row: any, i: number) => (
                    <div
                      key={i}
                      className={`flex items-center justify-between px-5 py-3 text-sm ${
                        i < location.hours.length - 1 ? 'border-b border-gray-100' : ''
                      } ${i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}
                    >
                      <span className="font-medium text-gray-900">{row.day}</span>
                      <span className="text-gray-600">{row.time}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Bottom CTA ── */}
      <section
        className="py-[80px]"
        style={{ background: 'linear-gradient(135deg, #1B2A4A 0%, #0F1A32 100%)' }}
      >
        <div className="max-w-[1200px] mx-auto px-6 text-center">
          <SectionHeader
            light
            title="准备好在洛杉矶开始您的庇护申请了吗？"
            subtitle="立即预约免费咨询，让宇律师为您评估案件并制定法律策略"
          />
          <div className="flex flex-wrap justify-center gap-4 mb-8">
            <Link
              href="/consultation"
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
          <div className="flex justify-center gap-8">
            <div className="flex items-center gap-3">
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center text-xl flex-shrink-0"
                style={{ backgroundColor: '#C9963B' }}
              >
                📞
              </div>
              <div className="text-left">
                <div className="text-white font-medium text-sm">邮件咨询</div>
                <div className="text-white/70 text-xs">yuxiaris@gmail.com</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center text-xl flex-shrink-0"
                style={{ backgroundColor: '#C9963B' }}
              >
                💬
              </div>
              <div className="text-left">
                <div className="text-white font-medium text-sm">微信咨询</div>
                <div className="text-white/70 text-xs">yuxiaris</div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
