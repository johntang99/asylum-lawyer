interface SectionHeaderProps {
  label?: string;
  title: string;
  subtitle?: string;
  className?: string;
  light?: boolean;
}

export default function SectionHeader({
  label,
  title,
  subtitle,
  className = "",
  light = false,
}: SectionHeaderProps) {
  return (
    <div className={`text-center max-w-[700px] mx-auto mb-12 ${className}`}>
      {label && (
        <span className="inline-block text-xs font-semibold text-[#C9963B] uppercase tracking-[0.1em] mb-3">
          {label}
        </span>
      )}

      <h2
        className={`font-heading font-bold ${
          light ? "text-white" : "text-gray-900"
        } text-[30px] md:text-[36px] leading-tight tracking-[-0.01em]`}
      >
        {title}
      </h2>

      {subtitle && (
        <p
          className={`text-[17px] mt-4 ${
            light ? "text-white/70" : "text-gray-500"
          }`}
        >
          {subtitle}
        </p>
      )}
    </div>
  );
}
