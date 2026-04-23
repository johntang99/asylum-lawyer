/* eslint-disable @typescript-eslint/no-explicit-any */

export interface ServiceData {
  slug: string;
  title: string;
  titleEN?: string;
  icon: string;
  description: string;
  category: 'primary' | 'additional';
  seo: { title: string; description: string; h1: string };
  whatIs: {
    title: string;
    content: string;
    keyPoints: Array<{ icon: string; text: string }>;
  };
  whoNeeds: {
    scenarios: Array<{ title: string; description: string }>;
  };
  processSteps: Array<{ step: number; title: string; description: string }>;
  requirements: Array<{ category: string; items: string[] }>;
  commonMistakes: Array<{ mistake: string; correction: string }>;
  howWeHelp: { content: string; points: string[] };
  testimonial: { quote: string; name: string; caseType: string };
  faq: Array<{ question: string; answer: string }>;
  relatedSlugs: string[];
}

// ── Full data: first 3 services ──

const politicalAsylum: ServiceData = {
  slug: 'political-asylum',
  title: '政治庇护',
  titleEN: 'Political Asylum',
  icon: '🛡',
  description:
    '为因政治观点、宗教信仰、种族、国籍或特定社会群体成员身份而受到迫害的个人提供全面的庇护法律服务。',
  category: 'primary',
  seo: {
    title: '洛杉矶政治庇护律师 | 中文庇护移民服务',
    description:
      '洛杉矶专业中文政治庇护律师，为华人社区提供政治庇护申请、面谈准备、法庭代理等全面法律服务。免费初次咨询。',
    h1: '洛杉矶政治庇护法律服务',
  },
  whatIs: {
    title: '什么是政治庇护？',
    content:
      '政治庇护是美国移民法为那些在本国因特定原因受到迫害或有充分理由担心受到迫害的人提供的一种保护形式。根据《1980年难民法》和《移民与国籍法》第208条，任何身在美国或抵达美国边境的人都可以申请庇护，无论其目前的移民身份如何。获得庇护身份后，申请人可以在美国合法居住和工作，一年后可以申请绿卡（永久居民身份）。',
    keyPoints: [
      {
        icon: '📜',
        text: '基于《移民与国籍法》第208条，保护因五大类原因受迫害者',
      },
      {
        icon: '⏰',
        text: '一般需在入境后一年内提交申请（有例外情况）',
      },
      {
        icon: '👨‍👩‍👧‍👦',
        text: '配偶及21岁以下未婚子女可作为衍生申请人一同获得保护',
      },
      {
        icon: '🏛',
        text: '获批后一年可申请绿卡，五年后可申请入籍',
      },
    ],
  },
  whoNeeds: {
    scenarios: [
      {
        title: '政治异见人士',
        description:
          '因表达政治观点、参与民主运动、批评政府政策而遭受逮捕、拘留、骚扰或威胁的人士。',
      },
      {
        title: '宗教信仰者',
        description:
          '因信仰特定宗教（如基督教、法轮功等）而在国内受到迫害、限制宗教自由或面临处罚的人士。',
      },
      {
        title: '少数族裔成员',
        description:
          '因种族、民族或国籍原因而遭受歧视、暴力或系统性迫害的少数群体成员。',
      },
      {
        title: '特定社会群体',
        description:
          '因属于特定社会群体（如LGBTQ+群体、强制计划生育受害者等）而面临迫害风险的个人。',
      },
    ],
  },
  processSteps: [
    {
      step: 1,
      title: '免费初始咨询',
      description:
        '与律师进行详细的案件评估，了解您的经历、迫害原因及可用的法律保护途径。我们将用中文与您沟通，确保您完全理解整个流程。',
    },
    {
      step: 2,
      title: '证据收集与案件准备',
      description:
        '协助您收集和整理所有支持性证据，包括个人陈述、国家状况报告、证人证词、医疗记录等。我们将帮您撰写详尽的个人声明。',
    },
    {
      step: 3,
      title: '提交I-589申请',
      description:
        '准备并提交庇护申请表（I-589表格）及所有支持性文件。确保申请材料完整、准确，符合USCIS的所有要求。',
    },
    {
      step: 4,
      title: '面谈准备与模拟',
      description:
        '进行多次模拟面谈练习，帮您熟悉面谈流程、预期问题和回答策略。确保您在面谈中能自信、清晰地陈述您的案件。',
    },
    {
      step: 5,
      title: '面谈陪同与后续跟进',
      description:
        '律师全程陪同参加庇护面谈或法庭听证，提供法律代理。面谈后跟进案件状态，处理任何补充证据要求（RFE）。',
    },
  ],
  requirements: [
    {
      category: '基本条件',
      items: [
        '人在美国境内或位于美国边境',
        '因五大保护类别之一受到迫害或担心受到迫害',
        '一般需在入境后一年内申请',
        '未在安全第三国定居过',
      ],
    },
    {
      category: '证据材料',
      items: [
        '详细的个人陈述书',
        '身份证明文件（护照、身份证等）',
        '迫害证据（照片、报告、信件等）',
        '国家状况相关报告和新闻',
        '证人声明或专家意见',
      ],
    },
    {
      category: '表格文件',
      items: [
        'I-589庇护申请表',
        '两张护照尺寸照片',
        '入境记录（I-94）',
        '之前提交的所有移民申请副本',
      ],
    },
  ],
  commonMistakes: [
    {
      mistake: '超过入境后一年期限才提交申请',
      correction:
        '尽早咨询律师。即使超过一年，某些例外情况仍可能允许申请，但越早行动越好。',
    },
    {
      mistake: '个人陈述内容不够详细或前后矛盾',
      correction:
        '在律师指导下撰写详细、一致的个人陈述，包含具体的日期、地点、事件经过和细节。',
    },
    {
      mistake: '未提供充分的国家状况证据',
      correction:
        '提交来自国务院、人权组织、新闻媒体等权威来源的国家状况报告，证明迫害的普遍性。',
    },
    {
      mistake: '面谈时回答与申请材料不一致',
      correction:
        '通过充分的面谈准备和模拟练习，确保口头陈述与书面材料完全一致。',
    },
    {
      mistake: '自行申请，未聘请专业律师',
      correction:
        '庇护案件复杂，涉及大量法律知识。有律师代理的案件通过率显著高于自行申请。',
    },
  ],
  howWeHelp: {
    content:
      '宇霞移民服务中心在政治庇护领域拥有丰富的经验，特别擅长处理来自中国的庇护案件。我们深刻理解华人申请者所面临的独特挑战，并提供全中文的法律服务，确保沟通无障碍。',
    points: [
      '一对一的中文法律咨询，深入了解您的案件情况',
      '协助撰写详尽、有说服力的个人陈述',
      '收集和整理所有支持性证据和国家状况报告',
      '多次模拟面谈练习，确保您做好充分准备',
      '全程陪同庇护面谈或法庭听证，提供专业法律代理',
      '案件后续跟进，处理补充证据请求和上诉',
    ],
  },
  testimonial: {
    quote:
      '我最担心的是材料前后不一致，宇霞女士帮我把经历梳理得很清楚，每次面谈练习都非常细。最后顺利获批，整个过程让我很踏实。',
    name: '王先生',
    caseType: '政治庇护',
  },
  faq: [
    {
      question: '政治庇护申请需要多长时间？',
      answer:
        '处理时间因案件复杂程度和USCIS/移民法庭的工作量而异。主动庇护面谈通常在提交申请后数周至数月内安排。如果案件转到移民法庭，可能需要1-3年或更长时间。我们会帮您了解预期的时间线。',
    },
    {
      question: '申请庇护期间可以工作吗？',
      answer:
        '提交庇护申请180天后（如果案件仍在审理中），您可以申请工作许可（EAD卡）。在等待工作许可期间，您不能合法工作。我们会帮您在符合条件时尽快提交工卡申请。',
    },
    {
      question: '如果入境超过一年还能申请庇护吗？',
      answer:
        '虽然一般规定需在入境一年内申请，但存在两个例外：（1）情况发生了影响申请资格的重大变化；（2）与按时申请相关的特殊情况。律师可以帮您评估是否符合例外条件。',
    },
    {
      question: '庇护申请会影响我的家人吗？',
      answer:
        '您的配偶和21岁以下未婚子女可以作为衍生申请人包含在您的庇护申请中。如果他们在美国境外，待您获得庇护后可以申请将他们接到美国。',
    },
    {
      question: '庇护被拒后还有什么选择？',
      answer:
        '如果庇护官员没有批准您的申请，案件通常会被转到移民法庭。您有权在移民法官面前重新申请庇护。如果法官也拒绝了，您可以向移民上诉委员会（BIA）上诉。我们在每个阶段都可以为您提供代理。',
    },
  ],
  relatedSlugs: ['affirmative-asylum', 'defensive-asylum', 'credible-fear-interview'],
};

