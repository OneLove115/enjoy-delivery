import { NextRequest, NextResponse } from "next/server";

/**
 * Security middleware for EnJoy consumer app.
 * Adds HTTP security headers to all responses.
 */

const ALLOWED_API_ORIGIN = "https://www.veloci.online";

function getCSP(): string {
  const directives = [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline' https://www.googletagmanager.com https://connect.facebook.net",
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: https: blob:",
    "font-src 'self' data:",
    "connect-src 'self' https://veloci.online https://www.veloci.online https://*.google-analytics.com https://www.googletagmanager.com https://connect.facebook.net",
    "frame-src 'none'",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "frame-ancestors 'none'",
  ];
  return directives.join("; ");
}

const SECURITY_HEADERS: Record<string, string> = {
  "X-Frame-Options": "DENY",
  "X-Content-Type-Options": "nosniff",
  "Referrer-Policy": "strict-origin-when-cross-origin",
  "Permissions-Policy": "camera=(), microphone=(), geolocation=(self), payment=()",
  "Strict-Transport-Security": "max-age=63072000; includeSubDomains; preload",
  "Content-Security-Policy": getCSP(),
  "X-XSS-Protection": "0",
};

export function middleware(request: NextRequest) {
  const response = NextResponse.next();

  // Apply security headers to all responses
  for (const [key, value] of Object.entries(SECURITY_HEADERS)) {
    response.headers.set(key, value);
  }

  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon\\.ico|icon\\.svg|logo-enjoy\\.png|public/).*)",
  ],
};
