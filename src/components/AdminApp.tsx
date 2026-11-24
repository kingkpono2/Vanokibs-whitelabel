'use client';

import { useCallback, useEffect, useState } from 'react';
import { BookingsPanel } from './BookingsPanel';
import { Logo } from './Logo';

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

type Section = { key: string; title: string; group: 'Bookings' | 'Website'; desc: string; ownerOnly?: boolean };
const TABS: Section[] = [
  { key: 'bookings', title: 'Bookings', group: 'Bookings', desc: 'Upcoming consultations and the days or times you are not available.' },
  { key: 'booking', title: 'Booking settings', group: 'Bookings', desc: 'Weekly hours, meeting length, notice period and how far ahead people can book.' },
  { key: 'brand', title: 'Company details', group: 'Website', desc: 'Website name, company name, tagline and contact details shown across the site.' },
  { key: 'home', title: 'Homepage', group: 'Website', desc: 'Main heading, intro text and the questions and answers on the homepage.' },
  { key: 'services', title: 'Services', group: 'Website', desc: 'Service names, summaries and what each one includes.' },
  { key: 'pricing', title: 'Prices', group: 'Website', desc: 'Plans and prices, and whether prices are shown on the website.', ownerOnly: true },
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

function PasswordInput({ name, autoComplete, minLength }: { name: string; autoComplete: string; minLength?: number }) {
  const [show, setShow] = useState(false);
  return (
    <span className="pw-wrap">
      <input name={name} type={show ? 'text' : 'password'} autoComplete={autoComplete} minLength={minLength} required />
      <button type="button" className="pw-eye" onClick={() => setShow(!show)} aria-label={show ? 'Hide password' : 'Show password'} aria-pressed={show}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12z" />
          <circle cx="12" cy="12" r="3" />
          {show && <path d="M3 3l18 18" />}
        </svg>
      </button>
    </span>
  );
}

async function post(url: string, body: unknown) {
  const res = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
  return { ok: res.ok, body: (await res.json().catch(() => ({}))) as { message?: string } };
}

export function AdminApp({ brandName }: { brandName: string }) {
  const [user, setUser] = useState<User | null>(null);
  const [data, setData] = useState<Obj | null>(null);
  const [sha, setSha] = useState('');
  const [canSave, setCanSave] = useState(false);
  const [tab, setTab] = useState('bookings');
  const [msg, setMsg] = useState<{ kind: 'ok' | 'err'; text: string } | null>(null);
  const [busy, setBusy] = useState(false);
  const [dirty, setDirty] = useState(false);
  const [mode, setMode] = useState<'login' | 'forgot' | 'reset'>('login');
  const [reset, setReset] = useState<{ email: string; token: string } | null>(null);
  const [pwOpen, setPwOpen] = useState(false);

  const load = useCallback(async () => {
    const res = await fetch('/api/admin/content', { cache: 'no-store' });
    const body = await res.json();
    if (res.status === 401 || !body.user) { setUser(null); return; }
    if (!res.ok) { setMsg({ kind: 'err', text: body.message }); return; }
    setUser(body.user); setData(body.data); setSha(body.sha || ''); setCanSave(body.canSave); setDirty(false);
  }, []);

  useEffect(() => {
    const q = new URLSearchParams(window.location.search);
    if (q.get('reset') && q.get('email')) { setReset({ email: q.get('email')!, token: q.get('reset')! }); setMode('reset'); }
    load();
  }, [load]);

  async function forgot(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBusy(true); setMsg(null);
    const r = await post('/api/admin/password/forgot', { email: new FormData(e.currentTarget).get('email') });
    setBusy(false);
    setMsg({ kind: r.ok ? 'ok' : 'err', text: r.body.message || 'Something went wrong.' });
  }

  async function doReset(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    if (f.get('password') !== f.get('confirm')) { setMsg({ kind: 'err', text: 'The two passwords don’t match.' }); return; }
    setBusy(true); setMsg(null);
    const r = await post('/api/admin/password/reset', { ...reset, password: f.get('password') });
    setBusy(false);
    if (!r.ok) { setMsg({ kind: 'err', text: r.body.message || 'Couldn’t reset the password.' }); return; }
    window.history.replaceState(null, '', '/admin');
    setReset(null); setMode('login');
    setMsg({ kind: 'ok', text: 'Password changed. You can sign in now.' });
  }

  async function changePw(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const f = new FormData(form);
    if (f.get('next') !== f.get('confirm')) { setMsg({ kind: 'err', text: 'The two new passwords don’t match.' }); return; }
    setBusy(true); setMsg(null);
    const r = await post('/api/admin/password/change', { current: f.get('current'), next: f.get('next') });
    setBusy(false);
    if (!r.ok) { setMsg({ kind: 'err', text: r.body.message || 'Couldn’t change the password.' }); return; }
    form.reset(); setPwOpen(false);
    setMsg({ kind: 'ok', text: 'Password changed.' });
  }
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
    if (dirty && !window.confirm('You have unsaved changes. Sign out anyway?')) return;
    await fetch('/api/admin/login', { method: 'DELETE' });
    setUser(null); setData(null); setDirty(false); setPwOpen(false); setTab('bookings'); setMode('login');
    setMsg({ kind: 'ok', text: 'You have signed out.' });
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

  const topBar = (
    <header className="adm-top">
      <div className="adm-top__row">
        <a className="adm-top__brand" href="/admin"><Logo name={brandName} /><span className="adm-top__label">Admin</span></a>
        <nav className="adm-top__menu" aria-label="Account">
          <a href="/" className="adm-top__link" target="_blank" rel="noopener">View website <span aria-hidden="true">↗</span></a>
          {user && <>
            <span className="adm-top__user" title={user.email}><span className="adm-top__email">{user.email}</span><span className={`adm-role adm-role--${user.role}`}>{user.role === 'owner' ? 'Owner' : 'Support'}</span></span>
            <button type="button" className="adm-top__link" onClick={() => { setPwOpen(!pwOpen); setMsg(null); }} aria-expanded={pwOpen}><span className="adm-long">Change password</span><span className="adm-short">Password</span></button>
            <button type="button" className="btn btn-ghost adm-signout" onClick={logout}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" /><path d="M10 17l5-5-5-5" /><path d="M15 12H3" /></svg>
              Sign out</button>
          </>}
        </nav>
      </div>
    </header>
  );

  if (!user || !data) {
    return (
      <>{topBar}
      <section className="container adm">
        {mode === 'reset' && reset ? (
          <form className="quote-form adm-login" onSubmit={doReset}>
            <h1>Set a new password</h1>
            <p className="muted">For {reset.email}. Use at least 10 characters.</p>
            <label className="field">New password<PasswordInput name="password" autoComplete="new-password" minLength={10} /></label>
            <label className="field">Repeat new password<PasswordInput name="confirm" autoComplete="new-password" minLength={10} /></label>
            {msg && <p className={msg.kind === 'err' ? 'form-error' : 'adm-ok'} role="alert">{msg.text}</p>}
            <button className="btn btn-primary" disabled={busy}>{busy ? 'Saving…' : 'Save new password'}</button>
          </form>
        ) : mode === 'forgot' ? (
          <form className="quote-form adm-login" onSubmit={forgot}>
            <h1>Forgot password</h1>
            <p className="muted">Enter your admin email and we’ll send you a link to set a new password.</p>
            <label className="field">Email<input name="email" type="email" autoComplete="username" required /></label>
            {msg && <p className={msg.kind === 'err' ? 'form-error' : 'adm-ok'} role="alert">{msg.text}</p>}
            <button className="btn btn-primary" disabled={busy}>{busy ? 'Sending…' : 'Send reset link'}</button>
            <button type="button" className="adm-link" onClick={() => { setMode('login'); setMsg(null); }}>Back to sign in</button>
          </form>
        ) : (
          <form className="quote-form adm-login" onSubmit={login}>
            <h1>Admin sign in</h1>
            <label className="field">Email<input name="email" type="email" autoComplete="username" required /></label>
            <label className="field">Password<PasswordInput name="password" autoComplete="current-password" /></label>
            {msg && <p className={msg.kind === 'err' ? 'form-error' : 'adm-ok'} role="alert">{msg.text}</p>}
            <button className="btn btn-primary" disabled={busy}>{busy ? 'Signing in…' : 'Sign in'}</button>
            <button type="button" className="adm-link" onClick={() => { setMode('forgot'); setMsg(null); }}>Forgot password?</button>
          </form>
        )}
      </section></>
    );
  }

  const tabs = TABS.filter((t) => !t.ownerOnly || user.role === 'owner');
  const current = tabs.find((t) => t.key === tab) || tabs[0];
  const isContent = current.key !== 'bookings';
  const go = (key: string) => {
    if (dirty && !window.confirm('You have unsaved changes. Leave this section without saving?')) return;
    if (dirty) { void load(); }
    setTab(key); setMsg(null); window.scrollTo({ top: 0 });
  };
  return (
    <>
      {topBar}
      <div className="adm-layout">
        <nav className="adm-nav" aria-label="Admin sections">
          {(['Bookings', 'Website'] as const).map((g) => (
            <div className="adm-nav__group" key={g}>
              <p className="adm-nav__title">{g}</p>
              {tabs.filter((t) => t.group === g).map((t) => (
                <button key={t.key} type="button" className={`adm-nav__item${t.key === current.key ? ' is-on' : ''}`} aria-current={t.key === current.key ? 'page' : undefined} onClick={() => go(t.key)}>{t.title}</button>
              ))}
            </div>
          ))}
        </nav>
        <section className="adm-main">
          <header className="adm-head">
            <h1>{current.title}</h1>
            <p className="muted">{current.desc}</p>
          </header>
          {pwOpen && (
            <form className="adm-panel adm-pw" onSubmit={changePw}>
              <h2 className="adm-h2">Change your password</h2>
              <label className="field">Current password<PasswordInput name="current" autoComplete="current-password" /></label>
              <div className="field-row">
                <label className="field">New password (10+ characters)<PasswordInput name="next" autoComplete="new-password" minLength={10} /></label>
                <label className="field">Repeat new password<PasswordInput name="confirm" autoComplete="new-password" minLength={10} /></label>
              </div>
              <div className="adm-actions"><button className="btn btn-primary" disabled={busy}>{busy ? 'Saving…' : 'Save new password'}</button><button type="button" className="btn btn-ghost" onClick={() => setPwOpen(false)}>Cancel</button></div>
            </form>
          )}
          {!canSave && isContent && <p className="form-error">Saving is switched off until a GitHub token is added in Vercel (see README).</p>}
          {msg && <p className={msg.kind === 'err' ? 'form-error' : 'adm-ok'} role="status">{msg.text}</p>}
          <div className="adm-panel">
            {(() => { labelOverrides = current.key === 'brand' ? BRAND_LABELS : {}; return null; })()}
            {current.key === 'bookings' ? <BookingsPanel /> : (
              <Field name={current.key} value={data[current.key]} onChange={(v) => { setData({ ...data, [current.key]: v }); setDirty(true); }} />
            )}
            {current.key === 'booking' && <p className="muted">Weekly hours use 24-hour times, e.g. <code>09:00-12:00, 13:00-17:00</code>. Leave a day empty to close it.</p>}
            {current.key === 'services' && user.role !== 'owner' && <p className="muted">Price notes on services are managed by the owner and are not saved from this account.</p>}
          </div>
        </section>
      </div>
      {isContent && dirty && (
        <div className="adm-savebar" role="region" aria-label="Unsaved changes">
          <span>You have unsaved changes. They go live about 1–2 minutes after saving.</span>
          <div className="adm-actions">
            <button type="button" className="btn btn-ghost" onClick={() => { void load(); setMsg(null); }} disabled={busy}>Discard</button>
            <button type="button" className="btn btn-primary" onClick={save} disabled={busy || !canSave}>{busy ? 'Saving…' : 'Save changes'}</button>
          </div>
        </div>
      )}
    </>
  );
}
