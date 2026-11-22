import Link from 'next/link';
import type { Metadata } from 'next';
import { plans, packages, hourBlocks, cad, PAYG_RATE, EMERGENCY_RATE, annualPrice } from '@/content/plans';
import { serviceBySlug } from '@/content/services';
import { Breadcrumbs, CtaBand, FaqList, PageHero } from '@/components/Bits';
import { PricingTable } from '@/components/PricingTable';
import { CheckoutButton } from '@/components/CheckoutButton';
import { JsonLd } from '@/components/JsonLd';
import { faqLd, pageMeta } from '@/lib/seo';
import { absoluteUrl, brand } from '@/content/brand';

export const metadata: Metadata = pageMeta({
  title: 'Pricing: Tech Subscriptions, Projects & Hourly',
  description: `Transparent pricing in Canadian dollars. Monthly tech subscriptions from ${cad(plans[0].monthly)}, fixed-price projects from ${cad(890)}, and on-demand hours from ${cad(120)}. Annual plans get 2 months free.`,
  path: '/pricing',
});

const pricingFaqs = [
  { q: 'What happens to unused hours?', a: 'Unused subscription hours roll over to the next month once, so a quiet month is never wasted. Prepaid hour blocks are valid for 6 or 12 months.' },
  { q: 'Can I change or cancel my plan?', a: 'Yes. Upgrade at any time; downgrades and cancellations take effect at the end of the billing period with 30 days’ notice. Annual plans can be upgraded at any time.' },
  { q: 'What if I need more hours than my plan includes?', a: `Extra hours are billed at a discounted rate on Growth and Scale plans, or at the standard ${cad(PAYG_RATE)}/hour on Essentials. We always ask before going over.` },
  { q: 'Are taxes included?', a: 'Prices exclude GST/HST and QST, which are added at checkout according to your province. You receive a tax invoice for every payment.' },
  { q: 'How do project deposits work?', a: 'Larger fixed-price projects start with a 30% deposit to reserve your start date. The balance is invoiced at agreed milestones, never all up front.' },
  { q: 'Which payment methods do you accept?', a: 'Visa, Mastercard and American Express through Stripe. Annual plans and larger projects can also be paid by EFT on invoice.' },
];

