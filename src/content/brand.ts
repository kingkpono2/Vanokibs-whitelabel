/**
 * White-label brand settings. Name, tagline, description, contact details and hours come
 * from editable.json (edited through /admin); contact details can also be set with
 * environment variables.
 */
import content from './editable.json';

const b = content.brand;

export const brand = {
  name: b.name,
  legalName: b.legalName || b.name, // the company that operates the site
  tagline: b.tagline,
  description: b.description,
  // Your domain if set; otherwise Vercel's production address (provided automatically at build time).
  siteUrl: (
    process.env.NEXT_PUBLIC_SITE_URL ||
    (process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : 'https://vanokibs-whitelabel.vercel.app')
  ).replace(/\/$/, ''),
  email: b.email || process.env.NEXT_PUBLIC_CONTACT_EMAIL || '',
  phone: b.phone || process.env.NEXT_PUBLIC_CONTACT_PHONE || '',
  country: 'Canada',
  currency: 'CAD',
  hours: b.hours,
  areaServed: ['Ontario', 'British Columbia', 'Alberta', 'Quebec', 'Manitoba', 'Saskatchewan', 'Nova Scotia', 'New Brunswick', 'Newfoundland and Labrador', 'Prince Edward Island'],
};

export const absoluteUrl = (path = '/') => `${brand.siteUrl}${path.startsWith('/') ? path : `/${path}`}`;
