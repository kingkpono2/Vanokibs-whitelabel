import type { Metadata } from 'next';
import content from '@/content/editable.json';
import { services } from '@/content/services';
import { itemFromKey } from '@/lib/catalog';
import { localDate } from '@/lib/booking';
import { Breadcrumbs, PageHero } from '@/components/Bits';
import { BookingWidget } from '@/components/BookingWidget';
import { pageMeta } from '@/lib/seo';

export const dynamic = 'force-dynamic';
export const metadata: Metadata = pageMeta({
  title: 'Book a Free Consultation',
  description: 'Choose a time for a free 30-minute consultation about IT support, software, cloud, ecommerce or ERP for your Canadian business.',
  path: '/book',
});

type Props = { searchParams: Promise<{ service?: string; item?: string }> };

export default async function BookPage({ searchParams }: Props) {
  const sp = await searchParams;
  const b = content.booking;
  const preselect = services.some((s) => s.slug === sp.service) ? sp.service! : '';
  const item = sp.item ? itemFromKey(sp.item)?.name.replace(/: project deposit$/, '') || '' : '';
  return (
    <>
      <PageHero eyebrow="Consultation" title={b.pageTitle} text={b.pageText} crumbs={[{ name: 'Home', path: '/' }, { name: 'Book a consultation', path: '/book' }]} />
      <section className="section">
        <div className="container">
          <BookingWidget
            today={localDate(Date.now())}
            daysAhead={b.daysAhead}
            timezoneLabel={b.timezoneLabel}
            minutes={b.meetingMinutes}
            confirmationText={b.confirmationText}
            services={services.map(({ slug, name }) => ({ slug, name }))}
            preselect={preselect}
            item={item}
          />
        </div>
      </section>
    </>
  );
}
