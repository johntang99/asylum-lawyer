'use client';

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import type { SiteConfig } from '@/lib/types';

/* eslint-disable @typescript-eslint/no-explicit-any */

interface OnboardingWizardProps {
  sites: SiteConfig[];
}

interface FormState {
  id: string;
  nameZh: string;
  nameEn: string;
  taglineZh: string;
  taglineEn: string;
  domain: string;
  devHost: string;
  defaultLocale: 'zh' | 'en';
  phone: string;
  email: string;
  wechatId: string;
  street: string;
  city: string;
  state: string;
  zip: string;
}

const EMPTY: FormState = {
  id: '',
  nameZh: '',
  nameEn: '',
  taglineZh: '',
  taglineEn: '',
  domain: '',
  devHost: '',
  defaultLocale: 'zh',
  phone: '',
  email: '',
  wechatId: '',
  street: '',
  city: '',
  state: '',
  zip: '',
};

const inputClass =
  'mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-gray-500 focus:outline-none';

function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700">{label}</label>
      {children}
      {hint && <p className="text-xs text-gray-500 mt-1">{hint}</p>}
    </div>
  );
}

export function OnboardingWizard({ sites }: OnboardingWizardProps) {
  const router = useRouter();
  const [form, setForm] = useState<FormState>(EMPTY);
  const [status, setStatus] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<any>(null);

  const set = (key: keyof FormState) => (event: any) =>
    setForm((current) => ({ ...current, [key]: event.target.value }));

  // Suggest a dev host from the site ID so previewing works without DNS setup.
  const suggestedDevHost = useMemo(
    () => (form.id ? `${form.id}.local` : ''),
    [form.id]
  );

  const idTaken = sites.some((site) => site.id === form.id.trim().toLowerCase());
  const idValid = /^[a-z0-9-]+$/.test(form.id.trim().toLowerCase());

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setStatus(null);

    if (!form.id.trim() || !idValid) {
      setStatus('Site ID is required — lowercase letters, numbers and hyphens only.');
      return;
    }
    if (idTaken) {
      setStatus(`Site "${form.id}" already exists.`);
      return;
    }
    if (!form.nameZh.trim() && !form.nameEn.trim()) {
      setStatus('Enter a brand name in at least one language.');
      return;
    }

    setSubmitting(true);
    try {
      const response = await fetch('/api/admin/onboarding', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          id: form.id.trim().toLowerCase(),
          devHost: (form.devHost || suggestedDevHost).trim().toLowerCase(),
          supportedLocales: ['zh', 'en'],
        }),
      });
      const payload = await response.json();
      if (!response.ok) {
        setStatus(payload.message || 'Onboarding failed');
        return;
      }
      setResult(payload);
      router.refresh();
    } catch (error: any) {
      setStatus(error?.message || 'Onboarding failed');
    } finally {
      setSubmitting(false);
    }
  };

  if (result) {
    return (
      <div className="space-y-6">
        <div className="rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-900">
          Site <strong>{result.id}</strong> created. Brand, NAP, header, footer and SEO
          files were seeded for both locales.
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-6 space-y-4">
          <h2 className="text-lg font-semibold text-gray-900">Next steps</h2>
          <ol className="list-decimal pl-5 space-y-3 text-sm text-gray-700">
            <li>
              Preview immediately, no DNS needed:{' '}
              <a
                className="text-blue-600 underline"
                href={result.previewUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                {result.previewUrl}
              </a>
            </li>
            <li>
              Give the site its own local port by adding these to{' '}
              <code>package.json</code> (pick an unused port):
              <pre className="mt-2 bg-gray-900 text-gray-100 rounded-md p-3 text-xs overflow-x-auto">
{`"dev:${result.id}": "SITE_ID=${result.id} NEXT_DIST_DIR=.next-${result.id} next dev -p 3008",
"start:${result.id}": "SITE_ID=${result.id} NEXT_DIST_DIR=.next-${result.id} next start -p 3008"`}
              </pre>
              A pinned server serves only this site, whatever host it's reached on.
            </li>
            {result.devHost && (
              <li>
                For a realistic host, add the dev alias to <code>/etc/hosts</code>:
                <pre className="mt-2 bg-gray-900 text-gray-100 rounded-md p-3 text-xs overflow-x-auto">
{`echo "127.0.0.1 ${result.devHost}" | sudo tee -a /etc/hosts
sudo dscacheutil -flushcache && sudo killall -HUP mDNSResponder`}
                </pre>
                Then open <code>http://{result.devHost}:3006</code>
              </li>
            )}
            <li>
              Fill in the <code>TODO_</code> placeholders (contact details, hours,
              taglines) in{' '}
              <a className="text-blue-600 underline" href={`/admin/content?siteId=${result.id}&locale=zh`}>
                Content → {result.id}
              </a>
            </li>
            <li>
              Author page content: home, about, services, contact, FAQ and the legal pages.
            </li>
            <li>
              Check readiness on the{' '}
              <a className="text-blue-600 underline" href="/admin/onboarding-checklist">
                Onboarding QA Checklist
              </a>
            </li>
          </ol>
          <div className="flex gap-3 pt-2">
            <a
              href={`/admin/sites/${result.id}`}
              className="px-4 py-2 rounded-md bg-gray-900 text-white text-sm font-medium"
            >
              Site settings
            </a>
            <button
              type="button"
              onClick={() => {
                setResult(null);
                setForm(EMPTY);
              }}
              className="px-4 py-2 rounded-md border border-gray-300 text-gray-700 text-sm font-medium"
            >
              Onboard another site
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="space-y-8">
      {status && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-2 text-sm text-red-800">
          {status}
        </div>
      )}

      <section className="bg-white border border-gray-200 rounded-xl p-6 space-y-4">
        <h2 className="text-base font-semibold text-gray-900">1. Identity</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field
            label="Site ID *"
            hint="Folder name and internal key. Lowercase letters, numbers, hyphens."
          >
            <input className={inputClass} value={form.id} onChange={set('id')} placeholder="new-client" />
            {form.id && !idValid && (
              <p className="text-xs text-red-600 mt-1">Invalid characters.</p>
            )}
            {idTaken && <p className="text-xs text-red-600 mt-1">Already in use.</p>}
          </Field>
          <Field label="Default locale">
            <select className={inputClass} value={form.defaultLocale} onChange={set('defaultLocale')}>
              <option value="zh">中文 (zh)</option>
              <option value="en">English (en)</option>
            </select>
          </Field>
          <Field label="Brand name (中文)">
            <input className={inputClass} value={form.nameZh} onChange={set('nameZh')} />
          </Field>
          <Field label="Brand name (English)">
            <input className={inputClass} value={form.nameEn} onChange={set('nameEn')} />
          </Field>
          <Field label="Tagline (中文)">
            <input className={inputClass} value={form.taglineZh} onChange={set('taglineZh')} />
          </Field>
          <Field label="Tagline (English)">
            <input className={inputClass} value={form.taglineEn} onChange={set('taglineEn')} />
          </Field>
        </div>
      </section>

      <section className="bg-white border border-gray-200 rounded-xl p-6 space-y-4">
        <h2 className="text-base font-semibold text-gray-900">2. Hosting</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field label="Production domain" hint="Optional. Can be added later.">
            <input className={inputClass} value={form.domain} onChange={set('domain')} placeholder="example.com" />
          </Field>
          <Field label="Dev host" hint="Registered as a dev alias so you can preview on a real hostname.">
            <input
              className={inputClass}
              value={form.devHost}
              onChange={set('devHost')}
              placeholder={suggestedDevHost || 'new-client.local'}
            />
          </Field>
        </div>
      </section>

      <section className="bg-white border border-gray-200 rounded-xl p-6 space-y-4">
        <h2 className="text-base font-semibold text-gray-900">3. Contact details (NAP)</h2>
        <p className="text-xs text-gray-500">
          Anything left blank is written as a visible <code>TODO_</code> placeholder rather
          than being inherited from another site.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Field label="Phone">
            <input className={inputClass} value={form.phone} onChange={set('phone')} />
          </Field>
          <Field label="Email">
            <input className={inputClass} value={form.email} onChange={set('email')} />
          </Field>
          <Field label="WeChat ID">
            <input className={inputClass} value={form.wechatId} onChange={set('wechatId')} />
          </Field>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="md:col-span-2">
            <Field label="Street">
              <input className={inputClass} value={form.street} onChange={set('street')} />
            </Field>
          </div>
          <Field label="City">
            <input className={inputClass} value={form.city} onChange={set('city')} />
          </Field>
          <div className="grid grid-cols-2 gap-2">
            <Field label="State">
              <input className={inputClass} value={form.state} onChange={set('state')} />
            </Field>
            <Field label="ZIP">
              <input className={inputClass} value={form.zip} onChange={set('zip')} />
            </Field>
          </div>
        </div>
      </section>

      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={submitting}
          className="px-5 py-2.5 rounded-md bg-gray-900 text-white text-sm font-medium disabled:opacity-50"
        >
          {submitting ? 'Creating…' : 'Create site'}
        </button>
        <a
          href="/admin/sites"
          className="px-5 py-2.5 rounded-md border border-gray-300 text-gray-700 text-sm font-medium"
        >
          Cancel
        </a>
      </div>
    </form>
  );
}
