import { Metadata } from 'next';
import Link from 'next/link';
import { loadPageContent } from '@/lib/content';
import { isValidLocale, defaultLocale, type Locale } from '@/lib/i18n';
import SectionHeader from '@/components/shared/SectionHeader';
import ContactForm from './ContactForm';

/* eslint-disable @typescript-eslint/no-explicit-any */

export async function generateMetadata({
  params,
}: {
  params: { locale: string };
}): Promise<Metadata> {
  const locale = isValidLocale(params.locale) ? params.locale : defaultLocale;
  const content = await loadPageContent<any>('contact', locale as Locale);
  const seo = content?.seo;
  return {
    title: seo?.title ?? '联系我们 — 正道移民服务中心',
    description: seo?.description ?? '联系正道移民服务中心获取免费庇护移民法律咨询。',
  };
}

export default async function ContactPage({
  params,
}: {
  params: { locale: string };
}) {
  const locale = isValidLocale(params.locale) ? params.locale : defaultLocale;
  const content = await loadPageContent<any>('contact', locale as Locale);

  const contact = content?.contact ?? {
    phone: 'yuxiaris@gmail.com',
    phoneTel: 'mailto:yuxiaris@gmail.com',
    email: 'yuxiaris@gmail.com',
    wechat: 'yuxiaris',
    address: '1045 E. Valley Blvd., #A115, Rm 6',
    city: 'San Gabriel, CA 91776',
    mapUrl: 'https://maps.google.com/?q=1045+E+Valley+Blvd+A115+San+Gabriel+CA+91776',
  };

  const hours = content?.hours ?? [
    { day: '周一至周五', time: '9:00 AM – 6:00 PM' },
    { day: '周六', time: '10:00 AM – 2:00 PM（仅预约）' },
    { day: '周日', time: '休息' },
  ];

  const serviceAreas = content?.serviceAreas ?? {
    primary: '洛杉矶 (Los Angeles)',
    nearby: [
      '阿罕布拉 (Alhambra)',
      '蒙特利公园 (Monterey Park)',
      '圣盖博 (San Gabriel)',
      '罗兰岗 (Rowland Heights)',
      '核桃市 (Walnut)',
      '哈仙达岗 (Hacienda Heights)',
      '帕萨迪纳 (Pasadena)',
      '尔湾 (Irvine)',
    ],
  };

  const emergency = content?.emergency ?? {
    message: '如果您有即将到来的出庭日期或面谈，请立即发送邮件至 yuxiaris@gmail.com',
  };

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
        <div className="max-w-[1200px] mx-auto px-6 py-16 w-full text-center">
          <h1
            className="text-[2.5rem] font-bold text-white mb-3 leading-tight"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            联系我们
          </h1>
          <p className="text-white/70 text-lg">
            多种方式联系正道移民服务中心，获取免费庇护法律咨询
          </p>
        </div>
      </section>

      {/* ── Contact Methods Grid ── */}
      <section className="bg-white py-[60px]">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* WeChat */}
            <div className="bg-white border border-gray-200 rounded-lg text-center px-6 py-8">
              <div
                className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center text-2xl"
                style={{ backgroundColor: '#F9FAFB', color: '#1B2A4A' }}
              >
                💬
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-1">微信咨询</h3>
              <p className="text-gray-500 mb-4">{contact.wechat}</p>
              <button
                type="button"
                className="inline-block px-6 py-2.5 text-white font-semibold rounded-md text-sm transition-colors"
                style={{ backgroundColor: '#07C160' }}
              >
                添加微信
              </button>
            </div>

            {/* Email */}
            <div className="bg-white border border-gray-200 rounded-lg text-center px-6 py-8">
              <div
                className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center text-2xl"
                style={{ backgroundColor: '#F9FAFB', color: '#1B2A4A' }}
              >
                📧
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-1">邮件咨询</h3>
              <p className="text-gray-500 mb-4">{contact.email}</p>
              <Link
                href={`mailto:${contact.email}`}
                className="inline-block px-6 py-2.5 text-white font-semibold rounded-md text-sm transition-colors"
                style={{ backgroundColor: '#1B2A4A' }}
              >
                发送邮件
              </Link>
            </div>

            {/* Visit */}
            <div className="bg-white border border-gray-200 rounded-lg text-center px-6 py-8">
              <div
                className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center text-2xl"
                style={{ backgroundColor: '#F9FAFB', color: '#1B2A4A' }}
              >
                🏢
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-1">到访咨询</h3>
              <p className="text-gray-500 mb-4">
                {contact.address}
                <br />
                {contact.city}
              </p>
              <Link
                href={contact.mapUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block px-6 py-2.5 text-white font-semibold rounded-md text-sm transition-colors"
                style={{ backgroundColor: '#1B2A4A' }}
              >
                查看地图
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── Quick Contact Form ── */}
      <section className="py-[60px]" style={{ backgroundColor: '#F9FAFB' }}>
        <div className="max-w-[600px] mx-auto px-6">
          <SectionHeader
            label="快速联系"
            title="在线留言"
            subtitle="填写以下表格，我们将在24小时内回复您"
          />
          <ContactForm email={contact.email} />
        </div>
      </section>

      {/* ── Office Info ── */}
      <section className="bg-white py-[60px]">
        <div className="max-w-[1200px] mx-auto px-6">
          <SectionHeader label="办公信息" title="办公室地址与联系方式" />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left: contact details */}
            <div className="space-y-5">
              <div className="flex items-start gap-4">
                <span className="text-xl mt-0.5">📍</span>
                <div>
                  <div className="font-semibold text-gray-900 mb-1">办公地址</div>
                  <div className="text-gray-600 text-sm leading-relaxed">
                    {contact.address}
                    <br />
                    {contact.city}
                  </div>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <span className="text-xl mt-0.5">📞</span>
                <div>
                  <div className="font-semibold text-gray-900 mb-1">联系电话</div>
                  <Link href={contact.phoneTel} className="text-sm" style={{ color: '#1B2A4A' }}>
                    {contact.phone}
                  </Link>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <span className="text-xl mt-0.5">📧</span>
                <div>
                  <div className="font-semibold text-gray-900 mb-1">电子邮件</div>
                  <Link href={`mailto:${contact.email}`} className="text-sm" style={{ color: '#1B2A4A' }}>
                    {contact.email}
                  </Link>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <span className="text-xl mt-0.5">💬</span>
                <div>
                  <div className="font-semibold text-gray-900 mb-1">微信号</div>
                  <span className="text-gray-600 text-sm">{contact.wechat}</span>
                </div>
              </div>
            </div>

            {/* Right: Google Map */}
            <div className="rounded-lg overflow-hidden" style={{ minHeight: '300px' }}>
              <iframe
                src={`https://maps.google.com/maps?q=${encodeURIComponent(contact.address + ', ' + contact.city)}&t=m&z=15&output=embed`}
                width="100%"
                height="100%"
                style={{ border: 0, minHeight: '300px' }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Office Location"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ── Office Hours ── */}
      <section className="py-[60px]" style={{ backgroundColor: '#F9FAFB' }}>
        <div className="max-w-[600px] mx-auto px-6">
          <SectionHeader label="营业时间" title="办公时间" />
          <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
            {hours.map((row: any, i: number) => (
              <div
                key={i}
                className={`flex items-center justify-between px-6 py-4 ${
                  i < hours.length - 1 ? 'border-b border-gray-100' : ''
                } ${i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}
              >
                <span className="font-medium text-gray-900 text-sm">{row.day}</span>
                <span className="text-gray-600 text-sm">{row.time}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Service Areas ── */}
      <section className="bg-white py-[60px]">
        <div className="max-w-[800px] mx-auto px-6">
          <SectionHeader label="服务范围" title="服务区域" />
          <div className="text-center">
            <span
              className="inline-block px-5 py-2 rounded-full font-semibold text-sm mb-4"
              style={{ backgroundColor: '#1B2A4A', color: '#C9963B' }}
            >
              {serviceAreas.primary}
            </span>
            <div className="flex flex-wrap justify-center gap-2 mt-4">
              {serviceAreas.nearby.map((city: string, i: number) => (
                <span
                  key={i}
                  className="inline-block px-4 py-1.5 rounded-full text-sm border border-gray-200 text-gray-600 bg-gray-50"
                >
                  {city}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Emergency Notice ── */}
      <section className="py-[40px]">
        <div className="max-w-[800px] mx-auto px-6">
          <div
            className="rounded-lg p-6 flex items-start gap-4"
            style={{ backgroundColor: 'rgba(184, 55, 61, 0.08)', border: '1px solid rgba(184, 55, 61, 0.2)' }}
          >
            <span className="text-2xl flex-shrink-0">⚠️</span>
            <div>
              <h3 className="font-bold text-gray-900 mb-1">紧急情况？</h3>
              <p className="text-gray-700 text-sm leading-relaxed">
                {emergency.message}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Bottom CTA ── */}
      <section
        className="py-[60px]"
        style={{ background: 'linear-gradient(135deg, #1B2A4A 0%, #0F1A32 100%)' }}
      >
        <div className="max-w-[1200px] mx-auto px-6 text-center">
          <SectionHeader
            light
            title="准备好开始您的庇护申请了吗？"
            subtitle="立即联系正道移民服务中心，获取免费初次咨询"
          />
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/consultation"
              className="inline-block px-[36px] py-[16px] text-white font-semibold rounded-md transition-colors"
              style={{ backgroundColor: '#B8373D' }}
            >
              预约免费咨询
            </Link>
            <Link
              href={`mailto:${contact.email}`}
              className="inline-block px-[36px] py-[16px] font-semibold rounded-md border border-white text-white bg-transparent transition-colors"
            >
              发送邮件咨询
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
