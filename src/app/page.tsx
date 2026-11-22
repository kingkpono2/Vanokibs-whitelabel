import Link from 'next/link';
import Image from 'next/image';
import type { Metadata } from 'next';
import { brand } from '@/content/brand';
import { services } from '@/content/services';
import { industries } from '@/content/industries';
import { locations } from '@/content/locations';
import { plans, cad, PAYG_RATE } from '@/content/plans';
import { Icon } from '@/components/Icon';
import { ServiceCard, CtaBand, FaqList, Check } from '@/components/Bits';
import { JsonLd } from '@/components/JsonLd';
import { faqLd, pageMeta } from '@/lib/seo';

export const metadata: Metadata = pageMeta({
  title: `${brand.name} | IT, Software & DevOps for Canadian Business`,
  absolute: true,
  description:
    'Hire a senior technology team in Canada by subscription, project or the hour: managed IT support, custom software, DevOps & cloud, ecommerce, fintech, Odoo ERP, Magento, WordPress, mobile apps and business email/SMTP.',
  path: '/',
});

const homeFaqs = [
  { q: 'What exactly do I get with a subscription?', a: 'A set number of hours each month that you can use for anything we offer (support tickets, website changes, DevOps, development), plus the proactive work included in your plan: monitoring, updates, backups and reporting. Unused hours roll over for one month.' },
  { q: 'Can I hire you for a single project instead?', a: 'Yes. Choose a fixed-price package such as an email & SMTP set-up or a store launch, or ask for a fixed quote for a custom project. Larger projects start with a deposit and are billed at milestones.' },
  { q: 'Do you work with companies outside Ontario?', a: 'We work with businesses in every province and territory. Everything is delivered remotely, with support hours that cover Atlantic to Pacific time.' },
  { q: 'How do payments and taxes work?', a: 'Prices are in Canadian dollars. Subscriptions and packages are paid securely by card through Stripe, and you receive a proper invoice. GST/HST or QST is added where applicable.' },
];

