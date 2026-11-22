import type { IconName } from './services';

export type Industry = {
  slug: string;
  name: string;
  icon: IconName;
  image: string;
  metaTitle: string;
  metaDescription: string;
  headline: string;
  intro: string;
  challenges: { title: string; text: string }[];
  services: string[];
};

export const industries: Industry[] = [
  {
    slug: 'ecommerce-retail',
    name: 'Ecommerce & Retail',
    icon: 'cart',
    image: '/images/shopping.webp',
    metaTitle: 'Ecommerce & Retail Technology Partner, Canada',
    metaDescription:
      'Ecommerce technology for Canadian retailers: Shopify, WooCommerce and Magento stores, ERP and inventory sync, Canadian taxes and shipping, and support plans that keep stores fast during peak season.',
    headline: 'Sell more online without your systems holding you back',
    intro:
      'Canadian retailers juggle provincial taxes, bilingual customers, cross-border shipping and peak seasons like Black Friday and Boxing Day. We build and run the store, the integrations and the infrastructure behind it.',
    challenges: [
      { title: 'Stock that never matches', text: 'We sync inventory between your store, marketplaces, POS and warehouse in near real time.' },
      { title: 'Slow pages in peak season', text: 'Caching, CDN and load testing before Black Friday, not during it.' },
      { title: 'Tax and shipping complexity', text: 'GST/HST/QST/PST by province and live carrier rates configured and tested.' },
      { title: 'Manual order handling', text: 'Orders flow automatically to fulfilment, accounting and customer emails.' },
    ],
    services: ['ecommerce-development', 'magento', 'wordpress', 'erp-implementation', 'business-email-smtp'],
  },
  {
    slug: 'fintech-financial-services',
    name: 'Fintech & Financial Services',
    icon: 'bank',
    image: '/images/card.webp',
    metaTitle: 'Fintech & Financial Services Technology',
    metaDescription:
      'Secure software engineering, DevOps and cloud for Canadian fintechs, lenders, credit unions and payment companies: audit trails, encryption, Canadian data residency and SOC 2 evidence.',
    headline: 'Move fast in a regulated industry, safely',
    intro:
      'Banks, partners and auditors expect evidence: who changed what, when, and why. We build fintech products and platforms with those controls in place from the first commit.',
    challenges: [
      { title: 'Audits and due diligence', text: 'Access control, logging and change management that produce audit evidence automatically.' },
      { title: 'Data residency', text: 'Systems hosted in Canadian cloud regions with documented data flows.' },
      { title: 'Payments and reconciliation', text: 'Ledgers and reconciliation that finance teams can trust.' },
      { title: 'Uptime expectations', text: '24/7 monitoring, on-call and tested disaster recovery.' },
    ],
    services: ['fintech-development', 'devops-cloud', 'custom-software-development', 'mobile-app-development'],
  },
  {
    slug: 'manufacturing-distribution',
    name: 'Manufacturing & Distribution',
    icon: 'factory',
    image: '/images/warehouse.webp',
    metaTitle: 'ERP & Software for Manufacturers in Canada',
    metaDescription:
      'ERP implementation (Odoo), inventory and warehouse systems, EDI and B2B ordering portals for Canadian manufacturers, wholesalers and distributors.',
    headline: 'From the purchase order to the shipped pallet, in one system',
    intro:
      'Manufacturers and distributors run on accurate stock, reliable purchasing and on-time delivery. We implement ERP, connect it to your customers and suppliers, and give your team tools that work on the warehouse floor.',
    challenges: [
      { title: 'Spreadsheet planning', text: 'Odoo MRP and inventory replace spreadsheets with real-time planning.' },
      { title: 'B2B ordering by email', text: 'Customer portals and EDI take orders straight into your ERP.' },
      { title: 'Costing you can’t trust', text: 'Landed costs, BOMs and work orders that roll up to real margins.' },
      { title: 'Disconnected systems', text: 'Accounting, shipping and ecommerce integrated with the ERP.' },
    ],
    services: ['erp-implementation', 'odoo', 'custom-software-development', 'managed-it-support'],
  },
  {
    slug: 'professional-services',
    name: 'Professional Services',
    icon: 'briefcase',
    image: '/images/team.webp',
    metaTitle: 'IT & Software for Professional Services Firms',
    metaDescription:
      'Managed IT, secure email, client portals and workflow automation for Canadian accounting, legal, consulting and engineering firms.',
    headline: 'Secure, reliable technology for firms that bill by the hour',
    intro:
      'Accounting, legal, consulting and engineering firms handle confidential client data every day. We keep your team productive and your data protected, and automate the admin that eats into billable time.',
    challenges: [
      { title: 'Confidential client data', text: 'MFA, encrypted devices, secure file sharing and access reviews.' },
      { title: 'Phishing and payment fraud', text: 'Email security, DMARC and staff awareness against invoice fraud.' },
      { title: 'Manual intake and billing', text: 'Client portals, e-signature and integrations with your practice software.' },
      { title: 'No in-house IT', text: 'A help desk and IT lead on subscription, for less than one hire.' },
    ],
    services: ['managed-it-support', 'business-email-smtp', 'custom-software-development', 'wordpress'],
  },
];

export const industryBySlug = (slug: string) => industries.find((i) => i.slug === slug);