const affirmativeAsylum: ServiceData = {
  slug: 'affirmative-asylum',
  title: '主动庇护',
  titleEN: 'Affirmative Asylum',
  icon: '✋',
  description:
    '通过USCIS庇护办公室主动提交庇护申请，适用于尚未进入递解程序的申请人。',
  category: 'primary',
  seo: {
    title: '洛杉矶主动庇护申请律师 | 中文庇护服务',
    description:
      '洛杉矶专业中文主动庇护律师，协助通过USCIS庇护办公室提交申请。包括I-589准备、面谈模拟和全程法律代理。',
    h1: '主动庇护申请法律服务',
  },
  whatIs: {
    title: '什么是主动庇护？',
    content:
      '主动庇护（Affirmative Asylum）是指尚未进入递解程序的个人向美国公民及移民服务局（USCIS）庇护办公室主动提交庇护申请的程序。这是一种非对抗性的申请方式，申请人在相对友好的环境中与庇护官员进行面谈。如果庇护官员批准申请，申请人直接获得庇护身份；如果未获批准，案件通常会被转到移民法庭进行防御性庇护程序。',
    keyPoints: [
      {
        icon: '📝',
        text: '向USCIS庇护办公室直接提交I-589申请表',
      },
      {
        icon: '🤝',
        text: '面谈环境相对非对抗性，由庇护官员主持',
      },
      {
        icon: '⏰',
        text: '必须在抵达美国后一年内提交申请',
      },
      {
        icon: '🔄',
        text: '如未获批准，案件自动转入移民法庭程序',
      },
    ],
  },
  whoNeeds: {
    scenarios: [
      {
        title: '合法入境后寻求保护',
        description:
          '持有效签证（旅游、学生、工作等）合法入境美国，后因国内情况变化或到期后担心回国受迫害的人士。',
      },
      {
        title: '签证过期但未进入递解程序',
        description:
          '签证已过期但尚未被ICE逮捕或收到出庭通知（NTA）的个人，仍可主动申请庇护。',
      },
      {
        title: '新近抵达美国的个人',
        description:
          '刚抵达美国不久，因入境前在本国遭受的迫害或担心未来受迫害而希望尽快申请庇护保护的人士。',
      },
    ],
  },
  processSteps: [
    {
      step: 1,
      title: '案件评估与策略制定',
      description:
        '律师详细评估您的情况，确定最佳的庇护申请策略，分析案件的优势和需要加强的方面。',
    },
    {
      step: 2,
      title: '准备I-589申请',
      description:
        '协助填写I-589表格，撰写详细的个人陈述，收集和整理所有支持性证据文件。',
    },
    {
      step: 3,
      title: '提交申请至USCIS',
      description:
        '将完整的申请包提交至USCIS庇护办公室，确认收到回执和生物识别预约通知。',
    },
    {
      step: 4,
      title: '生物识别采集',
      description:
        '陪同您前往指定的USCIS应用支持中心进行指纹和照片采集，用于背景调查。',
    },
    {
      step: 5,
      title: '庇护面谈',
      description:
        '经过充分的模拟面谈准备后，律师陪同您参加庇护面谈，在面谈中提供法律支持和翻译协助。',
    },
  ],
  requirements: [
    {
      category: '申请资格',
      items: [
        '人在美国境内',
        '尚未进入递解程序（未收到NTA）',
        '入境后一年内提交申请',
        '符合庇护的五大保护类别之一',
      ],
    },
    {
      category: '必需文件',
      items: [
        '完整填写的I-589表格',
        '详细的个人陈述（中英文）',
        '护照及所有入境记录',
        '两张护照照片',
        '支持性证据材料',
      ],
    },
    {
      category: '支持证据',
      items: [
        '迫害事件的直接证据',
        '国家状况报告（来自国务院、人权组织等）',
        '证人声明和宣誓书',
        '医疗或心理健康记录',
        '新闻报道或学术文章',
      ],
    },
  ],
  commonMistakes: [
    {
      mistake: '等到接近一年期限才开始准备',
      correction:
        '尽早开始准备。高质量的庇护申请需要时间来收集证据和撰写陈述。建议入境后尽快咨询律师。',
    },
    {
      mistake: '对庇护面谈准备不充分',
      correction:
        '进行多次模拟面谈，熟悉可能的问题和回答方式。面谈表现对案件结果影响很大。',
    },
    {
      mistake: '提交不完整的申请材料',
      correction:
        '确保所有表格完整填写，所有必需的支持文件齐全。不完整的申请可能被拒绝或延迟处理。',
    },
    {
      mistake: '未提及所有迫害经历',
      correction:
        '在个人陈述中全面描述所有相关的迫害经历。遗漏重要事件可能在面谈时造成可信度问题。',
    },
  ],
  howWeHelp: {
    content:
      '我们的律师团队在处理主动庇护案件方面拥有丰富经验，特别擅长为来自中国的申请者提供服务。从案件评估到面谈陪同，我们提供全程的中文法律服务。',
    points: [
      '免费初次案件评估，确定最佳申请策略',
      '专业准备I-589申请表及所有支持文件',
      '协助撰写详细、有力的个人陈述',
      '全面收集国家状况证据和专家意见',
      '多次模拟面谈练习，建立信心',
      '面谈全程陪同，提供法律代理',
      '如案件转入法庭，继续提供防御性庇护服务',
    ],
  },
  testimonial: {
    quote:
      '从准备I-589到面谈当天，宇霞女士都一步步提醒我重点。她把复杂规则讲得很明白，让我在面谈时能稳定表达，结果比我预期更好。',
    name: '陈女士',
    caseType: '主动庇护',
  },
  faq: [
    {
      question: '主动庇护和防御性庇护有什么区别？',
      answer:
        '主动庇护是在您未进入递解程序时主动向USCIS提交的申请，面谈环境较为友好。防御性庇护则是在移民法庭的递解程序中作为防御手段提出的，需要在法官面前举证。主动庇护的程序通常较快且压力较小。',
    },
    {
      question: '主动庇护面谈是什么样的？',
      answer:
        '面谈在USCIS庇护办公室进行，由一名庇护官员主持。官员会询问您的背景、迫害经历和为什么不能回国等问题。您的律师可以在场但通常在面谈结束时才发言。整个面谈通常持续1-3小时。',
    },
    {
      question: '提交主动庇护后多久安排面谈？',
      answer:
        '根据USCIS的"后进先出"政策，新提交的案件可能在几周内就安排面谈。但具体时间取决于USCIS的工作量和您所在地区的庇护办公室。我们会帮您跟踪面谈安排。',
    },
    {
      question: '面谈没通过怎么办？',
      answer:
        '如果庇护官员没有批准您的案件，您不会立即被驱逐。案件会被转到移民法庭（EOIR），您将有机会在移民法官面前重新申请庇护。我们可以继续在法庭阶段为您提供代理。',
    },
    {
      question: '主动庇护申请费是多少？',
      answer:
        '提交I-589庇护申请表不收取政府费用。但如果需要提交工卡申请（I-765），初次申请也是免费的。律师费用根据案件复杂程度而定，我们提供免费初次咨询来评估您的案件。',
    },
  ],
  relatedSlugs: ['political-asylum', 'defensive-asylum', 'i-589-application'],
};

