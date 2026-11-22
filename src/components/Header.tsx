'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { brand } from '@/content/brand';
import { services } from '@/content/services';
import { industries } from '@/content/industries';
import { Logo } from './Logo';

export function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => setOpen(false), [pathname]);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  return (
    <header className={`site-header${scrolled ? ' is-scrolled' : ''}`}>
      <div className="container header-row">
        <Link href="/" className="brand" aria-label={`${brand.name} home`}>
          <Logo />
        </Link>

        <nav className="nav" aria-label="Main">
          <div className="nav-item has-menu">
            <Link href="/services" className="nav-link">Services <span className="caret" aria-hidden="true" /></Link>
            <div className="mega" role="menu">
              <div className="mega-grid">
                {services.map((s) => (
                  <Link key={s.slug} href={`/services/${s.slug}`} className="mega-link" role="menuitem">
                    <span><strong>{s.name}</strong><small>{s.short}</small></span>
                  </Link>
                ))}
              </div>
            </div>
          </div>
          <div className="nav-item has-menu">
            <Link href="/industries" className="nav-link">Industries <span className="caret" aria-hidden="true" /></Link>
            <div className="mega mega--sm" role="menu">
              {industries.map((i) => (
                <Link key={i.slug} href={`/industries/${i.slug}`} className="mega-link" role="menuitem">
                  <span><strong>{i.name}</strong></span>
                </Link>
              ))}
            </div>
          </div>
          <Link href="/pricing" className="nav-link">Pricing</Link>
          <Link href="/how-it-works" className="nav-link">How it works</Link>
          <Link href="/insights" className="nav-link">Insights</Link>
        </nav>

        <div className="header-cta">
          <Link href="/contact" className="btn btn-ghost btn-sm hide-sm">Book a call</Link>
          <Link href="/pricing" className="btn btn-primary btn-sm">Hire us</Link>
          <button className="menu-btn" aria-label="Open menu" aria-expanded={open} aria-controls="mobile-nav" onClick={() => setOpen(true)}>
            <span /><span /><span />
          </button>
        </div>
      </div>

      <div className={`mobile-nav${open ? ' is-open' : ''}`} id="mobile-nav" aria-hidden={!open}>
        <div className="mobile-nav__head">
          <Logo />
          <button className="close-btn" aria-label="Close menu" onClick={() => setOpen(false)}>×</button>
        </div>
        <div className="mobile-nav__body">
          <p className="mobile-nav__label">Services</p>
          {services.map((s) => (
            <Link key={s.slug} href={`/services/${s.slug}`} className="mobile-link">{s.name}</Link>
          ))}
          <p className="mobile-nav__label">Company</p>
          <Link href="/pricing" className="mobile-link">Pricing</Link>
          <Link href="/industries" className="mobile-link">Industries</Link>
          <Link href="/how-it-works" className="mobile-link">How it works</Link>
          <Link href="/insights" className="mobile-link">Insights</Link>
          <Link href="/locations" className="mobile-link">Cities we serve</Link>
          <Link href="/contact" className="btn btn-primary btn-block">Book a consultation</Link>
        </div>
      </div>
      {open && <button className="mobile-overlay" aria-label="Close menu" onClick={() => setOpen(false)} />}
    </header>
  );
}
