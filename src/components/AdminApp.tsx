'use client';

import { useCallback, useEffect, useState } from 'react';
import { BookingsPanel } from './BookingsPanel';

type Json = string | number | boolean | Json[] | { [k: string]: Json };
type Obj = { [k: string]: Json };
type User = { email: string; role: 'owner' | 'support' };

const LOCKED = new Set(['id', 'slug', 'service']);
const LONG = new Set(['description', 'intro', 'heroText', 'a', 'blurb', 'hours']);
const LABELS: Record<string, string> = {
  heroTitle: 'Main heading', heroText: 'Intro text', heroNote: 'Small note under the buttons', faqs: 'Questions and answers', q: 'Question', a: 'Answer',
  annualMonthsCharged: 'Annual plan: months charged (12 = no discount)', payAsYouGoRate: 'Pay-as-you-go rate ($/hour)', emergencyRate: 'Emergency rate ($/hour)',
  monthly: 'Price per month ($)', hours: 'Hours', response: 'Response time', popular: 'Show as most popular', features: 'Features (one per line)',
  price: 'Price ($)', deposit: 'Deposit to start ($, 0 = pay in full)', includes: 'Included (one per line)', timeline: 'Timeline', hourBlocks: 'Prepaid hour blocks',
  validity: 'Valid for', short: 'Short summary', headline: 'Page heading', intro: 'Intro text', startingAt: 'Price note', outcomes: 'Outcomes (one per line)',
  showPrices: 'Show prices on the website (off = all prices hidden; pricing by consultation)',
  enabled: 'Online booking switched on', pageTitle: 'Booking page heading', pageText: 'Booking page intro', meetingMinutes: 'Meeting length (minutes)',
  timezone: 'Time zone (e.g. America/Toronto, America/Vancouver)', timezoneLabel: 'Time zone name shown to visitors', minNoticeHours: 'Minimum notice (hours)',
  daysAhead: 'How many days ahead people can book', monday: 'Monday hours', tuesday: 'Tuesday hours', wednesday: 'Wednesday hours', thursday: 'Thursday hours',
  friday: 'Friday hours', saturday: 'Saturday hours', sunday: 'Sunday hours', confirmationText: 'Message shown after booking',
  tagline: 'Tagline', description: 'Description', email: 'Contact email', phone: 'Contact phone',
};
const BRAND_LABELS: Record<string, string> = { name: 'Website / brand name (logo, titles)', legalName: 'Company name (legal operator)' };
let labelOverrides: Record<string, string> = {};
const label = (k: string) => labelOverrides[k] || LABELS[k] || k.charAt(0).toUpperCase() + k.slice(1).replace(/([A-Z])/g, ' $1').toLowerCase();

const TABS: { key: string; title: string; ownerOnly?: boolean }[] = [
  { key: 'bookings', title: 'Bookings' },
  { key: 'brand', title: 'Company details' },
  { key: 'home', title: 'Homepage' },
  { key: 'services', title: 'Services' },
  { key: 'booking', title: 'Booking settings' },
  { key: 'pricing', title: 'Prices', ownerOnly: true },
];

function Field({ name, value, onChange, readOnly }: { name: string; value: Json; onChange: (v: Json) => void; readOnly?: boolean }) {
  if (typeof value === 'boolean') {
    return <label className="adm-check"><input type="checkbox" checked={value} disabled={readOnly} onChange={(e) => onChange(e.target.checked)} /> {label(name)}</label>;
  }
  if (typeof value === 'number') {
    return <label className="field">{label(name)}<input type="number" min={0} step="1" value={value} readOnly={readOnly} onChange={(e) => onChange(e.target.value === '' ? 0 : Number(e.target.value))} /></label>;
  }
  if (typeof value === 'string') {
    const long = LONG.has(name) || value.length > 90;
    return (
      <label className="field">{label(name)}
        {long
          ? <textarea rows={Math.min(8, Math.max(3, Math.ceil(value.length / 80)))} value={value} readOnly={readOnly} onChange={(e) => onChange(e.target.value)} />
          : <input value={value} readOnly={readOnly} onChange={(e) => onChange(e.target.value)} />}
      </label>
    );
  }
  if (Array.isArray(value) && (value.length === 0 || typeof value[0] === 'string')) {
    return (
      <label className="field">{label(name)}
        <textarea rows={Math.max(3, value.length + 1)} value={(value as string[]).join('\n')} readOnly={readOnly} onChange={(e) => onChange(e.target.value.split('\n'))} />
      </label>
    );
  }
  if (Array.isArray(value)) {
    const items = value as Obj[];
    const fixed = items.length > 0 && Object.keys(items[0]).some((k) => LOCKED.has(k));
    return (
      <fieldset className="adm-list">
        <legend>{label(name)}</legend>
        {items.map((item, i) => (
          <div key={i} className="adm-item">
            <div className="adm-item__head">
              <strong>{String(item.name || item.q || `Item ${i + 1}`).slice(0, 70)}</strong>
              {!fixed && !readOnly && <button type="button" className="btn btn-ghost btn-sm" onClick={() => onChange(items.filter((_, j) => j !== i))}>Remove</button>}
            </div>
            <ObjectFields obj={item} readOnly={readOnly} onChange={(v) => onChange(items.map((x, j) => (j === i ? v : x)))} />
          </div>
        ))}
        {!fixed && !readOnly && (
          <button type="button" className="btn btn-ghost btn-sm" onClick={() => onChange([...items, Object.fromEntries(Object.entries(items[0] || { q: '', a: '' }).map(([k, v]) => [k, typeof v === 'number' ? 0 : typeof v === 'boolean' ? false : Array.isArray(v) ? [] : '']))])}>Add</button>
        )}
      </fieldset>
    );
  }
  return <ObjectFields obj={value as Obj} readOnly={readOnly} onChange={onChange} />;
}