const defensiveAsylum: ServiceData = {
  slug: 'defensive-asylum',
  title: '防御性庇护',
  titleEN: 'Defensive Asylum',
  icon: '⚔',
  description:
    '在移民法庭递解程序中作为防御策略申请庇护，由经验丰富的律师在法庭上为您辩护。',
  category: 'primary',
  seo: {
    title: '洛杉矶防御性庇护律师 | 移民法庭庇护代理',
    description:
      '在洛杉矶移民法庭面临递解？律师提供专业的防御性庇护法律服务，帮助您在法庭上争取庇护保护。中文服务，免费咨询。',
    h1: '防御性庇护法律服务',
  },
  whatIs: {
    title: '什么是防御性庇护？',
    content:
      '防御性庇护（Defensive Asylum）是指在移民法庭的递解（Removal）程序中，作为一种防御手段申请庇护保护。当一个人被ICE逮捕并收到出庭通知（NTA），或其主动庇护申请被USCIS转到移民法庭时，就进入了防御性庇护程序。在这种情况下，申请人需要在移民法官面前证明自己符合庇护资格，由政府律师（DHS/ICE）进行对抗性质询。这是一个更正式的法律程序，因此拥有经验丰富的律师代理至关重要。',
    keyPoints: [
      {
        icon: '⚖',
        text: '在移民法庭进行，由移民法官主持，政府律师出席',
      },
      {
        icon: '🛡',
        text: '作为递解程序中的防御手段，阻止被驱逐出境',
      },
      {
        icon: '📋',
        text: '举证责任在申请人一方，需证明符合庇护资格',
      },
      {
        icon: '🔄',
        text: '不利裁决可以上诉至移民上诉委员会（BIA）',
      },
    ],
  },
  whoNeeds: {
    scenarios: [
      {
        title: '收到出庭通知（NTA）',
        description:
          '被ICE逮捕或收到出庭通知，正面临递解程序的个人。庇护可以作为递解的防御手段。',
      },
      {
        title: '主动庇护被转案',
        description:
          '主动庇护申请未被USCIS庇护官员批准，案件被转到移民法庭继续审理的申请人。',
      },
      {
        title: '边境被拦截后通过恐惧面谈',
        description:
          '在边境被拦截后通过了可信恐惧面谈（Credible Fear Interview），被安排在移民法庭申请庇护的个人。',
      },
      {
        title: '身份过期被发现',
        description:
          '签证过期或非法滞留被ICE发现并启动递解程序，但有合理庇护理由的个人。',
      },
    ],
  },
  processSteps: [
    {
      step: 1,
      title: '紧急案件评估',
      description:
        '收到NTA后尽快联系律师，进行紧急案件评估。律师会审查您的出庭通知、分析指控，并制定初步的辩护策略。',
    },
    {
      step: 2,
      title: '初次听证（Master Calendar Hearing）',
      description:
        '律师陪同您出席初次听证，在法官面前确认指控、表明申请庇护的意向，并确定后续的个人听证日期。',
    },
    {
      step: 3,
      title: '证据准备与案件构建',
      description:
        '在个人听证前，全面准备案件：收集证据、撰写陈述、获取专家意见、准备证人等。这是案件准备中最关键的阶段。',
    },
    {
      step: 4,
      title: '个人听证（Merits Hearing）',
      description:
        '律师在法庭上代表您进行完整的庇护案件陈述，包括直接询问、交叉质询证人、提交证据和进行法律论证。',
    },
    {
      step: 5,
      title: '裁决与后续',
      description:
        '法官可能当庭宣判或稍后以书面形式发出裁决。如获批，办理庇护身份手续；如被拒，评估上诉至BIA的可行性。',
    },
  ],
  requirements: [
    {
      category: '法庭要求',
      items: [
        '按时出席所有法庭听证',
        '及时提交所有法庭要求的文件',
        '遵守法官设定的证据提交截止日期',
        '保持有效的送达地址',
      ],
    },
    {
      category: '证据要求',
      items: [
        '个人详细陈述和宣誓声明',
        '迫害的直接和间接证据',
        '国家状况报告和专家意见',
        '证人证词和声明',
        '所有证据需中英文翻译和公证',
      ],
    },
    {
      category: '法律论证',
      items: [
        '证明存在过去的迫害或未来迫害的充分恐惧',
        '迫害与五大保护类别之间的关联（nexus）',
        '无法或不愿接受本国政府保护',
        '不存在内部重新安置的合理选择',
      ],
    },
  ],
  commonMistakes: [
    {
      mistake: '缺席法庭听证',
      correction:
        '必须出席每一次法庭听证。缺席将导致缺席递解令（in absentia removal order），严重影响您留在美国的权利。',
    },
    {
      mistake: '在法庭上没有律师代理',
      correction:
        '防御性庇护程序复杂且对抗性强。没有律师的申请人通过率远低于有律师代理的案件。尽早聘请律师。',
    },
    {
      mistake: '未按法庭截止日期提交证据',
      correction:
        '法官会设定严格的证据提交截止日期。迟交的证据可能不被采纳，严重影响案件结果。',
    },
    {
      mistake: '法庭陈述与之前的申请材料不一致',
      correction:
        '确保法庭上的口头证词与I-589表格和之前的陈述完全一致。任何不一致都会被政府律师抓住，损害可信度。',
    },
  ],
  howWeHelp: {
    content:
      '在防御性庇护案件中，律师拥有丰富的移民法庭出庭经验。我们理解法庭程序的复杂性和面临递解的紧迫性，致力于为每一位客户提供最强有力的法律辩护。',
    points: [
      '紧急案件评估和制定辩护策略',
      '所有法庭听证的全程代理',
      '专业的证据准备和案件构建',
      '安排和准备证人出庭作证',
      '与政府律师进行有效的法律论辩',
      '如有需要，协助申请保释或保释金减免',
      '不利裁决的上诉代理（BIA和联邦法院）',
    ],
  },
  testimonial: {
    quote:
      '收到出庭通知后我非常慌，宇霞女士很快帮我定好应对节奏。她在法庭上的陈述很有力量，也一直安抚我的情绪，最终案件迎来好结果。',
    name: '李先生',
    caseType: '防御性庇护',
  },
  faq: [
    {
      question: '防御性庇护的成功率高吗？',
      answer:
        '成功率取决于许多因素，包括案件的具体情况、证据的充分性、法官和所在法庭等。有经验的律师代理可以显著提高成功率。全国范围内，有律师代理的庇护案件通过率比没有律师的高出数倍。',
    },
    {
      question: '如果我被ICE拘留了怎么办？',
      answer:
        '被拘留后应尽快联系律师。您有权在递解程序中申请庇护和申请保释。律师可以帮您申请保释、准备庇护案件，并确保您的权利得到保护。',
    },
    {
      question: '防御性庇护程序需要多长时间？',
      answer:
        '防御性庇护案件通常需要数月到数年不等。初次听证后，个人听证可能安排在几个月到一年以上之后。案件的复杂程度、法庭的排期和是否需要上诉都会影响总体时间。',
    },
    {
      question: '在法庭程序期间可以工作吗？',
      answer:
        '在移民法庭待审的庇护申请人，如果庇护申请已提交超过180天且延迟不是申请人造成的，可以申请工作许可（EAD）。我们会帮您在符合条件时尽快申请。',
    },
    {
      question: '法庭判决不利可以上诉吗？',
      answer:
        '是的。如果移民法官拒绝了您的庇护申请，您可以在裁决后30天内向移民上诉委员会（BIA）提出上诉。如果BIA也维持原判，还可以进一步向联邦巡回上诉法院申请审查。',
    },
  ],
  relatedSlugs: ['political-asylum', 'affirmative-asylum', 'immigration-court'],
};

