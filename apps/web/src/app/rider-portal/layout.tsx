'use client';
import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';

const PURPLE = '#5A31F4';
const PINK = '#FF0080';
const ORANGE = '#FF6B00';

const navItems = [
  { href: '/rider-portal/dashboard', label: 'Dashboard', icon: HomeIcon },
  { href: '/rider-portal/shifts', label: 'Diensten', icon: CalendarIcon },
  { href: '/rider-portal/earnings', label: 'Verdiensten', icon: EuroIcon },
  { href: '/rider-portal/profile', label: 'Profiel', icon: UserIcon },
];

function HomeIcon({ active }: { active: boolean }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={active ? 'white' : 'currentColor'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      <polyline points="9 22 9 12 15 12 15 22" />
    </svg>
  );
}

function CalendarIcon({ active }: { active: boolean }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={active ? 'white' : 'currentColor'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  );
}

function EuroIcon({ active }: { active: boolean }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={active ? 'white' : 'currentColor'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 10h12M4 14h12M19.5 6.5A7.5 7.5 0 1 0 19.5 17.5" />
    </svg>
  );
}

function UserIcon({ active }: { active: boolean }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={active ? 'white' : 'currentColor'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );
}

function LogoutIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <polyline points="16 17 21 12 16 7" />
      <line x1="21" y1="12" x2="9" y2="12" />
    </svg>
  );
}

export default function RiderPortalLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [checked, setChecked] = useState(false);

  // Login page does not use this layout shell
  const isLoginPage = pathname === '/rider-portal';

  useEffect(() => {
    if (isLoginPage) {
      setChecked(true);
      return;
    }
    const token = typeof window !== 'undefined' ? localStorage.getItem('enjoy-rider-token') : null;
    if (!token) {
      router.replace('/rider-portal');
    } else {
      setChecked(true);
    }
  }, [isLoginPage, router]);

  const handleLogout = () => {
    localStorage.removeItem('enjoy-rider-token');
    router.push('/rider-portal');
  };

  // Login page: render plain (no sidebar)
  if (isLoginPage) {
    return <>{children}</>;
  }

  if (!checked) {
    return (
      <div style={{ background: 'var(--bg-page)', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Outfit, sans-serif' }}>
        <div style={{ display: 'inline-block', width: 48, height: 48, border: `3px solid ${PURPLE}30`, borderTopColor: PURPLE, borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  return (
    <div style={{ background: 'var(--bg-page)', minHeight: '100vh', color: 'var(--text-primary)', fontFamily: 'Outfit, sans-serif', display: 'flex' }}>
      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        .rp-sidebar { display: flex; }
        .rp-bottom-tabs { display: none; }
        .rp-main { margin-left: 260px; flex: 1; }
        @media (max-width: 768px) {
          .rp-sidebar { display: none; }
          .rp-bottom-tabs { display: flex; }
          .rp-main { margin-left: 0; padding-bottom: 80px; }
        }
      `}</style>

      {/* Sidebar — desktop */}
      <aside className="rp-sidebar" style={{
        position: 'fixed', top: 0, left: 0, bottom: 0, width: 260,
        background: 'var(--bg-card)', borderRight: '1px solid var(--border)',
        flexDirection: 'column', zIndex: 100, padding: '0 0 24px',
      }}>
        {/* Logo */}
        <div style={{ padding: '24px 24px 20px', borderBottom: '1px solid var(--border)' }}>
          <Link href="/" style={{ textDecoration: 'none' }}>
            <span style={{ fontSize: 22, fontWeight: 900, color: 'var(--text-primary)' }}>
              En<span style={{ background: `linear-gradient(135deg,${PURPLE},${PINK})`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Joy</span>
            </span>
          </Link>
          <div style={{ marginTop: 6, display: 'flex', alignItems: 'center', gap: 6 }}>
            <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#22c55e' }} />
            <span style={{ fontSize: 12, color: 'var(--text-muted)', fontWeight: 600 }}>Rider Portal</span>
          </div>
        </div>

        {/* Nav links */}
        <nav style={{ flex: 1, padding: '16px 12px', display: 'flex', flexDirection: 'column', gap: 4 }}>
          {navItems.map(item => {
            const active = pathname === item.href || pathname.startsWith(item.href + '/');
            const Icon = item.icon;
            return (
              <Link key={item.href} href={item.href} style={{
                display: 'flex', alignItems: 'center', gap: 12,
                padding: '11px 14px', borderRadius: 12, textDecoration: 'none',
                background: active ? `linear-gradient(135deg,${PURPLE},${PINK})` : 'transparent',
                color: active ? 'white' : 'var(--text-secondary)',
                fontSize: 15, fontWeight: active ? 700 : 500,
                transition: 'all 0.15s',
                boxShadow: active ? `0 4px 16px ${PURPLE}35` : 'none',
              }}>
                <Icon active={active} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Logout */}
        <div style={{ padding: '0 12px' }}>
          <button onClick={handleLogout} style={{
            display: 'flex', alignItems: 'center', gap: 12, width: '100%',
            padding: '11px 14px', borderRadius: 12, border: 'none',
            background: 'transparent', color: 'var(--text-muted)',
            fontSize: 15, fontWeight: 500, cursor: 'pointer', textAlign: 'left',
          }}>
            <LogoutIcon />
            Uitloggen
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="rp-main" style={{ minHeight: '100vh' }}>
        {children}
      </main>

      {/* Bottom tabs — mobile */}
      <nav className="rp-bottom-tabs" style={{
        position: 'fixed', bottom: 0, left: 0, right: 0, height: 72,
        background: 'var(--bg-card)', borderTop: '1px solid var(--border)',
        alignItems: 'center', justifyContent: 'space-around', zIndex: 100,
        paddingBottom: 'env(safe-area-inset-bottom)',
      }}>
        {navItems.map(item => {
          const active = pathname === item.href || pathname.startsWith(item.href + '/');
          const Icon = item.icon;
          return (
            <Link key={item.href} href={item.href} style={{
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
              textDecoration: 'none', flex: 1, padding: '10px 0',
              color: active ? PURPLE : 'var(--text-muted)',
            }}>
              <div style={{
                width: 36, height: 36, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: active ? `linear-gradient(135deg,${PURPLE},${PINK})` : 'transparent',
              }}>
                <Icon active={active} />
              </div>
              <span style={{ fontSize: 11, fontWeight: active ? 700 : 500 }}>{item.label}</span>
            </Link>
          );
        })}
        <button onClick={handleLogout} style={{
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
          border: 'none', background: 'none', cursor: 'pointer', flex: 1, padding: '10px 0',
          color: 'var(--text-muted)',
        }}>
          <div style={{ width: 36, height: 36, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <LogoutIcon />
          </div>
          <span style={{ fontSize: 11, fontWeight: 500 }}>Uitloggen</span>
        </button>
      </nav>
    </div>
  );
}
