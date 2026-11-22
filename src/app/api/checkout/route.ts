import Stripe from 'stripe';
import { resolveItem } from '@/lib/catalog';
import { brand } from '@/content/brand';
import { SHOW_PRICES } from '@/content/plans';

export const runtime = 'nodejs';

export async function POST(req: Request) {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key || !SHOW_PRICES) {
    // Not configured yet: the button falls back to the quote form.
    return Response.json({ fallback: true, message: 'Online checkout is not enabled yet.' }, { status: 503 });
  }

  let body: { kind?: string; id?: string; billing?: string };
  try {
    body = await req.json();
  } catch {
    return Response.json({ message: 'Invalid request.' }, { status: 400 });
  }
  const item = resolveItem(String(body.kind || ''), String(body.id || ''), String(body.billing || 'monthly'));
  if (!item) return Response.json({ message: 'Unknown item.' }, { status: 400 });

  const origin = brand.siteUrl;
  const stripe = new Stripe(key);
  const lineItem: Stripe.Checkout.SessionCreateParams.LineItem = {
    quantity: 1,
    price_data: {
      currency: 'cad',
      unit_amount: Math.round(item.amount * 100),
      tax_behavior: 'exclusive',
      product_data: { name: item.name, description: item.description, metadata: { key: item.key } },
      ...(item.recurring ? { recurring: { interval: item.recurring } } : {}),
    },
  };

  try {
    const session = await stripe.checkout.sessions.create({
      mode: item.recurring ? 'subscription' : 'payment',
      line_items: [lineItem],
      success_url: `${origin}/thank-you?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/pricing?cancelled=1`,
      billing_address_collection: 'required',
      tax_id_collection: { enabled: true },
      allow_promotion_codes: true,
      automatic_tax: { enabled: process.env.STRIPE_AUTOMATIC_TAX === 'true' },
      metadata: { item: item.key },
      ...(item.recurring ? { subscription_data: { metadata: { item: item.key } } } : { customer_creation: 'always', invoice_creation: { enabled: true } }),
    });
    return Response.json({ url: session.url });
  } catch (err) {
    console.error('stripe checkout failed', err instanceof Error ? err.message : err);
    return Response.json({ message: 'Checkout is temporarily unavailable.' }, { status: 502 });
  }
}
