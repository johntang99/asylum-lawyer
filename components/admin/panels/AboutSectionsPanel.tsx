/**
 * AboutSectionsPanel — Form editing for all sections in about.json
 * Handles the sections[] array structure with type-based rendering.
 */

import { useState } from 'react';

interface AboutSectionsPanelProps {
  sections: any[];
  seo?: { title?: string; description?: string; h1?: string };
  updateFormValue: (path: string[], value: any) => void;
  openImagePicker: (path: string[]) => void;
}

const HERO_VARIANT_OPTIONS = [
  'split',
  'centered',
  'split-photo-right',
  'split-photo-left',
  'photo-background',
  'gallery-background',
  'overlap',
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

export function AboutSectionsPanel({
  sections,
  seo,
  updateFormValue,
  openImagePicker,
}: AboutSectionsPanelProps) {
  const sp = (sectionIndex: number, ...rest: string[]) => [
    'sections',
    String(sectionIndex),
    ...rest,
  ];
  const addArrayItem = (path: string[], current: any[], nextItem: any) => {
    updateFormValue(path, [...(Array.isArray(current) ? current : []), nextItem]);
  };
  const removeArrayItem = (path: string[], current: any[], removeIndex: number) => {
    updateFormValue(
      path,
      (Array.isArray(current) ? current : []).filter((_, index) => index !== removeIndex)
    );
  };

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
          case 'hero': {
            const heroGallery = Array.isArray(section.gallery) ? section.gallery : [];
            return (
              <SectionWrapper key={idx} title="Hero Section" defaultOpen>
                <SelectField
                  label="Variant"
                  value={section.variant || 'split'}
                  options={HERO_VARIANT_OPTIONS}
                  onChange={(v) => updateFormValue(sp(idx, 'variant'), v)}
                />
                <TextField
                  label="Headline"
                  value={section.headline}
                  onChange={(v) => updateFormValue(sp(idx, 'headline'), v)}
                />
                <TextField
                  label="Subheadline"
                  value={section.subheadline}
                  onChange={(v) => updateFormValue(sp(idx, 'subheadline'), v)}
                />
                <TextArea
                  label="Intro"
                  value={section.intro}
                  onChange={(v) => updateFormValue(sp(idx, 'intro'), v)}
                />
                <ImageField
                  label="Photo / Image"
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
                <div className="border-t pt-3 mt-1">
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-xs text-gray-500">Gallery Images</label>
                    <button
                      type="button"
                      onClick={() =>
                        updateFormValue(sp(idx, 'gallery'), [...heroGallery, ''])
                      }
                      className="rounded-md border border-gray-200 px-2.5 py-1 text-xs hover:bg-gray-50"
                    >
                      Add Photo
                    </button>
                  </div>
                  <div className="space-y-2">
                    {heroGallery.map((imageUrl: string, imageIndex: number) => (
                      <div key={imageIndex} className="flex gap-2">
                        <input
                          className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm"
                          value={imageUrl || ''}
                          onChange={(event) =>
                            updateFormValue(
                              sp(idx, 'gallery', String(imageIndex)),
                              event.target.value
                            )
                          }
                        />
                        <button
                          type="button"
                          onClick={() =>
                            openImagePicker(sp(idx, 'gallery', String(imageIndex)))
                          }
                          className="px-3 rounded-md border border-gray-200 text-xs"
                        >
                          Choose
                        </button>
                        <button
                          type="button"
                          onClick={() =>
                            updateFormValue(
                              sp(idx, 'gallery'),
                              heroGallery.filter(
                                (_: string, currentIndex: number) => currentIndex !== imageIndex
                              )
                            )
                          }
                          className="px-3 rounded-md border border-red-200 text-xs text-red-600 hover:bg-red-50"
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs text-gray-500">Photo Overlay Opacity (0-1)</label>
                    <input
                      type="number"
                      min={0}
                      max={1}
                      step={0.05}
                      className="mt-1 w-full rounded-md border border-gray-200 px-3 py-2 text-sm"
                      value={
                        typeof section.photoOverlayOpacity === 'number'
                          ? section.photoOverlayOpacity
                          : 0.6
                      }
                      onChange={(event) => {
                        const next = Number(event.target.value);
                        const normalized = Number.isFinite(next)
                          ? Math.min(1, Math.max(0, next))
                          : 0.6;
                        updateFormValue(sp(idx, 'photoOverlayOpacity'), normalized);
                      }}
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500">Photo Content Position</label>
                    <select
                      className="mt-1 w-full rounded-md border border-gray-200 px-3 py-2 text-sm bg-white"
                      value={
                        section.photoContentPosition === 'center' ||
                        section.photoContentPosition === 'center-below' ||
                        section.photoContentPosition === 'left' ||
                        section.photoContentPosition === 'left-below'
                          ? section.photoContentPosition
                          : section.photoContentPosition === 'lower'
                            ? 'left-below'
                            : 'left'
                      }
                      onChange={(event) =>
                        updateFormValue(sp(idx, 'photoContentPosition'), event.target.value)
                      }
                    >
                      <option value="center">Center</option>
                      <option value="center-below">Center Below</option>
                      <option value="left">Left</option>
                      <option value="left-below">Left Below</option>
                    </select>
                  </div>
                </div>
              </SectionWrapper>
            );
          }

          case 'story':
            return (
              <SectionWrapper key={idx} title="Story">
                <TextField
                  label="Headline"
                  value={section.headline}
                  onChange={(v) => updateFormValue(sp(idx, 'headline'), v)}
                />
                <div className="flex items-center justify-between">
                  <div className="text-xs font-semibold text-gray-500 uppercase">
                    Paragraphs ({Array.isArray(section.paragraphs) ? section.paragraphs.length : 0})
                  </div>
                  <button
                    type="button"
                    onClick={() =>
                      addArrayItem(
                        sp(idx, 'paragraphs'),
                        section.paragraphs,
                        ''
                      )
                    }
                    className="rounded-md border border-gray-200 px-2.5 py-1 text-xs hover:bg-gray-50"
                  >
                    Add Paragraph
                  </button>
                </div>
                {Array.isArray(section.paragraphs) &&
                  section.paragraphs.map((para: string, pi: number) => (
                    <div key={pi} className="rounded border border-gray-100 p-3 bg-gray-50/50 space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="text-xs text-gray-500">Paragraph {pi + 1}</div>
                        <button
                          type="button"
                          onClick={() =>
                            removeArrayItem(sp(idx, 'paragraphs'), section.paragraphs, pi)
                          }
                          className="text-xs text-red-600 hover:underline"
                        >
                          Remove
                        </button>
                      </div>
                      <TextArea
                        label="Content"
                        value={para}
                        onChange={(v) =>
                          updateFormValue(sp(idx, 'paragraphs', String(pi)), v)
                        }
                        rows={4}
                      />
                    </div>
                  ))}
              </SectionWrapper>
            );

          case 'credentials':
            return (
              <SectionWrapper key={idx} title="Credentials">
                <TextField
                  label="Headline"
                  value={section.headline}
                  onChange={(v) => updateFormValue(sp(idx, 'headline'), v)}
                />
                <div className="flex items-center justify-between">
                  <div className="text-xs font-semibold text-gray-500 uppercase">
                    Items ({Array.isArray(section.items) ? section.items.length : 0})
                  </div>
                  <button
                    type="button"
                    onClick={() => addArrayItem(sp(idx, 'items'), section.items, '')}
                    className="rounded-md border border-gray-200 px-2.5 py-1 text-xs hover:bg-gray-50"
                  >
                    Add Credential
                  </button>
                </div>
                {Array.isArray(section.items) &&
                  section.items.map((item: string, ci: number) => (
                    <div key={ci} className="rounded border border-gray-100 p-3 bg-gray-50/50 space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="text-xs text-gray-500">Credential {ci + 1}</div>
                        <button
                          type="button"
                          onClick={() => removeArrayItem(sp(idx, 'items'), section.items, ci)}
                          className="text-xs text-red-600 hover:underline"
                        >
                          Remove
                        </button>
                      </div>
                      <TextField
                        label="Text"
                        value={item}
                        onChange={(v) =>
                          updateFormValue(sp(idx, 'items', String(ci)), v)
                        }
                      />
                    </div>
                  ))}
              </SectionWrapper>
            );

          case 'stats':
            return (
              <SectionWrapper key={idx} title="Stats">
                <TextField
                  label="Headline"
                  value={section.headline}
                  onChange={(v) => updateFormValue(sp(idx, 'headline'), v)}
                />
                <div className="flex items-center justify-between">
                  <div className="text-xs font-semibold text-gray-500 uppercase">
                    Items ({Array.isArray(section.items) ? section.items.length : 0})
                  </div>
                  <button
                    type="button"
                    onClick={() =>
                      addArrayItem(sp(idx, 'items'), section.items, { value: '', label: '' })
                    }
                    className="rounded-md border border-gray-200 px-2.5 py-1 text-xs hover:bg-gray-50"
                  >
                    Add Stat
                  </button>
                </div>
                {Array.isArray(section.items) &&
                  section.items.map((item: any, si: number) => (
                    <div
                      key={si}
                      className="border border-gray-100 rounded p-3 bg-gray-50/50"
                    >
                      <div className="flex items-center justify-between text-[11px] font-medium text-gray-400 mb-2">
                        <span>{item.value || ''} {item.label || ''}</span>
                        <button
                          type="button"
                          onClick={() => removeArrayItem(sp(idx, 'items'), section.items, si)}
                          className="text-xs text-red-600 hover:underline"
                        >
                          Remove
                        </button>
                      </div>
                      <div className="space-y-2">
                        <TextField
                          label="Value"
                          value={item.value}
                          onChange={(v) =>
                            updateFormValue(sp(idx, 'items', String(si), 'value'), v)
                          }
                        />
                        <TextField
                          label="Label"
                          value={item.label}
                          onChange={(v) =>
                            updateFormValue(sp(idx, 'items', String(si), 'label'), v)
                          }
                        />
                      </div>
                    </div>
                  ))}
              </SectionWrapper>
            );

          case 'languages':
            return (
              <SectionWrapper key={idx} title="Languages">
                <TextField
                  label="Headline"
                  value={section.headline}
                  onChange={(v) => updateFormValue(sp(idx, 'headline'), v)}
                />
                <TextArea
                  label="Narrative"
                  value={section.narrative}
                  onChange={(v) => updateFormValue(sp(idx, 'narrative'), v)}
                />
                <div className="flex items-center justify-between">
                  <div className="text-xs font-semibold text-gray-500 uppercase">
                    Items ({Array.isArray(section.items) ? section.items.length : 0})
                  </div>
                  <button
                    type="button"
                    onClick={() =>
                      addArrayItem(sp(idx, 'items'), section.items, {
                        language: '',
                        level: '',
                        description: '',
                      })
                    }
                    className="rounded-md border border-gray-200 px-2.5 py-1 text-xs hover:bg-gray-50"
                  >
                    Add Language
                  </button>
                </div>
                {Array.isArray(section.items) &&
                  section.items.map((item: any, li: number) => (
                    <div
                      key={li}
                      className="border border-gray-100 rounded p-3 bg-gray-50/50"
                    >
                      <div className="flex items-center justify-between text-[11px] font-medium text-gray-400 mb-2">
                        <span>{item.language || `Language ${li + 1}`}</span>
                        <button
                          type="button"
                          onClick={() => removeArrayItem(sp(idx, 'items'), section.items, li)}
                          className="text-xs text-red-600 hover:underline"
                        >
                          Remove
                        </button>
                      </div>
                      <div className="space-y-2">
                        <TextField
                          label="Language"
                          value={item.language}
                          onChange={(v) =>
                            updateFormValue(sp(idx, 'items', String(li), 'language'), v)
                          }
                        />
                        <TextField
                          label="Level"
                          value={item.level}
                          onChange={(v) =>
                            updateFormValue(sp(idx, 'items', String(li), 'level'), v)
                          }
                        />
                        <TextArea
                          label="Description"
                          value={item.description}
                          onChange={(v) =>
                            updateFormValue(
                              sp(idx, 'items', String(li), 'description'),
                              v
                            )
                          }
                        />
                      </div>
                    </div>
                  ))}
              </SectionWrapper>
            );

          case 'office':
            return (
              <SectionWrapper key={idx} title="Office">
                <TextField
                  label="Headline"
                  value={section.headline}
                  onChange={(v) => updateFormValue(sp(idx, 'headline'), v)}
                />
                <div className="border-t pt-3 mt-1">
                  <div className="text-[11px] font-medium text-gray-400 mb-2">ADDRESS</div>
                  <TextField
                    label="Street"
                    value={section.address?.street}
                    onChange={(v) => updateFormValue(sp(idx, 'address', 'street'), v)}
                  />
                  <TextField
                    label="City"
                    value={section.address?.city}
                    onChange={(v) => updateFormValue(sp(idx, 'address', 'city'), v)}
                  />
                  <TextField
                    label="State"
                    value={section.address?.state}
                    onChange={(v) => updateFormValue(sp(idx, 'address', 'state'), v)}
                  />
                  <TextField
                    label="ZIP"
                    value={section.address?.zip}
                    onChange={(v) => updateFormValue(sp(idx, 'address', 'zip'), v)}
                  />
                  <TextField
                    label="Formatted"
                    value={section.address?.formatted}
                    onChange={(v) => updateFormValue(sp(idx, 'address', 'formatted'), v)}
                  />
                </div>
                {Array.isArray(section.hours) && (
                  <div className="border-t pt-3 mt-1">
                    <div className="flex items-center justify-between text-[11px] font-medium text-gray-400 mb-2">
                      <span>HOURS ({section.hours.length})</span>
                      <button
                        type="button"
                        onClick={() =>
                          addArrayItem(sp(idx, 'hours'), section.hours, {
                            days: '',
                            time: '',
                          })
                        }
                        className="rounded-md border border-gray-200 px-2.5 py-1 text-xs hover:bg-gray-50"
                      >
                        Add Hour Row
                      </button>
                    </div>
                    {section.hours.map((h: any, hi: number) => (
                      <div
                        key={hi}
                        className="border border-gray-100 rounded p-3 bg-gray-50/50 mb-2"
                      >
                        <div className="space-y-2">
                          <div className="flex items-center justify-end">
                            <button
                              type="button"
                              onClick={() =>
                                removeArrayItem(sp(idx, 'hours'), section.hours, hi)
                              }
                              className="text-xs text-red-600 hover:underline"
                            >
                              Remove
                            </button>
                          </div>
                          <TextField
                            label="Days"
                            value={h.days}
                            onChange={(v) =>
                              updateFormValue(sp(idx, 'hours', String(hi), 'days'), v)
                            }
                          />
                          <TextField
                            label="Time"
                            value={h.time}
                            onChange={(v) =>
                              updateFormValue(sp(idx, 'hours', String(hi), 'time'), v)
                            }
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                {Array.isArray(section.photos) && (
                  <div className="border-t pt-3 mt-1">
                    <div className="flex items-center justify-between text-[11px] font-medium text-gray-400 mb-2">
                      <span>PHOTOS</span>
                      <button
                        type="button"
                        onClick={() =>
                          addArrayItem(sp(idx, 'photos'), section.photos, {
                            src: '',
                            alt: '',
                          })
                        }
                        className="rounded-md border border-gray-200 px-2.5 py-1 text-xs hover:bg-gray-50"
                      >
                        Add Photo
                      </button>
                    </div>
                    {section.photos.map((photo: any, pi: number) => (
                      <div key={pi} className="mb-2 rounded border border-gray-100 p-3 bg-gray-50/50">
                        <div className="flex items-center justify-end mb-2">
                          <button
                            type="button"
                            onClick={() =>
                              removeArrayItem(sp(idx, 'photos'), section.photos, pi)
                            }
                            className="text-xs text-red-600 hover:underline"
                          >
                            Remove
                          </button>
                        </div>
                        <ImageField
                          label={photo.alt || `Photo ${pi + 1}`}
                          value={photo.src || ''}
                          path={sp(idx, 'photos', String(pi), 'src')}
                          updateFormValue={updateFormValue}
                          openImagePicker={openImagePicker}
                        />
                        <TextField
                          label="Alt Text"
                          value={photo.alt}
                          onChange={(v) =>
                            updateFormValue(sp(idx, 'photos', String(pi), 'alt'), v)
                          }
                        />
                      </div>
                    ))}
                  </div>
                )}
              </SectionWrapper>
            );

          case 'team':
            return (
              <SectionWrapper key={idx} title="Team">
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
                <div className="flex items-center justify-between">
                  <div className="text-xs font-semibold text-gray-500 uppercase">
                    Members ({Array.isArray(section.members) ? section.members.length : 0})
                  </div>
                  <button
                    type="button"
                    onClick={() =>
                      addArrayItem(sp(idx, 'members'), section.members, {
                        name: '',
                        role: '',
                        description: '',
                        photo: '',
                      })
                    }
                    className="rounded-md border border-gray-200 px-2.5 py-1 text-xs hover:bg-gray-50"
                  >
                    Add Member
                  </button>
                </div>
                {Array.isArray(section.members) &&
                  section.members.map((member: any, mi: number) => (
                    <div
                      key={mi}
                      className="border border-gray-100 rounded p-3 bg-gray-50/50"
                    >
                      <div className="flex items-center justify-between text-[11px] font-medium text-gray-400 mb-2">
                        <span>{member.name || `Member ${mi + 1}`}</span>
                        <button
                          type="button"
                          onClick={() =>
                            removeArrayItem(sp(idx, 'members'), section.members, mi)
                          }
                          className="text-xs text-red-600 hover:underline"
                        >
                          Remove
                        </button>
                      </div>
                      <div className="space-y-2">
                        <TextField
                          label="Name"
                          value={member.name}
                          onChange={(v) =>
                            updateFormValue(sp(idx, 'members', String(mi), 'name'), v)
                          }
                        />
                        <TextField
                          label="Role"
                          value={member.role}
                          onChange={(v) =>
                            updateFormValue(sp(idx, 'members', String(mi), 'role'), v)
                          }
                        />
                        <TextArea
                          label="Description"
                          value={member.description}
                          onChange={(v) =>
                            updateFormValue(
                              sp(idx, 'members', String(mi), 'description'),
                              v
                            )
                          }
                        />
                        <ImageField
                          label="Photo"
                          value={member.photo || ''}
                          path={sp(idx, 'members', String(mi), 'photo')}
                          updateFormValue={updateFormValue}
                          openImagePicker={openImagePicker}
                        />
                      </div>
                    </div>
                  ))}
              </SectionWrapper>
            );

          case 'cta':
            return (
              <SectionWrapper key={idx} title="CTA Section">
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
                <div className="flex items-center justify-between">
                  <div className="text-xs font-semibold text-gray-500 uppercase">
                    Buttons ({Array.isArray(section.buttons) ? section.buttons.length : 0})
                  </div>
                  <button
                    type="button"
                    onClick={() =>
                      addArrayItem(sp(idx, 'buttons'), section.buttons, {
                        label: '',
                        href: '',
                        variant: 'primary',
                      })
                    }
                    className="rounded-md border border-gray-200 px-2.5 py-1 text-xs hover:bg-gray-50"
                  >
                    Add Button
                  </button>
                </div>
                {Array.isArray(section.buttons) &&
                  section.buttons.map((btn: any, bi: number) => (
                    <div
                      key={bi}
                      className="border border-gray-100 rounded p-3 bg-gray-50/50"
                    >
                      <div className="flex items-center justify-between text-[11px] font-medium text-gray-400 mb-2">
                        <span>Button {bi + 1}</span>
                        <button
                          type="button"
                          onClick={() =>
                            removeArrayItem(sp(idx, 'buttons'), section.buttons, bi)
                          }
                          className="text-xs text-red-600 hover:underline"
                        >
                          Remove
                        </button>
                      </div>
                      <div className="space-y-2">
                        <TextField
                          label="Label"
                          value={btn.label}
                          onChange={(v) =>
                            updateFormValue(sp(idx, 'buttons', String(bi), 'label'), v)
                          }
                        />
                        <TextField
                          label="Link"
                          value={btn.href}
                          onChange={(v) =>
                            updateFormValue(sp(idx, 'buttons', String(bi), 'href'), v)
                          }
                        />
                        <SelectField
                          label="Variant"
                          value={btn.variant || 'primary'}
                          options={['primary', 'secondary', 'outline']}
                          onChange={(v) =>
                            updateFormValue(sp(idx, 'buttons', String(bi), 'variant'), v)
                          }
                        />
                      </div>
                    </div>
                  ))}
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