// ── Partial data: remaining 12 services ──

function makePartialService(
  slug: string,
  title: string,
  titleEN: string,
  icon: string,
  description: string,
  category: 'primary' | 'additional',
  seoTitle: string,
  seoDescription: string,
  faq: Array<{ question: string; answer: string }>,
  relatedSlugs: string[],
  testimonial?: { quote: string; name?: string }
): ServiceData {
  return {
    slug,
    title,
    titleEN,
    icon,
    description,
    category,
    seo: {
      title: seoTitle,
      description: seoDescription,
      h1: `${title}法律服务`,
    },
    whatIs: {
      title: `什么是${title}？`,
      content: `${title}是美国移民法中的重要组成部分。${description}我们的律师团队在此领域拥有丰富经验，致力于为每一位客户提供最专业的法律服务。`,
      keyPoints: [
        { icon: '📌', text: `了解${title}的基本要求和申请条件` },
        { icon: '📋', text: '我们提供全程的中文法律服务' },
        { icon: '⏰', text: '注意申请的时间要求和截止日期' },
      ],
    },
    whoNeeds: {
      scenarios: [
        { title: '需要法律保护的个人', description: `如果您的情况涉及${title}，我们可以帮助您了解您的权利和选择。` },
        { title: '不确定是否符合资格', description: '即使您不确定自己是否符合条件，我们也建议您进行免费咨询，让律师评估您的情况。' },
        { title: '需要紧急法律帮助', description: '如果您面临紧急的移民法律问题，请立即联系我们获取专业帮助。' },
      ],
    },
    processSteps: [
      { step: 1, title: '免费咨询', description: '与律师进行初步案件评估，了解您的情况和法律选择。' },
      { step: 2, title: '案件准备', description: '收集证据，准备所有必要的法律文件和支持材料。' },
      { step: 3, title: '提交申请', description: '向相关政府机构提交完整的申请材料。' },
      { step: 4, title: '面谈/听证准备', description: '为面谈或法庭听证进行充分准备。' },
      { step: 5, title: '案件跟进', description: '全程跟进案件进展，处理后续事宜。' },
    ],
    requirements: [
      {
        category: '基本要求',
        items: ['满足基本的申请资格条件', '提供有效的身份证明文件', '按时提交所有申请材料'],
      },
      {
        category: '支持文件',
        items: ['相关的证据材料', '个人陈述或声明', '翻译和公证文件'],
      },
      {
        category: '注意事项',
        items: ['注意申请截止日期', '保持地址更新', '配合律师准备工作'],
      },
    ],
    commonMistakes: [
      { mistake: '未在规定时间内提交申请', correction: '尽早咨询律师，了解具体的时间要求，避免错过截止日期。' },
      { mistake: '提交不完整的申请材料', correction: '在律师指导下准备完整的申请文件，确保所有必需材料齐全。' },
      { mistake: '未聘请专业律师', correction: '移民法律复杂，专业律师的协助可以显著提高成功率。' },
    ],
    howWeHelp: {
      content: `宇霞移民服务中心在${title}方面拥有丰富经验。我们提供全中文服务，确保沟通无障碍。`,
      points: [
        '免费初次咨询和案件评估',
        '全程中文法律服务',
        '专业的文件准备和案件构建',
        '面谈或听证陪同',
        '案件后续跟进和处理',
      ],
    },
    testimonial: {
      quote:
        testimonial?.quote ??
        `我在${title}阶段最焦虑的时候，宇霞女士帮我把重点一步步理清。她的建议很实用，沟通也很耐心，让我在关键节点更有底气。`,
      name: testimonial?.name ?? '客户',
      caseType: title,
    },
    faq,
    relatedSlugs,
  };
}

