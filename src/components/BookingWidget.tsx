'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';

type Props = {
  today: string; // YYYY-MM-DD in the business time zone
  daysAhead: number;
  timezoneLabel: string;
  minutes: number;
  confirmationText: string;
  services: { slug: string; name: string }[];
  preselect?: string;
  item?: string;
};
type Slot = { start: number; label: string };
type Done = { when: string; start: number; end: number; ics: string };

const WEEKDAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const pad = (n: number) => String(n).padStart(2, '0');
const monthName = (ym: string) => new Date(`${ym}-01T12:00:00Z`).toLocaleDateString('en-CA', { month: 'long', year: 'numeric', timeZone: 'UTC' });
const addMonths = (ym: string, n: number) => {
  const [y, m] = ym.split('-').map(Number);
  const d = new Date(Date.UTC(y, m - 1 + n, 1));
  return `${d.getUTCFullYear()}-${pad(d.getUTCMonth() + 1)}`;
};
const gcalDate = (ts: number) => new Date(ts).toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');

export function BookingWidget({ today, daysAhead, timezoneLabel, minutes, confirmationText, services, preselect = '', item = '' }: Props) {
  const firstMonth = today.slice(0, 7);
  const lastMonth = useMemo(() => {
    const d = new Date(`${today}T12:00:00Z`);
    d.setUTCDate(d.getUTCDate() + daysAhead);
    return `${d.getUTCFullYear()}-${pad(d.getUTCMonth() + 1)}`;
  }, [today, daysAhead]);

  const [month, setMonth] = useState(firstMonth);
  const [days, setDays] = useState<Record<string, number>>({});
  const [state, setState] = useState<'loading' | 'ready' | 'off' | 'error'>('loading');
  const [date, setDate] = useState('');
  const [slots, setSlots] = useState<Slot[] | null>(null);
  const [slot, setSlot] = useState<Slot | null>(null);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');
  const [done, setDone] = useState<Done | null>(null);

  useEffect(() => {
    let live = true;
    setState('loading');
    fetch(`/api/booking/availability?month=${month}`, { cache: 'no-store' })
      .then((r) => r.json())
      .then((b) => {
        if (!live) return;
        if (b.configured === false) setState('off');
        else if (b.days) { setDays(b.days); setState('ready'); }
        else setState('error');
      })
      .catch(() => live && setState('error'));
    return () => { live = false; };
  }, [month]);

  async function pickDate(d: string) {
    setDate(d); setSlot(null); setSlots(null); setError('');
    const b = await fetch(`/api/booking/slots?date=${d}`, { cache: 'no-store' }).then((r) => r.json()).catch(() => null);
    setSlots(b?.slots || []);
  }

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!slot) return;
    setSending(true); setError('');
    const data = Object.fromEntries(new FormData(e.currentTarget).entries());
    const res = await fetch('/api/booking', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...data, start: slot.start }) });
    const body = await res.json().catch(() => ({}));
    setSending(false);
    if (!res.ok) {
      setError(body.message || 'Booking failed. Please try again.');
      if (res.status === 409) { setSlot(null); pickDate(date); }
      return;
    }
    setDone(body);
  }

  function downloadIcs() {
    if (!done) return;
    const url = URL.createObjectURL(new Blob([done.ics], { type: 'text/calendar' }));
    const a = document.createElement('a');
    a.href = url; a.download = 'consultation.ics'; a.click();
    URL.revokeObjectURL(url);
  }

  if (state === 'off') {
    return (
      <div className="book-card">
        <h2>Online booking is opening soon</h2>
        <p>Send us a message and we’ll arrange a time that suits you.</p>
        <Link href="/contact" className="btn btn-primary">Contact us</Link>
      </div>
    );
  }

  if (done) {
    const gcal = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent('Consultation')}&dates=${gcalDate(done.start)}/${gcalDate(done.end)}`;
    return (
      <div className="book-card book-done" role="status">
        <h2>You’re booked</h2>
        <p className="lead">{done.when}</p>
        <p>{confirmationText}</p>
        <div className="book-actions">
          <button type="button" className="btn btn-primary" onClick={downloadIcs}>Add to calendar (.ics)</button>
          <a className="btn btn-ghost" href={gcal} target="_blank" rel="noopener">Add to Google Calendar</a>
        </div>
      </div>
    );
  }

  // Calendar grid (Monday first)
  const [y, m] = month.split('-').map(Number);
  const firstDow = (new Date(Date.UTC(y, m - 1, 1)).getUTCDay() + 6) % 7;
  const daysIn = new Date(Date.UTC(y, m, 0)).getUTCDate();
  const cells: (string | null)[] = [...Array(firstDow).fill(null), ...Array.from({ length: daysIn }, (_, i) => `${month}-${pad(i + 1)}`)];

  return (
    <div className="book">
      <div className="book-card">
        <div className="cal-head">
          <button type="button" className="cal-nav" aria-label="Previous month" disabled={month <= firstMonth} onClick={() => setMonth(addMonths(month, -1))}>‹</button>
          <h2 aria-live="polite">{monthName(month)}</h2>
          <button type="button" className="cal-nav" aria-label="Next month" disabled={month >= lastMonth} onClick={() => setMonth(addMonths(month, 1))}>›</button>
        </div>
        <div className="cal-grid" role="grid" aria-busy={state === 'loading'}>
          {WEEKDAYS.map((d) => <span key={d} className="cal-dow" role="columnheader">{d}</span>)}
          {cells.map((d, i) => {
            if (!d) return <span key={`e${i}`} />;
            const free = days[d] || 0;
            return (
              <button key={d} type="button" role="gridcell" className={`cal-day${free ? ' is-free' : ''}${d === date ? ' is-on' : ''}${d === today ? ' is-today' : ''}`}
                disabled={!free} aria-label={`${d}${free ? `, ${free} times available` : ', unavailable'}`} aria-pressed={d === date} onClick={() => pickDate(d)}>
                {Number(d.slice(8))}
              </button>
            );
          })}
        </div>
        {state === 'loading' && <p className="muted cal-note">Loading availability…</p>}
        {state === 'error' && <p className="form-error">Couldn’t load availability. Please refresh, or <Link href="/contact">contact us</Link>.</p>}
        {state === 'ready' && !Object.keys(days).length && <p className="muted cal-note">No free times this month. Try the next month.</p>}
        <p className="muted cal-note">{minutes}-minute video call · times shown in {timezoneLabel}</p>
      </div>

      <div className="book-card">
        {!date && <p className="muted">Choose a day to see available times.</p>}
        {date && !slots && <p className="muted">Loading times…</p>}
        {date && slots && !slots.length && <p className="muted">No times left on this day. Please choose another.</p>}
        {date && slots && slots.length > 0 && (
          <>
            <h3>{new Date(`${date}T12:00:00Z`).toLocaleDateString('en-CA', { weekday: 'long', month: 'long', day: 'numeric', timeZone: 'UTC' })}</h3>
            <div className="slots">
              {slots.map((s) => (
                <button key={s.start} type="button" className={`slot${slot?.start === s.start ? ' is-on' : ''}`} aria-pressed={slot?.start === s.start} onClick={() => setSlot(s)}>{s.label}</button>
              ))}
            </div>
          </>
        )}
        {slot && (
          <form className="book-form" onSubmit={submit}>
            <p className="quote-form__item">Booking {slot.label}, {new Date(`${date}T12:00:00Z`).toLocaleDateString('en-CA', { month: 'long', day: 'numeric', timeZone: 'UTC' })} ({timezoneLabel})</p>
            <div className="hp" aria-hidden="true"><label>Website <input name="website" tabIndex={-1} autoComplete="off" /></label></div>
            <div className="field-row">
              <label className="field">Full name<input name="name" required autoComplete="name" maxLength={120} /></label>
              <label className="field">Work email<input name="email" type="email" required autoComplete="email" maxLength={160} /></label>
            </div>
            <div className="field-row">
              <label className="field">Company<input name="company" autoComplete="organization" maxLength={160} /></label>
              <label className="field">Phone (optional)<input name="phone" type="tel" autoComplete="tel" maxLength={40} /></label>
            </div>
            <label className="field">Topic
              <select name="service" defaultValue={preselect}>
                <option value="">General consultation</option>
                {services.map((s) => <option key={s.slug} value={s.slug}>{s.name}</option>)}
              </select>
            </label>
            <label className="field">Anything we should know? (optional)<textarea name="notes" rows={3} maxLength={2000} defaultValue={item ? `Interested in: ${item}` : ''} /></label>
            <label className="consent"><input type="checkbox" name="consent" value="yes" required /> I agree to be contacted about this booking.</label>
            {error && <p className="form-error" role="alert">{error}</p>}
            <button className="btn btn-primary btn-lg" disabled={sending}>{sending ? 'Booking…' : 'Confirm booking'}</button>
          </form>
        )}
        {!slot && error && <p className="form-error" role="alert">{error}</p>}
      </div>
    </div>
  );
}
