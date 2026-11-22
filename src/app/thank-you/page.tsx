import Link from 'next/link';
import type { Metadata } from 'next';
import { Icon } from '@/components/Icon';

export const metadata: Metadata = { title: 'Thank you', robots: { index: false, follow: false } };

export default function ThankYou() {
  return (
    <section className="container thanks">
      <span className="thanks__icon"><Icon name="check" size={36} /></span>
      <h1>Payment received. Welcome aboard!</h1>
      <p className="lead">Your receipt is on its way by email. A solutions architect will contact you within one business day to schedule your onboarding call.</p>
      <p><Link href="/" className="btn btn-primary">Back to home</Link></p>
    </section>
  );
}