const credibleFearInterview = makePartialService(
  'credible-fear-interview',
  '恐惧面谈',
  'Credible Fear Interview',
  '🎤',
  '在边境或入境口岸被拦截后进行的可信恐惧面谈准备和法律代理，帮助您通过面谈进入庇护程序。',
  'primary',
  '洛杉矶恐惧面谈律师 | 可信恐惧面谈准备',
  '专业的可信恐惧面谈（Credible Fear Interview）准备服务。帮助您理解面谈流程，准备回答关键问题，提高通过率。',
  [
    { question: '什么是可信恐惧面谈？', answer: '可信恐惧面谈是在您被边境执法人员拦截后，由庇护官员进行的初步面谈。目的是确定您是否有"可信的恐惧"会在回国后遭受迫害。通过面谈后，您将有机会在移民法庭申请庇护。' },
    { question: '恐惧面谈的通过标准是什么？', answer: '您需要证明存在"重大可能性"您符合庇护资格。这个标准相对较低，您需要表明有充分的理由担心回国后会因种族、宗教、国籍、政治观点或特定社会群体身份而受到迫害。' },
    { question: '面谈时可以有律师在场吗？', answer: '是的，您有权让律师或法律代表在恐惧面谈时在场。虽然律师不能直接替您回答问题，但可以在面谈结束时发言并提供补充信息。' },
    { question: '如果恐惧面谈没通过怎么办？', answer: '如果庇护官员作出否定决定，您可以要求移民法官对此进行审查。法官将重新评估您的案件。如果法官也维持否定决定，您可能面临被递解。' },
  ],
  ['political-asylum', 'defensive-asylum', 'i-589-application'],
  {
    quote:
      '在拘留环境里我一度不知道该怎么表达，宇霞女士提前帮我反复练习关键问题。正式面谈时我终于能完整讲清经历，顺利进入后续程序。',
    name: '吴先生',
  }
);

