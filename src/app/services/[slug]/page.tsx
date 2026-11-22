import Link from 'next/link';
import Image from 'next/image';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { services, serviceBySlug } from '@/content/services';
import { industries } from '@/content/industries';
import { locations } from '@/content/locations';
import { Breadcrumbs, CtaBand, FaqList, ServiceCard, Check } from '@/components/Bits';
import { JsonLd } from '@/components/JsonLd';
import { faqLd, pageMeta, serviceLd } from '@/lib/seo';

type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = false;
export function generateStaticParams() {
  return services.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const s = serviceBySlug((await params).slug);
  if (!s) return {};
  return pageMeta({ title: s.metaTitle, description: s.metaDescription, path: `/services/${s.slug}`, image: s.image });
}

export default async function ServicePage({ params }: Props) {
  const s = serviceBySlug((await params).slug);
  if (!s) notFound();
  const related = s.related.map(serviceBySlug).filter(Boolean) as typeof services;
  const inIndustries = industries.filter((i) => i.services.includes(s.slug));
  const crumbs = [{ name: 'Home', path: '/' }, { name: 'Services', path: '/services' }, { name: s.name, path: `/services/${s.slug}` }];

  return (
    <>
      <section className="page-hero page-hero--img">
        <div className="container page-hero__grid">
          <div className="page-hero__copy">
            <Breadcrumbs items={crumbs} />
            <span className="eyebrow">{s.name}</span>
            <h1>{s.headline}</h1>
            <p className="lead">{s.intro}</p>
            <div className="page-hero__actions">
              <Link href={`/contact?service=${s.slug}`} className="btn btn-primary btn-lg">Get a free assessment</Link>
              <Link href="/pricing" className="btn btn-ghost btn-lg">See pricing</Link>
            </div>
          </div>
          <div className="page-hero__media"><Image src={s.image} alt={`${s.name} for Canadian businesses`} fill sizes="(max-width: 900px) 100vw, 520px" priority /></div>
        </div>
      </section>

      <section className="section">
        <div className="container two-col">
          <div>
            <span className="eyebrow">Outcomes</span>
            <h2>What changes when we take this on</h2>
            <ul className="outcomes">{s.outcomes.map((o) => <Check key={o}>{o}</Check>)}</ul>
          </div>
          <aside className="aside-card">
            <h3>Best for</h3>
            <p>{s.bestFor}</p>
            <p className="price-hint">{s.startingAt}</p>
            <Link href={`/contact?service=${s.slug}`} className="btn btn-light btn-block">Talk to an architect</Link>
          </aside>
        </div>
      </section>

      <section className="section section--soft">
        <div className="container">
          <div className="section-head">
            <span className="eyebrow">What’s included</span>
            <h2>{s.name}: services and deliverables</h2>
          </div>
          <div className="deliverables">
            {s.deliverables.map((d) => <div key={d.title} className="deliverable"><h3>{d.title}</h3><p>{d.text}</p></div>)}
          </div>
          <div className="mt">
            <h3>Technologies we use</h3>
            <ul className="chips">{s.stack.map((t) => <li key={t}>{t}</li>)}</ul>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container two-col">
          <div className="section-head">
            <span className="eyebrow">FAQ</span>
            <h2>{s.name}: common questions</h2>
            {inIndustries.length > 0 && (
              <p>Popular with: {inIndustries.map((i, n) => <span key={i.slug}>{n ? ', ' : ''}<Link href={`/industries/${i.slug}`}>{i.name}</Link></span>)}.</p>
            )}
            <p className="muted">Available in {locations.map((l, n) => <span key={l.slug}>{n ? ', ' : ''}<Link href={`/locations/${l.slug}`}>{l.city}</Link></span>)} and across Canada.</p>
          </div>
          <FaqList faqs={s.faqs} />
        </div>
      </section>

      <section className="section section--soft">
        <div className="container">
          <div className="section-head"><span className="eyebrow">Related</span><h2>Often combined with</h2></div>
          <div className="svc-grid">{related.map((r) => <ServiceCard key={r.slug} s={r} />)}</div>
        </div>
      </section>

      <div className="section--soft"><CtaBand title={`Ready to talk about ${s.name.toLowerCase()}?`} /></div>
      <JsonLd data={[serviceLd({ name: s.name, description: s.metaDescription, path: `/services/${s.slug}` }), faqLd(s.faqs)]} />
    </>
  );
}
