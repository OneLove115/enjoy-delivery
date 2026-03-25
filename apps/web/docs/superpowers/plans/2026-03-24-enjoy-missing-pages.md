# EnJoy Missing Pages — Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build all missing EnJoy pages (marketing, auth, account, order tracking) and connect them to the VelociPizza B2B backend without leaking any API URLs or credentials to the frontend.

**Architecture:** All VelociPizza API calls go through Next.js server-side API routes (`/api/*`) that read `VELOCIPIZZA_API_URL` from `process.env` — never `NEXT_PUBLIC_*`. Auth uses httpOnly cookies so tokens never touch the browser JS context. Account pages check auth client-side by calling `/api/auth/me`.

**Tech Stack:** Next.js 15 App Router, TypeScript, Framer Motion, Outfit font, inline styles (existing pattern), httpOnly cookies for session, `VELOCIPIZZA_API_URL` env var.

---

## File Map

### New files to create

| File | Purpose |
|---|---|
| `src/lib/velocipizza.ts` | Server-side API client (reads env var, never imported in client) |
| `src/app/components/Nav.tsx` | Shared navbar (extracted from page.tsx, used across all pages) |
| `src/app/components/Footer.tsx` | Shared footer with all links (extracted + updated) |
| `src/app/riders/page.tsx` | Rider signup marketing page |
| `src/app/partners/page.tsx` | Restaurant partner signup page |
| `src/app/business/page.tsx` | Corporate ordering page |
| `src/app/how-it-works/page.tsx` | How EnJoy works explainer |
| `src/app/cities/page.tsx` | Available delivery cities |
| `src/app/promotions/page.tsx` | Active deals & promotions |
| `src/app/press/page.tsx` | Press / newsroom |
| `src/app/login/page.tsx` | Consumer login form |
| `src/app/signup/page.tsx` | Consumer signup form |
| `src/app/account/orders/page.tsx` | Past orders list |
| `src/app/account/profile/page.tsx` | User profile editor |
| `src/app/account/addresses/page.tsx` | Saved delivery addresses |
| `src/app/order/[id]/page.tsx` | Live order tracking |
| `src/app/api/auth/login/route.ts` | POST → proxies to VelociPizza consumer auth |
| `src/app/api/auth/signup/route.ts` | POST → proxies to VelociPizza consumer registration |
| `src/app/api/auth/logout/route.ts` | POST → clears session cookie |
| `src/app/api/auth/me/route.ts` | GET → validates session, returns user |
| `src/app/api/account/orders/route.ts` | GET → user's past orders from VelociPizza |
| `src/app/api/account/profile/route.ts` | GET/PATCH → user profile from VelociPizza |
| `src/app/api/account/addresses/route.ts` | GET/POST/DELETE → saved addresses |
| `src/app/api/orders/[id]/route.ts` | GET → single order status/details |

### Modified files

| File | Change |
|---|---|
| `src/app/page.tsx` | Use shared `<Nav>` + `<Footer>` instead of inline versions |
| `src/app/discover/page.tsx` | Use shared `<Nav>` instead of inline navbar |
| `.env.local` | Already has `VELOCIPIZZA_API_URL` — add `SESSION_SECRET` |

---

## Chunk 1: Shared Infrastructure

### Task 1: Server-side VelociPizza API client

**Files:**
- Create: `src/lib/velocipizza.ts`

- [ ] **Step 1: Create the client**

```typescript
// src/lib/velocipizza.ts
// SERVER-SIDE ONLY — never import in 'use client' files

const BASE = process.env.VELOCIPIZZA_API_URL;
if (!BASE) throw new Error('VELOCIPIZZA_API_URL is not set');

type FetchOptions = {
  method?: string;
  body?: unknown;
  token?: string;
};

export async function vpFetch<T>(path: string, opts: FetchOptions = {}): Promise<T> {
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (opts.token) headers['Authorization'] = `Bearer ${opts.token}`;

  const res = await fetch(`${BASE}${path}`, {
    method: opts.method ?? 'GET',
    headers,
    ...(opts.body ? { body: JSON.stringify(opts.body) } : {}),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: res.statusText }));
    throw Object.assign(new Error(err.message ?? 'VelociPizza API error'), { status: res.status });
  }
  return res.json() as Promise<T>;
}
```

- [ ] **Step 2: Add SESSION_SECRET to .env.local**

```bash
# append to .env.local
echo 'SESSION_SECRET=enjoy-local-dev-secret-change-in-prod' >> apps/web/.env.local
```

- [ ] **Step 3: Commit**

```bash
cd /c/Users/xxx/EnJoy
git add apps/web/src/lib/velocipizza.ts apps/web/.env.local
git commit -m "feat: add server-side VelociPizza API client and session secret"
```

---

### Task 2: Shared Nav component

**Files:**
- Create: `src/app/components/Nav.tsx`

- [ ] **Step 1: Extract Nav from page.tsx into shared component**

```typescript
// src/app/components/Nav.tsx
'use client';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';

const PURPLE = '#5A31F4';
const PINK = '#FF0080';

export function Nav() {
  const [user, setUser] = useState<{ name: string } | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    fetch('/api/auth/me')
      .then(r => r.ok ? r.json() : null)
      .then(d => setUser(d))
      .catch(() => null);
  }, []);

  return (
    <nav style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100, height: 70,
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '0 40px', background: 'rgba(10,10,15,0.85)',
      backdropFilter: 'blur(20px)', borderBottom: '1px solid rgba(255,255,255,0.06)'
    }}>
      {/* Logo */}
      <Link href="/" style={{ textDecoration: 'none' }}>
        <span style={{ fontSize: 22, fontWeight: 900, color: 'white' }}>
          En<span style={{ background: `linear-gradient(135deg,${PURPLE},${PINK})`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Joy</span>
        </span>
      </Link>

      {/* Center links */}
      <div style={{ display: 'flex', gap: 28, alignItems: 'center' }}>
        {[
          { href: '/discover', label: 'Order' },
          { href: '/how-it-works', label: 'How it works' },
          { href: '/riders', label: 'Ride with us' },
          { href: '/partners', label: 'Partner' },
          { href: '/business', label: 'Business' },
        ].map(l => (
          <Link key={l.href} href={l.href} style={{
            color: pathname === l.href ? 'white' : 'rgba(255,255,255,0.55)',
            fontSize: 14, fontWeight: 600, textDecoration: 'none',
            borderBottom: pathname === l.href ? `2px solid ${PINK}` : '2px solid transparent',
            paddingBottom: 2, transition: 'color 0.2s'
          }}>{l.label}</Link>
        ))}
      </div>

      {/* Right: auth */}
      <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
        {user ? (
          <>
            <Link href="/account/orders" style={{ color: 'rgba(255,255,255,0.7)', fontSize: 14, fontWeight: 600, textDecoration: 'none' }}>
              👤 {user.name}
            </Link>
            <button onClick={() => fetch('/api/auth/logout', { method: 'POST' }).then(() => { setUser(null); window.location.href = '/'; })}
              style={{ background: 'rgba(255,255,255,0.06)', border: 'none', color: 'rgba(255,255,255,0.5)', padding: '8px 16px', borderRadius: 10, cursor: 'pointer', fontSize: 13, fontWeight: 600 }}>
              Sign out
            </button>
          </>
        ) : (
          <>
            <Link href="/login" style={{ color: 'rgba(255,255,255,0.7)', fontSize: 14, fontWeight: 600, textDecoration: 'none' }}>Sign in</Link>
            <Link href="/signup" style={{ background: `linear-gradient(135deg,${PURPLE},${PINK})`, color: 'white', padding: '9px 20px', borderRadius: 10, fontSize: 14, fontWeight: 700, textDecoration: 'none' }}>
              Get started
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add apps/web/src/app/components/Nav.tsx
git commit -m "feat: add shared Nav component with auth state and nav links"
```

---

### Task 3: Shared Footer component

**Files:**
- Create: `src/app/components/Footer.tsx`

- [ ] **Step 1: Create shared Footer with all links**

