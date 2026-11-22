import Link from 'next/link';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { locations, locationBySlug } from '@/content/locations';
import { services, serviceBySlug, type Service } from '@/content/services';
import { Breadcrumbs, CtaBand, PageHero, ServiceCard, Check } from '@/components/Bits';
import { JsonLd } from '@/components/JsonLd';
import { pageMeta, serviceLd } from '@/lib/seo';

type Props = { params: Promise<{ city: string }> };
export const dynamicParams = false;
export function generateStaticParams() {
  return locations.map((l) => ({ city: l.slug }));
}
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const l = locationBySlug((await params).city);
  if (!l) return {};
  return pageMeta({
    title: `IT Support, Software & DevOps in ${l.city}, ${l.provinceCode}`,
    description: `Managed IT support, custom software, DevOps, ecommerce and Odoo ERP for ${l.city} businesses. Subscription, project or hourly. ${l.timezone} support, prices in CAD.`,
    path: `/locations/${l.slug}`,
    image: l.image,
  });
}

export default async function LocationPage({ params }: Props) {
  const l = locationBySlug((await params).city);
  if (!l) notFound();
  const focus = l.focus.map(serviceBySlug).filter(Boolean) as Service[];
  const others = services.filter((s) => !l.focus.includes(s.slug));
  return (
    <>
      <PageHero eyebrow={`${l.city}, ${l.province}`} title={`Technology team on demand for ${l.city} businesses`} text={l.intro} image={l.image} crumbs={[{ name: 'Home', path: '/' }, { name: 'Locations', path: '/locations' }, { name: l.city, path: `/locations/${l.slug}` }]}>
        <div className="page-hero__actions"><Link href="/book" className="btn btn-primary btn-lg">Book a consultation</Link><Link href="/pricing" className="btn btn-ghost btn-lg">Pricing</Link></div>
      </PageHero>
      <section className="section">
        <div className="container two-col">
          <div>
            <span className="eyebrow">Why {l.city} teams work with us</span>
            <h2>Built for {l.province}</h2>
            <ul className="outcomes">{l.local.map((x) => <Check key={x}>{x}</Check>)}</ul>
          </div>
          <aside className="aside-card">
            <h3>Support on {l.timezone}</h3>
            <p>Remote help desk and engineering for {l.city} and the surrounding region, with on-site visits arranged when needed.</p>
            <Link href="/contact" className="btn btn-light btn-block">Get a quote</Link>
          </aside>
        </div>
      </section>
      <section className="section section--soft">
        <div className="container">
          <div className="section-head"><span className="eyebrow">Most requested in {l.city}</span><h2>Popular services in {l.city}</h2></div>
          <div className="svc-grid">{focus.map((s) => <ServiceCard key={s.slug} s={s} />)}</div>
          <p className="mt muted">Also available in {l.city}: {others.map((s, n) => <span key={s.slug}>{n ? ', ' : ''}<Link href={`/services/${s.slug}`}>{s.name}</Link></span>)}.</p>
        </div>
      </section>
      <div className="section--soft"><CtaBand title={`Let’s talk about your ${l.city} business`} /></div>
      <JsonLd data={serviceLd({ name: `Technology services in ${l.city}`, description: l.intro, path: `/locations/${l.slug}`, areaName: l.city })} />
    </>
  );
}
