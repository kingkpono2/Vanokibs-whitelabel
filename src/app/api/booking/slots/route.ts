import { kvConfigured } from '@/lib/kv';
import { freeSlots, settings, takenSlots, timeLabel } from '@/lib/booking';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  if (!kvConfigured() || !settings.enabled) return Response.json({ configured: false });
  const date = new URL(req.url).searchParams.get('date') || '';
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) return Response.json({ message: 'Invalid date.' }, { status: 400 });
  try {
    const slots = freeSlots(date, await takenSlots()).map((t) => ({ start: t, label: timeLabel(t) }));
    return Response.json({ configured: true, date, slots, timezoneLabel: settings.timezoneLabel });
  } catch (err) {
    console.error('slots failed', err instanceof Error ? err.message : err);
    return Response.json({ message: 'Booking is temporarily unavailable.' }, { status: 502 });
  }
}
