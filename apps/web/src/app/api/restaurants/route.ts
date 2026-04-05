import { NextRequest, NextResponse } from 'next/server';
import { vpFetch } from '@/lib/velocipizza';

export async function GET(req: NextRequest) {
  try {
    // Detect visitor's country from Vercel/Cloudflare geo headers
    const country = req.headers.get('x-vercel-ip-country')
      || req.headers.get('cf-ipcountry')
      || null;

    // Pass country filter to only show local restaurants
    const query = country ? `?country=${country}` : '';
    const data = await vpFetch<{ success: boolean; restaurants: unknown[] }>(`/api/tenants/public${query}`);
    return NextResponse.json({ restaurants: data.restaurants ?? [], country });
  } catch {
    return NextResponse.json({ restaurants: [], country: null }, { status: 502 });
  }
}
