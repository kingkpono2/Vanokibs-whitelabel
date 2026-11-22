import { canSave, conform, getSession, GitHubError, readContent, writeContent } from '@/lib/admin';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  const session = getSession(req);
  if (!session) return Response.json({ user: null }); // not signed in: the admin shows the sign-in form
  try {
    const { data, sha } = await readContent();
    return Response.json({ data, sha, canSave: canSave(), user: session });
  } catch (err) {
    console.error('admin read failed', err instanceof Error ? err.message : err);
    return Response.json({ message: err instanceof GitHubError ? err.message : 'Could not load content from GitHub. Check GITHUB_TOKEN and GITHUB_REPO.' }, { status: 502 });
  }
}

export async function PUT(req: Request) {
  const session = getSession(req);
  if (!session) return Response.json({ message: 'Please sign in.' }, { status: 401 });
  if (!canSave()) return Response.json({ message: 'Saving needs GITHUB_TOKEN in Vercel (see README).' }, { status: 503 });
  const body = (await req.json().catch(() => null)) as { data?: unknown; sha?: string } | null;
  if (!body?.data || !body.sha) return Response.json({ message: 'Invalid request.' }, { status: 400 });
  try {
    const latest = await readContent();
    if (latest.sha !== body.sha) return Response.json({ message: 'Someone else saved changes. Reload and try again.' }, { status: 409 });
    const clean = conform(latest.data, body.data);
    if (session.role !== 'owner') {
      // Support staff can edit text but never prices, whatever the browser sends.
      clean.pricing = latest.data.pricing;
      clean.services = clean.services.map((s, i) => ({ ...s, startingAt: latest.data.services[i].startingAt }));
    }
    const result = await writeContent(clean, body.sha, `${session.email}, ${session.role}`);
    if (!result.ok) return Response.json({ message: 'Content changed while saving. Reload and try again.' }, { status: 409 });
    return Response.json({ ok: true });
  } catch (err) {
    console.error('admin save failed', err instanceof Error ? err.message : err);
    return Response.json({ message: err instanceof GitHubError ? err.message : 'Saving failed. Please try again.' }, { status: 502 });
  }
}
