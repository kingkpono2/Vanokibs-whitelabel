import type { Metadata } from 'next';
import credits from '@/content/credits.json';
import { Breadcrumbs, PageHero } from '@/components/Bits';
import { pageMeta } from '@/lib/seo';

export const metadata: Metadata = { ...pageMeta({ title: 'Photo Credits', description: 'Sources and licences for the photographs used on this website.', path: '/credits' }), robots: { index: false, follow: true } };

export default function Credits() {
  return (
    <>
      <PageHero eyebrow="Credits" title="Photo credits" text="All photographs are CC0 / public-domain images. Thank you to the photographers who share their work." crumbs={[{ name: 'Home', path: '/' }, { name: 'Photo credits', path: '/credits' }]} />
      <section className="section">
        <div className="container table-wrap">
          <table className="compare credits-table">
            <thead><tr><th>Image</th><th>Source</th><th>Licence</th></tr></thead>
            <tbody>{credits.map((c) => <tr key={c.file}><td>{c.file}</td><td><a href={c.source} rel="nofollow noopener" target="_blank">{c.source}</a></td><td>{c.license}</td></tr>)}</tbody>
          </table>
        </div>
      </section>
    </>
  );
}
