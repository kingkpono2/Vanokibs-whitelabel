/**
 * Pricing, in Canadian dollars. Prices are checked again on the server when a checkout
 * starts, so this file is the single source of truth: edit it to change any price.
 * All prices are before GST/HST/QST.
 */

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

export const ANNUAL_MONTHS_CHARGED = 10; // annual billing: 12 months for the price of 10

export const plans: Plan[] = [
  {
    id: 'essentials',
    name: 'Essentials',
    monthly: 1490,
    hours: 10,
    response: '8 business hours',
    blurb: 'Keep your systems healthy, safe and supported.',
    features: [
      '10 hours of support or development each month',
      'Help desk by email and chat, Mon–Fri 8am–8pm ET',
      'Updates, backups and uptime monitoring for 1 website or app',
      'Microsoft 365 / Google Workspace admin, up to 25 users',
      'Email deliverability (SPF, DKIM, DMARC) kept healthy',
      'Monthly report of work done and risks found',
    ],
  },
  {
    id: 'growth',
    name: 'Growth',
    monthly: 3900,
    hours: 30,
    response: '4 business hours',
    blurb: 'A dedicated team that ships improvements every month.',
    popular: true,
    features: [
      '30 hours of development, DevOps or support each month',
      'Help desk by email, chat and phone',
      'Dedicated project lead and a shared roadmap',
      'CI/CD, staging environment and security patching',
      'Up to 3 websites, stores or apps (WordPress, Magento, Odoo, custom)',
      'Microsoft 365 / Google Workspace admin, up to 100 users',
      'Quarterly strategy and cost review',
    ],
  },
  {
    id: 'scale',
    name: 'Scale',
    monthly: 8900,
    hours: 80,
    response: '1 hour for critical issues, 24/7',
    blurb: 'Your outsourced engineering and operations department.',
    features: [
      '80 hours across developers, DevOps and support each month',
      '24/7 monitoring and on-call for critical incidents',
      'Solutions architect and senior engineers assigned to you',
      'Infrastructure as code, observability and disaster-recovery drills',
      'Unlimited websites, stores and apps under management',
      'Security reviews and audit evidence (SOC 2, PIPEDA)',
      'Monthly executive report and roadmap session',
    ],
  },
];

export const packages: Package[] = [
  {
    id: 'email-smtp-setup',
    name: 'Business Email & SMTP Set-up',
    price: 890,
    blurb: 'Professional email that reaches the inbox.',
    includes: ['Microsoft 365 or Google Workspace for up to 25 mailboxes', 'SPF, DKIM and DMARC configured and verified', 'Transactional SMTP for your website or app', 'Mailbox migration and a handover guide'],
    service: 'business-email-smtp',
    timeline: '3–5 business days',
  },
  {
    id: 'website-audit',
    name: 'Website Speed & Security Audit',
    price: 1200,
    blurb: 'Find out exactly what is slowing or exposing your site.',
    includes: ['Core Web Vitals and speed analysis', 'Security, plugin and hosting review', 'SEO technical check', 'Prioritised fix list with estimates'],
    service: 'wordpress',
    timeline: '5 business days',
  },
  {
    id: 'devops-audit',
    name: 'DevOps & Cloud Audit',
    price: 2900,
    blurb: 'A clear plan to deploy safely and spend less on cloud.',
    includes: ['Architecture, CI/CD and security review', 'Cloud cost analysis with savings ranked by effort', 'Backup and disaster-recovery check', 'Written report and walkthrough call'],
    service: 'devops-cloud',
    timeline: '2 weeks',
  },
  {
    id: 'wordpress-launch',
    name: 'WordPress Website Launch',
    price: 4900,
    deposit: 1470,
    blurb: 'A fast, accessible business website your team can edit.',
    includes: ['Up to 8 custom-designed pages', 'Mobile-first, WCAG 2.1 AA accessible', 'SEO foundations and Google Analytics 4', 'Editor training and 30 days of support'],
    service: 'wordpress',
    timeline: '4–6 weeks',
  },
  {
    id: 'store-launch',
    name: 'Ecommerce Store Launch',
    price: 9500,
    deposit: 2850,
    blurb: 'A Shopify or WooCommerce store ready to sell across Canada.',
    includes: ['Custom storefront on Shopify or WooCommerce', 'Canadian taxes, shipping and payments', 'Up to 100 products imported', 'Analytics, email capture and launch support'],
    service: 'ecommerce-development',
    timeline: '6–8 weeks',
  },
  {
    id: 'odoo-starter',
    name: 'Odoo ERP Starter',
    price: 14900,
    deposit: 4470,
    blurb: 'Sales, inventory, purchasing and accounting in one system.',
    includes: ['Process mapping workshop', 'Odoo set-up with Canadian localisation', 'Data migration (products, contacts, opening stock)', 'Staff training and 60 days of support'],
    service: 'odoo',
    timeline: '8–12 weeks',
  },
];

export const hourBlocks: HourBlock[] = [
  { id: 'hours-5', hours: 5, price: 690, validity: 'Valid 6 months' },
  { id: 'hours-10', hours: 10, price: 1290, validity: 'Valid 6 months' },
  { id: 'hours-25', hours: 25, price: 2990, validity: 'Valid 12 months' },
];

export const PAYG_RATE = 145; // CAD per hour, billed monthly in 15-minute increments
export const EMERGENCY_RATE = 195; // after-hours and emergency work

export const cad = (n: number) =>
  new Intl.NumberFormat('en-CA', { style: 'currency', currency: 'CAD', maximumFractionDigits: 0 }).format(n);

export const annualPrice = (p: Plan) => p.monthly * ANNUAL_MONTHS_CHARGED;
