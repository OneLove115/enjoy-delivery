'use client';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';

const PURPLE = '#5A31F4';
const PINK   = '#FF0080';

const navLinks = [
  { href: '/discover',    label: 'Order' },
  { href: '/how-it-works',label: 'How it works' },
  { href: '/riders',      label: 'Ride with us' },
  { href: '/partners',    label: 'Partner' },
  { href: '/business',    label: 'Business' },
];

export function Nav() {
  const [user, setUser]       = useState<{ name: string; avatarUrl?: string } | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const pathname  = usePathname();

  useEffect(() => {
    fetch('/api/auth/me').then(r => r.ok ? r.json() : null).then(setUser).catch(() => null);
  }, []);

  const signOut = () =>
    fetch('/api/auth/logout', { method: 'POST' }).then(() => { setUser(null); window.location.href = '/'; });

  return (
    <>
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
        height: 70,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 32px',
        background: 'rgba(10,10,15,0.55)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        borderBottom: '1px solid rgba(255,255,255,0.08)',
      }}>
        {/* Logo */}
        <Link href="/" style={{ textDecoration: 'none', flexShrink: 0 }}>
          <img src="/logo-enjoy.png" alt="EnJoy" style={{ height: 44, width: 'auto' }} width={140} height={44} />
        </Link>

        {/* Center links — hidden on mobile via CSS */}
        <div className="nav-center-links" style={{ display: 'flex', gap: 24, alignItems: 'center' }}>
          {navLinks.map(l => (
            <Link key={l.href} href={l.href} style={{
              color: pathname === l.href ? '#ffffff' : 'rgba(255,255,255,0.75)',
              fontSize: 14, fontWeight: 600, textDecoration: 'none',
              borderBottom: pathname === l.href ? `2px solid ${PINK}` : '2px solid transparent',
              paddingBottom: 2, transition: 'color 0.2s',
            }}>{l.label}</Link>
          ))}
        </div>

        {/* Right actions */}
        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          {/* Auth — desktop */}
          <div className="nav-center-links" style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
            {user ? (
              <>
                <Link href="/account" style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--text-secondary)', fontSize: 14, fontWeight: 600, textDecoration: 'none' }}>
                  {user.avatarUrl ? (
                    <img src={user.avatarUrl} alt={user.name} style={{ width: 28, height: 28, borderRadius: '50%', objectFit: 'cover', border: '1px solid rgba(255,255,255,0.2)' }} />
                  ) : (
                    <span style={{ width: 28, height: 28, borderRadius: '50%', background: `linear-gradient(135deg,${PURPLE},${PINK})`, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 900, color: 'white' }}>
                      {user.name[0]?.toUpperCase()}
                    </span>
                  )}
                  {user.name.split(' ')[0]}
                </Link>
                <button onClick={signOut} style={{
                  background: 'var(--bg-card)', border: '1px solid var(--border)',
                  color: 'var(--text-secondary)', padding: '8px 16px', borderRadius: 10,
                  cursor: 'pointer', fontSize: 13, fontWeight: 600,
                }}>Sign out</button>
              </>
            ) : (
              <>
                <Link href="/login" style={{ color: 'rgba(255,255,255,0.8)', fontSize: 14, fontWeight: 600 }}>Sign in</Link>
                <Link href="/signup" style={{
                  background: `linear-gradient(135deg,${PURPLE},${PINK})`, color: 'white',
                  padding: '9px 20px', borderRadius: 10, fontSize: 14, fontWeight: 700,
                }}>Get started</Link>
              </>
            )}
          </div>

          {/* Hamburger — mobile only */}
          <button className="show-mobile" onClick={() => setDrawerOpen(true)} style={{
            width: 38, height: 38, borderRadius: 10,
            background: 'var(--bg-card)', border: '1px solid var(--border)',
            cursor: 'pointer', fontSize: 20, color: 'var(--text-primary)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>☰</button>
        </div>
      </nav>

      {/* Mobile drawer */}
      {drawerOpen && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 500 }}>
          <div onClick={() => setDrawerOpen(false)}
            style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.65)' }} />
          <div style={{
            position: 'absolute', top: 0, right: 0, bottom: 0, width: 280,
            background: 'var(--bg-elevated)', display: 'flex', flexDirection: 'column',
            padding: '20px', gap: 4, boxShadow: '-8px 0 32px rgba(0,0,0,0.5)',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <img src="/logo-enjoy.png" alt="EnJoy" style={{ height: 44, width: 'auto' }} width={140} height={44} />
              <button onClick={() => setDrawerOpen(false)} style={{ background: 'none', border: 'none', fontSize: 24, cursor: 'pointer', color: 'var(--text-primary)' }}>✕</button>
            </div>

            {navLinks.map(l => (
              <Link key={l.href} href={l.href} onClick={() => setDrawerOpen(false)} style={{
                color: 'var(--text-primary)', fontSize: 17, fontWeight: 700,
                padding: '14px 0', borderBottom: '1px solid var(--border)',
              }}>{l.label}</Link>
            ))}

            <div style={{ marginTop: 20, display: 'flex', flexDirection: 'column', gap: 10 }}>
              {user ? (
                <>
                  <Link href="/account/orders" onClick={() => setDrawerOpen(false)}
                    style={{ color: 'var(--text-primary)', fontSize: 16, fontWeight: 600 }}>
                    👤 My Account
                  </Link>
                  <button onClick={signOut} style={{
                    background: 'var(--bg-card)', border: '1px solid var(--border)',
                    color: 'var(--text-primary)', padding: '13px', borderRadius: 12,
                    cursor: 'pointer', fontSize: 15, fontWeight: 600,
                  }}>Sign out</button>
                </>
              ) : (
                <>
                  <Link href="/login" onClick={() => setDrawerOpen(false)} style={{
                    color: 'var(--text-primary)', fontSize: 16, fontWeight: 600,
                    textAlign: 'center', padding: '13px', border: '1px solid var(--border)', borderRadius: 12,
                  }}>Sign in</Link>
                  <Link href="/signup" onClick={() => setDrawerOpen(false)} style={{
                    background: `linear-gradient(135deg,${PURPLE},${PINK})`, color: 'white',
                    padding: '13px', borderRadius: 12, fontSize: 15, fontWeight: 700, textAlign: 'center', display: 'block',
                  }}>Get started</Link>
                </>
              )}
            </div>

          </div>
        </div>
      )}
    </>
  );
}