```typescript
// src/app/components/Footer.tsx
'use client';
import Link from 'next/link';

const PURPLE = '#5A31F4';
const PINK = '#FF0080';

const sections = {
  'Order': [
    { label: 'Discover restaurants', href: '/discover' },
    { label: 'How it works', href: '/how-it-works' },
    { label: 'Promotions', href: '/promotions' },
    { label: 'Cities', href: '/cities' },
  ],
  'Partners': [
    { label: 'Add your restaurant', href: '/partners' },
    { label: 'Ride with us', href: '/riders' },
    { label: 'Business orders', href: '/business' },
  ],
  'Company': [
    { label: 'About us', href: '/about' },
    { label: 'Careers', href: '/careers' },
    { label: 'Blog', href: '/blog' },
    { label: 'Press', href: '/press' },
  ],
  'Support': [
    { label: 'Help center', href: '/help' },
    { label: 'Contact', href: '/contact' },
    { label: 'FAQ', href: '/faq' },
  ],
  'Legal': [
    { label: 'Privacy', href: '/privacy' },
    { label: 'Terms', href: '/terms' },
    { label: 'Cookies', href: '/cookies' },
  ],
};

export function Footer() {
  return (
    <footer style={{ padding: '60px 60px 32px', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 40, flexWrap: 'wrap', gap: 40 }}>
        <div style={{ maxWidth: 260 }}>
          <span style={{ fontSize: 22, fontWeight: 900, color: 'white' }}>
            En<span style={{ background: `linear-gradient(135deg,${PURPLE},${PINK})`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Joy</span>
          </span>
          <p style={{ color: 'rgba(255,255,255,0.4)', marginTop: 12, fontSize: 14, lineHeight: 1.6 }}>
            Elite gourmet delivery. Royally crafted, impeccably delivered.
          </p>
          <div style={{ display: 'flex', gap: 12, marginTop: 20 }}>
            {['🍎', '🤖'].map((icon, i) => (
              <div key={i} style={{ width: 40, height: 40, background: 'rgba(255,255,255,0.06)', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', fontSize: 18 }}>{icon}</div>
            ))}
          </div>
        </div>
        {Object.entries(sections).map(([title, links]) => (
          <div key={title}>
            <h4 style={{ color: 'white', fontWeight: 800, marginBottom: 16, fontSize: 13, textTransform: 'uppercase', letterSpacing: 1 }}>{title}</h4>
            {links.map(l => (
              <Link key={l.href} href={l.href} style={{ display: 'block', color: 'rgba(255,255,255,0.35)', fontSize: 14, marginBottom: 10, textDecoration: 'none', transition: 'color 0.2s' }}>
                {l.label}
              </Link>
            ))}
          </div>
        ))}
      </div>
      <div style={{ textAlign: 'center', color: 'rgba(255,255,255,0.2)', fontSize: 13, paddingTop: 24, borderTop: '1px solid rgba(255,255,255,0.04)' }}>
        © 2026 EnJoy. All rights reserved. Royal Delivery Worldwide.
      </div>
    </footer>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add apps/web/src/app/components/Footer.tsx
git commit -m "feat: add shared Footer with all section links"
```

---

## Chunk 2: Auth API Routes

### Task 4: Login API route

**Files:**
- Create: `src/app/api/auth/login/route.ts`

- [ ] **Step 1: Create login route**

```typescript
// src/app/api/auth/login/route.ts
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
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });
    return res;
  } catch (err: any) {
    return NextResponse.json({ error: err.message ?? 'Login failed' }, { status: err.status ?? 500 });
  }
}
```

- [ ] **Step 2: Commit**

```bash
git add apps/web/src/app/api/auth/login/route.ts
git commit -m "feat: add consumer login API route with httpOnly session cookie"
```

---

### Task 5: Signup, Logout, and Me API routes

**Files:**
- Create: `src/app/api/auth/signup/route.ts`
- Create: `src/app/api/auth/logout/route.ts`
- Create: `src/app/api/auth/me/route.ts`

- [ ] **Step 1: Create signup route**

```typescript
// src/app/api/auth/signup/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { vpFetch } from '@/lib/velocipizza';

export async function POST(req: NextRequest) {
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
```

- [ ] **Step 2: Create logout route**

```typescript
// src/app/api/auth/logout/route.ts
import { NextResponse } from 'next/server';

export async function POST() {
  const res = NextResponse.json({ ok: true });
  res.cookies.set('enjoy_session', '', { maxAge: 0, path: '/' });
  return res;
}
```

- [ ] **Step 3: Create me route**

```typescript
// src/app/api/auth/me/route.ts
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
```

- [ ] **Step 4: Commit**

```bash
git add apps/web/src/app/api/auth/
git commit -m "feat: add signup, logout, and me auth API routes"
```

---

## Chunk 3: Login & Signup Pages

### Task 6: Login page

**Files:**
- Create: `src/app/login/page.tsx`

- [ ] **Step 1: Create login page**

```typescript
// src/app/login/page.tsx
'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';

const PURPLE = '#5A31F4';
const PINK = '#FF0080';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || 'Login failed'); return; }
      router.push('/discover');
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const input = { width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, padding: '14px 18px', color: 'white', fontSize: 15, outline: 'none', fontFamily: 'Outfit, sans-serif', boxSizing: 'border-box' as const };

  return (
    <div style={{ background: '#0A0A0F', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Outfit, sans-serif', color: 'white' }}>
      <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 50% 30%, rgba(90,49,244,0.12) 0%, transparent 60%)' }} />
      <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}
        style={{ width: '100%', maxWidth: 440, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 24, padding: '48px 40px', position: 'relative', zIndex: 1 }}>
        {/* Logo */}
        <Link href="/" style={{ textDecoration: 'none', display: 'block', textAlign: 'center', marginBottom: 32 }}>
          <span style={{ fontSize: 28, fontWeight: 900 }}>En<span style={{ background: `linear-gradient(135deg,${PURPLE},${PINK})`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Joy</span></span>
        </Link>
        <h1 style={{ fontSize: 26, fontWeight: 900, textAlign: 'center', marginBottom: 8 }}>Welcome back</h1>
        <p style={{ color: 'rgba(255,255,255,0.45)', textAlign: 'center', fontSize: 14, marginBottom: 32 }}>Sign in to your EnJoy account</p>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <input type="email" placeholder="Email address" value={email} onChange={e => setEmail(e.target.value)} required style={input} />
          <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} required style={input} />
          {error && <p style={{ color: '#FF4444', fontSize: 13, textAlign: 'center', margin: 0 }}>{error}</p>}
          <button type="submit" disabled={loading}
            style={{ background: `linear-gradient(135deg,${PURPLE},${PINK})`, color: 'white', border: 'none', borderRadius: 12, padding: '15px 0', fontSize: 16, fontWeight: 800, cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.7 : 1, marginTop: 8 }}>
            {loading ? 'Signing in...' : 'Sign in'}
          </button>
        </form>

        <p style={{ textAlign: 'center', color: 'rgba(255,255,255,0.35)', fontSize: 14, marginTop: 24 }}>
          Don't have an account?{' '}
          <Link href="/signup" style={{ color: PURPLE, fontWeight: 700, textDecoration: 'none' }}>Sign up free</Link>
        </p>
      </motion.div>
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add apps/web/src/app/login/page.tsx
git commit -m "feat: add consumer login page"
```

---

### Task 7: Signup page

**Files:**
- Create: `src/app/signup/page.tsx`

- [ ] **Step 1: Create signup page**

```typescript
// src/app/signup/page.tsx
'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';

const PURPLE = '#5A31F4';
const PINK = '#FF0080';

export default function SignupPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || 'Signup failed'); return; }
      router.push('/discover');
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const input = { width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, padding: '14px 18px', color: 'white', fontSize: 15, outline: 'none', fontFamily: 'Outfit, sans-serif', boxSizing: 'border-box' as const };

  return (
    <div style={{ background: '#0A0A0F', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Outfit, sans-serif', color: 'white' }}>
      <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 50% 30%, rgba(255,0,128,0.08) 0%, transparent 60%)' }} />
      <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}
        style={{ width: '100%', maxWidth: 440, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 24, padding: '48px 40px', position: 'relative', zIndex: 1 }}>
        <Link href="/" style={{ textDecoration: 'none', display: 'block', textAlign: 'center', marginBottom: 32 }}>
          <span style={{ fontSize: 28, fontWeight: 900 }}>En<span style={{ background: `linear-gradient(135deg,${PURPLE},${PINK})`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Joy</span></span>
        </Link>
        <h1 style={{ fontSize: 26, fontWeight: 900, textAlign: 'center', marginBottom: 8 }}>Start your royal journey</h1>
        <p style={{ color: 'rgba(255,255,255,0.45)', textAlign: 'center', fontSize: 14, marginBottom: 32 }}>Create your free EnJoy account</p>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <input type="text" placeholder="Full name" value={name} onChange={e => setName(e.target.value)} required style={input} />
          <input type="email" placeholder="Email address" value={email} onChange={e => setEmail(e.target.value)} required style={input} />
          <input type="password" placeholder="Password (min 8 characters)" value={password} onChange={e => setPassword(e.target.value)} required minLength={8} style={input} />
          {error && <p style={{ color: '#FF4444', fontSize: 13, textAlign: 'center', margin: 0 }}>{error}</p>}
          <button type="submit" disabled={loading}
            style={{ background: `linear-gradient(135deg,${PURPLE},${PINK})`, color: 'white', border: 'none', borderRadius: 12, padding: '15px 0', fontSize: 16, fontWeight: 800, cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.7 : 1, marginTop: 8 }}>
            {loading ? 'Creating account...' : 'Create account — it\'s free'}
          </button>
        </form>

        <p style={{ textAlign: 'center', color: 'rgba(255,255,255,0.35)', fontSize: 13, marginTop: 16 }}>
          By signing up you agree to our{' '}
          <Link href="/terms" style={{ color: PURPLE, textDecoration: 'none' }}>Terms</Link> and{' '}
          <Link href="/privacy" style={{ color: PURPLE, textDecoration: 'none' }}>Privacy Policy</Link>.
        </p>
        <p style={{ textAlign: 'center', color: 'rgba(255,255,255,0.35)', fontSize: 14, marginTop: 16 }}>
          Already have an account?{' '}
          <Link href="/login" style={{ color: PURPLE, fontWeight: 700, textDecoration: 'none' }}>Sign in</Link>
        </p>
      </motion.div>
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add apps/web/src/app/signup/page.tsx
git commit -m "feat: add consumer signup page"
```

