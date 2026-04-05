'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Nav } from '../components/Nav';
import { Footer } from '../components/Footer';
import { useTheme } from '../context/ThemeContext';

const PURPLE = '#5A31F4';
const PINK   = '#FF0080';
const ORANGE = '#FF6B35';

type User = { id: string; name: string; email: string; avatarUrl?: string };

const tiles = [
  {
    icon: (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/>
      </svg>
    ),
    label: 'Bestellingen',
    sub: 'Bekijk je ordergeschiedenis',
    href: '/account/orders',
    accent: PURPLE,
    bg: 'rgba(90,49,244,0.10)',
    border: 'rgba(90,49,244,0.22)',
  },
  {
    icon: (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/>
      </svg>
    ),
    label: 'Stempelkaart',
    sub: 'Spaar punten voor gratis eten',
    href: '/account/stamp-card',
    accent: PINK,
    bg: 'rgba(255,0,128,0.10)',
    border: 'rgba(255,0,128,0.22)',
  },
  {
    icon: (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="20 12 20 22 4 22 4 12"/><rect x="2" y="7" width="20" height="5"/><path d="M12 22V7M12 7H7.5a2.5 2.5 0 010-5C11 2 12 7 12 7zM12 7h4.5a2.5 2.5 0 000-5C13 2 12 7 12 7z"/>
      </svg>
    ),
    label: 'Cadeaukaarten',
    sub: 'Verstuur of verzilver kaarten',
    href: '/account/gift-card',
    accent: ORANGE,
    bg: 'rgba(255,107,53,0.10)',
    border: 'rgba(255,107,53,0.22)',
  },
  {
    icon: (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/>
      </svg>
    ),
    label: 'Adressen',
    sub: 'Beheer je bezorgadressen',
    href: '/account/addresses',
    accent: '#22C55E',
    bg: 'rgba(34,197,94,0.10)',
    border: 'rgba(34,197,94,0.22)',
  },
  {
    icon: (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/>
      </svg>
    ),
    label: 'Profiel',
    sub: 'Naam, foto en voorkeuren',
    href: '/account/profile',
    accent: '#60A5FA',
    bg: 'rgba(96,165,250,0.10)',
    border: 'rgba(96,165,250,0.22)',
  },
  {
    icon: (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/>
      </svg>
    ),
    label: 'Hulp nodig?',
    sub: 'Chat met Joya of bekijk FAQ',
    href: '/help',
    accent: '#A78BFA',
    bg: 'rgba(167,139,250,0.10)',
    border: 'rgba(167,139,250,0.22)',
  },
];

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.07 } },
};

const tileVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] } },
};

