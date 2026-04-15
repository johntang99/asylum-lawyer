import Link from "next/link";

interface FooterProps {
  locale: string;
  footerConfig?: {
    columns?: Array<{
      title: string;
      links: Array<{ label: string; href: string }>;
    }>;
    nap?: {
      name: string;
      phone: string;
      email?: string;
      wechatId?: string;
      address?: string | {
        street: string;
        city: string;
        state: string;
        zip: string;
      };
      hours?: {
        weekday: string;
        saturday: string;
        sunday: string;
      };
    };
    compliance?: {
      barNumber?: string;
      links?: Array<{ label: string; href: string }>;
      disclaimer?: string;
    };
    copyright?: string;
  };
}

const defaultConfig: NonNullable<FooterProps["footerConfig"]> = {
  columns: [
    {
      title: "服务项目",
      links: [
        { label: "庇护申请", href: "/services/asylum" },
        { label: "防御性庇护", href: "/services/defensive-asylum" },
        { label: "上诉服务", href: "/services/appeals" },
        { label: "工作许可", href: "/services/work-permit" },
      ],
    },
    {
      title: "关于我们",
      links: [
        { label: "律师简介", href: "/about" },
        { label: "成功案例", href: "/cases" },
        { label: "客户评价", href: "/testimonials" },
        { label: "常见问题", href: "/faq" },
      ],
    },
    {
      title: "联系我们",
      links: [
        { label: "免费咨询", href: "/contact" },
        { label: "办公地点", href: "/location" },
        { label: "在线预约", href: "/appointment" },
        { label: "微信咨询", href: "/wechat" },
      ],
    },
  ],
  nap: {
    name: "宇律师事务所",
    phone: "yuxiaris@gmail.com",
    email: "yuxiaris@gmail.com",
    wechatId: "ZhangLawFirm",
    address: {
      street: "123 Main Street, Suite 400",
      city: "Los Angeles",
      state: "CA",
      zip: "90012",
    },
    hours: {
      weekday: "周一至周五: 9:00 AM - 6:00 PM",
      saturday: "周六: 10:00 AM - 2:00 PM",
      sunday: "周日: 休息",
    },
  },
  compliance: {
    barNumber: "CA Bar #123456",
    links: [
      { label: "隐私政策", href: "/privacy" },
      { label: "服务条款", href: "/terms" },
      { label: "免责声明", href: "/disclaimer" },
      { label: "无障碍访问", href: "/accessibility" },
    ],
    disclaimer:
      "本站内容仅供一般信息参考，不构成法律意见。浏览本网站不构成律师-客户关系。",
  },
  copyright: `© ${new Date().getFullYear()} 宇律师事务所 版权所有`,
};

