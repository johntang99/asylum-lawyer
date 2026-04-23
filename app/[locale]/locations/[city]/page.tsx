import { Metadata } from 'next';
import Link from 'next/link';
import { locationsData, allCitySlugs } from '@/lib/locations-data';
import SectionHeader from '@/components/shared/SectionHeader';

/* eslint-disable @typescript-eslint/no-explicit-any */

const SERVICES = [
  { icon: '🛡', title: '政治庇护', slug: 'political-asylum', desc: '因政治观点受迫害的庇护申请' },
  { icon: '✝️', title: '宗教庇护', slug: 'religious-asylum', desc: '因宗教信仰受迫害的庇护申请' },
  { icon: '📋', title: '庇护申请', slug: 'asylum-application', desc: 'I-589表格准备与提交' },
  { icon: '🎤', title: '面谈准备', slug: 'asylum-interview', desc: '庇护面谈模拟与策略指导' },
  { icon: '⚖', title: '法庭代理', slug: 'court-representation', desc: '移民法庭听证与上诉代理' },
  { icon: '🔄', title: '身份调整', slug: 'status-adjustment', desc: '庇护获批后的绿卡申请' },
];

export function generateStaticParams() {
  return allCitySlugs.map((city) => ({ city }));
}

export async function generateMetadata({
  params,
}: {
  params: { locale: string; city: string };
}): Promise<Metadata> {
  const data = locationsData[params.city];
  if (!data) {
    return { title: '页面未找到' };
  }
  return {
    title: data.seo.title,
    description: data.seo.description,
  };
}

export default async function NearLocationPage({
  params,
}: {
  params: { locale: string; city: string };
}) {
  const data = locationsData[params.city];

  if (!data) {
    return (
      <main className="min-h-screen flex items-center justify-center" style={{ marginTop: '72px' }}>
        <p className="text-lg text-gray-600">未找到该城市的信息。</p>
      </main>
    );
  }

  return (
    <main>
      {/* ── Hero ── */}
      <section
        className="flex items-center"
        style={{
          marginTop: '72px',
          background: 'linear-gradient(135deg, #1B2A4A 0%, #0F1A32 100%)',
        }}
      >
        <div className="max-w-[1200px] mx-auto px-6 py-16 w-full">
          <h1
            className="text-3xl md:text-4xl font-bold text-white mb-4 leading-tight"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            {data.h1}
          </h1>
          <p className="text-base md:text-lg text-white/85 leading-relaxed mb-6 max-w-[700px]">
            {data.intro}
          </p>
          <span
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium"
            style={{ backgroundColor: 'rgba(184, 150, 56, 0.2)', color: '#D4AF37' }}
          >
            📍 {data.distance}
          </span>
        </div>
      </section>

      {/* ── Core Services ── */}
      <section className="py-16 bg-white">
        <div className="max-w-[1200px] mx-auto px-6">
          <SectionHeader title="我们的庇护移民服务" subtitle="为您提供全方位的专业法律支持" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-10">
            {SERVICES.map((svc) => (
              <Link
                key={svc.slug}
                href={`/${params.locale}/services/${svc.slug}`}
                className="block p-6 rounded-lg border border-gray-200 hover:border-[#D4AF37] hover:shadow-md transition-all"
              >
                <div className="text-3xl mb-3">{svc.icon}</div>
                <h3 className="text-lg font-semibold mb-2" style={{ color: '#1B2A4A' }}>
                  {svc.title}
                </h3>
                <p className="text-sm text-gray-600">{svc.desc}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── NAP Block ── */}
      <section className="py-12" style={{ backgroundColor: '#F8F6F0' }}>
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-8">
            <div className="flex-1">
              <h2
                className="text-2xl font-bold mb-3"
                style={{ color: '#1B2A4A', fontFamily: 'var(--font-heading)' }}
              >
                宇霞移民服务中心
              </h2>
              <p className="text-gray-700 mb-1">📍 1045 E. Valley Blvd., #A115, Rm 6, San Gabriel, CA 91776</p>
              <p className="text-gray-700 mb-1">📧 yuxiaris@gmail.com</p>
              <p className="text-gray-700">📧 info@zhangasylumlaw.com</p>
            </div>
            <div className="flex-shrink-0">
              <Link
                href={`/${params.locale}/consultation`}
                className="inline-block px-8 py-3 text-white font-semibold rounded-md transition-colors"
                style={{ backgroundColor: '#B8373D' }}
              >
                预约咨询
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── Testimonial ── */}
      <section className="py-14 bg-white">
        <div className="max-w-[800px] mx-auto px-6 text-center">
          <div className="text-4xl mb-4" style={{ color: '#D4AF37' }}>&ldquo;</div>
          <blockquote className="text-lg text-gray-700 italic leading-relaxed mb-4">
            律师团队非常专业，从案件评估到最终获批，全程中文沟通让我们感到安心。他们对庇护法的深刻理解和耐心指导让我们顺利通过了面谈。
          </blockquote>
          <p className="text-sm font-medium" style={{ color: '#1B2A4A' }}>
            — 王先生，{data.cityZH}居民，政治庇护案件
          </p>
        </div>
      </section>

      {/* ── CTA ── */}
      <section
        className="py-14"
        style={{ background: 'linear-gradient(135deg, #1B2A4A 0%, #0F1A32 100%)' }}
      >
        <div className="max-w-[800px] mx-auto px-6 text-center">
          <h2
            className="text-2xl md:text-3xl font-bold text-white mb-4"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            为{data.cityZH}华人社区提供专业庇护法律服务
          </h2>
          <p className="text-white/80 mb-8">
            无论您身在{data.cityZH}还是洛杉矶周边地区，我们都能为您提供专业的中文庇护移民法律服务。
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href={`/${params.locale}/consultation`}
              className="inline-block px-8 py-3 text-white font-semibold rounded-md transition-colors"
              style={{ backgroundColor: '#B8373D' }}
            >
              预约咨询
            </Link>
            <Link
              href={`/${params.locale}/asylum-lawyer-los-angeles`}
              className="inline-block px-8 py-3 font-semibold rounded-md border border-white/40 text-white hover:bg-white/10 transition-colors"
            >
              查看洛杉矶总部服务页面
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
