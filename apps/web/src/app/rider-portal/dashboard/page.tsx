'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';

const PURPLE = '#5A31F4';
const PINK = '#FF0080';
const ORANGE = '#FF6B35';

type ApplicationStatus = 'pending' | 'in_review' | 'matched' | 'active' | 'rejected';

interface RiderData {
  firstName: string;
  lastName: string;
  email: string;
  city: string;
  vehicle: string;
  appliedAt: string;
  status: ApplicationStatus;
}

const stages: { key: string; label: string; description: string }[] = [
  { key: 'pending', label: 'Aangemeld', description: 'Je aanmelding is ontvangen.' },
  { key: 'in_review', label: 'In behandeling', description: 'We controleren je gegevens.' },
  { key: 'matched', label: 'Gekoppeld aan restaurant', description: 'Je bent gekoppeld aan een restaurant.' },
  { key: 'active', label: 'Actief', description: 'Je bent actief als bezorger!' },
];

const rejectedStages: { key: string; label: string; description: string }[] = [
  { key: 'pending', label: 'Aangemeld', description: 'Je aanmelding is ontvangen.' },
  { key: 'in_review', label: 'In behandeling', description: 'We controleren je gegevens.' },
  { key: 'rejected', label: 'Afgewezen', description: 'Je aanmelding is niet goedgekeurd.' },
];

function getStageIndex(status: ApplicationStatus, isRejected: boolean): number {
  if (isRejected) {
    if (status === 'pending') return 0;
    if (status === 'in_review') return 1;
    return 2;
  }
  if (status === 'pending') return 0;
  if (status === 'in_review') return 1;
  if (status === 'matched') return 2;
  if (status === 'active') return 3;
  return 0;
}

function formatDate(iso: string): string {
  try {
    return new Date(iso).toLocaleDateString('nl-NL', { day: 'numeric', month: 'long', year: 'numeric' });
  } catch {
    return iso;
  }
}

const quickStats = [
  { label: 'Bestellingen vandaag', value: '—', icon: '📦', color: PURPLE },
  { label: 'Gem. levertijd', value: '—', icon: '⚡', color: ORANGE },
  { label: 'Beoordeling', value: '—', icon: '⭐', color: PINK },
];

function StatusStepper({ status }: { status: ApplicationStatus }) {
  const isRejected = status === 'rejected';
  const list = isRejected ? rejectedStages : stages;
  const currentIndex = getStageIndex(status, isRejected);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
      {list.map((stage, i) => {
        const isActive = i === currentIndex;
        const isDone = i < currentIndex;
        const isLast = i === list.length - 1;
        return (
          <motion.div
            key={stage.key}
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: i * 0.1 }}
            style={{ display: 'flex', gap: 16, position: 'relative' }}
          >
            {!isLast && (
              <div style={{
                position: 'absolute', left: 19, top: 40, width: 2,
                height: 'calc(100% - 12px)',
                background: isDone || isActive
                  ? `linear-gradient(${PURPLE}, ${PINK})`
                  : 'rgba(255,255,255,0.08)',
                transition: 'background 0.4s',
              }} />
            )}
            <div style={{
              flexShrink: 0, width: 40, height: 40, borderRadius: '50%',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 16, fontWeight: 900, position: 'relative', zIndex: 1,
              background: isActive
                ? `linear-gradient(135deg,${PURPLE},${PINK})`
                : isDone ? `${PURPLE}30` : 'rgba(255,255,255,0.06)',
              border: isActive ? 'none' : isDone ? `1px solid ${PURPLE}60` : '1px solid rgba(255,255,255,0.1)',
              boxShadow: isActive ? `0 4px 20px ${PURPLE}55` : 'none',
              color: isActive || isDone ? 'white' : 'var(--text-muted)',
              transition: 'all 0.3s',
            }}>
              {isDone ? '✓' : i + 1}
            </div>
            <div style={{ paddingBottom: isLast ? 0 : 28, paddingTop: 8 }}>
              <p style={{
                fontSize: 15, fontWeight: isActive ? 800 : 600, margin: 0,
                color: isActive ? 'var(--text-primary)' : isDone ? 'var(--text-secondary)' : 'var(--text-muted)',
              }}>
                {stage.label}
              </p>
              <AnimatePresence>
                {isActive && (
                  <motion.p
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    style={{ fontSize: 13, color: 'var(--text-secondary)', margin: '4px 0 0' }}
                  >
                    {stage.description}
                  </motion.p>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.4, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] },
  }),
};

