'use client';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';

const PURPLE = '#5A31F4';
const PINK = '#FF0080';

export function Nav() {
  const [user, setUser] = useState<{ name: string } | null>(null);
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
            <button
              onClick={() => fetch('/api/auth/logout', { method: 'POST' }).then(() => { setUser(null); window.location.href = '/'; })}
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
