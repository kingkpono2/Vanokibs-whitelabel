/**
 * Platforms shown with their logos. Logo files live in public/logos.
 * Brand icons: Simple Icons (CC0). Magento, Azure and Microsoft 365 logos: Wikimedia Commons
 * (public domain); AWS logo: Wikimedia Commons (Apache 2.0). Logos are trademarks of their owners
 * and are shown only to indicate the platforms we work with.
 */
export type Platform = { name: string; logo: string };
export type PlatformGroup = { title: string; items: Platform[] };

export const platformGroups: PlatformGroup[] = [
  {
    title: 'Ecommerce',
    items: [
      { name: 'Shopify', logo: 'shopify' },
      { name: 'WooCommerce', logo: 'woocommerce' },
      { name: 'Magento / Adobe Commerce', logo: 'magento' },
      { name: 'BigCommerce', logo: 'bigcommerce' },
      { name: 'PrestaShop', logo: 'prestashop' },
    ],
  },
  {
    title: 'ERP & accounting',
    items: [
      { name: 'Odoo', logo: 'odoo' },
      { name: 'SAP', logo: 'sap' },
      { name: 'QuickBooks', logo: 'quickbooks' },
      { name: 'Xero', logo: 'xero' },
      { name: 'Sage', logo: 'sage' },
      { name: 'Zoho', logo: 'zoho' },
    ],
  },
  {
    title: 'Cloud & DevOps',
    items: [
      { name: 'AWS', logo: 'aws' },
      { name: 'Microsoft Azure', logo: 'azure' },
      { name: 'Google Cloud', logo: 'googlecloud' },
      { name: 'DigitalOcean', logo: 'digitalocean' },
      { name: 'Cloudflare', logo: 'cloudflare' },
      { name: 'Kubernetes', logo: 'kubernetes' },
      { name: 'Docker', logo: 'docker' },
      { name: 'Terraform', logo: 'terraform' },
    ],
  },
  {
    title: 'Websites, email & payments',
    items: [
      { name: 'WordPress', logo: 'wordpress' },
      { name: 'Drupal', logo: 'drupal' },
      { name: 'HubSpot', logo: 'hubspot' },
      { name: 'Microsoft 365', logo: 'microsoft365' },
      { name: 'Mailgun', logo: 'mailgun' },
      { name: 'Stripe', logo: 'stripe' },
      { name: 'PayPal', logo: 'paypal' },
      { name: 'Square', logo: 'square' },
    ],
  },
];

/** Logo for a technology name used in service "stack" lists, if we have one. */
const aliases: [RegExp, string][] = [
  [/magento|adobe commerce|hyv/i, 'magento'],
  [/^aws$/i, 'aws'],
  [/azure|entra|intune/i, 'azure'],
  [/microsoft 365|office 365/i, 'microsoft365'],
  [/google cloud|gcp/i, 'googlecloud'],
  [/odoo/i, 'odoo'],
  [/quickbooks/i, 'quickbooks'],
  [/cloudflare/i, 'cloudflare'],
];
const direct = new Map(platformGroups.flatMap((g) => g.items).map((p) => [p.name.toLowerCase(), p.logo]));

export function logoFor(name: string): string | undefined {
  const d = direct.get(name.toLowerCase());
  if (d) return d;
  return aliases.find(([re]) => re.test(name))?.[1];
}
