import Link from 'next/link';
import Image from 'next/image';
import type { Metadata } from 'next';
import { industries } from '@/content/industries';
import { Breadcrumbs, CtaBand, PageHero } from '@/components/Bits';
import { pageMeta } from '@/lib/seo';

export const metadata: Metadata = pageMeta({
  title: 'Industries We Serve in Canada',
  description: 'Technology services for Canadian ecommerce and retail, fintech and financial services, manufacturing and distribution, and professional services firms.',
  path: '/industries',
});

export default function IndustriesPage() {
  return (
    <>
      <PageHero eyebrow="Industries" title="Technology shaped around your industry" text="Each industry has its own systems, regulations and busy seasons. We bring that context to every engagement." crumbs={[{ name: 'Home', path: '/' }, { name: 'Industries', path: '/industries' }]} />
      <section className="section">
        <div className="container tiles">
          {industries.map((i) => (
            <Link key={i.slug} href={`/industries/${i.slug}`} className="tile">
              <Image src={i.image} alt="" fill sizes="(max-width: 640px) 100vw, (max-width: 1080px) 50vw, 300px" />
              <span className="tile__body"><h3>{i.name}</h3><span>{i.headline}</span></span>
            </Link>
          ))}
        </div>
      </section>
      <CtaBand />
    </>
  );
}
