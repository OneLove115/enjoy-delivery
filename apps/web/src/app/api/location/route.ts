import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const latRaw = searchParams.get('lat');
  const lonRaw = searchParams.get('lon');
  if (!latRaw || !lonRaw) return NextResponse.json({ error: 'Missing lat/lon' }, { status: 400 });

  const lat = parseFloat(latRaw);
  const lon = parseFloat(lonRaw);
  if (!isFinite(lat) || lat < -90 || lat > 90 || !isFinite(lon) || lon < -180 || lon > 180) {
    return NextResponse.json({ error: 'Invalid coordinates' }, { status: 400 });
  }

  const qs = new URLSearchParams({ lat: String(lat), lon: String(lon), format: 'json' });
  const res = await fetch(`https://nominatim.openstreetmap.org/reverse?${qs}`, {
    headers: { 'User-Agent': 'EnJoy/1.0' },
  });
  const data = await res.json();
  return NextResponse.json(data);
}
