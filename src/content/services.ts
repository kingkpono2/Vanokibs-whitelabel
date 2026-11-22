export type Faq = { q: string; a: string };

export type Service = {
  slug: string;
  name: string;
  short: string;
  icon: IconName;
  image: string;
  metaTitle: string;
  metaDescription: string;
  headline: string;
  intro: string;
  outcomes: string[];
  deliverables: { title: string; text: string }[];
  stack: string[];
  bestFor: string;
  startingAt: string;
  faqs: Faq[];
  related: string[];
};

export type IconName =
  | 'support' | 'code' | 'cloud' | 'cart' | 'bank' | 'erp' | 'odoo' | 'magento' | 'wordpress'
  | 'mobile' | 'mail' | 'shield' | 'chart' | 'bolt' | 'clock' | 'check' | 'maple' | 'users'
  | 'rocket' | 'arrow' | 'globe' | 'lock' | 'server' | 'calendar' | 'spark' | 'chat' | 'factory' | 'briefcase';

import content from './editable.json';

const baseServices: Service[] = [
  {
    slug: 'managed-it-support',
    name: 'Managed IT & Tech Support',
    short: 'Help desk, device and account management, monitoring and security for your team.',
    icon: 'support',
    image: '/images/guy.webp',
    metaTitle: 'Managed IT Support Canada | Help Desk & Security',
    metaDescription:
      'Outsourced IT support across Canada: help desk, Microsoft 365 and Google Workspace administration, device management, backups and security monitoring. Monthly plans in CAD.',
    headline: 'Managed IT support for small and mid-sized businesses',
    intro:
      'Your team should not lose an afternoon to a locked account, a failing laptop or a printer that vanished from the network. We run your help desk, manage users and devices, watch your systems and keep everything patched, so problems are solved quickly and stop coming back.',
    outcomes: [
      'Help desk by email, chat and phone during Canadian business hours, with after-hours cover on higher plans',
      'Onboarding and offboarding done the same day, with access removed when people leave',
      'Laptops and phones enrolled, encrypted and patched automatically',
      'Daily backups you have actually tested restoring',
      'A monthly report: tickets, response times, risks found and what we fixed',
    ],
    deliverables: [
      { title: 'Help desk', text: 'One place to ask for help. Every request is logged, prioritised and answered within your plan’s response time.' },
      { title: 'Microsoft 365 & Google Workspace', text: 'Licences, users, groups, shared mailboxes, MFA and conditional access set up properly and kept tidy.' },
      { title: 'Device management', text: 'Intune or Google endpoint management: encryption, updates, remote wipe and an up-to-date asset list.' },
      { title: 'Security baseline', text: 'MFA everywhere, password manager rollout, phishing-resistant sign-in for admins and alerting on risky logins.' },
      { title: 'Backup & recovery', text: 'Cloud backups for mailboxes, files and servers, with quarterly restore tests and a written recovery plan.' },
      { title: 'Vendor management', text: 'We deal with your ISP, phone provider and software vendors so your team does not have to.' },
    ],
    stack: ['Microsoft 365', 'Google Workspace', 'Intune', 'Entra ID', 'Bitwarden', 'Backblaze', 'Datto', 'Zendesk'],
    bestFor: 'Teams of 5 to 250 people without a full-time IT department, or with one person who needs back-up.',
    startingAt: 'Included in every subscription plan, or prepaid hours from $120/hour',
    faqs: [
      { q: 'Do you support teams outside Ontario?', a: 'Yes. Support is remote-first and covers every province and territory. On-site visits can be arranged in major cities through vetted local partners.' },
      { q: 'How fast do you respond?', a: 'Response time depends on your plan: 8 business hours on Essentials, 4 on Growth and 1 hour for critical issues on Scale, 24/7.' },
      { q: 'Can you work alongside our existing IT person?', a: 'Often the best set-up. We take the routine tickets and the out-of-hours cover so your IT lead can focus on projects.' },
      { q: 'Is our data kept in Canada?', a: 'Where the service allows it, we configure Canadian data residency (for example Microsoft 365 and AWS or Azure Canadian regions) and document where each system stores data.' },
    ],
    related: ['business-email-smtp', 'devops-cloud', 'wordpress'],
  },
  {
    slug: 'custom-software-development',
    name: 'Custom Software Development',
    short: 'Web apps, portals, integrations and internal tools built around how you work.',
    icon: 'code',
    image: '/images/programmer.webp',
    metaTitle: 'Custom Software Development Canada',
    metaDescription:
      'Canadian custom software development: customer portals, internal tools, APIs and system integrations built with modern, maintainable code. Fixed-price projects or a monthly dev team.',
    headline: 'Custom web applications, portals and integrations',
    intro:
      'Spreadsheets and copy-paste between systems work until they don’t. We design and build the web apps, portals and integrations that remove that manual work: clean code, automated tests and documentation your next developer will thank you for.',
    outcomes: [
      'A clickable prototype within the first two weeks, so you see it before you pay for all of it',
      'Working software every two weeks, deployed to a test environment you can use',
      'Automated tests and CI/CD from day one',
      'Source code, documentation and accounts that belong to you',
    ],
    deliverables: [
      { title: 'Discovery & design', text: 'Workshops, user flows and a UX prototype, ending with a written scope and a fixed or capped price.' },
      { title: 'Web applications', text: 'Customer portals, booking and quoting tools, dashboards and admin panels in React/Next.js, Node.js, Python or .NET.' },
      { title: 'APIs & integrations', text: 'Connect your CRM, accounting, ecommerce and ERP: QuickBooks, Xero, Salesforce, HubSpot, Shopify, Odoo and more.' },
      { title: 'Automation', text: 'Replace manual steps with scheduled jobs, webhooks and workflow automation, with alerts when something fails.' },
      { title: 'Modernisation', text: 'Move legacy PHP, Access or desktop apps to the web, gradually and without stopping the business.' },
      { title: 'Ongoing support', text: 'Bug fixes, security updates and new features through a monthly plan or prepaid hours.' },
    ],
    stack: ['TypeScript', 'React', 'Next.js', 'Node.js', 'Python', 'Django', '.NET', 'PostgreSQL', 'Redis'],
    bestFor: 'Companies whose growth is limited by manual processes or by off-the-shelf software that no longer fits.',
    startingAt: 'Discovery from $2,900; builds by fixed quote or a Growth/Scale plan',
    faqs: [
      { q: 'Who owns the code?', a: 'You do. Code lives in your GitHub or GitLab organisation and every account is created in your company’s name.' },
      { q: 'Fixed price or time and materials?', a: 'Both. Well-defined projects get a fixed price after discovery. Evolving products usually run on a monthly plan with a set number of hours.' },
      { q: 'Can you take over an existing app?', a: 'Yes. We start with a paid code and infrastructure audit, then give you a plan to stabilise it before adding features.' },
    ],
    related: ['devops-cloud', 'mobile-app-development', 'fintech-development'],
  },
  {
    slug: 'qa-software-testing',
    name: 'QA & Software Testing',
    short: 'Manual and automated testing for web, mobile and APIs, built into your release process.',
    icon: 'check',
    image: '/images/code.webp',
    metaTitle: 'QA & Software Testing Services Canada | Test Automation',
    metaDescription:
      'Software testing for Canadian businesses: manual QA, test automation with Playwright and Cypress, mobile app testing, API, performance and accessibility (WCAG/AODA) testing, integrated with CI/CD.',
    headline: 'QA and software testing for web, mobile and APIs',
    intro:
      'Bugs found by customers cost far more than bugs found in testing. We test your website, app or API before every release, automate the tests that matter most and run them on every change, so you can ship with confidence.',
    outcomes: [
      'Clear test plans and a regression checklist for every release',
      'Automated tests running in your CI/CD pipeline on every change',
      'Bugs reported with steps, screenshots and severity, ready to fix',
      'Accessibility and performance checked before launch',
    ],
    deliverables: [
      { title: 'Manual testing', text: 'Exploratory and scripted testing across browsers and devices, including user acceptance testing support.' },
      { title: 'Test automation', text: 'End-to-end tests with Playwright, Cypress or Selenium, written to be stable and easy to maintain.' },
      { title: 'Mobile app testing', text: 'iOS and Android testing on real devices and emulators, with Appium or Detox automation.' },
      { title: 'API testing', text: 'Contract and functional tests for REST and GraphQL APIs with Postman or code-based suites.' },
      { title: 'Performance & load', text: 'Load and stress tests with k6 or JMeter to find limits before your customers do.' },
      { title: 'Accessibility testing', text: 'WCAG 2.1 AA checks with automated tools and manual screen-reader testing, supporting AODA.' },
    ],
    stack: ['Playwright', 'Cypress', 'Selenium', 'Appium', 'Postman', 'k6', 'JMeter', 'axe', 'BrowserStack', 'GitHub Actions'],
    bestFor: 'Teams releasing websites, apps or APIs regularly, and anyone preparing for a major launch.',
    startingAt: 'QA audit and test plan from $1,900; ongoing testing through a monthly plan',
    faqs: [
      { q: 'Can you test software another company built?', a: 'Yes. We test what you have, report issues to your developers in a clear format, and can retest fixes.' },
      { q: 'Manual or automated testing?', a: 'Both. We automate stable, repeated checks (log-in, checkout, key forms) and keep manual testing for new features and usability.' },
      { q: 'Do the tests run automatically?', a: 'Yes. Automated tests run in your CI/CD pipeline, such as GitHub Actions, on every change, and failures block the release.' },
    ],
    related: ['custom-software-development', 'mobile-app-development', 'devops-cloud'],
  },
  {
    slug: 'devops-cloud',
    name: 'DevOps & Cloud Engineering',
    short: 'CI/CD, infrastructure as code, monitoring and cost control on AWS, Azure and GCP.',
    icon: 'cloud',
    image: '/images/server2.webp',
    metaTitle: 'DevOps & Cloud Services Canada (AWS, Azure, GCP)',
    metaDescription:
      'DevOps consulting for Canadian companies: CI/CD pipelines, infrastructure as code, Kubernetes, monitoring, backups and cloud cost optimisation on AWS ca-central-1, Azure Canada and GCP.',
    headline: 'DevOps and cloud engineering on AWS, Azure and Google Cloud',
    intro:
      'Manual deployments, surprise outages and a cloud bill nobody can explain are signs the platform has outgrown how it is run. We automate builds and releases, put everything in code, add proper monitoring and cut waste, with Canadian regions wherever your data needs to stay in the country.',
    outcomes: [
      'One-click (or automatic) deployments with instant rollback',
      'Infrastructure defined in code and reviewed like application code',
      'Dashboards and alerts that tell you about problems before customers do',
      'A cloud cost review with savings ranked by effort and impact',
    ],
    deliverables: [
      { title: 'CI/CD pipelines', text: 'GitHub Actions, GitLab CI or Azure DevOps with tests, security scans, preview environments and safe releases.' },
      { title: 'Infrastructure as code', text: 'Terraform or OpenTofu for AWS, Azure and GCP: reproducible environments and no more clicking in consoles.' },
      { title: 'Containers & Kubernetes', text: 'Docker, ECS, AKS, GKE or a simpler managed platform when Kubernetes is more than you need.' },
      { title: 'Observability', text: 'Logs, metrics, uptime checks and on-call alerts with Grafana, Datadog, CloudWatch or Azure Monitor.' },
      { title: 'Security & compliance', text: 'Least-privilege IAM, secrets management, encrypted backups and evidence for SOC 2 or customer audits.' },
      { title: 'Cost optimisation', text: 'Right-sizing, reserved capacity, storage tiers and tagging, so every dollar has an owner.' },
    ],
    stack: ['AWS', 'Azure', 'Google Cloud', 'Terraform', 'Kubernetes', 'Docker', 'GitHub Actions', 'Grafana', 'Cloudflare'],
    bestFor: 'Product teams shipping weekly or more, and businesses with production systems that cannot go down.',
    startingAt: 'DevOps & cloud audit $2,900; ongoing work from the Growth plan',
    faqs: [
      { q: 'Can you keep our data in Canada?', a: 'Yes. We build in AWS ca-central-1 / ca-west-1, Azure Canada Central / East or GCP Montréal and Toronto, and document data flows for PIPEDA and provincial requirements.' },
      { q: 'Do you provide 24/7 on-call?', a: 'On the Scale plan, yes: monitored alerts and a 1-hour response for critical incidents at any time.' },
      { q: 'We are on shared hosting. Is DevOps overkill?', a: 'Not necessarily. Often the first step is moving to a managed platform with backups and automated deploys, which costs little and removes a lot of risk.' },
    ],
    related: ['custom-software-development', 'business-email-smtp', 'managed-it-support'],
  },
  {
    slug: 'aws-cloud-services',
    name: 'AWS Cloud Services',
    short: 'EC2 servers, SES email, S3, RDS, Lambda, CloudFront and more, set up and managed.',
    icon: 'cloud',
    image: '/images/server1.webp',
    metaTitle: 'AWS Consulting & Managed Services Canada | EC2, SES, S3',
    metaDescription:
      'AWS set-up and management for Canadian businesses: EC2 servers, Amazon SES email, S3 storage, RDS databases, Lambda, CloudFront, Route 53, VPC security, backups and cost control in ca-central-1.',
    headline: 'AWS set-up and management, from EC2 to SES',
    intro:
      'We design, set up and run your AWS account properly: secure networking, right-sized servers, managed databases, reliable email sending and backups, in Canadian regions where your data needs to stay in Canada.',
    outcomes: [
      'A secure AWS account structure with MFA, least-privilege IAM and audit logging',
      'Servers and databases sized for your workload, with automatic backups',
      'Email from your apps delivered through Amazon SES with full authentication',
      'Monitoring, alerts and a monthly cost review',
    ],
    deliverables: [
      { title: 'EC2 servers', text: 'Launch and harden Linux or Windows servers: patching, SSH/SSM access, security groups, Elastic IPs and auto-recovery.' },
      { title: 'Amazon SES', text: 'Domain verification, DKIM/SPF/DMARC, production access, SMTP credentials, and bounce and complaint handling.' },
      { title: 'S3 & CloudFront', text: 'Storage for files, backups and static sites, with encryption, lifecycle rules and a fast CDN.' },
      { title: 'RDS & Aurora', text: 'Managed MySQL and PostgreSQL with backups, encryption, read replicas and maintenance windows.' },
      { title: 'Lambda & API Gateway', text: 'Serverless functions and APIs for integrations, scheduled jobs and webhooks.' },
      { title: 'Route 53 & certificates', text: 'DNS, domain transfers, health checks and free TLS certificates through ACM.' },
      { title: 'VPC & security', text: 'Private networks, IAM roles, AWS Organizations, CloudTrail, GuardDuty and Security Hub.' },
      { title: 'Containers', text: 'ECS, Fargate and EKS for containerised applications, with ECR image registries.' },
      { title: 'Monitoring & backup', text: 'CloudWatch dashboards and alarms, AWS Backup plans and tested restores.' },
      { title: 'Migration & cost control', text: 'Move from shared hosting or other clouds; Savings Plans, right-sizing and budgets with alerts.' },
    ],
    stack: ['EC2', 'Amazon SES', 'S3', 'CloudFront', 'RDS', 'Lambda', 'Route 53', 'VPC', 'IAM', 'ECS', 'CloudWatch', 'AWS Backup'],
    bestFor: 'Businesses moving to AWS, or already on AWS without someone to look after it.',
    startingAt: 'EC2 server set-up $1,900; Amazon SES set-up $690; ongoing care from the Essentials plan',
    faqs: [
      { q: 'Can our AWS resources stay in Canada?', a: 'Yes. We build in Canada (Central) in Montréal or Canada West in Calgary, and can restrict other regions with account policies.' },
      { q: 'Do you need our root account?', a: 'No. We use named IAM users or SSO roles with MFA, and you keep the root account locked away.' },
      { q: 'How long does SES production access take?', a: 'AWS usually reviews the request within one business day. We prepare the request with your sending details so it is approved first time.' },
    ],
    related: ['devops-cloud', 'business-email-smtp', 'managed-it-support'],
  },
  {
    slug: 'ecommerce-development',
    name: 'Ecommerce Development',
    short: 'Shopify, WooCommerce and Magento stores that load fast and convert.',
    icon: 'cart',
    image: '/images/shopping.webp',
    metaTitle: 'Ecommerce Development Canada | Shopify, Magento',
    metaDescription:
      'Ecommerce development for Canadian retailers and brands: Shopify, WooCommerce and Adobe Commerce (Magento) builds, migrations, Canadian payments, shipping, GST/HST/QST and ERP integration.',
    headline: 'Ecommerce development for Canadian retailers',
    intro:
      'Selling online in Canada means getting provincial sales tax right, shipping with Canada Post, Purolator or UPS, accepting Interac and cards, and often selling in French as well as English. We build and improve stores that handle all of it, and connect them to the inventory and accounting systems behind them.',
    outcomes: [
      'Pages that load in under 2 seconds on mobile',
      'Correct GST, HST, QST and PST by province, ready for your accountant',
      'Live shipping rates and labels from Canadian carriers',
      'Orders, stock and customers synced with your ERP or accounting software',
    ],
    deliverables: [
      { title: 'Store builds', text: 'Shopify, WooCommerce or Adobe Commerce stores designed for conversion on mobile first.' },
      { title: 'Migrations', text: 'Move products, customers, orders and SEO rankings from your old platform with 301 redirects and no lost history.' },
      { title: 'Payments', text: 'Stripe, Moneris, Helcim, PayPal and Shopify Payments, with Interac where available.' },
      { title: 'Bilingual stores', text: 'English and French storefronts that meet Quebec’s Charter of the French Language requirements.' },
      { title: 'Integrations', text: 'ERP, POS, 3PL and marketplaces (Amazon.ca, Walmart.ca) kept in sync automatically.' },
      { title: 'Conversion & speed', text: 'Core Web Vitals, checkout optimisation, analytics and A/B tests that show what actually works.' },
    ],
    stack: ['Shopify', 'WooCommerce', 'Adobe Commerce', 'Stripe', 'Moneris', 'Canada Post', 'Klaviyo', 'GA4'],
    bestFor: 'Brands and retailers selling online in Canada, from first store to multi-channel operations.',
    startingAt: 'Store launch from $9,500; ongoing growth through a monthly plan',
    faqs: [
      { q: 'Shopify, WooCommerce or Magento?', a: 'Shopify suits most growing brands; WooCommerce fits content-heavy sites already on WordPress; Adobe Commerce (Magento) suits complex catalogues and B2B. We recommend based on your catalogue, team and budget, not our preference.' },
      { q: 'Will we lose Google rankings when we migrate?', a: 'Not if it is done properly. We map every old URL to a new one with 301 redirects, keep metadata and monitor Search Console after launch.' },
      { q: 'Can you handle sales tax for every province?', a: 'Yes. We configure tax by province and test it, and recommend reviewing the set-up with your accountant before launch.' },
    ],
    related: ['magento', 'wordpress', 'erp-implementation'],
  },
  {
    slug: 'fintech-development',
    name: 'Fintech Development',
    short: 'Payments, lending, wallets and banking integrations built securely.',
    icon: 'bank',
    image: '/images/card.webp',
    metaTitle: 'Fintech Software Development Canada',
    metaDescription:
      'Fintech development in Canada: payment flows, lending and onboarding platforms, wallets, ledgers and banking integrations, built with security, audit trails and FINTRAC/PIPEDA requirements in mind.',
    headline: 'Software development for fintech and financial services',
    intro:
      'In fintech, the product is only as good as the trust behind it. We build payment flows, onboarding and lending platforms, ledgers and dashboards with the controls regulators and partners expect: strong authentication, complete audit trails, encryption and clear separation of duties.',
    outcomes: [
      'Secure-by-design architecture reviewed against OWASP ASVS',
      'Double-entry ledgers that reconcile to the cent',
      'KYC/AML onboarding flows ready for your compliance team',
      'Evidence packs for bank partners, auditors and SOC 2',
    ],
    deliverables: [
      { title: 'Payments', text: 'Card, EFT, Interac e-Transfer and pre-authorized debit flows through Stripe, Moneris, Paysafe and bank partners.' },
      { title: 'Onboarding & KYC', text: 'Identity verification, risk scoring and case management integrated with providers such as Persona, Onfido or Trulioo.' },
      { title: 'Ledgers & reconciliation', text: 'Immutable transaction records, daily reconciliation and finance-ready reporting.' },
      { title: 'Lending & BNPL', text: 'Applications, decisioning rules, repayment schedules and collections workflows.' },
      { title: 'Open banking', text: 'Account aggregation and verification through Flinks, Plaid or Inverite, ready for Canada’s consumer-driven banking framework.' },
      { title: 'Security engineering', text: 'Threat modelling, penetration-test remediation, secrets management and fraud monitoring.' },
    ],
    stack: ['Node.js', 'Python', 'PostgreSQL', 'Stripe', 'Moneris', 'Flinks', 'Plaid', 'AWS KMS', 'Vault'],
    bestFor: 'Fintech start-ups, credit unions, lenders and businesses adding payments to their product.',
    startingAt: 'Discovery from $2,900; builds by fixed quote or a Scale plan',
    faqs: [
      { q: 'Do you handle compliance?', a: 'We build the technical controls and evidence (logging, access control, encryption, retention). Your compliance officer or counsel owns the regulatory programme; we work closely with them.' },
      { q: 'Can you integrate with Canadian banks?', a: 'Yes, through payment processors, open-banking aggregators and bank-specific file formats such as EFT/CPA-005, depending on the bank.' },
      { q: 'Is card data stored on your servers?', a: 'We design to keep you out of PCI scope wherever possible by using tokenised payments, so card numbers never touch your systems.' },
    ],
    related: ['custom-software-development', 'devops-cloud', 'mobile-app-development'],
  },
  {
    slug: 'erp-implementation',
    name: 'ERP Implementation & Integration',
    short: 'Inventory, accounting, purchasing and manufacturing in one system.',
    icon: 'erp',
    image: '/images/warehouse.webp',
    metaTitle: 'ERP Implementation & Integration Canada',
    metaDescription:
      'ERP consulting for Canadian SMBs: requirements, selection, Odoo implementation, data migration, integrations with ecommerce and accounting, and training. Fixed-price phases.',
    headline: 'ERP selection, implementation and integration',
    intro:
      'When inventory lives in one spreadsheet, orders in another and accounting in a third, nobody trusts the numbers. We help you choose the right ERP, implement it in phases, migrate your data and connect it to your store and your accountant, so everyone works from the same truth.',
    outcomes: [
      'Real-time stock across warehouses and sales channels',
      'Purchase orders, receiving and landed costs handled in one flow',
      'Month-end close in days instead of weeks',
      'Staff trained, with written procedures for every key process',
    ],
    deliverables: [
      { title: 'Process mapping', text: 'We document how orders, stock and money flow today and design the future process before touching software.' },
      { title: 'ERP selection', text: 'Honest comparison of Odoo, NetSuite, Dynamics 365 Business Central and others for your size and budget.' },
      { title: 'Implementation', text: 'Configuration, Canadian tax and chart of accounts, approvals, reports and phased go-live.' },
      { title: 'Data migration', text: 'Products, customers, suppliers, open orders and opening balances, cleaned and reconciled.' },
      { title: 'Integrations', text: 'Shopify, WooCommerce, Magento, 3PLs, EDI, payroll and banks connected to the ERP.' },
      { title: 'Training & support', text: 'Role-based training, user guides and a support plan after go-live.' },
    ],
    stack: ['Odoo', 'NetSuite', 'Dynamics 365 BC', 'QuickBooks Online', 'Xero', 'Shopify', 'EDI'],
    bestFor: 'Distributors, manufacturers, wholesalers and multi-channel retailers with 10 to 500 staff.',
    startingAt: 'ERP readiness assessment $3,500; Odoo starter implementation from $14,900',
    faqs: [
      { q: 'How long does an ERP project take?', a: 'A focused Odoo roll-out for a single company usually takes 8 to 16 weeks. Larger multi-site projects are phased over several months.' },
      { q: 'Can we keep QuickBooks or Xero?', a: 'Yes. Many clients run operations in the ERP and keep their accounting system, with an integration that posts transactions automatically.' },
    ],
    related: ['odoo', 'ecommerce-development', 'custom-software-development'],
  },
  {
    slug: 'odoo',
    name: 'Odoo Development & Implementation',
    short: 'Odoo set-up, custom modules, migrations and support.',
    icon: 'odoo',
    image: '/images/desk.webp',
    metaTitle: 'Odoo Implementation & Support Canada',
    metaDescription:
      'Odoo implementation and development in Canada: Community and Enterprise, Canadian accounting localisation, custom modules, version upgrades, integrations and ongoing support.',
    headline: 'Odoo implementation, development and support',
    intro:
      'Odoo can run sales, inventory, manufacturing, accounting, HR and your website from one platform at a fraction of the cost of traditional ERPs. We implement it properly: the Canadian localisation, the right apps for your processes and custom modules only where the standard ones don’t fit.',
    outcomes: [
      'Canadian chart of accounts and GST/HST/QST/PST set up and tested',
      'Only the apps you need, configured around your real processes',
      'Custom modules written to Odoo standards, so upgrades stay possible',
      'Clean upgrade path to new Odoo versions',
    ],
    deliverables: [
      { title: 'Implementation', text: 'Sales, CRM, inventory, purchasing, manufacturing (MRP), accounting, HR and helpdesk.' },
      { title: 'Custom modules', text: 'Python and OWL development for workflows, reports and screens Odoo doesn’t provide out of the box.' },
      { title: 'Upgrades & migrations', text: 'Move from older Odoo versions, other ERPs or spreadsheets with data validated at each step.' },
      { title: 'Integrations', text: 'Shopify, WooCommerce, Magento, Amazon, shipping carriers, banks and payroll.' },
      { title: 'Hosting', text: 'Odoo.sh, Odoo Online or your own cloud in a Canadian region, with backups and monitoring.' },
      { title: 'Support plans', text: 'User support, bug fixes and improvements through a monthly plan or prepaid hours.' },
    ],
    stack: ['Odoo 17', 'Odoo 18', 'Odoo 19', 'Python', 'PostgreSQL', 'OWL', 'Odoo.sh', 'Docker'],
    bestFor: 'SMBs replacing spreadsheets or several disconnected apps with one affordable platform.',
    startingAt: 'Odoo starter implementation from $14,900; support from the Essentials plan',
    faqs: [
      { q: 'Community or Enterprise?', a: 'Community is free and suits simpler operations. Enterprise adds accounting features, studio, mobile apps and support. We help you choose and can mix both with custom modules where sensible.' },
      { q: 'Can you fix an Odoo set-up someone else started?', a: 'Yes. We begin with a configuration and code review, then fix what is blocking you before adding anything new.' },
    ],
    related: ['erp-implementation', 'ecommerce-development', 'custom-software-development'],
  },
  {
    slug: 'magento',
    name: 'Magento (Adobe Commerce) Development',
    short: 'Magento builds, upgrades, performance and B2B commerce.',
    icon: 'magento',
    image: '/images/macbook.webp',
    metaTitle: 'Magento & Adobe Commerce Development Canada',
    metaDescription:
      'Magento 2 and Adobe Commerce development in Canada: version upgrades, security patches, performance tuning, extensions, B2B features and migrations from Magento 1 or to Shopify.',
    headline: 'Magento and Adobe Commerce development and support',
    intro:
      'Magento is powerful for large catalogues and B2B selling, but only when it is kept patched, upgraded and tuned. We take care of the platform (security patches, upgrades, extensions and performance) and build the custom features your buyers need.',
    outcomes: [
      'Security patches applied within days of release',
      'Upgrades to the latest supported Magento / Adobe Commerce version',
      'Faster pages through caching, image and database tuning',
      'An honest view on whether to stay on Magento or move',
    ],
    deliverables: [
      { title: 'Upgrades & patches', text: 'Version upgrades, PHP and dependency updates, and timely security patching.' },
      { title: 'Performance', text: 'Varnish, Redis, OpenSearch and CDN tuning; Core Web Vitals improvements.' },
      { title: 'B2B commerce', text: 'Company accounts, quotes, price lists, quick order and requisition lists.' },
      { title: 'Extensions', text: 'Custom modules and careful evaluation of third-party extensions.' },
      { title: 'Integrations', text: 'ERP, PIM, payment and shipping integrations for Canadian operations.' },
      { title: 'Re-platforming', text: 'Migrations from Magento 1, or from Magento to Shopify Plus when it makes sense.' },
    ],
    stack: ['Magento 2', 'Adobe Commerce', 'PHP 8', 'MySQL', 'Varnish', 'Redis', 'OpenSearch', 'Hyvä'],
    bestFor: 'Retailers and B2B sellers with large catalogues, complex pricing or many store views.',
    startingAt: 'Magento health audit $1,900; ongoing support from the Growth plan',
    faqs: [
      { q: 'Our Magento version is out of support. What now?', a: 'We start with a health audit, apply critical security fixes, then plan the upgrade (or migration) in stages to avoid downtime.' },
      { q: 'Do you build Hyvä themes?', a: 'Yes. Hyvä makes Magento storefronts dramatically faster and is our default for new Magento themes.' },
    ],
    related: ['ecommerce-development', 'devops-cloud', 'erp-implementation'],
  },
  {
    slug: 'wordpress',
    name: 'WordPress Development & Care',
    short: 'Fast, secure WordPress sites, WooCommerce stores and monthly care.',
    icon: 'wordpress',
    image: '/images/laptop-woman.webp',
    metaTitle: 'WordPress Development & Maintenance Canada',
    metaDescription:
      'WordPress design, development and maintenance for Canadian businesses: custom themes, WooCommerce, speed optimisation, security hardening, backups, hosting and accessibility (AODA/WCAG).',
    headline: 'WordPress development, hosting and maintenance',
    intro:
      'Most WordPress problems come from too many plugins, no updates and no backups. We build lean, custom sites your team can edit easily, then keep them updated, backed up, monitored and fast, so your website keeps working while you get on with business.',
    outcomes: [
      'Green Core Web Vitals and fast mobile pages',
      'Weekly updates, daily backups and uptime monitoring',
      'Accessible to WCAG 2.1 AA, which helps with Ontario’s AODA',
      'Built-in SEO foundations: schema, sitemaps and clean URLs',
    ],
    deliverables: [
      { title: 'Custom sites', text: 'Block-based (Gutenberg) themes that your team can edit without breaking the design.' },
      { title: 'WooCommerce', text: 'Stores with Canadian taxes, shipping and payments, plus subscriptions and memberships.' },
      { title: 'Speed optimisation', text: 'Caching, image optimisation, CDN and plugin clean-up for faster pages.' },
      { title: 'Security hardening', text: 'Firewall, malware scanning, 2FA for admins and recovery if you have been hacked.' },
      { title: 'Care plans', text: 'Updates, backups, monitoring and a set number of content changes each month.' },
      { title: 'Hosting & migration', text: 'Move to quality managed hosting in Canada or the US with zero downtime.' },
    ],
    stack: ['WordPress', 'WooCommerce', 'Gutenberg', 'ACF', 'Cloudflare', 'WP-CLI', 'PHP 8'],
    bestFor: 'Businesses that want a professional website without managing the technical side.',
    startingAt: 'Site launch from $4,900; care from the Essentials plan',
    faqs: [
      { q: 'Can you fix a hacked WordPress site?', a: 'Yes. We clean the infection, close the hole that let it in, restore from a clean backup where possible and harden the site so it doesn’t happen again.' },
      { q: 'Will we be able to edit the site ourselves?', a: 'Yes. Every site comes with editor training and a short guide written for your team.' },
    ],
    related: ['ecommerce-development', 'managed-it-support', 'business-email-smtp'],
  },
  {
    slug: 'mobile-app-development',
    name: 'Mobile App Development',
    short: 'iOS and Android apps with React Native, Flutter or native code.',
    icon: 'mobile',
    image: '/images/phone.webp',
    metaTitle: 'Mobile App Development Canada | iOS & Android',
    metaDescription:
      'Mobile app development for Canadian businesses: iOS and Android apps with React Native or Flutter, backend APIs, App Store and Google Play publishing, and ongoing maintenance.',
    headline: 'iOS and Android app development',
    intro:
      'A good app is more than screens: it needs a reliable backend, push notifications, analytics, store listings and regular updates for new OS versions. We take apps from idea to App Store and Google Play, and keep them healthy afterwards.',
    outcomes: [
      'One codebase for iOS and Android where it makes sense, native where it matters',
      'Test builds on your phone every sprint',
      'Store listings, screenshots and review submissions handled for you',
      'Crash reporting and analytics from launch day',
    ],
    deliverables: [
      { title: 'Product design', text: 'User research, flows and a tappable prototype before development starts.' },
      { title: 'Cross-platform apps', text: 'React Native or Flutter apps that feel native on both platforms.' },
      { title: 'Native features', text: 'Payments, maps, camera, biometrics, offline mode and push notifications.' },
      { title: 'Backend & APIs', text: 'Secure APIs, admin dashboards and integrations with your existing systems.' },
      { title: 'Publishing', text: 'App Store and Google Play accounts, listings, privacy labels and release management.' },
      { title: 'Maintenance', text: 'OS updates, dependency upgrades, bug fixes and new features after launch.' },
    ],
    stack: ['React Native', 'Expo', 'Flutter', 'Swift', 'Kotlin', 'Capacitor', 'Firebase', 'Node.js'],
    bestFor: 'Businesses launching a customer app, a field-staff app or a mobile version of their platform.',
    startingAt: 'App discovery from $2,900; MVPs by fixed quote',
    faqs: [
      { q: 'React Native, Flutter or native?', a: 'Cross-platform is right for most business apps and usually costs less to build and maintain. We recommend native Swift/Kotlin when you rely heavily on device features or graphics.' },
      { q: 'Do you maintain apps we already have?', a: 'Yes. We audit the code, update dependencies and set up automated builds before taking on new features.' },
    ],
    related: ['custom-software-development', 'fintech-development', 'devops-cloud'],
  },
  {
    slug: 'business-email-smtp',
    name: 'Business Email, SMTP & Cloud Services',
    short: 'Professional email, deliverability (SPF/DKIM/DMARC) and transactional SMTP.',
    icon: 'mail',
    image: '/images/team2.webp',
    metaTitle: 'Business Email & SMTP Services Canada',
    metaDescription:
      'Business email and SMTP for Canadian organisations: Microsoft 365 and Google Workspace set-up, mailbox migration, SPF, DKIM and DMARC, transactional SMTP for apps, and CASL-friendly sending.',
    headline: 'Business email, SMTP and deliverability',
    intro:
      'If your invoices land in spam or your app’s password-reset emails never arrive, you are losing money and trust. We set up professional email for your organisation and reliable SMTP for your websites and apps, with the authentication that inbox providers now require.',
    outcomes: [
      'Professional addresses on your own domain for every team member',
      'SPF, DKIM and DMARC aligned, meeting Google and Microsoft sender requirements',
      'Transactional email for your apps with delivery tracking',
      'Mailbox migrations with no lost mail',
    ],
    deliverables: [
      { title: 'Organisation email', text: 'Microsoft 365 or Google Workspace: mailboxes, shared inboxes, groups, calendars and MFA.' },
      { title: 'Deliverability', text: 'SPF, DKIM, DMARC (moving to p=reject safely), BIMI and monitoring of DMARC reports.' },
      { title: 'Transactional SMTP', text: 'Amazon SES, Postmark, SendGrid or Mailgun for app and website email, with bounce and complaint handling.' },
      { title: 'Migrations', text: 'From cPanel, GoDaddy, Zoho or on-premise Exchange to the cloud, mailbox by mailbox.' },
      { title: 'Security', text: 'Anti-phishing, attachment scanning, external-sender warnings and admin alerts.' },
      { title: 'Compliance', text: 'Retention policies, archiving and CASL-friendly marketing email set-up.' },
    ],
    stack: ['Microsoft 365', 'Google Workspace', 'Amazon SES', 'Postmark', 'SendGrid', 'Mailgun', 'Cloudflare DNS'],
    bestFor: 'Every organisation with its own domain, and every website or app that sends email.',
    startingAt: 'Email & SMTP set-up $890 (up to 25 mailboxes)',
    faqs: [
      { q: 'Why are our emails going to spam?', a: 'Usually missing or misaligned SPF, DKIM or DMARC, a poor sending reputation, or sending from a shared server. We diagnose it and fix the root cause.' },
      { q: 'Can you set up SMTP for our website forms?', a: 'Yes. We connect WordPress, Odoo, Magento or custom apps to an authenticated SMTP service so form and order emails arrive reliably.' },
      { q: 'Is Canadian data residency available?', a: 'Microsoft 365 can store core mailbox data in Canada for Canadian tenants, and Amazon SES is available in the Canada (Central) region.' },
    ],
    related: ['managed-it-support', 'devops-cloud', 'wordpress'],
  },
];

/** Editable text (name, summary, headline, intro, price hint, outcomes) comes from editable.json. */
export const services: Service[] = baseServices.map((s) => {
  const o = content.services.find((x) => x.slug === s.slug);
  return o ? { ...s, name: o.name, short: o.short, headline: o.headline, intro: o.intro, startingAt: o.startingAt, outcomes: o.outcomes } : s;
});

export const serviceBySlug = (slug: string) => services.find((s) => s.slug === slug);
