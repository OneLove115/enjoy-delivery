'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';

const PURPLE = '#5A31F4';
const PINK = '#FF0080';
const ORANGE = '#FF6B35';

const API_URL = process.env.NEXT_PUBLIC_VP_DOMAIN || 'https://www.veloci.online';

type ShiftStatus = 'upcoming' | 'active' | 'completed';

interface ShiftCard {
  label: string;
  time?: string;
  status: ShiftStatus;
}

const STATUS_CONFIG: Record<ShiftStatus, { label: string; bg: string; color: string; dot: string }> = {
  upcoming: { label: 'Aankomend', bg: `${PURPLE}15`, color: PURPLE, dot: PURPLE },
  active:   { label: 'Actief',    bg: 'rgba(34,197,94,0.15)', color: '#22c55e', dot: '#22c55e' },
  completed:{ label: 'Afgerond', bg: 'rgba(148,163,184,0.12)', color: '#64748b', dot: '#64748b' },
};

function ShiftsSkeleton() {
  return (
    <div>
      <style>{`@keyframes shimmer { 0% { background-position: 200% 0; } 100% { background-position: -200% 0; } }`}</style>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 16, marginBottom: 28 }}>
        {[0,1,2,3].map(i => (
          <div key={i} style={{ background: 'var(--bg-elevated)', borderRadius: 18, border: '1px solid var(--border)', height: 84, animation: 'shimmer 1.8s infinite', backgroundImage: 'linear-gradient(90deg, var(--bg-elevated) 25%, var(--border) 50%, var(--bg-elevated) 75%)', backgroundSize: '200% 100%' }} />
        ))}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 16 }}>
        {[0,1,2].map(i => (
          <div key={i} style={{ background: 'var(--bg-elevated)', borderRadius: 18, border: '1px solid var(--border)', height: 120, animation: 'shimmer 1.8s infinite', backgroundImage: 'linear-gradient(90deg, var(--bg-elevated) 25%, var(--border) 50%, var(--bg-elevated) 75%)', backgroundSize: '200% 100%' }} />
        ))}
      </div>
    </div>
  );
}

const cardVariants = {
  hidden: { opacity: 0, y: 18 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.4, delay: i * 0.07, ease: [0.22, 1, 0.36, 1] },
  }),
};

