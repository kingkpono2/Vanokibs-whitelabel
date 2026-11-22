import { PASSWORD_MIN, changePassword, getSession } from '@/lib/admin';

export const runtime = 'nodejs';

export async function POST(req: Request) {
  const session = await getSession(req);
  if (!session) return Response.json({ message: 'Please sign in.' }, { status: 401 });
  const body = (await req.json().catch(() => ({}))) as { current?: string; next?: string };
  const next = String(body.next || '');
  if (next.length < PASSWORD_MIN || next.length > 200) return Response.json({ message: `Use at least ${PASSWORD_MIN} characters.` }, { status: 400 });
  try {
    if (!(await changePassword(session, String(body.current || '').slice(0, 200), next))) {
      return Response.json({ message: 'Your current password is not correct.' }, { status: 400 });
    }
    return Response.json({ ok: true });
  } catch (err) {
    console.error('password change failed', err instanceof Error ? err.message : err);
    return Response.json({ message: 'Couldn’t save the new password. Please try again.' }, { status: 502 });
  }
}
