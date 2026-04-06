'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Nav } from '../../components/Nav';
import { Footer } from '../../components/Footer';

const PURPLE = '#5A31F4';
const PINK   = '#FF0080';
const ORANGE = '#FF6B35';

const VP_API = process.env.NEXT_PUBLIC_VP_DOMAIN || 'https://www.veloci.online';

type Reservation = {
  id: string;
  tenantId: string;
  restaurantName?: string;
  restaurantSlug?: string;
  date: string;
  time: string;
  partySize: number;
  customerName: string;
  customerEmail: string;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed' | 'no_show';
  occasion?: string;
  notes?: string;
  depositAmount?: number;
  depositPaid?: boolean;
  createdAt: string;
};

const STATUS_META: Record<string, { label: string; color: string; bg: string }> = {
  pending:   { label: 'In behandeling', color: '#F59E0B', bg: 'rgba(245,158,11,0.12)' },
  confirmed: { label: 'Bevestigd',      color: '#22C55E', bg: 'rgba(34,197,94,0.12)'  },
  cancelled: { label: 'Geannuleerd',    color: '#EF4444', bg: 'rgba(239,68,68,0.12)'  },
  completed: { label: 'Voltooid',       color: PURPLE,    bg: `rgba(90,49,244,0.12)`  },
  no_show:   { label: 'Niet verschenen', color: '#6B7280', bg: 'rgba(107,114,128,0.12)' },
};

const DAY_LABELS: Record<number, string> = {
  0: 'zo', 1: 'ma', 2: 'di', 3: 'wo', 4: 'do', 5: 'vr', 6: 'za',
};
const MONTH_LABELS: Record<number, string> = {
  0: 'jan', 1: 'feb', 2: 'mrt', 3: 'apr',
  4: 'mei', 5: 'jun', 6: 'jul', 7: 'aug',
  8: 'sep', 9: 'okt', 10: 'nov', 11: 'dec',
};

function formatDate(dateStr: string): string {
  const d = new Date(dateStr + 'T12:00:00');
  return `${DAY_LABELS[d.getDay()]} ${d.getDate()} ${MONTH_LABELS[d.getMonth()]} ${d.getFullYear()}`;
}

function isUpcoming(dateStr: string, timeStr: string): boolean {
  const dt = new Date(`${dateStr}T${timeStr || '00:00'}:00`);
  return dt > new Date();
}

function StatusBadge({ status }: { status: string }) {
  const meta = STATUS_META[status] || { label: status, color: '#6B7280', bg: 'rgba(107,114,128,0.12)' };
  return (
    <span style={{
      padding: '4px 10px',
      borderRadius: 20,
      fontSize: 11,
      fontWeight: 800,
      color: meta.color,
      background: meta.bg,
      letterSpacing: '0.02em',
    }}>
      {meta.label}
    </span>
  );
}

function ReservationSkeleton({ index }: { index: number }) {
  const shimmer: React.CSSProperties = {
    background: 'linear-gradient(90deg, rgba(255,255,255,0.04) 25%, rgba(255,255,255,0.08) 50%, rgba(255,255,255,0.04) 75%)',
    backgroundSize: '200% 100%',
    animation: 'shimmer 1.8s ease-in-out infinite',
    borderRadius: 8,
  };
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.07 }}
      style={{ padding: '22px 24px', background: 'var(--bg-card)', borderRadius: 20, border: '1px solid rgba(255,255,255,0.06)' }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 14 }}>
        <div style={{ ...shimmer, width: 170, height: 18 }} />
        <div style={{ ...shimmer, width: 80, height: 22, borderRadius: 20 }} />
      </div>
      <div style={{ ...shimmer, width: 130, height: 13, marginBottom: 8 }} />
      <div style={{ ...shimmer, width: '60%', height: 13 }} />
    </motion.div>
  );
}

const listVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.07 } },
};

const cardVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] } },
};

