import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { vpFetch } from '@/lib/velocipizza';

const AddressSchema = z.object({
  street: z.string().min(1).max(200),
  city: z.string().min(1).max(100),
  zip: z.string().min(1).max(20),
  country: z.string().max(2).optional(),
  label: z.string().max(50).optional(),
  instructions: z.string().max(500).optional(),
}).strict();

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
    const raw = await req.json();
    const parsed = AddressSchema.safeParse(raw);
    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid request', details: parsed.error.flatten() }, { status: 400 });
    }
    const address = await vpFetch<unknown>('/api/consumer/addresses', { method: 'POST', body: parsed.data, token });
    return NextResponse.json(address, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: err.status ?? 500 });
  }
}
