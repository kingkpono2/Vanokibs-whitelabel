import { randomUUID } from 'node:crypto';
import content from '@/content/editable.json';
import { kv, kvConfigured, kvPipeline } from './kv';
import { db, mysqlConfigured } from './db';

/** Bookings are stored in MySQL when MYSQL_* is set (cPanel hosting), otherwise in Upstash Redis. */
export const storageConfigured = () => mysqlConfigured() || kvConfigured();
const useMysql = () => mysqlConfigured();

export const settings = content.booking;
const DAYS = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'] as const;

/* ------------------------------------------------------------- time zones */

/** Offset (ms) of `tz` from UTC at instant `ts`. */
function tzOffset(ts: number, tz: string) {
  const parts = new Intl.DateTimeFormat('en-US', { timeZone: tz, hourCycle: 'h23', year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit' })
    .formatToParts(new Date(ts))
    .reduce<Record<string, number>>((a, p) => (p.type !== 'literal' ? { ...a, [p.type]: Number(p.value) } : a), {});
  return Date.UTC(parts.year, parts.month - 1, parts.day, parts.hour, parts.minute, parts.second) - Math.floor(ts / 1000) * 1000;
}

/** "2026-12-01" + "09:30" in the business time zone -> UTC epoch ms (DST-safe). */
export function zonedToUtc(date: string, time: string, tz = settings.timezone) {
  const [y, m, d] = date.split('-').map(Number);
  const [h, mi] = time.split(':').map(Number);
  const guess = Date.UTC(y, m - 1, d, h, mi);
  const first = guess - tzOffset(guess, tz);
  return guess - tzOffset(first, tz);
}

/** YYYY-MM-DD of an instant, in the business time zone. */
export function localDate(ts: number, tz = settings.timezone) {
  return new Intl.DateTimeFormat('en-CA', { timeZone: tz, year: 'numeric', month: '2-digit', day: '2-digit' }).format(new Date(ts));
}

export function timeLabel(ts: number, tz = settings.timezone) {
  return new Intl.DateTimeFormat('en-CA', { timeZone: tz, hour: 'numeric', minute: '2-digit' }).format(new Date(ts));
}

export function longLabel(ts: number, tz = settings.timezone) {
  return new Intl.DateTimeFormat('en-CA', { timeZone: tz, weekday: 'long', month: 'long', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit' }).format(new Date(ts));
}

/* ------------------------------------------------------------- availability */

/** "09:00-12:00, 13:00-17:00" -> [["09:00","12:00"], ...] */
function ranges(spec: string) {
  return spec
    .split(',')
    .map((r) => r.trim().match(/^(\d{1,2}):(\d{2})\s*-\s*(\d{1,2}):(\d{2})$/))
    .filter((m): m is RegExpMatchArray => Boolean(m))
    .map((m) => [Number(m[1]) * 60 + Number(m[2]), Number(m[3]) * 60 + Number(m[4])] as const)
    .filter(([a, b]) => b > a);
}

const pad = (n: number) => String(n).padStart(2, '0');

/** All slot start times (UTC ms) the schedule offers on a local date, before removing booked/blocked ones. */
export function scheduleSlots(date: string): number[] {
  const [y, m, d] = date.split('-').map(Number);
  const weekday = DAYS[new Date(Date.UTC(y, m - 1, d)).getUTCDay()];
  const spec = (settings as Record<string, unknown>)[weekday];
  const len = Math.max(15, Number(settings.meetingMinutes) || 30);
  const out: number[] = [];
  for (const [start, end] of ranges(typeof spec === 'string' ? spec : '')) {
    for (let t = start; t + len <= end; t += len) out.push(zonedToUtc(date, `${pad(Math.floor(t / 60))}:${pad(t % 60)}`));
  }
  return out;
}

function windowBounds(now = Date.now()) {
  return { from: now + Number(settings.minNoticeHours) * 3600_000, to: now + Number(settings.daysAhead) * 86400_000 };
}

export type Taken = { booked: Set<number>; blockedSlots: Set<number>; blockedDays: Set<string> };

export async function takenSlots(): Promise<Taken> {
  const now = Date.now();
  if (useMysql()) {
    const pool = await db();
    const [rows] = await pool.query('SELECT active_slot FROM bookings WHERE active_slot BETWEEN ? AND ?', [now - 86400_000, now + 400 * 86400_000]);
    const blocked = await listBlocked();
    return {
      booked: new Set((rows as { active_slot: number }[]).map((r) => Number(r.active_slot))),
      blockedSlots: new Set(blocked.slots.map(Number)),
      blockedDays: new Set(blocked.days),
    };
  }
  const [booked, slots, days] = (await kvPipeline([
    ['ZRANGE', 'bk:index', now - 86400_000, now + 400 * 86400_000, 'BYSCORE'],
    ['SMEMBERS', 'bk:blocked:slots'],
    ['SMEMBERS', 'bk:blocked:days'],
  ])) as [string[], string[], string[]];
  return {
    booked: new Set(booked.map((m) => Number(m.split('|')[0]))),
    blockedSlots: new Set(slots.map(Number)),
    blockedDays: new Set(days),
  };
}

export function freeSlots(date: string, taken: Taken, now = Date.now()) {
  if (!settings.enabled || taken.blockedDays.has(date)) return [];
  const { from, to } = windowBounds(now);
  return scheduleSlots(date).filter((t) => t >= from && t <= to && !taken.booked.has(t) && !taken.blockedSlots.has(t));
}

/** Free-slot counts for each date in a month (YYYY-MM), in the business time zone. */
export function monthAvailability(month: string, taken: Taken) {
  const [y, m] = month.split('-').map(Number);
  const daysIn = new Date(Date.UTC(y, m, 0)).getUTCDate();
  const out: Record<string, number> = {};
  for (let d = 1; d <= daysIn; d++) {
    const date = `${y}-${pad(m)}-${pad(d)}`;
    const n = freeSlots(date, taken).length;
    if (n) out[date] = n;
  }
  return out;
}

/* ------------------------------------------------------------- bookings */

export type Booking = {
  id: string;
  start: number;
  end: number;
  name: string;
  email: string;
  company: string;
  phone: string;
  service: string;
  notes: string;
  createdAt: number;
  status: 'confirmed' | 'cancelled';
};

export async function createBooking(input: Omit<Booking, 'id' | 'end' | 'createdAt' | 'status'>): Promise<Booking | 'taken'> {
  const id = randomUUID();
  const booking: Booking = { ...input, id, end: input.start + Number(settings.meetingMinutes) * 60_000, createdAt: Date.now(), status: 'confirmed' };
  if (useMysql()) {
    const pool = await db();
    try {
      // active_slot is UNIQUE: a second request for the same time fails and gets "taken".
      await pool.query('INSERT INTO bookings (id, start_ms, active_slot, status, data, created_ms) VALUES (?, ?, ?, ?, ?, ?)',
        [id, booking.start, booking.start, booking.status, JSON.stringify(booking), booking.createdAt]);
    } catch (err) {
      if ((err as { code?: string }).code === 'ER_DUP_ENTRY') return 'taken';
      throw err;
    }
    return booking;
  }
  // Claim the slot atomically: a second request for the same time gets "taken".
  const claimed = await kv<string | null>('SET', `bk:slot:${input.start}`, id, 'NX', 'EX', 400 * 86400);
  if (claimed !== 'OK') return 'taken';
  await kvPipeline([
    ['SET', `bk:item:${id}`, JSON.stringify(booking), 'EX', 400 * 86400],
    ['ZADD', 'bk:index', input.start, `${input.start}|${id}`],
  ]);
  return booking;
}

export async function listBookings(daysBack = 30): Promise<Booking[]> {
  const now = Date.now();
  if (useMysql()) {
    const pool = await db();
    const [rows] = await pool.query("SELECT data FROM bookings WHERE status = 'confirmed' AND start_ms BETWEEN ? AND ? ORDER BY start_ms",
      [now - daysBack * 86400_000, now + 400 * 86400_000]);
    return (rows as { data: string }[]).map((r) => JSON.parse(r.data) as Booking);
  }
  const members = await kv<string[]>('ZRANGE', 'bk:index', now - daysBack * 86400_000, now + 400 * 86400_000, 'BYSCORE');
  if (!members.length) return [];
  const raw = (await kvPipeline(members.map((m) => ['GET', `bk:item:${m.split('|')[1]}`]))) as (string | null)[];
  return raw.filter(Boolean).map((r) => JSON.parse(r as string) as Booking);
}

export async function cancelBooking(id: string) {
  if (useMysql()) {
    const pool = await db();
    const [rows] = await pool.query("SELECT data FROM bookings WHERE id = ? AND status = 'confirmed'", [id]);
    const row = (rows as { data: string }[])[0];
    if (!row) return false;
    const b = JSON.parse(row.data) as Booking;
    b.status = 'cancelled';
    await pool.query("UPDATE bookings SET status = 'cancelled', active_slot = NULL, data = ? WHERE id = ?", [JSON.stringify(b), id]);
    return b;
  }
  const raw = await kv<string | null>('GET', `bk:item:${id}`);
  if (!raw) return false;
  const b = JSON.parse(raw) as Booking;
  b.status = 'cancelled';
  await kvPipeline([
    ['SET', `bk:item:${id}`, JSON.stringify(b), 'EX', 90 * 86400],
    ['ZREM', 'bk:index', `${b.start}|${id}`],
    ['DEL', `bk:slot:${b.start}`],
  ]);
  return b;
}

export async function setBlocked(kind: 'day' | 'slot', value: string, blocked: boolean) {
  if (useMysql()) {
    const pool = await db();
    if (blocked) await pool.query('INSERT IGNORE INTO booking_blocks (kind, value) VALUES (?, ?)', [kind, value]);
    else await pool.query('DELETE FROM booking_blocks WHERE kind = ? AND value = ?', [kind, value]);
    return;
  }
  const key = kind === 'day' ? 'bk:blocked:days' : 'bk:blocked:slots';
  await kv(blocked ? 'SADD' : 'SREM', key, value);
}

/** Blocked days (YYYY-MM-DD) and blocked slot start times (UTC ms, as strings). */
export async function listBlocked(): Promise<{ days: string[]; slots: string[] }> {
  if (useMysql()) {
    const pool = await db();
    const [rows] = await pool.query('SELECT kind, value FROM booking_blocks');
    const list = rows as { kind: string; value: string }[];
    return { days: list.filter((r) => r.kind === 'day').map((r) => r.value), slots: list.filter((r) => r.kind === 'slot').map((r) => r.value) };
  }
  const [days, slots] = (await kvPipeline([['SMEMBERS', 'bk:blocked:days'], ['SMEMBERS', 'bk:blocked:slots']])) as [string[], string[]];
  return { days, slots };
}

/* ------------------------------------------------------------- calendar file */

const icsDate = (ts: number) => new Date(ts).toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
const icsText = (s: string) => s.replace(/[\\,;]/g, (m) => `\\${m}`).replace(/\n/g, '\\n');

export function icsFor(b: Booking, organiser: string, title: string) {
  return [
    'BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//booking//EN', 'METHOD:REQUEST', 'BEGIN:VEVENT',
    `UID:${b.id}`, `DTSTAMP:${icsDate(Date.now())}`, `DTSTART:${icsDate(b.start)}`, `DTEND:${icsDate(b.end)}`,
    `SUMMARY:${icsText(title)}`, `DESCRIPTION:${icsText(`Consultation with ${organiser}. ${b.service ? `Topic: ${b.service}.` : ''}`)}`,
    'END:VEVENT', 'END:VCALENDAR',
  ].join('\r\n');
}
