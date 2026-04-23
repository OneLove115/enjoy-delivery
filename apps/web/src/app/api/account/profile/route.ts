import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { vpFetch } from '@/lib/velocipizza';

const ProfilePatchSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  phone: z.string().max(30).optional(),
  preferredLanguage: z.string().max(10).optional(),
  marketingOptIn: z.boolean().optional(),
}).strict();

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
    const raw = await req.json();
    const parsed = ProfilePatchSchema.safeParse(raw);
    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid request', details: parsed.error.flatten() }, { status: 400 });
    }
    const updated = await vpFetch<unknown>('/api/consumer/profile', { method: 'PATCH', body: parsed.data, token });
    return NextResponse.json(updated);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: err.status ?? 500 });
  }
}
