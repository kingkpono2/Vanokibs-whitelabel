import { createHmac, scryptSync, timingSafeEqual } from 'node:crypto';
import bundled from '@/content/editable.json';

export type Content = typeof bundled;

export const COOKIE = 'vk_admin';
const SESSION_SECONDS = 8 * 60 * 60;
const CONTENT_PATH = 'src/content/editable.json';

export type Role = 'owner' | 'support';
export type Session = { email: string; role: Role };
type User = { email: string; role: Role; hash: string };

/**
 * Admin users come from the ADMIN_USERS environment variable (never from the repo):
 * [{"email":"...","role":"owner"|"support","hash":"scrypt$<salt>$<key>"}]
 * Owners can edit everything; support can edit text but not prices.
 */
function users(): User[] {
  try {
    const list = JSON.parse(process.env.ADMIN_USERS || '[]') as User[];
    return list.filter((u) => u && u.email && u.hash && (u.role === 'owner' || u.role === 'support'));
  } catch {
    return [];
  }
}

/** Session signing key: ADMIN_SECRET if set, otherwise derived from ADMIN_USERS (changing a password signs everyone out). */
const secret = () =>
  process.env.ADMIN_SECRET || (process.env.ADMIN_USERS ? createHmac('sha256', 'vanokibs-session').update(process.env.ADMIN_USERS).digest('base64url') : '');
const sign = (v: string) => createHmac('sha256', secret()).update(v).digest('base64url');

export function adminConfigured() {
  return secret().length >= 32 && users().length > 0;
}

function verifyHash(password: string, stored: string) {
  const [scheme, salt, key] = stored.split('$');
  if (scheme !== 'scrypt' || !salt || !key) return false;
  const expected = Buffer.from(key, 'base64url');
  const actual = scryptSync(password, Buffer.from(salt, 'base64url'), expected.length, { N: 16384, r: 8, p: 1 });
  return actual.length === expected.length && timingSafeEqual(actual, expected);
}

/** Returns the session for valid credentials. Always does the hashing work, so timing doesn't reveal valid emails. */
export function checkLogin(email: string, password: string): Session | null {
  const user = users().find((u) => u.email.toLowerCase() === email.trim().toLowerCase());
  const ok = verifyHash(password, user?.hash || 'scrypt$AAAAAAAAAAAAAAAAAAAAAA$AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA');
  return user && ok ? { email: user.email, role: user.role } : null;
}

export function sessionCookie(s: Session) {
  const exp = Math.floor(Date.now() / 1000) + SESSION_SECONDS;
  const payload = `${Buffer.from(s.email).toString('base64url')}.${s.role}.${exp}`;
  return `${COOKIE}=${payload}.${sign(payload)}; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=${SESSION_SECONDS}`;
}
export const clearCookie = () => `${COOKIE}=; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=0`;

export function getSession(req: Request): Session | null {
  if (!adminConfigured()) return null;
  const raw = (req.headers.get('cookie') || '').split(/;\s*/).find((c) => c.startsWith(`${COOKIE}=`));
  if (!raw) return null;
  const parts = raw.slice(COOKIE.length + 1).split('.');
  if (parts.length !== 4) return null;
  const [em, role, exp, sig] = parts;
  const payload = `${em}.${role}.${exp}`;
  const expected = sign(payload);
  if (expected.length !== sig.length || !timingSafeEqual(Buffer.from(expected), Buffer.from(sig))) return null;
  if (Number(exp) < Date.now() / 1000 || (role !== 'owner' && role !== 'support')) return null;
  const email = Buffer.from(em, 'base64url').toString('utf8');
  // The user must still exist with the same role (removing them from ADMIN_USERS revokes access).
  const user = users().find((u) => u.email.toLowerCase() === email.toLowerCase() && u.role === role);
  return user ? { email: user.email, role: user.role } : null;
}


/* ------------------------------------------------------------ GitHub storage */

