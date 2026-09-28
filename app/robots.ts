import type { MetadataRoute } from 'next';
import { getRequestSiteId } from '@/lib/content';
import { getSiteBaseUrl } from '@/lib/siteUrl';

export default async function robots(): Promise<MetadataRoute.Robots> {
  const siteId = await getRequestSiteId();
  const baseUrl = await getSiteBaseUrl(siteId);

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin/', '/api/admin/'],
      },
    ],
    // Points at this site's own sitemap, not a shared one.
    ...(baseUrl ? { sitemap: `${baseUrl}/sitemap.xml`, host: baseUrl } : {}),
  };
}
