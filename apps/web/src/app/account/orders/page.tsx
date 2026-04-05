'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Nav } from '../../components/Nav';
import { Footer } from '../../components/Footer';

const PURPLE = '#5A31F4';
const PINK = '#FF0080';

type Order = {
  id: string;
  restaurantName: string;
  restaurantSlug?: string;
  total: number;
  status: string;
  createdAt: string;
  items: { name: string; quantity: number }[];
};

const statusColors: Record<string, string> = {
  delivered: '#22C55E',
  preparing: '#F59E0B',
  on_the_way: PURPLE,
  cancelled: '#EF4444',
  confirmed: '#60A5FA',
};

function OrderSkeleton({ index }: { index: number }) {
  const shimmerStyle: React.CSSProperties = {
    background: 'linear-gradient(90deg, var(--bg-elevated) 25%, var(--border) 50%, var(--bg-elevated) 75%)',
    backgroundSize: '200% 100%',
    animation: 'shimmer 1.8s ease-in-out infinite',
    borderRadius: 8,
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      style={{
        padding: '24px 28px',
        background: 'var(--bg-card)',
        borderRadius: 20,
        border: '1px solid var(--border)',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
        <div>
          <div style={{ ...shimmerStyle, width: 180, height: 20, marginBottom: 8 }} />
          <div style={{ ...shimmerStyle, width: 130, height: 14 }} />
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ ...shimmerStyle, width: 70, height: 20, marginBottom: 8, marginLeft: 'auto' }} />
          <div style={{ ...shimmerStyle, width: 80, height: 22 }} />
        </div>
      </div>
      <div style={{ ...shimmerStyle, width: '75%', height: 14, marginBottom: 16 }} />
      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <div style={{ ...shimmerStyle, width: 90, height: 38, borderRadius: 12 }} />
      </div>
    </motion.div>
  );
}

export default function AccountOrdersPage() {
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/auth/me')
      .then(r => { if (!r.ok) { router.push('/login?next=/account/orders'); return false; } return true; })
      .then(ok => ok && fetch('/api/account/orders'))
      .then(r => r && r.json())
      .then(data => { if (data) setOrders(Array.isArray(data) ? data : []); })
      .catch(console.error)
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
      <section style={{ padding: '100px 60px 60px', maxWidth: 800, margin: '0 auto' }}>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 style={{ fontSize: 38, fontWeight: 900, marginBottom: 8 }}>Your orders</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: 15, marginBottom: 40 }}>Track current orders and view your history.</p>
        </motion.div>

        {loading ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {[0, 1, 2, 3].map(i => (
              <OrderSkeleton key={i} index={i} />
            ))}
          </div>
        ) : orders.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            style={{ textAlign: 'center', padding: '80px 0' }}
          >
            <div style={{ fontSize: 80, marginBottom: 20, lineHeight: 1 }}>🍽️</div>
            <h2 style={{
              fontSize: 28,
              fontWeight: 900,
              marginBottom: 12,
              background: `linear-gradient(135deg, ${PURPLE}, ${PINK})`,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}>
              No orders yet
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: 16, marginBottom: 32, maxWidth: 340, marginLeft: 'auto', marginRight: 'auto' }}>
              Your order history will appear here. Time to discover something delicious.
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
              transition: 'transform 0.2s, box-shadow 0.2s',
            }}>
              Discover restaurants
            </Link>
          </motion.div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {orders.map((o, i) => (
              <motion.div key={o.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}>
                <div
                  onMouseEnter={() => setHoveredId(o.id)}
                  onMouseLeave={() => setHoveredId(null)}
                  style={{
                    padding: '24px 28px',
                    background: 'var(--bg-card)',
                    borderRadius: 20,
                    border: `1px solid ${hoveredId === o.id ? PURPLE + '60' : 'var(--border)'}`,
                    color: 'var(--text-primary)',
                    transform: hoveredId === o.id ? 'translateY(-2px)' : 'translateY(0)',
                    boxShadow: hoveredId === o.id ? `0 8px 30px ${PURPLE}20` : 'none',
                    transition: 'transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease',
                  }}
                >
                  <Link href={`/order/${o.id}`} style={{ display: 'block', textDecoration: 'none', color: 'inherit' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                      <div>
                        <h3 style={{ fontSize: 18, fontWeight: 800, marginBottom: 4 }}>{o.restaurantName}</h3>
                        <p style={{ color: 'var(--text-muted)', fontSize: 14 }}>{new Date(o.createdAt).toLocaleDateString('nl-NL', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: 18, fontWeight: 800, marginBottom: 4 }}>€{(o.total / 100).toFixed(2)}</div>
                        <span style={{ fontSize: 12, padding: '3px 10px', borderRadius: 20, background: `${statusColors[o.status] ?? '#888'}20`, color: statusColors[o.status] ?? '#888', fontWeight: 700 }}>
                          {o.status.replace('_', ' ')}
                        </span>
                      </div>
                    </div>
                    <p style={{ color: 'var(--text-muted)', fontSize: 14 }}>{o.items.map(it => `${it.quantity}× ${it.name}`).join(', ')}</p>
                  </Link>
                  <div style={{ marginTop: 16, display: 'flex', justifyContent: 'flex-end' }}>
                    <Link
                      href={o.restaurantSlug ? `/menu/${o.restaurantSlug}` : '/discover'}
                      style={{
                        display: 'inline-block',
                        background: `linear-gradient(135deg,${PURPLE},${PINK})`,
                        color: 'white',
                        padding: '10px 22px',
                        borderRadius: 12,
                        fontSize: 14,
                        fontWeight: 700,
                        textDecoration: 'none',
                      }}
                    >
                      Reorder
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </section>
      <Footer />
    </div>
  );
}
