export type Block =
  | { type: 'p'; text: string }
  | { type: 'h2'; text: string }
  | { type: 'ul'; items: string[] }
  | { type: 'ol'; items: string[] }
  | { type: 'tip'; text: string };

export type Post = {
  slug: string;
  title: string;
  metaTitle?: string;
  description: string;
  date: string; // ISO date
  readMinutes: number;
  image: string;
  category: string;
  service: string;
  body: Block[];
};

export const posts: Post[] = [
  {
    slug: 'spf-dkim-dmarc-guide-canadian-businesses',
    title: 'SPF, DKIM and DMARC: a plain-English guide for Canadian businesses',
    metaTitle: 'SPF, DKIM & DMARC Guide for Canadian Businesses',
    description:
      'Why your invoices land in spam, what SPF, DKIM and DMARC actually do, and the step-by-step order to set them up without breaking your email.',
    date: '2026-11-10',
    readMinutes: 7,
    image: '/images/laptop-woman.webp',
    category: 'Email & Cloud',
    service: 'business-email-smtp',
    body: [
      { type: 'p', text: 'Since 2024, Google, Yahoo and Microsoft have required organisations that send email to prove who they are. If your domain is not authenticated, your invoices, quotes and password-reset emails are increasingly filtered to spam or rejected outright. The fix is three DNS records: SPF, DKIM and DMARC. Here is what each one does and the safe order to set them up.' },
      { type: 'h2', text: 'SPF: who is allowed to send for your domain' },
      { type: 'p', text: 'SPF (Sender Policy Framework) is a TXT record listing the services allowed to send email using your domain: for example Microsoft 365, your website’s SMTP provider and your newsletter tool. A receiving server checks the sending IP address against that list.' },
      { type: 'ul', items: ['You can only have one SPF record per domain. Merge services into a single record.', 'SPF allows a maximum of 10 DNS lookups. Too many "include:" entries cause it to fail.', 'End with ~all (soft fail) while testing, then -all once every sender is listed.'] },
      { type: 'h2', text: 'DKIM: a signature that proves the message wasn’t changed' },
      { type: 'p', text: 'DKIM (DomainKeys Identified Mail) adds a cryptographic signature to each message. The receiving server looks up your public key in DNS and checks the signature. Each sending service (Microsoft 365, Google Workspace, Amazon SES, Postmark…) gives you its own DKIM record to publish.' },
      { type: 'h2', text: 'DMARC: the policy that ties it together' },
      { type: 'p', text: 'DMARC tells receivers what to do when a message fails SPF and DKIM alignment, and where to send reports. Alignment means the domain in the visible From address matches the domain authenticated by SPF or DKIM. This is what stops criminals sending fake invoices that appear to come from your company.' },
      { type: 'ol', items: ['Publish DMARC with p=none and a reporting address. Collect reports for 2–4 weeks.', 'Use the reports to find every legitimate service sending as your domain, and fix their SPF/DKIM.', 'Move to p=quarantine with a small percentage (pct=25), then 100%.', 'When reports are clean, move to p=reject. Spoofed mail is now blocked.'] },
      { type: 'tip', text: 'Never jump straight to p=reject. If you have forgotten a legitimate sender, such as your accounting software sending invoices, its mail will start bouncing.' },
      { type: 'h2', text: 'Transactional email from websites and apps' },
      { type: 'p', text: 'Websites and apps should not send email through the web server’s own mail function. Use an authenticated SMTP or API service such as Amazon SES (available in the Canada Central region), Postmark or SendGrid, with its own DKIM signature on your domain. You get delivery logs, bounce handling and far better inbox placement.' },
      { type: 'h2', text: 'What about CASL?' },
      { type: 'p', text: 'Authentication is about technical trust. Canada’s Anti-Spam Legislation (CASL) is about consent for commercial messages: you need express or implied consent, clear identification and a working unsubscribe. Keep marketing email on a separate tool and subdomain from transactional email, so a marketing complaint never affects your invoices.' },
      { type: 'h2', text: 'Need it done for you?' },
      { type: 'p', text: 'Our Business Email & SMTP Set-up configures SPF, DKIM and DMARC, connects your website or app to authenticated SMTP and migrates mailboxes, usually within a week.' },
    ],
  },
  {
    slug: 'managed-it-support-cost-canada',
    title: 'How much does managed IT support cost in Canada? (2026 guide)',
    metaTitle: 'Managed IT Support Cost in Canada (2026 Guide)',
    description:
      'Per-user, per-device and hours-based pricing explained, what should be included, and how to compare quotes from managed service providers in Canada.',
    date: '2026-11-03',
    readMinutes: 6,
    image: '/images/guy.webp',
    category: 'IT Support',
    service: 'managed-it-support',
    body: [
      { type: 'p', text: 'Managed IT pricing in Canada varies widely because providers bundle very different things under the same name. Before comparing numbers, compare what is included, how fast they respond and what costs extra.' },
      { type: 'h2', text: 'The three common pricing models' },
      { type: 'ul', items: ['Per user per month: simple and predictable; best when most of the work is supporting people and their accounts.', 'Per device per month: common where servers, network equipment and shared workstations dominate.', 'Block of hours per month: flexible when you need a mix of support, website and development work, which is how our subscription plans work.'] },
      { type: 'h2', text: 'What a good plan should include' },
      { type: 'ul', items: ['A clear response time for normal and critical issues', 'Patch management for operating systems and key applications', 'Backups with regular restore tests, not just backups', 'Security basics: MFA, device encryption, email filtering and admin alerts', 'Onboarding and offboarding of staff', 'A monthly report showing tickets, response times and risks'] },
      { type: 'h2', text: 'Hidden costs to ask about' },
      { type: 'ol', items: ['After-hours and weekend rates', 'Project work (such as office moves or migrations), usually quoted separately', 'Software licences: are they included or passed through?', 'Minimum contract length and exit terms', 'Who owns the admin accounts and documentation if you leave'] },
      { type: 'tip', text: 'Ask every provider for a sample monthly report. It tells you more about how they work than any sales call.' },
      { type: 'h2', text: 'Subscription versus on-demand' },
      { type: 'p', text: 'If you have fewer than five staff and few systems, prepaid hours used as needed can be the most economical choice. Once you have regular requests, a subscription is usually cheaper per hour and, more importantly, includes the proactive work (patching, monitoring, backups) that prevents the expensive emergencies.' },
    ],
  },
  {
    slug: 'odoo-implementation-canada-checklist',
    title: 'Odoo implementation in Canada: a 10-step checklist',
    description:
      'How to plan an Odoo ERP roll-out for a Canadian business: localisation, sales taxes, data migration, integrations, training and go-live.',
    date: '2026-10-27',
    readMinutes: 8,
    image: '/images/warehouse.webp',
    category: 'ERP',
    service: 'odoo',
    body: [
      { type: 'p', text: 'Odoo can replace a tangle of spreadsheets and disconnected apps with one system for sales, inventory, purchasing, manufacturing and accounting. Most failed implementations fail for the same reasons: unclear processes, dirty data and too much customisation too early. This checklist keeps your project on track.' },
      { type: 'h2', text: 'The checklist' },
      { type: 'ol', items: [
        'Map your current processes: quote to cash, procure to pay, and stock movements. Agree the future process before configuring anything.',
        'Choose Community or Enterprise, and your hosting: Odoo Online, Odoo.sh or your own cloud in a Canadian region.',
        'Install the Canadian accounting localisation and set up the chart of accounts with your accountant.',
        'Configure taxes by province: GST, HST, QST and PST, including fiscal positions for out-of-province and export customers.',
        'Decide your units of measure, product categories, routes and warehouses before importing products.',
        'Clean your data: duplicate customers, inconsistent SKUs and obsolete products. Import into a test database first.',
        'Integrate only what you need for go-live (often ecommerce and shipping), and phase the rest.',
        'Limit customisation in phase one. Use standard features and Studio where possible; build custom modules for genuine gaps.',
        'Train each role on its own workflow, with written procedures, and run a full test week in parallel.',
        'Go live at the start of a month or quarter, with opening balances reconciled and support on hand for the first weeks.',
      ] },
      { type: 'tip', text: 'Budget for change management. The software is rarely the hard part; getting everyone to stop using the old spreadsheet is.' },
      { type: 'h2', text: 'How long does it take?' },
      { type: 'p', text: 'A focused implementation for one company with sales, inventory, purchasing and accounting typically takes 8 to 12 weeks. Manufacturing, multiple warehouses or multiple companies add time, and are best phased.' },
    ],
  },
  {
    slug: 'canadian-data-residency-cloud',
    title: 'Keeping data in Canada: a practical guide to cloud data residency',
    metaTitle: 'Canadian Cloud Data Residency: A Practical Guide',
    description:
      'Which cloud regions are in Canada, what PIPEDA, Quebec’s Law 25 and provincial laws actually require, and how to document where your data lives.',
    date: '2026-10-20',
    readMinutes: 7,
    image: '/images/server2.webp',
    category: 'DevOps & Cloud',
    service: 'devops-cloud',
    body: [
      { type: 'p', text: 'Customers, partners and public-sector buyers increasingly ask Canadian companies a simple question: where is our data stored? Answering it well requires knowing which services you use, where they store data and what the law actually requires.' },
      { type: 'h2', text: 'Does Canadian law require data to stay in Canada?' },
      { type: 'p', text: 'For most private-sector businesses, federal law (PIPEDA) does not prohibit storing personal information outside Canada, but you remain accountable for it and should be transparent about cross-border transfers. Quebec’s Law 25 requires a privacy impact assessment before personal information is communicated outside Quebec. Some public-sector bodies, health organisations and contracts do require Canadian storage. This is a technical guide, not legal advice; confirm your obligations with counsel.' },
      { type: 'h2', text: 'Canadian cloud regions' },
      { type: 'ul', items: ['AWS: Canada (Central) in Montréal and Canada West (Calgary)', 'Microsoft Azure: Canada Central (Toronto) and Canada East (Québec City)', 'Google Cloud: Montréal and Toronto', 'Microsoft 365: Canadian tenants can store core customer data in Canadian datacentres'] },
      { type: 'h2', text: 'Five steps to real data residency' },
      { type: 'ol', items: ['Inventory every system that stores customer or employee data, including SaaS tools.', 'Record where each one stores data and whether a Canadian region is available.', 'Deploy your own workloads in Canadian regions and restrict others with cloud policies.', 'Check backups, logs and analytics too: they often leave the country quietly.', 'Document it in a data map you can share with customers and auditors.'] },
      { type: 'tip', text: 'Infrastructure as code (Terraform or OpenTofu) makes residency verifiable: the region is written in code and reviewed with every change.' },
    ],
  },
];

export const postBySlug = (slug: string) => posts.find((p) => p.slug === slug);