function ObjectFields({ obj, onChange, readOnly }: { obj: Obj; onChange: (v: Obj) => void; readOnly?: boolean }) {
  return (
    <div className="adm-fields">
      {Object.entries(obj).filter(([k]) => !LOCKED.has(k)).map(([k, v]) => (
        <Field key={k} name={k} value={v} readOnly={readOnly} onChange={(nv) => onChange({ ...obj, [k]: nv })} />
      ))}
    </div>
  );
}

export function AdminApp() {
  const [user, setUser] = useState<User | null>(null);
  const [data, setData] = useState<Obj | null>(null);
  const [sha, setSha] = useState('');
  const [canSave, setCanSave] = useState(false);
  const [tab, setTab] = useState('bookings');
  const [msg, setMsg] = useState<{ kind: 'ok' | 'err'; text: string } | null>(null);
  const [busy, setBusy] = useState(false);
  const [dirty, setDirty] = useState(false);

  const load = useCallback(async () => {
    const res = await fetch('/api/admin/content', { cache: 'no-store' });
    if (res.status === 401) { setUser(null); return; }
    const body = await res.json();
    if (!res.ok) { setMsg({ kind: 'err', text: body.message }); return; }
    setUser(body.user); setData(body.data); setSha(body.sha || ''); setCanSave(body.canSave); setDirty(false);
  }, []);

  useEffect(() => { load(); }, [load]);
  useEffect(() => {
    const warn = (e: BeforeUnloadEvent) => { if (dirty) e.preventDefault(); };
    window.addEventListener('beforeunload', warn);
    return () => window.removeEventListener('beforeunload', warn);
  }, [dirty]);

  async function login(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBusy(true); setMsg(null);
    const f = new FormData(e.currentTarget);
    const res = await fetch('/api/admin/login', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email: f.get('email'), password: f.get('password') }) });
    const body = await res.json().catch(() => ({}));
    setBusy(false);
    if (!res.ok) { setMsg({ kind: 'err', text: body.message || 'Sign-in failed.' }); return; }
    await load();
  }

  async function logout() {
    await fetch('/api/admin/login', { method: 'DELETE' });
    setUser(null); setData(null);
  }

  async function save() {
    setBusy(true); setMsg(null);
    const res = await fetch('/api/admin/content', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ data, sha }) });
    const body = await res.json().catch(() => ({}));
    setBusy(false);
    if (!res.ok) { setMsg({ kind: 'err', text: body.message || 'Saving failed.' }); return; }
    setMsg({ kind: 'ok', text: 'Saved. The live site updates in about 1–2 minutes.' });
    await load();
  }

  if (!user || !data) {
    return (
      <section className="container adm">
        <form className="quote-form adm-login" onSubmit={login}>
          <h1>Admin sign in</h1>
          <label className="field">Email<input name="email" type="email" autoComplete="username" required /></label>
          <label className="field">Password<input name="password" type="password" autoComplete="current-password" required /></label>
          {msg && <p className={msg.kind === 'err' ? 'form-error' : 'adm-ok'} role="alert">{msg.text}</p>}
          <button className="btn btn-primary" disabled={busy}>{busy ? 'Signing in…' : 'Sign in'}</button>
        </form>
      </section>
    );
  }

  const tabs = TABS.filter((t) => !t.ownerOnly || user.role === 'owner');
  return (
    <section className="container adm">
      <div className="adm-bar">
        <div>
          <h1>Website content</h1>
          <p className="muted">Signed in as {user.email} ({user.role === 'owner' ? 'Owner: full access' : 'Support: text only, prices locked'})</p>
        </div>
        <div className="adm-actions">
          <button className="btn btn-primary" onClick={save} disabled={busy || !canSave || !dirty}>{busy ? 'Saving…' : dirty ? 'Save changes' : 'Saved'}</button>
          <button className="btn btn-ghost" onClick={logout}>Sign out</button>
        </div>
      </div>
      {!canSave && <p className="form-error">Saving is switched off until GITHUB_TOKEN is added in Vercel (see README).</p>}
      {msg && <p className={msg.kind === 'err' ? 'form-error' : 'adm-ok'} role="status">{msg.text}</p>}
      <div className="billing-toggle adm-tabs" role="tablist">
        {tabs.map((t) => <button key={t.key} role="tab" aria-selected={tab === t.key} className={tab === t.key ? 'is-on' : ''} onClick={() => setTab(t.key)}>{t.title}</button>)}
      </div>
      <div className="adm-panel">
        {(() => { labelOverrides = tab === 'brand' ? BRAND_LABELS : {}; return null; })()}
        {tab === 'bookings' ? <BookingsPanel /> : (
          <Field
            name={tab}
            value={data[tab]}
            onChange={(v) => { setData({ ...data, [tab]: v }); setDirty(true); }}
          />
        )}
        {tab === 'booking' && <p className="muted">Weekly hours use 24-hour times, e.g. <code>09:00-12:00, 13:00-17:00</code>. Leave a day empty to close it. Changes go live about 1–2 minutes after saving.</p>}
        {tab === 'services' && user.role !== 'owner' && <p className="muted">Price notes on services are managed by the owner and are not saved from this account.</p>}
      </div>
    </section>
  );
}
