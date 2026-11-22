import { createCipheriv, createDecipheriv, createHash, createHmac, randomBytes, scryptSync, timingSafeEqual } from 'node:crypto';
import bundled from '@/content/editable.json';

export type Content = typeof bundled;

export const COOKIE = 'vk_admin';
const SESSION_SECONDS = 8 * 60 * 60;
const CONTENT_PATH = 'src/content/editable.json';

export type Role = 'owner' | 'support';
export type Session = { email: string; role: Role };
export type User = { email: string; role: Role; hash: string; updatedAt?: string };

/**
 * Admin users and password-reset tokens live in an encrypted file in the repo
 * (src/content/admin-store.enc.json, AES-256-GCM). The key is derived on the server from
 * ADMIN_SECRET, or from ADMIN_USERS when ADMIN_SECRET isn't set, so the file is unreadable
 * without the Vercel settings. If the file is missing or can't be decrypted, the users in
 * the ADMIN_USERS environment variable are used. Owners edit everything; support can't edit prices.
 */
function envUsers(): User[] {
  try {
    const list = JSON.parse(process.env.ADMIN_USERS || '[]') as User[];
    return list.filter((u) => u && u.email && u.hash && (u.role === 'owner' || u.role === 'support'));
  } catch {
    return [];
  }
}

/** Stable secret text: ADMIN_SECRET, or ADMIN_USERS normalised (whitespace in the Vercel value doesn't matter). */
function baseSecret() {
  if (process.env.ADMIN_SECRET) return process.env.ADMIN_SECRET;
  try {
    return process.env.ADMIN_USERS ? JSON.stringify(JSON.parse(process.env.ADMIN_USERS)) : '';
  } catch {
    return '';
  }
}

const secret = () => (baseSecret() ? createHmac('sha256', 'vanokibs-session').update(baseSecret()).digest('base64url') : '');
const sign = (v: string) => createHmac('sha256', secret()).update(v).digest('base64url');

async function users(): Promise<User[]> {
  const store = (await readStore()).store;
  return store?.users?.length ? store.users : envUsers();
}

export async function adminConfigured() {
  return secret().length >= 32 && (await users()).length > 0;
}

export function hashPassword(password: string) {
  const salt = randomBytes(16);
  return `scrypt$${salt.toString('base64url')}$${scryptSync(password, salt, 32, { N: 16384, r: 8, p: 1 }).toString('base64url')}`;
}

function verifyHash(password: string, stored: string) {
  const [scheme, salt, key] = stored.split('$');
  if (scheme !== 'scrypt' || !salt || !key) return false;
  const expected = Buffer.from(key, 'base64url');
  const actual = scryptSync(password, Buffer.from(salt, 'base64url'), expected.length, { N: 16384, r: 8, p: 1 });
  return actual.length === expected.length && timingSafeEqual(actual, expected);
}

/** Returns the session for valid credentials. Always does the hashing work, so timing doesn't reveal valid emails. */
export async function checkLogin(email: string, password: string): Promise<Session | null> {
  const user = (await users()).find((u) => u.email.toLowerCase() === email.trim().toLowerCase());
  const ok = verifyHash(password, user?.hash || 'scrypt$AAAAAAAAAAAAAAAAAAAAAA$AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA');
  return user && ok ? { email: user.email, role: user.role } : null;
}

export function sessionCookie(s: Session) {
  const exp = Math.floor(Date.now() / 1000) + SESSION_SECONDS;
  const payload = `${Buffer.from(s.email).toString('base64url')}.${s.role}.${exp}`;
  return `${COOKIE}=${payload}.${sign(payload)}; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=${SESSION_SECONDS}`;
}
export const clearCookie = () => `${COOKIE}=; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=0`;

export async function getSession(req: Request): Promise<Session | null> {
  const raw = (req.headers.get('cookie') || '').split(/;\s*/).find((c) => c.startsWith(`${COOKIE}=`));
  if (!raw || !secret()) return null;
  const parts = raw.slice(COOKIE.length + 1).split('.');
  if (parts.length !== 4) return null;
  const [em, role, exp, sig] = parts;
  const payload = `${em}.${role}.${exp}`;
  const expected = sign(payload);
  if (expected.length !== sig.length || !timingSafeEqual(Buffer.from(expected), Buffer.from(sig))) return null;
  if (Number(exp) < Date.now() / 1000 || (role !== 'owner' && role !== 'support')) return null;
  const email = Buffer.from(em, 'base64url').toString('utf8');
  // The user must still exist with the same role (removing them revokes access).
  const user = (await users()).find((u) => u.email.toLowerCase() === email.toLowerCase() && u.role === role);
  return user ? { email: user.email, role: user.role } : null;
}