export default function PricingPage() {
  const offers: { name: string; price: number; unit?: string }[] = [
    ...plans.map((p) => ({ name: `${p.name} plan`, price: p.monthly, unit: 'MON' })),
    ...packages.map((p) => ({ name: p.name, price: p.price })),
    ...hourBlocks.map((b) => ({ name: `${b.hours} prepaid hours`, price: b.price })),
  ];
  return (
    <>
      <PageHero eyebrow="Pricing" title="Pricing" text="Monthly plans, fixed-price projects and hourly work. All prices in Canadian dollars." crumbs={[{ name: 'Home', path: '/' }, { name: 'Pricing', path: '/pricing' }]} />

      <section className="section" id="subscriptions">
        <div className="container">
          <div className="section-head section-head--center">
            <span className="eyebrow">Monthly subscriptions</span>
            <h2>A dedicated team, every month</h2>
            <p>Use your hours for anything we offer: support, development, DevOps, ecommerce, ERP or email.</p>
          </div>
          <PricingTable />
          <p className="tax-note">Prices in CAD, before GST/HST/QST. Annual billing: 12 months for the price of 10.</p>
        </div>
      </section>

      <section className="section section--soft" id="compare">
        <div className="container">
          <div className="section-head"><span className="eyebrow">Compare</span><h2>Plan comparison</h2></div>
          <div className="table-wrap">
            <table className="compare">
              <thead><tr><th scope="col">Feature</th>{plans.map((p) => <th key={p.id} scope="col">{p.name}</th>)}</tr></thead>
              <tbody>
                <tr><th scope="row">Monthly price</th>{plans.map((p) => <td key={p.id}>{cad(p.monthly)}</td>)}</tr>
                <tr><th scope="row">Annual price (2 months free)</th>{plans.map((p) => <td key={p.id}>{cad(annualPrice(p))}</td>)}</tr>
                <tr><th scope="row">Hours included / month</th>{plans.map((p) => <td key={p.id}>{p.hours}</td>)}</tr>
                <tr><th scope="row">Response time</th>{plans.map((p) => <td key={p.id}>{p.response}</td>)}</tr>
                <tr><th scope="row">Websites / apps managed</th><td>1</td><td>Up to 3</td><td>Unlimited</td></tr>
                <tr><th scope="row">Microsoft 365 / Workspace users</th><td>Up to 25</td><td>Up to 100</td><td>Unlimited</td></tr>
                <tr><th scope="row">Phone support</th><td>—</td><td>✓</td><td>✓</td></tr>
                <tr><th scope="row">Dedicated project lead</th><td>—</td><td>✓</td><td>✓ + architect</td></tr>
                <tr><th scope="row">CI/CD & staging environment</th><td>—</td><td>✓</td><td>✓</td></tr>
                <tr><th scope="row">24/7 monitoring & on-call</th><td>—</td><td>—</td><td>✓</td></tr>
                <tr><th scope="row">Security reviews & audit evidence</th><td>—</td><td>Quarterly review</td><td>✓ (SOC 2, PIPEDA)</td></tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section className="section" id="projects">
        <div className="container">
          <div className="section-head">
            <span className="eyebrow">One-time projects</span>
            <h2>Fixed-price packages</h2>
            <p>Clear scope, clear price. Need something else? <Link href="/contact">Ask for a fixed quote</Link>.</p>
          </div>
          <div className="pkg-grid">
            {packages.map((p) => {
              const svc = serviceBySlug(p.service);
              return (
                <article key={p.id} className="pkg">
                  <h3>{p.name}</h3>
                  <p className="muted">{p.blurb}</p>
                  <p className="pkg__price">{cad(p.price)}</p>
                  <p className="pkg__note">{p.deposit ? `${cad(p.deposit)} deposit to start · ` : 'Paid in full · '}{p.timeline}</p>
                  <ul>{p.includes.map((x) => <li key={x}>{x}</li>)}</ul>
                  <CheckoutButton kind="package" id={p.id} label={p.deposit ? 'Pay deposit & book' : 'Buy now'} className="btn btn-dark btn-block" />
                  {svc && <Link href={`/services/${svc.slug}`} className="muted" style={{ fontSize: 14, marginTop: 12, textAlign: 'center' }}>About {svc.name}</Link>}
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="section section--soft" id="on-demand">
        <div className="container">
          <div className="section-head">
            <span className="eyebrow">As needed</span>
            <h2>On-demand hours</h2>
            <p>No commitment. Perfect for occasional fixes, small changes and urgent help.</p>
          </div>
          <div className="hours-grid">
            <div className="hours-card hours-card--intro">
              <h3>Pay as you go</h3>
              <p><strong>{cad(PAYG_RATE)}/hour</strong> during business hours, <strong>{cad(EMERGENCY_RATE)}/hour</strong> for emergencies and after-hours work. Billed monthly in 15-minute increments.</p>
              <Link href="/contact" className="btn btn-light">Request help</Link>
            </div>
            {hourBlocks.map((b) => (
              <div key={b.id} className="hours-card">
                <h3>{b.hours} hours</h3>
                <strong className="big">{cad(b.price)}</strong>
                <span className="muted">{cad(b.price / b.hours)}/hour · {b.validity}</span>
                <CheckoutButton kind="hours" id={b.id} label="Buy hours" className="btn btn-primary btn-block" />
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container two-col">
          <div className="section-head"><span className="eyebrow">Billing FAQ</span><h2>Questions about pricing</h2></div>
          <FaqList faqs={pricingFaqs} />
        </div>
      </section>

      <CtaBand title="Not sure which option fits?" text="Tell us about your business and we’ll recommend the most cost-effective way to work together." />
      <JsonLd data={[
        faqLd(pricingFaqs),
        {
          '@context': 'https://schema.org',
          '@type': 'OfferCatalog',
          name: `${brand.name} pricing`,
          url: absoluteUrl('/pricing'),
          itemListElement: offers.map((o) => ({
            '@type': 'Offer',
            name: o.name,
            priceCurrency: 'CAD',
            price: o.price,
            ...(o.unit ? { priceSpecification: { '@type': 'UnitPriceSpecification', price: o.price, priceCurrency: 'CAD', unitCode: o.unit } } : {}),
            seller: { '@id': absoluteUrl('/#organization') },
          })),
        },
      ]} />
    </>
  );
}
