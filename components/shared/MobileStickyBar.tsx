"use client";

interface MobileStickyBarProps {
  phone?: string;
  email?: string;
  wechatId?: string;
}

function normalizePhone(phone?: string) {
  const trimmed = (phone || "").trim();
  const digits = trimmed.replace(/[^\d+]/g, "");
  return digits.length >= 7 ? digits : "";
}

export default function MobileStickyBar({
  phone,
  email,
  wechatId,
}: MobileStickyBarProps) {
  const normalizedPhone = normalizePhone(phone);
  const normalizedEmail = (email || "").trim();
  const hasCallablePhone = normalizedPhone.length > 0;
  const primaryHref =
    hasCallablePhone
      ? `tel:${normalizedPhone}`
      : normalizedEmail
        ? `mailto:${normalizedEmail}`
        : undefined;
  const primaryLabel = hasCallablePhone ? "立即拨打" : "发送邮件";
  const primaryIcon = hasCallablePhone ? "📞" : "✉";

  return (
    <>
      {/* Spacer to prevent content from being hidden behind the sticky bar on mobile */}
      <div className="block md:hidden h-14" />

      <div className="block md:hidden fixed bottom-0 left-0 right-0 h-14 z-40 bg-[#1B2A4A] shadow-[0_-2px_10px_rgba(0,0,0,0.15)]">
        <div className="flex h-full">
          {primaryHref ? (
            <a
              href={primaryHref}
              className="flex-1 flex items-center justify-center text-white text-sm font-semibold hover:bg-white/10 transition-colors"
            >
              <span className="mr-1.5">{primaryIcon}</span>
              {primaryLabel}
            </a>
          ) : (
            <button
              type="button"
              className="flex-1 flex items-center justify-center text-white text-sm font-semibold opacity-70 cursor-not-allowed"
              disabled
            >
              <span className="mr-1.5">{primaryIcon}</span>
              暂无电话
            </button>
          )}

          <button
            type="button"
            onClick={() =>
              alert(
                wechatId
                  ? `请添加微信号咨询：${wechatId}`
                  : "请添加微信号咨询，我们将尽快回复您。"
              )
            }
            className="flex-1 flex items-center justify-center text-white text-sm font-semibold border-l border-white/15 hover:bg-white/10 transition-colors"
          >
            <span className="mr-1.5">💬</span>
            微信咨询
          </button>
        </div>
      </div>
    </>
  );
}
