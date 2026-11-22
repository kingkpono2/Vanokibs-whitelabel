import type { Metadata } from 'next';
import { brand } from '@/content/brand';
import { Breadcrumbs, PageHero } from '@/components/Bits';
import { pageMeta } from '@/lib/seo';

export const metadata: Metadata = pageMeta({ title: 'Privacy Policy', description: `How ${brand.name} collects, uses and protects personal information under PIPEDA and Quebec’s Law 25.`, path: '/legal/privacy' });

export default function Privacy() {
  return (
    <>
      <PageHero eyebrow="Legal" title="Privacy policy" text="We collect only what we need to respond to you and deliver our services, and we never sell personal information." crumbs={[{ name: 'Home', path: '/' }, { name: 'Privacy policy', path: '/legal/privacy' }]} />
      <section className="section">
        <div className="container prose">
          <p>This policy explains how {brand.legalName} handles personal information in line with Canada’s Personal Information Protection and Electronic Documents Act (PIPEDA), and Quebec’s Act respecting the protection of personal information in the private sector (Law 25) where it applies.</p>
          <h2>What we collect</h2>
          <ul>
            <li>Details you send us through our forms and booking calendar: name, work email, company, phone, province, the time you book and your message.</li>
            <li>Billing details collected by Stripe when you pay. Card numbers are handled by Stripe and never stored by us.</li>
            <li>Information in client systems we access to provide services, handled under our agreement with you.</li>
          </ul>
          <h2>How we use it</h2>
          <ul>
            <li>To reply to your request, prepare quotes and deliver services.</li>
            <li>To invoice and keep the records required for tax purposes.</li>
            <li>We do not sell personal information or use it for unrelated marketing without your consent, in line with CASL.</li>
          </ul>
          <h2>Where it is stored</h2>
          <p>Our website is hosted on Vercel, consultation bookings are stored with our database provider Upstash, and payments are processed by Stripe. These providers may process data outside Canada. Client systems we manage are hosted in Canadian regions where available and requested.</p>
          <h2>Your rights</h2>
          <p>You may ask to access, correct or delete your personal information, or withdraw consent, by contacting us{brand.email ? ` at ${brand.email}` : ' through our contact form'}. We respond within 30 days.</p>
          <h2>Cookies</h2>
          <p>This site does not use advertising or tracking cookies. Strictly necessary cookies may be set by our payment provider during checkout.</p>
          <p className="muted">This policy is a starting template and should be reviewed by your privacy officer or counsel.</p>
        </div>
      </section>
    </>
  );
}
