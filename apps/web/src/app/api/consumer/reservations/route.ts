/**
 * POST /api/consumer/reservations
 * Proxy to Veloci POST /api/reservations (CORS-whitelisted on Veloci).
 */
import { NextRequest, NextResponse } from 'next/server';
import { vpFetch } from '@/lib/velocipizza';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    // Session token is optional — Veloci accepts tenantId in body for EnJoy calls
    const token = req.cookies.get('enjoy_session')?.value;

    const data = await vpFetch<unknown>('/api/reservations', {
      method: 'POST',
      body,
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