const i589Application = makePartialService(
  'i-589-application',
  'I-589申请',
  'I-589 Application',
  '📋',
  '专业准备和提交I-589庇护/暂缓递解/《酷刑公约》保护申请表格，确保申请材料完整准确。',
  'primary',
  '洛杉矶I-589庇护申请律师 | 专业表格准备',
  '专业I-589庇护申请表格准备服务。确保表格完整准确，个人陈述有力，支持证据充分。',
  [
    { question: 'I-589表格是什么？', answer: 'I-589是向美国申请庇护（Asylum）、暂缓递解（Withholding of Removal）或《酷刑公约》保护的统一申请表格。所有庇护申请人都需要填写此表格。' },
    { question: '填写I-589有什么特别注意事项？', answer: '表格必须完整、准确填写。个人陈述部分尤其重要，需要详细描述您受到的迫害或恐惧。任何不准确或不完整的信息都可能影响您的案件。' },
    { question: 'I-589表格需要费用吗？', answer: '提交I-589庇护申请不需要向政府缴纳任何费用。但您可能需要支付律师费用、翻译费用和文件公证费用等。' },
    { question: '可以在线提交I-589吗？', answer: '目前I-589表格需要以纸质形式邮寄提交给USCIS或在移民法庭提交。确保使用最新版本的表格并保留提交证明。' },
  ],
  ['affirmative-asylum', 'interview-preparation', 'work-permit'],
  {
    quote:
      '我原本很担心表格和陈述会出错，宇霞女士把每一项都核对得很细，还帮我补齐证据逻辑。递交后进展很顺，心里踏实很多。',
    name: '周女士',
  }
);

const interviewPreparation = makePartialService(
  'interview-preparation',
  '面谈准备',
  'Interview Preparation',
  '🗣',
  '全面的庇护面谈准备服务，包括模拟面谈、问题预测、回答策略和心理准备，提高面谈成功率。',
  'primary',
  '洛杉矶庇护面谈准备律师 | 模拟面谈服务',
  '专业庇护面谈准备服务，包括多次模拟面谈、常见问题演练和回答策略指导。提高面谈通过率。',
  [
    { question: '面谈准备包括哪些内容？', answer: '包括审查您的申请材料、进行多次模拟面谈、预测可能的问题、指导回答策略、解释面谈流程和注意事项，以及心理准备和减压技巧。' },
    { question: '需要准备多长时间？', answer: '建议在面谈前至少提前2-4周开始准备。我们通常安排2-3次模拟面谈，每次1-2小时，以确保您做好充分准备。' },
    { question: '模拟面谈和真实面谈有多像？', answer: '我们的模拟面谈尽可能模拟真实的面谈环境和流程，包括使用类似的问题、保持正式的氛围，让您对真实面谈有充分的心理准备。' },
    { question: '面谈时需要带翻译吗？', answer: '如果您不能用英语流利沟通，USCIS会提供口译员。但我们建议您自己也带一名翻译，以确保翻译的准确性。律师可以在面谈中监督翻译质量。' },
  ],
  ['affirmative-asylum', 'i-589-application', 'credible-fear-interview'],
  {
    quote:
      '模拟面谈做了几轮后，我从紧张到能清晰回答。宇霞女士会指出我表达里的漏洞并马上调整，正式面谈时明显更有底气。',
    name: '林先生',
  }
);

const immigrationCourt = makePartialService(
  'immigration-court',
  '移民法庭',
  'Immigration Court Representation',
  '⚖',
  '在移民法庭提供专业法律代理，包括所有类型的听证、动议提交和法律论辩。',
  'primary',
  '洛杉矶移民法庭律师 | 中文法庭代理',
  '洛杉矶移民法庭专业中文律师代理。处理所有类型的移民法庭案件，包括庇护、递解防御、保释等。',
  [
    { question: '移民法庭和普通法庭有什么不同？', answer: '移民法庭是行政法庭，不是刑事法庭。法庭由移民法官主持，政府由DHS/ICE律师代表。您没有政府指定的免费律师，需要自己聘请律师或寻找法律援助。' },
    { question: '第一次去移民法庭要做什么？', answer: '第一次听证通常是Master Calendar Hearing，法官会确认您的身份、解释您的权利、询问您是否有律师，并确定您要申请的救济方式（如庇护）。' },
    { question: '如果错过了法庭日期怎么办？', answer: '缺席法庭可能导致缺席递解令。如果您有合理的理由（如生病、未收到通知），律师可以帮您提交动议要求重新开案。' },
    { question: '法庭案件需要多长时间？', answer: '移民法庭案件可能需要数月到数年。这取决于法庭的排期、案件的复杂程度和是否有延期请求。' },
  ],
  ['defensive-asylum', 'asylum-denial-appeal', 'deportation-defense'],
  {
    quote:
      '法庭流程很复杂，但宇霞女士把每一步都解释得很清楚。开庭当天她的节奏把控很稳，我知道该说什么、怎么说，压力小了很多。',
    name: '何先生',
  }
);

const asylumDenialAppeal = makePartialService(
  'asylum-denial-appeal',
  '庇护被拒上诉',
  'Asylum Denial & Appeal',
  '🔄',
  '庇护申请被拒后的上诉和重新申请服务，包括向BIA上诉和联邦法院司法审查。',
  'primary',
  '洛杉矶庇护上诉律师 | 庇护被拒后的法律选择',
  '庇护申请被拒？律师提供专业的上诉和重新申请服务，包括BIA上诉、联邦法院审查和重新开案动议。',
  [
    { question: '庇护被拒后还能上诉吗？', answer: '是的。移民法官的不利裁决可以在30天内向移民上诉委员会（BIA）上诉。BIA的决定还可以进一步申请联邦巡回上诉法院的司法审查。' },
    { question: '上诉成功率高吗？', answer: '上诉成功率取决于案件的具体情况和法官是否存在法律或事实错误。有经验的上诉律师可以识别可上诉的问题并进行有效的法律论证。' },
    { question: '上诉期间会被递解吗？', answer: '向BIA提出上诉通常会自动暂停递解令的执行（automatic stay）。但向联邦法院申请司法审查不一定自动暂停，需要单独申请。' },
    { question: '可以提交新证据吗？', answer: 'BIA上诉通常基于已有的记录，不接受新证据。但如果有新的重要证据出现，可以通过提交重新开案动议（Motion to Reopen）的方式提交。' },
  ],
  ['defensive-asylum', 'immigration-court', 'deportation-defense'],
  {
    quote:
      '收到不利结果那天我几乎放弃，宇霞女士迅速帮我梳理可上诉点并重建证据结构。后续程序推进得很扎实，让我重新看到希望。',
    name: '郑女士',
  }
);

