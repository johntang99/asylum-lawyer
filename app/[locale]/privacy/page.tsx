import { Metadata } from 'next';
import Link from 'next/link';

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: '隐私政策 | 正道移民服务中心',
    description:
      '正道移民服务中心隐私政策，说明我们如何收集、使用和保护您的个人信息。',
  };
}

export default async function PrivacyPage() {
  return (
    <>
      {/* ── Compact Hero ── */}
      <section
        className="flex items-center"
        style={{
          marginTop: '72px',
          minHeight: '280px',
          background: 'linear-gradient(135deg, #1B2A4A 0%, #0F1A32 100%)',
        }}
      >
        <div className="max-w-[1200px] mx-auto px-6 py-16 w-full text-center">
          <h1
            className="text-[2.5rem] font-bold text-white mb-3 leading-tight"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            隐私政策
          </h1>
          <p className="text-white/70 text-lg">
            最后更新日期：2024年12月1日
          </p>
        </div>
      </section>

      {/* ── Breadcrumbs ── */}
      <div className="bg-gray-50 border-b border-gray-200">
        <div className="max-w-[1200px] mx-auto px-6 py-3">
          <nav className="text-sm text-gray-500">
            <Link href="/" className="hover:text-gray-700 transition-colors">
              首页
            </Link>
            <span className="mx-2">/</span>
            <span className="text-gray-900">隐私政策</span>
          </nav>
        </div>
      </div>

      {/* ── Content ── */}
      <section className="bg-white py-[60px]">
        <div className="max-w-[800px] mx-auto px-6">
          <div className="prose prose-gray max-w-none text-gray-700 leading-[1.9] text-[15px] space-y-8">
            {/* 信息收集 */}
            <div>
              <h2
                className="text-xl font-bold text-gray-900 mb-4"
                style={{ fontFamily: 'var(--font-heading)' }}
              >
                一、信息收集
              </h2>
              <p>
                正道移民服务中心（以下简称"本所"或"我们"）尊重每位访客和客户的隐私。当您访问我们的网站、填写在线咨询表格、通过电话或微信联系我们、或使用我们的法律服务时，我们可能会收集以下类型的个人信息：
              </p>
              <ul className="list-disc pl-6 space-y-1 mt-3">
                <li>个人身份信息：姓名、电话号码、电子邮件地址、微信号、通讯地址</li>
                <li>案件相关信息：移民身份、入境日期、庇护申请相关的背景信息</li>
                <li>技术信息：IP地址、浏览器类型、设备信息、访问时间和页面浏览记录</li>
                <li>通讯记录：您与本所之间的电子邮件、消息和通话记录</li>
              </ul>
              <p className="mt-3">
                我们仅在您自愿提供或为提供法律服务所必需的情况下收集个人信息。您可以选择不提供某些信息，但这可能会影响我们为您提供服务的能力。
              </p>
            </div>

            {/* 信息使用 */}
            <div>
              <h2
                className="text-xl font-bold text-gray-900 mb-4"
                style={{ fontFamily: 'var(--font-heading)' }}
              >
                二、信息使用
              </h2>
              <p>我们收集的个人信息将用于以下目的：</p>
              <ul className="list-disc pl-6 space-y-1 mt-3">
                <li>评估您的法律需求并提供初步咨询</li>
                <li>准备和处理您的庇护申请及相关法律文件</li>
                <li>与政府机构（如USCIS、移民法庭）进行必要的沟通</li>
                <li>就您的案件进展与您保持联系</li>
                <li>改善我们的网站功能和用户体验</li>
                <li>遵守适用的法律法规和职业道德规范</li>
              </ul>
              <p className="mt-3">
                我们不会出于营销目的向第三方出售、出租或分享您的个人信息。在没有您明确同意的情况下，我们不会将您的信息用于与提供法律服务无关的目的。
              </p>
            </div>

            {/* 信息保护 */}
            <div>
              <h2
                className="text-xl font-bold text-gray-900 mb-4"
                style={{ fontFamily: 'var(--font-heading)' }}
              >
                三、信息保护
              </h2>
              <p>
                本所采取合理的技术和组织措施来保护您的个人信息免遭未经授权的访问、使用、修改或披露。这些措施包括但不限于：
              </p>
              <ul className="list-disc pl-6 space-y-1 mt-3">
                <li>使用SSL/TLS加密技术保护网站上的数据传输</li>
                <li>对存储的客户文件实施访问控制和加密保护</li>
                <li>定期对员工进行数据安全和隐私保护培训</li>
                <li>遵守律师职业道德规范中关于客户信息保密的要求</li>
              </ul>
              <p className="mt-3">
                作为执业律师事务所，我们还受到律师-客户保密特权（Attorney-Client Privilege）的约束，这为您与本所之间的通讯提供了额外的法律保护层。尽管我们采取了各种安全措施，但互联网传输和电子存储并非百分之百安全，我们无法保证绝对的信息安全。
              </p>
            </div>

            {/* Cookie使用 */}
            <div>
              <h2
                className="text-xl font-bold text-gray-900 mb-4"
                style={{ fontFamily: 'var(--font-heading)' }}
              >
                四、Cookie使用
              </h2>
              <p>
                我们的网站使用Cookie和类似技术来增强您的浏览体验。Cookie是存储在您设备上的小型文本文件，用于记住您的偏好设置和分析网站流量。我们使用的Cookie包括：
              </p>
              <ul className="list-disc pl-6 space-y-1 mt-3">
                <li>必要性Cookie：确保网站核心功能正常运行</li>
                <li>分析Cookie：帮助我们了解访客如何使用网站，以便改善网站性能</li>
                <li>偏好Cookie：记住您的语言选择和其他设置</li>
              </ul>
              <p className="mt-3">
                您可以通过浏览器设置管理或禁用Cookie。禁用Cookie可能会影响网站的某些功能。继续使用本网站即表示您同意我们使用Cookie。
              </p>
            </div>

            {/* 第三方链接 */}
            <div>
              <h2
                className="text-xl font-bold text-gray-900 mb-4"
                style={{ fontFamily: 'var(--font-heading)' }}
              >
                五、第三方链接
              </h2>
              <p>
                本网站可能包含指向第三方网站的链接，例如美国公民及移民服务局（USCIS）、移民法庭（EOIR）或其他政府和法律资源网站。这些第三方网站有各自的隐私政策，我们对其内容和隐私实践不承担责任。我们建议您在访问这些网站时查阅其各自的隐私政策。
              </p>
            </div>

            {/* 联系方式 */}
            <div>
              <h2
                className="text-xl font-bold text-gray-900 mb-4"
                style={{ fontFamily: 'var(--font-heading)' }}
              >
                六、联系方式
              </h2>
              <p>
                如果您对本隐私政策有任何疑问、意见或请求，或希望行使您的数据隐私权利（包括访问、更正或删除您的个人信息），请通过以下方式联系我们：
              </p>
              <div className="mt-3 bg-gray-50 rounded-lg p-5 text-sm">
                <p className="font-semibold text-gray-900">正道移民服务中心</p>
                <p>地址：1045 E. Valley Blvd., #A115, Rm 6, San Gabriel, CA 91776</p>
                <p>邮箱：yuxiaris@gmail.com</p>
              </div>
              <p className="mt-4">
                本所保留随时修改本隐私政策的权利。任何重大变更将在本网站上公布并注明更新日期。我们建议您定期查阅本政策以了解最新的隐私保护措施。
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
