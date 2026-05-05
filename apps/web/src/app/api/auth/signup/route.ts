import { NextRequest, NextResponse } from 'next/server';
import { vpFetch } from '@/lib/velocipizza';
import { rateLimit, rateLimitKey } from '@/lib/rate-limit';

export async function POST(req: NextRequest) {
  if (!rateLimit(rateLimitKey(req, 'auth:signup'), 3, 60)) {
    return NextResponse.json({ error: 'Too many attempts. Try again later.' }, { status: 429 });
  }

  try {
    const { name, email, password } = await req.json();
    if (!name || !email || !password) {
      return NextResponse.json({ error: 'Name, email and password required' }, { status: 400 });
    }

    const data = await vpFetch<{ token: string; user: { id: string; name: string; email: string } }>(
      '/api/consumer/auth/signup',
      { method: 'POST', body: { name, email, password } }
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
    return NextResponse.json({ error: err.message ?? 'Signup failed' }, { status: err.status ?? 500 });
  }
}
