import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

const VP_URL = process.env.VELOCIPIZZA_API_URL || process.env.NEXT_PUBLIC_VP_DOMAIN || 'https://www.veloci.online';

const ConfirmOrderSchema = z.object({
  orderId: z.string().uuid(),
  paymentIntentId: z.string().max(200).optional(),
}).strict();

export async function POST(req: NextRequest) {
  const token = req.cookies.get('enjoy_session')?.value;
  if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const raw = await req.json();
    const parsed = ConfirmOrderSchema.safeParse(raw);
    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid request', details: parsed.error.flatten() }, { status: 400 });
    }
    const res = await fetch(`${VP_URL}/api/consumer/orders/confirm`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify(parsed.data),
    });
    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch {
    return NextResponse.json({ error: 'Failed to confirm order' }, { status: 500 });
  }
}
