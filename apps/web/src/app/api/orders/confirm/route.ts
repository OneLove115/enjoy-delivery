import { NextRequest, NextResponse } from 'next/server';

const VP_URL = process.env.VELOCIPIZZA_API_URL || process.env.NEXT_PUBLIC_VP_DOMAIN || 'https://www.veloci.online';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const res = await fetch(`${VP_URL}/api/consumer/orders/confirm`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch {
    return NextResponse.json({ error: 'Failed to confirm order' }, { status: 500 });
  }
}
