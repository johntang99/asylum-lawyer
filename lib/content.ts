// ============================================
// CONTENT LOADING UTILITIES
// ============================================

import { Locale, SeoConfig } from './types';
import { headers } from 'next/headers';
import { getDefaultSite, getSiteById, getSiteByHost, siteExists } from './sites';
import fs from 'fs';
import path from 'path';
import { defaultLocale } from './i18n';
import {
  canUseContentDb,
  fetchContentEntry,
  fetchThemeEntry,
  listContentEntriesByPrefix,
  upsertContentEntry,
} from './contentDb';

const CONTENT_DIR = path.join(process.cwd(), 'content');
const SITES_CONFIG_PATH = path.join(CONTENT_DIR, '_sites.json');

async function getLocalDefaultSiteId(): Promise<string | null> {
  try {
    const raw = await fs.promises.readFile(SITES_CONFIG_PATH, 'utf-8');
    const parsed = JSON.parse(raw) as {
      sites?: Array<{ id?: string; enabled?: boolean }>;
    };
    const sites = Array.isArray(parsed.sites) ? parsed.sites : [];
    const firstEnabled = sites.find((site) => site.enabled !== false && site.id);
    return firstEnabled?.id ?? sites[0]?.id ?? null;
  } catch {
    return null;
  }
}

/**
 * Read request headers, distinguishing two very different failures:
 *
 *  - During static generation of a page, Next throws a DynamicServerError from
 *    headers() to signal "this route is dynamic". That MUST propagate —
 *    swallowing it lets one site's render be cached and served for every other
 *    site on the platform.
 *  - In generateStaticParams there is no request at all. That is expected, and
 *    falling back to the default site is correct.
 */
function readRequestHeaders(): Headers | null {
  try {
    return headers();
  } catch (error: unknown) {
    const digest = (error as { digest?: unknown })?.digest;
    if (typeof digest === 'string' && digest.startsWith('DYNAMIC_SERVER_USAGE')) {
      throw error;
    }
    return null;
  }
}

/**
 * Pins an entire server process to one site.
 *
 * A Next server binds a single port, so "one port per client" means one process
 * per client, each started with its own SITE_ID. This takes precedence over
 * host and `?site=` resolution: a server started for a given client should only
 * ever serve that client, whatever hostname it is reached on.
 */
function getPinnedSiteId(): string | null {
  const pinned = (process.env.SITE_ID || '').trim().toLowerCase();
  return pinned || null;
}

async function resolveSiteId(siteId?: string): Promise<string> {
  if (siteId) return siteId;

  const pinnedSiteId = getPinnedSiteId();
  if (pinnedSiteId) return pinnedSiteId;

  const requestHeaders = readRequestHeaders();
  if (!requestHeaders) {
    const localSiteId = await getLocalDefaultSiteId();
    if (localSiteId) return localSiteId;
    const defaultSite = await getDefaultSite();
    return defaultSite?.id || process.env.NEXT_PUBLIC_DEFAULT_SITE || 'default-site';
  }

  const previewSiteId = requestHeaders.get('x-site-id')?.trim().toLowerCase();
  const host = requestHeaders.get('host');

  try {
    // `?site=<siteId>` preview (set as x-site-id by middleware) wins over host
    // resolution so any registered site can be viewed without DNS.
    if (previewSiteId && (await siteExists(previewSiteId))) {
      return previewSiteId;
    }

    const normalizedHost = (host || '').toLowerCase();
    if (!host) {
      const localSiteId = await getLocalDefaultSiteId();
      if (localSiteId) return localSiteId;
    }
    const isLocalHost =
      normalizedHost.includes('localhost') ||
      normalizedHost.startsWith('127.0.0.1') ||
      normalizedHost.startsWith('0.0.0.0');

    if (isLocalHost) {
      const localSiteId = await getLocalDefaultSiteId();
      if (localSiteId) return localSiteId;
    }

    const site = await getSiteByHost(host);
    if (site?.id) return site.id;
    const defaultSite = await getDefaultSite();
    return defaultSite?.id || process.env.NEXT_PUBLIC_DEFAULT_SITE || 'default-site';
  } catch (error) {
    const localSiteId = await getLocalDefaultSiteId();
    if (localSiteId) return localSiteId;
    const defaultSite = await getDefaultSite();
    return defaultSite?.id || process.env.NEXT_PUBLIC_DEFAULT_SITE || 'default-site';
  }
}

