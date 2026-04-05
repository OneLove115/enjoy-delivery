'use client';
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';

const PURPLE = '#5A31F4';
const PINK = '#FF0080';
const ORANGE = '#FF6B35';

const API_URL = process.env.NEXT_PUBLIC_VP_DOMAIN || 'https://www.veloci.online';

interface EarningsData {
  status: string;
  name?: string;
}

function AnimatedEuro({ value }: { value: string }) {
  const ref = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let start = 0;
    const end = 0;
    const duration = 1000;
    const startTime = performance.now();

    const tick = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = start + (end - start) * eased;
      el.textContent = `€${current.toFixed(2).replace('.', ',')}`;
      if (progress < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, []);

  return (
    <p
      ref={ref}
      style={{
        fontSize: 28, fontWeight: 950, letterSpacing: -1, margin: '0 0 4px',
        background: `linear-gradient(135deg,${PURPLE},${PINK})`,
        WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
      }}
    >
      {value}
    </p>
  );
}

function EarningsSkeleton() {
  return (
    <div>
      <style>{`@keyframes shimmer { 0% { background-position: 200% 0; } 100% { background-position: -200% 0; } }`}</style>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 16, marginBottom: 24 }}>
        {[0,1,2].map(i => (
          <div key={i} style={{ background: 'var(--bg-elevated)', borderRadius: 18, border: '1px solid var(--border)', padding: '22px 24px', height: 96, animation: 'shimmer 1.8s infinite', backgroundImage: 'linear-gradient(90deg, var(--bg-elevated) 25%, var(--border) 50%, var(--bg-elevated) 75%)', backgroundSize: '200% 100%' }} />
        ))}
      </div>
      <div style={{ background: 'var(--bg-elevated)', borderRadius: 20, border: '1px solid var(--border)', height: 200, animation: 'shimmer 1.8s infinite', backgroundImage: 'linear-gradient(90deg, var(--bg-elevated) 25%, var(--border) 50%, var(--bg-elevated) 75%)', backgroundSize: '200% 100%' }} />
    </div>
  );
}

const PERIODS = ['Deze week', 'Deze maand', 'Dit jaar'];

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.4, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] },
  }),
};

