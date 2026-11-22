import type { MetadataRoute } from 'next';
import { absoluteUrl } from '@/content/brand';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: '*', allow: '/', disallow: ['/api/', '/thank-you', '/admin'] }],
    sitemap: absoluteUrl('/sitemap.xml'),
  };
}
