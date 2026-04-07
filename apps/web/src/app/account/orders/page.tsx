'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Nav } from '../../components/Nav';
import { Footer } from '../../components/Footer';

const PURPLE = '#5A31F4';
const PINK = '#FF0080';
const ORANGE = '#FF6B35';

type Order = {
  id: string;
  restaurantName: string;
  restaurantSlug?: string;
  total: number;
  status: string;
  createdAt: string;
  items: { name: string; quantity: number }[];
};

const statusMeta: Record<string, { label: string; color: string; bg: string }> = {
  delivered:  { label: 'Bezorgd',     color: '#22C55E', bg: 'rgba(34,197,94,0.12)' },
  preparing:  { label: 'Wordt gemaakt', color: '#F59E0B', bg: 'rgba(245,158,11,0.12)' },
  on_the_way: { label: 'Onderweg',    color: PURPLE,    bg: 'rgba(90,49,244,0.12)' },
  cancelled:  { label: 'Geannuleerd', color: '#EF4444', bg: 'rgba(239,68,68,0.12)' },
  confirmed:  { label: 'Bevestigd',   color: '#60A5FA', bg: 'rgba(96,165,250,0.12)' },
};

function OrderSkeleton({ index }: { index: number }) {
  const shimmerStyle: React.CSSProperties = {
    background: 'linear-gradient(90deg, rgba(255,255,255,0.04) 25%, rgba(255,255,255,0.08) 50%, rgba(255,255,255,0.04) 75%)',
    backgroundSize: '200% 100%',
    animation: 'shimmer 1.8s ease-in-out infinite',
    borderRadius: 8,
  };
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08 }}
      style={{ padding: '24px 28px', background: 'var(--bg-card)', borderRadius: 20, border: '1px solid rgba(255,255,255,0.06)' }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14 }}>
        <div>
          <div style={{ ...shimmerStyle, width: 180, height: 20, marginBottom: 8 }} />
          <div style={{ ...shimmerStyle, width: 130, height: 13 }} />
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ ...shimmerStyle, width: 70, height: 20, marginBottom: 8, marginLeft: 'auto' }} />
          <div style={{ ...shimmerStyle, width: 80, height: 22 }} />
        </div>
      </div>
      <div style={{ ...shimmerStyle, width: '70%', height: 13, marginBottom: 18 }} />
      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <div style={{ ...shimmerStyle, width: 90, height: 38, borderRadius: 12 }} />
      </div>
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

