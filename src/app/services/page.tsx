import type { Metadata } from 'next';
import { services } from '@/content/services';
import { ServiceCard, CtaBand, Breadcrumbs, PageHero } from '@/components/Bits';
import { pageMeta } from '@/lib/seo';

export const metadata: Metadata = pageMeta({
  title: 'Technology Services for Canadian Businesses',
  description: 'Managed IT support, custom software, DevOps & cloud, ecommerce, fintech, ERP & Odoo, Magento, WordPress, mobile apps and business email/SMTP, available by subscription, project or hour across Canada.',
  path: '/services',
});

export default function ServicesPage() {
  return (
    <>
      <PageHero eyebrow="Services" title="One team for every layer of your technology" text="Pick a single service or combine several under one subscription. Every engagement is led by a senior solutions architect." crumbs={[{ name: 'Home', path: '/' }, { name: 'Services', path: '/services' }]} />
      <section className="section">
        <div className="container svc-grid">
          {services.map((s) => <ServiceCard key={s.slug} s={s} />)}
        </div>
      </section>
      <CtaBand />
    </>
  );
}
