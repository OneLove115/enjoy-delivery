import { NextRequest, NextResponse } from 'next/server';
import crypto from 'node:crypto';

export async function GET(req: NextRequest) {
  const clientId = process.env.AUTH_GOOGLE_ID;
  if (!clientId) return NextResponse.json({ error: 'Google OAuth not configured' }, { status: 500 });

  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'https://enjoy.veloci.online';
  const redirectUri = `${appUrl}/api/auth/google/callback`;

  // CSRF protection: generate cryptographically random state
  const state = crypto.randomBytes(32).toString('hex');

  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    response_type: 'code',
    scope: 'openid email profile',
    access_type: 'offline',
    prompt: 'select_account',
    state,
  });

  const res = NextResponse.redirect(`https://accounts.google.com/o/oauth2/v2/auth?${params}`);
  res.cookies.set('oauth_state', state, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 600,
  });
  return res;
}
