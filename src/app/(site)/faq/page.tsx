import type { Metadata } from 'next';
import Link from 'next/link';
import { services } from '@/content/services';
import { Breadcrumbs, CtaBand, FaqList, PageHero } from '@/components/Bits';
import { JsonLd } from '@/components/JsonLd';
import { faqLd, pageMeta } from '@/lib/seo';
import { brand } from '@/content/brand';

export const metadata: Metadata = pageMeta({
  title: 'Frequently Asked Questions',
  description: 'Answers about our subscriptions, projects, hourly work, response times, data residency, security, payments and every service we offer to Canadian businesses.',
  path: '/faq',
});

const general = [
  { q: `Who is ${brand.name} for?`, a: 'Canadian small and mid-sized businesses, start-ups and non-profits that need senior technology skills (IT, software, DevOps, ecommerce or ERP) without hiring a full in-house team.' },
  { q: 'Do I need a subscription to work with you?', a: 'No. You can buy a fixed-price package, prepaid hours or pay as you go. Subscriptions simply give you a dedicated team, guaranteed response times and lower hourly cost.' },
  { q: 'Where is your team?', a: 'We work remotely across Canada, with support hours that cover Atlantic to Pacific time. On-site visits can be arranged in major cities.' },
  { q: 'Will you sign an NDA?', a: 'Yes, on request before we discuss confidential details. Our terms of service also include confidentiality obligations.' },
  { q: 'Who owns the work you produce?', a: 'You do. Code, designs, documentation and every account we create are in your organisation’s name.' },
];

export default function FaqPage() {
  const all = [...general, ...services.flatMap((s) => s.faqs)];
  return (
    <>
      <PageHero eyebrow="FAQ" title="Frequently asked questions" text="Everything you might want to know before hiring us. Still unsure? Ask us directly." crumbs={[{ name: 'Home', path: '/' }, { name: 'FAQ', path: '/faq' }]} />
      <section className="section">
        <div className="container two-col">
          <div className="section-head"><span className="eyebrow">General</span><h2>Working with us</h2></div>
          <FaqList faqs={general} />
        </div>
      </section>
      {services.map((s, i) => (
        <section key={s.slug} className={`section${i % 2 === 0 ? ' section--soft' : ''}`} style={{ paddingTop: 56, paddingBottom: 56 }}>
          <div className="container two-col">
            <div className="section-head"><span className="eyebrow">{s.name}</span><h2 style={{ fontSize: 28 }}><Link href={`/services/${s.slug}`}>{s.name}</Link></h2></div>
            <FaqList faqs={s.faqs} />
          </div>
        </section>
      ))}
      <CtaBand />
      <JsonLd data={faqLd(all)} />
    </>
  );
}
