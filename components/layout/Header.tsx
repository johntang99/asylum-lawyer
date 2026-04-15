"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface NavItem {
  label: string;
  href: string;
  children?: Array<{ label: string; href: string }>;
}

interface HeaderProps {
  locale: string;
  headerConfig?: {
    logo?: { text?: string; href?: string };
    nav?: NavItem[];
    cta?: { label: string; href: string; phone?: string };
    localeToggle?: boolean;
  };
}

const defaultConfig: NonNullable<HeaderProps["headerConfig"]> = {
  logo: { text: "宇律师事务所", href: "/" },
  nav: [
    { label: "首页", href: "/" },
    {
      label: "服务项目",
      href: "/services",
      children: [
        { label: "庇护申请", href: "/services/asylum" },
        { label: "移民签证", href: "/services/immigration" },
        { label: "绿卡申请", href: "/services/green-card" },
        { label: "入籍服务", href: "/services/naturalization" },
      ],
    },
    { label: "成功案例", href: "/cases" },
    { label: "关于我们", href: "/about" },
    { label: "联系我们", href: "/contact" },
  ],
  cta: { label: "免费咨询", href: "/consultation", phone: "" },
  localeToggle: false,
};

export default function Header({ locale, headerConfig }: HeaderProps) {
  const config = { ...defaultConfig, ...headerConfig };
  const pathname = usePathname();

  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  const handleScroll = useCallback(() => {
    setScrolled(window.scrollY > 50);
  }, []);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileMenuOpen]);

  const isActive = (href: string) => {
    if (href === "/") return pathname === `/${locale}` || pathname === "/";
    return pathname?.startsWith(`/${locale}${href}`) || pathname?.startsWith(href);
  };

  const localePath = (href: string) => `/${locale}${href}`;

  const toggleLocale = locale === "zh" ? "en" : "zh";
  const localePathSwitch = pathname?.replace(`/${locale}`, `/${toggleLocale}`) || `/${toggleLocale}`;

  return (
    <>
      <header
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          zIndex: 50,
          background: scrolled
            ? "var(--color-primary-dark, #0F1A32)"
            : "var(--color-primary, #1B2A4A)",
          boxShadow: scrolled ? "var(--shadow-xl, 0 8px 32px rgba(0,0,0,0.16))" : "none",
          transition: "background var(--transition-normal, 0.25s ease), box-shadow var(--transition-normal, 0.25s ease)",
        }}
      >
        <div
          style={{
            maxWidth: "var(--container-max, 1280px)",
            margin: "0 auto",
            padding: "0 var(--container-padding, 24px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            height: "var(--header-height, 72px)",
          }}
          className="max-md:!h-[60px]"
        >
          {/* Logo */}
          <Link
            href={localePath(config.logo?.href || "/")}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "var(--gap-sm, 12px)",
              textDecoration: "none",
            }}
          >
            <span
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: 36,
                height: 36,
                borderRadius: "var(--radius-md, 6px)",
                background: "var(--color-secondary, #C9963B)",
                fontSize: 18,
              }}
              aria-hidden="true"
            >
              &#x2696;
            </span>
            <span
              style={{
                color: "var(--color-white, #FFFFFF)",
                fontWeight: 700,
                fontSize: "var(--text-body, 1rem)",
                whiteSpace: "nowrap",
              }}
            >
              {config.logo?.text || "宇律师事务所"}
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav
            style={{
              display: "flex",
              alignItems: "center",
              gap: "var(--gap-lg, 24px)",
            }}
            className="max-md:!hidden"
          >
            {config.nav?.map((item) => {
              const hasChildren = item.children && item.children.length > 0;
              const active = isActive(item.href);

              if (hasChildren) {
                return (
                  <div
                    key={item.href}
                    style={{ position: "relative" }}
                    onMouseEnter={() => setActiveDropdown(item.href)}
                    onMouseLeave={() => setActiveDropdown(null)}
                  >
                    <Link
                      href={localePath(item.href)}
                      style={{
                        color: active
                          ? "var(--color-white, #FFFFFF)"
                          : "rgba(255, 255, 255, 0.85)",
                        fontSize: 14,
                        fontWeight: 500,
                        textDecoration: "none",
                        padding: "8px 0",
                        display: "inline-block",
                        transition: "color var(--transition-normal, 0.25s ease)",
                        borderBottom: active
                          ? "2px solid var(--color-secondary, #C9963B)"
                          : "2px solid transparent",
                      }}
                      onMouseEnter={(e) => {
                        if (!active)
                          (e.currentTarget as HTMLElement).style.borderBottomColor =
                            "var(--color-secondary, #C9963B)";
                      }}
                      onMouseLeave={(e) => {
                        if (!active)
                          (e.currentTarget as HTMLElement).style.borderBottomColor =
                            "transparent";
                      }}
                    >
                      {item.label}
                      <span style={{ marginLeft: 4, fontSize: 10 }}>&#9662;</span>
                    </Link>

                    {/* Dropdown — transparent bridge covers the gap between trigger and menu */}
                    <div
                      style={{
                        position: "absolute",
                        top: "100%",
                        left: "50%",
                        transform: "translateX(-50%)",
                        paddingTop: 8,
                        pointerEvents: activeDropdown === item.href ? "auto" : "none",
                        zIndex: 60,
                      }}
                    >
                    <div
                      style={{
                        minWidth: 220,
                        background: "var(--color-white, #FFFFFF)",
                        borderRadius: "var(--radius-lg, 8px)",
                        boxShadow: "var(--shadow-xl, 0 8px 32px rgba(0,0,0,0.16))",
                        opacity: activeDropdown === item.href ? 1 : 0,
                        transform: `translateY(${activeDropdown === item.href ? "0" : "-8px"})`,
                        transition:
                          "opacity var(--transition-normal, 0.25s ease), transform var(--transition-normal, 0.25s ease)",
                        padding: "8px 0",
                      }}
                    >
                      {item.children!.map((child) => (
                        <Link
                          key={child.href}
                          href={localePath(child.href)}
                          style={{
                            display: "block",
                            padding: "10px 20px",
                            color: "var(--color-neutral-700, #374151)",
                            fontSize: 14,
                            fontWeight: 400,
                            textDecoration: "none",
                            transition: "background var(--transition-normal, 0.25s ease)",
                            whiteSpace: "nowrap",
                          }}
                          onMouseEnter={(e) => {
                            (e.currentTarget as HTMLElement).style.background =
                              "var(--color-neutral-50, #F9FAFB)";
                          }}
                          onMouseLeave={(e) => {
                            (e.currentTarget as HTMLElement).style.background = "transparent";
                          }}
                        >
                          {child.label}
                        </Link>
                      ))}
                    </div>
                    </div>
                  </div>
                );
              }

              return (
                <Link
                  key={item.href}
                  href={localePath(item.href)}
                  style={{
                    color: active
                      ? "var(--color-white, #FFFFFF)"
                      : "rgba(255, 255, 255, 0.85)",
                    fontSize: 14,
                    fontWeight: 500,
                    textDecoration: "none",
                    padding: "8px 0",
                    display: "inline-block",
                    transition: "color var(--transition-normal, 0.25s ease)",
                    borderBottom: active
                      ? "2px solid var(--color-secondary, #C9963B)"
                      : "2px solid transparent",
                  }}
                  onMouseEnter={(e) => {
                    if (!active)
                      (e.currentTarget as HTMLElement).style.borderBottomColor =
                        "var(--color-secondary, #C9963B)";
                  }}
                  onMouseLeave={(e) => {
                    if (!active)
                      (e.currentTarget as HTMLElement).style.borderBottomColor = "transparent";
                  }}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* Right Actions */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "var(--gap-md, 16px)",
            }}
          >
            {/* Contact (phone or email) */}
            {config.cta?.phone && (
              <a
                href={config.cta.phone.includes("@") ? `mailto:${config.cta.phone}` : `tel:${config.cta.phone.replace(/[^\d+]/g, "")}`}
                style={{
                  color: "rgba(255, 255, 255, 0.85)",
                  fontSize: 14,
                  textDecoration: "none",
                  whiteSpace: "nowrap",
                  transition: "color var(--transition-normal, 0.25s ease)",
                }}
                className="max-md:!hidden"
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.color = "var(--color-white, #FFFFFF)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.color = "rgba(255, 255, 255, 0.85)";
                }}
              >
                {config.cta.phone.includes("@") ? "✉" : "\uD83D\uDCDE"} {config.cta.phone}
              </a>
            )}

            {/* Locale Toggle */}
            {config.localeToggle && (
              <Link
                href={localePathSwitch}
                style={{
                  color: "rgba(255, 255, 255, 0.85)",
                  fontSize: 12,
                  fontWeight: 500,
                  textDecoration: "none",
                  border: "1px solid rgba(255, 255, 255, 0.4)",
                  borderRadius: "var(--radius-sm, 4px)",
                  padding: "4px 10px",
                  transition: "all var(--transition-normal, 0.25s ease)",
                  lineHeight: 1,
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.borderColor =
                    "rgba(255, 255, 255, 0.8)";
                  (e.currentTarget as HTMLElement).style.color = "var(--color-white, #FFFFFF)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.borderColor =
                    "rgba(255, 255, 255, 0.4)";
                  (e.currentTarget as HTMLElement).style.color = "rgba(255, 255, 255, 0.85)";
                }}
              >
                {locale === "zh" ? "EN" : "中"}
              </Link>
            )}

            {/* CTA Button */}
            {config.cta && (
              <Link
                href={localePath(config.cta.href)}
                style={{
                  background: "var(--color-secondary, #C9963B)",
                  color: "var(--color-white, #FFFFFF)",
                  fontSize: 14,
                  fontWeight: 600,
                  textDecoration: "none",
                  padding: "8px 20px",
                  borderRadius: "var(--radius-md, 6px)",
                  transition: "background var(--transition-normal, 0.25s ease)",
                  whiteSpace: "nowrap",
                }}
                className="max-md:!hidden"
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.background =
                    "var(--color-secondary-light, #D4A94F)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.background =
                    "var(--color-secondary, #C9963B)";
                }}
              >
                {config.cta.label}
              </Link>
            )}

            {/* Mobile Hamburger */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(true)}
              aria-label="Open menu"
              style={{
                display: "none",
                background: "transparent",
                border: "none",
                color: "var(--color-white, #FFFFFF)",
                fontSize: 24,
                cursor: "pointer",
                padding: 4,
                lineHeight: 1,
              }}
              className="max-md:!inline-flex"
            >
              &#9776;
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer Overlay */}
      <div
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 99,
          background: "rgba(0, 0, 0, 0.5)",
          opacity: mobileMenuOpen ? 1 : 0,
          pointerEvents: mobileMenuOpen ? "auto" : "none",
          transition: "opacity var(--transition-normal, 0.25s ease)",
        }}
        onClick={() => setMobileMenuOpen(false)}
        aria-hidden="true"
      />

      {/* Mobile Drawer */}
      <div
        style={{
          position: "fixed",
          top: 0,
          right: 0,
          bottom: 0,
          width: "min(320px, 85vw)",
          zIndex: 100,
          background: "var(--color-primary-dark, #0F1A32)",
          transform: mobileMenuOpen ? "translateX(0)" : "translateX(100%)",
          transition: "transform var(--transition-normal, 0.25s ease)",
          display: "flex",
          flexDirection: "column",
          overflowY: "auto",
        }}
      >
        {/* Drawer Header */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "0 var(--container-padding, 24px)",
            height: 60,
            borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
            flexShrink: 0,
          }}
        >
          <span
            style={{
              color: "var(--color-white, #FFFFFF)",
              fontWeight: 700,
              fontSize: 16,
            }}
          >
            {config.logo?.text || "宇律师事务所"}
          </span>
          <button
            type="button"
            onClick={() => setMobileMenuOpen(false)}
            aria-label="Close menu"
            style={{
              background: "transparent",
              border: "none",
              color: "var(--color-white, #FFFFFF)",
              fontSize: 24,
              cursor: "pointer",
              padding: 4,
              lineHeight: 1,
            }}
          >
            &#x2715;
          </button>
        </div>

        {/* Drawer Nav */}
        <nav
          style={{
            flex: 1,
            padding: "var(--gap-lg, 24px) var(--container-padding, 24px)",
            display: "flex",
            flexDirection: "column",
            gap: 4,
          }}
        >
          {config.nav?.map((item) => (
            <div key={item.href}>
              <Link
                href={localePath(item.href)}
                onClick={() => setMobileMenuOpen(false)}
                style={{
                  display: "block",
                  color: isActive(item.href)
                    ? "var(--color-secondary, #C9963B)"
                    : "var(--color-white, #FFFFFF)",
                  fontSize: 16,
                  fontWeight: 500,
                  textDecoration: "none",
                  padding: "12px 0",
                  borderBottom: "1px solid rgba(255, 255, 255, 0.06)",
                }}
              >
                {item.label}
              </Link>
              {item.children && item.children.length > 0 && (
                <div style={{ paddingLeft: 16 }}>
                  {item.children.map((child) => (
                    <Link
                      key={child.href}
                      href={localePath(child.href)}
                      onClick={() => setMobileMenuOpen(false)}
                      style={{
                        display: "block",
                        color: isActive(child.href)
                          ? "var(--color-secondary, #C9963B)"
                          : "rgba(255, 255, 255, 0.7)",
                        fontSize: 14,
                        fontWeight: 400,
                        textDecoration: "none",
                        padding: "10px 0",
                        borderBottom: "1px solid rgba(255, 255, 255, 0.04)",
                      }}
                    >
                      {child.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
        </nav>

        {/* Drawer CTA */}
        {config.cta && (
          <div
            style={{
              padding: "var(--gap-lg, 24px) var(--container-padding, 24px)",
              borderTop: "1px solid rgba(255, 255, 255, 0.1)",
              flexShrink: 0,
            }}
          >
            {config.cta.phone && (
              <a
                href={config.cta.phone.includes("@") ? `mailto:${config.cta.phone}` : `tel:${config.cta.phone.replace(/[^\d+]/g, "")}`}
                style={{
                  display: "block",
                  color: "rgba(255, 255, 255, 0.85)",
                  fontSize: 14,
                  textDecoration: "none",
                  marginBottom: 16,
                  textAlign: "center",
                }}
              >
                {config.cta.phone.includes("@") ? "✉" : "\uD83D\uDCDE"} {config.cta.phone}
              </a>
            )}
            <Link
              href={localePath(config.cta.href)}
              onClick={() => setMobileMenuOpen(false)}
              style={{
                display: "block",
                background: "var(--color-secondary, #C9963B)",
                color: "var(--color-white, #FFFFFF)",
                fontSize: 16,
                fontWeight: 600,
                textDecoration: "none",
                padding: "12px 24px",
                borderRadius: "var(--radius-md, 6px)",
                textAlign: "center",
                transition: "background var(--transition-normal, 0.25s ease)",
              }}
            >
              {config.cta.label}
            </Link>
          </div>
        )}
      </div>
    </>
  );
}
