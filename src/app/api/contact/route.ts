import { mailConfigured, notifyAddress, sendMail } from '@/lib/mail';
import { brand } from '@/content/brand';

export const runtime = 'nodejs';

const MAX = { name: 120, email: 160, company: 160, phone: 40, message: 4000, other: 200 };
const recent = new Map<string, number[]>(); // light per-instance rate limit

function clean(v: unknown, max: number) {
  return String(v ?? '').replace(/[\r\n]+/g, ' ').trim().slice(0, max);
}

export async function POST(req: Request) {
  const ip = (req.headers.get('x-forwarded-for') || '').split(',')[0].trim() || 'unknown';
  const now = Date.now();
  const hits = (recent.get(ip) || []).filter((t) => now - t < 10 * 60 * 1000);
  if (hits.length >= 5) return Response.json({ message: 'Too many requests. Please try again in a few minutes.' }, { status: 429 });
  recent.set(ip, [...hits, now]);

  let raw: Record<string, unknown>;
  try {
    raw = await req.json();
  } catch {
    return Response.json({ message: 'Invalid request.' }, { status: 400 });
  }
  if (raw.website) return Response.json({ ok: true }); // honeypot: pretend success for bots

  const name = clean(raw.name, MAX.name);
  const email = clean(raw.email, MAX.email);
  const message = String(raw.message ?? '').trim().slice(0, MAX.message);
  if (!name || !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email) || message.length < 10 || raw.consent !== 'yes') {
    return Response.json({ message: 'Please add your name, a valid email, a short description and your consent.' }, { status: 400 });
  }

  const fields = {
    Name: name,
    Email: email,
    Company: clean(raw.company, MAX.company),
    Phone: clean(raw.phone, MAX.phone),
    Service: clean(raw.service, MAX.other),
    Engagement: clean(raw.engagement, MAX.other),
    Province: clean(raw.province, MAX.other),
    Selected: clean(raw.item, MAX.other),
  };
  const text = `${Object.entries(fields).map(([k, v]) => `${k}: ${v || '-'}`).join('\n')}\n\n${message}\n`;

  if (!(await mailConfigured())) {
    console.warn('contact form: SMTP not configured; request logged only');
    return Response.json({ message: brand.email ? `Our form is being set up. Please email us at ${brand.email} for now.` : 'Our form is being set up. Please try again shortly.' }, { status: 503 });
  }
  try {
    await sendMail({
      to: await notifyAddress(),
      replyTo: `${name} <${email}>`,
      subject: `New request: ${fields.Service || 'general'} from ${fields.Company || name}`,
      text,
    });
    return Response.json({ ok: true });
  } catch (err) {
    console.error('contact form send failed', err instanceof Error ? err.message : err);
    return Response.json({ message: 'We could not send your message. Please try again shortly.' }, { status: 502 });
  }
}
