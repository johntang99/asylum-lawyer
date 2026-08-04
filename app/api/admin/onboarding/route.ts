import { NextRequest, NextResponse } from 'next/server';
import { createSite, getSiteById } from '@/lib/sites';
import { getSessionFromRequest } from '@/lib/admin/auth';
import { isSuperAdmin } from '@/lib/admin/permissions';
import { upsertSiteDomainDb } from '@/lib/siteDomainsDb';
import { canUseContentDb, upsertContentEntry } from '@/lib/contentDb';
import { writeAuditLog } from '@/lib/admin/audit';
import type { Locale } from '@/lib/types';
import fs from 'fs/promises';
import path from 'path';

/* eslint-disable @typescript-eslint/no-explicit-any */

interface OnboardingPayload {
  id?: string;
  nameZh?: string;
  nameEn?: string;
  taglineZh?: string;
  taglineEn?: string;
  domain?: string;
  devHost?: string;
  defaultLocale?: Locale;
  supportedLocales?: Locale[];
  phone?: string;
  email?: string;
  wechatId?: string;
  street?: string;
  city?: string;
  state?: string;
  zip?: string;
  cloneFrom?: string;
}

const SITE_ID_REGEX = /^[a-z0-9-]+$/;

/** Values the client didn't supply become visible placeholders, never blanks. */
function todo(value: string | undefined, label: string) {
  const trimmed = (value || '').trim();
  return trimmed || `TODO_${label}`;
}

function buildSiteJson(payload: OnboardingPayload, locale: Locale) {
  const isZh = locale === 'zh';
  const name = isZh
    ? payload.nameZh || payload.nameEn || ''
    : payload.nameEn || payload.nameZh || '';

  return {
    name,
    nameEN: payload.nameEn || '',
    tagline: isZh ? todo(payload.taglineZh, 'TAGLINE') : todo(payload.taglineEn, 'TAGLINE'),
    description: '',
    phone: todo(payload.phone, 'PHONE'),
    email: todo(payload.email, 'EMAIL'),
    wechatId: todo(payload.wechatId, 'WECHAT_ID'),
    address: {
      street: todo(payload.street, 'STREET'),
      city: todo(payload.city, 'CITY'),
      state: todo(payload.state, 'STATE'),
      zip: todo(payload.zip, 'ZIP'),
      country: 'US',
    },
    hours: isZh
      ? { weekday: '周一至周五：TODO_HOURS', saturday: '周六：TODO_HOURS', sunday: '周日：休息' }
      : { weekday: 'Mon–Fri: TODO_HOURS', saturday: 'Sat: TODO_HOURS', sunday: 'Sun: Closed' },
    languages: isZh ? ['中文（普通话）', 'English'] : ['Mandarin', 'English'],
    serviceAreas: [],
    trustBar: [],
    headerVariant: 'sticky',
    legal: {
      privacyUrl: '/privacy',
      termsUrl: '/terms',
      disclaimerUrl: '/disclaimer',
      disclaimer: isZh
        ? '本网站内容仅供一般参考，不构成法律意见，也不构成委托关系。'
        : 'This website is for general information only. It is not legal advice and does not create an engagement.',
    },
  };
}

function buildHeaderJson(payload: OnboardingPayload, locale: Locale) {
  const isZh = locale === 'zh';
  return {
    logo: {
      text: isZh ? payload.nameZh || payload.nameEn || '' : payload.nameEn || payload.nameZh || '',
      href: '/',
    },
    cta: {
      href: '/consultation',
      label: isZh ? '免费咨询' : 'Free Consultation',
      phone: payload.phone || '',
    },
    nav: [
      { href: '/', label: isZh ? '首页' : 'Home' },
      { href: '/services', label: isZh ? '服务领域' : 'Practice Areas' },
      { href: '/about', label: isZh ? '关于我们' : 'About' },
      { href: '/faq', label: isZh ? '常见问题' : 'FAQ' },
      { href: '/contact', label: isZh ? '联系我们' : 'Contact' },
    ],
  };
}

