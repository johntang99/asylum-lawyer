import Link from "next/link";

interface LegalDisclaimerProps {
  disclaimer?: string;
}

const defaultDisclaimer =
  "本站内容仅供一般信息参考，不构成法律意见。浏览本网站或与律师的初步沟通不构成律师-客户关系。";

export default function LegalDisclaimer({ disclaimer }: LegalDisclaimerProps) {
  return (
    <section className="py-4 text-center" style={{ backgroundColor: "#F3F4F6" }}>
      <div className="max-w-7xl mx-auto px-6">
        <p className="text-xs text-gray-500">
          {disclaimer ?? defaultDisclaimer}
          <Link
            href="/disclaimer"
            className="ml-2 underline text-gray-500 hover:text-gray-700 transition-colors duration-200"
          >
            查看完整法律免责声明
          </Link>
        </p>
      </div>
    </section>
  );
}
