import { NextRequest, NextResponse } from 'next/server';
import { vpFetch } from '@/lib/velocipizza';
import { rateLimit, rateLimitKey } from '@/lib/rate-limit';

export async function POST(req: NextRequest) {
  if (!rateLimit(rateLimitKey(req, 'auth:forgot'), 3, 300)) {
    return NextResponse.json({ error: 'Too many attempts. Try again later.' }, { status: 429 });
  }

  try {
    const { email } = await req.json();
    if (!email) return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    const data = await vpFetch<{ success: boolean; message: string }>(
      '/api/consumer/auth/forgot-password',
      { method: 'POST', body: { email } }
    );
    return NextResponse.json(data);
  } catch (err: any) {
    return NextResponse.json({ error: err.message ?? 'Failed' }, { status: err.status ?? 500 });
  }
}