export default function RiderShiftsPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState<string | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('enjoy-rider-token');
    if (!token) { router.replace('/rider-portal'); return; }

    fetch(`${API_URL}/api/riders/status`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(async res => {
        if (res.status === 401) {
          localStorage.removeItem('enjoy-rider-token');
          router.replace('/rider-portal?expired=true');
          return;
        }
        if (!res.ok) throw new Error('Kan gegevens niet ophalen');
        return res.json();
      })
      .then(json => { if (json) setStatus(json.status); })
      .catch(err => setError(err.message || 'Netwerkfout'))
      .finally(() => setLoading(false));
  }, [router]);

  const card: React.CSSProperties = {
    background: 'var(--bg-card)', borderRadius: 20,
    border: '1px solid var(--border)', padding: 'clamp(20px,4vw,32px)', marginBottom: 24,
  };

  const statCards = [
    { label: 'Bevestigde diensten', value: '0', icon: '✅', color: '#22c55e' },
    { label: 'Open slots', value: '0', icon: '📭', color: ORANGE },
    { label: 'Swap verzoeken', value: '0', icon: '🔄', color: PURPLE },
    { label: 'Uren deze week', value: '0u', icon: '⏱️', color: PINK },
  ];

  return (
    <div style={{ minHeight: '100vh', color: 'var(--text-primary)', fontFamily: 'Outfit, sans-serif' }}>
      {/* Background glow */}
      <div style={{
        position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0,
        background: `radial-gradient(ellipse at 60% 0%, ${PURPLE}10 0%, transparent 55%)`,
      }} />

      <div style={{ position: 'relative', zIndex: 1, maxWidth: 900, margin: '0 auto', padding: 'clamp(32px,5vw,56px) clamp(16px,4vw,40px)' }}>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          style={{ marginBottom: 36 }}
        >
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 8, fontSize: 12, fontWeight: 700,
            color: PURPLE, background: `${PURPLE}15`, padding: '4px 12px', borderRadius: 20,
            marginBottom: 12, border: `1px solid ${PURPLE}25`,
          }}>
            📅 Diensten
          </div>
          <h1 style={{ fontSize: 'clamp(26px,5vw,42px)', fontWeight: 950, letterSpacing: -1.5, marginBottom: 8, lineHeight: 1.1 }}>
            Diensten
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: 16, margin: 0 }}>
            Beheer je diensten en claim beschikbare shiften.
          </p>
        </motion.div>

        {loading ? <ShiftsSkeleton /> : error ? (
          <div style={{ ...card, borderColor: 'rgba(239,68,68,0.3)', color: '#ef4444' }}>{error}</div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            {/* Stat cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 16, marginBottom: 28 }}>
              {statCards.map((stat, i) => (
                <motion.div
                  key={stat.label}
                  custom={i}
                  variants={cardVariants}
                  initial="hidden"
                  animate="visible"
                  whileHover={{ y: -4, boxShadow: `0 10px 30px ${stat.color}20` }}
                  style={{
                    background: 'var(--bg-card)', borderRadius: 18,
                    border: '1px solid var(--border)', padding: '18px 20px',
                    position: 'relative', overflow: 'hidden', cursor: 'default',
                    transition: 'border-color 0.2s',
                  }}
                >
                  <div style={{
                    position: 'absolute', top: 0, right: 0, width: 72, height: 72,
                    background: `radial-gradient(circle at top right, ${stat.color}14, transparent 70%)`,
                  }} />
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
                    <p style={{
                      fontSize: 24, fontWeight: 950, letterSpacing: -0.5, margin: 0,
                      background: `linear-gradient(135deg,${PURPLE},${PINK})`,
                      WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                    }}>
                      {stat.value}
                    </p>
                    <span style={{ fontSize: 20 }}>{stat.icon}</span>
                  </div>
                  <p style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 700, margin: 0, textTransform: 'uppercase', letterSpacing: 0.5 }}>{stat.label}</p>
                </motion.div>
              ))}
            </div>

            {/* Placeholder shift cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 16, marginBottom: 24 }}>
              {(['upcoming', 'upcoming', 'completed'] as ShiftStatus[]).map((s, i) => {
                const cfg = STATUS_CONFIG[s];
                return (
                  <motion.div
                    key={i}
                    custom={i + 4}
                    variants={cardVariants}
                    initial="hidden"
                    animate="visible"
                    whileHover={{ y: -4, boxShadow: `0 12px 40px ${PURPLE}15` }}
                    style={{
                      background: 'var(--bg-card)', borderRadius: 18,
                      border: '1px solid var(--border)', padding: '20px 22px',
                      cursor: 'default', transition: 'border-color 0.2s, box-shadow 0.2s',
                      opacity: 0.45,
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14 }}>
                      <div>
                        <p style={{ fontSize: 15, fontWeight: 800, margin: '0 0 4px' }}>Geen dienst</p>
                        <p style={{ fontSize: 13, color: 'var(--text-muted)', margin: 0 }}>— : — – — : —</p>
                      </div>
                      <span style={{
                        fontSize: 11, fontWeight: 800, padding: '4px 10px', borderRadius: 20,
                        background: cfg.bg, color: cfg.color,
                        display: 'inline-flex', alignItems: 'center', gap: 5,
                      }}>
                        <span style={{ width: 5, height: 5, borderRadius: '50%', background: cfg.dot, display: 'inline-block' }} />
                        {cfg.label}
                      </span>
                    </div>
                    <div style={{ display: 'flex', gap: 16, fontSize: 13, color: 'var(--text-muted)' }}>
                      <span>📍 —</span>
                      <span>⏱️ — uur</span>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* Empty state */}
            <motion.div
              custom={7}
              variants={cardVariants}
              initial="hidden"
              animate="visible"
              style={card}
            >
              <div style={{ textAlign: 'center', padding: '36px 20px' }}>
                <div style={{
                  width: 72, height: 72, borderRadius: '50%', margin: '0 auto 20px',
                  background: `linear-gradient(135deg, ${PURPLE}20, ${PINK}15)`,
                  border: `1px solid ${PURPLE}25`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 32,
                }}>
                  📅
                </div>
                <h2 style={{ fontSize: 20, fontWeight: 800, marginBottom: 12 }}>Nog geen diensten beschikbaar</h2>
                <p style={{ color: 'var(--text-muted)', fontSize: 15, lineHeight: 1.7, maxWidth: 440, margin: '0 auto 20px' }}>
                  Zodra je account is goedgekeurd en restaurants in jouw regio actief zijn,
                  kun je hier diensten claimen, ruilen en beheren.
                </p>
                {status && status !== 'approved' && (
                  <div style={{
                    padding: '12px 20px', background: `${PURPLE}10`,
                    borderRadius: 12, border: `1px solid ${PURPLE}20`, display: 'inline-block',
                  }}>
                    <p style={{ fontSize: 13, color: PURPLE, fontWeight: 700, margin: 0 }}>
                      Account status: {status === 'pending' ? 'in behandeling' : status}
                    </p>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
