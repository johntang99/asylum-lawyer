/**
 * HomeSectionsPanel — Form editing for all sections in home.json
 * Handles the sections[] array structure with type-based rendering.
 */

import { useState } from 'react';

interface HomeSectionsPanelProps {
  sections: any[];
  seo?: { title?: string; description?: string; h1?: string };
  updateFormValue: (path: string[], value: any) => void;
  openImagePicker: (path: string[]) => void;
}

const HERO_VARIANT_OPTIONS = [
  'stats-bar',
  'centered',
  'split-photo-right',
  'split-photo-left',
  'photo-background',
  'overlap',
  'video-background',
];

function SectionWrapper({
  title,
  children,
  defaultOpen = false,
}: {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border border-gray-200 rounded-lg">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-4 py-3 text-xs font-semibold text-gray-600 uppercase hover:bg-gray-50"
      >
        <span>{title}</span>
        <span className="text-gray-400">{open ? '▾' : '▸'}</span>
      </button>
      {open && <div className="px-4 pb-4 space-y-3">{children}</div>}
    </div>
  );
}

function TextField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div>
      <label className="block text-xs text-gray-500">{label}</label>
      <input
        className="mt-1 w-full rounded-md border border-gray-200 px-3 py-2 text-sm"
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}

function TextArea({
  label,
  value,
  onChange,
  rows = 3,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  rows?: number;
}) {
  return (
    <div>
      <label className="block text-xs text-gray-500">{label}</label>
      <textarea
        className="mt-1 w-full rounded-md border border-gray-200 px-3 py-2 text-sm"
        value={value || ''}
        rows={rows}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}

function ImageField({
  label,
  value,
  path,
  updateFormValue,
  openImagePicker,
}: {
  label: string;
  value: string;
  path: string[];
  updateFormValue: (path: string[], value: any) => void;
  openImagePicker: (path: string[]) => void;
}) {
  return (
    <div>
      <label className="block text-xs text-gray-500">{label}</label>
      <div className="mt-1 flex gap-2">
        <input
          className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm"
          value={value || ''}
          onChange={(e) => updateFormValue(path, e.target.value)}
        />
        <button
          type="button"
          onClick={() => openImagePicker(path)}
          className="px-3 rounded-md border border-gray-200 text-xs whitespace-nowrap"
        >
          Choose
        </button>
      </div>
    </div>
  );
}

function SelectField({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: string[];
  onChange: (v: string) => void;
}) {
  return (
    <div>
      <label className="block text-xs text-gray-500">{label}</label>
      <select
        className="mt-1 w-full rounded-md border border-gray-200 px-3 py-2 text-sm bg-white"
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
      >
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
    </div>
  );
}

function ArrayItemEditor({
  items,
  basePath,
  fields,
  updateFormValue,
  openImagePicker,
  itemLabel,
}: {
  items: any[];
  basePath: string[];
  fields: Array<{
    key: string;
    label: string;
    type: 'text' | 'textarea' | 'image';
  }>;
  updateFormValue: (path: string[], value: any) => void;
  openImagePicker: (path: string[]) => void;
  itemLabel: (item: any, i: number) => string;
}) {
  return (
    <div className="space-y-3">
      {items.map((item, i) => (
        <div key={i} className="border border-gray-100 rounded p-3 bg-gray-50/50">
          <div className="text-[11px] font-medium text-gray-400 mb-2">
            {itemLabel(item, i)}
          </div>
          <div className="space-y-2">
            {fields.map((field) => {
              const path = [...basePath, String(i), field.key];
              if (field.type === 'textarea') {
                return (
                  <TextArea
                    key={field.key}
                    label={field.label}
                    value={item[field.key] || ''}
                    onChange={(v) => updateFormValue(path, v)}
                  />
                );
              }
              if (field.type === 'image') {
                return (
                  <ImageField
                    key={field.key}
                    label={field.label}
                    value={item[field.key] || ''}
                    path={path}
                    updateFormValue={updateFormValue}
                    openImagePicker={openImagePicker}
                  />
                );
              }
              return (
                <TextField
                  key={field.key}
                  label={field.label}
                  value={item[field.key] || ''}
                  onChange={(v) => updateFormValue(path, v)}
                />
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}

export function HomeSectionsPanel({
  sections,
  seo,
  updateFormValue,
  openImagePicker,
}: HomeSectionsPanelProps) {
  const sp = (sectionIndex: number, ...rest: string[]) => [
    'sections',
    String(sectionIndex),
    ...rest,
  ];

  return (
    <div className="space-y-3">
      {/* Page SEO */}
      {seo && (
        <SectionWrapper title="Page SEO" defaultOpen={false}>
          <TextField
            label="Meta Title"
            value={seo.title || ''}
            onChange={(v) => updateFormValue(['seo', 'title'], v)}
          />
          <TextArea
            label="Meta Description"
            value={seo.description || ''}
            onChange={(v) => updateFormValue(['seo', 'description'], v)}
          />
          <TextField
            label="H1"
            value={seo.h1 || ''}
            onChange={(v) => updateFormValue(['seo', 'h1'], v)}
          />
        </SectionWrapper>
      )}

      {sections.map((section, idx) => {
        switch (section.type) {
          case 'hero':
            return (
              <SectionWrapper key={idx} title="Hero Section" defaultOpen>
                <SelectField
                  label="Variant"
                  value={section.variant || 'stats-bar'}
                  options={HERO_VARIANT_OPTIONS}
                  onChange={(v) => updateFormValue(sp(idx, 'variant'), v)}
                />
                <TextField
                  label="Headline"
                  value={section.headline}
                  onChange={(v) => updateFormValue(sp(idx, 'headline'), v)}
                />
                <TextArea
                  label="Subheadline"
                  value={section.subheadline}
                  onChange={(v) => updateFormValue(sp(idx, 'subheadline'), v)}
                />
                <ImageField
                  label="Hero Image"
                  value={section.image || ''}
                  path={sp(idx, 'image')}
                  updateFormValue={updateFormValue}
                  openImagePicker={openImagePicker}
                />
                <ImageField
                  label="Background Image"
                  value={section.backgroundImage || ''}
                  path={sp(idx, 'backgroundImage')}
                  updateFormValue={updateFormValue}
                  openImagePicker={openImagePicker}
                />
                <div className="border-t pt-3 mt-3">
                  <div className="text-[11px] font-medium text-gray-400 mb-2">PRIMARY CTA</div>
                  <TextField
                    label="Label"
                    value={section.cta?.primary?.label}
                    onChange={(v) => updateFormValue(sp(idx, 'cta', 'primary', 'label'), v)}
                  />
                  <TextField
                    label="Link"
                    value={section.cta?.primary?.href}
                    onChange={(v) => updateFormValue(sp(idx, 'cta', 'primary', 'href'), v)}
                  />
                </div>
                <div className="border-t pt-3 mt-1">
                  <div className="text-[11px] font-medium text-gray-400 mb-2">SECONDARY CTA</div>
                  <TextField
                    label="Label"
                    value={section.cta?.secondary?.label}
                    onChange={(v) => updateFormValue(sp(idx, 'cta', 'secondary', 'label'), v)}
                  />
                  <TextField
                    label="Link"
                    value={section.cta?.secondary?.href}
                    onChange={(v) => updateFormValue(sp(idx, 'cta', 'secondary', 'href'), v)}
                  />
                </div>
                {Array.isArray(section.stats) && (
                  <div className="border-t pt-3 mt-1">
                    <div className="text-[11px] font-medium text-gray-400 mb-2">
                      STATS ({section.stats.length})
                    </div>
                    <ArrayItemEditor
                      items={section.stats}
                      basePath={sp(idx, 'stats')}
                      fields={[
                        { key: 'value', label: 'Value', type: 'text' },
                        { key: 'label', label: 'Label', type: 'text' },
                      ]}
                      updateFormValue={updateFormValue}
                      openImagePicker={openImagePicker}
                      itemLabel={(item) => `${item.value || ''} ${item.label || ''}`}
                    />
                  </div>
                )}
              </SectionWrapper>
            );

          case 'serviceOverview':
            return (
              <SectionWrapper key={idx} title="Service Overview">
                <TextField
                  label="Headline"
                  value={section.headline}
                  onChange={(v) => updateFormValue(sp(idx, 'headline'), v)}
                />
                <TextArea
                  label="Subheadline"
                  value={section.subheadline}
                  onChange={(v) => updateFormValue(sp(idx, 'subheadline'), v)}
                />
                {Array.isArray(section.services) && (
                  <div className="border-t pt-3 mt-1">
                    <div className="text-[11px] font-medium text-gray-400 mb-2">
                      SERVICES ({section.services.length})
                    </div>
                    <ArrayItemEditor
                      items={section.services}
                      basePath={sp(idx, 'services')}
                      fields={[
                        { key: 'title', label: 'Title', type: 'text' },
                        { key: 'description', label: 'Description', type: 'textarea' },
                        { key: 'href', label: 'Link', type: 'text' },
                        { key: 'icon', label: 'Icon', type: 'text' },
                      ]}
                      updateFormValue={updateFormValue}
                      openImagePicker={openImagePicker}
                      itemLabel={(item) => item.title || 'Untitled'}
                    />
                  </div>
                )}
              </SectionWrapper>
            );

          case 'whyUs':
            return (
              <SectionWrapper key={idx} title="Why Us">
                <TextField
                  label="Headline"
                  value={section.headline}
                  onChange={(v) => updateFormValue(sp(idx, 'headline'), v)}
                />
                <TextArea
                  label="Subheadline"
                  value={section.subheadline}
                  onChange={(v) => updateFormValue(sp(idx, 'subheadline'), v)}
                />
                {Array.isArray(section.pillars) && (
                  <div className="border-t pt-3 mt-1">
                    <div className="text-[11px] font-medium text-gray-400 mb-2">
                      PILLARS ({section.pillars.length})
                    </div>
                    <ArrayItemEditor
                      items={section.pillars}
                      basePath={sp(idx, 'pillars')}
                      fields={[
                        { key: 'title', label: 'Title', type: 'text' },
                        { key: 'description', label: 'Description', type: 'textarea' },
                      ]}
                      updateFormValue={updateFormValue}
                      openImagePicker={openImagePicker}
                      itemLabel={(item) => item.title || 'Untitled'}
                    />
                  </div>
                )}
              </SectionWrapper>
            );

          case 'processTimeline':
            return (
              <SectionWrapper key={idx} title="Process Timeline">
                <TextField
                  label="Headline"
                  value={section.headline}
                  onChange={(v) => updateFormValue(sp(idx, 'headline'), v)}
                />
                <TextArea
                  label="Subheadline"
                  value={section.subheadline}
                  onChange={(v) => updateFormValue(sp(idx, 'subheadline'), v)}
                />
                {Array.isArray(section.steps) && (
                  <div className="border-t pt-3 mt-1">
                    <div className="text-[11px] font-medium text-gray-400 mb-2">
                      STEPS ({section.steps.length})
                    </div>
                    <ArrayItemEditor
                      items={section.steps}
                      basePath={sp(idx, 'steps')}
                      fields={[
                        { key: 'title', label: 'Title', type: 'text' },
                        { key: 'description', label: 'Description', type: 'textarea' },
                      ]}
                      updateFormValue={updateFormValue}
                      openImagePicker={openImagePicker}
                      itemLabel={(item, i) => `Step ${i + 1}: ${item.title || ''}`}
                    />
                  </div>
                )}
              </SectionWrapper>
            );

          case 'attorneyBrief':
            return (
              <SectionWrapper key={idx} title="Attorney Brief">
                <TextField
                  label="Headline"
                  value={section.headline}
                  onChange={(v) => updateFormValue(sp(idx, 'headline'), v)}
                />
                <TextField
                  label="Name"
                  value={section.name}
                  onChange={(v) => updateFormValue(sp(idx, 'name'), v)}
                />
                <TextField
                  label="Name (EN)"
                  value={section.nameEN}
                  onChange={(v) => updateFormValue(sp(idx, 'nameEN'), v)}
                />
                <TextField
                  label="Title"
                  value={section.title}
                  onChange={(v) => updateFormValue(sp(idx, 'title'), v)}
                />
                <TextArea
                  label="Bio"
                  value={section.bio}
                  onChange={(v) => updateFormValue(sp(idx, 'bio'), v)}
                  rows={5}
                />
                <ImageField
                  label="Photo"
                  value={section.photo || ''}
                  path={sp(idx, 'photo')}
                  updateFormValue={updateFormValue}
                  openImagePicker={openImagePicker}
                />
                {Array.isArray(section.credentials) && (
                  <div className="border-t pt-3 mt-1">
                    <div className="text-[11px] font-medium text-gray-400 mb-2">CREDENTIALS</div>
                    {section.credentials.map((cred: string, ci: number) => (
                      <TextField
                        key={ci}
                        label={`Credential ${ci + 1}`}
                        value={cred}
                        onChange={(v) => updateFormValue(sp(idx, 'credentials', String(ci)), v)}
                      />
                    ))}
                  </div>
                )}
                <div className="border-t pt-3 mt-1">
                  <div className="text-[11px] font-medium text-gray-400 mb-2">CTA</div>
                  <TextField
                    label="Label"
                    value={section.cta?.label}
                    onChange={(v) => updateFormValue(sp(idx, 'cta', 'label'), v)}
                  />
                  <TextField
                    label="Link"
                    value={section.cta?.href}
                    onChange={(v) => updateFormValue(sp(idx, 'cta', 'href'), v)}
                  />
                </div>
              </SectionWrapper>
            );

          case 'faqPreview':
            return (
              <SectionWrapper key={idx} title="FAQ Preview">
                <TextField
                  label="Headline"
                  value={section.headline}
                  onChange={(v) => updateFormValue(sp(idx, 'headline'), v)}
                />
                <TextArea
                  label="Subheadline"
                  value={section.subheadline}
                  onChange={(v) => updateFormValue(sp(idx, 'subheadline'), v)}
                />
                {Array.isArray(section.faqs) && (
                  <div className="border-t pt-3 mt-1">
                    <div className="text-[11px] font-medium text-gray-400 mb-2">
                      FAQ ITEMS ({section.faqs.length})
                    </div>
                    <ArrayItemEditor
                      items={section.faqs}
                      basePath={sp(idx, 'faqs')}
                      fields={[
                        { key: 'question', label: 'Question', type: 'text' },
                        { key: 'answer', label: 'Answer', type: 'textarea' },
                      ]}
                      updateFormValue={updateFormValue}
                      openImagePicker={openImagePicker}
                      itemLabel={(item) => item.question || 'Untitled'}
                    />
                  </div>
                )}
                <div className="border-t pt-3 mt-1">
                  <div className="text-[11px] font-medium text-gray-400 mb-2">CTA</div>
                  <TextField
                    label="Label"
                    value={section.cta?.label}
                    onChange={(v) => updateFormValue(sp(idx, 'cta', 'label'), v)}
                  />
                  <TextField
                    label="Link"
                    value={section.cta?.href}
                    onChange={(v) => updateFormValue(sp(idx, 'cta', 'href'), v)}
                  />
                </div>
              </SectionWrapper>
            );

          case 'contactCta':
            return (
              <SectionWrapper key={idx} title="Contact CTA">
                <TextField
                  label="Headline"
                  value={section.headline}
                  onChange={(v) => updateFormValue(sp(idx, 'headline'), v)}
                />
                <TextArea
                  label="Subheadline"
                  value={section.subheadline}
                  onChange={(v) => updateFormValue(sp(idx, 'subheadline'), v)}
                />
                <div className="border-t pt-3 mt-1">
                  <div className="text-[11px] font-medium text-gray-400 mb-2">PRIMARY CTA</div>
                  <TextField
                    label="Label"
                    value={section.cta?.primary?.label}
                    onChange={(v) => updateFormValue(sp(idx, 'cta', 'primary', 'label'), v)}
                  />
                  <TextField
                    label="Link"
                    value={section.cta?.primary?.href}
                    onChange={(v) => updateFormValue(sp(idx, 'cta', 'primary', 'href'), v)}
                  />
                </div>
                <div className="border-t pt-3 mt-1">
                  <div className="text-[11px] font-medium text-gray-400 mb-2">SECONDARY CTA</div>
                  <TextField
                    label="Label"
                    value={section.cta?.secondary?.label}
                    onChange={(v) => updateFormValue(sp(idx, 'cta', 'secondary', 'label'), v)}
                  />
                  <TextField
                    label="Link"
                    value={section.cta?.secondary?.href}
                    onChange={(v) => updateFormValue(sp(idx, 'cta', 'secondary', 'href'), v)}
                  />
                </div>
                <div className="border-t pt-3 mt-1">
                  <div className="text-[11px] font-medium text-gray-400 mb-2">WECHAT</div>
                  <TextField
                    label="Label"
                    value={section.wechat?.label}
                    onChange={(v) => updateFormValue(sp(idx, 'wechat', 'label'), v)}
                  />
                  <TextField
                    label="WeChat ID"
                    value={section.wechat?.id}
                    onChange={(v) => updateFormValue(sp(idx, 'wechat', 'id'), v)}
                  />
                </div>
              </SectionWrapper>
            );

          case 'trustBar':
            return (
              <SectionWrapper key={idx} title="Trust Bar">
                {Array.isArray(section.items) && (
                  <ArrayItemEditor
                    items={section.items}
                    basePath={sp(idx, 'items')}
                    fields={[
                      { key: 'label', label: 'Label', type: 'text' },
                      { key: 'icon', label: 'Icon', type: 'text' },
                    ]}
                    updateFormValue={updateFormValue}
                    openImagePicker={openImagePicker}
                    itemLabel={(item) => item.label || 'Untitled'}
                  />
                )}
              </SectionWrapper>
            );

          default:
            return (
              <SectionWrapper key={idx} title={`Section: ${section.type || 'unknown'}`}>
                <p className="text-xs text-gray-400">
                  No form schema for section type &ldquo;{section.type}&rdquo;. Use the JSON tab to edit.
                </p>
              </SectionWrapper>
            );
        }
      })}
    </div>
  );
}
