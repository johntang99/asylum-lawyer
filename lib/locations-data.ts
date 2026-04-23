export interface LocationData {
  slug: string;
  cityZH: string;
  cityEN: string;
  h1: string;
  intro: string;
  distance: string;
  seo: { title: string; description: string };
}

export const locationsData: Record<string, LocationData> = {
  irvine: {
    slug: 'irvine',
    cityZH: '尔湾',
    cityEN: 'Irvine',
    h1: '尔湾（Irvine）庇护移民律师 — 中文服务',
    intro:
      '尔湾是南加州发展最快的华人聚居城市之一，大量来自中国大陆和台湾的科技、金融专业人士在此安家。我们深知尔湾华人社区对专业中文法律服务的迫切需求，致力于为您提供贴心的庇护移民咨询与代理服务。',
    distance: '距洛杉矶办公室约 40 分钟车程',
    seo: {
      title: '尔湾中文庇护移民律师 | 宇霞移民服务中心',
      description:
        '为尔湾华人社区提供专业中文庇护移民法律服务。政治庇护、宗教庇护、绿卡申请等。距尔湾约40分钟车程，免费初次咨询。',
    },
  },
  'san-gabriel': {
    slug: 'san-gabriel',
    cityZH: '圣盖博',
    cityEN: 'San Gabriel',
    h1: '圣盖博（San Gabriel）庇护移民律师 — 中文服务',
    intro:
      '圣盖博谷是全美最具代表性的华人社区之一，以琳琅满目的中餐厅和华人商业中心闻名。从传统粤菜到正宗川湘菜，这里是华人文化在美国延续的重要缩影。我们为圣盖博的华人居民提供母语级别的庇护移民法律服务。',
    distance: '距洛杉矶办公室约 20 分钟车程',
    seo: {
      title: '圣盖博中文庇护移民律师 | 宇霞移民服务中心',
      description:
        '为圣盖博华人社区提供专业中文庇护移民法律服务。熟悉华人社区需求，政治庇护、宗教庇护申请等。免费初次咨询。',
    },
  },
  alhambra: {
    slug: 'alhambra',
    cityZH: '阿罕布拉',
    cityEN: 'Alhambra',
    h1: '阿罕布拉（Alhambra）庇护移民律师 — 中文服务',
    intro:
      '阿罕布拉拥有超过50%的亚裔人口，是洛杉矶地区历史最悠久的华人社区之一。Valley大道沿线的中文商铺和社区组织见证了几代华人移民的奋斗历程。我们为阿罕布拉的华人朋友提供值得信赖的庇护移民法律援助。',
    distance: '距洛杉矶办公室约 15 分钟车程',
    seo: {
      title: '阿罕布拉中文庇护移民律师 | 宇霞移民服务中心',
      description:
        '阿罕布拉专业中文庇护移民律师，为当地华人社区提供政治庇护、宗教庇护、庇护面谈准备等法律服务。免费初次咨询。',
    },
  },
  'rowland-heights': {
    slug: 'rowland-heights',
    cityZH: '罗兰岗',
    cityEN: 'Rowland Heights',
    h1: '罗兰岗（Rowland Heights）庇护移民律师 — 中文服务',
    intro:
      '罗兰岗是洛杉矶东部重要的华人社区，以众多华人超市、补习学校和社区活动中心著称。许多新移民家庭选择在此定居，形成了活跃而互助的华人社群。我们理解新移民面临的法律挑战，为罗兰岗居民提供专业的庇护移民服务。',
    distance: '距洛杉矶办公室约 30 分钟车程',
    seo: {
      title: '罗兰岗中文庇护移民律师 | 宇霞移民服务中心',
      description:
        '为罗兰岗华人社区提供专业庇护移民法律服务。中文全程服务，政治庇护、宗教庇护、绿卡申请。免费初次咨询。',
    },
  },
  'monterey-park': {
    slug: 'monterey-park',
    cityZH: '蒙特利公园',
    cityEN: 'Monterey Park',
    h1: '蒙特利公园（Monterey Park）庇护移民律师 — 中文服务',
    intro:
      '蒙特利公园市拥有洛杉矶县最高的华裔人口比例，素有"小台北"之称。这里是华人移民在美国扎根的标志性城市，中文已成为社区的主要语言之一。我们为蒙特利公园的华人居民提供最贴近社区需求的庇护移民法律服务。',
    distance: '距洛杉矶办公室约 15 分钟车程',
    seo: {
      title: '蒙特利公园中文庇护移民律师 | 宇霞移民服务中心',
      description:
        '蒙特利公园市华人社区首选庇护移民律师。中文母语服务，政治庇护、宗教庇护、庇护面谈准备。免费初次咨询。',
    },
  },
  pasadena: {
    slug: 'pasadena',
    cityZH: '帕萨迪纳',
    cityEN: 'Pasadena',
    h1: '帕萨迪纳（Pasadena）庇护移民律师 — 中文服务',
    intro:
      '帕萨迪纳不仅是加州理工学院的所在地，也汇聚了大量华人科研人员、留学生和专业人士。随着华人社区在此持续壮大，对专业中文法律服务的需求也日益增长。我们为帕萨迪纳的华人居民提供全方位的庇护移民法律支持。',
    distance: '距洛杉矶办公室约 20 分钟车程',
    seo: {
      title: '帕萨迪纳中文庇护移民律师 | 宇霞移民服务中心',
      description:
        '帕萨迪纳专业中文庇护移民律师，为华人学者、专业人士提供政治庇护、宗教庇护等法律服务。免费初次咨询。',
    },
  },
  'temple-city': {
    slug: 'temple-city',
    cityZH: '天普市',
    cityEN: 'Temple City',
    h1: '天普市（Temple City）庇护移民律师 — 中文服务',
    intro:
      '天普市位于圣盖博谷核心地带，是近年来华人家庭快速增长的社区。优质的学区和安全的居住环境吸引了众多华人新移民在此安家。我们为天普市的华人居民提供便捷可靠的中文庇护移民法律咨询与代理服务。',
    distance: '距洛杉矶办公室约 20 分钟车程',
    seo: {
      title: '天普市中文庇护移民律师 | 宇霞移民服务中心',
      description:
        '为天普市华人社区提供专业庇护移民法律服务。中文全程沟通，政治庇护、宗教庇护申请。免费初次咨询。',
    },
  },
  rosemead: {
    slug: 'rosemead',
    cityZH: '柔似蜜',
    cityEN: 'Rosemead',
    h1: '柔似蜜（Rosemead）庇护移民律师 — 中文服务',
    intro:
      '柔似蜜紧邻蒙特利公园和阿罕布拉，是圣盖博谷华人社区的重要组成部分。这里的华人居民以来自广东和福建的移民为主，社区保持着浓厚的中华文化传统。我们为柔似蜜的华人朋友提供贴心的中文庇护移民法律服务。',
    distance: '距洛杉矶办公室约 15 分钟车程',
    seo: {
      title: '柔似蜜中文庇护移民律师 | 宇霞移民服务中心',
      description:
        '柔似蜜专业中文庇护移民律师，为华人社区提供政治庇护、宗教庇护、庇护面谈等法律服务。免费初次咨询。',
    },
  },
};

export const allCitySlugs = Object.keys(locationsData);
