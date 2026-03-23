/**
 * POST /api/consumer/orders
 * Proxies order submission to VelociPizza's order endpoint.
 * Body: { items: { menuItemId: string; quantity: number; unitPrice: string }[] }
 */
import { NextRequest, NextResponse } from 'next/server';

const VELOCIPIZZA_API = process.env.VELOCIPIZZA_API_URL || 'http://localhost:3000';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const res = await fetch(`${VELOCIPIZZA_API}/api/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      return NextResponse.json(
        { error: data?.message || 'Order failed' },
        { status: res.status }
      );
    }

    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    console.error('[EnJoy /api/consumer/orders] Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
