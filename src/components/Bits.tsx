import Link from 'next/link';
import Image from 'next/image';
import type { Faq, Service } from '@/content/services';
import { Icon } from './Icon';
import { JsonLd } from './JsonLd';
import { breadcrumbLd } from '@/lib/seo';

export function Breadcrumbs({ items }: { items: { name: string; path: string }[] }) {
  return (
    <>
      <nav className="crumbs" aria-label="Breadcrumb">
        <ol>
          {items.map((it, i) => (
            <li key={it.path}>
              {i < items.length - 1 ? <Link href={it.path}>{it.name}</Link> : <span aria-current="page">{it.name}</span>}
            </li>
          ))}
        </ol>
      </nav>
      <JsonLd data={breadcrumbLd(items)} />
    </>
  );
}

export function ServiceCard({ s }: { s: Service }) {
  return (
    <Link href={`/services/${s.slug}`} className="svc-card">
      <span className="svc-card__icon"><Icon name={s.icon} /></span>
      <h3>{s.name}</h3>
      <p>{s.short}</p>
      <span className="svc-card__more">Learn more <Icon name="arrow" size={16} /></span>
    </Link>
  );
}

export function FaqList({ faqs }: { faqs: Faq[] }) {
  return (
    <div className="faq">
      {faqs.map((f) => (
        <details key={f.q}>
          <summary>{f.q}<span className="faq-plus" aria-hidden="true" /></summary>
          <p>{f.a}</p>
        </details>
      ))}
    </div>
  );
}

export function CtaBand({ title = 'Tell us what you need. We’ll reply within one business day.', text = 'Free 30-minute consultation with a solutions architect. No obligation, no hard sell.' }: { title?: string; text?: string }) {
  return (
    <section className="cta-band">
      <div className="container cta-band__inner">
        <div>
          <h2>{title}</h2>
          <p>{text}</p>
        </div>
        <div className="cta-band__actions">
          <Link href="/contact" className="btn btn-light btn-lg">Book a free consultation</Link>
          <Link href="/pricing" className="btn btn-outline-light btn-lg">See plans & pricing</Link>
        </div>
      </div>
    </section>
  );
}

export function PageHero({ eyebrow, title, text, image, crumbs, children }: { eyebrow: string; title: string; text: string; image?: string; crumbs?: { name: string; path: string }[]; children?: React.ReactNode }) {
  return (
    <section className={`page-hero${image ? ' page-hero--img' : ''}`}>
      <div className="container page-hero__grid">
        <div className="page-hero__copy">
          {crumbs && <Breadcrumbs items={crumbs} />}
          <span className="eyebrow">{eyebrow}</span>
          <h1>{title}</h1>
          <p className="lead">{text}</p>
          {children}
        </div>
        {image && (
          <div className="page-hero__media">
            <Image src={image} alt="" fill sizes="(max-width: 900px) 100vw, 520px" priority />
          </div>
        )}
      </div>
    </section>
  );
}

export function Check({ children }: { children: React.ReactNode }) {
  return <li className="check"><Icon name="check" size={18} /> <span>{children}</span></li>;
}
