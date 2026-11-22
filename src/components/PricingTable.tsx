'use client';

import { useState } from 'react';
import { plans, cad, annualPrice } from '@/content/plans';
import { CheckoutButton } from './CheckoutButton';
import { Icon } from './Icon';

export function PricingTable() {
  const [billing, setBilling] = useState<'monthly' | 'annual'>('monthly');
  return (
    <div>
      <div className="billing-toggle" role="radiogroup" aria-label="Billing period">
        <button role="radio" aria-checked={billing === 'monthly'} className={billing === 'monthly' ? 'is-on' : ''} onClick={() => setBilling('monthly')}>Monthly</button>
        <button role="radio" aria-checked={billing === 'annual'} className={billing === 'annual' ? 'is-on' : ''} onClick={() => setBilling('annual')}>
          Annual <span className="save-pill">2 months free</span>
        </button>
      </div>
      <div className="plans">
        {plans.map((p) => {
          const price = billing === 'monthly' ? p.monthly : Math.round(annualPrice(p) / 12);
          return (
            <article key={p.id} className={`plan${p.popular ? ' plan--popular' : ''}`} aria-labelledby={`plan-${p.id}`}>
              {p.popular && <span className="plan__badge">Most popular</span>}
              <h3 id={`plan-${p.id}`}>{p.name}</h3>
              <p className="plan__blurb">{p.blurb}</p>
              <p className="plan__price">
                <strong>{cad(price)}</strong><span>/month</span>
              </p>
              <p className="plan__billing">
                {billing === 'annual' ? `${cad(annualPrice(p))} billed yearly` : 'Billed monthly · cancel with 30 days’ notice'}
              </p>
              <ul className="plan__meta">
                <li>{p.hours} hours included / month</li>
                <li>Response: {p.response}</li>
              </ul>
              <CheckoutButton kind="plan" id={p.id} billing={billing} label={`Subscribe to ${p.name}`} className={`btn ${p.popular ? 'btn-primary' : 'btn-dark'} btn-block`} />
              <ul className="plan__features">
                {p.features.map((f) => <li key={f}>{f}</li>)}
              </ul>
            </article>
          );
        })}
      </div>
    </div>
  );
}
