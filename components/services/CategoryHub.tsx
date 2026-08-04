import Link from 'next/link';
import SectionHeader from '@/components/shared/SectionHeader';
import { serviceHref, type PublicService, type ServiceCategory } from '@/lib/services';

/* eslint-disable @typescript-eslint/no-explicit-any */

function MatterCard({
  item,
}: {
  item: { title: string; description?: string };
}) {
  return (
    <div className="bg-white border border-gray-200 rounded-lg px-6 py-5">
      <div className="flex items-start gap-3">
        <span
          className="mt-1 flex-shrink-0 font-bold"
          style={{ color: 'var(--secondary)' }}
        >
          ✓
        </span>
        <div>
          <h3 className="text-base font-semibold text-gray-900">{item.title}</h3>
          {item.description && (
            <p className="text-sm text-gray-500 leading-relaxed mt-1">
              {item.description}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

interface CategoryHubProps {
  locale: string;
  category: ServiceCategory;
  services: PublicService[];
  siteInfo?: any;
}

/**
 * Hub page for one service category: lists every matter type in the category.
 * Items backed by a full detail page link through; the rest are covered inline
 * so the hub still ranks for their long-tail terms.
 */
export default function CategoryHub({
  locale,
  category,
  services,
  siteInfo,
}: CategoryHubProps) {
  const phone = siteInfo?.phone || '';
  const consultationHref = `/${locale}/consultation`;
  const detailSlugs = new Set(services.map((service) => service.slug));
  const notCoveredByDetail = (item: { slug?: string }) =>
    !item.slug || !detailSlugs.has(item.slug);

  // Items already covered by a detail page shouldn't repeat in the inline list.
  const inlineItems = category.items.filter(notCoveredByDetail);
  const inlineGroups = category.groups
    .map((group) => ({ ...group, items: group.items.filter(notCoveredByDetail) }))
    .filter((group) => group.items.length > 0);
  const hasInline = inlineItems.length > 0 || inlineGroups.length > 0;

  return (
    <main>
      {/* ── Hero ── */}
      <section
        className="flex items-center"
        style={{
          marginTop: '72px',
          background:
            'linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%)',
        }}
      >
        <div className="max-w-[1200px] mx-auto px-6 py-16 w-full">
          <nav className="mb-4">
            <ol className="flex items-center gap-2 text-sm text-white/60">
              <li>
                <Link href={`/${locale}`} className="hover:text-white transition-colors">
                  首页
                </Link>
              </li>
              <li>
                <span className="mx-1">&gt;</span>
              </li>
              <li>
                <Link
                  href={`/${locale}/services`}
                  className="hover:text-white transition-colors"
                >
                  服务项目
                </Link>
              </li>
              <li>
                <span className="mx-1">&gt;</span>
              </li>
              <li className="text-white/90">{category.title}</li>
            </ol>
          </nav>

          <div className="flex items-center gap-4 mb-4">
            <span className="text-4xl">{category.icon}</span>
            <h1
              className="text-[2.25rem] md:text-[2.75rem] font-bold text-white leading-tight"
              style={{ fontFamily: 'var(--font-heading)' }}
            >
              {category.seo?.h1 || category.title}
            </h1>
          </div>
          <p className="text-lg text-white/80 max-w-[650px] leading-relaxed mb-8">
            {category.description}
          </p>
          <div className="flex flex-wrap gap-4">
            <Link
              href={consultationHref}
              className="inline-block px-[32px] py-[14px] text-white font-semibold rounded-md transition-colors"
              style={{ backgroundColor: 'var(--accent)' }}
            >
              预约免费咨询
            </Link>
            {phone && (
              <a
                href={`tel:${phone.replace(/[^\d+]/g, '')}`}
                className="inline-block px-[32px] py-[14px] font-semibold rounded-md border border-white text-white bg-transparent transition-colors"
              >
                致电 {phone}
              </a>
            )}
          </div>
        </div>
      </section>

      {/* ── Intro ── */}
      {category.intro && (
        <section className="bg-white py-[64px]">
          <div className="max-w-[1200px] mx-auto px-6">
            <p className="max-w-[800px] text-gray-600 leading-relaxed text-[17px]">
              {category.intro}
            </p>
          </div>
        </section>
      )}

      {/* ── Services with detail pages ── */}
      {services.length > 0 && (
        <section className="bg-white py-[80px]">
          <div className="max-w-[1200px] mx-auto px-6">
            <SectionHeader
              label="重点服务"
              title={`${category.title}常见案件类型`}
              subtitle="点击查看每一类案件的处理流程、所需材料与常见误区"
            />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {services.map((service) => (
                <Link
                  key={service.slug}
                  href={serviceHref(locale, service)}
                  className="group block bg-white border border-gray-200 rounded-lg px-6 py-8 transition-all duration-200 hover:shadow-lg hover:-translate-y-1"
                >
                  <div
                    className="w-14 h-14 rounded-lg mb-5 flex items-center justify-center text-2xl"
                    style={{
                      background:
                        'linear-gradient(135deg, var(--primary), var(--primary-dark))',
                      color: 'var(--secondary)',
                    }}
                  >
                    {service.icon}
                  </div>
                  <h3 className="text-[1.25rem] font-semibold text-gray-900 mb-2">
                    {service.title}
                  </h3>
                  <p className="text-sm text-gray-500 mb-4 leading-relaxed line-clamp-3">
                    {service.description}
                  </p>
                  <span
                    className="text-sm font-semibold"
                    style={{ color: 'var(--secondary)' }}
                  >
                    了解详情 →
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── Remaining matter types covered inline ── */}
      {hasInline && (
        <section className="py-[80px]" style={{ backgroundColor: '#F9FAFB' }}>
          <div className="max-w-[1200px] mx-auto px-6">
            <SectionHeader
              label="更多服务"
              title="我们还处理以下情况"
              subtitle="如果您的问题不在上方列表中，也欢迎直接咨询"
            />

            {inlineItems.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-[960px] mx-auto">
                {inlineItems.map((item, i) => (
                  <MatterCard key={i} item={item} />
                ))}
              </div>
            )}

            {inlineGroups.map((group, gi) => (
              <div key={gi} className="max-w-[960px] mx-auto mt-10 first:mt-0">
                <h3
                  className="text-lg font-bold text-gray-900 mb-4 pb-2 border-b-2 inline-block"
                  style={{
                    fontFamily: 'var(--font-heading)',
                    borderColor: 'var(--secondary)',
                  }}
                >
                  {group.title}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {group.items.map((item, i) => (
                    <MatterCard key={i} item={item} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ── CTA ── */}
      <section
        className="py-[80px]"
        style={{
          background:
            'linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%)',
        }}
      >
        <div className="max-w-[1200px] mx-auto px-6">
          <SectionHeader
            light
            title={`遇到${category.title}问题？`}
            subtitle="每个案件都不一样。预约免费咨询，我们先帮您判断可行的解决路径。"
          />
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href={consultationHref}
              className="inline-block px-[36px] py-[16px] text-white font-semibold rounded-md transition-colors"
              style={{ backgroundColor: 'var(--accent)' }}
            >
              预约免费咨询
            </Link>
            {phone && (
              <a
                href={`tel:${phone.replace(/[^\d+]/g, '')}`}
                className="inline-block px-[36px] py-[16px] font-semibold rounded-md border border-white text-white bg-transparent transition-colors"
              >
                致电 {phone}
              </a>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
