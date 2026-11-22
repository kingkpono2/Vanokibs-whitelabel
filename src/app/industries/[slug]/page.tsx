import Link from 'next/link';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { industries, industryBySlug } from '@/content/industries';
import { serviceBySlug, type Service } from '@/content/services';
import { Breadcrumbs, CtaBand, PageHero, ServiceCard } from '@/components/Bits';
import { JsonLd } from '@/components/JsonLd';
import { pageMeta, serviceLd } from '@/lib/seo';

type Props = { params: Promise<{ slug: string }> };
export const dynamicParams = false;
export function generateStaticParams() {
  return industries.map((i) => ({ slug: i.slug }));
}
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const i = industryBySlug((await params).slug);
  return i ? pageMeta({ title: i.metaTitle, description: i.metaDescription, path: `/industries/${i.slug}`, image: i.image }) : {};
}

export default async function IndustryPage({ params }: Props) {
  const i = industryBySlug((await params).slug);
  if (!i) notFound();
  const svcs = i.services.map(serviceBySlug).filter(Boolean) as Service[];
  return (
    <>
      <PageHero eyebrow={i.name} title={i.headline} text={i.intro} image={i.image} crumbs={[{ name: 'Home', path: '/' }, { name: 'Industries', path: '/industries' }, { name: i.name, path: `/industries/${i.slug}` }]}>
        <div className="page-hero__actions"><Link href="/contact" className="btn btn-primary btn-lg">Book a consultation</Link></div>
      </PageHero>
      <section className="section">
        <div className="container">
          <div className="section-head"><span className="eyebrow">Problems we solve</span><h2>What holds {i.name.toLowerCase()} businesses back</h2></div>
          <div className="values">
            {i.challenges.map((c) => (
              <div key={c.title} className="value"><h3>{c.title}</h3><p>{c.text}</p></div>
            ))}
          </div>
        </div>
      </section>
      <section className="section section--soft">
        <div className="container">
          <div className="section-head"><span className="eyebrow">Services</span><h2>Services for {i.name.toLowerCase()}</h2></div>
          <div className="svc-grid">{svcs.map((s) => <ServiceCard key={s.slug} s={s} />)}</div>
        </div>
      </section>
      <div className="section--soft"><CtaBand /></div>
      <JsonLd data={serviceLd({ name: `Technology services for ${i.name}`, description: i.metaDescription, path: `/industries/${i.slug}` })} />
    </>
  );
}
