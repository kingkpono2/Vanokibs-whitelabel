export type Location = {
  slug: string;
  city: string;
  province: string;
  provinceCode: string;
  timezone: string;
  image: string;
  intro: string;
  local: string[];
  focus: string[]; // service slugs most requested here
};

export const locations: Location[] = [
  {
    slug: 'toronto',
    city: 'Toronto',
    province: 'Ontario',
    provinceCode: 'ON',
    timezone: 'Eastern Time',
    image: '/images/toronto2.webp',
    intro:
      'Toronto is home to Canada’s largest concentration of retailers, financial institutions and fast-growing start-ups. We work with GTA businesses from Mississauga to Markham as their on-demand technology team: support during your working day, and engineers who understand the pace of the city.',
    local: [
      'Websites and apps built to WCAG 2.1 AA, which supports AODA obligations for Ontario organisations',
      'Fintech and payments experience for companies in Canada’s financial capital',
      'Support hours aligned with Eastern Time, with after-hours cover on higher plans',
    ],
    focus: ['fintech-development', 'ecommerce-development', 'managed-it-support', 'devops-cloud'],
  },
  {
    slug: 'vancouver',
    city: 'Vancouver',
    province: 'British Columbia',
    provinceCode: 'BC',
    timezone: 'Pacific Time',
    image: '/images/vancouver.webp',
    intro:
      'Vancouver’s tech, ecommerce and trade sectors move quickly and often sell across the Pacific and into the US. We support Lower Mainland businesses on Pacific Time with DevOps, cloud and product engineering, and the day-to-day IT that keeps teams working.',
    local: [
      'Privacy practices that account for BC’s Personal Information Protection Act (PIPA) alongside PIPEDA',
      'Cross-border ecommerce: USD pricing, duties and US shipping integrated with Canadian stores',
      'Support hours that start when your day starts on the West Coast',
    ],
    focus: ['devops-cloud', 'ecommerce-development', 'custom-software-development', 'mobile-app-development'],
  },
  {
    slug: 'calgary',
    city: 'Calgary',
    province: 'Alberta',
    provinceCode: 'AB',
    timezone: 'Mountain Time',
    image: '/images/server1.webp',
    intro:
      'Calgary’s energy, logistics and growing tech sector depend on systems that cannot afford downtime. We help Calgary companies modernise legacy applications, move to the cloud securely and run reliable operations, with support on Mountain Time.',
    local: [
      'Privacy controls that reflect Alberta’s PIPA as well as federal law',
      'Experience modernising operational and field-service software',
      'Cloud hosting in Canadian regions, including AWS Calgary (ca-west-1)',
    ],
    focus: ['devops-cloud', 'custom-software-development', 'erp-implementation', 'managed-it-support'],
  },
  {
    slug: 'edmonton',
    city: 'Edmonton',
    province: 'Alberta',
    provinceCode: 'AB',
    timezone: 'Mountain Time',
    image: '/images/desk.webp',
    intro:
      'From manufacturers and distributors to health and education organisations, Edmonton businesses need dependable IT and systems that connect. We implement ERP, automate workflows and run help desks for teams across the Capital Region.',
    local: [
      'Odoo ERP for manufacturers and distributors serving Western Canada',
      'Managed IT support aligned with Mountain Time',
      'Canadian data residency options for regulated organisations',
    ],
    focus: ['erp-implementation', 'odoo', 'managed-it-support', 'custom-software-development'],
  },
  {
    slug: 'ottawa',
    city: 'Ottawa',
    province: 'Ontario',
    provinceCode: 'ON',
    timezone: 'Eastern Time',
    image: '/images/team.webp',
    intro:
      'Ottawa’s mix of technology companies, associations and suppliers to the public sector expects strong security and bilingual delivery. We build accessible, bilingual websites and applications and provide secure IT operations for National Capital Region organisations.',
    local: [
      'Bilingual (English/French) websites and apps',
      'Accessibility to WCAG 2.1 AA for organisations with AODA or federal accessibility obligations',
      'Security-first DevOps with documented controls and Canadian hosting',
    ],
    focus: ['custom-software-development', 'devops-cloud', 'wordpress', 'managed-it-support'],
  },
  {
    slug: 'montreal',
    city: 'Montréal',
    province: 'Quebec',
    provinceCode: 'QC',
    timezone: 'Eastern Time',
    image: '/images/team2.webp',
    intro:
      'Montréal businesses operate in French first, with privacy rules that are among the strictest in North America. We deliver bilingual websites, stores and applications, and help organisations meet Quebec’s Law 25 privacy requirements in their systems.',
    local: [
      'French-first, bilingual storefronts and apps in line with the Charter of the French Language',
      'Technical support for Law 25: consent, data inventories and privacy-by-default settings',
      'Hosting in Canadian regions, including GCP Montréal and Azure Canada East',
    ],
    focus: ['ecommerce-development', 'custom-software-development', 'devops-cloud', 'business-email-smtp'],
  },
  {
    slug: 'winnipeg',
    city: 'Winnipeg',
    province: 'Manitoba',
    provinceCode: 'MB',
    timezone: 'Central Time',
    image: '/images/warehouse.webp',
    intro:
      'Winnipeg sits at the centre of Canada’s transportation and distribution network, and its manufacturers, agri-food and logistics firms depend on accurate inventory and connected systems. We bring ERP, integration and IT support to Manitoba businesses on Central Time.',
    local: [
      'ERP, warehouse and EDI integration for distribution and agri-food businesses',
      'Managed IT and help desk on Central Time',
      'Ecommerce for brands selling across Canada and into the US',
    ],
    focus: ['erp-implementation', 'odoo', 'ecommerce-development', 'managed-it-support'],
  },
  {
    slug: 'halifax',
    city: 'Halifax',
    province: 'Nova Scotia',
    provinceCode: 'NS',
    timezone: 'Atlantic Time',
    image: '/images/macbook.webp',
    intro:
      'Halifax’s ocean-tech, tourism, education and professional-services businesses need enterprise-grade technology without an enterprise IT budget. We provide on-demand engineering and support to Atlantic Canada, starting our day on Atlantic Time.',
    local: [
      'Support coverage that starts at 9:00 Atlantic Time',
      'Websites, booking and ecommerce for tourism and hospitality businesses',
      'Secure email and IT for professional-services firms',
    ],
    focus: ['managed-it-support', 'wordpress', 'business-email-smtp', 'custom-software-development'],
  },
];

export const locationBySlug = (slug: string) => locations.find((l) => l.slug === slug);
