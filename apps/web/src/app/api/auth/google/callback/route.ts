import { NextRequest, NextResponse } from 'next/server';
import { vpFetch } from '@/lib/velocipizza';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const code = searchParams.get('code');
  const error = searchParams.get('error');
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'https://enjoy.veloci.online';

  if (error || !code) {
    return NextResponse.redirect(`${appUrl}/login?error=google_cancelled`);
  }

  try {
    const clientId = process.env.AUTH_GOOGLE_ID!;
    const clientSecret = process.env.AUTH_GOOGLE_SECRET!;
    const redirectUri = `${appUrl}/api/auth/google/callback`;

    // Exchange code for tokens
    const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        code,
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: redirectUri,
        grant_type: 'authorization_code',
      }),
    });

    if (!tokenRes.ok) {
      console.error('[google/callback] token exchange failed:', await tokenRes.text());
      return NextResponse.redirect(`${appUrl}/login?error=google_failed`);
    }

    const { access_token } = await tokenRes.json() as { access_token: string };

    // Get user profile from Google
    const profileRes = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
      headers: { Authorization: `Bearer ${access_token}` },
    });

    if (!profileRes.ok) {
      return NextResponse.redirect(`${appUrl}/login?error=google_failed`);
    }

    const profile = await profileRes.json() as { id: string; email: string; name: string };

    // Create or find user in VelociPizza backend
    const data = await vpFetch<{ token: string; user: { id: string; name: string; email: string } }>(
      '/api/consumer/auth/google-login',
      { method: 'POST', body: { email: profile.email, name: profile.name, googleId: profile.id } }
    );

    const res = NextResponse.redirect(`${appUrl}/discover`);
    res.cookies.set('enjoy_session', data.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7,
    });
    return res;
  } catch (err) {
    console.error('[google/callback] error:', err);
    return NextResponse.redirect(`${appUrl}/login?error=google_failed`);
  }
}
