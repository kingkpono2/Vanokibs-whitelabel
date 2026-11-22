import type { Metadata } from 'next';
import Link from 'next/link';
import { brand } from '@/content/brand';
import { Breadcrumbs, PageHero } from '@/components/Bits';
import { pageMeta } from '@/lib/seo';

export const metadata: Metadata = pageMeta({ title: 'Terms of Service', description: `Terms for ${brand.name} subscriptions, projects and on-demand services in Canada.`, path: '/legal/terms' });

export default function Terms() {
  return (
    <>
      <PageHero eyebrow="Legal" title="Terms of service" text="The short version: clear scope, fair notice periods, and you own your work." crumbs={[{ name: 'Home', path: '/' }, { name: 'Terms of service', path: '/legal/terms' }]} />
      <section className="section">
        <div className="container prose">
          <p>These terms apply to services provided by {brand.legalName} (“we”) to business customers (“you”). A signed proposal or statement of work takes precedence where it differs.</p>
          <h2>1. Services</h2>
          <p>We provide technology services by monthly subscription, fixed-price project or hourly engagement, as described on our <Link href="/pricing">pricing page</Link> or in a written proposal.</p>
          <h2>2. Subscriptions</h2>
          <ul>
            <li>Subscriptions renew automatically each month or year until cancelled.</li>
            <li>Included hours may be used for any service we offer. Unused hours roll over to the following month once.</li>
            <li>You may upgrade at any time. Downgrades and cancellations take effect at the end of the current billing period with 30 days’ notice.</li>
            <li>Hours beyond your plan are only used with your approval and are invoiced at the rate for your plan.</li>
          </ul>
          <h2>3. Projects and deposits</h2>
          <p>Fixed-price projects are delivered to the agreed scope. Where a deposit applies, it reserves your start date; the balance is invoiced at agreed milestones. Changes to scope are quoted before work starts.</p>
          <h2>4. Fees, taxes and payment</h2>
          <p>Prices are in Canadian dollars and exclude GST/HST/QST, which are added where applicable. Card payments are processed by Stripe. Invoices are due within 15 days unless agreed otherwise.</p>
          <h2>5. Ownership</h2>
          <p>On payment, you own the deliverables we create specifically for you. Accounts we set up are created in your organisation’s name. We may reuse general know-how and open-source components.</p>
          <h2>6. Confidentiality and security</h2>
          <p>We keep your information confidential, access your systems only as needed to provide the services, and follow the security practices described in our <Link href="/legal/privacy">privacy policy</Link>.</p>
          <h2>7. Liability</h2>
          <p>Our total liability for any claim is limited to the fees you paid in the three months before the claim. We are not liable for indirect or consequential losses. Nothing limits liability that cannot be limited by law.</p>
          <h2>8. Governing law</h2>
          <p>These terms are governed by the laws of the province in which you are located and the federal laws of Canada that apply there.</p>
          <p className="muted">These terms are a starting template and should be reviewed by your legal counsel before use.</p>
        </div>
      </section>
    </>
  );
}