/* ------------------------------------------------------- encrypted admin store */

export type MailSettings = { host: string; port: number; user: string; pass: string; from: string; fromName: string; notifyTo: string };
export type Store = {
  users: User[];
  resets: { email: string; tokenHash: string; exp: number }[];
  mail?: MailSettings;
};
const STORE_PATH = 'src/content/admin-store.enc.json';
const storeKey = () => (baseSecret() ? createHash('sha256').update(`vanokibs-admin-store:${baseSecret()}`).digest() : null);

export function encryptStore(store: Store, key: Buffer) {
  const iv = randomBytes(12);
  const c = createCipheriv('aes-256-gcm', key, iv);
  const data = Buffer.concat([c.update(JSON.stringify(store), 'utf8'), c.final()]);
  return JSON.stringify({ v: 1, iv: iv.toString('base64'), tag: c.getAuthTag().toString('base64'), data: data.toString('base64') }, null, 1);
}

function decryptStore(text: string, key: Buffer): Store | null {
  try {
    const f = JSON.parse(text) as { iv: string; tag: string; data: string };
    const d = createDecipheriv('aes-256-gcm', key, Buffer.from(f.iv, 'base64'));
    d.setAuthTag(Buffer.from(f.tag, 'base64'));
    return JSON.parse(Buffer.concat([d.update(Buffer.from(f.data, 'base64')), d.final()]).toString('utf8')) as Store;
  } catch {
    return null;
  }
}

let cache: { at: number; value: { store: Store | null; sha: string | null } } | null = null;
let lastStoreRead = 0;

/** Latest store from GitHub (cached 10 s), so password changes apply without a redeploy. */
export async function readStore(fresh = false): Promise<{ store: Store | null; sha: string | null }> {
  if (!fresh && cache && Date.now() - cache.at < 10_000) return cache.value;
  const key = storeKey();
  let value: { store: Store | null; sha: string | null } = { store: null, sha: null };
  if (key && canSave()) {
    try {
      const res = await gh(`${STORE_PATH}?ref=${encodeURIComponent(branch())}`);
      lastStoreRead = res.status;
      if (res.ok) {
        const body = (await res.json()) as { content: string; sha: string };
        value = { store: decryptStore(Buffer.from(body.content, 'base64').toString('utf8'), key), sha: body.sha };
      }
    } catch (err) {
      lastStoreRead = -1;
      console.error('admin store read failed', err instanceof Error ? err.message : err);
    }
  }
  cache = { at: Date.now(), value };
  return value;
}

export async function writeStore(store: Store, sha: string | null, message: string) {
  const key = storeKey();
  if (!key || !canSave()) throw new Error('Store not available');
  const res = await gh(STORE_PATH, {
    method: 'PUT',
    body: JSON.stringify({ message, content: Buffer.from(`${encryptStore(store, key)}\n`).toString('base64'), ...(sha ? { sha } : {}), branch: branch() }),
  });
  if (!res.ok) throw new GitHubError(res.status, 'save');
  cache = null;
}

/** Coarse set-up status for troubleshooting: never returns secrets or user details. */
export async function storeStatus() {
  const source = process.env.ADMIN_SECRET ? 'ADMIN_SECRET' : process.env.ADMIN_USERS ? 'ADMIN_USERS' : 'none';
  let envUsersValid = false;
  try { envUsersValid = Array.isArray(JSON.parse(process.env.ADMIN_USERS || 'x')); } catch { /* invalid */ }
  const { store, sha } = await readStore(true);
  return { keySource: source, envUsersValid, githubAccess: canSave(), storeFile: sha ? (store ? 'readable' : 'unreadable') : 'missing', storeUsers: store?.users?.length || 0, githubStatus: lastStoreRead, tokens: await tokenReport() };
}

