import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { loadPageContent } from '@/lib/content';
import { isValidLocale, defaultLocale, type Locale } from '@/lib/i18n';
import SectionHeader from '@/components/shared/SectionHeader';

/* eslint-disable @typescript-eslint/no-explicit-any */

export async function generateMetadata({
  params,
}: {
  params: { locale: string };
}): Promise<Metadata> {
  const locale = isValidLocale(params.locale) ? params.locale : defaultLocale;
  const content = await loadPageContent<any>('about', locale as Locale);
  const seo = content?.seo;
  return {
    title: seo?.title ?? '关于律师 — 洛杉矶庇护移民律师',
    description: seo?.description ?? '',
  };
}

export default async function AboutPage({
  params,
}: {
  params: { locale: string };
}) {
  const locale = isValidLocale(params.locale) ? params.locale : defaultLocale;
  const content = await loadPageContent<any>('about', locale as Locale);
  const sections = content?.sections ?? [];

  const hero = sections.find((s: any) => s.type === 'hero');
  const story = sections.find((s: any) => s.type === 'story');
  const credentials = sections.find((s: any) => s.type === 'credentials');
  const stats = sections.find((s: any) => s.type === 'stats');
  const languages = sections.find((s: any) => s.type === 'languages');
  const office = sections.find((s: any) => s.type === 'office');
  const team = sections.find((s: any) => s.type === 'team');
  const cta = sections.find((s: any) => s.type === 'cta');

  return (
    <>
      {/* ── Section 1: Hero ── */}
      <section
        className="flex items-center relative"
        style={{
          marginTop: '72px',
          background: (hero?.variant === 'photo-background' || hero?.variant === 'overlap') && (hero?.image || hero?.backgroundImage)
            ? undefined
            : 'linear-gradient(135deg, var(--primary, #1B2A4A) 0%, var(--primary-dark, #0F1A32) 100%)',
        }}
      >
        {/* Background image for photo-background / overlap variants */}
        {(hero?.variant === 'photo-background' || hero?.variant === 'overlap') && (hero?.image || hero?.backgroundImage) && (
          <>
            <Image
              src={hero.image || hero.backgroundImage}
              alt={hero?.headline || ''}
              fill
              className="object-cover z-0"
            />
            <div className="absolute inset-0 z-0 bg-[#0F1A32]/60" />
          </>
        )}
        <div className="max-w-[1200px] mx-auto px-6 py-16 w-full relative z-10">
          <div className={`flex flex-col lg:flex-row gap-12 items-center ${hero?.variant === 'centered' ? 'justify-center text-center' : ''}`}>
            {/* Photo — show for split variants or when image is set and not a background variant */}
            {hero?.variant !== 'photo-background' && hero?.variant !== 'centered' && (
              <div
                className={`w-full max-w-[320px] h-[400px] rounded-lg flex-shrink-0 flex items-center justify-center overflow-hidden ${hero?.variant === 'split-photo-left' ? 'order-1' : hero?.variant === 'split-photo-right' ? 'order-2 lg:order-1' : ''}`}
                style={
                  (hero?.image || hero?.backgroundImage)
                    ? undefined
                    : { background: 'linear-gradient(135deg, var(--primary, #1B2A4A), var(--primary-dark, #0F1A32))' }
                }
              >
                {(hero?.image || hero?.backgroundImage) ? (
                  <Image
                    src={hero.image || hero.backgroundImage}
                    alt={hero?.headline || ''}
                    width={320}
                    height={400}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-white/30 text-sm">律师照片</span>
                )}
              </div>
            )}
            {/* Content */}
            <div className={`flex-1 ${hero?.variant === 'centered' ? 'text-center max-w-[700px]' : 'text-center lg:text-left'} ${hero?.variant === 'split-photo-right' ? 'order-1 lg:order-2' : ''}`}>
              {hero?.sectionLabel && (
                <span
                  className="inline-block text-xs font-semibold uppercase tracking-[0.1em] mb-3"
                  style={{ color: 'var(--accent, #C9963B)' }}
                >
                  {hero.sectionLabel}
                </span>
              )}
              <h1
                className="text-[2.5rem] lg:text-[3rem] font-bold text-white mb-2 leading-tight"
                style={{ fontFamily: 'var(--font-heading)' }}
              >
                {hero?.headline ?? '律师'}
              </h1>
              <p
                className="text-lg font-semibold mb-4"
                style={{ color: 'var(--accent, #C9963B)' }}
              >
                {hero?.subheadline ?? '创始人 / 移民律师'}
              </p>
              <p className={`text-base text-white/85 leading-relaxed ${hero?.variant === 'centered' ? 'max-w-[600px] mx-auto' : 'max-w-[520px] mx-auto lg:mx-0'}`}>
                {hero?.intro}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Section 2: Story ── */}
      <section className="bg-white py-[80px]">
        <div className="max-w-[800px] mx-auto px-6">
          <SectionHeader label="个人经历" title={story?.headline ?? '我的故事'} />
          <div className="space-y-6">
            {story?.paragraphs?.map((p: string, i: number) => (
              <p
                key={i}
                className="text-base text-gray-600 leading-[1.9]"
              >
                {p}
              </p>
            ))}
          </div>
        </div>
      </section>

      {/* ── Section 3: Credentials Bar ── */}
      <section
        className="py-10"
        style={{
          background: 'linear-gradient(135deg, var(--primary, #1B2A4A) 0%, var(--primary-dark, #0F1A32) 100%)',
        }}
      >
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="flex flex-wrap justify-center gap-3">
            {credentials?.items?.map((item: string, i: number) => (
              <span
                key={i}
                className="inline-block text-sm font-medium px-5 py-2.5 rounded-full"
                style={{
                  backgroundColor: 'rgba(201, 150, 59, 0.15)',
                  color: 'var(--accent, #C9963B)',
                }}
              >
                {item}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ── Section 4: Stats ── */}
      <section className="py-[80px]" style={{ backgroundColor: '#F9FAFB' }}>
        <div className="max-w-[1200px] mx-auto px-6">
          <SectionHeader label="执业数据" title={stats?.headline ?? '执业成就'} />
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {stats?.items?.map((stat: any, i: number) => (
              <div
                key={i}
                className="bg-white border border-gray-200 rounded-lg text-center px-6 py-10 transition-all duration-200 hover:shadow-lg hover:-translate-y-1"
              >
                <div
                  className="text-[2.5rem] font-bold mb-2"
                  style={{
                    color: 'var(--accent, #C9963B)',
                    fontFamily: 'var(--font-body, Inter, sans-serif)',
                  }}
                >
                  {stat.value}
                </div>
                <div className="text-sm text-gray-500 uppercase tracking-widest">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Section 5: Languages ── */}
      <section className="bg-white py-[80px]">
        <div className="max-w-[1200px] mx-auto px-6">
          <SectionHeader label="语言服务" title={languages?.headline ?? '语言能力'} />
          {languages?.narrative && (
            <p className="text-center text-gray-500 max-w-[700px] mx-auto mb-10 leading-relaxed">
              {languages.narrative}
            </p>
          )}
          <div className="flex flex-col md:flex-row gap-6 justify-center">
            {languages?.items?.map((lang: any, i: number) => (
              <div
                key={i}
                className="flex-1 max-w-[360px] mx-auto md:mx-0 border border-gray-200 rounded-lg p-8 text-center transition-all duration-200 hover:shadow-lg hover:-translate-y-1"
              >
                <div
                  className="text-2xl font-bold mb-1"
                  style={{ color: 'var(--primary, #1B2A4A)', fontFamily: 'var(--font-heading)' }}
                >
                  {lang.language}
                </div>
                <div
                  className="text-sm font-semibold mb-4"
                  style={{ color: 'var(--accent, #C9963B)' }}
                >
                  {lang.level}
                </div>
                <p className="text-sm text-gray-500 leading-relaxed">
                  {lang.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Section 6: Office ── */}
      <section className="py-[80px]" style={{ backgroundColor: '#F9FAFB' }}>
        <div className="max-w-[1200px] mx-auto px-6">
          <SectionHeader label="办公地址" title={office?.headline ?? '我们的办公室'} />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            {/* Photos */}
            <div className="grid grid-cols-2 gap-4">
              {office?.photos?.map((photo: any, i: number) => (
                <div
                  key={i}
                  className="h-[220px] rounded-lg flex items-center justify-center"
                  style={{ background: 'linear-gradient(135deg, var(--primary, #1B2A4A), var(--primary-dark, #0F1A32))' }}
                >
                  <span className="text-white/30 text-sm">{photo.alt}</span>
                </div>
              ))}
            </div>
            {/* Address + Hours */}
            <div>
              <h3
                className="text-lg font-semibold text-gray-900 mb-3"
                style={{ fontFamily: 'var(--font-heading)' }}
              >
                地址
              </h3>
              <p className="text-gray-600 mb-6">{office?.address?.formatted}</p>

              <h3
                className="text-lg font-semibold text-gray-900 mb-3"
                style={{ fontFamily: 'var(--font-heading)' }}
              >
                办公时间
              </h3>
              <table className="w-full text-sm">
                <tbody>
                  {office?.hours?.map((h: any, i: number) => (
                    <tr key={i} className="border-b border-gray-100">
                      <td className="py-3 font-medium text-gray-700 pr-4">{h.days}</td>
                      <td className="py-3 text-gray-500">{h.time}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* ── Section 7: Team ── */}
      <section className="bg-white py-[80px]">
        <div className="max-w-[1200px] mx-auto px-6">
          <SectionHeader
            label="律所团队"
            title={team?.headline ?? '我们的团队'}
            subtitle={team?.subheadline}
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-[800px] mx-auto">
            {team?.members?.map((member: any, i: number) => (
              <div
                key={i}
                className="border border-gray-200 rounded-lg overflow-hidden transition-all duration-200 hover:shadow-lg hover:-translate-y-1"
              >
                {/* Photo placeholder */}
                <div
                  className="h-[200px] flex items-center justify-center"
                  style={{ background: 'linear-gradient(135deg, var(--primary, #1B2A4A), var(--primary-dark, #0F1A32))' }}
                >
                  <span className="text-white/30 text-sm">团队照片</span>
                </div>
                <div className="p-6">
                  <h3
                    className="text-lg font-semibold text-gray-900 mb-1"
                    style={{ fontFamily: 'var(--font-heading)' }}
                  >
                    {member.name}
                  </h3>
                  <p
                    className="text-sm font-semibold mb-3"
                    style={{ color: 'var(--accent, #C9963B)' }}
                  >
                    {member.role}
                  </p>
                  <p className="text-sm text-gray-500 leading-relaxed">
                    {member.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Section 8: CTA ── */}
      <section
        className="py-[80px]"
        style={{
          background: 'linear-gradient(135deg, var(--primary, #1B2A4A) 0%, var(--primary-dark, #0F1A32) 100%)',
        }}
      >
        <div className="max-w-[700px] mx-auto px-6 text-center">
          <h2
            className="text-2xl lg:text-3xl font-bold text-white mb-4"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            {cta?.headline ?? '想亲自了解我们？欢迎预约面谈'}
          </h2>
          {cta?.subheadline && (
            <p className="text-white/75 mb-8 leading-relaxed">
              {cta.subheadline}
            </p>
          )}
          <div className="flex flex-wrap justify-center gap-4">
            {cta?.buttons?.map((btn: any, i: number) => (
              <Link
                key={i}
                href={btn.href}
                className={`inline-block px-[36px] py-[16px] font-semibold rounded-md transition-colors ${
                  btn.variant === 'primary'
                    ? 'text-white'
                    : 'border border-white text-white bg-transparent'
                }`}
                style={
                  btn.variant === 'primary'
                    ? { backgroundColor: 'var(--secondary, #B8373D)' }
                    : undefined
                }
              >
                {btn.label}
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
