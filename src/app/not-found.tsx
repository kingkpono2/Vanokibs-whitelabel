import Link from 'next/link';

export default function NotFound() {
  return (
    <section className="container thanks">
      <p className="eyebrow" style={{ justifyContent: 'center' }}>404</p>
      <h1>We couldn’t find that page</h1>
      <p className="lead">It may have moved. Try one of these instead:</p>
      <p style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
        <Link href="/services" className="btn btn-primary">Our services</Link>
        <Link href="/pricing" className="btn btn-ghost">Pricing</Link>
        <Link href="/contact" className="btn btn-ghost">Contact</Link>
      </p>
    </section>
  );
}