---

## Chunk 4: Marketing Pages

### Task 8: Riders page

**Files:**
- Create: `src/app/riders/page.tsx`

- [ ] **Step 1: Create riders page**

```typescript
// src/app/riders/page.tsx
'use client';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Nav } from '../components/Nav';
import { Footer } from '../components/Footer';

const PURPLE = '#5A31F4';
const PINK = '#FF0080';
const PAGE_BG = '#0A0A0F';

const perks = [
  { icon: '💰', title: 'Earn your way', text: 'Set your own hours. Top riders earn €1,200+ per month on their own schedule.' },
  { icon: '🚲', title: 'Ride anything', text: 'Bike, scooter, car — any vehicle works. We supply the iconic purple delivery bag.' },
  { icon: '📱', title: 'Simple app', text: 'Accept orders with one tap. Real-time navigation built in. Instant weekly pay.' },
  { icon: '🛡️', title: 'Fully insured', text: 'Comprehensive delivery insurance included from your first order.' },
];

const steps = [
  { num: '01', title: 'Sign up online', text: 'Fill in your details and upload your ID. Takes 5 minutes.' },
  { num: '02', title: 'Get approved', text: 'We verify your account within 24 hours.' },
  { num: '03', title: 'Start earning', text: 'Download the rider app, pick your first order, and go.' },
];

export default function RidersPage() {
  return (
    <div style={{ background: PAGE_BG, minHeight: '100vh', color: 'white', fontFamily: 'Outfit, sans-serif' }}>
      <Nav />
      {/* Hero */}
      <section style={{ minHeight: '80vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '100px 40px 60px', textAlign: 'center', position: 'relative' }}>
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 50% 40%, rgba(90,49,244,0.12) 0%, transparent 65%)' }} />
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} style={{ position: 'relative', zIndex: 1, maxWidth: 700 }}>
          <div style={{ display: 'inline-block', background: 'rgba(90,49,244,0.15)', border: `1px solid ${PURPLE}40`, borderRadius: 40, padding: '6px 18px', fontSize: 13, fontWeight: 700, color: PURPLE, marginBottom: 24 }}>
            🚲 Deliver with EnJoy
          </div>
          <h1 style={{ fontSize: 62, fontWeight: 950, lineHeight: 1.05, marginBottom: 24, letterSpacing: -2 }}>
            Ride on your<br />
            <span style={{ background: `linear-gradient(135deg,${PURPLE},${PINK})`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>own terms</span>
          </h1>
          <p style={{ fontSize: 20, color: 'rgba(255,255,255,0.55)', marginBottom: 40, lineHeight: 1.6 }}>
            Join 5,000+ riders delivering for EnJoy. Flexible hours, instant pay, and the most iconic bag in the city.
          </p>
          <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/signup" style={{ background: `linear-gradient(135deg,${PURPLE},${PINK})`, color: 'white', padding: '16px 36px', borderRadius: 14, fontSize: 16, fontWeight: 800, textDecoration: 'none', boxShadow: `0 8px 24px ${PURPLE}40` }}>
              Apply to ride
            </Link>
            <Link href="#how-it-works" style={{ background: 'rgba(255,255,255,0.06)', color: 'white', padding: '16px 36px', borderRadius: 14, fontSize: 16, fontWeight: 700, textDecoration: 'none' }}>
              Learn more
            </Link>
          </div>
        </motion.div>
      </section>

      {/* Perks */}
      <section style={{ padding: '80px 60px' }}>
        <h2 style={{ textAlign: 'center', fontSize: 38, fontWeight: 900, marginBottom: 48 }}>Why ride with EnJoy?</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 24, maxWidth: 900, margin: '0 auto' }}>
          {perks.map((p, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
              style={{ padding: '32px 28px', background: 'rgba(255,255,255,0.03)', borderRadius: 20, border: '1px solid rgba(255,255,255,0.06)' }}>
              <div style={{ fontSize: 40, marginBottom: 16 }}>{p.icon}</div>
              <h3 style={{ fontSize: 20, fontWeight: 800, marginBottom: 8 }}>{p.title}</h3>
              <p style={{ color: 'rgba(255,255,255,0.5)', lineHeight: 1.6, fontSize: 15 }}>{p.text}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" style={{ padding: '80px 60px', background: 'rgba(90,49,244,0.03)' }}>
        <h2 style={{ textAlign: 'center', fontSize: 38, fontWeight: 900, marginBottom: 56 }}>Start in 3 steps</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 32, maxWidth: 900, margin: '0 auto' }}>
          {steps.map((s, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.15 }} style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 52, fontWeight: 950, background: `linear-gradient(135deg,${PURPLE},${PINK})`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', marginBottom: 16 }}>{s.num}</div>
              <h3 style={{ fontSize: 20, fontWeight: 800, marginBottom: 10 }}>{s.title}</h3>
              <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 15, lineHeight: 1.6 }}>{s.text}</p>
            </motion.div>
          ))}
        </div>
        <div style={{ textAlign: 'center', marginTop: 56 }}>
          <Link href="/signup" style={{ background: `linear-gradient(135deg,${PURPLE},${PINK})`, color: 'white', padding: '16px 48px', borderRadius: 14, fontSize: 16, fontWeight: 800, textDecoration: 'none' }}>
            Become a rider
          </Link>
        </div>
      </section>
      <Footer />
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add apps/web/src/app/riders/page.tsx
git commit -m "feat: add riders landing page"
```

---

### Task 9: Partners page

**Files:**
- Create: `src/app/partners/page.tsx`

- [ ] **Step 1: Create partners page**

