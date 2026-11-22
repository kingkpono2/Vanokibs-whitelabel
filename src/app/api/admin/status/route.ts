import { storeStatus } from '@/lib/admin';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/** Admin set-up health check (no secrets). */
export async function GET() {
  return Response.json(await storeStatus());
}
