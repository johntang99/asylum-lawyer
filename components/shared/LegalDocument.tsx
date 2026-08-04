import Link from 'next/link';

/* eslint-disable @typescript-eslint/no-explicit-any */

export type LegalBlock =
  | { type: 'p'; text: string }
  | { type: 'ul'; items: string[] }
  | { type: 'ol'; items: string[] };

export interface LegalSection {
  heading?: string;
  blocks: LegalBlock[];
}

export interface LegalDocumentContent {
  seo?: { title?: string; description?: string };
  hero?: { headline?: string; updated?: string };
  breadcrumbLabel?: string;
  /** Highlighted callout rendered above the body (used by the disclaimer). */
  notice?: string;
  sections?: LegalSection[];
  contact?: { heading?: string; lines?: string[] };
}

function normalizeBlocks(blocks: unknown): LegalBlock[] {
  if (!Array.isArray(blocks)) return [];
  return blocks.flatMap((block: any): LegalBlock[] => {
    if (!block || typeof block !== 'object') return [];
    if (block.type === 'p' && typeof block.text === 'string') {
      return [{ type: 'p', text: block.text }];
    }
    if ((block.type === 'ul' || block.type === 'ol') && Array.isArray(block.items)) {
      const items = block.items.filter(
        (item: unknown): item is string => typeof item === 'string'
      );
      return items.length ? [{ type: block.type, items }] : [];
    }
    return [];
  });
}

export function normalizeLegalSections(content: LegalDocumentContent | null) {
  const sections = Array.isArray(content?.sections) ? content!.sections : [];
  return sections
    .map((section) => ({
      heading: typeof section?.heading === 'string' ? section.heading : undefined,
      blocks: normalizeBlocks(section?.blocks),
    }))
    .filter((section) => section.heading || section.blocks.length > 0);
}

/**
 * Renders a policy / terms / disclaimer document entirely from content JSON,
 * so every site ships its own legal text rather than inheriting another
 * firm's. Layout matches the original hand-written legal pages.
 */
export default function LegalDocument({
  locale,
  content,
}: {
  locale: string;
  content: LegalDocumentContent | null;
}) {
  const sections = normalizeLegalSections(content);
  const headline = content?.hero?.headline ?? '';
  const breadcrumbLabel = content?.breadcrumbLabel ?? headline;

  return (
    <>
      {/* ── Compact Hero ── */}
      <section
        className="flex items-center"
        style={{
          marginTop: '72px',
          minHeight: '280px',
          background:
            'linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%)',
        }}
      >
        <div className="max-w-[1200px] mx-auto px-6 py-16 w-full text-center">
          <h1
            className="text-[2.5rem] font-bold text-white mb-3 leading-tight"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            {headline}
          </h1>
          {content?.hero?.updated && (
            <p className="text-white/70 text-lg">{content.hero.updated}</p>
          )}
        </div>
      </section>

      {/* ── Breadcrumbs ── */}
      <div className="bg-gray-50 border-b border-gray-200">
        <div className="max-w-[1200px] mx-auto px-6 py-3">
          <nav className="text-sm text-gray-500">
            <Link href={`/${locale}`} className="hover:text-gray-700 transition-colors">
              首页
            </Link>
            <span className="mx-2">/</span>
            <span className="text-gray-900">{breadcrumbLabel}</span>
          </nav>
        </div>
      </div>

      {/* ── Content ── */}
      <section className="bg-white py-[60px]">
        <div className="max-w-[800px] mx-auto px-6">
          {content?.notice && (
            <div
              className="rounded-lg p-6 mb-10"
              style={{
                backgroundColor: 'rgba(184, 55, 61, 0.06)',
                border: '1px solid rgba(184, 55, 61, 0.2)',
              }}
            >
              <p className="text-gray-800 font-semibold text-[15px] leading-relaxed">
                {content.notice}
              </p>
            </div>
          )}

          <div className="prose prose-gray max-w-none text-gray-700 leading-[1.9] text-[15px] space-y-8">
            {sections.map((section, i) => (
              <div key={i}>
                {section.heading && (
                  <h2
                    className="text-xl font-bold text-gray-900 mb-4"
                    style={{ fontFamily: 'var(--font-heading)' }}
                  >
                    {section.heading}
                  </h2>
                )}
                {section.blocks.map((block, j) => {
                  if (block.type === 'p') {
                    return (
                      <p key={j} className={j > 0 ? 'mt-3' : undefined}>
                        {block.text}
                      </p>
                    );
                  }
                  const ListTag = block.type === 'ol' ? 'ol' : 'ul';
                  return (
                    <ListTag
                      key={j}
                      className={`${
                        block.type === 'ol' ? 'list-decimal' : 'list-disc'
                      } pl-6 space-y-1 mt-3`}
                    >
                      {block.items.map((item, k) => (
                        <li key={k}>{item}</li>
                      ))}
                    </ListTag>
                  );
                })}
              </div>
            ))}

            {content?.contact?.lines?.length ? (
              <div>
                {content.contact.heading && (
                  <h2
                    className="text-xl font-bold text-gray-900 mb-4"
                    style={{ fontFamily: 'var(--font-heading)' }}
                  >
                    {content.contact.heading}
                  </h2>
                )}
                <ul className="list-none pl-0 space-y-1">
                  {content.contact.lines.map((line, i) => (
                    <li key={i}>{line}</li>
                  ))}
                </ul>
              </div>
            ) : null}
          </div>
        </div>
      </section>
    </>
  );
}
