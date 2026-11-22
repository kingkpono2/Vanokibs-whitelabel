import type { Metadata } from 'next';
import { brand } from '@/content/brand';
import { services } from '@/content/services';
import { itemFromKey } from '@/lib/catalog';
import { cad } from '@/content/plans';
import { Breadcrumbs, PageHero } from '@/components/Bits';
import { QuoteForm } from '@/components/QuoteForm';
import { pageMeta } from '@/lib/seo';

export const metadata: Metadata = pageMeta({
  title: 'Contact Us & Get a Quote',
  description: 'Book a free 30-minute consultation with a solutions architect or request a quote for IT support, software, DevOps, ecommerce, ERP or email services anywhere in Canada.',
  path: '/contact',
});

type Props = { searchParams: Promise<{ item?: string; service?: string }> };

export default async function ContactPage({ searchParams }: Props) {
  const sp = await searchParams;
  const item = sp.item ? itemFromKey(sp.item) : null;
  const preselect = services.some((s) => s.slug === sp.service) ? sp.service! : '';
  const itemLabel = item ? `${item.name} (${cad(item.amount)}${item.recurring ? `/${item.recurring}` : ''})` : '';
  return (
    <>
      <PageHero eyebrow="Contact" title="Contact us" text="Tell us about your project. We reply within one business day." crumbs={[{ name: 'Home', path: '/' }, { name: 'Contact', path: '/contact' }]} />
      <section className="section">
        <div className="container contact-grid">
          <QuoteForm preselect={preselect} itemLabel={itemLabel} />
          <div className="contact-side">
            <div className="value"><h3>Free 30-minute consultation</h3><p>Practical advice from a senior architect, with no obligation.</p></div>
            <div className="value"><h3>Reply within 1 business day</h3><p>{brand.hours}.</p></div>
            <div className="value"><h3>Confidential</h3><p>We are happy to sign an NDA before you share details.</p></div>
            {brand.email && <div className="value"><h3>Prefer email?</h3><p><a href={`mailto:${brand.email}`}>{brand.email}</a></p></div>}
          </div>
        </div>
      </section>
    </>
  );
}