export async function getRequestSiteId(): Promise<string> {
  return resolveSiteId();
}

/**
 * The locale a site falls back to when a translation is missing.
 * Partially-translated sites show their primary language rather than a blank
 * page, which is what the old hardcoded Chinese defaults used to provide.
 */
async function getSiteFallbackLocale(siteId: string): Promise<Locale> {
  try {
    const site = await getSiteById(siteId);
    const siteDefault = site?.defaultLocale as Locale | undefined;
    if (siteDefault) return siteDefault;
  } catch {
    // fall through
  }
  return defaultLocale;
}

/**
 * Generic function to load JSON content
 */
export async function loadContent<T>(
  siteId: string,
  locale: Locale,
  contentPath: string,
  allowLocaleFallback = true
): Promise<T | null> {
  const isDev = process.env.NODE_ENV !== 'production';

  const withFallback = async (result: T | null): Promise<T | null> => {
    if (result !== null || !allowLocaleFallback) return result;
    const fallbackLocale = await getSiteFallbackLocale(siteId);
    if (fallbackLocale === locale) return null;
    return loadContent<T>(siteId, fallbackLocale, contentPath, false);
  };

  // In dev mode, prefer file on disk so direct edits are reflected immediately.
  // Sync the file content to DB so both sources stay in lockstep.
  if (isDev) {
    try {
      const filePath = path.join(CONTENT_DIR, siteId, locale, contentPath);
      if (fs.existsSync(filePath)) {
        const raw = await fs.promises.readFile(filePath, 'utf-8');
        const parsed = JSON.parse(raw) as T;

        // Opportunistically sync file → DB so they stay consistent
        if (canUseContentDb()) {
          upsertContentEntry({
            siteId,
            locale,
            path: contentPath,
            data: parsed,
            updatedBy: 'file-sync',
          }).catch((err: unknown) =>
            console.warn(`File→DB sync failed for ${contentPath}:`, err)
          );
        }

        return parsed;
      }
    } catch (error) {
      // Fall through to DB lookup
    }
  }

  if (canUseContentDb()) {
    const entry = await fetchContentEntry(siteId, locale, contentPath);
    if (entry?.data) {
      return entry.data as T;
    }
  }

  try {
    const filePath = path.join(CONTENT_DIR, siteId, locale, contentPath);

    // Check if file exists
    if (!fs.existsSync(filePath)) {
      return withFallback(null);
    }

    const data = await fs.promises.readFile(filePath, 'utf-8');
    return JSON.parse(data) as T;
  } catch (error) {
    console.error(`Error loading content from ${contentPath}:`, error);
    return withFallback(null);
  }
}

/**
 * Load page content
 */
export async function loadPageContent<T>(
  pageName: string,
  locale: Locale,
  siteId?: string
): Promise<T | null> {
  const resolvedSiteId = await resolveSiteId(siteId);
  return loadContent<T>(resolvedSiteId, locale, `pages/${pageName}.json`);
}

/**
 * Load site info
 */
export async function loadSiteInfo(siteId: string, locale: Locale) {
  return loadContent(siteId, locale, 'site.json');
}

/**
 * Load navigation
 */
export async function loadNavigation(siteId: string, locale: Locale) {
  return loadContent(siteId, locale, 'navigation.json');
}

/**
 * Load theme config
 */
