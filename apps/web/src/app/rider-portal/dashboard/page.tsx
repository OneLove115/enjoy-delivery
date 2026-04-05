'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';

const PURPLE = '#5A31F4';
const PINK = '#FF0080';
const ORANGE = '#FF6B00';

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
  { label: 'Bestellingen vandaag', value: '—' },
  { label: 'Gem. levertijd', value: '—' },
  { label: 'Beoordeling', value: '—' },
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
          <div key={stage.key} style={{ display: 'flex', gap: 16, position: 'relative' }}>
            {!isLast && (
              <div style={{ position: 'absolute', left: 19, top: 40, width: 2, height: 'calc(100% - 12px)', background: isDone || isActive ? `linear-gradient(${PURPLE}, ${PINK})` : 'rgba(255,255,255,0.08)' }} />
            )}
            <div style={{ flexShrink: 0, width: 40, height: 40, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, fontWeight: 900, position: 'relative', zIndex: 1, background: isActive ? `linear-gradient(135deg,${PURPLE},${PINK})` : isDone ? `${PURPLE}30` : 'rgba(255,255,255,0.06)', border: isActive ? 'none' : isDone ? `1px solid ${PURPLE}60` : '1px solid rgba(255,255,255,0.1)', boxShadow: isActive ? `0 4px 16px ${PURPLE}50` : 'none', color: isActive || isDone ? 'white' : 'var(--text-muted)' }}>
              {isDone ? '✓' : i + 1}
            </div>
            <div style={{ paddingBottom: isLast ? 0 : 28, paddingTop: 8 }}>
              <p style={{ fontSize: 15, fontWeight: isActive ? 800 : 600, margin: 0, color: isActive ? 'var(--text-primary)' : isDone ? 'var(--text-secondary)' : 'var(--text-muted)' }}>
                {stage.label}
              </p>
              {isActive && (
                <p style={{ fontSize: 13, color: 'var(--text-secondary)', margin: '4px 0 0' }}>{stage.description}</p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default function RiderDashboardPage() {
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

  const card: React.CSSProperties = {
    background: 'var(--bg-card)',
    borderRadius: 20,
    border: '1px solid var(--border)',
    padding: 'clamp(20px,4vw,32px)',
    marginBottom: 24,
  };

  const sectionLabel: React.CSSProperties = {
    fontSize: 12,
    fontWeight: 800,
    color: 'var(--text-muted)',
    textTransform: 'uppercase',
    letterSpacing: 1.2,
    marginBottom: 20,
  };

  return (
    <div style={{ minHeight: '100vh', color: 'var(--text-primary)', fontFamily: 'Outfit, sans-serif' }}>
      <div style={{ position: 'relative' }}>
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 60% 0%, rgba(90,49,244,0.08) 0%, transparent 60%)', pointerEvents: 'none' }} />

        <div style={{ position: 'relative', zIndex: 1, maxWidth: 900, margin: '0 auto', padding: 'clamp(32px,5vw,56px) clamp(16px,4vw,40px)' }}>

          {/* Loading */}
          {loading && (
            <div>
              <style>{`@keyframes shimmer { 0% { background-position: 200% 0; } 100% { background-position: -200% 0; } }`}</style>
              {/* Header skeleton */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 40 }}>
                <div>
                  <div style={{ height: 36, width: 220, borderRadius: 8, marginBottom: 8, animation: 'shimmer 1.8s infinite', backgroundImage: 'linear-gradient(90deg, var(--bg-elevated) 25%, var(--border) 50%, var(--bg-elevated) 75%)', backgroundSize: '200% 100%' }} />
                  <div style={{ height: 16, width: 260, borderRadius: 6, animation: 'shimmer 1.8s infinite', backgroundImage: 'linear-gradient(90deg, var(--bg-elevated) 25%, var(--border) 50%, var(--bg-elevated) 75%)', backgroundSize: '200% 100%' }} />
                </div>
                <div style={{ height: 40, width: 100, borderRadius: 10, animation: 'shimmer 1.8s infinite', backgroundImage: 'linear-gradient(90deg, var(--bg-elevated) 25%, var(--border) 50%, var(--bg-elevated) 75%)', backgroundSize: '200% 100%' }} />
              </div>
              {/* Stat cards skeleton */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 16, marginBottom: 24 }}>
                {[0,1,2].map(i => (
                  <div key={i} style={{ background: 'var(--bg-elevated)', borderRadius: 16, border: '1px solid var(--border)', padding: '20px 22px' }}>
                    <div style={{ height: 28, width: '50%', borderRadius: 8, marginBottom: 8, animation: 'shimmer 1.8s infinite', backgroundImage: 'linear-gradient(90deg, var(--bg-elevated) 25%, var(--border) 50%, var(--bg-elevated) 75%)', backgroundSize: '200% 100%' }} />
                    <div style={{ height: 12, width: '60%', borderRadius: 6, animation: 'shimmer 1.8s infinite', backgroundImage: 'linear-gradient(90deg, var(--bg-elevated) 25%, var(--border) 50%, var(--bg-elevated) 75%)', backgroundSize: '200% 100%' }} />
                  </div>
                ))}
              </div>
              {/* Stepper skeleton */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 24 }}>
                <div style={{ background: 'var(--bg-elevated)', borderRadius: 20, border: '1px solid var(--border)', padding: 'clamp(20px,4vw,32px)' }}>
                  <div style={{ height: 12, width: 100, borderRadius: 6, marginBottom: 24, animation: 'shimmer 1.8s infinite', backgroundImage: 'linear-gradient(90deg, var(--bg-elevated) 25%, var(--border) 50%, var(--bg-elevated) 75%)', backgroundSize: '200% 100%' }} />
                  {[0,1,2,3].map(i => (
                    <div key={i} style={{ display: 'flex', gap: 16, marginBottom: 20 }}>
                      <div style={{ width: 40, height: 40, borderRadius: '50%', flexShrink: 0, animation: 'shimmer 1.8s infinite', backgroundImage: 'linear-gradient(90deg, var(--bg-elevated) 25%, var(--border) 50%, var(--bg-elevated) 75%)', backgroundSize: '200% 100%' }} />
                      <div style={{ paddingTop: 8 }}>
                        <div style={{ height: 15, width: 140, borderRadius: 6, marginBottom: 6, animation: 'shimmer 1.8s infinite', backgroundImage: 'linear-gradient(90deg, var(--bg-elevated) 25%, var(--border) 50%, var(--bg-elevated) 75%)', backgroundSize: '200% 100%' }} />
                        <div style={{ height: 12, width: 200, borderRadius: 6, animation: 'shimmer 1.8s infinite', backgroundImage: 'linear-gradient(90deg, var(--bg-elevated) 25%, var(--border) 50%, var(--bg-elevated) 75%)', backgroundSize: '200% 100%' }} />
                      </div>
                    </div>
                  ))}
                </div>
                <div style={{ background: 'var(--bg-elevated)', borderRadius: 20, border: '1px solid var(--border)', padding: 'clamp(20px,4vw,32px)' }}>
                  <div style={{ height: 12, width: 80, borderRadius: 6, marginBottom: 24, animation: 'shimmer 1.8s infinite', backgroundImage: 'linear-gradient(90deg, var(--bg-elevated) 25%, var(--border) 50%, var(--bg-elevated) 75%)', backgroundSize: '200% 100%' }} />
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '24px 0', gap: 12 }}>
                    <div style={{ width: 48, height: 48, borderRadius: '50%', animation: 'shimmer 1.8s infinite', backgroundImage: 'linear-gradient(90deg, var(--bg-elevated) 25%, var(--border) 50%, var(--bg-elevated) 75%)', backgroundSize: '200% 100%' }} />
                    <div style={{ height: 15, width: 160, borderRadius: 6, animation: 'shimmer 1.8s infinite', backgroundImage: 'linear-gradient(90deg, var(--bg-elevated) 25%, var(--border) 50%, var(--bg-elevated) 75%)', backgroundSize: '200% 100%' }} />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Error */}
          {!loading && error && (
            <div style={{ textAlign: 'center', padding: '60px 40px', background: 'rgba(239,68,68,0.06)', borderRadius: 24, border: '1px solid rgba(239,68,68,0.2)' }}>
              <div style={{ fontSize: 48, marginBottom: 16 }}>⚠️</div>
              <h2 style={{ fontSize: 22, fontWeight: 800, marginBottom: 10 }}>Fout bij ophalen</h2>
              <p style={{ color: 'var(--text-secondary)', marginBottom: 28 }}>{error}</p>
              <button onClick={handleLogout} style={{ background: 'var(--bg-card)', color: 'var(--text-primary)', border: '1px solid var(--border)', borderRadius: 12, padding: '12px 28px', fontSize: 15, fontWeight: 700, cursor: 'pointer' }}>
                Opnieuw inloggen
              </button>
            </div>
          )}

          {!loading && rider && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              {/* Header */}
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16, marginBottom: 40 }}>
                <div>
                  <h1 style={{ fontSize: 'clamp(26px,5vw,42px)', fontWeight: 950, letterSpacing: -1, marginBottom: 6 }}>
                    Hallo, {rider.firstName}!
                  </h1>
                  <p style={{ color: 'var(--text-secondary)', fontSize: 16, margin: 0 }}>
                    Welkom terug in je rider dashboard.
                  </p>
                </div>
                <button onClick={handleLogout} style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'var(--text-secondary)', borderRadius: 10, padding: '10px 20px', fontSize: 14, fontWeight: 700, cursor: 'pointer', flexShrink: 0 }}>
                  Uitloggen
                </button>
              </div>

              {/* Quick stats row */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 16, marginBottom: 24 }}>
                {quickStats.map(stat => (
                  <div key={stat.label} style={{ background: 'var(--bg-card)', borderRadius: 16, border: '1px solid var(--border)', padding: '20px 22px' }}>
                    <p style={{ fontSize: 28, fontWeight: 950, letterSpacing: -1, margin: '0 0 4px', color: 'var(--text-muted)' }}>
                      {stat.value}
                    </p>
                    <p style={{ fontSize: 12, color: 'var(--text-muted)', fontWeight: 600, margin: 0 }}>{stat.label}</p>
                  </div>
                ))}
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 24 }}>

                {/* Status card */}
                <div style={card}>
                  <p style={sectionLabel}>Aanmeldstatus</p>
                  <StatusStepper status={rider.status} />
                </div>

                {/* Earnings card */}
                <div style={card}>
                  <p style={sectionLabel}>Verdiensten</p>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 12, padding: '24px 0', textAlign: 'center' }}>
                    <div style={{ fontSize: 36 }}>💰</div>
                    <p style={{ fontSize: 15, fontWeight: 700, margin: 0 }}>Nog niet beschikbaar</p>
                    <p style={{ fontSize: 13, color: 'var(--text-muted)', margin: 0, lineHeight: 1.6 }}>
                      Verdiensten worden beschikbaar zodra je actief bent.
                    </p>
                  </div>
                </div>

              </div>

              {/* Assigned restaurant placeholder */}
              {(rider.status === 'matched' || rider.status === 'active') && (
                <div style={{ ...card, background: `linear-gradient(135deg, ${PURPLE}10, ${PINK}08)`, border: `1px solid ${PURPLE}25` }}>
                  <p style={sectionLabel}>Gekoppeld restaurant</p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                    <div style={{ fontSize: 32, flexShrink: 0 }}>🍕</div>
                    <p style={{ fontSize: 14, color: 'var(--text-secondary)', margin: 0, lineHeight: 1.6 }}>
                      Je wordt binnenkort gekoppeld aan een restaurant. We nemen contact met je op zodra dit is geregeld.
                    </p>
                  </div>
                </div>
              )}
              {(rider.status === 'pending' || rider.status === 'in_review') && (
                <div style={{ ...card }}>
                  <p style={sectionLabel}>Gekoppeld restaurant</p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                    <div style={{ fontSize: 32, flexShrink: 0 }}>🍕</div>
                    <p style={{ fontSize: 14, color: 'var(--text-secondary)', margin: 0, lineHeight: 1.6 }}>
                      Je wordt binnenkort gekoppeld aan een restaurant.
                    </p>
                  </div>
                </div>
              )}

              {/* Upcoming shifts */}
              <div style={card}>
                <p style={sectionLabel}>Aankomende diensten</p>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 12, padding: '24px 0', textAlign: 'center' }}>
                  <div style={{ fontSize: 36 }}>📅</div>
                  <p style={{ fontSize: 15, fontWeight: 700, margin: 0 }}>Nog geen diensten gepland</p>
                  <p style={{ fontSize: 13, color: 'var(--text-muted)', margin: 0, lineHeight: 1.6 }}>
                    Diensten worden beschikbaar zodra je bent goedgekeurd.
                  </p>
                </div>
              </div>

              {/* Rejected state */}
              {rider.status === 'rejected' && (
                <div style={{ background: 'rgba(239,68,68,0.05)', borderRadius: 20, border: '1px solid rgba(239,68,68,0.15)', padding: 'clamp(24px,4vw,36px)', textAlign: 'center', marginTop: 8 }}>
                  <div style={{ fontSize: 48, marginBottom: 16 }}>😔</div>
                  <h2 style={{ fontSize: 24, fontWeight: 950, marginBottom: 10 }}>Helaas...</h2>
                  <p style={{ color: 'var(--text-secondary)', fontSize: 16, lineHeight: 1.7, marginBottom: 24 }}>
                    Je aanmelding is op dit moment niet goedgekeurd. Je kunt je opnieuw aanmelden zodra de omstandigheden zijn veranderd.
                  </p>
                  <a href="/riders" style={{ display: 'inline-block', background: `linear-gradient(135deg,${PURPLE},${PINK})`, color: 'white', padding: '14px 28px', borderRadius: 12, fontWeight: 800, fontSize: 15, textDecoration: 'none' }}>
                    Opnieuw aanmelden →
                  </a>
                </div>
              )}
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
