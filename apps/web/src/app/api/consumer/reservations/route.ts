/**
 * POST /api/consumer/reservations
 * Proxy to Veloci POST /api/reservations (CORS-whitelisted on Veloci).
 */
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { vpFetch } from '@/lib/velocipizza';

const ReservationSchema = z.object({
  tenantId: z.string().uuid(),
  date: z.string().min(1).max(30),
  time: z.string().min(1).max(10),
  partySize: z.number().int().min(1).max(100),
  customerName: z.string().min(1).max(100),
  customerEmail: z.string().email().max(200),
  customerPhone: z.string().max(30).optional(),
  notes: z.string().max(500).optional(),
  tableId: z.string().uuid().optional(),
}).strict();

export async function POST(req: NextRequest) {
  try {
    const raw = await req.json();
    const parsed = ReservationSchema.safeParse(raw);
    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid request', details: parsed.error.flatten() }, { status: 400 });
    }
    // Session token is optional — Veloci accepts tenantId in body for EnJoy calls
    const token = req.cookies.get('enjoy_session')?.value;

    const data = await vpFetch<unknown>('/api/reservations', {
      method: 'POST',
      body: parsed.data,
      ...(token ? { token } : {}),
    });

    return NextResponse.json(data, { status: 201 });
  } catch (error: unknown) {
    const err = error as { message?: string; status?: number };
    console.error('[EnJoy /api/consumer/reservations POST] Error:', err);
    return NextResponse.json(
      { error: err.message ?? 'Internal server error' },
      { status: err.status ?? 500 },
    );
  }
}
