import { Metadata } from 'next';
import Link from 'next/link';

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: '客户评价 | 宇律师事务所',
    description:
      '查看宇律师事务所庇护移民案件客户的真实评价与反馈，了解我们如何帮助客户成功获得庇护身份。',
  };
}

/* ── Testimonial Data ── */

interface Testimonial {
  stars: number;
  quote: string;
  name: string;
  caseType: string;
  year: string;
}

const testimonials: Testimonial[] = [
  {
    stars: 5,
    quote:
      '宇律师非常专业和耐心。从最初的咨询到最终获批，每一步都解释得非常清楚。我的庇护面谈准备得很充分，面谈后两周就收到了批准通知。非常感谢宇律师团队！',
    name: '王先生',
    caseType: '政治庇护',
    year: '2024',
  },
  {
    stars: 5,
    quote: '强烈推荐！宇律师帮我在移民法庭上成功获得了庇护。整个过程虽然漫长，但律师一直陪伴和支持我。',
    name: '李女士',
    caseType: '防御性庇护',
    year: '2024',
  },
  {
    stars: 5,
    quote:
      '我的案件比较复杂，之前咨询过其他律师都被拒绝代理。宇律师仔细分析了我的情况，制定了详细的策略，最终帮助我成功获得了庇护批准。从准备个人声明到面谈辅导，每一个环节都做得非常到位。',
    name: '陈先生',
    caseType: '主动庇护',
    year: '2024',
  },
  {
    stars: 5,
    quote: '面谈准备非常充分，宇律师和团队帮我做了三次模拟面谈。正式面谈时我感到很有信心。',
    name: '赵女士',
    caseType: '恐惧面谈',
    year: '2023',
  },
  {
    stars: 5,
    quote:
      '宇律师事务所在处理I-589申请方面经验丰富。他们帮我收集和整理了所有必要的证据材料，个人声明写得非常详尽有力。我的案件在面谈后很快就获得了批准。价格也很合理，还提供分期付款。',
    name: '黄先生',
    caseType: 'I-589',
    year: '2024',
  },
  {
    stars: 5,
    quote: '非常感谢宇律师帮我成功获得了庇护工卡。终于可以合法工作了，感觉生活有了新的希望。',
    name: '刘女士',
    caseType: '庇护工卡',
    year: '2023',
  },
  {
    stars: 5,
    quote:
      '宇律师的中文沟通能力让我感到很安心。整个庇护申请过程中不存在语言障碍，每个法律概念都解释得通俗易懂。律师团队的响应速度也很快，微信上有问题通常当天就能得到回复。',
    name: '周先生',
    caseType: '政治庇护',
    year: '2024',
  },
  {
    stars: 4,
    quote: '案件处理时间比预期长了一些，但最终结果非常满意。宇律师一直保持沟通，让我了解进展情况。',
    name: '吴女士',
    caseType: '主动庇护',
    year: '2023',
  },
  {
    stars: 5,
    quote:
      '我是通过朋友推荐找到宇律师事务所的。从第一次免费咨询就感受到了专业和真诚。宇律师详细分析了我的案情，指出了优势和需要加强的地方，并帮我制定了完整的申请策略。最终结果证明选择宇律师是正确的决定。',
    name: '孙先生',
    caseType: '政治庇护',
    year: '2024',
  },
  {
    stars: 5,
    quote: '绿卡申请顺利通过！从庇护获批到拿到绿卡，宇律师全程负责，非常省心。',
    name: '杨女士',
    caseType: '庇护绿卡',
    year: '2024',
  },
  {
    stars: 5,
    quote:
      '我的可信恐惧面谈在宇律师的帮助下顺利通过了。在被拘留期间，宇律师通过电话和视频为我做了充分的准备。她的专业知识和耐心帮助让我在面谈中能够清晰、完整地表达我的恐惧和经历。',
    name: '马先生',
    caseType: '恐惧面谈',
    year: '2023',
  },
  {
    stars: 5,
    quote: '宇律师团队效率很高，文件准备非常细致。面谈只用了一个小时就结束了，很快就收到了好消息。',
    name: '林女士',
    caseType: 'I-589',
    year: '2024',
  },
  {
    stars: 5,
    quote:
      '作为一名来自宗教少数群体的申请人，我的案件需要特别的法律论证。宇律师对相关法律和先例案件非常熟悉，准备了详尽的法律备忘录。她不仅是我的律师，更像是一位可以信赖的朋友。庇护获批的那一天，我激动得几乎说不出话来。',
    name: '何先生',
    caseType: '主动庇护',
    year: '2023',
  },
  {
    stars: 5,
    quote: '防御性庇护成功！在法庭上宇律师的表现非常专业，法官对我们的证据材料印象深刻。',
    name: '郑女士',
    caseType: '防御性庇护',
    year: '2024',
  },
  {
    stars: 5,
    quote:
      '宇律师帮助我全家获得了庇护身份，包括我的妻子和两个孩子。整个过程中律师团队非常贴心，考虑到了每一个细节。现在我们一家人可以安心地在美国生活了。费用方面也提供了灵活的分期方案，减轻了我们的经济压力。',
    name: '胡先生',
    caseType: '政治庇护',
    year: '2024',
  },
  {
    stars: 5,
    quote: '工卡续签很顺利，宇律师提前提醒我准备材料，避免了工卡过期的问题。服务很周到。',
    name: '谢女士',
    caseType: '庇护工卡',
    year: '2024',
  },
  {
    stars: 5,
    quote:
      '我的庇护案件之前被另一位律师搞砸了，宇律师接手后重新整理了所有材料，补充了关键证据，最终在上诉中帮我翻转了拒绝决定。如果不是宇律师的专业和坚持，我可能已经被驱逐出境了。',
    name: '徐先生',
    caseType: '防御性庇护',
    year: '2023',
  },
  {
    stars: 5,
    quote: '从咨询到获批只用了八个月。宇律师的效率和专业程度都超出了我的预期。真心推荐！',
    name: '宋女士',
    caseType: '主动庇护',
    year: '2024',
  },
  {
    stars: 5,
    quote:
      '宇律师事务所的团队配合非常默契。律师负责法律策略，助理帮忙整理文件和跟进进度，前台小姐姐也很热情友好。每次去律所都感到很安心。我的庇护绿卡已经顺利拿到，感谢整个团队的付出。',
    name: '韩先生',
    caseType: '庇护绿卡',
    year: '2024',
  },
  {
    stars: 5,
    quote: '宇律师帮我成功通过了二次面谈。第一次面谈因为准备不足被要求补充材料，换了宇律师后一切顺利。',
    name: '冯女士',
    caseType: 'I-589',
    year: '2023',
  },
];

