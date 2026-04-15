/* eslint-disable @typescript-eslint/no-explicit-any */

export interface SiteInfo {
  name: string;
  url: string;
  phone: string;
  email: string;
  address: {
    street: string;
    city: string;
    state: string;
    zip: string;
    country: string;
  };
  geo?: {
    latitude: number;
    longitude: number;
  };
  openingHours?: string[];
  image?: string;
  description?: string;
  attorneyName?: string;
  languages?: string[];
  areasOfPractice?: string[];
}

export interface BreadcrumbItem {
  name: string;
  url: string;
}

/**
 * Generates LocalBusiness + Attorney JSON-LD schema
 */
export function generateLocalBusinessSchema(siteInfo: SiteInfo) {
  return {
    '@context': 'https://schema.org',
    '@type': ['LocalBusiness', 'Attorney', 'LegalService'],
    '@id': `${siteInfo.url}/#organization`,
    name: siteInfo.name,
    url: siteInfo.url,
    telephone: siteInfo.phone,
    email: siteInfo.email,
    image: siteInfo.image,
    description: siteInfo.description,
    address: {
      '@type': 'PostalAddress',
      streetAddress: siteInfo.address.street,
      addressLocality: siteInfo.address.city,
      addressRegion: siteInfo.address.state,
      postalCode: siteInfo.address.zip,
      addressCountry: siteInfo.address.country,
    },
    ...(siteInfo.geo && {
      geo: {
        '@type': 'GeoCoordinates',
        latitude: siteInfo.geo.latitude,
        longitude: siteInfo.geo.longitude,
      },
    }),
    ...(siteInfo.openingHours && {
      openingHoursSpecification: siteInfo.openingHours,
    }),
    priceRange: '$$',
    areaServed: [
      {
        '@type': 'City',
        name: 'Los Angeles',
        '@id': 'https://www.wikidata.org/wiki/Q65',
      },
      {
        '@type': 'State',
        name: 'California',
      },
    ],
    availableLanguage: (siteInfo.languages ?? ['Chinese', 'English']).map(
      (lang) => ({
        '@type': 'Language',
        name: lang,
      })
    ),
    knowsAbout: siteInfo.areasOfPractice ?? [
      'Asylum Law',
      'Political Asylum',
      'Religious Asylum',
      'Immigration Law',
      'Deportation Defense',
      'Green Card Applications',
      'Work Permits',
    ],
    ...(siteInfo.attorneyName && {
      founder: {
        '@type': 'Person',
        name: siteInfo.attorneyName,
        jobTitle: 'Immigration Attorney',
      },
    }),
  };
}

/**
 * Generates LegalService JSON-LD schema for a specific service page
 */
export function generateServiceSchema(
  service: {
    slug: string;
    title: string;
    titleEN?: string;
    description: string;
  },
  siteInfo: SiteInfo
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'LegalService',
    '@id': `${siteInfo.url}/services/${service.slug}`,
    name: service.titleEN ?? service.title,
    description: service.description,
    url: `${siteInfo.url}/services/${service.slug}`,
    provider: {
      '@type': 'Attorney',
      '@id': `${siteInfo.url}/#organization`,
      name: siteInfo.name,
      telephone: siteInfo.phone,
      url: siteInfo.url,
    },
    areaServed: [
      { '@type': 'City', name: 'Los Angeles' },
      { '@type': 'State', name: 'California' },
    ],
    availableLanguage: (siteInfo.languages ?? ['Chinese', 'English']).map(
      (lang) => ({
        '@type': 'Language',
        name: lang,
      })
    ),
    serviceType: 'Immigration Legal Services',
  };
}

/**
 * Generates Article JSON-LD schema
 */
export function generateArticleSchema(
  article: {
    slug: string;
    title: string;
    excerpt?: string;
    date: string;
    dateModified?: string;
    image?: string;
  },
  siteInfo: SiteInfo
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    '@id': `${siteInfo.url}/articles/${article.slug}`,
    headline: article.title,
    description: article.excerpt,
    url: `${siteInfo.url}/articles/${article.slug}`,
    image: article.image,
    datePublished: article.date,
    dateModified: article.dateModified ?? article.date,
    author: {
      '@type': 'Person',
      name: siteInfo.attorneyName ?? siteInfo.name,
      url: siteInfo.url,
    },
    publisher: {
      '@type': 'Organization',
      '@id': `${siteInfo.url}/#organization`,
      name: siteInfo.name,
      url: siteInfo.url,
      ...(siteInfo.image && {
        logo: {
          '@type': 'ImageObject',
          url: siteInfo.image,
        },
      }),
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${siteInfo.url}/articles/${article.slug}`,
    },
    inLanguage: 'zh-Hans',
  };
}

/**
 * Generates FAQPage JSON-LD schema
 */
export function generateFAQSchema(
  questions: Array<{ question: string; answer: string }>
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: questions.map((q) => ({
      '@type': 'Question',
      name: q.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: q.answer,
      },
    })),
  };
}

/**
 * Generates BreadcrumbList JSON-LD schema
 */
export function generateBreadcrumbSchema(items: BreadcrumbItem[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}
