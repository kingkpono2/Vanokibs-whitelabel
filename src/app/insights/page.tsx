import Link from 'next/link';
import Image from 'next/image';
import type { Metadata } from 'next';
import { posts } from '@/content/posts';
import { Breadcrumbs, CtaBand, PageHero } from '@/components/Bits';
import { pageMeta } from '@/lib/seo';

export const metadata: Metadata = pageMeta({
  title: 'Technology Guides for Canadian Businesses',
  description: 'Plain-English guides on IT support costs, email deliverability (SPF, DKIM, DMARC), Odoo ERP, Canadian data residency, DevOps and ecommerce.',
  path: '/insights',
});

import { fmtDate } from '@/lib/format';

export default function Insights() {
  const sorted = [...posts].sort((a, b) => b.date.localeCompare(a.date));
  return (
    <>
      <PageHero eyebrow="Insights" title="Practical guides for Canadian businesses" text="Clear answers to the technology questions our clients ask most, written by the engineers who do the work." crumbs={[{ name: 'Home', path: '/' }, { name: 'Insights', path: '/insights' }]} />
      <section className="section">
        <div className="container posts">
          {sorted.map((p) => (
            <Link key={p.slug} href={`/insights/${p.slug}`} className="post-card">
              <div className="post-card__img"><Image src={p.image} alt="" fill sizes="(max-width: 900px) 100vw, 580px" /></div>
              <div className="post-card__body">
                <div className="post-meta"><span className="cat">{p.category}</span><span>{fmtDate(p.date)}</span><span>{p.readMinutes} min read</span></div>
                <h2>{p.title}</h2>
                <p className="muted">{p.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>
      <CtaBand />
    </>
  );
}
