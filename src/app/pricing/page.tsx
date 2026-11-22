import Link from 'next/link';
import type { Metadata } from 'next';
import { plans, packages, hourBlocks, cad, PAYG_RATE, EMERGENCY_RATE, annualPrice, SHOW_PRICES } from '@/content/plans';
import { serviceBySlug } from '@/content/services';
import { Breadcrumbs, CtaBand, FaqList, PageHero } from '@/components/Bits';
import { PricingTable } from '@/components/PricingTable';
import { CheckoutButton } from '@/components/CheckoutButton';
import { JsonLd } from '@/components/JsonLd';
import { faqLd, pageMeta } from '@/lib/seo';
import { absoluteUrl, brand } from '@/content/brand';

export const metadata: Metadata = pageMeta(
  SHOW_PRICES
    ? {
        title: 'Pricing: Tech Subscriptions, Projects & Hourly',
        description: `Transparent pricing in Canadian dollars. Monthly tech subscriptions from ${cad(plans[0].monthly)}, fixed-price projects from ${cad(890)}, and on-demand hours from ${cad(120)}. Annual plans get 2 months free.`,
        path: '/pricing',
      }
    : {
        title: 'Plans: Monthly Support, Projects & Hourly Work',
        description: 'Monthly technology plans, fixed-scope projects and hourly support for Canadian businesses. Every engagement is priced after a free consultation.',
        path: '/pricing',
      },
);

const pricingFaqs = [
  { q: 'What happens to unused hours?', a: 'Unused subscription hours roll over to the next month once, so a quiet month is never wasted. Prepaid hour blocks are valid for 6 or 12 months.' },
  { q: 'Can I change or cancel my plan?', a: 'Yes. Upgrade at any time; downgrades and cancellations take effect at the end of the billing period with 30 days’ notice. Annual plans can be upgraded at any time.' },
  { q: 'What if I need more hours than my plan includes?', a: SHOW_PRICES ? `Extra hours are billed at a discounted rate on Growth and Scale plans, or at the standard ${cad(PAYG_RATE)}/hour on Essentials. We always ask before going over.` : 'Extra hours are billed at the rate agreed in your plan, and we always ask before going over.' },
  { q: 'How is pricing decided?', a: 'After a free consultation we send a written proposal with a fixed monthly fee, a fixed project price or an hourly rate. GST/HST or QST is added according to your province.' },
  { q: 'How do project deposits work?', a: 'Larger fixed-price projects start with a 30% deposit to reserve your start date. The balance is invoiced at agreed milestones, never all up front.' },
  { q: 'Which payment methods do you accept?', a: 'Credit card or EFT on invoice.' },
];