const workPermit = makePartialService(
  'work-permit',
  '工卡申请',
  'Work Permit (EAD)',
  '📄',
  '协助庇护申请人申请工作许可证（EAD卡），确保您在等待案件审理期间可以合法工作。',
  'additional',
  '洛杉矶庇护工卡律师 | EAD工作许可申请',
  '协助庇护申请人申请工作许可证（EAD卡）。了解申请条件、时间要求和续签流程。',
  [
    { question: '什么时候可以申请工卡？', answer: '庇护申请提交180天后，如果案件仍在审理中且延迟非申请人造成，可以申请工卡（EAD）。初次申请使用I-765表格。' },
    { question: '工卡申请需要多久？', answer: '通常需要1-3个月处理。在等待期间不能工作。我们会帮您在第一时间提交申请并跟踪进度。' },
    { question: '工卡需要续签吗？', answer: '是的，工卡通常有效期为1-2年，需要在到期前及时续签。我们会提醒您并协助准备续签申请。' },
    { question: '工卡被拒怎么办？', answer: '如果被拒，通常是因为不符合180天等待期或存在其他资格问题。律师可以帮您分析被拒原因并采取相应措施。' },
  ],
  ['i-589-application', 'affirmative-asylum', 'family-derivative'],
  {
    quote:
      '等待期间经济压力很大，宇霞女士团队帮我把工卡申请准备得很完整。提交后很快拿到回执和卡片，终于可以安心工作。',
    name: '许先生',
  }
);

const familyDerivative = makePartialService(
  'family-derivative',
  '家属衍生申请',
  'Family Derivative Applications',
  '👨‍👩‍👧',
  '为庇护获批者的配偶和未婚子女办理衍生庇护身份申请，帮助家人团聚。',
  'additional',
  '洛杉矶庇护家属申请律师 | 衍生庇护身份',
  '帮助庇护获批者为配偶和21岁以下未婚子女申请衍生庇护身份。家庭团聚法律服务。',
  [
    { question: '哪些家庭成员可以申请衍生庇护？', answer: '您的配偶和在您提交庇护申请时未满21岁的未婚子女可以作为衍生申请人。他们可以包含在您的I-589表格中或单独申请。' },
    { question: '家属在美国境外怎么办？', answer: '如果您的配偶或子女在美国境外，获得庇护后可以为他们提交I-730难民/庇护亲属申请，将他们接到美国。' },
    { question: '衍生身份有时间限制吗？', answer: '子女必须在主申请人获得庇护时未满21岁且未婚。如果子女在案件审理期间超过21岁（"超龄"问题），可能需要特别处理。' },
    { question: '衍生庇护人可以独立工作吗？', answer: '是的，获得衍生庇护身份后，家属可以独立申请工卡并合法工作。他们享有与主申请人相同的权利和福利。' },
  ],
  ['political-asylum', 'green-card', 'work-permit'],
  {
    quote:
      '最难的是把家人材料和时间线对齐，宇霞女士非常耐心地逐项确认。家属手续推进后，我们一家终于看到了团聚的希望。',
    name: '赵女士',
  }
);

const greenCard = makePartialService(
  'green-card',
  '庇护绿卡',
  'Asylum-Based Green Card',
  '🏠',
  '协助庇护获批者在一年后申请调整身份为永久居民（绿卡），迈向美国公民身份。',
  'additional',
  '洛杉矶庇护绿卡律师 | 庇护身份调整',
  '帮助庇护获批者申请绿卡（永久居民身份）。了解申请条件、流程和所需材料。',
  [
    { question: '庇护获批后多久可以申请绿卡？', answer: '获得庇护身份一年后即可申请调整身份为永久居民。建议在满一年后尽快提交申请。' },
    { question: '申请绿卡需要什么条件？', answer: '需要仍然符合庇护身份的定义、在美国实际居住满一年、未在美国以外的国家重新定居、没有取消庇护的理由。' },
    { question: '庇护绿卡和其他绿卡有区别吗？', answer: '庇护绿卡的日期将追溯到您获得庇护的日期。这意味着在计算入籍等待时间时更有利。其他权利和义务与普通绿卡持有者相同。' },
    { question: '绿卡获批后可以出境吗？', answer: '获得绿卡后可以出境旅行，但需要谨慎。回到迫害您的国家可能被视为放弃庇护的理由。建议出行前咨询律师。' },
  ],
  ['political-asylum', 'family-derivative', 'work-permit'],
  {
    quote:
      '拿到庇护后我不确定绿卡步骤，宇霞女士给了我非常清晰的清单和时间安排。申请过程顺畅，细节处理也特别专业。',
    name: '孙先生',
  }
);

const deportationDefense = makePartialService(
  'deportation-defense',
  '递解抗辩',
  'Deportation Defense',
  '🚫',
  '为面临递解程序的个人提供全面的法律防御，探索所有可能的救济途径。',
  'additional',
  '洛杉矶递解抗辩律师 | 中文递解防御服务',
  '面临递解？律师提供专业的递解抗辩服务，探索庇护、暂缓递解、取消递解等所有救济途径。',
  [
    { question: '收到递解通知后应该怎么做？', answer: '立即联系移民律师。不要忽视任何法庭通知。律师可以帮您评估可用的法律救济途径，如庇护、暂缓递解、取消递解等。' },
    { question: '递解程序中有哪些救济方式？', answer: '可能的救济包括：庇护、暂缓递解、《酷刑公约》保护、取消递解、自愿离境等。具体哪种适合您取决于您的具体情况。' },
    { question: '在递解程序中可以保释吗？', answer: '在某些情况下可以。律师可以帮您申请保释或保释金减免，让您在案件审理期间不用被关在拘留中心。' },
    { question: '递解令可以撤销吗？', answer: '在某些情况下可以通过重新开案动议或联邦法院审查来撤销递解令。是否可行取决于具体情况和被拒的原因。' },
  ],
  ['defensive-asylum', 'immigration-court', 'asylum-denial-appeal'],
  {
    quote:
      '面对递解压力时我几乎崩溃，宇霞女士先稳住我的情绪，再帮我逐项准备辩护材料。她的策略很清晰，让我重新有了安全感。',
    name: '高先生',
  }
);

