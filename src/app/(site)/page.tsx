import Link from 'next/link';
import Image from 'next/image';
import type { Metadata } from 'next';
import { brand } from '@/content/brand';
import content from '@/content/editable.json';
import { services } from '@/content/services';
import { industries } from '@/content/industries';
import { locations } from '@/content/locations';
import { plans, cad, PAYG_RATE, SHOW_PRICES } from '@/content/plans';
import { ServiceCard, CtaBand, FaqList, Check } from '@/components/Bits';
import { JsonLd } from '@/components/JsonLd';
import { PlatformGrid } from '@/components/Platforms';
import { faqLd, pageMeta } from '@/lib/seo';

export const metadata: Metadata = pageMeta({
  title: `${brand.name} | IT, Software & DevOps for Canadian Business`,
  absolute: true,
  description:
    'IT support, custom software, DevOps and cloud, ecommerce, fintech, Odoo ERP, Magento, WordPress, mobile apps and business email for Canadian companies. Monthly plans, fixed projects or hourly.',
  path: '/',
});

const homeFaqs = content.home.faqs;

export default function Home() {
  return (
    <>
      <section className="hero">
        <div className="container hero-grid">
          <div>
            <h1>{content.home.heroTitle}</h1>
            <p className="lead">{content.home.heroText}</p>
            <div className="hero-actions">
              <Link href="/pricing" className="btn btn-primary btn-lg">{SHOW_PRICES ? 'View pricing' : 'View plans'}</Link>
              <Link href="/book" className="btn btn-ghost btn-lg">Book a consultation</Link>
            </div>
            <p className="hero-note">{content.home.heroNote}</p>
          </div>
          <div className="hero-media">
            <Image src="/images/team.webp" alt="Our team reviewing a client project" fill sizes="(max-width: 900px) 100vw, 520px" priority />
          </div>
        </div>
      </section>


      <section className="section">
        <div className="container">
          <div className="section-head">
            <h2>Services</h2>
          </div>
          <div className="svc-grid">
            {services.map((s) => <ServiceCard key={s.slug} s={s} />)}
          </div>
        </div>
      </section>

      <section className="section section--soft">
        <div className="container">
          <div className="section-head"><h2>Platforms we work with</h2></div>
          <PlatformGrid />
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-head">
            <h2>Ways to work with us</h2>
          </div>
          <div className="models">
            <article className="model">
              <h3>Monthly plan</h3>
              {SHOW_PRICES && <p className="model__price">From {cad(plans[0].monthly)}<small> / month</small></p>}
              <ul>
                <Check>Hours each month for any service</Check>
                <Check>Monitoring, updates and backups</Check>
                <Check>Guaranteed response times</Check>
              </ul>
              <Link href="/pricing" className="btn btn-primary btn-block">Compare plans</Link>
            </article>
            <article className="model">
              <h3>Fixed-price project</h3>
              {SHOW_PRICES && <p className="model__price">From {cad(890)}</p>}
              <ul>
                <Check>Scope and price agreed first</Check>
                <Check>Milestone billing on larger work</Check>
                <Check>Documentation and handover</Check>
              </ul>
              <Link href="/pricing#projects" className="btn btn-ghost btn-block">See packages</Link>
            </article>
            <article className="model">
              <h3>Hourly, as needed</h3>
              {SHOW_PRICES && <p className="model__price">{cad(PAYG_RATE)}<small> / hour</small></p>}
              <ul>
                <Check>No commitment</Check>
                <Check>{SHOW_PRICES ? `Prepaid blocks from ${cad(120)}/hour` : 'Prepaid hour blocks available'}</Check>
                <Check>Billed in 15-minute increments</Check>
              </ul>
              <Link href="/pricing#on-demand" className="btn btn-ghost btn-block">Buy hours</Link>
            </article>
          </div>
        </div>
      </section>

      <section className="section section--soft">
        <div className="container">
          <div className="section-head"><h2>How we start</h2></div>
          <ol className="steps">
            <li><h3>Consultation</h3><p>A 30-minute call about your goals and systems.</p></li>
            <li><h3>Proposal</h3><p>A short written plan and price within two business days.</p></li>
            <li><h3>Onboarding</h3><p>Secure access and documentation in week one.</p></li>
            <li><h3>Delivery</h3><p>Ongoing work, tracked and reported monthly.</p></li>
          </ol>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-head"><h2>Industries</h2></div>
          <div className="tiles">
            {industries.map((i) => (
              <Link key={i.slug} href={`/industries/${i.slug}`} className="tile">
                <Image src={i.image} alt="" fill sizes="(max-width: 640px) 100vw, (max-width: 1080px) 50vw, 300px" />
                <span className="tile__body"><h3>{i.name}</h3></span>
              </Link>
            ))}
          </div>
          <p className="city-line">
            Clients in{' '}
            {locations.map((l, n) => (
              <span key={l.slug}>{n ? (n === locations.length - 1 ? ' and ' : ', ') : ''}<Link href={`/locations/${l.slug}`}>{l.city}</Link></span>
            ))}
            , and across Canada.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container two-col">
          <div className="section-head">
            <h2>Common questions</h2>
            <p><Link href="/faq">All FAQs</Link></p>
          </div>
          <FaqList faqs={homeFaqs} />
        </div>
      </section>

      <CtaBand />
      <JsonLd data={faqLd(homeFaqs)} />
    </>
  );
}
