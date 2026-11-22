import { PASSWORD_MIN, resetPassword } from '@/lib/admin';

export const runtime = 'nodejs';
const recent = new Map<string, number[]>();

export async function POST(req: Request) {
  const ip = (req.headers.get('x-forwarded-for') || '').split(',')[0].trim() || 'unknown';
  const now = Date.now();
  const hits = (recent.get(ip) || []).filter((t) => now - t < 3600_000);
  if (hits.length >= 10) return Response.json({ message: 'Too many attempts. Try again later.' }, { status: 429 });
  recent.set(ip, [...hits, now]);
  const body = (await req.json().catch(() => ({}))) as { email?: string; token?: string; password?: string };
  const password = String(body.password || '');
  if (password.length < PASSWORD_MIN || password.length > 200) return Response.json({ message: `Use at least ${PASSWORD_MIN} characters.` }, { status: 400 });
  try {
    const ok = await resetPassword(String(body.email || '').slice(0, 200), String(body.token || '').slice(0, 200), password);
    if (!ok) return Response.json({ message: 'This reset link is invalid or has expired. Request a new one.' }, { status: 400 });
    return Response.json({ ok: true });
  } catch (err) {
    console.error('password reset failed', err instanceof Error ? err.message : err);
    return Response.json({ message: 'Couldn’t save the new password. Please try again.' }, { status: 502 });
  }
}