```typescript
// src/app/partners/page.tsx
'use client';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Nav } from '../components/Nav';
import { Footer } from '../components/Footer';

const PURPLE = '#5A31F4';
const PINK = '#FF0080';
const PAGE_BG = '#0A0A0F';

const benefits = [
  { icon: '📈', title: 'Grow your revenue', text: 'Our restaurants see an average 34% revenue increase in the first 3 months.' },
  { icon: '🧠', title: 'Smart dashboard', text: 'Powered by VelociPizza — manage orders, menus, and analytics in real time.' },
  { icon: '📸', title: 'AI menu photos', text: 'We generate stunning food photography for your entire menu at no extra cost.' },
  { icon: '💜', title: '0% commission first month', text: 'Onboard for free. We only succeed when you succeed.' },
];

const stats = [
  { value: '1,200+', label: 'Restaurant partners' },
  { value: '98%', label: 'Partner satisfaction' },
  { value: '€2.4M', label: 'Paid out this month' },
  { value: '34%', label: 'Avg revenue uplift' },
];

export default function PartnersPage() {
  return (
    <div style={{ background: PAGE_BG, minHeight: '100vh', color: 'white', fontFamily: 'Outfit, sans-serif' }}>
      <Nav />
      {/* Hero */}
      <section style={{ padding: '120px 60px 80px', textAlign: 'center', position: 'relative' }}>
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 50% 30%, rgba(255,0,128,0.08) 0%, transparent 65%)' }} />
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} style={{ position: 'relative', zIndex: 1, maxWidth: 720, margin: '0 auto' }}>
          <div style={{ display: 'inline-block', background: 'rgba(255,0,128,0.1)', border: `1px solid ${PINK}40`, borderRadius: 40, padding: '6px 18px', fontSize: 13, fontWeight: 700, color: PINK, marginBottom: 24 }}>
            🍽️ Restaurant partners
          </div>
          <h1 style={{ fontSize: 58, fontWeight: 950, lineHeight: 1.05, marginBottom: 24, letterSpacing: -2 }}>
            Grow your restaurant<br />
            <span style={{ background: `linear-gradient(135deg,${PURPLE},${PINK})`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>with EnJoy</span>
          </h1>
          <p style={{ fontSize: 20, color: 'rgba(255,255,255,0.55)', marginBottom: 40, lineHeight: 1.6 }}>
            Join 1,200+ restaurants on the platform that treats your brand as royalty. Full dashboard, AI menus, and zero compromise on quality.
          </p>
          <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
            {/* Partner signup redirects to VelociPizza B2B onboarding */}
            <a href={`${process.env.NEXT_PUBLIC_VP_DOMAIN ?? '#'}/signup`}
              style={{ background: `linear-gradient(135deg,${PURPLE},${PINK})`, color: 'white', padding: '16px 36px', borderRadius: 14, fontSize: 16, fontWeight: 800, textDecoration: 'none', boxShadow: `0 8px 24px ${PURPLE}40` }}>
              Add your restaurant
            </a>
            <Link href="/contact" style={{ background: 'rgba(255,255,255,0.06)', color: 'white', padding: '16px 36px', borderRadius: 14, fontSize: 16, fontWeight: 700, textDecoration: 'none' }}>
              Talk to sales
            </Link>
          </div>
        </motion.div>
      </section>

      {/* Stats */}
      <section style={{ padding: '40px 60px 80px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 20, maxWidth: 900, margin: '0 auto' }}>
          {stats.map((s, i) => (
            <motion.div key={i} initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }}
              style={{ textAlign: 'center', padding: '32px 16px', background: 'rgba(255,255,255,0.03)', borderRadius: 20, border: '1px solid rgba(255,255,255,0.06)' }}>
              <div style={{ fontSize: 36, fontWeight: 950, background: `linear-gradient(135deg,${PURPLE},${PINK})`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', marginBottom: 8 }}>{s.value}</div>
              <div style={{ color: 'rgba(255,255,255,0.45)', fontSize: 14 }}>{s.label}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Benefits */}
      <section style={{ padding: '40px 60px 80px', background: 'rgba(90,49,244,0.03)' }}>
        <h2 style={{ textAlign: 'center', fontSize: 38, fontWeight: 900, marginBottom: 48 }}>Everything your restaurant needs</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 24, maxWidth: 900, margin: '0 auto' }}>
          {benefits.map((b, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
              style={{ padding: '32px 28px', background: 'rgba(255,255,255,0.03)', borderRadius: 20, border: '1px solid rgba(255,255,255,0.06)' }}>
              <div style={{ fontSize: 40, marginBottom: 16 }}>{b.icon}</div>
              <h3 style={{ fontSize: 20, fontWeight: 800, marginBottom: 8 }}>{b.title}</h3>
              <p style={{ color: 'rgba(255,255,255,0.5)', lineHeight: 1.6, fontSize: 15 }}>{b.text}</p>
            </motion.div>
          ))}
        </div>
      </section>
      <Footer />
    </div>
  );
}
```

- [ ] **Step 2: Add `NEXT_PUBLIC_VP_DOMAIN` to .env.local** (the only safe public var — just the domain, not the API URL)

```bash
echo 'NEXT_PUBLIC_VP_DOMAIN=http://localhost:3000' >> apps/web/.env.local
```

- [ ] **Step 3: Commit**

```bash
git add apps/web/src/app/partners/page.tsx apps/web/.env.local
git commit -m "feat: add restaurant partners landing page"
```

---

### Task 10: Business, How It Works, Cities, Promotions, Press pages

**Files:**
- Create: `src/app/business/page.tsx`
- Create: `src/app/how-it-works/page.tsx`
- Create: `src/app/cities/page.tsx`
- Create: `src/app/promotions/page.tsx`
- Create: `src/app/press/page.tsx`

- [ ] **Step 1: Create business page**

```typescript
// src/app/business/page.tsx
'use client';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Nav } from '../components/Nav';
import { Footer } from '../components/Footer';

const PURPLE = '#5A31F4';
const PINK = '#FF0080';

const features = [
  { icon: '🏢', title: 'Team meal budgets', text: 'Set monthly allowances per employee. They order, you stay in control.' },
  { icon: '📊', title: 'Expense reporting', text: 'Auto-generated reports every month. Integrates with your accounting tools.' },
  { icon: '🤝', title: 'Catering for events', text: 'Office lunch, team celebration, board dinner — we handle it all at scale.' },
  { icon: '💳', title: 'One invoice', text: 'All team orders consolidated into a single monthly invoice. Easy for finance.' },
];

export default function BusinessPage() {
  return (
    <div style={{ background: '#0A0A0F', minHeight: '100vh', color: 'white', fontFamily: 'Outfit, sans-serif' }}>
      <Nav />
      <section style={{ padding: '120px 60px 80px', textAlign: 'center', position: 'relative' }}>
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 50% 30%, rgba(90,49,244,0.1) 0%, transparent 65%)' }} />
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} style={{ position: 'relative', zIndex: 1, maxWidth: 700, margin: '0 auto' }}>
          <div style={{ display: 'inline-block', background: 'rgba(90,49,244,0.12)', border: `1px solid ${PURPLE}40`, borderRadius: 40, padding: '6px 18px', fontSize: 13, fontWeight: 700, color: PURPLE, marginBottom: 24 }}>
            🏢 EnJoy for Business
          </div>
          <h1 style={{ fontSize: 56, fontWeight: 950, lineHeight: 1.05, marginBottom: 24, letterSpacing: -2 }}>
            Feed your team.<br />
            <span style={{ background: `linear-gradient(135deg,${PURPLE},${PINK})`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Impress your clients.</span>
          </h1>
          <p style={{ fontSize: 20, color: 'rgba(255,255,255,0.55)', marginBottom: 40, lineHeight: 1.6 }}>
            Corporate meal management, team allowances, and office catering — all in one royal platform.
          </p>
          <Link href="/contact" style={{ background: `linear-gradient(135deg,${PURPLE},${PINK})`, color: 'white', padding: '16px 40px', borderRadius: 14, fontSize: 16, fontWeight: 800, textDecoration: 'none' }}>
            Contact our business team
          </Link>
        </motion.div>
      </section>
      <section style={{ padding: '60px 60px 80px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 24, maxWidth: 900, margin: '0 auto' }}>
          {features.map((f, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
              style={{ padding: '32px 28px', background: 'rgba(255,255,255,0.03)', borderRadius: 20, border: '1px solid rgba(255,255,255,0.06)' }}>
              <div style={{ fontSize: 40, marginBottom: 16 }}>{f.icon}</div>
              <h3 style={{ fontSize: 20, fontWeight: 800, marginBottom: 8 }}>{f.title}</h3>
              <p style={{ color: 'rgba(255,255,255,0.5)', lineHeight: 1.6, fontSize: 15 }}>{f.text}</p>
            </motion.div>
          ))}
        </div>
      </section>
      <Footer />
    </div>
  );
}
```

- [ ] **Step 2: Create how-it-works page**

```typescript
// src/app/how-it-works/page.tsx
'use client';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Nav } from '../components/Nav';
import { Footer } from '../components/Footer';

const PURPLE = '#5A31F4';
const PINK = '#FF0080';

const steps = [
  { num: '01', icon: '📍', title: 'Set your location', text: 'Share your address or let us detect it. We show you the best restaurants within range.' },
  { num: '02', icon: '🍽️', title: 'Pick your meal', text: 'Browse curated menus with AI-powered photos. Filter by cuisine, dietary needs, or delivery time.' },
  { num: '03', icon: '🛒', title: 'Place your order', text: 'Add items to cart, choose delivery or pickup, and pay securely in seconds.' },
  { num: '04', icon: '📡', title: 'Track live', text: 'Watch your order get prepared and follow your rider\'s journey in real time on the map.' },
  { num: '05', icon: '👑', title: 'Enjoy royally', text: 'Your food arrives fresh, hot, and in the iconic EnJoy purple bag. Every time.' },
];

export default function HowItWorksPage() {
  return (
    <div style={{ background: '#0A0A0F', minHeight: '100vh', color: 'white', fontFamily: 'Outfit, sans-serif' }}>
      <Nav />
      <section style={{ padding: '120px 60px 60px', textAlign: 'center' }}>
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}>
          <h1 style={{ fontSize: 56, fontWeight: 950, marginBottom: 20, letterSpacing: -2 }}>
            How <span style={{ background: `linear-gradient(135deg,${PURPLE},${PINK})`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>EnJoy</span> works
          </h1>
          <p style={{ fontSize: 20, color: 'rgba(255,255,255,0.5)', maxWidth: 560, margin: '0 auto 60px', lineHeight: 1.6 }}>From craving to doorstep in under 40 minutes. Here's how we make it royal.</p>
        </motion.div>
        <div style={{ maxWidth: 700, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 0 }}>
          {steps.map((s, i) => (
            <motion.div key={i} initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
              style={{ display: 'flex', gap: 32, alignItems: 'flex-start', padding: '40px 0', borderBottom: i < steps.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none', textAlign: 'left' }}>
              <div style={{ fontSize: 44, fontWeight: 950, background: `linear-gradient(135deg,${PURPLE},${PINK})`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', minWidth: 60 }}>{s.num}</div>
              <div>
                <div style={{ fontSize: 32, marginBottom: 12 }}>{s.icon}</div>
                <h3 style={{ fontSize: 22, fontWeight: 800, marginBottom: 8 }}>{s.title}</h3>
                <p style={{ color: 'rgba(255,255,255,0.5)', lineHeight: 1.7, fontSize: 16 }}>{s.text}</p>
              </div>
            </motion.div>
          ))}
        </div>
        <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} style={{ marginTop: 60 }}>
          <Link href="/discover" style={{ background: `linear-gradient(135deg,${PURPLE},${PINK})`, color: 'white', padding: '18px 48px', borderRadius: 14, fontSize: 18, fontWeight: 800, textDecoration: 'none' }}>
            Order now
          </Link>
        </motion.div>
      </section>
      <Footer />
    </div>
  );
}
```