const repo = () => process.env.GITHUB_REPO || 'kingkpono2/Vanokibs-whitelabel';
/** The GitHub token: GITHUB_TOKEN, or GITHUB_USER (the name used in this project's Vercel settings). */
const token = () => process.env.GITHUB_TOKEN || process.env.GITHUB_USER || '';
const branch = () => process.env.GITHUB_BRANCH || 'main';
const gh = (path: string, init?: RequestInit) =>
  fetch(`https://api.github.com/repos/${repo()}/contents/${path}`, {
    ...init,
    cache: 'no-store',
    headers: {
      Accept: 'application/vnd.github+json',
      Authorization: `Bearer ${token()}`,
      'X-GitHub-Api-Version': '2022-11-28',
      'User-Agent': 'vanokibs-admin',
      ...(init?.headers || {}),
    },
  });

export const canSave = () => token().length > 20;

/** Plain-English explanation of a GitHub API error, shown in the admin. */
export class GitHubError extends Error {
  constructor(public status: number, action: 'read' | 'save') {
    const hints: Record<number, string> = {
      401: 'GitHub rejected the token: it is wrong or has expired. Create a new token and update GITHUB_TOKEN in Vercel.',
      403: 'GitHub refused permission. Edit the token: Repository access must include Vanokibs-whitelabel, and Contents must be "Read and write".',
      404: 'GitHub could not find the repository with this token. Check GITHUB_REPO and that the token has access to Vanokibs-whitelabel.',
    };
    super(hints[status] || `GitHub ${action} failed (status ${status}). Please try again.`);
  }
}

/** Latest saved content (from GitHub when configured, so edits made since the last deploy show up). */
export async function readContent(): Promise<{ data: Content; sha: string | null }> {
  if (!canSave()) return { data: bundled, sha: null };
  const res = await gh(`${CONTENT_PATH}?ref=${encodeURIComponent(branch())}`);
  if (!res.ok) throw new GitHubError(res.status, 'read');
  const body = (await res.json()) as { content: string; sha: string };
  return { data: JSON.parse(Buffer.from(body.content, 'base64').toString('utf8')), sha: body.sha };
}

export async function writeContent(data: Content, sha: string, who: string) {
  const res = await gh(CONTENT_PATH, {
    method: 'PUT',
    body: JSON.stringify({
      message: `Content update via admin (${who})`,
      content: Buffer.from(`${JSON.stringify(data, null, 2)}\n`).toString('base64'),
      sha,
      branch: branch(),
    }),
  });
  if (res.status === 409 || (res.status === 422 && !(await res.clone().text()).includes('permission'))) return { ok: false as const, conflict: true };
  if (!res.ok) throw new GitHubError(res.status, 'save');
  return { ok: true as const };
}

/* ------------------------------------------------------------- validation */

const LOCKED = new Set(['id', 'slug', 'service']); // identifiers used by checkout and URLs

/**
 * Shapes untrusted input like `template`: same keys and types, strings trimmed and capped,
 * numbers finite and non-negative, identifiers unchanged. Lists of plain items (bullets,
 * FAQs) may grow or shrink; lists of identified items (plans, packages, services) keep
 * their entries so prices and pages can't be broken from the editor.
 */
export function conform<T>(template: T, value: unknown): T {
  if (typeof template === 'string') return (typeof value === 'string' ? value.trim().slice(0, 3000) : template) as T;
  if (typeof template === 'number') {
    const n = Number(value);
    return (Number.isFinite(n) && n >= 0 && n <= 10_000_000 ? Math.round(n * 100) / 100 : template) as T;
  }
  if (typeof template === 'boolean') return (typeof value === 'boolean' ? value : template) as T;
  if (Array.isArray(template)) {
    const arr = Array.isArray(value) ? value : [];
    const first = template[0];
    if (typeof first === 'string' || template.length === 0) {
      return arr.filter((v) => typeof v === 'string').map((v: string) => v.trim().slice(0, 400)).filter(Boolean).slice(0, 30) as T;
    }
    const identified = first && typeof first === 'object' && Object.keys(first).some((k) => LOCKED.has(k));
    if (identified) return template.map((t, i) => conform(t, arr[i])) as T;
    return arr.slice(0, 30).map((v) => conform(first, v)).filter((o) => Object.values(o as object).some((x) => x !== '')) as T;
  }
  if (template && typeof template === 'object') {
    const v = (value && typeof value === 'object' ? value : {}) as Record<string, unknown>;
    const out: Record<string, unknown> = {};
    for (const [k, t] of Object.entries(template)) out[k] = LOCKED.has(k) ? t : conform(t, v[k]);
    return out as T;
  }
  return template;
}
