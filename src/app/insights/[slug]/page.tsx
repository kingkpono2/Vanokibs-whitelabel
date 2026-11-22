import Link from 'next/link';
import Image from 'next/image';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { posts, postBySlug } from '@/content/posts';
import { serviceBySlug } from '@/content/services';
import { brand, absoluteUrl } from '@/content/brand';
import { Breadcrumbs, CtaBand } from '@/components/Bits';
import { JsonLd } from '@/components/JsonLd';
import { pageMeta } from '@/lib/seo';
import { fmtDate } from '@/lib/format';

type Props = { params: Promise<{ slug: string }> };
export const dynamicParams = false;
export function generateStaticParams() {
  return posts.map((p) => ({ slug: p.slug }));
}
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const p = postBySlug((await params).slug);
  if (!p) return {};
  return { ...pageMeta({ title: p.metaTitle || p.title, description: p.description, path: `/insights/${p.slug}`, image: p.image, type: 'article' }) };
}

export default async function PostPage({ params }: Props) {
  const p = postBySlug((await params).slug);
  if (!p) notFound();
  const svc = serviceBySlug(p.service);
  return (
    <>
      <article>
        <section className="page-hero">
          <div className="container">
            <Breadcrumbs items={[{ name: 'Home', path: '/' }, { name: 'Insights', path: '/insights' }, { name: p.title, path: `/insights/${p.slug}` }]} />
            <div className="post-meta"><span className="cat">{p.category}</span><span>{fmtDate(p.date)}</span><span>{p.readMinutes} min read</span></div>
            <h1 style={{ maxWidth: 900 }}>{p.title}</h1>
            <p className="lead" style={{ maxWidth: 760 }}>{p.description}</p>
          </div>
        </section>
        <section className="section">
          <div className="container">
            <div className="article-hero-img"><Image src={p.image} alt="" fill sizes="(max-width: 1200px) 100vw, 1160px" priority /></div>
            <div className="prose">
              {p.body.map((b, i) => {
                if (b.type === 'h2') return <h2 key={i}>{b.text}</h2>;
                if (b.type === 'ul') return <ul key={i}>{b.items.map((x) => <li key={x}>{x}</li>)}</ul>;
                if (b.type === 'ol') return <ol key={i}>{b.items.map((x) => <li key={x}>{x}</li>)}</ol>;
                if (b.type === 'tip') return <p key={i} className="tip"><strong>Tip:</strong> {b.text}</p>;
                return <p key={i}>{b.text}</p>;
              })}
              {svc && <p><Link href={`/services/${svc.slug}`} className="btn btn-primary">Explore {svc.name}</Link></p>}
            </div>
          </div>
        </section>
      </article>
      <CtaBand />
      <JsonLd data={{
        '@context': 'https://schema.org',
        '@type': 'BlogPosting',
        headline: p.title,
        description: p.description,
        datePublished: p.date,
        dateModified: p.date,
        image: absoluteUrl(p.image),
        mainEntityOfPage: absoluteUrl(`/insights/${p.slug}`),
        author: { '@type': 'Organization', name: brand.name, url: brand.siteUrl },
        publisher: { '@id': absoluteUrl('/#organization') },
        inLanguage: 'en-CA',
      }} />
    </>
  );
}