const uVisa = makePartialService(
  'u-visa',
  'u-visa',
  'U Visa',
  '🔒',
  '为犯罪受害者申请U签证，获得在美国合法居留和工作的权利，并有机会申请绿卡。',
  'additional',
  '洛杉矶U签证律师 | 犯罪受害者签证',
  '为犯罪受害者提供U签证申请服务。获得临时合法身份、工作许可，并有机会申请永久居民身份。',
  [
    { question: '什么是U签证？', answer: 'U签证是为特定犯罪的受害者设立的非移民签证。如果您是严重犯罪（如家庭暴力、性侵、绑架等）的受害者，并配合执法部门调查，可能有资格申请U签证。' },
    { question: 'U签证需要什么条件？', answer: '需要证明：（1）您是符合条件的犯罪受害者；（2）因犯罪遭受了身体或精神伤害；（3）了解犯罪的相关信息；（4）配合执法部门；（5）犯罪发生在美国或违反了美国法律。' },
    { question: 'U签证持有人可以申请绿卡吗？', answer: '是的。持有U签证3年后，且满足其他条件（如在美国实际居住），可以申请调整身份为永久居民。' },
    { question: 'U签证的等待时间有多长？', answer: '由于每年U签证的配额限制为10,000个，目前积压严重，等待时间可能需要数年。但在等待期间您可能获得工作许可。' },
  ],
  ['deportation-defense', 'vawa', 'work-permit'],
  {
    quote:
      '作为受害者再次回忆经历很困难，宇霞女士一直很尊重我的节奏。材料准备严谨又有人情味，让我在申请过程中感到被保护。',
    name: '刘女士',
  }
);

const vawa = makePartialService(
  'vawa',
  'vawa',
  'VAWA',
  '🛡',
  '依据《反对妇女暴力法》为遭受美国公民或永久居民配偶虐待的受害者提供独立移民申请服务。',
  'additional',
  '洛杉矶VAWA律师 | 家庭暴力受害者移民',
  '为家庭暴力受害者提供VAWA自我申请服务。无需施虐配偶配合，独立申请移民身份。中文服务。',
  [
    { question: '什么是VAWA？', answer: 'VAWA（Violence Against Women Act）允许遭受美国公民或永久居民配偶、父母或成年子女虐待的受害者独立提交移民申请，无需施虐者的知情或配合。' },
    { question: 'VAWA只适用于女性吗？', answer: '不是。虽然名为"反对妇女暴力法"，但VAWA的保护同样适用于男性受害者。任何遭受符合条件的家庭暴力的人都可以申请。' },
    { question: '申请VAWA施虐者会知道吗？', answer: '不会。VAWA申请具有保密性，USCIS不会通知施虐者您提交了申请。这是为了保护申请人的安全。' },
    { question: 'VAWA获批后可以得到什么？', answer: '初步获批后您将获得递延行动身份和工作许可。最终获批后可以申请绿卡，成为永久居民。' },
  ],
  ['u-visa', 'deportation-defense', 'green-card'],
  {
    quote:
      '我最在意的是隐私和安全，宇霞女士把流程讲得很清楚，也非常注意保密。整个申请过程中，我第一次感到自己被真正支持。',
    name: '黄女士',
  }
);

const sijs = makePartialService(
  'sijs',
  'sijs',
  'SIJS (Special Immigrant Juvenile Status)',
  '👶',
  '为遭受虐待、忽视或遗弃的未成年人申请特殊移民青少年身份，获得合法居留权和保护。',
  'additional',
  '洛杉矶SIJS律师 | 特殊移民青少年身份',
  '为符合条件的未成年人申请特殊移民青少年身份（SIJS）。帮助遭受虐待或忽视的青少年获得合法身份。',
  [
    { question: '什么是SIJS？', answer: 'SIJS（Special Immigrant Juvenile Status）是为在美国遭受虐待、忽视或遗弃的未成年人设立的移民身份。获得SIJS后可以申请绿卡。' },
    { question: 'SIJS的年龄要求是什么？', answer: '申请人必须在21岁以下且未婚。但各州对"未成年人"的定义可能不同，加州将未成年人定义为18岁以下。建议尽早申请。' },
    { question: 'SIJS申请流程是什么？', answer: '首先需要在州法院获得特别发现令（Special Findings Order），然后向USCIS提交I-360申请，最后申请调整身份获得绿卡。' },
    { question: 'SIJS和庇护有什么区别？', answer: '两者都提供保护，但SIJS专门针对未成年人，要求不同。有些未成年人可能同时符合SIJS和庇护的资格，律师可以帮您确定最佳策略。' },
  ],
  ['deportation-defense', 'green-card', 'family-derivative'],
  {
    quote:
      '孩子的时间窗口很紧，宇霞女士团队协调法院文件和移民申请都很高效。每一步都有清晰提醒，家长这边也安心很多。',
    name: '家长反馈',
  }
);

// ── Export all services ──

export const ALL_SERVICES: ServiceData[] = [
  politicalAsylum,
  affirmativeAsylum,
  defensiveAsylum,
  credibleFearInterview,
  i589Application,
  interviewPreparation,
  immigrationCourt,
  asylumDenialAppeal,
  workPermit,
  familyDerivative,
  greenCard,
  deportationDefense,
  uVisa,
  vawa,
  sijs,
];

export const PRIMARY_SERVICES = ALL_SERVICES.filter((s) => s.category === 'primary');
export const ADDITIONAL_SERVICES = ALL_SERVICES.filter((s) => s.category === 'additional');

export function getServiceBySlug(slug: string): ServiceData | undefined {
  return ALL_SERVICES.find((s) => s.slug === slug);
}

export function getRelatedServices(slugs: string[]): ServiceData[] {
  return slugs
    .map((slug) => ALL_SERVICES.find((s) => s.slug === slug))
    .filter(Boolean) as ServiceData[];
}
