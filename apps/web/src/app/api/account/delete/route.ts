import { NextRequest, NextResponse } from 'next/server';

const VP_API = process.env.VELOCIPIZZA_API_URL ?? 'https://www.veloci.online';

export async function DELETE(req: NextRequest) {
  const token = req.cookies.get('enjoy_session')?.value;
  if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const upstream = await fetch(`${VP_API}/api/consumer/me`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  });

  if (upstream.status === 204) {
    const res = new NextResponse(null, { status: 204 });
    res.cookies.set('enjoy_session', '', { maxAge: 0, path: '/' });
    return res;
  }

  const body = await upstream.json().catch(() => ({}));
  return NextResponse.json(
    { error: (body as { error?: string }).error ?? 'Deletion failed' },
    { status: upstream.status }
  );
}