/** Current store, created from the environment users the first time it is needed. */
async function editableStore() {
  const { store, sha } = await readStore(true);
  return { store: store || { users: envUsers(), resets: [] }, sha };
}

const tokenHash = (t: string) => createHash('sha256').update(t).digest('base64url');
export const PASSWORD_MIN = 10;

/** Creates a reset token (valid 30 minutes) if the email belongs to an admin. Returns the token or null. */
export async function createResetToken(email: string): Promise<string | null> {
  const { store, sha } = await editableStore();
  const user = store.users.find((u) => u.email.toLowerCase() === email.trim().toLowerCase());
  if (!user) return null;
  const token = randomBytes(32).toString('base64url');
  const now = Date.now();
  store.resets = (store.resets || []).filter((r) => r.exp > now && r.email !== user.email).concat({ email: user.email, tokenHash: tokenHash(token), exp: now + 30 * 60_000 });
  await writeStore(store, sha, 'Admin: password reset requested');
  return token;
}

export async function resetPassword(email: string, token: string, password: string): Promise<boolean> {
  const { store, sha } = await editableStore();
  const now = Date.now();
  const match = (store.resets || []).find((r) => r.email.toLowerCase() === email.trim().toLowerCase() && r.exp > now &&
    r.tokenHash.length === tokenHash(token).length && timingSafeEqual(Buffer.from(r.tokenHash), Buffer.from(tokenHash(token))));
  const user = match && store.users.find((u) => u.email === match.email);
  if (!user) return false;
  user.hash = hashPassword(password);
  user.updatedAt = new Date().toISOString();
  store.resets = store.resets.filter((r) => r !== match && r.exp > now);
  await writeStore(store, sha, 'Admin: password changed');
  return true;
}

export async function changePassword(session: Session, current: string, next: string): Promise<boolean> {
  const { store, sha } = await editableStore();
  const user = store.users.find((u) => u.email === session.email);
  if (!user || !verifyHash(current, user.hash)) return false;
  user.hash = hashPassword(next);
  user.updatedAt = new Date().toISOString();
  await writeStore(store, sha, 'Admin: password changed');
  return true;
}

/* ------------------------------------------------------------ GitHub storage */

const repo = () => process.env.GITHUB_REPO || 'kingkpono2/Vanokibs-whitelabel';
const branch = () => process.env.GITHUB_BRANCH || 'main';
/** Candidate GitHub tokens, by setting name. Whichever GitHub accepts is used (and remembered). */
const tokenCandidates = () =>
  (['GITHUB_TOKEN', 'GITHUB_USER', 'VANOKIBS_ADMIN', 'GH_TOKEN', 'GITHUB_PAT'] as const)
    .map((name) => ({ name, value: (process.env[name] || '').trim() }))
    .filter((t, i, all) => t.value.length > 20 && all.findIndex((x) => x.value === t.value) === i);
let workingToken: string | null = null;
const token = () => workingToken || tokenCandidates()[0]?.value || '';

const ghFetch = (path: string, tok: string, init?: RequestInit) =>
  fetch(`https://api.github.com/repos/${repo()}/contents/${path}`, {
    ...init,
    cache: 'no-store',
    headers: {
      Accept: 'application/vnd.github+json',
      Authorization: `Bearer ${tok}`,
      'X-GitHub-Api-Version': '2022-11-28',
      'User-Agent': 'vanokibs-admin',
      ...(init?.headers || {}),
    },
  });

/** Calls GitHub with the token that works; on 401 tries the other setting. */
async function gh(path: string, init?: RequestInit) {
  let res = await ghFetch(path, token(), init);
  if (res.status === 401) {
    for (const t of tokenCandidates()) {
      if (t.value === token()) continue;
      const retry = await ghFetch(path, t.value, init);
      if (retry.status !== 401) { workingToken = t.value; return retry; }
      res = retry;
    }
  }
  return res;
}

/** Which token settings GitHub accepts (names and status codes only). */
export async function tokenReport() {
  const out: Record<string, number> = {};
  for (const t of tokenCandidates()) {
    const r = await ghFetch(`src/content/editable.json?ref=${encodeURIComponent(branch())}`, t.value, { method: 'GET' });
    out[t.name] = r.status;
  }
  return out;
}

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
