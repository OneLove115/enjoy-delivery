'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Nav } from '../../components/Nav';
import { Footer } from '../../components/Footer';

const PURPLE = '#5A31F4';
const PINK = '#FF0080';
const ORANGE = '#FF6B35';

type ApplicationStatus = 'pending' | 'in_review' | 'approved' | 'rejected';

interface RiderData {
  firstName: string;
  lastName: string;
  email: string;
  city: string;
  vehicle: string;
  appliedAt: string;
  status: ApplicationStatus;
}

const stages: { key: ApplicationStatus | 'in_review'; label: string; description: string; icon: string }[] = [
  { key: 'pending',   label: 'Aangemeld',        description: 'Je aanmelding is ontvangen.',              icon: '📝' },
  { key: 'in_review', label: 'In behandeling',   description: 'We controleren je gegevens.',              icon: '🔍' },
  { key: 'approved',  label: 'Goedgekeurd',       description: 'Welkom bij het team!',                    icon: '✅' },
  { key: 'rejected',  label: 'Afgewezen',         description: 'Je aanmelding is helaas niet goedgekeurd.', icon: '❌' },
];

function getStageIndex(status: ApplicationStatus): number {
  if (status === 'pending') return 0;
  if (status === 'in_review') return 1;
  if (status === 'approved') return 2;
  if (status === 'rejected') return 2;
  return 0;
}

function formatDate(iso: string): string {
  try {
    return new Date(iso).toLocaleDateString('nl-NL', { day: 'numeric', month: 'long', year: 'numeric' });
  } catch {
    return iso;
  }
}

const STATUS_BADGE: Record<ApplicationStatus, { label: string; color: string; bg: string }> = {
  pending:   { label: 'In behandeling', color: ORANGE, bg: `${ORANGE}15` },
  in_review: { label: 'Wordt beoordeeld', color: PURPLE, bg: `${PURPLE}15` },
  approved:  { label: 'Goedgekeurd', color: '#22c55e', bg: 'rgba(34,197,94,0.15)' },
  rejected:  { label: 'Afgewezen', color: '#ef4444', bg: 'rgba(239,68,68,0.12)' },
};

