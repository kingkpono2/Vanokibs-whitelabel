import { brand } from '@/content/brand';
import { services } from '@/content/services';
import { industries } from '@/content/industries';
import { SHOW_PRICES } from '@/content/plans';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { JsonLd } from '@/components/JsonLd';
import { organizationLd, websiteLd } from '@/lib/seo';

/** Public website chrome: header, footer and site-wide structured data (the admin has none of this). */
export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <a href="#main" className="skip-link">Skip to content</a>
      <Header
        brandName={brand.name}
        plansLabel={SHOW_PRICES ? 'Pricing' : 'Plans'}
        services={services.map(({ slug, name, short }) => ({ slug, name, short }))}
        industries={industries.map(({ slug, name }) => ({ slug, name }))}
      />
      <main id="main">{children}</main>
      <Footer />
      <JsonLd data={[organizationLd(), websiteLd()]} />
    </>
  );
}
