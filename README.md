# Vanokibs: technology services site for Canadian businesses

A fast, SEO-focused Next.js site that lets Canadian companies hire a technology team three ways:

- **Monthly subscriptions** (Essentials, Growth, Scale), with annual billing at 2 months free
- **One-time projects**: fixed-price packages, with a 30% deposit for larger ones
- **As needed**: prepaid hour blocks or pay-as-you-go

Services covered: managed IT & tech support, custom software, DevOps & cloud, ecommerce, fintech, ERP, Odoo, Magento, WordPress, mobile apps, and business email / SMTP / cloud services.

## What's inside

| Area | Where |
|---|---|
| Brand name, contact details (white-label) | `src/content/brand.ts` + environment variables |
| Prices (CAD), plans, packages, hour blocks | `src/content/plans.ts` |
| Service pages (11) | `src/content/services.ts` |
| Industry pages (4) | `src/content/industries.ts` |
| City pages (8) | `src/content/locations.ts` |
| Insights articles (4) | `src/content/posts.ts` |
| Stripe checkout | `src/app/api/checkout/route.ts` |
| Contact / quote form (SMTP) | `src/app/api/contact/route.ts` |
| Styles | `src/app/globals.css` |
| Photos (CC0, credited at `/credits`) | `public/images/` |

### SEO built in

- Every page is pre-rendered (static HTML) for speed.
- Unique title, description and canonical URL on every page, plus Open Graph and Twitter cards and a generated social image.
- schema.org structured data: ProfessionalService, WebSite, Service, FAQPage, BreadcrumbList, OfferCatalog and BlogPosting.
- `sitemap.xml`, `robots.txt` and a web manifest are generated automatically.
- Topic clusters: service ↔ industry ↔ city ↔ article pages all link to each other.
- Canadian focus: CAD pricing, provincial tax, PIPEDA / Law 25 / AODA content and city pages.

## Deploy on Vercel

1. In Vercel: **Add New → Project → Import** this repository. The framework (Next.js) is detected automatically. Click **Deploy**.
2. In **Settings → Environment Variables**, add the values from `.env.example`:
   - `NEXT_PUBLIC_SITE_URL`: your live address, e.g. `https://vanokibs.vercel.app` or your own domain. This sets canonical URLs and the sitemap.
   - `NEXT_PUBLIC_CONTACT_EMAIL` / `NEXT_PUBLIC_CONTACT_PHONE`: optional; shown in the footer and on the contact page.
   - `STRIPE_SECRET_KEY`: enables real checkout for subscriptions, packages and hours. Without it, every buy button opens the quote form with the item pre-filled, so nothing is a dead end.
   - `STRIPE_AUTOMATIC_TAX=true`: set this once Stripe Tax is set up with your GST/HST/QST registrations.
   - `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`, `CONTACT_TO`, `CONTACT_FROM`: deliver quote requests by email.
3. Redeploy after adding variables.
4. Optional: **Settings → Domains** to add your own domain, then update `NEXT_PUBLIC_SITE_URL`.
5. Submit `https://<your-domain>/sitemap.xml` in Google Search Console and Bing Webmaster Tools.

## Run locally

```bash
npm install
cp .env.example .env.local   # fill in what you have
npm run dev                  # http://localhost:3000
npm run build && npm start   # production build
```

Requires Node.js 20.9 or later.

## Change prices or rebrand

- **Prices**: edit `src/content/plans.ts`. Checkout reads prices on the server from this file, so the browser can never change what is charged.
- **Brand**: edit `src/content/brand.ts`, the `Logo` component and the colour tokens at the top of `src/app/globals.css`.

All prices are in CAD and exclude GST/HST/QST. The legal pages are starting templates; have them reviewed by counsel.
