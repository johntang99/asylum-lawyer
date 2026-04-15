import { Metadata } from 'next';
import Link from 'next/link';
import SectionHeader from '@/components/shared/SectionHeader';

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: '全美中文庇护律师在线咨询 | 宇律师事务所',
    description:
      '宇律师事务所提供全美50州远程庇护移民法律咨询。通过微信视频、Zoom或电话即可获得专业中文庇护律师服务。',
  };
}

const STEPS = [
  { num: '01', icon: '📅', title: '预约', desc: '在线填写表格或致电预约远程咨询时间' },
  { num: '02', icon: '💻', title: '视频咨询', desc: '通过微信视频或Zoom与律师面对面沟通' },
  { num: '03', icon: '📋', title: '案件评估', desc: '律师详细分析您的案件并制定策略方案' },
  { num: '04', icon: '⚖', title: '法律代理', desc: '签约后律师团队全程代理您的庇护申请' },
];

const PLATFORMS = [
  {
    icon: '💬',
    title: '微信视频',
    desc: '使用您最熟悉的微信进行视频咨询，无需下载额外软件。支持语音、视频和文字沟通。',
  },
  {
    icon: '🖥',
    title: 'Zoom 会议',
    desc: '通过Zoom进行高清视频咨询，支持屏幕共享以便律师实时查看和讲解您的案件材料。',
  },
  {
    icon: '📞',
    title: '电话咨询',
    desc: '如不方便视频，也可通过电话进行咨询。律师将通过电话详细了解您的情况并提供建议。',
  },
];

const STATES = [
  '加州', '纽约', '德州', '佛州', '伊利诺伊', '宾州',
  '俄亥俄', '乔治亚', '华盛顿', '马萨诸塞', '及全美其他各州',
];

export default async function RemoteConsultationPage({
  params,
}: {
  params: { locale: string };
}) {
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
        <div className="max-w-[1200px] mx-auto px-6 py-20 w-full text-center">
          <h1
            className="text-3xl md:text-[2.75rem] font-bold text-white mb-4 leading-tight"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            全美中文庇护律师在线咨询
          </h1>
          <p className="text-lg text-white/85 leading-relaxed max-w-[640px] mx-auto mb-8">
            无论您身在美国哪个州，都可以通过视频或电话获得专业的中文庇护移民法律服务。
          </p>
          <Link
            href={`/${params.locale}/consultation`}
            className="inline-block px-10 py-4 text-white font-semibold rounded-md transition-colors text-lg"
            style={{ backgroundColor: '#B8373D' }}
          >
            预约远程咨询
          </Link>
        </div>
      </section>

      {/* ── How It Works ── */}
      <section className="py-16 bg-white">
        <div className="max-w-[1200px] mx-auto px-6">
          <SectionHeader title="远程咨询流程" subtitle="四步即可获得专业法律服务" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-10">
            {STEPS.map((step, i) => (
              <div key={step.num} className="relative text-center p-6">
                <div
                  className="w-14 h-14 rounded-full flex items-center justify-center text-2xl mx-auto mb-4"
                  style={{ backgroundColor: 'rgba(27, 42, 74, 0.08)' }}
                >
                  {step.icon}
                </div>
                <div className="text-xs font-bold mb-2" style={{ color: '#D4AF37' }}>
                  STEP {step.num}
                </div>
                <h3 className="text-lg font-semibold mb-2" style={{ color: '#1B2A4A' }}>
                  {step.title}
                </h3>
                <p className="text-sm text-gray-600">{step.desc}</p>
                {i < STEPS.length - 1 && (
                  <div className="hidden lg:block absolute top-12 -right-3 text-gray-300 text-2xl">
                    →
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Coverage ── */}
      <section className="py-16" style={{ backgroundColor: '#F8F6F0' }}>
        <div className="max-w-[1200px] mx-auto px-6">
          <SectionHeader title="服务全美50州" subtitle="只要您在美国境内，我们都能为您提供服务" />
          <div className="mt-10 flex flex-col md:flex-row items-center gap-10">
            <div
              className="flex-1 min-h-[240px] rounded-lg flex items-center justify-center text-6xl"
              style={{ backgroundColor: 'rgba(27, 42, 74, 0.06)' }}
            >
              🇺🇸
            </div>
            <div className="flex-1">
              <p className="text-gray-700 mb-6 leading-relaxed">
                庇护案件属于联邦移民法范畴，律师可以代理全美任何州的客户。无论您身在纽约、德州还是其他任何州，宇律师事务所都能通过远程方式为您提供与面对面同等质量的法律服务。
              </p>
              <div className="flex flex-wrap gap-2">
                {STATES.map((state) => (
                  <span
                    key={state}
                    className="px-3 py-1 rounded-full text-sm font-medium"
                    style={{ backgroundColor: 'rgba(27, 42, 74, 0.08)', color: '#1B2A4A' }}
                  >
                    {state}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Technology / Platforms ── */}
      <section className="py-16 bg-white">
        <div className="max-w-[1200px] mx-auto px-6">
          <SectionHeader title="多种咨询方式" subtitle="选择您最方便的沟通方式" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10">
            {PLATFORMS.map((p) => (
              <div
                key={p.title}
                className="p-6 rounded-lg border border-gray-200 hover:border-[#D4AF37] hover:shadow-md transition-all text-center"
              >
                <div className="text-4xl mb-4">{p.icon}</div>
                <h3 className="text-lg font-semibold mb-3" style={{ color: '#1B2A4A' }}>
                  {p.title}
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed">{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Same Quality Promise ── */}
      <section className="py-14" style={{ backgroundColor: '#F8F6F0' }}>
        <div className="max-w-[800px] mx-auto px-6 text-center">
          <h2
            className="text-2xl font-bold mb-4"
            style={{ color: '#1B2A4A', fontFamily: 'var(--font-heading)' }}
          >
            远程咨询 = 同等专业质量
          </h2>
          <p className="text-gray-700 leading-relaxed mb-6">
            我们的远程咨询服务与面对面咨询完全相同的专业标准。律师会详细了解您的案件背景，
            分析法律依据，制定最佳策略，并全程中文沟通确保您充分理解每一个环节。
            多年来，我们已通过远程方式成功帮助全美各地的华人客户获得庇护批准。
          </p>
          <div className="flex flex-wrap justify-center gap-6 text-sm text-gray-600">
            <span className="flex items-center gap-2">✅ 全程中文服务</span>
            <span className="flex items-center gap-2">✅ 同等专业标准</span>
            <span className="flex items-center gap-2">✅ 文件安全传输</span>
            <span className="flex items-center gap-2">✅ 灵活预约时间</span>
          </div>
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
            立即预约远程咨询
          </h2>
          <p className="text-white/80 mb-8">
            无需出门，即可获得洛杉矶专业庇护律师的法律服务。首次咨询免费。
          </p>
          <Link
            href={`/${params.locale}/consultation`}
            className="inline-block px-10 py-4 text-white font-semibold rounded-md transition-colors text-lg"
            style={{ backgroundColor: '#B8373D' }}
          >
            预约远程咨询
          </Link>
        </div>
      </section>
    </main>
  );
}
