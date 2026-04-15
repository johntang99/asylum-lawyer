"use client";

interface MobileStickyBarProps {
  phone?: string;
}

export default function MobileStickyBar({ phone = "212-555-0100" }: MobileStickyBarProps) {
  return (
    <>
      {/* Spacer to prevent content from being hidden behind the sticky bar on mobile */}
      <div className="block md:hidden h-14" />

      <div className="block md:hidden fixed bottom-0 left-0 right-0 h-14 z-40 bg-[#1B2A4A] shadow-[0_-2px_10px_rgba(0,0,0,0.15)]">
        <div className="flex h-full">
          <a
            href={`tel:${phone}`}
            className="flex-1 flex items-center justify-center text-white text-sm font-semibold hover:bg-white/10 transition-colors"
          >
            <span className="mr-1.5">📞</span>
            立即拨打
          </a>

          <button
            type="button"
            onClick={() => alert("请添加微信号咨询，我们将尽快回复您。")}
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
