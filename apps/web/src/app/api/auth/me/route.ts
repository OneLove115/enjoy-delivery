import { NextRequest, NextResponse } from 'next/server';
import { vpFetch } from '@/lib/velocipizza';

export async function GET(req: NextRequest) {
  const token = req.cookies.get('enjoy_session')?.value;
  if (!token) return NextResponse.json(null, { status: 401 });
  try {
    const user = await vpFetch<{ id: string; name: string; email: string }>(
      '/api/consumer/auth/me',
      { token }
    );
    return NextResponse.json(user);
  } catch {
    return NextResponse.json(null, { status: 401 });
  }
}