export default function RiderStatusPage() {
  const router = useRouter();
  const [rider, setRider] = useState<RiderData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

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

  return (
    <div style={{ background: 'var(--bg-page)', minHeight: '100vh', color: 'var(--text-primary)', fontFamily: 'Outfit, sans-serif' }}>
      <Nav />

      <section style={{ padding: 'clamp(40px,6vw,96px) clamp(16px,4vw,60px)', position: 'relative' }}>
        {/* Background glow */}
        <div style={{
          position: 'absolute', inset: 0,
          background: `radial-gradient(ellipse at 50% 0%, ${PURPLE}12 0%, transparent 60%),
                       radial-gradient(ellipse at 80% 100%, ${PINK}08 0%, transparent 50%)`,
          pointerEvents: 'none',
        }} />

        <div style={{ position: 'relative', zIndex: 1, maxWidth: 720, margin: '0 auto' }}>

          {/* Loading skeletons */}
          {loading && (
            <div>
              <style>{`@keyframes shimmer { 0% { background-position: 200% 0; } 100% { background-position: -200% 0; } }`}</style>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 40 }}>
                <div>
                  <div style={{ height: 34, width: 200, borderRadius: 8, marginBottom: 8, animation: 'shimmer 1.8s infinite', backgroundImage: 'linear-gradient(90deg, var(--bg-elevated) 25%, var(--border) 50%, var(--bg-elevated) 75%)', backgroundSize: '200% 100%' }} />
                  <div style={{ height: 16, width: 250, borderRadius: 6, animation: 'shimmer 1.8s infinite', backgroundImage: 'linear-gradient(90deg, var(--bg-elevated) 25%, var(--border) 50%, var(--bg-elevated) 75%)', backgroundSize: '200% 100%' }} />
                </div>
                <div style={{ height: 40, width: 100, borderRadius: 10, animation: 'shimmer 1.8s infinite', backgroundImage: 'linear-gradient(90deg, var(--bg-elevated) 25%, var(--border) 50%, var(--bg-elevated) 75%)', backgroundSize: '200% 100%' }} />
              </div>
              <div style={{ background: 'var(--bg-elevated)', borderRadius: 20, border: '1px solid var(--border)', height: 200, animation: 'shimmer 1.8s infinite', backgroundImage: 'linear-gradient(90deg, var(--bg-elevated) 25%, var(--border) 50%, var(--bg-elevated) 75%)', backgroundSize: '200% 100%', marginBottom: 24 }} />
              <div style={{ background: 'var(--bg-elevated)', borderRadius: 20, border: '1px solid var(--border)', height: 280, animation: 'shimmer 1.8s infinite', backgroundImage: 'linear-gradient(90deg, var(--bg-elevated) 25%, var(--border) 50%, var(--bg-elevated) 75%)', backgroundSize: '200% 100%' }} />
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

          {/* Status dashboard */}
          {!loading && rider && (() => {
            const badge = STATUS_BADGE[rider.status];
            const filteredStages = stages.filter(s =>
              rider.status === 'rejected' ? s.key !== 'approved' : s.key !== 'rejected'
            );
            const currentIndex = getStageIndex(rider.status);

            return (
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              >
                {/* Header row */}
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16, marginBottom: 36 }}>
                  <div>
                    <div style={{
                      display: 'inline-flex', alignItems: 'center', gap: 6, marginBottom: 12,
                      background: badge.bg, color: badge.color, padding: '5px 14px', borderRadius: 20,
                      fontSize: 12, fontWeight: 700, border: `1px solid ${badge.color}25`,
                    }}>
                      <span style={{ width: 6, height: 6, borderRadius: '50%', background: badge.color, display: 'inline-block', boxShadow: `0 0 6px ${badge.color}` }} />
                      {badge.label}
                    </div>
                    <h1 style={{ fontSize: 'clamp(26px,5vw,40px)', fontWeight: 950, letterSpacing: -1.5, marginBottom: 6, lineHeight: 1.1 }}>
                      Hallo, {rider.firstName}!
                    </h1>
                    <p style={{ color: 'var(--text-secondary)', fontSize: 16, margin: 0 }}>Hier is de status van je aanmelding.</p>
                  </div>
                  <motion.button
                    onClick={handleLogout}
                    whileHover={{ scale: 1.04 }}
                    whileTap={{ scale: 0.97 }}
                    style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'var(--text-secondary)', borderRadius: 12, padding: '10px 22px', fontSize: 14, fontWeight: 700, cursor: 'pointer' }}
                  >
                    Uitloggen
                  </motion.button>
                </div>

                {/* Rider info card */}
                <motion.div
                  initial={{ opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                  style={{
                    background: 'var(--bg-card)', borderRadius: 20,
                    border: '1px solid var(--border)', padding: 'clamp(20px,4vw,32px)', marginBottom: 24,
                    position: 'relative', overflow: 'hidden',
                  }}
                >
                  <div style={{
                    position: 'absolute', top: 0, right: 0, width: '40%', height: '100%',
                    background: `radial-gradient(ellipse at right, ${PURPLE}07, transparent 70%)`,
                    pointerEvents: 'none',
                  }} />
                  <h2 style={{ fontSize: 11, fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: 1.4, marginBottom: 20 }}>
                    Jouw gegevens
                  </h2>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 18 }}>
                    {[
                      { label: 'Naam', value: `${rider.firstName} ${rider.lastName}`, icon: '👤' },
                      { label: 'E-mail', value: rider.email, icon: '✉️' },
                      { label: 'Stad', value: rider.city, icon: '📍' },
                      { label: 'Voertuig', value: rider.vehicle, icon: '🚲' },
                      { label: 'Aangemeld op', value: formatDate(rider.appliedAt), icon: '📅' },
                    ].map(item => (
                      <div key={item.label}>
                        <p style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 5, display: 'flex', alignItems: 'center', gap: 5 }}>
                          <span>{item.icon}</span>{item.label}
                        </p>
                        <p style={{ fontSize: 15, fontWeight: 600, margin: 0 }}>{item.value}</p>
                      </div>
                    ))}
                  </div>
                </motion.div>

                {/* Status stepper */}
                <motion.div
                  initial={{ opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.18, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                  style={{
                    background: 'var(--bg-card)', borderRadius: 20,
                    border: '1px solid var(--border)', padding: 'clamp(20px,4vw,36px)', marginBottom: 28,
                  }}
                >
                  <h2 style={{ fontSize: 11, fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: 1.4, marginBottom: 28 }}>
                    Aanmeldstatus
                  </h2>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
                    {filteredStages.map((stage, i, arr) => {
                      const isActive = i === currentIndex;
                      const isDone = i < currentIndex;
                      const isLast = i === arr.length - 1;
                      const isRejectedStage = stage.key === 'rejected' && rider.status === 'rejected';

                      return (
                        <motion.div
                          key={stage.key}
                          initial={{ opacity: 0, x: -16 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.35, delay: 0.2 + i * 0.1 }}
                          style={{ display: 'flex', gap: 18, position: 'relative' }}
                        >
                          {/* Connector line */}
                          {!isLast && (
                            <div style={{
                              position: 'absolute', left: 20, top: 44, width: 2,
                              height: 'calc(100% - 12px)',
                              background: isDone || isActive
                                ? `linear-gradient(${isRejectedStage ? '#ef4444' : PURPLE}, ${isRejectedStage ? ORANGE : PINK})`
                                : 'rgba(255,255,255,0.07)',
                              transition: 'background 0.4s',
                            }} />
                          )}

                          {/* Circle */}
                          <div style={{
                            flexShrink: 0, width: 42, height: 42, borderRadius: '50%',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontSize: isActive ? 18 : 15, fontWeight: 900, position: 'relative', zIndex: 1,
                            background: isRejectedStage
                              ? 'rgba(239,68,68,0.15)'
                              : isActive
                                ? `linear-gradient(135deg,${PURPLE},${PINK})`
                                : isDone ? `${PURPLE}28` : 'rgba(255,255,255,0.06)',
                            border: isActive ? 'none'
                              : isRejectedStage ? '1px solid rgba(239,68,68,0.4)'
                              : isDone ? `1px solid ${PURPLE}55` : '1px solid rgba(255,255,255,0.1)',
                            boxShadow: isActive ? `0 4px 20px ${PURPLE}55` : 'none',
                            color: isActive || isDone ? 'white' : isRejectedStage ? '#ef4444' : 'var(--text-muted)',
                            transition: 'all 0.3s',
                          }}>
                            {isDone ? '✓' : isActive ? stage.icon : i + 1}
                          </div>

                          {/* Label + description */}
                          <div style={{ paddingBottom: isLast ? 0 : 30, paddingTop: 9 }}>
                            <p style={{
                              fontSize: 15, fontWeight: isActive ? 800 : 600, margin: 0,
                              color: isRejectedStage ? '#ef4444' : isActive ? 'var(--text-primary)' : isDone ? 'var(--text-secondary)' : 'var(--text-muted)',
                            }}>
                              {stage.label}
                            </p>
                            <AnimatePresence>
                              {isActive && (
                                <motion.p
                                  initial={{ opacity: 0, height: 0 }}
                                  animate={{ opacity: 1, height: 'auto' }}
                                  exit={{ opacity: 0, height: 0 }}
                                  style={{ fontSize: 13, color: 'var(--text-secondary)', margin: '5px 0 0' }}
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
                </motion.div>

                {/* Approved message */}
                {rider.status === 'approved' && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.5, duration: 0.4 }}
                    style={{
                      background: `linear-gradient(135deg, ${PURPLE}15, ${PINK}10)`,
                      borderRadius: 24, border: `1px solid ${PURPLE}30`,
                      padding: 'clamp(28px,4vw,44px)', textAlign: 'center',
                    }}
                  >
                    <motion.div
                      animate={{ scale: [1, 1.15, 1], rotate: [0, 5, -5, 0] }}
                      transition={{ duration: 0.8, delay: 0.6 }}
                      style={{ fontSize: 64, marginBottom: 20 }}
                    >
                      🎉
                    </motion.div>
                    <h2 style={{ fontSize: 28, fontWeight: 950, marginBottom: 12, letterSpacing: -0.5 }}>Welkom bij het team!</h2>
                    <p style={{ color: 'var(--text-secondary)', fontSize: 16, lineHeight: 1.8, marginBottom: 28, maxWidth: 420, margin: '0 auto 28px' }}>
                      Je bent goedgekeurd als EnJoy bezorger. Download de bezorger-app en begin vandaag nog met verdienen.
                    </p>
                    <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
                      <motion.a
                        href="#"
                        whileHover={{ scale: 1.04 }}
                        whileTap={{ scale: 0.97 }}
                        style={{
                          background: `linear-gradient(135deg,${ORANGE},${PINK})`,
                          color: 'white', padding: '14px 28px', borderRadius: 14,
                          fontWeight: 800, fontSize: 15, textDecoration: 'none',
                          boxShadow: `0 8px 24px ${ORANGE}40`,
                        }}
                      >
                        Download de bezorger-app →
                      </motion.a>
                      <Link
                        href="/discover"
                        style={{
                          background: 'rgba(255,255,255,0.07)', color: 'var(--text-primary)',
                          padding: '14px 28px', borderRadius: 14, fontWeight: 700,
                          fontSize: 15, textDecoration: 'none', border: '1px solid rgba(255,255,255,0.1)',
                        }}
                      >
                        Ontdek EnJoy
                      </Link>
                    </div>
                  </motion.div>
                )}

                {/* Rejected message */}
                {rider.status === 'rejected' && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.5 }}
                    style={{
                      background: 'rgba(239,68,68,0.05)', borderRadius: 24,
                      border: '1px solid rgba(239,68,68,0.18)', padding: 'clamp(24px,4vw,40px)', textAlign: 'center',
                    }}
                  >
                    <div style={{ fontSize: 56, marginBottom: 16 }}>😔</div>
                    <h2 style={{ fontSize: 26, fontWeight: 950, marginBottom: 12 }}>Helaas...</h2>
                    <p style={{ color: 'var(--text-secondary)', fontSize: 16, lineHeight: 1.8, marginBottom: 28, maxWidth: 400, margin: '0 auto 28px' }}>
                      Je aanmelding is op dit moment niet goedgekeurd. Je kunt je opnieuw aanmelden zodra de omstandigheden veranderd zijn.
                    </p>
                    <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} style={{ display: 'inline-block' }}>
                      <Link
                        href="/riders"
                        style={{
                          display: 'inline-block',
                          background: `linear-gradient(135deg,${PURPLE},${PINK})`,
                          color: 'white', padding: '14px 28px', borderRadius: 14,
                          fontWeight: 800, fontSize: 15, textDecoration: 'none',
                          boxShadow: `0 6px 20px ${PURPLE}35`,
                        }}
                      >
                        Opnieuw aanmelden →
                      </Link>
                    </motion.div>
                  </motion.div>
                )}
              </motion.div>
            );
          })()}
        </div>
      </section>

      <Footer />
    </div>
  );
}
