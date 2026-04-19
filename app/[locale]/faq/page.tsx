import { Metadata } from 'next';
import Link from 'next/link';
import FaqAccordion from '@/components/shared/FaqAccordion';

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: '常见问题 | 正道移民服务中心',
    description:
      '关于美国庇护申请的常见问题解答，涵盖庇护基础知识、申请流程、面谈准备、常见风险及后续身份等。',
  };
}

/* ── FAQ Data ── */

interface FaqItem {
  question: string;
  answer: string;
}

interface FaqCategory {
  id: string;
  label: string;
  questions: FaqItem[];
}

const faqCategories: FaqCategory[] = [
  {
    id: 'basics',
    label: '庇护基础知识',
    questions: [
      {
        question: '什么是美国庇护（Asylum）？',
        answer:
          '庇护是美国政府为那些因种族、宗教、国籍、特定社会团体成员身份或政治观点而遭受迫害或有合理恐惧遭受迫害的外国人提供的一种保护形式。获得庇护身份后，您可以合法留在美国、获得工作许可，并在一年后申请绿卡。',
      },
      {
        question: '庇护申请有截止日期吗？',
        answer:
          '一般情况下，您必须在抵达美国后一年内提交庇护申请（I-589表格）。但存在一些例外情况，例如情况发生了重大变化（changed circumstances）或存在特殊情况（extraordinary circumstances）导致延误。建议您尽早咨询律师，以免错过申请窗口。',
      },
      {
        question: '主动庇护和防御性庇护有什么区别？',
        answer:
          '主动庇护（Affirmative Asylum）是指您主动向美国公民及移民服务局（USCIS）提出申请，由庇护官员进行面谈审理。防御性庇护（Defensive Asylum）是指您在被置于驱逐程序中后，在移民法庭上向移民法官提出庇护申请作为抗辩。两种途径的法律标准相同，但程序和审理机构不同。',
      },
      {
        question: '我没有合法身份，还能申请庇护吗？',
        answer:
          '可以。庇护申请不要求您拥有合法的移民身份。无论您是持签证入境后逾期居留、非法入境，还是在边境被拘留，您都有权申请庇护。关键是您必须能够证明您符合庇护的法律定义，即面临基于受保护理由的迫害。',
      },
      {
        question: '庇护申请需要多少费用？',
        answer:
          '提交I-589庇护申请表本身无需向政府缴纳申请费。但聘请律师代理您的案件会产生律师费用。正道移民服务中心提供免费初次咨询，我们会在了解您的情况后提供透明的费用报价。我们也提供灵活的分期付款方案，确保您能获得专业的法律帮助。',
      },
    ],
  },
  {
    id: 'process',
    label: '庇护流程与时间线',
    questions: [
      {
        question: '庇护申请的一般流程是什么？',
        answer:
          '主动庇护的基本流程包括：（1）准备并提交I-589表格及支持材料；（2）收到USCIS的收据通知；（3）采集指纹和背景调查；（4）参加庇护面谈；（5）收到审理结果。如果申请被拒，您可能被转到移民法庭进行防御性庇护程序。整个过程中，律师会全程协助您准备材料和应对各阶段。',
      },
      {
        question: '庇护案件通常需要多长时间？',
        answer:
          '处理时间因案件类型和地区而异。主动庇护面谈通常在提交申请后数月至一年内安排。移民法庭的防御性庇护案件可能需要数年时间。近年来，USCIS实施了"后进先出"（LIFO）政策，较新的案件可能会更快得到审理。具体时间线需要根据您的个案情况评估。',
      },
      {
        question: '我需要准备哪些材料？',
        answer:
          '关键材料包括：填写完整的I-589表格、详细的个人声明书（陈述您遭受迫害或恐惧迫害的经历）、身份证明文件（护照、身份证等）、支持性证据（国别报告、新闻报道、医疗记录、照片等）、以及证人证词或专家意见。正道移民服务中心会帮助您系统地收集和整理所有必要的证据材料。',
      },
      {
        question: '提交庇护申请后多久可以获得工作许可？',
        answer:
          '在提交I-589庇护申请180天后（不包括申请人自身导致的延误时间），如果案件尚未审结，您可以申请庇护工卡（Employment Authorization Document, EAD）。工卡申请需要提交I-765表格。获批后，工卡通常有效期为两年，并可在庇护案件审理期间续签。',
      },
      {
        question: '庇护面谈的流程是怎样的？',
        answer:
          '庇护面谈通常在USCIS庇护办公室进行，由庇护官员主持。面谈开始时会宣誓，然后庇护官员会就您的I-589表格和个人声明提出问题。您的律师可以陪同并在适当时候补充说明。面谈通常持续1-3小时。面谈结束后，庇护官员不会当场告知结果，通常会在两周内邮寄决定通知。',
      },
    ],
  },
  {
    id: 'preparation',
    label: '面谈/上庭准备',
    questions: [
      {
        question: '庇护面谈前我应该如何准备？',
        answer:
          '充分准备包括：（1）熟悉您的I-589表格和个人声明的每一个细节；（2）与律师进行模拟面谈练习；（3）整理所有证据材料并按顺序排列；（4）了解面谈的基本流程和注意事项；（5）保证充足的休息。面谈时保持诚实、冷静，有条理地陈述您的经历。正道移民服务中心会为您提供全面的面谈准备辅导。',
      },
      {
        question: '面谈时需要翻译吗？',
        answer:
          '如果您不能流利使用英语，您需要自行带一位合格的翻译陪同参加面谈。翻译必须年满18岁，流利掌握英语和您的母语，且不能是您的律师或代理人。USCIS不提供翻译服务。正道移民服务中心可以协助您安排合格的中文翻译。',
      },
      {
        question: '移民法庭上庭需要注意什么？',
        answer:
          '上庭时请注意：（1）准时到达法庭，建议提前30分钟抵达；（2）穿着整洁、正式的服装；（3）携带所有相关文件的原件和副本；（4）庭审期间保持安静和尊重；（5）只有在法官或律师要求时才发言；（6）如实回答所有问题。您的律师会在庭审前详细指导您应对各种可能的问题。',
      },
      {
        question: '个人声明书应该怎么写？',
        answer:
          '个人声明书是庇护申请中最重要的文件之一。它应该包含：您遭受迫害或恐惧迫害的详细经历，迫害的原因（必须与五个受保护理由之一相关），迫害者的身份，事件发生的具体时间和地点，以及您为什么不能或不愿返回祖国。声明应当真实、具体、有条理，避免模糊笼统的描述。我们的律师会协助您撰写和完善声明书。',
      },
      {
        question: '面谈或上庭时如果紧张怎么办？',
        answer:
          '紧张是正常的反应，庇护官员和法官都理解这一点。以下建议可能有帮助：（1）提前与律师充分练习，增加信心；（2）回答问题前稍作停顿，组织思路；（3）如果没有听清问题，可以礼貌地请求重复；（4）如果需要休息，可以向庇护官员或法官提出要求；（5）专注于真实地陈述您的经历，不需要背诵准备好的答案。',
      },
    ],
  },
  {
    id: 'risks',
    label: '常见风险与拒绝',
    questions: [
      {
        question: '庇护申请被拒的常见原因有哪些？',
        answer:
          '常见拒绝原因包括：（1）未在入境后一年内提交申请且无法证明例外情况；（2）陈述不一致或可信度问题；（3）无法证明遭受的迫害与五个受保护理由之一相关联；（4）无法证明政府参与或无力/不愿提供保护；（5）存在庇护排除条款适用的情况（如参与迫害他人）；（6）证据不足以支持申请。',
      },
      {
        question: '庇护申请被拒后还有什么补救措施？',
        answer:
          '如果主动庇护面谈后被拒，您的案件通常会被转到移民法庭，您可以在法官面前重新提出庇护申请。如果移民法官也拒绝了您的申请，您可以向移民上诉委员会（BIA）提起上诉，上诉期限通常为30天。在某些情况下，还可以进一步向联邦上诉法院提出司法审查请求。每一个阶段都有严格的时间限制，务必及时咨询律师。',
      },
      {
        question: '申请庇护期间会被驱逐出境吗？',
        answer:
          '在庇护案件审理期间，一般不会被驱逐。但如果您的庇护申请在移民法庭被最终拒绝且没有其他形式的救济，法官可能会下达驱逐令。在某些情况下，即使庇护被拒，您仍可能符合暂缓驱逐（Withholding of Removal）或《禁止酷刑公约》保护（CAT Protection）的条件，这些保护的标准比庇护更高但仍然是可行的替代方案。',
      },
      {
        question: '庇护申请会影响我在中国的家人吗？',
        answer:
          '庇护申请本身是保密的，USCIS不会将您的申请信息透露给您的祖国政府。但是，您在申请中提供的关于家人的信息可能会成为案件记录的一部分。如果您获得庇护身份，您可以为在美国的配偶和未婚的21岁以下子女申请衍生庇护身份。建议您在咨询中详细讨论如何保护家人的安全和隐私。',
      },
      {
        question: '可信恐惧面谈（Credible Fear Interview）通过率高吗？',
        answer:
          '可信恐惧面谈是在入境时或入境后被快速遣返程序拦截的人员需要通过的初步筛查。通过标准是证明您有"可信的恐惧"遭受迫害。近年来通过率有所波动，但总体而言，如果您有真实的迫害经历或恐惧，并能清晰表达，通过的可能性是存在的。如果未通过，您有权要求移民法官复核。提前准备和律师指导对通过面谈至关重要。',
      },
    ],
  },
  {
    id: 'after',
    label: '庇护后续身份',
    questions: [
      {
        question: '获得庇护身份后可以申请绿卡吗？',
        answer:
          '是的。获得庇护身份一年后，您可以提交I-485表格申请调整为永久居民身份（绿卡）。申请时需要证明您仍然符合庇护的条件，在获批后的一年内一直身在美国，且没有被撤销庇护身份的情形。绿卡申请无需额外费用，但处理时间可能较长。',
      },
      {
        question: '庇护身份会被撤销吗？',
        answer:
          '在某些情况下，庇护身份可能被撤销，例如：（1）您自愿返回了您所声称遭受迫害的国家；（2）申请中存在欺诈或虚假陈述；（3）您的情况发生了根本性变化，不再面临迫害风险；（4）您犯了某些严重罪行。在获得绿卡之前，务必避免做出可能危及您庇护身份的行为，并在任何重大决定前咨询律师。',
      },
      {
        question: '获得庇护后可以回中国吗？',
        answer:
          '强烈不建议在获得庇护后返回您声称遭受迫害的国家。这样做可能被视为您不再面临迫害风险，可能导致庇护身份被撤销。即使您已经获得了绿卡，返回原籍国仍可能在入籍面谈时引发问题。如果您有紧急情况需要旅行，请务必先咨询您的律师。',
      },
      {
        question: '庇护工卡（EAD）如何续签？',
        answer:
          '庇护工卡的初始有效期通常为两年。到期前需要提交I-765表格申请续签。续签需要在工卡到期前至少90天提交申请。如果续签申请在旧工卡到期前提交，您通常可以继续工作直到新工卡签发。获得庇护身份后申请的工卡无需续签费用。建议您设置日历提醒，避免工卡过期影响工作。',
      },
      {
        question: '庇护身份获批后多久可以申请入籍？',
        answer:
          '庇护身份本身不能直接申请入籍。您需要先获得绿卡（获得庇护一年后可申请），然后在持有绿卡五年后可以申请入籍成为美国公民。需要注意的是，计算永久居民身份的起始日期时，会从您获得庇护身份的日期算起（而非绿卡实际签发日期）。因此，实际等待时间可能比五年短。入籍申请需要通过英语和公民知识考试。',
      },
    ],
  },
];

