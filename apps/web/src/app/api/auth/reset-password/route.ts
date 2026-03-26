import { NextRequest, NextResponse } from 'next/server';
import { vpFetch } from '@/lib/velocipizza';

export async function POST(req: NextRequest) {
  try {
    const { token, password } = await req.json();
    if (!token || !password) {
      return NextResponse.json({ error: 'Token and password are required' }, { status: 400 });
    }
    const data = await vpFetch<{ success: boolean; message: string }>(
      '/api/consumer/auth/reset-password',
      { method: 'POST', body: { token, password } }
    );
    return NextResponse.json(data);
  } catch (err: any) {
    return NextResponse.json({ error: err.message ?? 'Failed' }, { status: err.status ?? 500 });
  }
}