export default function AccountPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [hoveredTile, setHoveredTile] = useState<string | null>(null);
  const [totalOrders] = useState(12);
  const [loyaltyPoints] = useState(7);
  const [savedAddresses] = useState(2);

  useEffect(() => {
    fetch('/api/auth/me')
      .then(r => r.ok ? r.json() : null)
      .then(u => { setUser(u); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const logout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/');
  };

  const { theme, setTheme } = useTheme();

  const initials = user?.name
    ? user.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
    : '?';

  return (
    <div style={{ background: 'var(--bg-page)', minHeight: '100vh', color: 'var(--text-primary)', fontFamily: 'Outfit, sans-serif' }}>
      <style>{`
        @keyframes avatarPulse {
          0%, 100% { box-shadow: 0 0 0 0 rgba(90,49,244,0.5); }
          50% { box-shadow: 0 0 0 8px rgba(90,49,244,0); }
        }
        @keyframes gradientShift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        @keyframes shimmer {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
      `}</style>
      <Nav />
      <div style={{ maxWidth: 640, margin: '0 auto', padding: '100px 20px 80px' }}>

        {/* Profile hero */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
          style={{
            display: 'flex', alignItems: 'center', gap: 20, marginBottom: 28,
            padding: '28px 30px',
            background: 'var(--bg-card)',
            borderRadius: 24,
            border: '1px solid rgba(255,255,255,0.07)',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          {/* Subtle gradient background accent */}
          <div style={{
            position: 'absolute', inset: 0, pointerEvents: 'none',
            background: `radial-gradient(ellipse at top left, rgba(90,49,244,0.08) 0%, transparent 60%)`,
          }} />

          {/* Animated avatar */}
          {user?.avatarUrl ? (
            <motion.img
              src={user.avatarUrl}
              alt={user.name}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              style={{
                width: 76, height: 76, borderRadius: '50%', objectFit: 'cover', flexShrink: 0,
                border: `2.5px solid transparent`,
                backgroundImage: `linear-gradient(var(--bg-card), var(--bg-card)), linear-gradient(135deg,${PURPLE},${PINK})`,
                backgroundOrigin: 'border-box',
                backgroundClip: 'padding-box, border-box',
                animation: 'avatarPulse 3s ease-in-out infinite',
              }}
            />
          ) : (
            <motion.div
              initial={{ scale: 0.7, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.1, type: 'spring', stiffness: 200 }}
              style={{
                width: 76, height: 76, borderRadius: '50%', flexShrink: 0,
                background: `linear-gradient(135deg,${PURPLE},${PINK})`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 26, fontWeight: 900, color: '#fff',
                boxShadow: `0 0 0 3px rgba(90,49,244,0.2), 0 8px 24px rgba(90,49,244,0.3)`,
                animation: 'avatarPulse 3s ease-in-out infinite',
                position: 'relative',
              }}
            >
              <div style={{
                position: 'absolute', inset: -3, borderRadius: '50%',
                background: `linear-gradient(135deg,${PURPLE},${PINK},${ORANGE})`,
                backgroundSize: '200% 200%',
                animation: 'gradientShift 3s ease infinite',
                zIndex: -1,
              }} />
              {loading ? '…' : initials}
            </motion.div>
          )}

          <div style={{ flex: 1, minWidth: 0, position: 'relative' }}>
            {loading ? (
              <>
                <div style={{ height: 22, width: 150, background: 'rgba(255,255,255,0.08)', borderRadius: 8, marginBottom: 10, animation: 'shimmer 1.8s ease-in-out infinite' }} />
                <div style={{ height: 14, width: 200, background: 'rgba(255,255,255,0.05)', borderRadius: 6 }} />
              </>
            ) : user ? (
              <>
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                  style={{ fontSize: 22, fontWeight: 900, marginBottom: 4, letterSpacing: '-0.3px' }}
                >
                  {user.name}
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.28 }}
                  style={{ fontSize: 14, color: 'var(--text-muted)' }}
                >
                  {user.email}
                </motion.div>
              </>
            ) : (
              <>
                <div style={{ fontSize: 17, fontWeight: 800, marginBottom: 10 }}>Nog niet ingelogd</div>
                <div style={{ display: 'flex', gap: 10 }}>
                  <Link href="/login" style={{ padding: '9px 22px', borderRadius: 24, background: `linear-gradient(135deg,${PURPLE},${PINK})`, color: '#fff', fontWeight: 800, fontSize: 14, textDecoration: 'none' }}>Inloggen</Link>
                  <Link href="/signup" style={{ padding: '9px 22px', borderRadius: 24, background: 'rgba(255,255,255,0.08)', color: 'var(--text-primary)', fontWeight: 700, fontSize: 14, textDecoration: 'none', border: '1px solid var(--border-strong)' }}>Registreren</Link>
                </div>
              </>
            )}
          </div>
          {user && (
            <Link
              href="/account/profile"
              style={{ padding: '9px 18px', borderRadius: 12, background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.10)', color: 'rgba(255,255,255,0.65)', fontSize: 13, fontWeight: 700, textDecoration: 'none', flexShrink: 0, transition: 'all 0.2s', whiteSpace: 'nowrap' }}
              onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.background = `rgba(90,49,244,0.18)`; (e.currentTarget as HTMLAnchorElement).style.borderColor = `rgba(90,49,244,0.35)`; (e.currentTarget as HTMLAnchorElement).style.color = '#fff'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.background = 'rgba(255,255,255,0.06)'; (e.currentTarget as HTMLAnchorElement).style.borderColor = 'rgba(255,255,255,0.10)'; (e.currentTarget as HTMLAnchorElement).style.color = 'rgba(255,255,255,0.65)'; }}
            >
              Bewerken
            </Link>
          )}
        </motion.div>

        {/* Quick stats */}
        {user && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.18, duration: 0.4 }}
            style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 28 }}
          >
            {[
              { label: 'Bestellingen', value: totalOrders, icon: '🛍️', accent: PURPLE },
              { label: 'Stempels', value: loyaltyPoints, icon: '⭐', accent: PINK },
              { label: 'Adressen', value: savedAddresses, icon: '📍', accent: ORANGE },
            ].map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.22 + i * 0.06 }}
                style={{
                  padding: '18px 14px', borderRadius: 18,
                  background: 'var(--bg-card)',
                  border: '1px solid rgba(255,255,255,0.06)',
                  textAlign: 'center',
                }}
              >
                <div style={{ fontSize: 22, marginBottom: 8 }}>{stat.icon}</div>
                <div style={{ fontSize: 26, fontWeight: 900, color: stat.accent, marginBottom: 4, lineHeight: 1 }}>
                  {stat.value}
                </div>
                <div style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* Tiles grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(270px, 1fr))', gap: 14, marginBottom: 28 }}
        >
          {tiles.map((t) => (
            <motion.div key={t.href} variants={tileVariants}>
              <Link
                href={t.href}
                style={{
                  display: 'block', padding: '22px 22px', borderRadius: 20,
                  background: t.bg,
                  border: `1px solid ${hoveredTile === t.href ? t.border : 'rgba(255,255,255,0.06)'}`,
                  textDecoration: 'none', color: 'var(--text-primary)',
                  transform: hoveredTile === t.href ? 'translateY(-3px)' : 'translateY(0)',
                  boxShadow: hoveredTile === t.href ? `0 12px 32px rgba(0,0,0,0.35)` : 'none',
                  transition: 'transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease, background 0.2s ease',
                }}
                onMouseEnter={() => setHoveredTile(t.href)}
                onMouseLeave={() => setHoveredTile(null)}
              >
                <div style={{
                  width: 48, height: 48, borderRadius: 14, marginBottom: 14,
                  background: `${t.accent}20`,
                  border: `1px solid ${t.accent}40`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: t.accent,
                  transition: 'background 0.2s ease',
                }}>
                  {t.icon}
                </div>
                <div style={{ fontSize: 15, fontWeight: 800, marginBottom: 4 }}>{t.label}</div>
                <div style={{ fontSize: 12, color: 'var(--text-muted)', lineHeight: 1.5 }}>{t.sub}</div>
              </Link>
            </motion.div>
          ))}
        </motion.div>

        {/* Weergave / Modus */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          style={{ padding: '20px 22px', borderRadius: 18, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', marginBottom: 20 }}
        >
          <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', marginBottom: 14, textTransform: 'uppercase', letterSpacing: '1px' }}>Weergave</div>
          <div style={{ display: 'flex', gap: 8 }}>
            {(['dark', 'light', 'system'] as const).map(t => {
              const icons: Record<string, string> = { dark: '🌙', light: '☀️', system: '💻' };
              const labels: Record<string, string> = { dark: 'Donker', light: 'Licht', system: 'Systeem' };
              return (
                <button
                  key={t}
                  onClick={() => { setTheme(t); localStorage.setItem('enjoy-theme', t); }}
                  style={{
                    flex: 1, padding: '11px 6px', borderRadius: 12, fontSize: 13, fontWeight: 700,
                    cursor: 'pointer', border: theme === t ? 'none' : '1px solid rgba(255,255,255,0.08)',
                    background: theme === t ? `linear-gradient(135deg,${PURPLE},${PINK})` : 'rgba(255,255,255,0.04)',
                    color: theme === t ? '#fff' : 'var(--text-secondary)',
                    transition: 'all 0.2s',
                    fontFamily: 'Outfit, sans-serif',
                  }}
                >
                  {icons[t]} {labels[t]}
                </button>
              );
            })}
          </div>
        </motion.div>

        {/* Joya promo */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.55 }}
          style={{
            padding: '24px', borderRadius: 20,
            background: `linear-gradient(135deg, rgba(90,49,244,0.13), rgba(255,0,128,0.07))`,
            border: '1px solid rgba(90,49,244,0.22)',
            marginBottom: 32, display: 'flex', alignItems: 'center', gap: 18,
          }}
        >
          <img src="/joya.jpg" alt="Joya" style={{ width: 60, height: 60, borderRadius: '50%', objectFit: 'cover', objectPosition: 'center top', flexShrink: 0, boxShadow: `0 0 0 2px ${PINK}40` }} />
          <div>
            <div style={{ fontWeight: 900, fontSize: 16, marginBottom: 4 }}>Hulp nodig met bestellen?</div>
            <div style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 12 }}>Joya helpt je 24/7 met aanbevelingen, deals en bestellen.</div>
            <Link href="/help" style={{ padding: '8px 20px', borderRadius: 20, background: `linear-gradient(135deg,${PURPLE},${PINK})`, color: '#fff', fontWeight: 800, fontSize: 13, textDecoration: 'none' }}>
              Chat met Joya →
            </Link>
          </div>
        </motion.div>

        {/* Logout */}
        {user && (
          <div style={{ textAlign: 'center' }}>
            <button
              onClick={logout}
              style={{ background: 'none', border: '1px solid rgba(255,255,255,0.10)', borderRadius: 12, color: 'rgba(255,255,255,0.4)', fontSize: 14, fontWeight: 700, padding: '12px 28px', cursor: 'pointer', transition: 'all 0.2s', fontFamily: 'Outfit, sans-serif' }}
              onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.color = '#EF4444'; (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(239,68,68,0.4)'; (e.currentTarget as HTMLButtonElement).style.background = 'rgba(239,68,68,0.06)'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.color = 'rgba(255,255,255,0.4)'; (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(255,255,255,0.10)'; (e.currentTarget as HTMLButtonElement).style.background = 'none'; }}
            >
              Uitloggen
            </button>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}