/* ── JSON-LD Schema ── */
function buildFaqSchema() {
  const allQuestions = faqCategories.flatMap((cat) => cat.questions);
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: allQuestions.map((q) => ({
      '@type': 'Question',
      name: q.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: q.answer,
      },
    })),
  };
}

export default async function FaqPage({
  searchParams,
}: {
  params: { locale: string };
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const activeCategory =
    typeof searchParams?.category === 'string'
      ? searchParams.category
      : 'all';

  const visibleCategories =
    activeCategory === 'all'
      ? faqCategories
      : faqCategories.filter((c) => c.id === activeCategory);

  return (
    <>
      {/* JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(buildFaqSchema()) }}
      />

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
            常见问题
          </h1>
          <p className="text-white/70 text-lg max-w-[600px] mx-auto">
            关于美国庇护申请最常见的问题与详细解答
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
            <span className="text-gray-900">常见问题</span>
          </nav>
        </div>
      </div>

      {/* ── Category Tabs ── */}
      <section className="bg-white border-b border-gray-200">
        <div className="max-w-[1200px] mx-auto px-6 py-6">
          <div className="flex flex-wrap justify-center gap-2">
            <Link
              href="/faq"
              className={`inline-block px-5 py-2 rounded-full text-sm font-medium transition-colors ${
                activeCategory === 'all'
                  ? 'text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
              style={
                activeCategory === 'all'
                  ? { backgroundColor: '#1B2A4A' }
                  : undefined
              }
            >
              全部问题
            </Link>
            {faqCategories.map((cat) => (
              <Link
                key={cat.id}
                href={`/faq?category=${cat.id}`}
                className={`inline-block px-5 py-2 rounded-full text-sm font-medium transition-colors ${
                  activeCategory === cat.id
                    ? 'text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
                style={
                  activeCategory === cat.id
                    ? { backgroundColor: '#1B2A4A' }
                    : undefined
                }
              >
                {cat.label}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ Content ── */}
      <section className="bg-white py-[60px]">
        <div className="max-w-[900px] mx-auto px-6">
          {visibleCategories.map((cat) => (
            <div key={cat.id} className="mb-12 last:mb-0">
              <h3
                className="text-xl font-bold text-gray-900 mb-6 pb-3 border-b-2"
                style={{
                  fontFamily: 'var(--font-heading)',
                  borderColor: '#C9963B',
                }}
              >
                {cat.label}
              </h3>
              <FaqAccordion questions={cat.questions} defaultOpen={-1} />
            </div>
          ))}
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
            没有找到您的问题？直接咨询律师
          </h2>
          <p className="text-white/75 mb-8 leading-relaxed">
            每个庇护案件都有其独特之处，我们的律师可以针对您的具体情况提供专业解答
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
