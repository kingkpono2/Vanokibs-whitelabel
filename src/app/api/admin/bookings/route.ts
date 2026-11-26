import { getSession } from '@/lib/admin';
import { cancelBooking, listBlocked, listBookings, longLabel, setBlocked, settings, storageConfigured, zonedToUtc } from '@/lib/booking';
import { sendMail } from '@/lib/mail';
import { brand } from '@/content/brand';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  if (!await getSession(req)) return Response.json({ message: 'Please sign in.' }, { status: 401 });
  if (!storageConfigured()) return Response.json({ configured: false });
  try {
    const [bookings, { days, slots }] = await Promise.all([listBookings(30), listBlocked()]);
    return Response.json({
      configured: true,
      timezoneLabel: settings.timezoneLabel,
      bookings: bookings.sort((a, b) => a.start - b.start).map((b) => ({ ...b, when: longLabel(b.start) })),
      blockedDays: days.sort(),
      blockedSlots: slots.map(Number).sort().map((t) => ({ start: t, when: longLabel(t) })),
    });
  } catch (err) {
    console.error('admin bookings failed', err instanceof Error ? err.message : err);
    return Response.json({ message: 'Could not load bookings.' }, { status: 502 });
  }
}

export async function POST(req: Request) {
  const session = await getSession(req);
  if (!session) return Response.json({ message: 'Please sign in.' }, { status: 401 });
  if (!storageConfigured()) return Response.json({ message: 'Booking storage is not set up.' }, { status: 503 });
  const body = (await req.json().catch(() => ({}))) as { action?: string; id?: string; date?: string; time?: string; start?: number; notify?: boolean };
  try {
    if (body.action === 'cancel' && body.id) {
      const b = await cancelBooking(String(body.id).slice(0, 64));
      if (!b) return Response.json({ message: 'Booking not found.' }, { status: 404 });
      if (body.notify) {
        await sendMail({ to: b.email, subject: `Your ${brand.name} consultation was cancelled`, text: `Hi ${b.name},\n\nYour consultation on ${longLabel(b.start)} (${settings.timezoneLabel}) has been cancelled. Please book a new time on our website or reply to this email.\n\n${brand.name}\n` }).catch(() => false);
      }
      return Response.json({ ok: true });
    }
    if ((body.action === 'block-day' || body.action === 'unblock-day') && /^\d{4}-\d{2}-\d{2}$/.test(String(body.date))) {
      await setBlocked('day', String(body.date), body.action === 'block-day');
      return Response.json({ ok: true });
    }
    if (body.action === 'block-slot' && /^\d{4}-\d{2}-\d{2}$/.test(String(body.date)) && /^\d{1,2}:\d{2}$/.test(String(body.time))) {
      await setBlocked('slot', String(zonedToUtc(String(body.date), String(body.time))), true);
      return Response.json({ ok: true });
    }
    if (body.action === 'unblock-slot' && Number.isFinite(Number(body.start))) {
      await setBlocked('slot', String(Number(body.start)), false);
      return Response.json({ ok: true });
    }
    return Response.json({ message: 'Unknown action.' }, { status: 400 });
  } catch (err) {
    console.error('admin booking action failed', err instanceof Error ? err.message : err);
    return Response.json({ message: 'Action failed. Please try again.' }, { status: 502 });
  }
}