- [ ] **Step 3: Create cities page**

```typescript
// src/app/cities/page.tsx
'use client';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Nav } from '../components/Nav';
import { Footer } from '../components/Footer';

const PURPLE = '#5A31F4';
const PINK = '#FF0080';

const cities = [
  { name: 'Amsterdam', flag: '🇳🇱', restaurants: 342, status: 'live' },
  { name: 'Rotterdam', flag: '🇳🇱', restaurants: 218, status: 'live' },
  { name: 'Den Haag', flag: '🇳🇱', restaurants: 187, status: 'live' },
  { name: 'Utrecht', flag: '🇳🇱', restaurants: 156, status: 'live' },
  { name: 'Eindhoven', flag: '🇳🇱', restaurants: 98, status: 'live' },
  { name: 'Breda', flag: '🇳🇱', restaurants: 72, status: 'live' },
  { name: 'Brussels', flag: '🇧🇪', restaurants: 0, status: 'coming' },
  { name: 'Antwerp', flag: '🇧🇪', restaurants: 0, status: 'coming' },
  { name: 'Berlin', flag: '🇩🇪', restaurants: 0, status: 'coming' },
  { name: 'London', flag: '🇬🇧', restaurants: 0, status: 'coming' },
  { name: 'Paris', flag: '🇫🇷', restaurants: 0, status: 'coming' },
  { name: 'Barcelona', flag: '🇪🇸', restaurants: 0, status: 'coming' },
];

export default function CitiesPage() {
  const live = cities.filter(c => c.status === 'live');
  const coming = cities.filter(c => c.status === 'coming');

  return (
    <div style={{ background: '#0A0A0F', minHeight: '100vh', color: 'white', fontFamily: 'Outfit, sans-serif' }}>
      <Nav />
      <section style={{ padding: '120px 60px 60px', textAlign: 'center' }}>
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}>
          <h1 style={{ fontSize: 52, fontWeight: 950, marginBottom: 16, letterSpacing: -2 }}>
            We deliver in <span style={{ background: `linear-gradient(135deg,${PURPLE},${PINK})`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>your city</span>
          </h1>
          <p style={{ fontSize: 18, color: 'rgba(255,255,255,0.5)', maxWidth: 520, margin: '0 auto 60px' }}>Currently live in 6 Dutch cities. Expanding across Europe in 2026.</p>
        </motion.div>

        <h2 style={{ fontSize: 24, fontWeight: 800, marginBottom: 24, textAlign: 'left', maxWidth: 900, margin: '0 auto 24px' }}>🟢 Live now</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20, maxWidth: 900, margin: '0 auto 56px' }}>
          {live.map((c, i) => (
            <motion.div key={c.name} initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.07 }}>
              <Link href="/discover" style={{ display: 'block', padding: '28px 24px', background: 'rgba(255,255,255,0.03)', borderRadius: 20, border: `1px solid ${PURPLE}20`, textDecoration: 'none', color: 'white' }}>
                <div style={{ fontSize: 36, marginBottom: 12 }}>{c.flag}</div>
                <h3 style={{ fontSize: 20, fontWeight: 800, marginBottom: 4 }}>{c.name}</h3>
                <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 14 }}>{c.restaurants} restaurants</p>
              </Link>
            </motion.div>
          ))}
        </div>

        <h2 style={{ fontSize: 24, fontWeight: 800, marginBottom: 24, textAlign: 'left', maxWidth: 900, margin: '0 auto 24px' }}>⏳ Coming soon</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20, maxWidth: 900, margin: '0 auto 60px' }}>
          {coming.map((c, i) => (
            <motion.div key={c.name} initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.07 }}>
              <div style={{ padding: '28px 24px', background: 'rgba(255,255,255,0.015)', borderRadius: 20, border: '1px solid rgba(255,255,255,0.05)', opacity: 0.6 }}>
                <div style={{ fontSize: 36, marginBottom: 12 }}>{c.flag}</div>
                <h3 style={{ fontSize: 20, fontWeight: 800, marginBottom: 4 }}>{c.name}</h3>
                <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: 14 }}>Coming 2026</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>
      <Footer />
    </div>
  );
}
```

- [ ] **Step 4: Create promotions page**

```typescript
// src/app/promotions/page.tsx
'use client';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Nav } from '../components/Nav';
import { Footer } from '../components/Footer';

const PURPLE = '#5A31F4';
const PINK = '#FF0080';

const promos = [
  { code: 'ROYAL10', discount: '10% off', description: 'Your first 3 orders', expires: '31 Mar 2026', color: PURPLE },
  { code: 'LUNCH50', discount: '€2.50 off', description: 'Orders placed 11:00–14:00', expires: '30 Apr 2026', color: '#FF6B35' },
  { code: 'NEWCITY', discount: 'Free delivery', description: 'All orders this week', expires: '28 Mar 2026', color: PINK },
  { code: 'FRIDAY20', discount: '20% off', description: 'Friday orders only', expires: 'Every Friday', color: '#00BCD4' },
];

export default function PromotionsPage() {
  return (
    <div style={{ background: '#0A0A0F', minHeight: '100vh', color: 'white', fontFamily: 'Outfit, sans-serif' }}>
      <Nav />
      <section style={{ padding: '120px 60px 60px', textAlign: 'center' }}>
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}>
          <h1 style={{ fontSize: 52, fontWeight: 950, marginBottom: 16, letterSpacing: -2 }}>
            Royal <span style={{ background: `linear-gradient(135deg,${PURPLE},${PINK})`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>deals</span>
          </h1>
          <p style={{ fontSize: 18, color: 'rgba(255,255,255,0.5)', maxWidth: 500, margin: '0 auto 56px' }}>Active promotions and promo codes. Apply at checkout.</p>
        </motion.div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 24, maxWidth: 860, margin: '0 auto 60px' }}>
          {promos.map((p, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
              style={{ padding: '32px 28px', background: 'rgba(255,255,255,0.03)', borderRadius: 20, border: `1px solid ${p.color}30`, textAlign: 'left', position: 'relative', overflow: 'hidden' }}>
              <div style={{ position: 'absolute', top: -20, right: -20, width: 100, height: 100, borderRadius: '50%', background: `${p.color}10`, filter: 'blur(20px)' }} />
              <div style={{ fontSize: 36, fontWeight: 950, color: p.color, marginBottom: 8, fontFamily: 'monospace' }}>{p.code}</div>
              <div style={{ fontSize: 28, fontWeight: 900, marginBottom: 8 }}>{p.discount}</div>
              <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: 15, marginBottom: 16 }}>{p.description}</p>
              <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.3)' }}>Expires: {p.expires}</div>
            </motion.div>
          ))}
        </div>
        <Link href="/discover" style={{ background: `linear-gradient(135deg,${PURPLE},${PINK})`, color: 'white', padding: '16px 40px', borderRadius: 14, fontSize: 16, fontWeight: 800, textDecoration: 'none' }}>
          Order with a promo
        </Link>
      </section>
      <Footer />
    </div>
  );
}
```

- [ ] **Step 5: Create press page**

