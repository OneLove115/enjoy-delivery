import { NextRequest, NextResponse } from 'next/server';

const VP_URL = process.env.VELOCIPIZZA_API_URL || process.env.NEXT_PUBLIC_VP_DOMAIN || 'https://www.veloci.online';

/**
 * POST /api/consumer/checkout
 * Proxy to Veloci's Stripe checkout session creation.
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const res = await fetch(`${VP_URL}/api/consumer/checkout`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    const data = await res.json();
    if (!res.ok) {
      return NextResponse.json(data, { status: res.status });
    }

    return NextResponse.json(data);
  } catch (err: any) {
    console.error('[EnJoy checkout proxy] Error:', err);
    return NextResponse.json({ error: err.message || 'Checkout failed' }, { status: 500 });
  }
}
