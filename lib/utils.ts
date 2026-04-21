// ============================================
// GENERAL UTILITY FUNCTIONS
// ============================================

import { type ClassValue, clsx } from 'clsx';

/**
 * Merge Tailwind classes
 */
export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

/**
 * Format phone number
 */
export function formatPhone(phone: string): string {
  // Remove all non-digit characters
  const cleaned = phone.replace(/\D/g, '');
  
  // Format as (XXX) XXX-XXXX
  const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
  
  if (match) {
    return `(${match[1]}) ${match[2]}-${match[3]}`;
  }
  
  return phone;
}

/**
 * Format date
 */
export function formatDate(date: string | Date, locale: string = 'en'): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  return new Intl.DateTimeFormat(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(dateObj);
}

/**
 * Slugify text
 */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/**
 * Truncate text
 */
export function truncate(text: string, length: number): string {
  if (text.length <= length) return text;
  return text.slice(0, length).trim() + '...';
}

/**
 * Get reading time in minutes
 */
export function getReadingTime(text: string): number {
  const wordsPerMinute = 200;
  const wordCount = text.trim().split(/\s+/).length;
  return Math.ceil(wordCount / wordsPerMinute);
}

/**
 * Debounce function
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  
  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

function isValidYouTubeId(value: string | null | undefined): value is string {
  return Boolean(value && /^[a-zA-Z0-9_-]{11}$/.test(value));
}

export function extractYouTubeVideoId(rawUrl?: string | null): string | null {
  if (!rawUrl) return null;
  const input = rawUrl.trim();
  if (!input) return null;

  const tryParse = (urlValue: string): URL | null => {
    try {
      return new URL(urlValue);
    } catch {
      return null;
    }
  };

  const parsed = tryParse(input) ?? tryParse(`https://${input}`);
  if (parsed) {
    const hostname = parsed.hostname.toLowerCase().replace(/^www\./, '');
    const parts = parsed.pathname.split('/').filter(Boolean);

    if (hostname === 'youtu.be') {
      const id = parts[0];
      return isValidYouTubeId(id) ? id : null;
    }

    if (hostname.endsWith('youtube.com') || hostname.endsWith('youtube-nocookie.com')) {
      if (parts[0] === 'watch') {
        const id = parsed.searchParams.get('v');
        return isValidYouTubeId(id) ? id : null;
      }

      if (parts[0] === 'shorts' || parts[0] === 'embed' || parts[0] === 'live' || parts[0] === 'v') {
        const id = parts[1];
        return isValidYouTubeId(id) ? id : null;
      }
    }
  }

  const fallbackMatch = input.match(/(?:v=|youtu\.be\/|youtube\.com\/shorts\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/);
  return fallbackMatch?.[1] ?? null;
}

export function getYouTubeEmbedUrl(rawUrl?: string | null): string | null {
  const id = extractYouTubeVideoId(rawUrl);
  return id ? `https://www.youtube.com/embed/${id}` : null;
}

export function getYouTubeThumbnailUrl(rawUrl?: string | null): string | null {
  const id = extractYouTubeVideoId(rawUrl);
  return id ? `https://img.youtube.com/vi/${id}/hqdefault.jpg` : null;
}
