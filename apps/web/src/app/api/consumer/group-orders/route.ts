/**
 * POST /api/consumer/group-orders
 * Proxies group order creation to VelociPizza backend.
 *
 * Note: Group order endpoints gracefully degrade — if Veloci backend
 * doesn't have group order support yet, the frontend falls back to demo mode.
 */
import { NextRequest, NextResponse } from 'next/server';
import { vpFetch } from '@/lib/velocipizza';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const token = req.cookies.get('enjoy_session')?.value;

    const data = await vpFetch<unknown>('/api/consumer/group-orders', {
      method: 'POST',
      body,
      token: token || undefined,
    });

    return NextResponse.json(data, { status: 201 });
  } catch (error: any) {
    console.error('[EnJoy /api/consumer/group-orders] Error:', error);
    return NextResponse.json(
      { error: error.message ?? 'Group orders not available' },
      { status: error.status ?? 503 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get('enjoy_session')?.value;
    if (!token) return NextResponse.json([], { status: 200 });

    const data = await vpFetch<unknown>('/api/consumer/group-orders', { token });
    return NextResponse.json(data);
  } catch {
    return NextResponse.json([], { status: 200 });
  }
}
