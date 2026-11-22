import { plans, packages, hourBlocks, annualPrice, cad, ANNUAL_MONTHS_CHARGED } from '@/content/plans';

export type CatalogItem = {
  key: string;
  name: string;
  description: string;
  amount: number; // CAD (dollars)
  recurring?: 'month' | 'year';
};

/** Resolves what a checkout or quote refers to. Prices always come from content/plans.ts, never from the browser. */
export function resolveItem(kind: string, id: string, billing?: string): CatalogItem | null {
  if (kind === 'plan') {
    const p = plans.find((x) => x.id === id);
    if (!p) return null;
    const annual = billing === 'annual';
    return {
      key: `plan:${p.id}:${annual ? 'annual' : 'monthly'}`,
      name: `${p.name} plan (${annual ? 'annual' : 'monthly'})`,
      description: `${p.hours} hours/month included, response ${p.response}.${annual ? ` 12 months for the price of ${ANNUAL_MONTHS_CHARGED}.` : ''}`,
      amount: annual ? annualPrice(p) : p.monthly,
      recurring: annual ? 'year' : 'month',
    };
  }
  if (kind === 'package') {
    const p = packages.find((x) => x.id === id);
    if (!p) return null;
    const deposit = p.deposit;
    return {
      key: `package:${p.id}`,
      name: deposit ? `${p.name}: project deposit` : p.name,
      description: deposit ? `30% deposit to book your project. Total ${cad(p.price)}; the balance is invoiced at milestones.` : p.blurb,
      amount: deposit ?? p.price,
    };
  }
  if (kind === 'hours') {
    const b = hourBlocks.find((x) => x.id === id);
    if (!b) return null;
    return { key: `hours:${b.id}`, name: `${b.hours} prepaid hours`, description: `Use for any service. ${b.validity}.`, amount: b.price };
  }
  return null;
}

/** "plan:growth:annual" -> item, for the contact form's "You selected" line. */
export function itemFromKey(key: string): CatalogItem | null {
  const [kind, id, billing] = key.split(':');
  return kind && id ? resolveItem(kind, id, billing) : null;
}
