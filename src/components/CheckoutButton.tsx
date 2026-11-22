'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

type Props = {
  kind: 'plan' | 'package' | 'hours';
  id: string;
  billing?: 'monthly' | 'annual';
  label: string;
  className?: string;
  showPrices: boolean;
};

/**
 * Starts a Stripe Checkout session. If online payment isn't configured yet (or fails),
 * it sends the visitor to the quote form with the item pre-selected, so no button is a dead end.
 */
export function CheckoutButton({ kind, id, billing = 'monthly', label, className = 'btn btn-primary btn-block', showPrices }: Props) {
  const [busy, setBusy] = useState(false);
  const router = useRouter();
  const itemKey = `${kind}:${id}${kind === 'plan' ? `:${billing}` : ''}`;

  if (!showPrices) {
    return <Link href={`/book?item=${encodeURIComponent(itemKey)}`} className={className}>Book a consultation</Link>;
  }

  async function start() {
    setBusy(true);
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ kind, id, billing }),
      });
      const data = (await res.json().catch(() => ({}))) as { url?: string };
      if (res.ok && data.url) {
        window.location.assign(data.url);
        return;
      }
    } catch {
      /* fall through to the quote form */
    }
    router.push(`/contact?item=${encodeURIComponent(itemKey)}`);
  }

  return (
    <button type="button" className={className} onClick={start} disabled={busy} aria-busy={busy}>
      {busy ? 'Opening secure checkout…' : label}
    </button>
  );
}