export default function RiderEarningsPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<EarningsData | null>(null);
  const [error, setError] = useState('');
  const [activePeriod, setActivePeriod] = useState('Deze week');

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
      .then(json => { if (json) setData(json); })
      .catch(err => setError(err.message || 'Netwerkfout'))
      .finally(() => setLoading(false));
  }, [router]);

  const card: React.CSSProperties = {
    background: 'var(--bg-card)', borderRadius: 20,
    border: '1px solid var(--border)', padding: 'clamp(20px,4vw,32px)', marginBottom: 24,
  };

  const summaryCards = [
    { label: 'Deze week', value: '€0,00', sub: '0 bestellingen', color: PURPLE, icon: '📅' },
    { label: 'Deze maand', value: '€0,00', sub: '0 bestellingen', color: PINK, icon: '📆' },
    { label: 'Dit jaar', value: '€0,00', sub: '0 bestellingen', color: ORANGE, icon: '🏆' },
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
            color: ORANGE, background: `${ORANGE}15`, padding: '4px 12px', borderRadius: 20,
            marginBottom: 12, border: `1px solid ${ORANGE}25`,
          }}>
            💶 Verdiensten
          </div>
          <h1 style={{ fontSize: 'clamp(26px,5vw,42px)', fontWeight: 950, letterSpacing: -1.5, marginBottom: 8, lineHeight: 1.1 }}>
            Verdiensten
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: 16, margin: 0 }}>
            Overzicht van je inkomsten en uitbetalingen.
          </p>
        </motion.div>

        {loading ? <EarningsSkeleton /> : error ? (
          <div style={{ ...card, borderColor: 'rgba(239,68,68,0.3)', color: '#ef4444' }}>{error}</div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            {/* Period selector */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.05 }}
              style={{ display: 'flex', gap: 8, marginBottom: 24 }}
            >
              {PERIODS.map(p => (
                <motion.button
                  key={p}
                  onClick={() => setActivePeriod(p)}
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.97 }}
                  style={{
                    padding: '8px 18px', borderRadius: 20, fontSize: 13, fontWeight: 700,
                    cursor: 'pointer', fontFamily: 'Outfit, sans-serif',
                    background: activePeriod === p
                      ? `linear-gradient(135deg,${PURPLE},${PINK})`
                      : 'rgba(255,255,255,0.05)',
                    color: activePeriod === p ? 'white' : 'var(--text-secondary)',
                    border: activePeriod === p ? 'none' : '1px solid rgba(255,255,255,0.1)',
                    boxShadow: activePeriod === p ? `0 4px 14px ${PURPLE}35` : 'none',
                    transition: 'background 0.2s, color 0.2s, border 0.2s',
                  }}
                >
                  {p}
                </motion.button>
              ))}
            </motion.div>

            {/* Summary cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 16, marginBottom: 24 }}>
              {summaryCards.map((item, i) => (
                <motion.div
                  key={item.label}
                  custom={i}
                  variants={cardVariants}
                  initial="hidden"
                  animate="visible"
                  whileHover={{ y: -4, boxShadow: `0 12px 40px ${item.color}20` }}
                  style={{
                    background: 'var(--bg-card)', borderRadius: 18,
                    border: `1px solid ${activePeriod === item.label ? item.color + '35' : 'var(--border)'}`,
                    padding: '22px 24px', position: 'relative', overflow: 'hidden',
                    cursor: 'default', transition: 'border-color 0.2s',
                  }}
                >
                  <div style={{
                    position: 'absolute', top: 0, right: 0, width: 80, height: 80,
                    background: `radial-gradient(circle at top right, ${item.color}14, transparent 70%)`,
                    pointerEvents: 'none',
                  }} />
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
                    <p style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.8, margin: 0 }}>{item.label}</p>
                    <span style={{ fontSize: 18 }}>{item.icon}</span>
                  </div>
                  <AnimatedEuro value={item.value} />
                  <p style={{ fontSize: 12, color: 'var(--text-muted)', margin: 0 }}>{item.sub}</p>
                </motion.div>
              ))}
            </div>

            {/* Empty state card */}
            <motion.div
              custom={3}
              variants={cardVariants}
              initial="hidden"
              animate="visible"
              style={card}
            >
              <div style={{ textAlign: 'center', padding: '40px 20px' }}>
                <div style={{
                  width: 72, height: 72, borderRadius: '50%', margin: '0 auto 20px',
                  background: `linear-gradient(135deg, ${PURPLE}20, ${PINK}15)`,
                  border: `1px solid ${PURPLE}25`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 32,
                }}>
                  💰
                </div>
                <h2 style={{ fontSize: 20, fontWeight: 800, marginBottom: 12 }}>Nog geen verdiensten</h2>
                <p style={{ color: 'var(--text-muted)', fontSize: 15, lineHeight: 1.7, maxWidth: 420, margin: '0 auto 20px' }}>
                  Zodra je je eerste bezorging doet, verschijnen je verdiensten hier.
                  Je ontvangt een overzicht per week, per maand en je uitbetalingsgeschiedenis.
                </p>
                {data?.status && data.status !== 'approved' && (
                  <div style={{
                    marginTop: 4, padding: '12px 20px', background: `${PURPLE}10`,
                    borderRadius: 12, border: `1px solid ${PURPLE}20`, display: 'inline-block',
                  }}>
                    <p style={{ fontSize: 13, color: PURPLE, fontWeight: 700, margin: 0 }}>
                      Je account is momenteel: {data.status === 'pending' ? 'in behandeling' : data.status}
                    </p>
                  </div>
                )}
              </div>
            </motion.div>

            {/* Breakdown cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16 }}>
              {[
                { label: 'Tip ontvangen', value: '€0,00', icon: '🤝', color: '#22c55e' },
                { label: 'Bonus dit maand', value: '€0,00', icon: '🎁', color: ORANGE },
                { label: 'Openstaand', value: '€0,00', icon: '⏳', color: PURPLE },
              ].map((item, i) => (
                <motion.div
                  key={item.label}
                  custom={i + 4}
                  variants={cardVariants}
                  initial="hidden"
                  animate="visible"
                  whileHover={{ y: -3, boxShadow: `0 8px 30px ${item.color}18` }}
                  style={{
                    background: 'var(--bg-card)', borderRadius: 16,
                    border: '1px solid var(--border)', padding: '18px 20px',
                    position: 'relative', overflow: 'hidden',
                  }}
                >
                  <div style={{
                    position: 'absolute', top: -12, right: -12, width: 60, height: 60,
                    background: `radial-gradient(circle, ${item.color}14, transparent 70%)`,
                  }} />
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                    <span style={{ fontSize: 22 }}>{item.icon}</span>
                    <p style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.8, margin: 0 }}>{item.label}</p>
                  </div>
                  <p style={{ fontSize: 22, fontWeight: 950, margin: 0, color: item.color }}>{item.value}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