function buildFooterJson(payload: OnboardingPayload, locale: Locale) {
  const isZh = locale === 'zh';
  const name = isZh
    ? payload.nameZh || payload.nameEn || ''
    : payload.nameEn || payload.nameZh || '';
  return {
    tagline: isZh ? todo(payload.taglineZh, 'TAGLINE') : todo(payload.taglineEn, 'TAGLINE'),
    nap: {
      name,
      phone: todo(payload.phone, 'PHONE'),
      email: todo(payload.email, 'EMAIL'),
      wechatId: todo(payload.wechatId, 'WECHAT_ID'),
      address: {
        street: todo(payload.street, 'STREET'),
        city: todo(payload.city, 'CITY'),
        state: todo(payload.state, 'STATE'),
        zip: todo(payload.zip, 'ZIP'),
        country: 'US',
      },
    },
    columns: [
      {
        title: isZh ? '服务' : 'Services',
        links: [{ href: '/services', label: isZh ? '全部服务' : 'All services' }],
      },
      {
        title: isZh ? '联系我们' : 'Contact',
        links: [
          { href: '/consultation', label: isZh ? '预约咨询' : 'Book a consultation' },
          { href: '/contact', label: isZh ? '联系方式' : 'Contact details' },
        ],
      },
    ],
    compliance: {
      links: [
        { href: '/privacy', label: isZh ? '隐私政策' : 'Privacy Policy' },
        { href: '/terms', label: isZh ? '使用条款' : 'Terms of Use' },
        { href: '/disclaimer', label: isZh ? '免责声明' : 'Disclaimer' },
      ],
    },
    copyright: `© ${name}`,
  };
}

function buildSeoJson(payload: OnboardingPayload, locale: Locale) {
  const isZh = locale === 'zh';
  const name = isZh
    ? payload.nameZh || payload.nameEn || ''
    : payload.nameEn || payload.nameZh || '';
  return {
    title: name,
    description: isZh ? todo(payload.taglineZh, 'TAGLINE') : todo(payload.taglineEn, 'TAGLINE'),
    home: { title: name, description: '' },
  };
}

/** Writes to the DB when configured, and always to disk for local dev. */
async function writeSiteFile(
  siteId: string,
  locale: Locale,
  filename: string,
  data: unknown,
  updatedBy: string
) {
  if (canUseContentDb()) {
    await upsertContentEntry({ siteId, locale, path: filename, data, updatedBy });
  }
  const filePath = path.join(process.cwd(), 'content', siteId, locale, filename);
  await fs.mkdir(path.dirname(filePath), { recursive: true });
  await fs.writeFile(filePath, `${JSON.stringify(data, null, 2)}\n`, 'utf-8');
}

export async function POST(request: NextRequest) {
  const session = await getSessionFromRequest(request);
  if (!session) {
    return NextResponse.json({ message: 'Not authenticated' }, { status: 401 });
  }
  if (!isSuperAdmin(session.user)) {
    return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
  }

  const payload = (await request.json()) as OnboardingPayload;

  const id = (payload.id || '').trim().toLowerCase();
  if (!id || !SITE_ID_REGEX.test(id)) {
    return NextResponse.json(
      { message: 'Site ID is required (lowercase letters, numbers and hyphens only)' },
      { status: 400 }
    );
  }
  if (!payload.nameZh && !payload.nameEn) {
    return NextResponse.json({ message: 'A brand name is required' }, { status: 400 });
  }
  if (await getSiteById(id)) {
    return NextResponse.json({ message: `Site "${id}" already exists` }, { status: 409 });
  }

  const supportedLocales = (payload.supportedLocales?.length
    ? payload.supportedLocales
    : ['zh', 'en']) as Locale[];
  const defaultLocale = (payload.defaultLocale || supportedLocales[0]) as Locale;

  try {
    const created = await createSite({
      id,
      name: payload.nameZh || payload.nameEn || id,
      domain: payload.domain?.trim() || undefined,
      enabled: true,
      defaultLocale,
      supportedLocales,
    });

    // Register the dev host so the site is reachable without a query param.
    const devHost = (payload.devHost || '').trim().toLowerCase();
    if (devHost) {
      await upsertSiteDomainDb({
        siteId: created.id,
        domain: devHost,
        environment: 'dev',
        isPrimary: false,
        enabled: true,
      });
    }

    // Seed the identity files for every supported locale.
    for (const locale of supportedLocales) {
      await writeSiteFile(created.id, locale, 'site.json', buildSiteJson(payload, locale), session.user.id);
      await writeSiteFile(created.id, locale, 'header.json', buildHeaderJson(payload, locale), session.user.id);
      await writeSiteFile(created.id, locale, 'footer.json', buildFooterJson(payload, locale), session.user.id);
      await writeSiteFile(created.id, locale, 'seo.json', buildSeoJson(payload, locale), session.user.id);
    }

    await writeAuditLog({
      actor: session.user,
      action: 'site_onboarded',
      siteId: created.id,
      metadata: { devHost: devHost || null, locales: supportedLocales },
    });

    return NextResponse.json({
      ...created,
      devHost: devHost || null,
      previewUrl: `/${defaultLocale}?site=${created.id}`,
    });
  } catch (error: any) {
    return NextResponse.json(
      { message: error?.message || 'Onboarding failed' },
      { status: 500 }
    );
  }
}
