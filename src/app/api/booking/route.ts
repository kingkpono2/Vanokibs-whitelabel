import { kvConfigured } from '@/lib/kv';
import { createBooking, freeSlots, icsFor, localDate, longLabel, settings, takenSlots } from '@/lib/booking';
import { notifyAddress, sendMail } from '@/lib/mail';
import { brand } from '@/content/brand';
import { serviceBySlug } from '@/content/services';

export const runtime = 'nodejs';
const recent = new Map<string, number[]>();
const clean = (v: unknown, max: number) => String(v ?? '').replace(/[\r\n]+/g, ' ').trim().slice(0, max);

export async function POST(req: Request) {
  if (!kvConfigured() || !settings.enabled) return Response.json({ message: 'Online booking is not available yet.' }, { status: 503 });
  const ip = (req.headers.get('x-forwarded-for') || '').split(',')[0].trim() || 'unknown';
  const now = Date.now();
  const hits = (recent.get(ip) || []).filter((t) => now - t < 3600_000);
  if (hits.length >= 5) return Response.json({ message: 'Too many bookings from this connection. Please try later.' }, { status: 429 });
  recent.set(ip, [...hits, now]);

  const raw = (await req.json().catch(() => ({}))) as Record<string, unknown>;
  if (raw.website) return Response.json({ ok: true }); // honeypot
  const start = Number(raw.start);
  const name = clean(raw.name, 120);
  const email = clean(raw.email, 160);
  if (!name || !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email) || !Number.isFinite(start) || raw.consent !== 'yes') {
    return Response.json({ message: 'Please add your name, a valid email, pick a time and give consent.' }, { status: 400 });
  }
  try {
    // Re-check on the server that this time is genuinely offered and free.
    if (!freeSlots(localDate(start), await takenSlots()).includes(start)) {
      return Response.json({ message: 'Sorry, that time is no longer available. Please pick another.' }, { status: 409 });
    }
    const serviceName = serviceBySlug(clean(raw.service, 80))?.name || '';
    const result = await createBooking({
      start, name, email,
      company: clean(raw.company, 160),
      phone: clean(raw.phone, 40),
      service: serviceName,
      notes: String(raw.notes ?? '').trim().slice(0, 2000),
    });
    if (result === 'taken') return Response.json({ message: 'Sorry, someone just booked that time. Please pick another.' }, { status: 409 });

    const when = `${longLabel(result.start)} (${settings.timezoneLabel})`;
    const title = `${brand.name} consultation`;
    const ics = icsFor(result, brand.name, title);
    const attach = [{ filename: 'consultation.ics', content: ics, contentType: 'text/calendar; charset=utf-8; method=REQUEST' }];
    try {
      await sendMail({ to: email, subject: `Your ${title}: ${when}`, text: `Hi ${name},\n\nYour ${settings.meetingMinutes}-minute consultation is booked for ${when}.\n${settings.confirmationText}\n\n${brand.name}\n`, attachments: attach });
      await sendMail({ to: await notifyAddress(), replyTo: `${name} <${email}>`, subject: `New booking: ${name}, ${when}`, text: `Name: ${name}\nEmail: ${email}\nCompany: ${result.company || '-'}\nPhone: ${result.phone || '-'}\nTopic: ${serviceName || '-'}\nWhen: ${when}\n\n${result.notes}\n`, attachments: attach });
    } catch (err) {
      console.error('booking email failed', err instanceof Error ? err.message : err);
    }
    return Response.json({ ok: true, id: result.id, start: result.start, end: result.end, when, ics });
  } catch (err) {
    console.error('booking failed', err instanceof Error ? err.message : err);
    return Response.json({ message: 'Booking failed. Please try again.' }, { status: 502 });
  }
}
