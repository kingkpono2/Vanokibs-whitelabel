import Link from 'next/link';
import Image from 'next/image';
import type { Metadata } from 'next';
import { brand } from '@/content/brand';
import { services } from '@/content/services';
import { industries } from '@/content/industries';
import { locations } from '@/content/locations';
import { plans, cad, PAYG_RATE } from '@/content/plans';
import { ServiceCard, CtaBand, FaqList, Check } from '@/components/Bits';
import { JsonLd } from '@/components/JsonLd';
import { faqLd, pageMeta } from '@/lib/seo';

export const metadata: Metadata = pageMeta({
  title: `${brand.name} | IT, Software & DevOps for Canadian Business`,
  absolute: true,
  description:
    'IT support, custom software, DevOps and cloud, ecommerce, fintech, Odoo ERP, Magento, WordPress, mobile apps and business email for Canadian companies. Monthly plans, fixed projects or hourly.',
  path: '/',
});

const homeFaqs = [
  { q: 'What does a subscription include?', a: 'A set number of hours each month for any of our services, plus monitoring, updates, backups and a monthly report. Unused hours roll over once.' },
  { q: 'Can I hire you for one project?', a: 'Yes. Pick a fixed-price package or ask for a quote. Larger projects start with a deposit and are billed at milestones.' },
  { q: 'Do you work outside Ontario?', a: 'Yes, with clients in every province. We work remotely and cover Atlantic to Pacific business hours.' },
  { q: 'How do payments and taxes work?', a: 'Prices are in Canadian dollars. Pay by card through Stripe or by EFT on invoice. GST/HST or QST is added where it applies.' },
];

export default function Home() {
  return (
    <>
      <section className="hero">
        <div className="container hero-grid">
          <div>
            <h1>IT support, software and cloud services for Canadian businesses</h1>
            <p className="lead">One team for your systems, websites and applications. Work with us on a monthly plan, a fixed-price project, or by the hour.</p>
            <div className="hero-actions">
              <Link href="/pricing" className="btn btn-primary btn-lg">View pricing</Link>
              <Link href="/contact" className="btn btn-ghost btn-lg">Book a consultation</Link>
            </div>
            <p className="hero-note">Clients across Canada · Prices in CAD · Reply within one business day</p>
          </div>
          <div className="hero-media">
            <Image src="/images/team.webp" alt="Our team reviewing a client project" fill sizes="(max-width: 900px) 100vw, 520px" priority />
          </div>
        </div>
      </section>

      <section className="tech-strip" aria-label="Platforms we work with">
        <div className="container tech-strip__inner">
          <p>We work with</p>
          <span className="tech-list">{['AWS', 'Azure', 'Google Cloud', 'Microsoft 365', 'Shopify', 'Odoo', 'Magento', 'WordPress', 'Stripe'].join(', ')}</span>
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
          <div className="section-head">
            <h2>Ways to work with us</h2>
          </div>
          <div className="models">
            <article className="model">
              <h3>Monthly plan</h3>
              <p className="model__price">From {cad(plans[0].monthly)}<small> / month</small></p>
              <ul>
                <Check>Hours each month for any service</Check>
                <Check>Monitoring, updates and backups</Check>
                <Check>Guaranteed response times</Check>
              </ul>
              <Link href="/pricing" className="btn btn-primary btn-block">Compare plans</Link>
            </article>
            <article className="model">
              <h3>Fixed-price project</h3>
              <p className="model__price">From {cad(890)}</p>
              <ul>
                <Check>Scope and price agreed first</Check>
                <Check>Milestone billing on larger work</Check>
                <Check>Documentation and handover</Check>
              </ul>
              <Link href="/pricing#projects" className="btn btn-ghost btn-block">See packages</Link>
            </article>
            <article className="model">
              <h3>Hourly, as needed</h3>
              <p className="model__price">{cad(PAYG_RATE)}<small> / hour</small></p>
              <ul>
                <Check>No commitment</Check>
                <Check>Prepaid blocks from {cad(120)}/hour</Check>
                <Check>Billed in 15-minute increments</Check>
              </ul>
              <Link href="/pricing#on-demand" className="btn btn-ghost btn-block">Buy hours</Link>
            </article>
          </div>
        </div>
      </section>

      <section className="section">
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

      <section className="section section--soft">
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
