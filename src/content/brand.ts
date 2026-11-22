/**
 * White-label brand settings. Every name, colour token and contact detail the site shows
 * comes from here (or from environment variables), so the site can be rebranded by
 * editing this one file.
 */
export const brand = {
  name: 'Vanokibs',
  legalName: 'Vanokibs',
  tagline: 'Technology team on demand for Canadian businesses',
  description:
    'Vanokibs gives Canadian companies a senior technology team on subscription, by project or by the hour: IT support, custom software, DevOps and cloud, ecommerce, fintech, ERP (Odoo), Magento, WordPress, mobile apps and business email/SMTP.',
  siteUrl: (process.env.NEXT_PUBLIC_SITE_URL || 'https://vanokibs.vercel.app').replace(/\/$/, ''),
  email: process.env.NEXT_PUBLIC_CONTACT_EMAIL || '',
  phone: process.env.NEXT_PUBLIC_CONTACT_PHONE || '',
  country: 'Canada',
  currency: 'CAD',
  hours: 'Monday to Friday, 8:00 to 20:00 Eastern (support plans include after-hours coverage)',
  areaServed: ['Ontario', 'British Columbia', 'Alberta', 'Quebec', 'Manitoba', 'Saskatchewan', 'Nova Scotia', 'New Brunswick', 'Newfoundland and Labrador', 'Prince Edward Island'],
} as const;

export const absoluteUrl = (path = '/') => `${brand.siteUrl}${path.startsWith('/') ? path : `/${path}`}`;