export async function loadTheme(siteId: string) {
  const isDev = process.env.NODE_ENV !== 'production';

  // In dev mode, prefer file on disk so direct edits are reflected immediately
  if (isDev) {
    try {
      const filePath = path.join(CONTENT_DIR, siteId, 'theme.json');
      if (fs.existsSync(filePath)) {
        const raw = await fs.promises.readFile(filePath, 'utf-8');
        const parsed = JSON.parse(raw);

        if (canUseContentDb()) {
          upsertContentEntry({
            siteId,
            locale: defaultLocale,
            path: 'theme.json',
            data: parsed,
            updatedBy: 'file-sync',
          }).catch((err: unknown) =>
            console.warn(`File→DB sync failed for theme.json:`, err)
          );
        }

        return parsed;
      }
    } catch (error) {
      // Fall through to DB lookup
    }
  }

  if (canUseContentDb()) {
    // Theme is site-wide, so always resolve from canonical locale row.
    const entry = await fetchThemeEntry(siteId, defaultLocale);
    if (entry?.data) {
      return entry.data;
    }
  }

  try {
    const filePath = path.join(CONTENT_DIR, siteId, 'theme.json');

    if (!fs.existsSync(filePath)) {
      return null;
    }

    const data = await fs.promises.readFile(filePath, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error loading theme:', error);
    return null;
  }
}

/**
 * Load SEO config
 */
export async function loadSeo(siteId: string, locale: Locale): Promise<SeoConfig | null> {
  return loadContent(siteId, locale, 'seo.json');
}

/**
 * Load footer config
 */
export async function loadFooter<T>(siteId: string, locale: Locale): Promise<T | null> {
  return loadContent<T>(siteId, locale, 'footer.json');
}

/**
 * Load all items from a directory (e.g., blog posts, services)
 */
export async function loadAllItems<T>(
  siteId: string | undefined,
  locale: Locale,
  directory: string,
  allowLocaleFallback = true
): Promise<T[]> {
  const isDev = process.env.NODE_ENV !== 'production';
  const resolvedSiteId = await resolveSiteId(siteId);

  const withFallback = async (items: T[]): Promise<T[]> => {
    if (items.length > 0 || !allowLocaleFallback) return items;
    const fallbackLocale = await getSiteFallbackLocale(resolvedSiteId);
    if (fallbackLocale === locale) return items;
    return loadAllItems<T>(resolvedSiteId, fallbackLocale, directory, false);
  };

  // In dev mode, prefer files on disk so direct edits are reflected immediately
  if (isDev) {
    try {
      const dirPath = path.join(CONTENT_DIR, resolvedSiteId, locale, directory);
      if (fs.existsSync(dirPath)) {
        const files = await fs.promises.readdir(dirPath);
        const jsonFiles = files.filter(file => file.endsWith('.json'));

        const items = await Promise.all(
          jsonFiles.map(async (file) => {
            const filePath = path.join(dirPath, file);
            const data = await fs.promises.readFile(filePath, 'utf-8');
            const parsed = JSON.parse(data) as T;

            // Sync file → DB
            if (canUseContentDb()) {
              upsertContentEntry({
                siteId: resolvedSiteId,
                locale,
                path: `${directory}/${file}`,
                data: parsed,
                updatedBy: 'file-sync',
              }).catch(() => {});
            }

            return parsed;
          })
        );
        // In local dev, an empty directory should not mask DB content.
        // If no JSON files exist and DB is available, fall through to DB lookup.
        if (items.length > 0) {
          return items;
        }
        if (!canUseContentDb()) {
          return withFallback(items);
        }
      }
    } catch (error) {
      // Fall through to DB lookup
    }
  }

  if (canUseContentDb()) {
    const entries = await listContentEntriesByPrefix(
      resolvedSiteId,
      locale,
      `${directory}/`
    );
    return withFallback(entries.map((entry) => entry.data as T));
  }

  try {
    const dirPath = path.join(CONTENT_DIR, resolvedSiteId, locale, directory);

    if (!fs.existsSync(dirPath)) {
      return withFallback([]);
    }

    const files = await fs.promises.readdir(dirPath);
    const jsonFiles = files.filter(file => file.endsWith('.json'));

    const items = await Promise.all(
      jsonFiles.map(async (file) => {
        const filePath = path.join(dirPath, file);
        const data = await fs.promises.readFile(filePath, 'utf-8');
        return JSON.parse(data) as T;
      })
    );

    return withFallback(items);
  } catch (error) {
    console.error(`Error loading items from ${directory}:`, error);
    return withFallback([]);
  }
}

/**
 * Load single item by slug
 */
export async function loadItemBySlug<T>(
  siteId: string | undefined,
  locale: Locale,
  directory: string,
  slug: string
): Promise<T | null> {
  const resolvedSiteId = await resolveSiteId(siteId);
  return loadContent<T>(resolvedSiteId, locale, `${directory}/${slug}.json`);
}

/**
 * Check if content exists
 */
export function contentExists(
  siteId: string,
  locale: Locale,
  contentPath: string
): boolean {
  const filePath = path.join(CONTENT_DIR, siteId, locale, contentPath);
  return fs.existsSync(filePath);
}

/**
 * Get content file path (for admin use)
 */
export function getContentFilePath(
  siteId: string,
  locale: Locale,
  contentPath: string
): string {
  return path.join(CONTENT_DIR, siteId, locale, contentPath);
}
