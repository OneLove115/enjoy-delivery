'use client';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { t } from '@/lib/translations';

const PURPLE = '#5A31F4';
const PINK   = '#FF0080';

function getNavLinks() {
  return [
    { href: '/discover',     label: t('nav.order') },
    { href: '/how-it-works', label: t('nav.howItWorks') },
  ];
}

export function Nav() {
  const [user, setUser]       = useState<{ name: string; avatarUrl?: string } | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const pathname  = usePathname();
  const navLinks = getNavLinks();

  useEffect(() => {
    fetch('/api/auth/me').then(r => r.ok ? r.json() : null).then(setUser).catch(() => null);
  }, []);

  const signOut = () =>
    fetch('/api/auth/logout', { method: 'POST' }).then(() => { setUser(null); window.location.href = '/'; });

  return (
    <>
      <nav style={{
        position: 'absolute', top: 0, left: 0, right: 0, zIndex: 100,
        height: 70,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 32px',
        background: 'rgba(10,10,15,0.55)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        borderBottom: '1px solid rgba(255,255,255,0.08)',
      }}>
        {/* Logo */}
        <Link href="/" style={{ textDecoration: 'none', flexShrink: 0, display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 52, height: 52, borderRadius: '50%', overflow: 'hidden', flexShrink: 0 }}>
            <img src="/logo-enjoy.png" alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>
          <span style={{ color: 'white', fontSize: 22, fontWeight: 800, letterSpacing: '-0.5px' }}>EnJoy</span>
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
                }}>{t('nav.signOut')}</button>
              </>
            ) : (
              <>
                <Link href="/login" style={{ color: 'rgba(255,255,255,0.8)', fontSize: 14, fontWeight: 600 }}>{t('nav.signIn')}</Link>
                <Link href="/signup" style={{
                  background: `linear-gradient(135deg,${PURPLE},${PINK})`, color: 'white',
                  padding: '9px 20px', borderRadius: 10, fontSize: 14, fontWeight: 700,
                }}>{t('nav.getStarted')}</Link>
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
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ width: 44, height: 44, borderRadius: '50%', overflow: 'hidden', flexShrink: 0 }}>
                  <img src="/logo-enjoy.png" alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
                <span style={{ color: 'var(--text-primary)', fontSize: 20, fontWeight: 800, letterSpacing: '-0.5px' }}>EnJoy</span>
              </div>
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
                    {t('nav.myAccount')}
                  </Link>
                  <button onClick={signOut} style={{
                    background: 'var(--bg-card)', border: '1px solid var(--border)',
                    color: 'var(--text-primary)', padding: '13px', borderRadius: 12,
                    cursor: 'pointer', fontSize: 15, fontWeight: 600,
                  }}>{t('nav.signOut')}</button>
                </>
              ) : (
                <>
                  <Link href="/login" onClick={() => setDrawerOpen(false)} style={{
                    color: 'var(--text-primary)', fontSize: 16, fontWeight: 600,
                    textAlign: 'center', padding: '13px', border: '1px solid var(--border)', borderRadius: 12,
                  }}>{t('nav.signIn')}</Link>
                  <Link href="/signup" onClick={() => setDrawerOpen(false)} style={{
                    background: `linear-gradient(135deg,${PURPLE},${PINK})`, color: 'white',
                    padding: '13px', borderRadius: 12, fontSize: 15, fontWeight: 700, textAlign: 'center', display: 'block',
                  }}>{t('nav.getStarted')}</Link>
                </>
              )}
            </div>

          </div>
        </div>
      )}
    </>
  );
}
