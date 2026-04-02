'use client';
import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';

const PURPLE = '#5A31F4';
const PINK = '#FF0080';
const ORANGE = '#FF6B00';

const navItems = [
  {
    href: '/business-portal/dashboard',
    label: 'Dashboard',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" />
        <rect x="14" y="14" width="7" height="7" /><rect x="3" y="14" width="7" height="7" />
      </svg>
    ),
  },
  {
    href: '/business-portal/orders',
    label: 'Bestellingen',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" /><line x1="3" y1="6" x2="21" y2="6" />
        <path d="M16 10a4 4 0 01-8 0" />
      </svg>
    ),
  },
  {
    href: '/business-portal/invoices',
    label: 'Facturen',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
        <polyline points="14,2 14,8 20,8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /><polyline points="10,9 9,9 8,9" />
      </svg>
    ),
  },
  {
    href: '/business-portal/budget',
    label: 'Budget',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="12" y1="1" x2="12" y2="23" /><path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" />
      </svg>
    ),
  },
  {
    href: '/business-portal/events',
    label: 'Evenementen',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" />
        <line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
      </svg>
    ),
  },
  {
    href: '/business-portal/team',
    label: 'Team',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" /><circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 00-3-3.87" /><path d="M16 3.13a4 4 0 010 7.75" />
      </svg>
    ),
  },
  {
    href: '/business-portal/settings',
    label: 'Instellingen',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="3" />
        <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z" />
      </svg>
    ),
  },
];

export default function BusinessPortalLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [company, setCompany] = useState('TechCorp BV');
  const [mounted, setMounted] = useState(false);

  const isLoginPage = pathname === '/business-portal';

  useEffect(() => {
    setMounted(true);

    if (isLoginPage) return;

    const token = localStorage.getItem('enjoy-business-token');
    if (!token) {
      router.replace('/business-portal');
      return;
    }
    const storedCompany = localStorage.getItem('enjoy-business-company');
    if (storedCompany) setCompany(storedCompany);

    // Validate token by calling dashboard API
    const apiUrl = process.env.NEXT_PUBLIC_VP_DOMAIN || 'https://veloci.online';
    fetch(`${apiUrl}/api/business-portal/dashboard`, { headers: { Authorization: `Bearer ${token}` } })
      .then(r => {
        if (!r.ok) {
          localStorage.removeItem('enjoy-business-token');
          localStorage.removeItem('enjoy-business-company');
          router.replace('/business-portal?expired=true');
        }
      })
      .catch(() => {
        localStorage.removeItem('enjoy-business-token');
        localStorage.removeItem('enjoy-business-company');
        router.replace('/business-portal?expired=true');
      });
  }, [router, isLoginPage]);

  const handleLogout = () => {
    localStorage.removeItem('enjoy-business-token');
    localStorage.removeItem('enjoy-business-company');
    router.push('/business-portal');
  };

  if (!mounted) return null;

  const isActive = (href: string) => pathname === href || pathname.startsWith(href + '/');

  // Login page: render plain (no sidebar)
  if (isLoginPage) {
    return <>{children}</>;
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg-page)', fontFamily: 'Outfit, sans-serif', color: 'var(--text-primary)' }}>

      {/* Desktop sidebar */}
      <aside style={{
        width: 260, flexShrink: 0,
        background: 'var(--bg-elevated)',
        borderRight: '1px solid var(--border)',
        display: 'flex', flexDirection: 'column',
        position: 'sticky', top: 0, height: '100vh', overflowY: 'auto',
      }} className="bp-sidebar">

        {/* Sidebar header */}
        <div style={{ padding: '28px 24px 20px', borderBottom: '1px solid var(--border)' }}>
          <Link href="/" style={{ textDecoration: 'none', display: 'block', marginBottom: 20 }}>
            <img src="/logo-enjoy.png" alt="EnJoy" style={{ height: 40 }} />
          </Link>
          <div style={{
            display: 'flex', alignItems: 'center', gap: 12,
            background: 'rgba(90,49,244,0.08)', borderRadius: 12,
            padding: '12px 14px', border: `1px solid ${PURPLE}25`,
          }}>
            <div style={{
              width: 36, height: 36, borderRadius: 10, flexShrink: 0,
              background: `linear-gradient(135deg,${PURPLE},${PINK})`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 16, fontWeight: 900, color: 'white',
            }}>
              {company[0]?.toUpperCase() || 'B'}
            </div>
            <div style={{ overflow: 'hidden' }}>
              <p style={{ fontWeight: 800, fontSize: 14, margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{company}</p>
              <p style={{ color: 'var(--text-muted)', fontSize: 12, margin: 0 }}>Business account</p>
            </div>
          </div>
        </div>

        {/* Nav links */}
        <nav style={{ padding: '16px 12px', flex: 1 }}>
          <p style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', letterSpacing: 1.2, textTransform: 'uppercase', padding: '0 12px', marginBottom: 8 }}>
            Navigatie
          </p>
          {navItems.map(item => {
            const active = isActive(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                style={{
                  display: 'flex', alignItems: 'center', gap: 12,
                  padding: '11px 12px', borderRadius: 12, marginBottom: 2,
                  color: active ? 'white' : 'var(--text-secondary)',
                  background: active ? `linear-gradient(135deg,${PURPLE},${PINK})` : 'transparent',
                  fontWeight: active ? 700 : 500,
                  fontSize: 14,
                  boxShadow: active ? `0 4px 14px ${PURPLE}40` : 'none',
                  transition: 'all 0.15s',
                }}
              >
                {item.icon}
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Logout */}
        <div style={{ padding: '16px 12px', borderTop: '1px solid var(--border)' }}>
          <button
            onClick={handleLogout}
            style={{
              width: '100%', display: 'flex', alignItems: 'center', gap: 12,
              padding: '11px 12px', borderRadius: 12, border: 'none', cursor: 'pointer',
              background: 'transparent', color: 'var(--text-secondary)',
              fontFamily: 'Outfit, sans-serif', fontWeight: 600, fontSize: 14,
            }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" />
              <polyline points="16,17 21,12 16,7" /><line x1="21" y1="12" x2="9" y2="12" />
            </svg>
            Uitloggen
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main style={{ flex: 1, overflowY: 'auto', paddingBottom: 80 }} className="bp-main">
        {children}
      </main>

      {/* Mobile bottom tab bar */}
      <nav style={{
        display: 'none', position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 200,
        background: 'var(--bg-elevated)', borderTop: '1px solid var(--border)',
        padding: '8px 0 calc(8px + env(safe-area-inset-bottom))',
      }} className="bp-bottom-nav">
        {navItems.slice(0, 5).map(item => {
          const active = isActive(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              style={{
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
                flex: 1, padding: '4px 0',
                color: active ? PURPLE : 'var(--text-muted)',
                fontSize: 10, fontWeight: active ? 700 : 500,
              }}
            >
              {item.icon}
              {item.label}
            </Link>
          );
        })}
      </nav>

      <style>{`
        @media (max-width: 768px) {
          .bp-sidebar { display: none !important; }
          .bp-bottom-nav { display: flex !important; }
          .bp-main { padding-bottom: 80px !important; }
        }
      `}</style>
    </div>
  );
}