```typescript
// src/app/press/page.tsx
'use client';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Nav } from '../components/Nav';
import { Footer } from '../components/Footer';

const PURPLE = '#5A31F4';
const PINK = '#FF0080';

const articles = [
  { outlet: 'TechCrunch', title: 'EnJoy raises €8M to bring elite food delivery to European cities', date: 'Jan 2026', tag: 'Funding' },
  { outlet: 'Het Financieele Dagblad', title: 'EnJoy: De Nederlandse startup die bezorging heruitvindt', date: 'Feb 2026', tag: 'Feature' },
  { outlet: 'Wired NL', title: 'How AI and purple bags are changing the food delivery game', date: 'Mar 2026', tag: 'Tech' },
  { outlet: 'Business Insider', title: 'EnJoy hits 1,000 restaurant partners in 6 months', date: 'Mar 2026', tag: 'Milestone' },
];

export default function PressPage() {
  return (
    <div style={{ background: '#0A0A0F', minHeight: '100vh', color: 'white', fontFamily: 'Outfit, sans-serif' }}>
      <Nav />
      <section style={{ padding: '120px 60px 60px' }}>
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} style={{ maxWidth: 760, margin: '0 auto' }}>
          <h1 style={{ fontSize: 52, fontWeight: 950, marginBottom: 16, letterSpacing: -2 }}>
            Press & <span style={{ background: `linear-gradient(135deg,${PURPLE},${PINK})`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Media</span>
          </h1>
          <p style={{ fontSize: 18, color: 'rgba(255,255,255,0.5)', marginBottom: 16, lineHeight: 1.6 }}>
            For media enquiries, interview requests, and brand assets, contact our communications team.
          </p>
          <a href="mailto:press@enjoy.delivery" style={{ color: PURPLE, fontWeight: 700, fontSize: 16 }}>press@enjoy.delivery</a>

          {/* Brand assets */}
          <div style={{ display: 'flex', gap: 16, marginTop: 32, marginBottom: 56 }}>
            {['Logo pack (.zip)', 'Brand guidelines (.pdf)', 'Press photos'].map((a, i) => (
              <div key={i} style={{ padding: '12px 20px', background: 'rgba(255,255,255,0.04)', borderRadius: 10, border: '1px solid rgba(255,255,255,0.08)', fontSize: 14, color: 'rgba(255,255,255,0.6)', cursor: 'pointer' }}>
                📎 {a}
              </div>
            ))}
          </div>

          {/* Recent coverage */}
          <h2 style={{ fontSize: 28, fontWeight: 800, marginBottom: 24 }}>Recent coverage</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {articles.map((a, i) => (
              <motion.div key={i} initial={{ opacity: 0, x: -16 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }}
                style={{ padding: '24px 28px', background: 'rgba(255,255,255,0.03)', borderRadius: 16, border: '1px solid rgba(255,255,255,0.06)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 24 }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
                    <span style={{ fontSize: 13, fontWeight: 800, color: PURPLE }}>{a.outlet}</span>
                    <span style={{ fontSize: 12, padding: '2px 10px', background: `${PURPLE}15`, color: PURPLE, borderRadius: 20 }}>{a.tag}</span>
                  </div>
                  <p style={{ fontSize: 16, fontWeight: 700, lineHeight: 1.4 }}>{a.title}</p>
                </div>
                <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: 13, flexShrink: 0 }}>{a.date}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>
      <Footer />
    </div>
  );
}
```

- [ ] **Step 6: Commit all 5 marketing pages**

```bash
git add apps/web/src/app/business/page.tsx apps/web/src/app/how-it-works/page.tsx apps/web/src/app/cities/page.tsx apps/web/src/app/promotions/page.tsx apps/web/src/app/press/page.tsx
git commit -m "feat: add business, how-it-works, cities, promotions, and press pages"
```

---

## Chunk 5: Account API Routes

### Task 11: Account API routes

**Files:**
- Create: `src/app/api/account/orders/route.ts`
- Create: `src/app/api/account/profile/route.ts`
- Create: `src/app/api/account/addresses/route.ts`
- Create: `src/app/api/orders/[id]/route.ts`

- [ ] **Step 1: Create orders route**

```typescript
// src/app/api/account/orders/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { vpFetch } from '@/lib/velocipizza';

export async function GET(req: NextRequest) {
  const token = req.cookies.get('enjoy_session')?.value;
  if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  try {
    const orders = await vpFetch<unknown[]>('/api/consumer/orders', { token });
    return NextResponse.json(orders);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: err.status ?? 500 });
  }
}
```

- [ ] **Step 2: Create profile route**

```typescript
// src/app/api/account/profile/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { vpFetch } from '@/lib/velocipizza';

export async function GET(req: NextRequest) {
  const token = req.cookies.get('enjoy_session')?.value;
  if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  try {
    const profile = await vpFetch<unknown>('/api/consumer/profile', { token });
    return NextResponse.json(profile);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: err.status ?? 500 });
  }
}

export async function PATCH(req: NextRequest) {
  const token = req.cookies.get('enjoy_session')?.value;
  if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  try {
    const body = await req.json();
    const updated = await vpFetch<unknown>('/api/consumer/profile', { method: 'PATCH', body, token });
    return NextResponse.json(updated);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: err.status ?? 500 });
  }
}
```

- [ ] **Step 3: Create addresses route**

```typescript
// src/app/api/account/addresses/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { vpFetch } from '@/lib/velocipizza';

export async function GET(req: NextRequest) {
  const token = req.cookies.get('enjoy_session')?.value;
  if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  try {
    const addresses = await vpFetch<unknown[]>('/api/consumer/addresses', { token });
    return NextResponse.json(addresses);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: err.status ?? 500 });
  }
}

export async function POST(req: NextRequest) {
  const token = req.cookies.get('enjoy_session')?.value;
  if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  try {
    const body = await req.json();
    const address = await vpFetch<unknown>('/api/consumer/addresses', { method: 'POST', body, token });
    return NextResponse.json(address, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: err.status ?? 500 });
  }
}
```

- [ ] **Step 4: Create order detail route**

```typescript
// src/app/api/orders/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { vpFetch } from '@/lib/velocipizza';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const token = req.cookies.get('enjoy_session')?.value;
  if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  try {
    const order = await vpFetch<unknown>(`/api/orders/${params.id}`, { token });
    return NextResponse.json(order);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: err.status ?? 500 });
  }
}
```

- [ ] **Step 5: Commit**

```bash
git add apps/web/src/app/api/account/ apps/web/src/app/api/orders/
git commit -m "feat: add account and order API routes (server-side VelociPizza proxy)"
```

---

## Chunk 6: Account Pages & Order Tracking

### Task 12: Account orders page

**Files:**
- Create: `src/app/account/orders/page.tsx`

- [ ] **Step 1: Create account orders page**

```typescript
// src/app/account/orders/page.tsx
'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Nav } from '../../components/Nav';
import { Footer } from '../../components/Footer';

const PURPLE = '#5A31F4';
const PINK = '#FF0080';

type Order = {
  id: string;
  restaurantName: string;
  total: number;
  status: string;
  createdAt: string;
  items: { name: string; quantity: number }[];
};

const statusColors: Record<string, string> = {
  delivered: '#22C55E',
  preparing: '#F59E0B',
  on_the_way: PURPLE,
  cancelled: '#EF4444',
};

export default function AccountOrdersPage() {
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/auth/me')
      .then(r => { if (!r.ok) router.push('/login?next=/account/orders'); return r.ok; })
      .then(ok => ok && fetch('/api/account/orders'))
      .then(r => r && r.json())
      .then(data => { if (data) setOrders(Array.isArray(data) ? data : []); })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [router]);

  return (
    <div style={{ background: '#0A0A0F', minHeight: '100vh', color: 'white', fontFamily: 'Outfit, sans-serif' }}>
      <Nav />
      <section style={{ padding: '100px 60px 60px', maxWidth: 800, margin: '0 auto' }}>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 style={{ fontSize: 38, fontWeight: 900, marginBottom: 8 }}>Your orders</h1>
          <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 15, marginBottom: 40 }}>Track current orders and view your history.</p>
        </motion.div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '80px 0', color: 'rgba(255,255,255,0.3)' }}>Loading orders...</div>
        ) : orders.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '80px 0' }}>
            <div style={{ fontSize: 56, marginBottom: 16 }}>🍽️</div>
            <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 16, marginBottom: 24 }}>No orders yet. Time to eat royally.</p>
            <Link href="/discover" style={{ background: `linear-gradient(135deg,${PURPLE},${PINK})`, color: 'white', padding: '14px 32px', borderRadius: 12, fontSize: 15, fontWeight: 700, textDecoration: 'none' }}>Browse restaurants</Link>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {orders.map((o, i) => (
              <motion.div key={o.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}>
                <Link href={`/order/${o.id}`} style={{ display: 'block', padding: '24px 28px', background: 'rgba(255,255,255,0.03)', borderRadius: 20, border: '1px solid rgba(255,255,255,0.06)', textDecoration: 'none', color: 'white' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                    <div>
                      <h3 style={{ fontSize: 18, fontWeight: 800, marginBottom: 4 }}>{o.restaurantName}</h3>
                      <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 14 }}>{new Date(o.createdAt).toLocaleDateString('nl-NL', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: 18, fontWeight: 800, marginBottom: 4 }}>€{(o.total / 100).toFixed(2)}</div>
                      <span style={{ fontSize: 12, padding: '3px 10px', borderRadius: 20, background: `${statusColors[o.status] ?? '#888'}20`, color: statusColors[o.status] ?? '#888', fontWeight: 700 }}>
                        {o.status.replace('_', ' ')}
                      </span>
                    </div>
                  </div>
                  <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: 14 }}>{o.items.map(i => `${i.quantity}× ${i.name}`).join(', ')}</p>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </section>
      <Footer />
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add apps/web/src/app/account/orders/page.tsx
git commit -m "feat: add account orders page with auth guard"
```

