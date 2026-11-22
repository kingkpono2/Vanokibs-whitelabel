import type { Metadata, Viewport } from 'next';
import { Inter, Source_Serif_4 } from 'next/font/google';
import { brand } from '@/content/brand';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { JsonLd } from '@/components/JsonLd';
import { organizationLd, websiteLd } from '@/lib/seo';
import './globals.css';

const inter = Inter({ subsets: ['latin'], variable: '--font-body', display: 'swap' });
const serif = Source_Serif_4({ subsets: ['latin'], variable: '--font-head', weight: ['500', '600'], display: 'swap' });

export const metadata: Metadata = {
  metadataBase: new URL(brand.siteUrl),
  title: {
    default: `${brand.name}: IT Support, Software, DevOps & Ecommerce for Canadian Businesses`,
    template: `%s | ${brand.name}`,
  },
  description: brand.description,
  applicationName: brand.name,
  keywords: [
    'managed IT support Canada', 'custom software development Canada', 'DevOps consulting Canada', 'ecommerce development Canada',
    'fintech development', 'Odoo implementation Canada', 'Magento developer Canada', 'WordPress maintenance Canada',
    'mobile app development Canada', 'business email SMTP Canada', 'IT subscription', 'outsourced IT Toronto', 'tech support Vancouver',
  ],
  authors: [{ name: brand.name }],
  creator: brand.name,
  formatDetection: { telephone: false },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true, 'max-image-preview': 'large', 'max-snippet': -1 } },
  alternates: { canonical: '/' },
  openGraph: { siteName: brand.name, locale: 'en_CA', type: 'website' },
  category: 'technology',
};

export const viewport: Viewport = {
  themeColor: '#0a1024',
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-CA" className={`${inter.variable} ${serif.variable}`}>
      <body>
        <a href="#main" className="skip-link">Skip to content</a>
        <Header />
        <main id="main">{children}</main>
        <Footer />
        <JsonLd data={[organizationLd(), websiteLd()]} />
      </body>
    </html>
  );
}
