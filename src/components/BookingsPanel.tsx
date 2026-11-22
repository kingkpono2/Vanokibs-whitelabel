'use client';

import { useCallback, useEffect, useState } from 'react';

type B = { id: string; start: number; when: string; name: string; email: string; company: string; phone: string; service: string; notes: string; status: string };
type Data = { configured: boolean; timezoneLabel?: string; bookings?: B[]; blockedDays?: string[]; blockedSlots?: { start: number; when: string }[]; message?: string };

export function BookingsPanel() {
  const [data, setData] = useState<Data | null>(null);
  const [msg, setMsg] = useState('');
  const [busy, setBusy] = useState(false);
  const [day, setDay] = useState('');
  const [slotDay, setSlotDay] = useState('');
  const [slotTime, setSlotTime] = useState('');

  const load = useCallback(async () => {
    const r = await fetch('/api/admin/bookings', { cache: 'no-store' });
    setData(await r.json());
  }, []);
  useEffect(() => { load(); }, [load]);

  async function act(body: Record<string, unknown>, confirmText?: string) {
    if (confirmText && !window.confirm(confirmText)) return;
    setBusy(true); setMsg('');
    const r = await fetch('/api/admin/bookings', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
    const b = await r.json().catch(() => ({}));
    setBusy(false);
    if (!r.ok) setMsg(b.message || 'Action failed.');
    await load();
  }

  if (!data) return <p className="muted">Loading bookings…</p>;
  if (!data.configured) {
    return (
      <div>
        <p className="form-error">Booking storage isn’t connected yet.</p>
        <p>In Vercel: <strong>Storage → Create Database → Upstash for Redis</strong> (free plan) → connect it to this project, then <strong>Redeploy</strong>. Bookings will then appear here.</p>
      </div>
    );
  }
  const now = Date.now();
  const upcoming = (data.bookings || []).filter((b) => b.start >= now - 3600_000);
  const past = (data.bookings || []).filter((b) => b.start < now - 3600_000).reverse();

  return (
    <div className="adm-fields">
      {msg && <p className="form-error">{msg}</p>}
      <h2 className="adm-h2">Upcoming bookings ({upcoming.length})</h2>
      {!upcoming.length && <p className="muted">No upcoming bookings.</p>}
      {upcoming.map((b) => (
        <div key={b.id} className="adm-item">
          <div className="adm-item__head">
            <strong>{b.when} ({data.timezoneLabel})</strong>
            <span className="adm-btns">
              <button className="btn btn-ghost btn-sm" disabled={busy} onClick={() => act({ action: 'cancel', id: b.id, notify: true }, `Cancel ${b.name}'s booking and email them?`)}>Cancel & notify</button>
              <button className="btn btn-ghost btn-sm" disabled={busy} onClick={() => act({ action: 'cancel', id: b.id, notify: false }, `Cancel ${b.name}'s booking without emailing?`)}>Cancel quietly</button>
            </span>
          </div>
          <p className="adm-booking">
            <strong>{b.name}</strong>{b.company ? `, ${b.company}` : ''} · <a href={`mailto:${b.email}`}>{b.email}</a>{b.phone ? ` · ${b.phone}` : ''}
            {b.service && <><br />Topic: {b.service}</>}
            {b.notes && <><br />Notes: {b.notes}</>}
          </p>
        </div>
      ))}

      <h2 className="adm-h2">Block time off</h2>
      <div className="field-row">
        <div className="adm-item">
          <label className="field">Block a whole day<input type="date" value={day} onChange={(e) => setDay(e.target.value)} /></label>
          <button className="btn btn-dark btn-sm mt-s" disabled={busy || !day} onClick={() => act({ action: 'block-day', date: day }).then(() => setDay(''))}>Block day</button>
        </div>
        <div className="adm-item">
          <div className="field-row">
            <label className="field">Block one time: day<input type="date" value={slotDay} onChange={(e) => setSlotDay(e.target.value)} /></label>
            <label className="field">Start time ({data.timezoneLabel})<input type="time" step={900} value={slotTime} onChange={(e) => setSlotTime(e.target.value)} /></label>
          </div>
          <button className="btn btn-dark btn-sm mt-s" disabled={busy || !slotDay || !slotTime} onClick={() => act({ action: 'block-slot', date: slotDay, time: slotTime }).then(() => setSlotTime(''))}>Block time</button>
        </div>
      </div>
      {(data.blockedDays?.length || data.blockedSlots?.length) ? (
        <ul className="adm-blocked">
          {data.blockedDays?.map((d) => <li key={d}>Whole day: {d} <button className="btn btn-ghost btn-sm" disabled={busy} onClick={() => act({ action: 'unblock-day', date: d })}>Unblock</button></li>)}
          {data.blockedSlots?.map((s) => <li key={s.start}>{s.when} <button className="btn btn-ghost btn-sm" disabled={busy} onClick={() => act({ action: 'unblock-slot', start: s.start })}>Unblock</button></li>)}
        </ul>
      ) : <p className="muted">Nothing blocked. Your weekly hours are set in “Booking settings”.</p>}

      {past.length > 0 && (
        <details className="adm-past">
          <summary>Past 30 days ({past.length})</summary>
          {past.map((b) => <p key={b.id} className="adm-booking muted">{b.when}: {b.name} ({b.email}){b.service ? `, ${b.service}` : ''}</p>)}
        </details>
      )}
    </div>
  );
}
