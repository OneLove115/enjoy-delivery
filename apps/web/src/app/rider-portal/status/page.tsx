'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Nav } from '../../components/Nav';
import { Footer } from '../../components/Footer';

const PURPLE = '#5A31F4';
const PINK = '#FF0080';
const ORANGE = '#FF6B00';

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

const stages: { key: ApplicationStatus | 'in_review'; label: string; description: string }[] = [
  { key: 'pending', label: 'Aangemeld', description: 'Je aanmelding is ontvangen.' },
  { key: 'in_review', label: 'In behandeling', description: 'We controleren je gegevens.' },
  { key: 'approved', label: 'Goedgekeurd', description: 'Welkom bij het team!' },
  { key: 'rejected', label: 'Afgewezen', description: 'Je aanmelding is helaas niet goedgekeurd.' },
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
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 50% 0%, rgba(90,49,244,0.1) 0%, transparent 60%)' }} />
        <div style={{ position: 'relative', zIndex: 1, maxWidth: 680, margin: '0 auto' }}>

          {/* Loading */}
          {loading && (
            <div>
              <style>{`@keyframes shimmer { 0% { background-position: 200% 0; } 100% { background-position: -200% 0; } }`}</style>
              {/* Header skeleton */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 40 }}>
                <div>
                  <div style={{ height: 34, width: 200, borderRadius: 8, marginBottom: 8, animation: 'shimmer 1.8s infinite', backgroundImage: 'linear-gradient(90deg, var(--bg-elevated) 25%, var(--border) 50%, var(--bg-elevated) 75%)', backgroundSize: '200% 100%' }} />
                  <div style={{ height: 16, width: 250, borderRadius: 6, animation: 'shimmer 1.8s infinite', backgroundImage: 'linear-gradient(90deg, var(--bg-elevated) 25%, var(--border) 50%, var(--bg-elevated) 75%)', backgroundSize: '200% 100%' }} />
                </div>
                <div style={{ height: 40, width: 100, borderRadius: 10, animation: 'shimmer 1.8s infinite', backgroundImage: 'linear-gradient(90deg, var(--bg-elevated) 25%, var(--border) 50%, var(--bg-elevated) 75%)', backgroundSize: '200% 100%' }} />
              </div>
              {/* Info card skeleton */}
              <div style={{ background: 'var(--bg-elevated)', borderRadius: 20, border: '1px solid var(--border)', padding: 'clamp(20px,4vw,32px)', marginBottom: 28 }}>
                <div style={{ height: 12, width: 100, borderRadius: 6, marginBottom: 20, animation: 'shimmer 1.8s infinite', backgroundImage: 'linear-gradient(90deg, var(--bg-elevated) 25%, var(--border) 50%, var(--bg-elevated) 75%)', backgroundSize: '200% 100%' }} />
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16 }}>
                  {[0,1,2,3,4].map(i => (
                    <div key={i}>
                      <div style={{ height: 12, width: 60, borderRadius: 6, marginBottom: 6, animation: 'shimmer 1.8s infinite', backgroundImage: 'linear-gradient(90deg, var(--bg-elevated) 25%, var(--border) 50%, var(--bg-elevated) 75%)', backgroundSize: '200% 100%' }} />
                      <div style={{ height: 15, width: 120, borderRadius: 6, animation: 'shimmer 1.8s infinite', backgroundImage: 'linear-gradient(90deg, var(--bg-elevated) 25%, var(--border) 50%, var(--bg-elevated) 75%)', backgroundSize: '200% 100%' }} />
                    </div>
                  ))}
                </div>
              </div>
              {/* Stepper skeleton */}
              <div style={{ background: 'var(--bg-elevated)', borderRadius: 20, border: '1px solid var(--border)', padding: 'clamp(20px,4vw,32px)' }}>
                <div style={{ height: 12, width: 100, borderRadius: 6, marginBottom: 28, animation: 'shimmer 1.8s infinite', backgroundImage: 'linear-gradient(90deg, var(--bg-elevated) 25%, var(--border) 50%, var(--bg-elevated) 75%)', backgroundSize: '200% 100%' }} />
                {[0,1,2].map(i => (
                  <div key={i} style={{ display: 'flex', gap: 16, marginBottom: 24 }}>
                    <div style={{ width: 40, height: 40, borderRadius: '50%', flexShrink: 0, animation: 'shimmer 1.8s infinite', backgroundImage: 'linear-gradient(90deg, var(--bg-elevated) 25%, var(--border) 50%, var(--bg-elevated) 75%)', backgroundSize: '200% 100%' }} />
                    <div style={{ paddingTop: 8, flex: 1 }}>
                      <div style={{ height: 15, width: 120, borderRadius: 6, animation: 'shimmer 1.8s infinite', backgroundImage: 'linear-gradient(90deg, var(--bg-elevated) 25%, var(--border) 50%, var(--bg-elevated) 75%)', backgroundSize: '200% 100%' }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Error */}
          {!loading && error && (
            <div style={{ textAlign: 'center', padding: '60px 40px', background: 'rgba(239,68,68,0.06)', borderRadius: 24, border: '1px solid rgba(239,68,68,0.2)' }}>
              <div style={{ fontSize: 48, marginBottom: 16 }}>⚠️</div>
              <h2 style={{ fontSize: 22, fontWeight: 800, marginBottom: 10 }}>Fout bij ophalen</h2>
              <p style={{ color: 'var(--text-secondary)', marginBottom: 28 }}>{error}</p>
              <button onClick={handleLogout} style={{ background: 'var(--b8)', color: 'var(--text-primary)', border: 'none', borderRadius: 12, padding: '12px 28px', fontSize: 15, fontWeight: 700, cursor: 'pointer' }}>
                Opnieuw inloggen
              </button>
            </div>
          )}

          {/* Status dashboard */}
          {!loading && rider && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              {/* Header row */}
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16, marginBottom: 40 }}>
                <div>
                  <h1 style={{ fontSize: 'clamp(24px,5vw,38px)', fontWeight: 950, letterSpacing: -1, marginBottom: 6 }}>
                    Hallo, {rider.firstName}!
                  </h1>
                  <p style={{ color: 'var(--text-secondary)', fontSize: 16 }}>Hier is de status van je aanmelding.</p>
                </div>
                <button onClick={handleLogout}
                  style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'var(--text-secondary)', borderRadius: 10, padding: '10px 20px', fontSize: 14, fontWeight: 700, cursor: 'pointer' }}>
                  Uitloggen
                </button>
              </div>

              {/* Rider info card */}
              <div style={{ background: 'var(--bg-card)', borderRadius: 20, border: '1px solid var(--border)', padding: 'clamp(20px,4vw,32px)', marginBottom: 28 }}>
                <h2 style={{ fontSize: 16, fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 20 }}>Jouw gegevens</h2>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16 }}>
                  {[
                    { label: 'Naam', value: `${rider.firstName} ${rider.lastName}` },
                    { label: 'E-mail', value: rider.email },
                    { label: 'Stad', value: rider.city },
                    { label: 'Voertuig', value: rider.vehicle },
                    { label: 'Aangemeld op', value: formatDate(rider.appliedAt) },
                  ].map(item => (
                    <div key={item.label}>
                      <p style={{ fontSize: 12, color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 4 }}>{item.label}</p>
                      <p style={{ fontSize: 15, fontWeight: 600 }}>{item.value}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Status stepper */}
              <div style={{ background: 'var(--bg-card)', borderRadius: 20, border: '1px solid var(--border)', padding: 'clamp(20px,4vw,32px)', marginBottom: 28 }}>
                <h2 style={{ fontSize: 16, fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 28 }}>Aanmeldstatus</h2>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
                  {stages.filter(s => rider.status === 'rejected' ? s.key !== 'approved' : s.key !== 'rejected').map((stage, i, arr) => {
                    const currentIndex = getStageIndex(rider.status);
                    const isActive = i === currentIndex;
                    const isDone = i < currentIndex;
                    const isLast = i === arr.length - 1;

                    return (
                      <motion.div
                        key={stage.key}
                        initial={{ opacity: 0, x: -16 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.35, delay: i * 0.12 }}
                        style={{ display: 'flex', gap: 16, position: 'relative' }}
                      >
                        {/* Connector line */}
                        {!isLast && (
                          <div style={{ position: 'absolute', left: 19, top: 40, width: 2, height: 'calc(100% - 12px)', background: isDone || isActive ? `linear-gradient(${PURPLE}, ${PINK})` : 'rgba(255,255,255,0.08)' }} />
                        )}

                        {/* Circle */}
                        <div style={{ flexShrink: 0, width: 40, height: 40, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, fontWeight: 900, position: 'relative', zIndex: 1, background: isActive ? `linear-gradient(135deg,${PURPLE},${PINK})` : isDone ? `${PURPLE}30` : 'rgba(255,255,255,0.06)', border: isActive ? 'none' : isDone ? `1px solid ${PURPLE}60` : '1px solid rgba(255,255,255,0.1)', boxShadow: isActive ? `0 4px 16px ${PURPLE}50` : 'none', color: isActive || isDone ? 'white' : 'var(--text-muted)' }}>
                          {isDone ? '✓' : i + 1}
                        </div>

                        {/* Label */}
                        <div style={{ paddingBottom: isLast ? 0 : 28, paddingTop: 8 }}>
                          <p style={{ fontSize: 15, fontWeight: isActive ? 800 : 600, margin: 0, color: isActive ? 'var(--text-primary)' : isDone ? 'var(--text-secondary)' : 'var(--text-muted)' }}>
                            {stage.label}
                          </p>
                          {isActive && (
                            <p style={{ fontSize: 13, color: 'var(--text-secondary)', margin: '4px 0 0' }}>{stage.description}</p>
                          )}
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </div>

              {/* Approved message */}
              {rider.status === 'approved' && (
                <div style={{ background: `linear-gradient(135deg, ${PURPLE}15, ${PINK}10)`, borderRadius: 20, border: `1px solid ${PURPLE}30`, padding: 'clamp(24px,4vw,36px)', textAlign: 'center' }}>
                  <div style={{ fontSize: 56, marginBottom: 16 }}>🎉</div>
                  <h2 style={{ fontSize: 24, fontWeight: 950, marginBottom: 10 }}>Welkom bij het team!</h2>
                  <p style={{ color: 'var(--text-secondary)', fontSize: 16, lineHeight: 1.7, marginBottom: 24 }}>
                    Je bent goedgekeurd als EnJoy bezorger. Download de bezorger-app en begin vandaag nog met verdienen.
                  </p>
                  <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
                    <a href="#" style={{ background: `linear-gradient(135deg,${ORANGE},${PINK})`, color: 'white', padding: '14px 28px', borderRadius: 12, fontWeight: 800, fontSize: 15, textDecoration: 'none', boxShadow: `0 6px 20px ${ORANGE}35` }}>
                      Download de bezorger-app →
                    </a>
                    <Link href="/discover" style={{ background: 'rgba(255,255,255,0.06)', color: 'var(--text-primary)', padding: '14px 28px', borderRadius: 12, fontWeight: 700, fontSize: 15, textDecoration: 'none' }}>
                      Ontdek EnJoy
                    </Link>
                  </div>
                </div>
              )}

              {/* Rejected message */}
              {rider.status === 'rejected' && (
                <div style={{ background: 'rgba(239,68,68,0.05)', borderRadius: 20, border: '1px solid rgba(239,68,68,0.15)', padding: 'clamp(24px,4vw,36px)', textAlign: 'center' }}>
                  <div style={{ fontSize: 56, marginBottom: 16 }}>😔</div>
                  <h2 style={{ fontSize: 24, fontWeight: 950, marginBottom: 10 }}>Helaas...</h2>
                  <p style={{ color: 'var(--text-secondary)', fontSize: 16, lineHeight: 1.7, marginBottom: 24 }}>
                    Je aanmelding is op dit moment niet goedgekeurd. Je kunt je opnieuw aanmelden zodra de omstandigheden veranderd zijn.
                  </p>
                  <Link href="/riders" style={{ display: 'inline-block', background: `linear-gradient(135deg,${PURPLE},${PINK})`, color: 'white', padding: '14px 28px', borderRadius: 12, fontWeight: 800, fontSize: 15, textDecoration: 'none' }}>
                    Opnieuw aanmelden →
                  </Link>
                </div>
              )}
            </motion.div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}
