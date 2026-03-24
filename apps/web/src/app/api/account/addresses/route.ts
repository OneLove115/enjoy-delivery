import { NextRequest, NextResponse } from 'next/server';
import { vpFetch } from '@/lib/velocipizza';

export async function GET(req: NextRequest) {
  const token = req.cookies.get('enjoy_session')?.value;
  if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  try {
    const addresses = await vpFetch<unknown[]>('/api/consumer/addresses', { token });
    return NextResponse.json(addresses);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: err.status ?? 500 });
  }
}

export async function POST(req: NextRequest) {
  const token = req.cookies.get('enjoy_session')?.value;
  if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  try {
    const body = await req.json();
    const address = await vpFetch<unknown>('/api/consumer/addresses', { method: 'POST', body, token });
    return NextResponse.json(address, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: err.status ?? 500 });
  }
}