export default function PricingPage() {
  const offers: { name: string; price: number; unit?: string }[] = [
    ...plans.map((p) => ({ name: `${p.name} plan`, price: p.monthly, unit: 'MON' })),
    ...packages.map((p) => ({ name: p.name, price: p.price })),
    ...hourBlocks.map((b) => ({ name: `${b.hours} prepaid hours`, price: b.price })),
  ];
  return (
    <>
      <PageHero eyebrow={SHOW_PRICES ? 'Pricing' : 'Plans'} title={SHOW_PRICES ? 'Pricing' : 'Plans'} text={SHOW_PRICES ? 'Monthly plans, fixed-price projects and hourly work. All prices in Canadian dollars.' : 'Monthly plans, fixed-scope projects and hourly work. Every engagement is priced after a free consultation.'} crumbs={[{ name: 'Home', path: '/' }, { name: 'Pricing', path: '/pricing' }]} />

      <section className="section" id="subscriptions">
        <div className="container">
          <div className="section-head section-head--center">
            <span className="eyebrow">Monthly subscriptions</span>
            <h2>A dedicated team, every month</h2>
            <p>Use your hours for anything we offer: support, development, DevOps, ecommerce, ERP or email.</p>
          </div>
          <PricingTable
            showPrices={SHOW_PRICES}
            plans={plans.map(({ id, name, blurb, hours, response, features, popular, monthly }) => ({
              id, name, blurb, hours, response, features, popular,
              ...(SHOW_PRICES ? { monthly, annual: annualPrice(plans.find((x) => x.id === id)!) } : {}),
            }))}
          />
          <p className="tax-note">{SHOW_PRICES ? 'Prices in CAD, before GST/HST/QST. Annual billing: 12 months for the price of 10.' : 'Book a free consultation and we’ll send a written proposal for your business.'}</p>
        </div>
      </section>

      <section className="section section--soft" id="compare">
        <div className="container">
          <div className="section-head"><span className="eyebrow">Compare</span><h2>Plan comparison</h2></div>
          <div className="table-wrap">
            <table className="compare">
              <thead><tr><th scope="col">Feature</th>{plans.map((p) => <th key={p.id} scope="col">{p.name}</th>)}</tr></thead>
              <tbody>
                {SHOW_PRICES && <tr><th scope="row">Monthly price</th>{plans.map((p) => <td key={p.id}>{cad(p.monthly)}</td>)}</tr>}
                {SHOW_PRICES && <tr><th scope="row">Annual price (2 months free)</th>{plans.map((p) => <td key={p.id}>{cad(annualPrice(p))}</td>)}</tr>}
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
            <h2>{SHOW_PRICES ? 'Fixed-price packages' : 'Project packages'}</h2>
            <p>{SHOW_PRICES ? 'Clear scope, clear price.' : 'Clear scope, agreed before work starts.'} Need something else? <Link href="/contact">Tell us about it</Link>.</p>
          </div>
          <div className="pkg-grid">
            {packages.map((p) => {
              const svc = serviceBySlug(p.service);
              return (
                <article key={p.id} className="pkg">
                  <h3>{p.name}</h3>
                  <p className="muted">{p.blurb}</p>
                  {SHOW_PRICES && <p className="pkg__price">{cad(p.price)}</p>}
                  <p className="pkg__note">{SHOW_PRICES ? (p.deposit ? `${cad(p.deposit)} deposit to start · ` : 'Paid in full · ') : 'Typical timeline: '}{p.timeline}</p>
                  <ul>{p.includes.map((x) => <li key={x}>{x}</li>)}</ul>
                  <CheckoutButton showPrices={SHOW_PRICES} kind="package" id={p.id} label={p.deposit ? 'Pay deposit & book' : 'Buy now'} className="btn btn-dark btn-block" />
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
              <p>{SHOW_PRICES ? <><strong>{cad(PAYG_RATE)}/hour</strong> during business hours, <strong>{cad(EMERGENCY_RATE)}/hour</strong> for emergencies and after-hours work. Billed monthly in 15-minute increments.</> : 'Help when you need it, billed monthly in 15-minute increments, with emergency and after-hours cover available.'}</p>
              <Link href="/contact" className="btn btn-light">Request help</Link>
            </div>
            {hourBlocks.map((b) => (
              <div key={b.id} className="hours-card">
                <h3>{b.hours} hours</h3>
                {SHOW_PRICES && <strong className="big">{cad(b.price)}</strong>}
                <span className="muted">{SHOW_PRICES ? `${cad(b.price / b.hours)}/hour · ` : 'Prepaid block · '}{b.validity}</span>
                <CheckoutButton showPrices={SHOW_PRICES} kind="hours" id={b.id} label="Buy hours" className="btn btn-primary btn-block" />
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container two-col">
          <div className="section-head"><span className="eyebrow">FAQ</span><h2>Questions about plans</h2></div>
          <FaqList faqs={pricingFaqs} />
        </div>
      </section>

      <CtaBand title="Not sure which option fits?" text="Book a free consultation and we’ll recommend the best way to work together, with a written proposal." />
      <JsonLd data={[
        faqLd(pricingFaqs),
        ...(!SHOW_PRICES ? [] : [{
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
        }]),
      ]} />
    </>
  );
}