export default function AccountOrdersPage() {
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/auth/me')
      .then(r => {
        if (!r.ok) { router.push('/login?next=/account/orders'); return null; }
        return fetch('/api/account/orders');
      })
      .then(r => r ? r.json() : null)
      .then(data => {
        if (data && Array.isArray(data)) setOrders(data);
        else if (data?.error) console.error('Orders error:', data.error);
      })
      .catch(err => console.error('Failed to load orders:', err))
      .finally(() => setLoading(false));
  }, [router]);

  return (
    <div style={{ background: 'var(--bg-page)', minHeight: '100vh', color: 'var(--text-primary)', fontFamily: 'Outfit, sans-serif' }}>
      <style>{`
        @keyframes shimmer {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
      `}</style>
      <Nav />
      <section style={{ padding: '100px 24px 60px', maxWidth: 800, margin: '0 auto' }}>

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: 40 }}>
          <Link href="/account" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: 'var(--text-muted)', fontSize: 14, fontWeight: 700, marginBottom: 20, textDecoration: 'none', transition: 'color 0.2s' }}
            onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.color = 'var(--text-primary)'; }}
            onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.color = 'var(--text-muted)'; }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6"/>
            </svg>
            Account
          </Link>
          <h1 style={{
            fontSize: 38, fontWeight: 900, marginBottom: 8, letterSpacing: '-0.5px',
            background: `linear-gradient(135deg, #fff 40%, rgba(255,255,255,0.6))`,
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
          }}>
            Mijn bestellingen
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: 15 }}>Volg huidige bestellingen en bekijk je geschiedenis.</p>
        </motion.div>

        {loading ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {[0, 1, 2, 3].map(i => <OrderSkeleton key={i} index={i} />)}
          </div>
        ) : orders.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            style={{ textAlign: 'center', padding: '80px 0' }}
          >
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
              style={{ fontSize: 80, marginBottom: 20, lineHeight: 1 }}
            >
              🍽️
            </motion.div>
            <h2 style={{
              fontSize: 28, fontWeight: 900, marginBottom: 12,
              background: `linear-gradient(135deg, ${PURPLE}, ${PINK})`,
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
            }}>
              Nog geen bestellingen
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: 16, marginBottom: 32, maxWidth: 340, marginLeft: 'auto', marginRight: 'auto' }}>
              Je bestelgeschiedenis verschijnt hier. Tijd om iets lekkers te ontdekken.
            </p>
            <Link href="/discover" style={{
              display: 'inline-block',
              background: `linear-gradient(135deg,${PURPLE},${PINK})`,
              color: '#fff',
              padding: '16px 40px',
              borderRadius: 14,
              fontSize: 16,
              fontWeight: 800,
              textDecoration: 'none',
              boxShadow: `0 8px 30px ${PURPLE}40`,
            }}>
              Ontdek restaurants
            </Link>
          </motion.div>
        ) : (
          <motion.div
            variants={listVariants}
            initial="hidden"
            animate="visible"
            style={{ display: 'flex', flexDirection: 'column', gap: 14 }}
          >
            {orders.map((o) => {
              const meta = statusMeta[o.status] ?? { label: o.status.replace('_', ' '), color: '#888', bg: 'rgba(136,136,136,0.12)' };
              const isHovered = hoveredId === o.id;
              return (
                <motion.div key={o.id} variants={cardVariants}>
                  <div
                    onMouseEnter={() => setHoveredId(o.id)}
                    onMouseLeave={() => setHoveredId(null)}
                    style={{
                      padding: '24px 28px',
                      background: isHovered ? 'rgba(255,255,255,0.03)' : 'var(--bg-card)',
                      borderRadius: 20,
                      border: `1px solid ${isHovered ? `${PURPLE}50` : 'rgba(255,255,255,0.06)'}`,
                      color: 'var(--text-primary)',
                      transform: isHovered ? 'translateY(-3px)' : 'translateY(0)',
                      boxShadow: isHovered ? `0 12px 36px rgba(0,0,0,0.35), 0 0 0 1px ${PURPLE}20` : 'none',
                      transition: 'transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease, background 0.2s ease',
                      cursor: 'pointer',
                    }}
                  >
                    <Link href={`/order/${o.id}`} style={{ display: 'block', textDecoration: 'none', color: 'inherit' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                        <div>
                          <h3 style={{ fontSize: 18, fontWeight: 800, marginBottom: 4 }}>{o.restaurantName}</h3>
                          <p style={{ color: 'var(--text-muted)', fontSize: 14 }}>
                            {new Date(o.createdAt).toLocaleDateString('nl-NL', { day: 'numeric', month: 'long', year: 'numeric' })}
                          </p>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                          <div style={{ fontSize: 20, fontWeight: 900, marginBottom: 6 }}>€{(o.total / 100).toFixed(2)}</div>
                          <span style={{
                            fontSize: 12, padding: '4px 12px', borderRadius: 20,
                            background: meta.bg,
                            color: meta.color,
                            fontWeight: 700,
                            border: `1px solid ${meta.color}30`,
                          }}>
                            {meta.label}
                          </span>
                        </div>
                      </div>
                      <p style={{ color: 'var(--text-muted)', fontSize: 14, lineHeight: 1.5 }}>
                        {o.items.map(it => `${it.quantity}× ${it.name}`).join(', ')}
                      </p>
                    </Link>
                    <div style={{ marginTop: 18, display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
                      <Link
                        href={`/order/${o.id}`}
                        style={{
                          display: 'inline-flex', alignItems: 'center', gap: 6,
                          padding: '10px 20px', borderRadius: 12,
                          background: 'rgba(255,255,255,0.06)',
                          border: '1px solid rgba(255,255,255,0.08)',
                          color: 'var(--text-secondary)', fontSize: 13, fontWeight: 700,
                          textDecoration: 'none',
                        }}
                      >
                        Details
                      </Link>
                      <Link
                        href={o.restaurantSlug ? `/menu/${o.restaurantSlug}` : '/discover'}
                        style={{
                          display: 'inline-flex', alignItems: 'center', gap: 6,
                          background: `linear-gradient(135deg,${PURPLE},${PINK})`,
                          color: '#fff',
                          padding: '10px 22px',
                          borderRadius: 12,
                          fontSize: 13,
                          fontWeight: 700,
                          textDecoration: 'none',
                          boxShadow: isHovered ? `0 4px 16px ${PURPLE}40` : 'none',
                          transition: 'box-shadow 0.2s ease',
                        }}
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 102.13-9.36L1 10"/>
                        </svg>
                        Opnieuw bestellen
                      </Link>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        )}
      </section>
      <Footer />
    </div>
  );
}
