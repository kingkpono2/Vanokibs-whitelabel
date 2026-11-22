import { adminConfigured, checkLogin, clearCookie, sessionCookie } from '@/lib/admin';

export const runtime = 'nodejs';
const attempts = new Map<string, number[]>();

export async function POST(req: Request) {
  if (!adminConfigured()) return Response.json({ message: 'Admin is not set up yet: add ADMIN_USERS in Vercel (see README).' }, { status: 503 });
  const ip = (req.headers.get('x-forwarded-for') || '').split(',')[0].trim() || 'unknown';
  const now = Date.now();
  const recent = (attempts.get(ip) || []).filter((t) => now - t < 15 * 60 * 1000);
  if (recent.length >= 8) return Response.json({ message: 'Too many attempts. Try again in 15 minutes.' }, { status: 429 });
  const body = (await req.json().catch(() => ({}))) as { email?: string; password?: string };
  const session = checkLogin(String(body.email || '').slice(0, 200), String(body.password || '').slice(0, 200));
  if (!session) {
    attempts.set(ip, [...recent, now]);
    return Response.json({ message: 'Wrong email or password.' }, { status: 401 });
  }
  attempts.delete(ip);
  return new Response(JSON.stringify({ ok: true, ...session }), { headers: { 'Content-Type': 'application/json', 'Set-Cookie': sessionCookie(session) } });
}

export async function DELETE() {
  return new Response(JSON.stringify({ ok: true }), { headers: { 'Content-Type': 'application/json', 'Set-Cookie': clearCookie() } });
}
