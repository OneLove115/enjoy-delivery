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

export default function AccountOrdersPage() {
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

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
      <Nav />
      <section style={{ padding: '100px 60px 60px', maxWidth: 800, margin: '0 auto' }}>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 style={{ fontSize: 38, fontWeight: 900, marginBottom: 8 }}>Your orders</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: 15, marginBottom: 40 }}>Track current orders and view your history.</p>
        </motion.div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '80px 0', color: 'var(--text-muted)' }}>Loading orders...</div>
        ) : orders.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '80px 0' }}>
            <div style={{ fontSize: 56, marginBottom: 16 }}>🍽️</div>
            <p style={{ color: 'var(--text-muted)', fontSize: 16, marginBottom: 24 }}>No orders yet. Time to eat royally.</p>
            <Link href="/discover" style={{ background: `linear-gradient(135deg,${PURPLE},${PINK})`, color: 'var(--text-primary)', padding: '14px 32px', borderRadius: 12, fontSize: 15, fontWeight: 700, textDecoration: 'none' }}>Browse restaurants</Link>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {orders.map((o, i) => (
              <motion.div key={o.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}>
                <Link href={`/order/${o.id}`} style={{ display: 'block', padding: '24px 28px', background: 'var(--bg-card)', borderRadius: 20, border: '1px solid var(--border)', textDecoration: 'none', color: 'var(--text-primary)' }}>
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
              </motion.div>
            ))}
          </div>
        )}
      </section>
      <Footer />
    </div>
  );
}