export default function Home() {
  const growth = plans.find((p) => p.popular)!;
  return (
    <>
      <section className="hero">
        <div className="container hero-grid">
          <div>
            <span className="eyebrow">Technology partner for Canadian businesses</span>
            <h1>Your senior tech team, <span className="grad-text">on demand.</span></h1>
            <p className="lead">
              IT support, custom software, DevOps, ecommerce, fintech, ERP and cloud email, delivered by one accountable team. Hire us by monthly subscription, by project, or only when you need us.
            </p>
            <div className="hero-actions">
              <Link href="/pricing" className="btn btn-primary btn-lg">See plans & pricing</Link>
              <Link href="/contact" className="btn btn-outline-light btn-lg">Book a free consultation</Link>
            </div>
            <ul className="hero-proof">
              <li><Icon name="maple" size={18} /> Serving all of Canada</li>
              <li><Icon name="clock" size={18} /> Replies within 1 business day</li>
              <li><Icon name="lock" size={18} /> Canadian data residency options</li>
            </ul>
          </div>
          <div className="hero-media" aria-hidden="true">
            <div className="hero-photo hero-photo--a"><Image src="/images/dev-woman.webp" alt="" fill sizes="(max-width: 900px) 90vw, 480px" priority /></div>
            <div className="hero-photo hero-photo--b"><Image src="/images/server2.webp" alt="" fill sizes="(max-width: 900px) 50vw, 280px" priority /></div>
            <div className="hero-card hero-card--a"><span className="ic"><Icon name="rocket" size={20} /></span><span><strong>Deploy shipped</strong>CI/CD · 2 min ago</span></div>
            <div className="hero-card hero-card--b"><span className="ic"><Icon name="support" size={20} /></span><span><strong>Ticket resolved</strong>Within plan SLA</span></div>
          </div>
        </div>
      </section>

      <section className="tech-strip" aria-label="Platforms we work with">
        <div className="container tech-strip__inner">
          <p>Platforms we work with</p>
          <ul>
            {['AWS', 'Azure', 'Google Cloud', 'Microsoft 365', 'Shopify', 'Odoo', 'Magento', 'WordPress', 'Stripe', 'React Native', 'Kubernetes'].map((t) => <li key={t}>{t}</li>)}
          </ul>
        </div>
      </section>

      <section className="section" id="services">
        <div className="container">
          <div className="section-head">
            <span className="eyebrow">What we do</span>
            <h2>Everything your business runs on, handled by one team</h2>
            <p>From the laptop on your desk to the cloud behind your app. No more juggling five freelancers and an agency.</p>
          </div>
          <div className="svc-grid">
            {services.map((s) => <ServiceCard key={s.slug} s={s} />)}
          </div>
        </div>
      </section>

      <section className="section section--soft" id="engage">
        <div className="container">
          <div className="section-head section-head--center">
            <span className="eyebrow">Three ways to hire us</span>
            <h2>Pay the way that suits your business</h2>
            <p>Start small and switch at any time. Every option includes the same senior team.</p>
          </div>
          <div className="models">
            <article className="model">
              <span className="model__icon"><Icon name="bolt" /></span>
              <h3>As needed</h3>
              <p>Prepaid hours or pay-as-you-go for occasional fixes and small jobs.</p>
              <p className="model__price">{cad(PAYG_RATE)}<small> /hour, or prepaid from {cad(120)}/hour</small></p>
              <ul>
                <Check>No monthly commitment</Check>
                <Check>Billed in 15-minute increments</Check>
                <Check>Any service, any time</Check>
              </ul>
              <Link href="/pricing#on-demand" className="btn btn-ghost btn-block">Buy hours</Link>
            </article>
            <article className="model model--feature">
              <span className="model__icon"><Icon name="calendar" /></span>
              <h3>Monthly subscription</h3>
              <p>A dedicated team with guaranteed hours, response times and proactive care.</p>
              <p className="model__price">From {cad(plans[0].monthly)}<small> /month</small></p>
              <ul>
                <Check>Monitoring, updates and backups included</Check>
                <Check>Guaranteed response times</Check>
                <Check>Annual billing: 2 months free</Check>
              </ul>
              <Link href="/pricing" className="btn btn-primary btn-block">Compare plans</Link>
            </article>
            <article className="model">
              <span className="model__icon"><Icon name="rocket" /></span>
              <h3>One-time project</h3>
              <p>Fixed-price packages and quoted projects with clear deliverables.</p>
              <p className="model__price">From {cad(890)}<small> fixed price</small></p>
              <ul>
                <Check>Scope and price agreed up front</Check>
                <Check>Milestone billing for larger work</Check>
                <Check>Handover docs and training</Check>
              </ul>
              <Link href="/pricing#projects" className="btn btn-ghost btn-block">See packages</Link>
            </article>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container split">
          <div className="split__media"><Image src="/images/team.webp" alt="A Vanokibs team planning a client roadmap" fill sizes="(max-width: 900px) 100vw, 560px" /></div>
          <div>
            <span className="eyebrow">Digital transformation, done practically</span>
            <h2>A solutions architect who starts with your business</h2>
            <p className="lead">We start by understanding how you sell, deliver and get paid, then recommend the simplest technology that solves the problem. Sometimes that means building something new; often it means fixing and connecting what you already have.</p>
            <ul>
              <Check>Roadmap tied to business outcomes, not technology for its own sake</Check>
              <Check>Honest recommendations, including when not to build</Check>
              <Check>Everything documented, in accounts you own</Check>
            </ul>
            <Link href="/how-it-works" className="btn btn-dark">How we work</Link>
          </div>
        </div>
      </section>

      <section className="section section--dark">
        <div className="container">
          <div className="section-head">
            <span className="eyebrow">Getting started</span>
            <h2>From first call to first result in two weeks</h2>
            <p>A clear, low-risk start, whichever way you choose to work with us.</p>
          </div>
          <ol className="steps">
            <li><h3>Free consultation</h3><p>30 minutes with a solutions architect to understand your goals and systems.</p></li>
            <li><h3>Plan & price</h3><p>A short written plan with a subscription, package or fixed quote.</p></li>
            <li><h3>Onboarding</h3><p>Secure access, documentation of your systems and quick wins in week one.</p></li>
            <li><h3>Deliver & report</h3><p>Regular delivery, a shared roadmap and monthly reporting.</p></li>
          </ol>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-head">
            <span className="eyebrow">Industries</span>
            <h2>Built for how your industry works</h2>
          </div>
          <div className="tiles">
            {industries.map((i) => (
              <Link key={i.slug} href={`/industries/${i.slug}`} className="tile">
                <Image src={i.image} alt="" fill sizes="(max-width: 640px) 100vw, (max-width: 1080px) 50vw, 300px" />
                <span className="tile__body"><h3>{i.name}</h3><span>Explore <Icon name="arrow" size={14} /></span></span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="section section--soft">
        <div className="container">
          <div className="section-head">
            <span className="eyebrow">Why teams choose us</span>
            <h2>Senior people, clear prices, no lock-in</h2>
          </div>
          <div className="values">
            <div className="value"><span className="value__icon"><Icon name="users" /></span><h3>Senior team</h3><p>Architects, engineers and support specialists, without hiring and managing them yourself.</p></div>
            <div className="value"><span className="value__icon"><Icon name="chart" /></span><h3>Transparent pricing</h3><p>Published prices in CAD. You know what you pay before work starts.</p></div>
            <div className="value"><span className="value__icon"><Icon name="lock" /></span><h3>Security by default</h3><p>MFA, least-privilege access and Canadian hosting where it matters.</p></div>
            <div className="value"><span className="value__icon"><Icon name="shield" /></span><h3>You own everything</h3><p>Code, accounts and documentation stay yours, so you are never locked in.</p></div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container two-col">
          <div>
            <span className="eyebrow">Across Canada</span>
            <h2>Local understanding, nationwide delivery</h2>
            <p className="lead">Provincial taxes, French-language requirements, Quebec’s Law 25, AODA accessibility and Canadian data residency are part of how we build, not an afterthought.</p>
            <div className="cities">
              {locations.map((l) => <Link key={l.slug} href={`/locations/${l.slug}`}><Icon name="maple" size={16} /> {l.city}</Link>)}
            </div>
          </div>
          <aside className="aside-card">
            <h3>Most popular: {growth.name}</h3>
            <p>{growth.blurb}</p>
            <p className="price-hint">{cad(growth.monthly)}/month · {growth.hours} hours included</p>
            <Link href="/pricing" className="btn btn-light btn-block">View all plans</Link>
          </aside>
        </div>
      </section>

      <section className="section section--soft">
        <div className="container two-col">
          <div className="section-head">
            <span className="eyebrow">Questions</span>
            <h2>Frequently asked</h2>
            <p>Can’t find your answer? <Link href="/faq">See all FAQs</Link> or <Link href="/contact">ask us directly</Link>.</p>
          </div>
          <FaqList faqs={homeFaqs} />
        </div>
      </section>

      <div className="section--soft"><CtaBand /></div>
      <JsonLd data={faqLd(homeFaqs)} />
    </>
  );
}
