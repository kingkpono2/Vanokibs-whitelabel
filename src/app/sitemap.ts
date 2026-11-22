import type { MetadataRoute } from 'next';
import { absoluteUrl } from '@/content/brand';
import { services } from '@/content/services';
import { industries } from '@/content/industries';
import { locations } from '@/content/locations';
import { posts } from '@/content/posts';

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const entry = (path: string, priority: number, changeFrequency: MetadataRoute.Sitemap[number]['changeFrequency'] = 'monthly', lastModified: Date = now) =>
    ({ url: absoluteUrl(path), lastModified, changeFrequency, priority });
  return [
    entry('/', 1, 'weekly'),
    entry('/pricing', 0.9, 'weekly'),
    entry('/services', 0.9),
    ...services.map((s) => entry(`/services/${s.slug}`, 0.9)),
    entry('/industries', 0.7),
    ...industries.map((i) => entry(`/industries/${i.slug}`, 0.7)),
    entry('/locations', 0.7),
    ...locations.map((l) => entry(`/locations/${l.slug}`, 0.7)),
    entry('/insights', 0.7, 'weekly'),
    ...posts.map((p) => entry(`/insights/${p.slug}`, 0.6, 'yearly', new Date(`${p.date}T12:00:00Z`))),
    entry('/how-it-works', 0.6),
    entry('/faq', 0.6),
    entry('/contact', 0.8),
    entry('/legal/terms', 0.2, 'yearly'),
    entry('/legal/privacy', 0.2, 'yearly'),
  ];
}