function StarRating({ count }: { count: number }) {
  return (
    <span className="text-lg" style={{ color: '#C9963B' }}>
      {Array.from({ length: count }, () => '\u2605').join('')}
      {Array.from({ length: 5 - count }, () => '\u2606').join('')}
    </span>
  );
}

export default async function TestimonialsPage() {
  /* Split testimonials into 3 columns for masonry effect */
  const cols: Testimonial[][] = [[], [], []];
  testimonials.forEach((t, i) => {
    cols[i % 3].push(t);
  });

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
            客户评价
          </h1>
          <p className="text-white/70 text-lg max-w-[600px] mx-auto">
            听听我们的客户如何评价宇律师事务所的庇护法律服务
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
            <span className="text-gray-900">客户评价</span>
          </nav>
        </div>
      </div>

      {/* ── Aggregate Rating ── */}
      <section className="bg-white py-10 border-b border-gray-100">
        <div className="max-w-[1200px] mx-auto px-6 text-center">
          <div className="inline-flex flex-col items-center">
            <span
              className="text-5xl font-bold mb-2"
              style={{ color: '#1B2A4A', fontFamily: 'var(--font-heading)' }}
            >
              4.9
            </span>
            <span className="text-2xl mb-2" style={{ color: '#C9963B' }}>
              ★★★★★
            </span>
            <span className="text-gray-500 text-sm">基于 50+ 客户评价</span>
          </div>
        </div>
      </section>

      {/* ── Masonry Testimonial Wall ── */}
      <section className="py-[60px]" style={{ backgroundColor: '#F9FAFB' }}>
        <div className="max-w-[1200px] mx-auto px-6">
          {/* 3-col desktop, 2-col tablet, 1-col mobile */}
          <div className="columns-1 md:columns-2 lg:columns-3 gap-6 [column-fill:_balance]">
            {testimonials.map((t, i) => (
              <div
                key={i}
                className="break-inside-avoid mb-6 bg-white border border-gray-200 rounded-lg p-6"
                style={{ borderLeft: '3px solid #C9963B' }}
              >
                <div className="mb-3">
                  <StarRating count={t.stars} />
                </div>
                <p className="text-gray-700 italic leading-relaxed mb-4 text-[15px]">
                  &ldquo;{t.quote}&rdquo;
                </p>
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-semibold flex-shrink-0"
                    style={{ backgroundColor: '#1B2A4A' }}
                  >
                    {t.name.charAt(0)}
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900 text-sm">
                      {t.name}
                    </div>
                    <div className="text-xs text-gray-500">
                      {t.caseType} · {t.year}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section
        className="py-[60px]"
        style={{
          background: 'linear-gradient(135deg, #1B2A4A 0%, #0F1A32 100%)',
        }}
      >
        <div className="max-w-[700px] mx-auto px-6 text-center">
          <h2
            className="text-2xl lg:text-3xl font-bold text-white mb-4"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            开始您的案件评估
          </h2>
          <p className="text-white/75 mb-8 leading-relaxed">
            免费初次咨询，让我们了解您的情况并制定专属方案
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/consultation"
              className="inline-block px-[36px] py-[16px] text-white font-semibold rounded-md transition-colors"
              style={{ backgroundColor: '#B8373D' }}
            >
              预约免费咨询
            </Link>
            <Link
              href="/contact"
              className="inline-block px-[36px] py-[16px] font-semibold rounded-md border border-white text-white bg-transparent transition-colors"
            >
              联系我们
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