export default function Footer({ locale, footerConfig }: FooterProps) {
  const config = {
    ...defaultConfig,
    ...footerConfig,
    nap: { ...defaultConfig!.nap, ...footerConfig?.nap },
    compliance: { ...defaultConfig!.compliance, ...footerConfig?.compliance },
  };

  const columns = config.columns ?? defaultConfig.columns!;
  const nap = config.nap!;
  const compliance = config.compliance!;
  const copyright = config.copyright ?? defaultConfig.copyright!;

  return (
    <footer className="pt-20 pb-0" style={{ backgroundColor: "#0F1A32" }}>
      {/* Main grid */}
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-[1.5fr_1fr_1fr_1fr] gap-12">
          {/* Brand column */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div
                className="w-10 h-10 flex items-center justify-center rounded text-lg font-bold"
                style={{ backgroundColor: "#C9963B", color: "#0F1A32" }}
              >
                ⚖
              </div>
              <span className="text-white text-lg font-semibold">
                {nap.name}
              </span>
            </div>
            <p className="text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.6)" }}>
              专注庇护与移民法律服务，为华人社区提供专业、可靠的法律援助。我们致力于保护每一位客户的合法权益。
            </p>
          </div>

          {/* Link columns */}
          {columns.map((column) => (
            <div key={column.title}>
              <h4
                className="text-xs font-semibold uppercase tracking-wider mb-4"
                style={{ color: "rgba(255,255,255,1)" }}
              >
                {column.title}
              </h4>
              <ul className="space-y-3">
                {column.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={`/${locale}${link.href}`}
                      className="text-sm transition-colors duration-200 hover:[color:#C9963B]"
                      style={{ color: "rgba(255,255,255,0.6)" }}
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* NAP block */}
        <div
          className="mt-12 pt-8"
          style={{ borderTop: "1px solid rgba(255,255,255,0.1)" }}
        >
          <div className="flex flex-col md:flex-row gap-8 md:gap-12">
            {/* Address */}
            <div className="flex items-start gap-3">
              <span className="text-lg mt-0.5" style={{ color: "#C9963B" }}>
                📍
              </span>
              <div>
                {typeof nap.address === 'string' ? (
                  <p className="text-sm" style={{ color: "rgba(255,255,255,0.75)" }}>
                    {nap.address}
                  </p>
                ) : nap.address ? (
                  <>
                    <p className="text-sm" style={{ color: "rgba(255,255,255,0.75)" }}>
                      {nap.address.street}
                    </p>
                    <p className="text-sm" style={{ color: "rgba(255,255,255,0.75)" }}>
                      {nap.address.city}, {nap.address.state} {nap.address.zip}
                    </p>
                  </>
                ) : null}
              </div>
            </div>

            {/* Phone */}
            <div className="flex items-start gap-3">
              <span className="text-lg mt-0.5" style={{ color: "#C9963B" }}>
                📞
              </span>
              <div>
                <p className="text-sm" style={{ color: "rgba(255,255,255,0.75)" }}>
                  {nap.phone}
                </p>
                {nap.wechatId && (
                  <p className="text-sm" style={{ color: "rgba(255,255,255,0.75)" }}>
                    微信: {nap.wechatId}
                  </p>
                )}
              </div>
            </div>

            {/* Email */}
            <div className="flex items-start gap-3">
              <span className="text-lg mt-0.5" style={{ color: "#C9963B" }}>
                ✉️
              </span>
              <p className="text-sm" style={{ color: "rgba(255,255,255,0.75)" }}>
                {nap.email}
              </p>
            </div>

            {/* Hours */}
            {nap.hours && (
              <div className="flex items-start gap-3">
                <span className="text-lg mt-0.5" style={{ color: "#C9963B" }}>
                  🕐
                </span>
                <div>
                  <p className="text-sm" style={{ color: "rgba(255,255,255,0.75)" }}>
                    {nap.hours.weekday}
                  </p>
                  <p className="text-sm" style={{ color: "rgba(255,255,255,0.75)" }}>
                    {nap.hours.saturday}
                  </p>
                  <p className="text-sm" style={{ color: "rgba(255,255,255,0.75)" }}>
                    {nap.hours.sunday}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Compliance bar */}
        <div
          className="mt-8 py-6"
          style={{ borderTop: "1px solid rgba(255,255,255,0.1)" }}
        >
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div
              className="flex items-center gap-2 text-xs"
              style={{ color: "rgba(255,255,255,0.4)" }}
            >
              <span>{copyright}</span>
              {compliance.barNumber && (
                <>
                  <span>·</span>
                  <span>{compliance.barNumber}</span>
                </>
              )}
            </div>
            <div className="flex items-center gap-4">
              {compliance.links?.map((link) => (
                <Link
                  key={link.href}
                  href={`/${locale}${link.href}`}
                  className="text-xs transition-colors duration-200 hover:[color:#C9963B]"
                  style={{ color: "rgba(255,255,255,0.4)" }}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
          {compliance.disclaimer && (
            <p
              className="text-xs mt-4 text-center md:text-left"
              style={{ color: "rgba(255,255,255,0.4)" }}
            >
              {compliance.disclaimer}
            </p>
          )}
        </div>
      </div>
    </footer>
  );
}
