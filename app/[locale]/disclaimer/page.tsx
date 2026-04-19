import { Metadata } from 'next';
import Link from 'next/link';

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: '法律免责声明 | 正道移民服务中心',
    description:
      '正道移民服务中心法律免责声明，请在使用本网站和法律服务前仔细阅读。',
  };
}

export default async function DisclaimerPage() {
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
            法律免责声明
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
            <span className="text-gray-900">法律免责声明</span>
          </nav>
        </div>
      </div>

      {/* ── Content ── */}
      <section className="bg-white py-[60px]">
        <div className="max-w-[800px] mx-auto px-6">
          {/* Important notice box */}
          <div
            className="rounded-lg p-6 mb-10"
            style={{
              backgroundColor: 'rgba(184, 55, 61, 0.06)',
              border: '1px solid rgba(184, 55, 61, 0.2)',
            }}
          >
            <p className="text-gray-800 font-semibold text-[15px] leading-relaxed">
              重要提示：请在使用本网站或联系本所之前仔细阅读以下免责声明。使用本网站即表示您已阅读、理解并同意本免责声明的全部条款。
            </p>
          </div>

          <div className="prose prose-gray max-w-none text-gray-700 leading-[1.9] text-[15px] space-y-8">
            {/* 信息不构成法律意见 */}
            <div>
              <h2
                className="text-xl font-bold text-gray-900 mb-4"
                style={{ fontFamily: 'var(--font-heading)' }}
              >
                一、信息不构成法律意见
              </h2>
              <p>
                本网站上发布的所有信息、文章、常见问题解答及其他内容仅供一般性信息参考之用，不构成法律意见，也不应被理解为针对任何具体法律问题的专业建议。美国移民法律（特别是庇护法）是高度复杂且不断变化的法律领域，网站上提供的一般性信息可能不适用于您的具体情况。
              </p>
              <p className="mt-3">
                阅读本网站上的内容不能替代向合格的执业律师寻求专业的法律咨询。在做出任何与您的移民身份相关的重要决定之前，我们强烈建议您咨询有资质的移民律师，获取针对您个案情况的专业意见。法律规定和政策可能随时发生变化，本网站上的信息可能未及时反映最新的法律动态。
              </p>
            </div>

            {/* 不建立律师-客户关系 */}
            <div>
              <h2
                className="text-xl font-bold text-gray-900 mb-4"
                style={{ fontFamily: 'var(--font-heading)' }}
              >
                二、不建立律师-客户关系
              </h2>
              <p>
                仅通过浏览本网站、发送电子邮件、填写在线咨询表格、拨打电话或通过微信等方式联系本所，并不会在您与正道移民服务中心之间建立律师-客户关系。律师-客户关系仅在您与本所签署正式的委托代理协议（Retainer Agreement）并完成相关程序后才正式建立。
              </p>
              <p className="mt-3">
                在律师-客户关系正式建立之前，请勿通过电子邮件、网站表格或其他不安全的渠道向本所发送任何机密或敏感信息。未经聘用的通信不受律师-客户保密特权的保护。
              </p>
            </div>

            {/* 结果不保证 */}
            <div>
              <h2
                className="text-xl font-bold text-gray-900 mb-4"
                style={{ fontFamily: 'var(--font-heading)' }}
              >
                三、结果不保证
              </h2>
              <p>
                本网站上提及的任何过往案件结果、客户评价或成功案例仅供参考，不构成对未来结果的保证或暗示。每个庇护案件都基于其独特的事实和情况，过去的成功并不保证在类似案件中取得相同的结果。移民法律的适用、政府政策的变化、审理官员的自由裁量权等因素都可能影响案件结果。
              </p>
              <p className="mt-3">
                根据加利福尼亚州律师职业行为规则，任何律师或律师事务所都不应保证特定的法律结果。本所严格遵守这一职业道德标准，不会对任何案件的结果做出承诺或保证。
              </p>
            </div>

            {/* 管辖权说明 */}
            <div>
              <h2
                className="text-xl font-bold text-gray-900 mb-4"
                style={{ fontFamily: 'var(--font-heading)' }}
              >
                四、管辖权说明
              </h2>
              <p>
                正道移民服务中心是一家在美国加利福尼亚州注册的律师事务所，本所律师获准在加利福尼亚州执业。联邦移民法案件不受州执业限制，本所可以代理全美各州的联邦移民案件。但本网站不构成在任何司法管辖区内要求提供法律服务的邀请。在某些司法管辖区，本网站上的内容可能被视为律师广告，须受当地律师广告规则的约束。
              </p>
            </div>

            {/* 保密义务说明 */}
            <div>
              <h2
                className="text-xl font-bold text-gray-900 mb-4"
                style={{ fontFamily: 'var(--font-heading)' }}
              >
                五、保密义务说明
              </h2>
              <p>
                一旦律师-客户关系正式建立，本所将严格遵守律师职业道德规范中关于客户信息保密的义务。您在委托代理过程中向本所披露的所有信息将受到律师-客户保密特权的保护，未经您的书面同意或法律要求，本所不会向任何第三方披露。
              </p>
              <p className="mt-3">
                但请注意，在律师-客户关系建立之前，通过本网站、电子邮件或社交媒体等公共或半公共渠道发送的信息可能不受保密特权的保护。因此，在正式聘用律师之前，请避免通过这些渠道分享详细的案件事实或敏感的个人信息。
              </p>
              <p className="mt-3">
                如果您对本免责声明有任何疑问，或希望咨询您的庇护移民案件，请通过本网站的联系页面或发送邮件至 yuxiaris@gmail.com 与我们联系，安排初次免费咨询。
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
