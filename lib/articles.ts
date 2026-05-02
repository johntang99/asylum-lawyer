import type { Locale } from '@/lib/i18n';
import type { BlogScheduleFields } from '@/lib/blog';
import { isBlogPostVisible } from '@/lib/blog';
import { getRequestSiteId, loadAllItems, loadItemBySlug } from '@/lib/content';

export interface PublicArticle {
  slug: string;
  title: string;
  excerpt: string;
  contentMarkdown: string;
  content: string;
  category: string;
  publishDate: string;
  publishAt: string;
  readTime: string;
  image: string;
  relatedSlugs: string[];
}

interface RawArticleRecord {
  slug?: unknown;
  title?: unknown;
  excerpt?: unknown;
  summary?: unknown;
  contentMarkdown?: unknown;
  content?: unknown;
  category?: unknown;
  publishDate?: unknown;
  publishAt?: unknown;
  readTime?: unknown;
  image?: unknown;
  relatedSlugs?: unknown;
  status?: unknown;
}

function asString(value: unknown): string {
  return typeof value === 'string' ? value : '';
}

function normalizeArticle(raw: RawArticleRecord): PublicArticle | null {
  const slug = asString(raw.slug).trim();
  const title = asString(raw.title).trim();
  if (!slug || !title) return null;

  const relatedSlugs = Array.isArray(raw.relatedSlugs)
    ? raw.relatedSlugs.filter((item): item is string => typeof item === 'string' && item.trim().length > 0)
    : [];

  return {
    slug,
    title,
    excerpt: asString(raw.excerpt) || asString(raw.summary),
    contentMarkdown: asString(raw.contentMarkdown),
    content: asString(raw.content),
    category: asString(raw.category),
    publishDate: asString(raw.publishDate),
    publishAt: asString(raw.publishAt),
    readTime: asString(raw.readTime),
    image: asString(raw.image),
    relatedSlugs,
  };
}

function toScheduleFields(raw: RawArticleRecord): BlogScheduleFields {
  const statusRaw = asString(raw.status);
  const status =
    statusRaw === 'draft' || statusRaw === 'scheduled' || statusRaw === 'published'
      ? statusRaw
      : undefined;
  return {
    status,
    publishAt: asString(raw.publishAt),
    publishDate: asString(raw.publishDate),
  };
}

export function getArticleTimestamp(article: Pick<PublicArticle, 'publishDate' | 'publishAt'>): number {
  const value = article.publishAt || article.publishDate;
  const parsed = Date.parse(value);
  return Number.isNaN(parsed) ? 0 : parsed;
}

export function getArticleDisplayDate(article: Pick<PublicArticle, 'publishDate' | 'publishAt'>): string {
  if (article.publishDate) return article.publishDate;
  if (article.publishAt) return article.publishAt.slice(0, 10);
  return '';
}

export async function loadPublicArticles(
  locale: Locale,
  siteId?: string
): Promise<PublicArticle[]> {
  const resolvedSiteId = siteId || (await getRequestSiteId());

  const [blogItems, scheduledItems] = await Promise.all([
    loadAllItems<RawArticleRecord>(resolvedSiteId, locale, 'blog'),
    loadAllItems<RawArticleRecord>(resolvedSiteId, locale, 'blog-scheduled'),
  ]);

  const merged = new Map<string, { article: PublicArticle; fromScheduled: boolean }>();
  const ingest = (items: RawArticleRecord[], fromScheduled: boolean) => {
    items.forEach((raw) => {
      const normalized = normalizeArticle(raw);
      if (!normalized) return;
      if (!isBlogPostVisible(toScheduleFields(raw))) return;

      const existing = merged.get(normalized.slug);
      if (!existing || (fromScheduled && !existing.fromScheduled)) {
        merged.set(normalized.slug, { article: normalized, fromScheduled });
      }
    });
  };

  ingest(blogItems, false);
  ingest(scheduledItems, true);

  return [...merged.values()]
    .map((entry) => entry.article)
    .sort((a, b) => getArticleTimestamp(b) - getArticleTimestamp(a));
}

export async function loadPublicArticle(
  locale: Locale,
  slug: string,
  siteId?: string
): Promise<PublicArticle | null> {
  const resolvedSiteId = siteId || (await getRequestSiteId());

  const [blogEntry, scheduledEntry] = await Promise.all([
    loadItemBySlug<RawArticleRecord>(resolvedSiteId, locale, 'blog', slug),
    loadItemBySlug<RawArticleRecord>(resolvedSiteId, locale, 'blog-scheduled', slug),
  ]);

  const normalizedBlog =
    blogEntry && isBlogPostVisible(toScheduleFields(blogEntry))
      ? normalizeArticle(blogEntry)
      : null;
  const normalizedScheduled =
    scheduledEntry && isBlogPostVisible(toScheduleFields(scheduledEntry))
      ? normalizeArticle(scheduledEntry)
      : null;

  return normalizedScheduled || normalizedBlog || null;
}
