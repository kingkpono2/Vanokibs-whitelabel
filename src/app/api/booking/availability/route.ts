import { kvConfigured } from '@/lib/kv';
import { monthAvailability, settings, takenSlots } from '@/lib/booking';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  if (!kvConfigured() || !settings.enabled) return Response.json({ configured: false });
  const month = new URL(req.url).searchParams.get('month') || '';
  if (!/^\d{4}-\d{2}$/.test(month)) return Response.json({ message: 'Invalid month.' }, { status: 400 });
  try {
    const days = monthAvailability(month, await takenSlots());
    return Response.json({ configured: true, days, timezoneLabel: settings.timezoneLabel, minutes: settings.meetingMinutes });
  } catch (err) {
    console.error('availability failed', err instanceof Error ? err.message : err);
    return Response.json({ message: 'Booking is temporarily unavailable.' }, { status: 502 });
  }
}