export default function AccountReservationsPage() {
  const router  = useRouter();
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading]           = useState(true);
  const [cancellingId, setCancellingId] = useState<string | null>(null);
  const [cancelError, setCancelError]   = useState<string | null>(null);
  const [consumerId, setConsumerId]     = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/auth/me')
      .then(r => r.ok ? r.json() : null)
      .then(user => {
        if (!user) { router.push('/login'); return; }
        setConsumerId(user.id);
        return fetch(`${VP_API}/api/reservations?consumerId=${user.id}`, {
          headers: { 'Content-Type': 'application/json' },
        });
      })
      .then(r => (r && r.ok ? r.json() : null))
      .then(data => {
        if (data) setReservations(data.reservations || data || []);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [router]);

  const handleCancel = async (id: string) => {
    if (!confirm('Weet je zeker dat je deze reservering wilt annuleren?')) return;
    setCancellingId(id);
    setCancelError(null);
    try {
      const res = await fetch(`${VP_API}/api/reservations/${id}/cancel`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ consumerId }),
      });
      if (!res.ok) throw new Error('Annuleren mislukt');
      setReservations(prev =>
        prev.map(r => r.id === id ? { ...r, status: 'cancelled' } : r)
      );
    } catch {
      setCancelError('Annuleren mislukt. Probeer het opnieuw of neem contact op met het restaurant.');
    } finally {
      setCancellingId(null);
    }
  };

  const upcoming = reservations.filter(r => r.status !== 'cancelled' && isUpcoming(r.date, r.time));
  const past     = reservations.filter(r => r.status === 'cancelled' || !isUpcoming(r.date, r.time));

  return (
    <div style={{ background: 'var(--bg-page)', minHeight: '100vh', color: 'var(--text-primary)', fontFamily: 'Outfit, sans-serif' }}>
      <style>{`
        @keyframes shimmer { 0% { background-position: 200% 0; } 100% { background-position: -200% 0; } }
      `}</style>
      <Nav />
      <div style={{ maxWidth: 640, margin: '0 auto', padding: '100px 20px 80px' }}>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          style={{ marginBottom: 32 }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
            <Link href="/account" style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'rgba(255,255,255,0.45)', fontWeight: 600, fontSize: 14, textDecoration: 'none' }}>
              ← Account
            </Link>
          </div>
          <h1 style={{ fontSize: 28, fontWeight: 900, marginBottom: 4 }}>Mijn reserveringen</h1>
          <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.45)' }}>
            {loading ? 'Laden...' : `${reservations.length} reservering${reservations.length !== 1 ? 'en' : ''} gevonden`}
          </p>
        </motion.div>

        {/* Cancel error */}
        {cancelError && (
          <div style={{ padding: '12px 16px', borderRadius: 12, background: 'rgba(239,68,68,0.10)', border: '1px solid rgba(239,68,68,0.25)', fontSize: 13, color: '#EF4444', marginBottom: 20 }}>
            {cancelError}
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {[0, 1, 2].map(i => <ReservationSkeleton key={i} index={i} />)}
          </div>
        )}

        {/* Empty state */}
        {!loading && reservations.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            style={{
              textAlign: 'center', padding: '60px 20px',
              background: 'var(--bg-card)', borderRadius: 24,
              border: '1px solid rgba(255,255,255,0.06)',
            }}
          >
            <div style={{ fontSize: 48, marginBottom: 16 }}>🍽️</div>
            <div style={{ fontSize: 18, fontWeight: 800, marginBottom: 8 }}>Nog geen reserveringen</div>
            <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.45)', marginBottom: 24 }}>
              Reserveer een tafel bij een van onze restaurants.
            </div>
            <Link
              href="/discover"
              style={{
                display: 'inline-block', padding: '12px 28px',
                background: `linear-gradient(135deg,${PURPLE},${PINK})`,
                borderRadius: 14, color: 'white', fontSize: 14, fontWeight: 800,
                textDecoration: 'none', boxShadow: '0 8px 20px rgba(90,49,244,0.3)',
              }}
            >
              Restaurants ontdekken
            </Link>
          </motion.div>
        )}

        {/* Upcoming */}
        {!loading && upcoming.length > 0 && (
          <div style={{ marginBottom: 36 }}>
            <div style={{ fontSize: 11, fontWeight: 800, color: PURPLE, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 14 }}>
              Aankomend
            </div>
            <motion.div
              variants={listVariants}
              initial="hidden"
              animate="visible"
              style={{ display: 'flex', flexDirection: 'column', gap: 14 }}
            >
              {upcoming.map(r => (
                <motion.div
                  key={r.id}
                  variants={cardVariants}
                  style={{
                    background: 'var(--bg-card)',
                    borderRadius: 20,
                    border: `1px solid rgba(90,49,244,0.18)`,
                    overflow: 'hidden',
                    position: 'relative',
                  }}
                >
                  {/* Accent line */}
                  <div style={{ height: 3, background: `linear-gradient(90deg,${PURPLE},${PINK})` }} />

                  <div style={{ padding: '20px 22px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14, gap: 12 }}>
                      <div>
                        <div style={{ fontSize: 17, fontWeight: 900, marginBottom: 3 }}>
                          {r.restaurantName || 'Restaurant'}
                        </div>
                        <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)' }}>
                          {formatDate(r.date)} om {r.time}
                        </div>
                      </div>
                      <StatusBadge status={r.status} />
                    </div>

                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 16 }}>
                      <span style={{ fontSize: 12, padding: '4px 10px', borderRadius: 8, background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.6)', fontWeight: 600 }}>
                        👥 {r.partySize} {r.partySize === 1 ? 'persoon' : 'personen'}
                      </span>
                      {r.occasion && r.occasion !== '' && (
                        <span style={{ fontSize: 12, padding: '4px 10px', borderRadius: 8, background: `rgba(255,0,128,0.08)`, color: PINK, fontWeight: 700 }}>
                          🎉 {r.occasion}
                        </span>
                      )}
                      {r.depositPaid && r.depositAmount && (
                        <span style={{ fontSize: 12, padding: '4px 10px', borderRadius: 8, background: `rgba(255,107,53,0.08)`, color: ORANGE, fontWeight: 700 }}>
                          💳 Aanbetaling betaald
                        </span>
                      )}
                    </div>

                    {r.notes && (
                      <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', marginBottom: 14, fontStyle: 'italic' }}>
                        "{r.notes}"
                      </div>
                    )}

                    <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
                      {r.restaurantSlug && (
                        <Link
                          href={`/menu/${r.restaurantSlug}`}
                          style={{
                            padding: '9px 18px', borderRadius: 10,
                            background: `rgba(90,49,244,0.15)`,
                            border: `1px solid rgba(90,49,244,0.30)`,
                            color: PURPLE, fontSize: 13, fontWeight: 800, textDecoration: 'none',
                          }}
                        >
                          Menu
                        </Link>
                      )}
                      {r.status !== 'cancelled' && (
                        <button
                          onClick={() => handleCancel(r.id)}
                          disabled={cancellingId === r.id}
                          style={{
                            padding: '9px 18px', borderRadius: 10,
                            background: cancellingId === r.id ? 'rgba(239,68,68,0.05)' : 'rgba(239,68,68,0.08)',
                            border: '1px solid rgba(239,68,68,0.25)',
                            color: '#EF4444', fontSize: 13, fontWeight: 800,
                            cursor: cancellingId === r.id ? 'not-allowed' : 'pointer',
                            fontFamily: 'Outfit, sans-serif',
                            opacity: cancellingId === r.id ? 0.6 : 1,
                          }}
                        >
                          {cancellingId === r.id ? 'Bezig...' : 'Annuleer'}
                        </button>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        )}

        {/* Past */}
        {!loading && past.length > 0 && (
          <div>
            <div style={{ fontSize: 11, fontWeight: 800, color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 14 }}>
              Verleden
            </div>
            <motion.div
              variants={listVariants}
              initial="hidden"
              animate="visible"
              style={{ display: 'flex', flexDirection: 'column', gap: 12 }}
            >
              {past.map(r => (
                <motion.div
                  key={r.id}
                  variants={cardVariants}
                  style={{
                    background: 'var(--bg-card)',
                    borderRadius: 18,
                    border: '1px solid rgba(255,255,255,0.05)',
                    padding: '18px 22px',
                    opacity: 0.75,
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12, marginBottom: 10 }}>
                    <div>
                      <div style={{ fontSize: 15, fontWeight: 800, marginBottom: 2 }}>
                        {r.restaurantName || 'Restaurant'}
                      </div>
                      <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)' }}>
                        {formatDate(r.date)} om {r.time} · {r.partySize} {r.partySize === 1 ? 'persoon' : 'personen'}
                      </div>
                    </div>
                    <StatusBadge status={r.status} />
                  </div>
                  {r.restaurantSlug && r.status !== 'cancelled' && (
                    <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                      <Link
                        href={`/reserve/${r.restaurantSlug}`}
                        style={{
                          padding: '8px 16px', borderRadius: 10,
                          background: 'rgba(255,255,255,0.05)',
                          border: '1px solid rgba(255,255,255,0.10)',
                          color: 'rgba(255,255,255,0.55)', fontSize: 12, fontWeight: 700, textDecoration: 'none',
                        }}
                      >
                        Opnieuw reserveren
                      </Link>
                    </div>
                  )}
                </motion.div>
              ))}
            </motion.div>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}
