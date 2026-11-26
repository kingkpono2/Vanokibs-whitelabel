import Image from 'next/image';
import Link from 'next/link';
import type { Metadata } from 'next';
import { Breadcrumbs, CtaBand, PageHero, Check } from '@/components/Bits';
import { pageMeta } from '@/lib/seo';
import { brand } from '@/content/brand';

export const metadata: Metadata = pageMeta({
  title: 'How It Works: Hiring an On-Demand Technology Team',
  description: `How ${brand.name} works with Canadian businesses: free consultation, a written plan and price, secure onboarding, then regular delivery, reporting and a shared roadmap.`,
  path: '/how-it-works',
});

const phases = [
  { t: 'Free consultation', d: 'A 30-minute call with a solutions architect. We ask about your goals, your systems and what is getting in the way. You leave with useful advice whether or not you hire us.' },
  { t: 'Plan & price', d: 'Within two business days you receive a short written plan: what we recommend, what it costs, and whether a subscription, fixed project or hourly work makes most sense.' },
  { t: 'Secure onboarding', d: 'We set up access with MFA and least privilege, document your systems and passwords in a vault you own, and deliver quick wins in the first week.' },
  { t: 'Deliver, measure, improve', d: 'Work is tracked in a shared board. You get monthly reports, a roadmap that evolves with your business, and a quarterly review on higher plans.' },
];

export default function HowItWorks() {
  return (
    <>
      <PageHero eyebrow="How it works" title="How we work" text="Most businesses don’t need a full-time CTO, DevOps engineer, developer and IT administrator. They need access to all of them, at the right moment. That is what we provide." crumbs={[{ name: 'Home', path: '/' }, { name: 'How it works', path: '/how-it-works' }]} />
      <section className="section">
        <div className="container"><ol className="steps">{phases.map((p) => <li key={p.t}><h3>{p.t}</h3><p>{p.d}</p></li>)}</ol></div>
      </section>
      <section className="section section--soft">
        <div className="container split">
          <div className="split__media"><Image src="/images/team2.webp" alt="Engineers collaborating on a client project" fill sizes="(max-width: 900px) 100vw, 560px" /></div>
          <div>
            <span className="eyebrow">Our principles</span>
            <h2>How we behave as your technology partner</h2>
            <ul>
              <Check>Business outcomes first: every recommendation explains the benefit and the cost</Check>
              <Check>Simple beats clever: we use proven platforms before custom code</Check>
              <Check>You own it: code, accounts, documentation and data stay in your name</Check>
              <Check>Security by default: MFA, least privilege, encrypted backups</Check>
              <Check>No surprises: we ask before going over your hours or budget</Check>
            </ul>
            <Link href="/pricing" className="btn btn-primary">Choose how to work with us</Link>
          </div>
        </div>
      </section>
      <CtaBand />
    </>
  );
}
