import { NextRequest, NextResponse } from 'next/server';
import { vpFetch } from '@/lib/velocipizza';

export async function GET(req: NextRequest) {
  const token = req.cookies.get('enjoy_session')?.value;
  if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  try {
    const profile = await vpFetch<unknown>('/api/consumer/profile', { token });
    return NextResponse.json(profile);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: err.status ?? 500 });
  }
}

export async function PATCH(req: NextRequest) {
  const token = req.cookies.get('enjoy_session')?.value;
  if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  try {
    const body = await req.json();
    const updated = await vpFetch<unknown>('/api/consumer/profile', { method: 'PATCH', body, token });
    return NextResponse.json(updated);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: err.status ?? 500 });
  }
}
