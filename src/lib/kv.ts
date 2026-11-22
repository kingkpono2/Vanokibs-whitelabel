/**
 * Minimal Upstash Redis REST client (no dependency). Works with the variables Vercel adds
 * when you connect "Upstash for Redis" (KV_REST_API_URL / KV_REST_API_TOKEN) or with
 * UPSTASH_REDIS_REST_URL / UPSTASH_REDIS_REST_TOKEN.
 */
const url = () => process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL || '';
const token = () => process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN || '';

export const kvConfigured = () => Boolean(url() && token());

type Cmd = (string | number)[];

async function call(path: string, body: unknown) {
  const res = await fetch(`${url()}${path}`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token()}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
    cache: 'no-store',
  });
  if (!res.ok) throw new Error(`Database error (${res.status})`);
  return res.json();
}

export async function kv<T = unknown>(...cmd: Cmd): Promise<T> {
  const out = (await call('', cmd.map(String))) as { result?: T; error?: string };
  if (out.error) throw new Error(out.error);
  return out.result as T;
}

export async function kvPipeline(cmds: Cmd[]): Promise<unknown[]> {
  const out = (await call('/pipeline', cmds.map((c) => c.map(String)))) as { result?: unknown; error?: string }[];
  return out.map((r) => {
    if (r.error) throw new Error(r.error);
    return r.result;
  });
}