export default function RiderDashboardPage() {
  const router = useRouter();
  const [rider, setRider] = useState<RiderData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [hoveredAction, setHoveredAction] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('enjoy-rider-token');
    if (!token) {
      router.replace('/rider-portal');
      return;
    }

    const apiUrl = process.env.NEXT_PUBLIC_VP_DOMAIN || 'https://www.veloci.online';
    fetch(`${apiUrl}/api/riders/status`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(async res => {
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Kon status niet ophalen');
        setRider(data);
      })
      .catch(err => {
        setError(err.message || 'Er ging iets mis.');
      })
      .finally(() => setLoading(false));
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('enjoy-rider-token');
    router.push('/rider-portal');
  };

  const sectionLabel: React.CSSProperties = {
    fontSize: 11, fontWeight: 800, color: 'var(--text-muted)',
    textTransform: 'uppercase', letterSpacing: 1.4, marginBottom: 20,
  };

  const shimmerKeyframes = `@keyframes shimmer { 0% { background-position: 200% 0; } 100% { background-position: -200% 0; } }`;

  return (
    <div style={{ minHeight: '100vh', color: 'var(--text-primary)', fontFamily: 'Outfit, sans-serif' }}>
      <style>{shimmerKeyframes}</style>

      {/* Background glow */}
      <div style={{
        position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0,
        background: `radial-gradient(ellipse at 70% -10%, ${PURPLE}12 0%, transparent 55%),
                     radial-gradient(ellipse at 20% 80%, ${PINK}08 0%, transparent 50%)`,
      }} />

      <div style={{ position: 'relative', zIndex: 1, maxWidth: 940, margin: '0 auto', padding: 'clamp(32px,5vw,56px) clamp(16px,4vw,40px)' }}>

        {/* Loading skeletons */}
        {loading && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 40 }}>
              <div>
                <div style={{ height: 36, width: 220, borderRadius: 8, marginBottom: 8, animation: 'shimmer 1.8s infinite', backgroundImage: 'linear-gradient(90deg, var(--bg-elevated) 25%, var(--border) 50%, var(--bg-elevated) 75%)', backgroundSize: '200% 100%' }} />
                <div style={{ height: 16, width: 260, borderRadius: 6, animation: 'shimmer 1.8s infinite', backgroundImage: 'linear-gradient(90deg, var(--bg-elevated) 25%, var(--border) 50%, var(--bg-elevated) 75%)', backgroundSize: '200% 100%' }} />
              </div>
              <div style={{ height: 40, width: 100, borderRadius: 10, animation: 'shimmer 1.8s infinite', backgroundImage: 'linear-gradient(90deg, var(--bg-elevated) 25%, var(--border) 50%, var(--bg-elevated) 75%)', backgroundSize: '200% 100%' }} />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 16, marginBottom: 24 }}>
              {[0,1,2].map(i => (
                <div key={i} style={{ background: 'var(--bg-elevated)', borderRadius: 18, border: '1px solid var(--border)', padding: '22px 24px', animation: 'shimmer 1.8s infinite', backgroundImage: 'linear-gradient(90deg, var(--bg-elevated) 25%, var(--border) 50%, var(--bg-elevated) 75%)', backgroundSize: '200% 100%', height: 88 }} />
              ))}
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 24 }}>
              {[0,1].map(i => (
                <div key={i} style={{ background: 'var(--bg-elevated)', borderRadius: 20, border: '1px solid var(--border)', height: 260, animation: 'shimmer 1.8s infinite', backgroundImage: 'linear-gradient(90deg, var(--bg-elevated) 25%, var(--border) 50%, var(--bg-elevated) 75%)', backgroundSize: '200% 100%' }} />
              ))}
            </div>
          </div>
        )}

        {/* Error */}
        {!loading && error && (
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            style={{ textAlign: 'center', padding: '60px 40px', background: 'rgba(239,68,68,0.06)', borderRadius: 24, border: '1px solid rgba(239,68,68,0.2)' }}
          >
            <div style={{ fontSize: 48, marginBottom: 16 }}>⚠️</div>
            <h2 style={{ fontSize: 22, fontWeight: 800, marginBottom: 10 }}>Fout bij ophalen</h2>
            <p style={{ color: 'var(--text-secondary)', marginBottom: 28 }}>{error}</p>
            <button onClick={handleLogout} style={{ background: 'var(--bg-card)', color: 'var(--text-primary)', border: '1px solid var(--border)', borderRadius: 12, padding: '12px 28px', fontSize: 15, fontWeight: 700, cursor: 'pointer' }}>
              Opnieuw inloggen
            </button>
          </motion.div>
        )}

        {!loading && rider && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: -16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16, marginBottom: 40 }}
            >
              <div>
                <div style={{
                  display: 'inline-flex', alignItems: 'center', gap: 8,
                  fontSize: 12, fontWeight: 700, color: PURPLE,
                  background: `${PURPLE}15`, padding: '4px 12px', borderRadius: 20,
                  marginBottom: 12, border: `1px solid ${PURPLE}25`,
                }}>
                  <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#22c55e', display: 'inline-block', boxShadow: '0 0 6px #22c55e' }} />
                  Rider Portal
                </div>
                <h1 style={{ fontSize: 'clamp(28px,5vw,44px)', fontWeight: 950, letterSpacing: -1.5, marginBottom: 6, lineHeight: 1.1 }}>
                  Hallo, {rider.firstName}!
                </h1>
                <p style={{ color: 'var(--text-secondary)', fontSize: 16, margin: 0 }}>
                  Welkom terug in je rider dashboard.
                </p>
              </div>
              <motion.button
                onClick={handleLogout}
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
                style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'var(--text-secondary)', borderRadius: 12, padding: '10px 22px', fontSize: 14, fontWeight: 700, cursor: 'pointer', flexShrink: 0 }}
              >
                Uitloggen
              </motion.button>
            </motion.div>

            {/* Animated stat cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))', gap: 16, marginBottom: 28 }}>
              {quickStats.map((stat, i) => (
                <motion.div
                  key={stat.label}
                  custom={i}
                  variants={cardVariants}
                  initial="hidden"
                  animate="visible"
                  whileHover={{ y: -4, boxShadow: `0 12px 40px ${stat.color}20` }}
                  style={{
                    background: 'var(--bg-card)', borderRadius: 18,
                    border: '1px solid var(--border)', padding: '22px 24px',
                    cursor: 'default', transition: 'border-color 0.2s',
                    position: 'relative', overflow: 'hidden',
                  }}
                >
                  <div style={{
                    position: 'absolute', top: 0, right: 0, width: 80, height: 80,
                    background: `radial-gradient(circle at top right, ${stat.color}12, transparent 70%)`,
                    pointerEvents: 'none',
                  }} />
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                    <p style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.8, margin: 0 }}>{stat.label}</p>
                    <span style={{ fontSize: 20 }}>{stat.icon}</span>
                  </div>
                  <p style={{ fontSize: 30, fontWeight: 950, letterSpacing: -1, margin: 0, color: stat.color }}>{stat.value}</p>
                </motion.div>
              ))}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 24 }}>

              {/* Status card */}
              <motion.div
                custom={3}
                variants={cardVariants}
                initial="hidden"
                animate="visible"
                style={{
                  background: 'var(--bg-card)', borderRadius: 20,
                  border: '1px solid var(--border)', padding: 'clamp(20px,4vw,32px)',
                  marginBottom: 0,
                }}
              >
                <p style={sectionLabel}>Aanmeldstatus</p>
                <StatusStepper status={rider.status} />
              </motion.div>

              {/* Earnings card */}
              <motion.div
                custom={4}
                variants={cardVariants}
                initial="hidden"
                animate="visible"
                style={{
                  background: 'var(--bg-card)', borderRadius: 20,
                  border: '1px solid var(--border)', padding: 'clamp(20px,4vw,32px)',
                  marginBottom: 0,
                }}
              >
                <p style={sectionLabel}>Verdiensten</p>
                <div style={{
                  display: 'flex', flexDirection: 'column', alignItems: 'center',
                  justifyContent: 'center', gap: 12, padding: '32px 20px', textAlign: 'center',
                }}>
                  <div style={{
                    width: 64, height: 64, borderRadius: '50%',
                    background: `linear-gradient(135deg, ${PURPLE}20, ${PINK}15)`,
                    border: `1px solid ${PURPLE}25`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28,
                  }}>
                    💰
                  </div>
                  <p style={{ fontSize: 16, fontWeight: 800, margin: 0 }}>Nog niet beschikbaar</p>
                  <p style={{ fontSize: 13, color: 'var(--text-muted)', margin: 0, lineHeight: 1.7, maxWidth: 220 }}>
                    Verdiensten worden beschikbaar zodra je actief bent als bezorger.
                  </p>
                </div>
              </motion.div>

            </div>

            {/* Restaurant card */}
            <motion.div
              custom={5}
              variants={cardVariants}
              initial="hidden"
              animate="visible"
              style={{ marginTop: 24 }}
            >
              {(rider.status === 'matched' || rider.status === 'active') ? (
                <div style={{
                  background: `linear-gradient(135deg, ${PURPLE}12, ${PINK}08)`,
                  border: `1px solid ${PURPLE}28`,
                  borderRadius: 20, padding: 'clamp(20px,4vw,28px)',
                }}>
                  <p style={sectionLabel}>Gekoppeld restaurant</p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                    <div style={{
                      fontSize: 28, flexShrink: 0, width: 56, height: 56,
                      background: `${PURPLE}18`, border: `1px solid ${PURPLE}25`,
                      borderRadius: 16, display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>🍕</div>
                    <p style={{ fontSize: 14, color: 'var(--text-secondary)', margin: 0, lineHeight: 1.7 }}>
                      Je wordt binnenkort gekoppeld aan een restaurant. We nemen contact op zodra dit geregeld is.
                    </p>
                  </div>
                </div>
              ) : (
                <div style={{
                  background: 'var(--bg-card)', border: '1px solid var(--border)',
                  borderRadius: 20, padding: 'clamp(20px,4vw,28px)',
                }}>
                  <p style={sectionLabel}>Gekoppeld restaurant</p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                    <div style={{
                      fontSize: 28, flexShrink: 0, width: 56, height: 56,
                      background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)',
                      borderRadius: 16, display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>🍕</div>
                    <p style={{ fontSize: 14, color: 'var(--text-secondary)', margin: 0, lineHeight: 1.7 }}>
                      Je wordt binnenkort gekoppeld aan een restaurant.
                    </p>
                  </div>
                </div>
              )}
            </motion.div>

            {/* Upcoming shifts */}
            <motion.div
              custom={6}
              variants={cardVariants}
              initial="hidden"
              animate="visible"
              style={{ marginTop: 24 }}
            >
              <div style={{
                background: 'var(--bg-card)', border: '1px solid var(--border)',
                borderRadius: 20, padding: 'clamp(20px,4vw,32px)',
              }}>
                <p style={sectionLabel}>Aankomende diensten</p>

                {/* Quick action links */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 12, marginBottom: 24 }}>
                  {[
                    { label: 'Diensten', href: '/rider-portal/shifts', icon: '📅', color: PURPLE },
                    { label: 'Verdiensten', href: '/rider-portal/earnings', icon: '💶', color: ORANGE },
                    { label: 'Profiel', href: '/rider-portal/profile', icon: '👤', color: PINK },
                  ].map(action => (
                    <motion.a
                      key={action.label}
                      href={action.href}
                      onHoverStart={() => setHoveredAction(action.label)}
                      onHoverEnd={() => setHoveredAction(null)}
                      whileHover={{ y: -3, scale: 1.02 }}
                      whileTap={{ scale: 0.97 }}
                      style={{
                        display: 'flex', alignItems: 'center', gap: 10,
                        background: hoveredAction === action.label ? `${action.color}15` : 'rgba(255,255,255,0.04)',
                        border: `1px solid ${hoveredAction === action.label ? action.color + '30' : 'rgba(255,255,255,0.08)'}`,
                        borderRadius: 14, padding: '12px 16px', textDecoration: 'none',
                        color: 'var(--text-primary)', fontWeight: 700, fontSize: 14,
                        transition: 'background 0.2s, border-color 0.2s',
                      }}
                    >
                      <span style={{ fontSize: 20 }}>{action.icon}</span>
                      {action.label}
                    </motion.a>
                  ))}
                </div>

                <div style={{ textAlign: 'center', padding: '20px 0 8px', opacity: 0.7 }}>
                  <p style={{ fontSize: 14, fontWeight: 600, margin: '0 0 4px', color: 'var(--text-muted)' }}>Nog geen diensten gepland</p>
                  <p style={{ fontSize: 12, color: 'var(--text-muted)', margin: 0 }}>
                    Diensten zijn beschikbaar zodra je bent goedgekeurd.
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Rejected state */}
            {rider.status === 'rejected' && (
              <motion.div
                initial={{ opacity: 0, scale: 0.97 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 }}
                style={{
                  background: 'rgba(239,68,68,0.05)', borderRadius: 20,
                  border: '1px solid rgba(239,68,68,0.15)', padding: 'clamp(24px,4vw,36px)',
                  textAlign: 'center', marginTop: 24,
                }}
              >
                <div style={{ fontSize: 48, marginBottom: 16 }}>😔</div>
                <h2 style={{ fontSize: 24, fontWeight: 950, marginBottom: 10 }}>Helaas...</h2>
                <p style={{ color: 'var(--text-secondary)', fontSize: 16, lineHeight: 1.7, marginBottom: 24 }}>
                  Je aanmelding is op dit moment niet goedgekeurd. Je kunt je opnieuw aanmelden zodra de omstandigheden zijn veranderd.
                </p>
                <motion.a
                  href="/riders"
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.97 }}
                  style={{
                    display: 'inline-block',
                    background: `linear-gradient(135deg,${PURPLE},${PINK})`,
                    color: 'white', padding: '14px 28px', borderRadius: 12,
                    fontWeight: 800, fontSize: 15, textDecoration: 'none',
                    boxShadow: `0 6px 20px ${PURPLE}35`,
                  }}
                >
                  Opnieuw aanmelden →
                </motion.a>
              </motion.div>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
}
