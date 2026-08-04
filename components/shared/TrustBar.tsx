interface TrustBarItem {
  icon: string;
  label: string;
}

interface TrustBarProps {
  items?: TrustBarItem[];
}

export default function TrustBar({ items }: TrustBarProps) {
  // No default items: trust claims are per-site and must never be inherited
  // from another firm. Render nothing when the site has not configured any.
  const trustItems = items ?? [];
  if (trustItems.length === 0) return null;

  return (
    <section style={{ backgroundColor: "#1B2A4A" }} className="py-6">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-wrap justify-center md:justify-center items-center gap-6 md:gap-12">
          {trustItems.map((item) => (
            <div key={item.label} className="flex items-center gap-3">
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center shrink-0 text-base"
                style={{
                  backgroundColor: "rgba(201,150,59,0.15)",
                  border: "1px solid #C9963B",
                  color: "#C9963B",
                }}
              >
                {item.icon}
              </div>
              <span
                className="text-sm font-medium whitespace-nowrap"
                style={{ color: "rgba(255,255,255,0.85)" }}
              >
                {item.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
