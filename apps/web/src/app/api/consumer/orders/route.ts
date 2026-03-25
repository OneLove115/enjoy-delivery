/**
 * POST /api/consumer/orders
 * Proxies order submission to VelociPizza's consumer order endpoint.
 * Body: { items: { menuItemId: string; quantity: number; unitPrice: string }[] }
 */
import { NextRequest, NextResponse } from 'next/server';
import { vpFetch } from '@/lib/velocipizza';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const token = req.cookies.get('enjoy_session')?.value;

    const data = await vpFetch<unknown>('/api/consumer/orders', {
      method: 'POST',
      body,
      token,
    });

    return NextResponse.json(data, { status: 201 });
  } catch (error: any) {
    console.error('[EnJoy /api/consumer/orders] Error:', error);
    return NextResponse.json({ error: error.message ?? 'Internal server error' }, { status: error.status ?? 500 });
  }
}