---

### Task 13: Account profile & addresses pages

**Files:**
- Create: `src/app/account/profile/page.tsx`
- Create: `src/app/account/addresses/page.tsx`

- [ ] **Step 1: Create profile page**

```typescript
// src/app/account/profile/page.tsx
'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Nav } from '../../components/Nav';
import { Footer } from '../../components/Footer';

const PURPLE = '#5A31F4';
const PINK = '#FF0080';

type Profile = { id: string; name: string; email: string; phone?: string };

export default function ProfilePage() {
  const router = useRouter();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/auth/me')
      .then(r => { if (!r.ok) router.push('/login?next=/account/profile'); return r.ok; })
      .then(ok => ok && fetch('/api/account/profile'))
      .then(r => r && r.json())
      .then(d => d && setProfile(d))
      .finally(() => setLoading(false));
  }, [router]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile) return;
    setSaving(true);
    const res = await fetch('/api/account/profile', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(profile) });
    if (res.ok) { setSaved(true); setTimeout(() => setSaved(false), 2000); }
    setSaving(false);
  };

  const input = { width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, padding: '14px 18px', color: 'white', fontSize: 15, outline: 'none', fontFamily: 'Outfit, sans-serif', boxSizing: 'border-box' as const };

  return (
    <div style={{ background: '#0A0A0F', minHeight: '100vh', color: 'white', fontFamily: 'Outfit, sans-serif' }}>
      <Nav />
      <section style={{ padding: '100px 60px 60px', maxWidth: 600, margin: '0 auto' }}>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 style={{ fontSize: 38, fontWeight: 900, marginBottom: 8 }}>Your profile</h1>
          <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 15, marginBottom: 40 }}>Manage your personal information.</p>
          {loading ? (
            <div style={{ textAlign: 'center', padding: '60px 0', color: 'rgba(255,255,255,0.3)' }}>Loading...</div>
          ) : profile ? (
            <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 700, marginBottom: 8, color: 'rgba(255,255,255,0.6)' }}>Full name</label>
                <input value={profile.name} onChange={e => setProfile({ ...profile, name: e.target.value })} style={input} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 700, marginBottom: 8, color: 'rgba(255,255,255,0.6)' }}>Email address</label>
                <input type="email" value={profile.email} onChange={e => setProfile({ ...profile, email: e.target.value })} style={input} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 700, marginBottom: 8, color: 'rgba(255,255,255,0.6)' }}>Phone number</label>
                <input type="tel" value={profile.phone ?? ''} onChange={e => setProfile({ ...profile, phone: e.target.value })} placeholder="+31 6 00 00 00 00" style={input} />
              </div>
              <button type="submit" disabled={saving}
                style={{ background: `linear-gradient(135deg,${PURPLE},${PINK})`, color: 'white', border: 'none', borderRadius: 12, padding: '15px 0', fontSize: 15, fontWeight: 800, cursor: saving ? 'not-allowed' : 'pointer', opacity: saving ? 0.7 : 1, marginTop: 8 }}>
                {saving ? 'Saving...' : saved ? '✓ Saved' : 'Save changes'}
              </button>
            </form>
          ) : null}
        </motion.div>
      </section>
      <Footer />
    </div>
  );
}
```

- [ ] **Step 2: Create addresses page**

```typescript
// src/app/account/addresses/page.tsx
'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Nav } from '../../components/Nav';
import { Footer } from '../../components/Footer';

const PURPLE = '#5A31F4';
const PINK = '#FF0080';

type Address = { id: string; label: string; street: string; city: string; postcode: string };

export default function AddressesPage() {
  const router = useRouter();
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [form, setForm] = useState({ label: '', street: '', city: '', postcode: '' });

  useEffect(() => {
    fetch('/api/auth/me')
      .then(r => { if (!r.ok) router.push('/login?next=/account/addresses'); return r.ok; })
      .then(ok => ok && fetch('/api/account/addresses'))
      .then(r => r && r.json())
      .then(d => d && setAddresses(Array.isArray(d) ? d : []))
      .finally(() => setLoading(false));
  }, [router]);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch('/api/account/addresses', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) });
    if (res.ok) {
      const newAddr = await res.json();
      setAddresses(prev => [...prev, newAddr]);
      setForm({ label: '', street: '', city: '', postcode: '' });
      setAdding(false);
    }
  };

  const input = { width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, padding: '12px 16px', color: 'white', fontSize: 14, outline: 'none', fontFamily: 'Outfit, sans-serif', boxSizing: 'border-box' as const };

  return (
    <div style={{ background: '#0A0A0F', minHeight: '100vh', color: 'white', fontFamily: 'Outfit, sans-serif' }}>
      <Nav />
      <section style={{ padding: '100px 60px 60px', maxWidth: 680, margin: '0 auto' }}>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
            <h1 style={{ fontSize: 38, fontWeight: 900 }}>Your addresses</h1>
            <button onClick={() => setAdding(!adding)} style={{ background: `linear-gradient(135deg,${PURPLE},${PINK})`, color: 'white', border: 'none', borderRadius: 12, padding: '10px 20px', fontSize: 14, fontWeight: 700, cursor: 'pointer' }}>
              + Add address
            </button>
          </div>
          <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 15, marginBottom: 32 }}>Saved delivery addresses for faster checkout.</p>

          {adding && (
            <form onSubmit={handleAdd} style={{ background: 'rgba(255,255,255,0.03)', borderRadius: 20, border: '1px solid rgba(255,255,255,0.08)', padding: '28px', marginBottom: 24, display: 'flex', flexDirection: 'column', gap: 12 }}>
              <input placeholder="Label (e.g. Home, Office)" value={form.label} onChange={e => setForm({ ...form, label: e.target.value })} required style={input} />
              <input placeholder="Street and number" value={form.street} onChange={e => setForm({ ...form, street: e.target.value })} required style={input} />
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <input placeholder="City" value={form.city} onChange={e => setForm({ ...form, city: e.target.value })} required style={input} />
                <input placeholder="Postcode" value={form.postcode} onChange={e => setForm({ ...form, postcode: e.target.value })} required style={input} />
              </div>
              <button type="submit" style={{ background: `linear-gradient(135deg,${PURPLE},${PINK})`, color: 'white', border: 'none', borderRadius: 12, padding: '13px 0', fontSize: 15, fontWeight: 700, cursor: 'pointer', marginTop: 4 }}>
                Save address
              </button>
            </form>
          )}

          {loading ? (
            <div style={{ textAlign: 'center', padding: '60px 0', color: 'rgba(255,255,255,0.3)' }}>Loading...</div>
          ) : addresses.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px 0', color: 'rgba(255,255,255,0.3)' }}>No saved addresses yet.</div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {addresses.map((a, i) => (
                <motion.div key={a.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                  style={{ padding: '20px 24px', background: 'rgba(255,255,255,0.03)', borderRadius: 16, border: '1px solid rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', gap: 16 }}>
                  <span style={{ fontSize: 24 }}>📍</span>
                  <div>
                    <p style={{ fontWeight: 700, fontSize: 15, marginBottom: 2 }}>{a.label}</p>
                    <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 14 }}>{a.street}, {a.postcode} {a.city}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </section>
      <Footer />
    </div>
  );
}
```

- [ ] **Step 3: Commit**

```bash
git add apps/web/src/app/account/profile/page.tsx apps/web/src/app/account/addresses/page.tsx
git commit -m "feat: add account profile and addresses pages"
```

---

### Task 14: Order tracking page

**Files:**
- Create: `src/app/order/[id]/page.tsx`

- [ ] **Step 1: Create order tracking page**

