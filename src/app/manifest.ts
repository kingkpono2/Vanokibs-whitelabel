import type { MetadataRoute } from 'next';
import { brand } from '@/content/brand';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: brand.name,
    short_name: brand.name,
    description: brand.tagline,
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#0a1024',
    icons: [{ src: '/icon.svg', sizes: 'any', type: 'image/svg+xml' }],
  };
}
