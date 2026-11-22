import { createResetToken } from '@/lib/admin';
import { mailConfigured, sendMail } from '@/lib/mail';
import { brand } from '@/content/brand';

export const runtime = 'nodejs';
const recent = new Map<string, number[]>();
const DONE = 'If that email belongs to an admin, a reset link is on its way. It works for 30 minutes.';

export async function POST(req: Request) {
  const ip = (req.headers.get('x-forwarded-for') || '').split(',')[0].trim() || 'unknown';
  const now = Date.now();
  const hits = (recent.get(ip) || []).filter((t) => now - t < 3600_000);
  if (hits.length >= 5) return Response.json({ message: 'Too many requests. Try again later.' }, { status: 429 });
  recent.set(ip, [...hits, now]);
  if (!(await mailConfigured())) return Response.json({ message: 'Password reset email isn’t set up yet. Please contact your developer.' }, { status: 503 });
  const body = (await req.json().catch(() => ({}))) as { email?: string };
  const email = String(body.email || '').trim().slice(0, 200);
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) return Response.json({ message: 'Enter your admin email.' }, { status: 400 });
  try {
    const token = await createResetToken(email);
    if (token) {
      const link = `${brand.siteUrl}/admin?reset=${encodeURIComponent(token)}&email=${encodeURIComponent(email)}`;
      await sendMail({
        to: email,
        subject: `Reset your ${brand.name} admin password`,
        text: `Someone asked to reset the password for ${email} on the ${brand.name} website admin.\n\nSet a new password here (the link works for 30 minutes):\n${link}\n\nIf this wasn't you, ignore this email; your password stays the same.\n`,
      });
    }
  } catch (err) {
    console.error('password reset request failed', err instanceof Error ? err.message : err);
    return Response.json({ message: 'Couldn’t send the reset email. Please try again.' }, { status: 502 });
  }
  return Response.json({ ok: true, message: DONE });
}
