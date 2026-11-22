import Link from 'next/link';
import { brand } from '@/content/brand';
import { Logo } from '@/components/Logo';

/** Plain admin chrome: logo and a link back to the site, nothing else. */
export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <header className="adm-top">
        <div className="container adm-top__row">
          <span className="adm-top__brand"><Logo name={brand.name} /> <span className="adm-top__label">Admin</span></span>
          <Link href="/" className="adm-top__site">View website</Link>
        </div>
      </header>
      <main id="main">{children}</main>
    </>
  );
}
