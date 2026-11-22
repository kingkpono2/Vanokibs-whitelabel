import Link from 'next/link';
import type { Metadata } from 'next';
import { locations } from '@/content/locations';
import { Breadcrumbs, CtaBand, PageHero } from '@/components/Bits';
import { Icon } from '@/components/Icon';
import { pageMeta } from '@/lib/seo';

export const metadata: Metadata = pageMeta({
  title: 'IT & Software Services Across Canada',
  description: 'Managed IT support, software development, DevOps and ecommerce services for businesses in Toronto, Vancouver, Calgary, Edmonton, Ottawa, Montréal, Winnipeg, Halifax and across Canada.',
  path: '/locations',
});

export default function LocationsPage() {
  return (
    <>
      <PageHero eyebrow="Across Canada" title="Remote-first, coast to coast" text="We work with businesses in every province and territory, with support hours that cover Atlantic to Pacific time." crumbs={[{ name: 'Home', path: '/' }, { name: 'Locations', path: '/locations' }]} />
      <section className="section">
        <div className="container svc-grid">
          {locations.map((l) => (
            <Link key={l.slug} href={`/locations/${l.slug}`} className="svc-card">
              <span className="svc-card__icon"><Icon name="maple" /></span>
              <h3>{l.city}, {l.provinceCode}</h3>
              <p>{l.intro.split('. ')[0]}.</p>
              <span className="svc-card__more">{l.timezone} support <Icon name="arrow" size={16} /></span>
            </Link>
          ))}
        </div>
      </section>
      <CtaBand />
    </>
  );
}
