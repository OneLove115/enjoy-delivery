import { NextRequest, NextResponse } from 'next/server';
import { vpFetch } from '@/lib/velocipizza';

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  try {
    const data = await vpFetch<{ success: boolean; data: unknown }>(`/api/menu/public?subdomain=${encodeURIComponent(slug)}&available=true`);
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ data: { menu: [] } }, { status: 502 });
  }
}
