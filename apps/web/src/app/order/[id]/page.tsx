'use client';
import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Nav } from '../../components/Nav';

const PURPLE = '#5A31F4';
const PINK = '#FF0080';

type Order = {
  id: string;
  restaurantName: string;
  status: 'confirmed' | 'preparing' | 'ready' | 'on_the_way' | 'delivered' | 'cancelled';
  total: number;
  estimatedMinutes?: number;
  items: { name: string; quantity: number; price: number }[];
  rider?: { name: string };
  address: string;
};

const STAGES = [
  { key: 'confirmed', label: 'Order confirmed', icon: '✅' },
  { key: 'preparing', label: 'Being prepared', icon: '👨‍🍳' },
  { key: 'ready', label: 'Ready for pickup', icon: '📦' },
  { key: 'on_the_way', label: 'On the way', icon: '🚲' },
  { key: 'delivered', label: 'Delivered', icon: '🎉' },
];

export default function OrderTrackingPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const load = () =>
      fetch(`/api/orders/${id}`)
        .then(r => { if (!r.ok) { setError('Order not found'); return null; } return r.json(); })
        .then(d => d && setOrder(d))
        .catch(() => setError('Failed to load order'));

    fetch('/api/auth/me')
      .then(r => { if (!r.ok) { router.push('/login'); return false; } return true; })
      .then(ok => ok && load())
      .finally(() => setLoading(false));

    const interval = setInterval(load, 30000);
    return () => clearInterval(interval);
  }, [id, router]);

  const activeStage = order ? STAGES.findIndex(s => s.key === order.status) : -1;

  return (
    <div style={{ background: 'var(--bg-page)', minHeight: '100vh', color: 'var(--text-primary)', fontFamily: 'Outfit, sans-serif' }}>
      <Nav />
      <section style={{ padding: '100px 40px 60px', maxWidth: 720, margin: '0 auto' }}>
        {loading ? (
          <div style={{ textAlign: 'center', padding: '80px 0', color: 'var(--text-muted)' }}>Loading your order...</div>
        ) : error ? (
          <div style={{ textAlign: 'center', padding: '80px 0' }}>
            <p style={{ color: '#EF4444', marginBottom: 24 }}>{error}</p>
            <Link href="/account/orders" style={{ color: PURPLE, fontWeight: 700, textDecoration: 'none' }}>← Back to orders</Link>
          </div>
        ) : order ? (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <Link href="/account/orders" style={{ color: 'var(--text-muted)', fontSize: 14, textDecoration: 'none', display: 'block', marginBottom: 28 }}>← All orders</Link>
            <h1 style={{ fontSize: 32, fontWeight: 900, marginBottom: 4 }}>Order from {order.restaurantName}</h1>
            {order.estimatedMinutes && order.status !== 'delivered' && (
              <p style={{ fontSize: 18, color: PURPLE, fontWeight: 700, marginBottom: 32 }}>🕐 Arriving in ~{order.estimatedMinutes} minutes</p>
            )}

            {/* Progress tracker */}
            <div style={{ background: 'var(--bg-card)', borderRadius: 20, border: '1px solid var(--border)', padding: '32px 28px', marginBottom: 24 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', position: 'relative' }}>
                <div style={{ position: 'absolute', top: 20, left: '10%', right: '10%', height: 3, background: 'var(--b8)', borderRadius: 4 }} />
                <div style={{ position: 'absolute', top: 20, left: '10%', height: 3, background: `linear-gradient(90deg,${PURPLE},${PINK})`, borderRadius: 4, width: `${Math.min(activeStage / (STAGES.length - 1) * 80, 80)}%`, transition: 'width 1s ease' }} />
                {STAGES.map((s, i) => (
                  <div key={s.key} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10, zIndex: 1 }}>
                    <div style={{ width: 40, height: 40, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, background: i <= activeStage ? `linear-gradient(135deg,${PURPLE},${PINK})` : 'rgba(255,255,255,0.06)', transition: 'background 0.5s', boxShadow: i === activeStage ? `0 0 16px ${PURPLE}60` : 'none' }}>{s.icon}</div>
                    <span style={{ fontSize: 11, color: i <= activeStage ? 'white' : 'rgba(255,255,255,0.25)', fontWeight: 700, textAlign: 'center', maxWidth: 70 }}>{s.label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Rider info */}
            {order.rider && order.status === 'on_the_way' && (
              <div style={{ background: `${PURPLE}10`, border: `1px solid ${PURPLE}30`, borderRadius: 16, padding: '20px 24px', marginBottom: 24, display: 'flex', alignItems: 'center', gap: 16 }}>
                <div style={{ width: 48, height: 48, background: `linear-gradient(135deg,${PURPLE},${PINK})`, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22 }}>🚲</div>
                <div>
                  <p style={{ fontWeight: 800, fontSize: 16, margin: 0 }}>{order.rider.name} is on the way</p>
                  <p style={{ color: 'var(--text-muted)', fontSize: 14, margin: 0 }}>Delivering to {order.address}</p>
                </div>
              </div>
            )}

            {/* Order items */}
            <div style={{ background: 'var(--bg-card)', borderRadius: 20, border: '1px solid var(--border)', padding: '24px 28px' }}>
              <h3 style={{ fontSize: 18, fontWeight: 800, marginBottom: 16 }}>Order summary</h3>
              {order.items.map((item, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: i < order.items.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none' }}>
                  <span style={{ color: 'rgba(255,255,255,0.7)' }}>{item.quantity}× {item.name}</span>
                  <span style={{ fontWeight: 700 }}>€{(item.price / 100).toFixed(2)}</span>
                </div>
              ))}
              <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: 16, marginTop: 4 }}>
                <span style={{ fontWeight: 800, fontSize: 16 }}>Total</span>
                <span style={{ fontWeight: 900, fontSize: 16 }}>€{(order.total / 100).toFixed(2)}</span>
              </div>
            </div>
          </motion.div>
        ) : null}
      </section>
    </div>
  );
}
