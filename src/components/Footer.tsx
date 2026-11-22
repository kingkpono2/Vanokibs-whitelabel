import Link from 'next/link';
import { brand } from '@/content/brand';
import { services } from '@/content/services';
import { industries } from '@/content/industries';
import { locations } from '@/content/locations';
import { Logo } from './Logo';

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="container footer-grid">
        <div className="footer-brand">
          <Logo light />
          <p>{brand.description}</p>
          <p className="footer-maple">Serving businesses across Canada · Prices in CAD</p>
          {brand.email && <a href={`mailto:${brand.email}`} className="footer-contact">{brand.email}</a>}
          {brand.phone && <a href={`tel:${brand.phone.replace(/[^+\d]/g, '')}`} className="footer-contact">{brand.phone}</a>}
        </div>
        <nav aria-label="Services">
          <h2>Services</h2>
          <ul>{services.map((s) => <li key={s.slug}><Link href={`/services/${s.slug}`}>{s.name}</Link></li>)}</ul>
        </nav>
        <nav aria-label="Industries and cities">
          <h2>Industries</h2>
          <ul>{industries.map((i) => <li key={i.slug}><Link href={`/industries/${i.slug}`}>{i.name}</Link></li>)}</ul>
          <h2 className="mt">Cities</h2>
          <ul className="footer-cities">{locations.map((l) => <li key={l.slug}><Link href={`/locations/${l.slug}`}>{l.city}</Link></li>)}</ul>
        </nav>
        <nav aria-label="Company">
          <h2>Company</h2>
          <ul>
            <li><Link href="/pricing">Pricing & plans</Link></li>
            <li><Link href="/how-it-works">How it works</Link></li>
            <li><Link href="/insights">Insights</Link></li>
            <li><Link href="/faq">FAQ</Link></li>
            <li><Link href="/contact">Contact & quotes</Link></li>
            <li><Link href="/legal/terms">Terms of service</Link></li>
            <li><Link href="/legal/privacy">Privacy policy</Link></li>
            <li><Link href="/credits">Photo credits</Link></li>
          </ul>
        </nav>
      </div>
      <div className="container footer-bottom">
        <p>© {new Date().getFullYear()} {brand.legalName}. All prices in Canadian dollars, before applicable taxes.</p>
        <p className="footer-pay">Payments by Stripe</p>
      </div>
    </footer>
  );
}
