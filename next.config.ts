import type { NextConfig } from 'next';

const securityHeaders = [
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
  { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
];

const config: NextConfig = {
  // A self-contained server (server.js + only the needed node_modules) for Node hosting such as cPanel.
  output: 'standalone',
  poweredByHeader: false,
  images: { formats: ['image/avif', 'image/webp'] },
  // The site moved to cobalthelm.com (2026-11-26): the old Vercel addresses send visitors there.
  async redirects() {
    return [
      {
        source: '/:path*',
        has: [{ type: 'host', value: '(?<vercelhost>.*\\.vercel\\.app)' }],
        destination: 'https://cobalthelm.com/:path*',
        permanent: true,
      },
    ];
  },
  async headers() {
    return [{ source: '/:path*', headers: securityHeaders }];
  },
};

export default config;
