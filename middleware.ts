import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { locales, defaultLocale } from '@/lib/i18n';

const PUBLIC_FILE_REGEX = /\.(.*)$/;

const SITE_PREVIEW_COOKIE = 'site-preview';
const SITE_ID_HEADER = 'x-site-id';
const SITE_ID_REGEX = /^[a-z0-9-]+$/;

/**
 * Site preview lets you view any registered site without DNS by adding
 * `?site=<siteId>` to the URL. The choice sticks in a cookie so links keep
 * working while browsing. Enabled in dev; in production it requires an
 * explicit opt-in so tenants can be previewed before their domain is live.
 */
function sitePreviewEnabled() {
  return (
    process.env.NODE_ENV !== 'production' ||
    process.env.NEXT_PUBLIC_ALLOW_SITE_PREVIEW === '1'
  );
}

function resolvePreviewSiteId(request: NextRequest): {
  siteId: string | null;
  clear: boolean;
} {
  if (!sitePreviewEnabled()) return { siteId: null, clear: false };

  const param = request.nextUrl.searchParams.get('site');
  if (param !== null) {
    const trimmed = param.trim().toLowerCase();
    if (!trimmed) return { siteId: null, clear: true };
    return SITE_ID_REGEX.test(trimmed)
      ? { siteId: trimmed, clear: false }
      : { siteId: null, clear: false };
  }

  const cookie = request.cookies.get(SITE_PREVIEW_COOKIE)?.value?.trim().toLowerCase();
  if (cookie && SITE_ID_REGEX.test(cookie)) {
    return { siteId: cookie, clear: false };
  }
  return { siteId: null, clear: false };
}

function withPreviewHeader(request: NextRequest, siteId: string | null) {
  if (!siteId) return NextResponse.next();
  const headers = new Headers(request.headers);
  headers.set(SITE_ID_HEADER, siteId);
  return NextResponse.next({ request: { headers } });
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip static files, images, and API routes
  if (
    pathname.startsWith('/api') ||
    pathname.startsWith('/_next') ||
    pathname.startsWith('/uploads') ||
    pathname.startsWith('/favicon') ||
    pathname.startsWith('/icon') ||
    PUBLIC_FILE_REGEX.test(pathname)
  ) {
    return NextResponse.next();
  }

  const preview = resolvePreviewSiteId(request);

  // Admin route protection
  if (pathname.startsWith('/admin')) {
    // Allow access to login page
    if (pathname === '/admin/login') {
      return NextResponse.next();
    }

    // Check for admin token
    const adminToken = request.cookies.get('admin-token');
    if (!adminToken) {
      const loginUrl = new URL('/admin/login', request.url);
      return NextResponse.redirect(loginUrl);
    }

    return NextResponse.next();
  }

  // Check if pathname already has a locale prefix
  const pathnameHasLocale = locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );

  const response = pathnameHasLocale
    ? withPreviewHeader(request, preview.siteId)
    : (() => {
        // Redirect to default locale
        const url = request.nextUrl.clone();
        url.pathname = `/${defaultLocale}${pathname}`;
        return NextResponse.redirect(url);
      })();

  if (preview.clear) {
    response.cookies.delete(SITE_PREVIEW_COOKIE);
  } else if (preview.siteId && request.nextUrl.searchParams.has('site')) {
    response.cookies.set(SITE_PREVIEW_COOKIE, preview.siteId, {
      path: '/',
      sameSite: 'lax',
      httpOnly: false,
    });
  }

  return response;
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|icon|uploads).*)',
  ],
};
