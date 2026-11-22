import type { Metadata } from 'next';
import { brand, absoluteUrl } from '@/content/brand';
import type { Faq } from '@/content/services';

/** Page metadata with canonical URL, Open Graph and Twitter cards. */
export function pageMeta(opts: { title: string; description: string; path: string; image?: string; type?: 'website' | 'article'; absolute?: boolean }): Metadata {
  const url = absoluteUrl(opts.path);
  const images = [{ url: absoluteUrl(opts.image || '/opengraph-image'), width: 1200, height: 630, alt: opts.title }];
  return {
    title: opts.absolute ? { absolute: opts.title } : opts.title,
    description: opts.description,
    alternates: { canonical: url },
    openGraph: { title: opts.title, description: opts.description, url, siteName: brand.name, locale: 'en_CA', type: opts.type || 'website', images },
    twitter: { card: 'summary_large_image', title: opts.title, description: opts.description, images: images.map((i) => i.url) },
  };
}

type Json = Record<string, unknown>;

export const organizationLd = (): Json => ({
  '@context': 'https://schema.org',
  '@type': 'ProfessionalService',
  '@id': absoluteUrl('/#organization'),
  name: brand.name,
  url: brand.siteUrl,
  logo: absoluteUrl('/icon.svg'),
  image: absoluteUrl('/opengraph-image'),
  description: brand.description,
  slogan: brand.tagline,
  areaServed: { '@type': 'Country', name: 'Canada' },
  currenciesAccepted: 'CAD',
  priceRange: '$$',
  ...(brand.email ? { email: brand.email } : {}),
  ...(brand.phone ? { telephone: brand.phone } : {}),
  address: { '@type': 'PostalAddress', addressCountry: 'CA' },
  knowsAbout: ['Managed IT support', 'Custom software development', 'DevOps', 'Cloud computing', 'Ecommerce', 'Fintech', 'ERP', 'Odoo', 'Magento', 'WordPress', 'Mobile app development', 'Email deliverability', 'SMTP'],
});

export const websiteLd = (): Json => ({
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  '@id': absoluteUrl('/#website'),
  url: brand.siteUrl,
  name: brand.name,
  inLanguage: 'en-CA',
  publisher: { '@id': absoluteUrl('/#organization') },
});

export const breadcrumbLd = (items: { name: string; path: string }[]): Json => ({
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: items.map((it, i) => ({ '@type': 'ListItem', position: i + 1, name: it.name, item: absoluteUrl(it.path) })),
});

export const faqLd = (faqs: Faq[]): Json => ({
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faqs.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
});

export const serviceLd = (s: { name: string; description: string; path: string; areaName?: string }): Json => ({
  '@context': 'https://schema.org',
  '@type': 'Service',
  name: s.name,
  description: s.description,
  url: absoluteUrl(s.path),
  serviceType: s.name,
  provider: { '@id': absoluteUrl('/#organization') },
  areaServed: s.areaName ? { '@type': 'City', name: s.areaName } : { '@type': 'Country', name: 'Canada' },
});
