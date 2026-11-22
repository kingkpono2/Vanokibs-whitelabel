'use client';

import { useState } from 'react';

type Status = { state: 'idle' | 'sending' | 'sent' | 'error'; message?: string };

export function QuoteForm({ preselect = '', itemLabel = '', services }: { preselect?: string; itemLabel?: string; services: { slug: string; name: string }[] }) {
  const [status, setStatus] = useState<Status>({ state: 'idle' });

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());
    setStatus({ state: 'sending' });
    try {
      const res = await fetch('/api/contact', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
      const body = (await res.json().catch(() => ({}))) as { message?: string };
      if (res.ok) {
        setStatus({ state: 'sent' });
        form.reset();
      } else {
        setStatus({ state: 'error', message: body.message || 'Something went wrong. Please try again.' });
      }
    } catch {
      setStatus({ state: 'error', message: 'Network error. Please check your connection and try again.' });
    }
  }

  if (status.state === 'sent') {
    return (
      <div className="form-done" role="status">
        <h2>Thank you, we’ve got it.</h2>
        <p>A solutions architect will reply within one business day with next steps and, where possible, a price.</p>
      </div>
    );
  }

  return (
    <form className="quote-form" onSubmit={submit} noValidate={false}>
      {itemLabel && <p className="quote-form__item">You selected: <strong>{itemLabel}</strong></p>}
      <input type="hidden" name="item" value={itemLabel} />
      <div className="hp" aria-hidden="true"><label>Website <input name="website" tabIndex={-1} autoComplete="off" /></label></div>
      <div className="field-row">
        <label className="field">Full name<input name="name" required autoComplete="name" maxLength={120} /></label>
        <label className="field">Work email<input name="email" type="email" required autoComplete="email" maxLength={160} /></label>
      </div>
      <div className="field-row">
        <label className="field">Company<input name="company" autoComplete="organization" maxLength={160} /></label>
        <label className="field">Phone (optional)<input name="phone" type="tel" autoComplete="tel" maxLength={40} /></label>
      </div>
      <div className="field-row">
        <label className="field">What do you need?
          <select name="service" defaultValue={preselect}>
            <option value="">Not sure yet</option>
            {services.map((s) => <option key={s.slug} value={s.slug}>{s.name}</option>)}
          </select>
        </label>
        <label className="field">How would you like to work?
          <select name="engagement" defaultValue="">
            <option value="">Help me decide</option>
            <option value="subscription">Monthly subscription</option>
            <option value="project">One-time project</option>
            <option value="on-demand">As needed (hourly)</option>
          </select>
        </label>
      </div>
      <label className="field">Province
        <select name="province" defaultValue="">
          <option value="">Select…</option>
          {['Alberta', 'British Columbia', 'Manitoba', 'New Brunswick', 'Newfoundland and Labrador', 'Nova Scotia', 'Ontario', 'Prince Edward Island', 'Quebec', 'Saskatchewan', 'Northwest Territories', 'Nunavut', 'Yukon', 'Outside Canada'].map((p) => <option key={p}>{p}</option>)}
        </select>
      </label>
      <label className="field">Tell us about the project<textarea name="message" rows={5} required maxLength={4000} placeholder="What are you trying to achieve, and by when?" /></label>
      <label className="consent"><input type="checkbox" name="consent" value="yes" required /> I agree to be contacted about this request. We never sell your data (see our privacy policy).</label>
      {status.state === 'error' && <p className="form-error" role="alert">{status.message}</p>}
      <button className="btn btn-primary btn-lg" type="submit" disabled={status.state === 'sending'}>
        {status.state === 'sending' ? 'Sending…' : 'Send request'}
      </button>
    </form>
  );
}
