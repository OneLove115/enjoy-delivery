'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Nav } from '../components/Nav';
import { Footer } from '../components/Footer';

const PURPLE = '#5A31F4';
const PINK   = '#FF0080';
const ORANGE = '#FF6B00';

type User = { id: string; name: string; email: string; avatarUrl?: string };

const tiles = [
  { icon: '🛍️', label: 'Bestellingen',   sub: 'Bekijk je ordergeschiedenis', href: '/account/orders',     color: '#1a2a5e' },
  { icon: '🎟️', label: 'Stempelkaart',   sub: 'Spaar punten voor gratis eten', href: '/account/stamp-card', color: '#1a3a1a' },
  { icon: '🎁', label: 'Cadeaukaarten',  sub: 'Verstuur of verzilver kaarten', href: '/account/gift-card',  color: '#3a1a1a' },
  { icon: '📍', label: 'Adressen',       sub: 'Beheer je bezorgadressen',      href: '/account/addresses',  color: '#2a1a3a' },
  { icon: '👤', label: 'Profiel',        sub: 'Naam, foto en voorkeuren',      href: '/account/profile',    color: '#1a2a2a' },
  { icon: '❓', label: 'Hulp nodig?',    sub: 'Chat met Joya of bekijk FAQ',   href: '/help',               color: '#1a1a3a' },
];

export default function AccountPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

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

  const initials = user?.name
    ? user.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
    : '?';

  return (
    <div style={{ background: 'var(--bg-page)', minHeight: '100vh', color: 'var(--text-primary)', fontFamily: 'Outfit, sans-serif' }}>
      <Nav />
      <div style={{ maxWidth: 600, margin: '0 auto', padding: '100px 20px 80px' }}>

        {/* Profile hero */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          style={{ display: 'flex', alignItems: 'center', gap: 20, marginBottom: 40, padding: '28px', background: 'var(--bg-card)', borderRadius: 20, border: '1px solid rgba(255,255,255,0.07)' }}>
          {user?.avatarUrl ? (
            <img src={user.avatarUrl} alt={user.name}
              style={{ width: 72, height: 72, borderRadius: '50%', objectFit: 'cover', flexShrink: 0, border: `2px solid ${PURPLE}` }} />
          ) : (
            <div style={{
              width: 72, height: 72, borderRadius: '50%', flexShrink: 0,
              background: `linear-gradient(135deg,${PURPLE},${PINK})`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 26, fontWeight: 900, color: 'var(--text-primary)',
            }}>
              {loading ? '…' : initials}
            </div>
          )}
          <div style={{ flex: 1, minWidth: 0 }}>
            {loading ? (
              <div style={{ height: 20, width: 140, background: 'rgba(255,255,255,0.08)', borderRadius: 8, marginBottom: 8 }} />
            ) : user ? (
              <>
                <div style={{ fontSize: 20, fontWeight: 900, marginBottom: 4 }}>{user.name}</div>
                <div style={{ fontSize: 14, color: 'var(--text-muted)' }}>{user.email}</div>
              </>
            ) : (
              <>
                <div style={{ fontSize: 17, fontWeight: 800, marginBottom: 10 }}>Nog niet ingelogd</div>
                <div style={{ display: 'flex', gap: 10 }}>
                  <Link href="/login" style={{ padding: '9px 22px', borderRadius: 24, background: `linear-gradient(135deg,${PURPLE},${PINK})`, color: 'var(--text-primary)', fontWeight: 800, fontSize: 14, textDecoration: 'none' }}>Inloggen</Link>
                  <Link href="/signup" style={{ padding: '9px 22px', borderRadius: 24, background: 'rgba(255,255,255,0.08)', color: 'var(--text-primary)', fontWeight: 700, fontSize: 14, textDecoration: 'none', border: '1px solid var(--border-strong)' }}>Registreren</Link>
                </div>
              </>
            )}
          </div>
          {user && (
            <Link href="/account/profile" style={{ padding: '8px 16px', borderRadius: 10, background: 'rgba(255,255,255,0.08)', border: '1px solid var(--border-strong)', color: 'rgba(255,255,255,0.7)', fontSize: 13, fontWeight: 700, textDecoration: 'none', flexShrink: 0 }}>
              Bewerken
            </Link>
          )}
        </motion.div>

        {/* Tiles grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 14, marginBottom: 32 }}>
          {tiles.map((t, i) => (
            <motion.div key={t.href} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
              <Link href={t.href} style={{ display: 'block', padding: '22px 20px', borderRadius: 18, background: t.color, border: '1px solid var(--border)', textDecoration: 'none', color: 'var(--text-primary)', transition: 'transform 0.15s, box-shadow 0.15s' }}
                onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.transform = 'translateY(-2px)'; (e.currentTarget as HTMLAnchorElement).style.boxShadow = '0 8px 24px rgba(0,0,0,0.4)'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.transform = ''; (e.currentTarget as HTMLAnchorElement).style.boxShadow = ''; }}>
                <div style={{ fontSize: 28, marginBottom: 10 }}>{t.icon}</div>
                <div style={{ fontSize: 15, fontWeight: 800, marginBottom: 4 }}>{t.label}</div>
                <div style={{ fontSize: 12, color: 'var(--text-muted)', lineHeight: 1.4 }}>{t.sub}</div>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Joya promo */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}
          style={{ padding: '24px', borderRadius: 20, background: `linear-gradient(135deg, rgba(90,49,244,0.15), rgba(255,0,128,0.08))`, border: '1px solid rgba(90,49,244,0.25)', marginBottom: 32, display: 'flex', alignItems: 'center', gap: 18 }}>
          <img src="/joya.jpg" alt="Joya" style={{ width: 60, height: 60, borderRadius: '50%', objectFit: 'cover', objectPosition: 'center top', flexShrink: 0 }} />
          <div>
            <div style={{ fontWeight: 900, fontSize: 16, marginBottom: 4 }}>Hulp nodig met bestellen?</div>
            <div style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 12 }}>Joya helpt je 24/7 met aanbevelingen, deals en bestellen.</div>
            <Link href="/help" style={{ padding: '8px 20px', borderRadius: 20, background: `linear-gradient(135deg,${PURPLE},${PINK})`, color: 'var(--text-primary)', fontWeight: 800, fontSize: 13, textDecoration: 'none' }}>
              Chat met Joya →
            </Link>
          </div>
        </motion.div>

        {/* Logout */}
        {user && (
          <div style={{ textAlign: 'center' }}>
            <button onClick={logout}
              style={{ background: 'none', border: '1px solid var(--border-strong)', borderRadius: 12, color: 'var(--text-muted)', fontSize: 14, fontWeight: 700, padding: '12px 28px', cursor: 'pointer', transition: 'all 0.2s' }}
              onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.color = '#EF4444'; (e.currentTarget as HTMLButtonElement).style.borderColor = '#EF4444'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.color = 'rgba(255,255,255,0.45)'; (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(255,255,255,0.12)'; }}>
              Uitloggen
            </button>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}
