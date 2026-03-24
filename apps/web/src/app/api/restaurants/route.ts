import { NextResponse } from 'next/server';
import { vpFetch } from '@/lib/velocipizza';

export async function GET() {
  try {
    const data = await vpFetch<{ success: boolean; restaurants: unknown[] }>('/api/tenants/public');
    return NextResponse.json({ restaurants: data.restaurants ?? [] });
  } catch {
    return NextResponse.json({ restaurants: [] }, { status: 502 });
  }
}
