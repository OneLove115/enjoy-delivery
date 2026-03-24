'use client';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { useTheme } from '../context/ThemeContext';

const PURPLE = '#5A31F4';
const PINK   = '#FF0080';

const navLinks = [
  { href: '/discover',    label: 'Order' },
  { href: '/how-it-works',label: 'How it works' },
  { href: '/riders',      label: 'Ride with us' },
  { href: '/partners',    label: 'Partner' },
  { href: '/business',    label: 'Business' },
];

const themeIcon: Record<string, string> = { dark: '🌙', light: '☀️', system: '💻' };

export function Nav() {
  const [user, setUser]       = useState<{ name: string } | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const pathname  = usePathname();
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    fetch('/api/auth/me').then(r => r.ok ? r.json() : null).then(setUser).catch(() => null);
  }, []);

  const cycleTheme = () =>
    setTheme(theme === 'dark' ? 'light' : theme === 'light' ? 'system' : 'dark');

  const signOut = () =>
    fetch('/api/auth/logout', { method: 'POST' }).then(() => { setUser(null); window.location.href = '/'; });

  return (
    <>
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100, height: 70,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 32px', background: 'var(--bg-nav)',
        backdropFilter: 'blur(20px)', borderBottom: '1px solid var(--border)',
      }}>
        {/* Logo */}
        <Link href="/" style={{ textDecoration: 'none', flexShrink: 0 }}>
          <span style={{ fontSize: 22, fontWeight: 900, color: 'var(--text-primary)' }}>
            En<span style={{ background: `linear-gradient(135deg,${PURPLE},${PINK})`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Joy</span>
          </span>
        </Link>

        {/* Center links — hidden on mobile via CSS */}
        <div className="nav-center-links" style={{ display: 'flex', gap: 24, alignItems: 'center' }}>
          {navLinks.map(l => (
            <Link key={l.href} href={l.href} style={{
              color: pathname === l.href ? 'var(--text-primary)' : 'var(--text-secondary)',
              fontSize: 14, fontWeight: 600, textDecoration: 'none',
              borderBottom: pathname === l.href ? `2px solid ${PINK}` : '2px solid transparent',
              paddingBottom: 2, transition: 'color 0.2s',
            }}>{l.label}</Link>
          ))}
        </div>

        {/* Right actions */}
        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          {/* Theme toggle */}
          <button onClick={cycleTheme} title={`Mode: ${theme}`} style={{
            width: 38, height: 38, borderRadius: 10,
            background: 'var(--bg-card)', border: '1px solid var(--border)',
            cursor: 'pointer', fontSize: 16,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>{themeIcon[theme]}</button>

          {/* Auth — desktop */}
          <div className="nav-center-links" style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
            {user ? (
              <>
                <Link href="/account/orders" style={{ color: 'var(--text-secondary)', fontSize: 14, fontWeight: 600 }}>
                  👤 {user.name}
                </Link>
                <button onClick={signOut} style={{
                  background: 'var(--bg-card)', border: '1px solid var(--border)',
                  color: 'var(--text-secondary)', padding: '8px 16px', borderRadius: 10,
                  cursor: 'pointer', fontSize: 13, fontWeight: 600,
                }}>Sign out</button>
              </>
            ) : (
              <>
                <Link href="/login" style={{ color: 'var(--text-secondary)', fontSize: 14, fontWeight: 600 }}>Sign in</Link>
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
            alignItems: 'center', justifyContent: 'center',
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
              <span style={{ fontSize: 20, fontWeight: 900, color: 'var(--text-primary)' }}>
                En<span style={{ background: `linear-gradient(135deg,${PURPLE},${PINK})`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Joy</span>
              </span>
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

            {/* Theme toggle in drawer */}
            <div style={{ marginTop: 'auto', paddingTop: 20, borderTop: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: 12 }}>
              {(['dark', 'light', 'system'] as const).map(t => (
                <button key={t} onClick={() => setTheme(t)} style={{
                  flex: 1, padding: '10px 6px', borderRadius: 10, fontSize: 13, fontWeight: 700,
                  cursor: 'pointer', border: '1px solid var(--border)',
                  background: theme === t ? `linear-gradient(135deg,${PURPLE},${PINK})` : 'var(--bg-card)',
                  color: theme === t ? 'white' : 'var(--text-secondary)',
                }}>{themeIcon[t]} {t}</button>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
