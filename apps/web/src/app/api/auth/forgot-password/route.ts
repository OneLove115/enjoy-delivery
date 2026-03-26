import { NextRequest, NextResponse } from 'next/server';
import { vpFetch } from '@/lib/velocipizza';

export async function POST(req: NextRequest) {
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
