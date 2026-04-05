'use client';
import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';

const PURPLE = '#5A31F4';
const PINK = '#FF0080';
const ORANGE = '#FF6B35';

const API_URL = process.env.NEXT_PUBLIC_VP_DOMAIN || 'https://www.veloci.online';

interface Order {
  id: string;
  date: string;
  restaurant: string;
  items: string;
  amount: number;
  orderedBy?: string;
  status: string;
}

const STATUS_COLORS: Record<string, { bg: string; color: string }> = {
  Bezorgd:        { bg: 'rgba(34,197,94,0.12)',    color: '#22c55e' },
  Onderweg:       { bg: `${ORANGE}15`,             color: ORANGE },
  Geannuleerd:    { bg: 'rgba(239,68,68,0.12)',     color: '#ef4444' },
  In_behandeling: { bg: `${PURPLE}12`,             color: PURPLE },
};

function TableSkeleton() {
  return (
    <div style={{ padding: 0 }}>
      <style>{`@keyframes shimmer { 0% { background-position: 200% 0; } 100% { background-position: -200% 0; } }`}</style>
      {/* Header row skeleton */}
      <div style={{ padding: '14px 20px', borderBottom: '1px solid var(--border)', display: 'flex', gap: 24 }}>
        {[60, 80, 110, 80, 60, 90, 55].map((w, j) => (
          <div key={j} style={{ height: 10, width: w, borderRadius: 6, animation: 'shimmer 1.8s infinite', backgroundImage: 'linear-gradient(90deg, var(--bg-elevated) 25%, var(--border) 50%, var(--bg-elevated) 75%)', backgroundSize: '200% 100%' }} />
        ))}
      </div>
      {[0,1,2,3,4].map(i => (
        <div key={i} style={{ padding: '18px 20px', borderBottom: '1px solid var(--border)', display: 'flex', gap: 24, alignItems: 'center' }}>
          <div style={{ width: 8, height: 8, borderRadius: '50%', flexShrink: 0, animation: 'shimmer 1.8s infinite', backgroundImage: 'linear-gradient(90deg, var(--bg-elevated) 25%, var(--border) 50%, var(--bg-elevated) 75%)', backgroundSize: '200% 100%' }} />
          {[50, 80, 110, 80, 55, 70, 60].map((w, j) => (
            <div key={j} style={{ height: 13, width: w, borderRadius: 6, animation: 'shimmer 1.8s infinite', backgroundImage: 'linear-gradient(90deg, var(--bg-elevated) 25%, var(--border) 50%, var(--bg-elevated) 75%)', backgroundSize: '200% 100%' }} />
          ))}
        </div>
      ))}
    </div>
  );
}