```typescript
// src/app/order/[id]/page.tsx
'use client';
import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Nav } from '../../components/Nav';

const PURPLE = '#5A31F4';
const PINK = '#FF0080';

type Order = {
  id: string;
  restaurantName: string;
  status: 'confirmed' | 'preparing' | 'ready' | 'on_the_way' | 'delivered' | 'cancelled';
  total: number;
  estimatedMinutes?: number;
  items: { name: string; quantity: number; price: number }[];
  rider?: { name: string };
  address: string;
};

const STAGES = [
  { key: 'confirmed', label: 'Order confirmed', icon: '✅' },
  { key: 'preparing', label: 'Being prepared', icon: '👨‍🍳' },
  { key: 'ready', label: 'Ready for pickup', icon: '📦' },
  { key: 'on_the_way', label: 'On the way', icon: '🚲' },
  { key: 'delivered', label: 'Delivered', icon: '🎉' },
];

const stageIndex = (status: string) => STAGES.findIndex(s => s.key === status);

export default function OrderTrackingPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch('/api/auth/me')
      .then(r => { if (!r.ok) router.push('/login'); return r.ok; })
      .then(ok => ok && fetch(`/api/orders/${id}`))
      .then(r => { if (!r) return; if (!r.ok) { setError('Order not found'); return; } return r.json(); })
      .then(d => d && setOrder(d))
      .catch(() => setError('Failed to load order'))
      .finally(() => setLoading(false));

    // Poll every 30s for live updates
    const interval = setInterval(() => {
      fetch(`/api/orders/${id}`).then(r => r.ok ? r.json() : null).then(d => d && setOrder(d));
    }, 30000);
    return () => clearInterval(interval);
  }, [id, router]);

  const activeStage = order ? stageIndex(order.status) : -1;

  return (
    <div style={{ background: '#0A0A0F', minHeight: '100vh', color: 'white', fontFamily: 'Outfit, sans-serif' }}>
      <Nav />
      <section style={{ padding: '100px 40px 60px', maxWidth: 720, margin: '0 auto' }}>
        {loading ? (
          <div style={{ textAlign: 'center', padding: '80px 0', color: 'rgba(255,255,255,0.3)' }}>Loading your order...</div>
        ) : error ? (
          <div style={{ textAlign: 'center', padding: '80px 0' }}>
            <p style={{ color: '#EF4444', marginBottom: 24 }}>{error}</p>
            <Link href="/account/orders" style={{ color: PURPLE, fontWeight: 700 }}>← Back to orders</Link>
          </div>
        ) : order ? (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <Link href="/account/orders" style={{ color: 'rgba(255,255,255,0.4)', fontSize: 14, textDecoration: 'none', display: 'block', marginBottom: 28 }}>← All orders</Link>

            <h1 style={{ fontSize: 32, fontWeight: 900, marginBottom: 4 }}>Order from {order.restaurantName}</h1>
            {order.estimatedMinutes && order.status !== 'delivered' && (
              <p style={{ fontSize: 18, color: PURPLE, fontWeight: 700, marginBottom: 32 }}>🕐 Arriving in ~{order.estimatedMinutes} minutes</p>
            )}

            {/* Progress tracker */}
            <div style={{ background: 'rgba(255,255,255,0.03)', borderRadius: 20, border: '1px solid rgba(255,255,255,0.06)', padding: '32px 28px', marginBottom: 24 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', position: 'relative' }}>
                {/* Progress line */}
                <div style={{ position: 'absolute', top: 20, left: '10%', right: '10%', height: 3, background: 'rgba(255,255,255,0.06)', borderRadius: 4 }} />
                <div style={{ position: 'absolute', top: 20, left: '10%', height: 3, background: `linear-gradient(90deg,${PURPLE},${PINK})`, borderRadius: 4, width: `${Math.min(activeStage / (STAGES.length - 1) * 80, 80)}%`, transition: 'width 1s ease' }} />
                {STAGES.map((s, i) => (
                  <div key={s.key} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10, zIndex: 1 }}>
                    <div style={{ width: 40, height: 40, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, background: i <= activeStage ? `linear-gradient(135deg,${PURPLE},${PINK})` : 'rgba(255,255,255,0.06)', transition: 'background 0.5s', boxShadow: i === activeStage ? `0 0 16px ${PURPLE}60` : 'none' }}>{s.icon}</div>
                    <span style={{ fontSize: 11, color: i <= activeStage ? 'white' : 'rgba(255,255,255,0.25)', fontWeight: 700, textAlign: 'center', maxWidth: 70 }}>{s.label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Rider info */}
            {order.rider && order.status === 'on_the_way' && (
              <div style={{ background: `${PURPLE}10`, border: `1px solid ${PURPLE}30`, borderRadius: 16, padding: '20px 24px', marginBottom: 24, display: 'flex', alignItems: 'center', gap: 16 }}>
                <div style={{ width: 48, height: 48, background: `linear-gradient(135deg,${PURPLE},${PINK})`, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22 }}>🚲</div>
                <div>
                  <p style={{ fontWeight: 800, fontSize: 16 }}>{order.rider.name} is on the way</p>
                  <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 14 }}>Delivering to {order.address}</p>
                </div>
              </div>
            )}

            {/* Order items */}
            <div style={{ background: 'rgba(255,255,255,0.03)', borderRadius: 20, border: '1px solid rgba(255,255,255,0.06)', padding: '24px 28px' }}>
              <h3 style={{ fontSize: 18, fontWeight: 800, marginBottom: 16 }}>Order summary</h3>
              {order.items.map((item, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: i < order.items.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none' }}>
                  <span style={{ color: 'rgba(255,255,255,0.7)' }}>{item.quantity}× {item.name}</span>
                  <span style={{ fontWeight: 700 }}>€{(item.price / 100).toFixed(2)}</span>
                </div>
              ))}
              <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: 16, marginTop: 4 }}>
                <span style={{ fontWeight: 800, fontSize: 16 }}>Total</span>
                <span style={{ fontWeight: 900, fontSize: 16 }}>€{(order.total / 100).toFixed(2)}</span>
              </div>
            </div>
          </motion.div>
        ) : null}
      </section>
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add apps/web/src/app/order/
git commit -m "feat: add live order tracking page with 30s polling"
```

---

## Chunk 7: Wiring It All Together

### Task 15: Update homepage to use shared Nav + Footer

**Files:**
- Modify: `src/app/page.tsx`

- [ ] **Step 1: Replace inline Navbar and Footer in page.tsx with shared components**

In `src/app/page.tsx`:
1. Remove the entire `function Navbar()` component definition (lines ~8–53)
2. Remove the entire `const footerLinks` and `function Footer()` definitions
3. Add imports at top: `import { Nav } from './components/Nav';` and `import { Footer } from './components/Footer';`
4. Replace `<Navbar />` with `<Nav />`
5. Replace `<Footer />` with `<Footer />`

- [ ] **Step 2: Commit**

```bash
git add apps/web/src/app/page.tsx
git commit -m "refactor: use shared Nav and Footer in homepage"
```

---

### Task 16: Update discover page nav

**Files:**
- Modify: `src/app/discover/page.tsx`

- [ ] **Step 1: Replace inline navbar in discover/page.tsx with shared Nav**

In `src/app/discover/page.tsx`:
1. Find the `function NavBar()` or inline nav at top of the return
2. Replace it with `import { Nav } from '../components/Nav'` and use `<Nav />`
3. Do NOT touch any other part of the page

- [ ] **Step 2: Commit**

```bash
git add apps/web/src/app/discover/page.tsx
git commit -m "refactor: use shared Nav in discover page"
```

---

### Task 17: Final push to GitHub

- [ ] **Step 1: Verify dev server still compiles**

```bash
curl -s http://localhost:3100 | head -5
```
Expected: HTML response (not a build error)

- [ ] **Step 2: Push all commits**

```bash
cd /c/Users/xxx/EnJoy
git push origin master
```

- [ ] **Step 3: Verify pages are accessible**

Check these URLs in browser:
- http://localhost:3100/login ✓
- http://localhost:3100/signup ✓
- http://localhost:3100/riders ✓
- http://localhost:3100/partners ✓
- http://localhost:3100/business ✓
- http://localhost:3100/how-it-works ✓
- http://localhost:3100/cities ✓
- http://localhost:3100/promotions ✓
- http://localhost:3100/press ✓
- http://localhost:3100/account/orders (redirects to /login if not signed in) ✓

---

## Security Checklist

Before marking complete, confirm:

- [ ] No `NEXT_PUBLIC_VELOCIPIZZA_API_URL` anywhere (only `VELOCIPIZZA_API_URL`)
- [ ] `src/lib/velocipizza.ts` is never imported in `'use client'` files
- [ ] All auth routes read token from `req.cookies` (httpOnly), never from request body
- [ ] `enjoy_session` cookie is set with `httpOnly: true` and `secure: true` in production
- [ ] No hardcoded URLs in any file — all use env vars or relative paths

---

**Plan complete. Ready to execute?**
