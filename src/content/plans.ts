/**
 * Pricing, in Canadian dollars, before GST/HST/QST.
 * Values live in editable.json (edited through /admin). Checkout reads them on the
 * server, so the browser can never change what is charged.
 */
import content from './editable.json';

export type Plan = {
  id: string;
  name: string;
  monthly: number; // CAD per month
  hours: number; // included hours per month
  response: string;
  blurb: string;
  features: string[];
  popular?: boolean;
};

export type Package = {
  id: string;
  name: string;
  price: number; // full project price, CAD
  deposit?: number; // if set, checkout charges this deposit and the balance is invoiced
  blurb: string;
  includes: string[];
  service: string; // related service slug
  timeline: string;
};

export type HourBlock = { id: string; hours: number; price: number; validity: string };

const pricing = content.pricing;

export const ANNUAL_MONTHS_CHARGED = pricing.annualMonthsCharged; // annual billing: 12 months for the price of this many

export const plans: Plan[] = pricing.plans.map((p) => ({ ...p, popular: p.popular || undefined }));

export const packages: Package[] = pricing.packages.map((p) => ({ ...p, deposit: p.deposit > 0 ? p.deposit : undefined }));

export const hourBlocks: HourBlock[] = pricing.hourBlocks;

export const PAYG_RATE = pricing.payAsYouGoRate; // CAD per hour, billed monthly in 15-minute increments
export const EMERGENCY_RATE = pricing.emergencyRate; // after-hours and emergency work

export const cad = (n: number) =>
  new Intl.NumberFormat('en-CA', { style: 'currency', currency: 'CAD', maximumFractionDigits: 0 }).format(n);

export const annualPrice = (p: Plan) => p.monthly * ANNUAL_MONTHS_CHARGED;
