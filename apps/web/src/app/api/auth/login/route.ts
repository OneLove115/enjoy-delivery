import { NextRequest, NextResponse } from 'next/server';
import { vpFetch } from '@/lib/velocipizza';

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();
    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password required' }, { status: 400 });
    }

    const data = await vpFetch<{ token: string; user: { id: string; name: string; email: string } }>(
      '/api/consumer/auth/login',
      { method: 'POST', body: { email, password } }
    );

    const res = NextResponse.json({ user: data.user });
    res.cookies.set('enjoy_session', data.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7,
    });
    return res;
  } catch (err: any) {
    return NextResponse.json({ error: err.message ?? 'Login failed' }, { status: err.status ?? 500 });
  }
}
