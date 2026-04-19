import { Metadata } from 'next';
import Link from 'next/link';

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: '使用条款 | 正道移民服务中心',
    description:
      '正道移民服务中心网站使用条款，请在使用本网站前仔细阅读。',
  };
}

export default async function TermsPage() {
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
            使用条款
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
            <span className="text-gray-900">使用条款</span>
          </nav>
        </div>
      </div>

      {/* ── Content ── */}
      <section className="bg-white py-[60px]">
        <div className="max-w-[800px] mx-auto px-6">
          <div className="prose prose-gray max-w-none text-gray-700 leading-[1.9] text-[15px] space-y-8">
            {/* 网站使用 */}
            <div>
              <h2
                className="text-xl font-bold text-gray-900 mb-4"
                style={{ fontFamily: 'var(--font-heading)' }}
              >
                一、网站使用
              </h2>
              <p>
                欢迎访问正道移民服务中心网站（以下简称"本网站"）。使用本网站即表示您同意遵守以下使用条款。如果您不同意这些条款，请勿使用本网站。
              </p>
              <p className="mt-3">
                本网站提供的信息仅供一般性参考，旨在帮助公众了解美国庇护移民法律的基本知识。网站上的内容不构成法律意见，也不应被视为针对您具体案件的法律建议。每个移民案件都有其独特的事实和情况，需要由执业律师根据具体情况提供个性化的法律意见。
              </p>
              <p className="mt-3">
                您同意不以任何非法目的或违反这些条款的方式使用本网站。您不得尝试未经授权访问本网站的任何部分、相关系统或网络，也不得使用自动化工具抓取或复制本网站的内容。
              </p>
            </div>

            {/* 知识产权 */}
            <div>
              <h2
                className="text-xl font-bold text-gray-900 mb-4"
                style={{ fontFamily: 'var(--font-heading)' }}
              >
                二、知识产权
              </h2>
              <p>
                本网站上的所有内容，包括但不限于文字、图片、图形、标识、按钮图标、音视频材料、数据编辑和软件，均为正道移民服务中心或其内容提供者的财产，受美国和国际版权法、商标法及其他知识产权法律的保护。
              </p>
              <p className="mt-3">
                未经本所事先书面同意，您不得以任何形式复制、修改、分发、展示、传输或创建本网站内容的衍生作品。您可以出于个人、非商业目的下载或打印本网站上的少量页面，但必须保留所有版权和其他所有权声明。
              </p>
            </div>

            {/* 免责声明 */}
            <div>
              <h2
                className="text-xl font-bold text-gray-900 mb-4"
                style={{ fontFamily: 'var(--font-heading)' }}
              >
                三、免责声明
              </h2>
              <p>
                本网站及其内容按"原样"和"可获得"的基础提供，不做任何明示或暗示的保证。本所不保证网站内容的准确性、完整性、及时性或适用性。浏览本网站或通过网站联系本所不会建立律师-客户关系。律师-客户关系仅在双方签署正式的委托代理协议后才正式建立。
              </p>
              <p className="mt-3">
                在法律允许的最大范围内，本所不对因使用或无法使用本网站而产生的任何直接、间接、附带、特殊或后果性损害承担责任，包括但不限于因信赖网站上的信息而导致的损失。
              </p>
            </div>

            {/* 适用法律 */}
            <div>
              <h2
                className="text-xl font-bold text-gray-900 mb-4"
                style={{ fontFamily: 'var(--font-heading)' }}
              >
                四、适用法律
              </h2>
              <p>
                本使用条款受美国加利福尼亚州法律管辖并依其解释，不考虑法律冲突原则。因本条款引起或与之相关的任何争议，双方同意接受位于加利福尼亚州洛杉矶县的州或联邦法院的专属管辖权。
              </p>
            </div>

            {/* 争议解决 */}
            <div>
              <h2
                className="text-xl font-bold text-gray-900 mb-4"
                style={{ fontFamily: 'var(--font-heading)' }}
              >
                五、争议解决
              </h2>
              <p>
                如因本使用条款或与本网站相关的任何事项产生争议，双方应首先尝试通过友好协商解决。如果协商不能解决争议，任何一方均可将争议提交至加利福尼亚州洛杉矶县的有管辖权的法院进行裁决。
              </p>
              <p className="mt-3">
                本所保留随时修改本使用条款的权利，修改后的条款将在本网站上公布并即时生效。您继续使用本网站即表示您接受修改后的条款。如有任何疑问，请通过本网站的联系方式与我们联系。
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