export default function OrdersPage() {
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [monthFilter, setMonthFilter] = useState('Alle maanden');
  const [statusFilter, setStatusFilter] = useState('Alle statussen');
  const [reordered, setReordered] = useState<string | null>(null);
  const [hoveredRow, setHoveredRow] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('enjoy-business-token');
    if (!token) {
      router.replace('/business-portal');
      return;
    }

    fetch(`${API_URL}/api/business-portal/orders`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(async res => {
        if (res.status === 401) {
          localStorage.removeItem('enjoy-business-token');
          router.replace('/business-portal');
          return;
        }
        if (!res.ok) throw new Error('Fout bij ophalen bestellingen');
        return res.json();
      })
      .then(json => {
        if (json) setOrders(json.orders ?? []);
      })
      .catch(err => setError(err.message || 'Netwerkfout'))
      .finally(() => setLoading(false));
  }, [router]);

  const months = useMemo(() => {
    const seen = new Set<string>();
    orders.forEach(o => {
      const parts = o.date?.split(' ');
      if (parts && parts.length >= 2) {
        seen.add(`${parts[1]} ${parts[2] ?? ''}`.trim());
      }
    });
    return ['Alle maanden', ...Array.from(seen)];
  }, [orders]);

  const filtered = useMemo(() => orders.filter(o => {
    if (monthFilter !== 'Alle maanden') {
      const monthPart = monthFilter.split(' ')[0];
      if (!o.date?.includes(monthPart)) return false;
    }
    if (statusFilter !== 'Alle statussen' && o.status !== statusFilter) return false;
    return true;
  }), [orders, monthFilter, statusFilter]);

  const total = filtered.reduce((s, o) => s + (Number(o.amount) || 0), 0);

  const selectStyle: React.CSSProperties = {
    background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: 12, padding: '10px 16px', color: 'var(--text-primary)',
    fontSize: 14, fontFamily: 'Outfit, sans-serif', cursor: 'pointer',
    outline: 'none',
  };

  const STATUS_OPTIONS = ['Alle statussen', 'Bezorgd', 'Onderweg', 'Geannuleerd', 'In_behandeling'];

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      style={{ padding: 'clamp(20px,3vw,40px)' }}
    >

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        style={{ marginBottom: 28 }}
      >
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 8, fontSize: 12, fontWeight: 700,
          color: PURPLE, background: `${PURPLE}15`, padding: '4px 12px', borderRadius: 20,
          marginBottom: 12, border: `1px solid ${PURPLE}25`,
        }}>
          🛍️ Bestellingen
        </div>
        <h1 style={{ fontSize: 'clamp(22px,4vw,30px)', fontWeight: 950, letterSpacing: -1, margin: '0 0 6px' }}>
          Bestellingen
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: 14, margin: 0 }}>
          Overzicht van alle zakelijke bestellingen
        </p>
      </motion.div>

      {/* Summary stat */}
      {!loading && !error && orders.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.06, duration: 0.4 }}
          style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 12, marginBottom: 20 }}
        >
          {[
            { label: 'Totaal bestellingen', value: String(orders.length), color: PURPLE, icon: '📦' },
            { label: 'Bezorgd', value: String(orders.filter(o => o.status === 'Bezorgd').length), color: '#22c55e', icon: '✅' },
            { label: 'Onderweg', value: String(orders.filter(o => o.status === 'Onderweg').length), color: ORANGE, icon: '🚴' },
            { label: 'Totale waarde', value: `€${orders.reduce((s,o) => s+Number(o.amount),0).toLocaleString('nl-NL',{minimumFractionDigits:2})}`, color: PINK, icon: '💶' },
          ].map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.08 + i * 0.06 }}
              whileHover={{ y: -3, boxShadow: `0 8px 24px ${s.color}18` }}
              style={{
                background: 'var(--bg-card)', border: '1px solid var(--border)',
                borderRadius: 14, padding: '14px 18px',
                position: 'relative', overflow: 'hidden',
              }}
            >
              <div style={{ position: 'absolute', top: 0, right: 0, width: 56, height: 56, background: `radial-gradient(circle at top right, ${s.color}14, transparent 70%)` }} />
              <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 6 }}>
                <span style={{ fontSize: 18 }}>{s.icon}</span>
                <p style={{ fontSize: 10, color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.6, margin: 0 }}>{s.label}</p>
              </div>
              <p style={{ fontSize: 22, fontWeight: 950, margin: 0, color: s.color, letterSpacing: -0.5 }}>{s.value}</p>
            </motion.div>
          ))}
        </motion.div>
      )}

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.35 }}
        style={{ display: 'flex', gap: 12, marginBottom: 20, flexWrap: 'wrap', alignItems: 'center' }}
      >
        <select value={monthFilter} onChange={e => setMonthFilter(e.target.value)} style={selectStyle}>
          {months.map(m => <option key={m}>{m}</option>)}
        </select>
        <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} style={selectStyle}>
          {STATUS_OPTIONS.map(s => <option key={s}>{s}</option>)}
        </select>
        {(monthFilter !== 'Alle maanden' || statusFilter !== 'Alle statussen') && (
          <motion.button
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            onClick={() => { setMonthFilter('Alle maanden'); setStatusFilter('Alle statussen'); }}
            style={{
              background: 'transparent', border: '1px solid rgba(255,255,255,0.12)',
              color: 'var(--text-muted)', borderRadius: 12, padding: '10px 14px',
              cursor: 'pointer', fontSize: 13, fontFamily: 'Outfit, sans-serif',
            }}
          >
            ✕ Filters wissen
          </motion.button>
        )}
      </motion.div>

      {/* Table */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.14, duration: 0.4 }}
        style={{
          background: 'var(--bg-card)', border: '1px solid var(--border)',
          borderRadius: 18, overflow: 'hidden',
        }}
      >
        {loading ? (
          <TableSkeleton />
        ) : error ? (
          <div style={{ padding: '24px', color: '#ef4444', fontWeight: 600 }}>{error}</div>
        ) : filtered.length === 0 ? (
          <div style={{ padding: '56px 24px', textAlign: 'center', color: 'var(--text-muted)' }}>
            <div style={{ fontSize: 48, marginBottom: 14 }}>📭</div>
            <p style={{ fontSize: 16, fontWeight: 700, marginBottom: 8 }}>Geen bestellingen gevonden</p>
            <p style={{ fontSize: 14 }}>
              {orders.length === 0
                ? 'Er zijn nog geen bestellingen geplaatst via jouw account.'
                : 'Geen bestellingen die overeenkomen met je filters.'}
            </p>
          </div>
        ) : (
          <>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--border)', background: 'rgba(255,255,255,0.02)' }}>
                    {['Bestelnr', 'Datum', 'Restaurant', 'Items', 'Bedrag', 'Besteld door', 'Status', ''].map(h => (
                      <th key={h} style={{ padding: '12px 16px', textAlign: 'left', color: 'var(--text-muted)', fontSize: 11, fontWeight: 700, whiteSpace: 'nowrap', textTransform: 'uppercase', letterSpacing: 0.5 }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((o, i) => {
                    const sc = STATUS_COLORS[o.status] ?? STATUS_COLORS.Bezorgd;
                    const isHovered = hoveredRow === o.id;
                    return (
                      <tr
                        key={o.id}
                        onMouseEnter={() => setHoveredRow(o.id)}
                        onMouseLeave={() => setHoveredRow(null)}
                        style={{
                          borderBottom: i < filtered.length - 1 ? '1px solid var(--border)' : 'none',
                          background: isHovered ? 'rgba(255,255,255,0.025)' : 'transparent',
                          transition: 'background 0.15s',
                        }}
                      >
                        <td style={{ padding: '15px 16px', color: PURPLE, fontWeight: 800, fontSize: 12 }}>{o.id}</td>
                        <td style={{ padding: '15px 16px', color: 'var(--text-secondary)', whiteSpace: 'nowrap', fontSize: 13 }}>{o.date}</td>
                        <td style={{ padding: '15px 16px', fontWeight: 600 }}>{o.restaurant}</td>
                        <td style={{ padding: '15px 16px', color: 'var(--text-secondary)' }}>{o.items}</td>
                        <td style={{ padding: '15px 16px', fontWeight: 700 }}>
                          €{Number(o.amount).toLocaleString('nl-NL', { minimumFractionDigits: 2 })}
                        </td>
                        <td style={{ padding: '15px 16px', color: 'var(--text-secondary)', fontSize: 13 }}>{o.orderedBy ?? '—'}</td>
                        <td style={{ padding: '15px 16px' }}>
                          <span style={{
                            background: sc.bg, color: sc.color,
                            padding: '5px 11px', borderRadius: 20, fontSize: 11, fontWeight: 700,
                            display: 'inline-flex', alignItems: 'center', gap: 5, whiteSpace: 'nowrap',
                          }}>
                            <span style={{ width: 5, height: 5, borderRadius: '50%', background: sc.color, display: 'inline-block' }} />
                            {o.status}
                          </span>
                        </td>
                        <td style={{ padding: '15px 16px' }}>
                          <motion.button
                            onClick={() => setReordered(o.id)}
                            whileHover={{ scale: 1.06 }}
                            whileTap={{ scale: 0.96 }}
                            style={{
                              background: reordered === o.id ? 'rgba(34,197,94,0.12)' : `${PURPLE}12`,
                              color: reordered === o.id ? '#22c55e' : PURPLE,
                              border: `1px solid ${reordered === o.id ? 'rgba(34,197,94,0.25)' : PURPLE + '25'}`,
                              borderRadius: 10, padding: '6px 12px',
                              cursor: 'pointer', fontSize: 12, fontWeight: 700,
                              fontFamily: 'Outfit, sans-serif', whiteSpace: 'nowrap',
                              transition: 'all 0.2s',
                            }}
                          >
                            {reordered === o.id ? '✓ Geplaatst' : 'Herbestellen'}
                          </motion.button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Total */}
            <div style={{
              padding: '16px 24px', borderTop: '1px solid var(--border)',
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              background: 'rgba(255,255,255,0.015)',
            }}>
              <span style={{ color: 'var(--text-muted)', fontSize: 14, fontWeight: 600 }}>
                {filtered.length} bestelling{filtered.length !== 1 ? 'en' : ''} weergegeven
              </span>
              <span style={{ fontWeight: 900, fontSize: 15 }}>
                Totaal:{' '}
                <span style={{
                  background: `linear-gradient(135deg,${ORANGE},${PINK})`,
                  WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                }}>
                  €{total.toLocaleString('nl-NL', { minimumFractionDigits: 2 })}
                </span>
              </span>
            </div>
          </>
        )}
      </motion.div>
    </motion.div>
  );
}
