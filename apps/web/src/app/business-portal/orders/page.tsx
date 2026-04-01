'use client';
import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';

const PURPLE = '#5A31F4';
const PINK = '#FF0080';
const ORANGE = '#FF6B00';

const API_URL = process.env.NEXT_PUBLIC_VP_DOMAIN || 'https://veloci.online';

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
  Bezorgd:         { bg: 'rgba(34,197,94,0.12)',    color: '#22c55e' },
  Onderweg:        { bg: 'rgba(255,107,0,0.12)',     color: ORANGE },
  Geannuleerd:     { bg: 'rgba(239,68,68,0.12)',     color: '#ef4444' },
  In_behandeling:  { bg: `rgba(90,49,244,0.12)`,    color: PURPLE },
};

function Spinner() {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '60px 0' }}>
      <div style={{
        width: 32, height: 32, borderRadius: '50%',
        border: `3px solid rgba(90,49,244,0.15)`,
        borderTopColor: PURPLE,
        animation: 'spin 0.7s linear infinite',
      }} />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
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

  // Build month list dynamically from fetched data
  const months = useMemo(() => {
    const seen = new Set<string>();
    orders.forEach(o => {
      // Try to extract "maand jaar" from date string
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
    borderRadius: 10, padding: '10px 14px', color: 'var(--text-primary)',
    fontSize: 14, fontFamily: 'Outfit, sans-serif', cursor: 'pointer',
  };

  return (
    <div style={{ padding: 'clamp(20px,3vw,40px)' }}>

      {/* Header */}
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: 'clamp(22px,4vw,30px)', fontWeight: 950, letterSpacing: -0.5, margin: '0 0 6px' }}>
          Bestellingen
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: 14, margin: 0 }}>
          Overzicht van alle zakelijke bestellingen
        </p>
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 24, flexWrap: 'wrap' }}>
        <select value={monthFilter} onChange={e => setMonthFilter(e.target.value)} style={selectStyle}>
          {months.map(m => <option key={m}>{m}</option>)}
        </select>
        <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} style={selectStyle}>
          {['Alle statussen', 'Bezorgd', 'Onderweg', 'Geannuleerd'].map(s => <option key={s}>{s}</option>)}
        </select>
      </div>

      {/* Table */}
      <div style={{
        background: 'var(--bg-card)', border: '1px solid var(--border)',
        borderRadius: 18, overflow: 'hidden',
      }}>
        {loading ? (
          <Spinner />
        ) : error ? (
          <div style={{ padding: '24px', color: '#ef4444', fontWeight: 600 }}>{error}</div>
        ) : filtered.length === 0 ? (
          <div style={{ padding: '48px 24px', textAlign: 'center', color: 'var(--text-muted)' }}>
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
                  <tr style={{ borderBottom: '1px solid var(--border)' }}>
                    {['Bestelnr', 'Datum', 'Restaurant', 'Items', 'Bedrag', 'Besteld door', 'Status', ''].map(h => (
                      <th key={h} style={{ padding: '14px 16px', textAlign: 'left', color: 'var(--text-muted)', fontSize: 12, fontWeight: 700, whiteSpace: 'nowrap' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((o, i) => {
                    const sc = STATUS_COLORS[o.status] || STATUS_COLORS.Bezorgd;
                    return (
                      <tr key={o.id} style={{ borderBottom: i < filtered.length - 1 ? '1px solid var(--border)' : 'none' }}>
                        <td style={{ padding: '14px 16px', color: PURPLE, fontWeight: 700, fontSize: 13 }}>{o.id}</td>
                        <td style={{ padding: '14px 16px', color: 'var(--text-secondary)', whiteSpace: 'nowrap' }}>{o.date}</td>
                        <td style={{ padding: '14px 16px', fontWeight: 600 }}>{o.restaurant}</td>
                        <td style={{ padding: '14px 16px', color: 'var(--text-secondary)' }}>{o.items}</td>
                        <td style={{ padding: '14px 16px', fontWeight: 700 }}>
                          €{Number(o.amount).toLocaleString('nl-NL', { minimumFractionDigits: 2 })}
                        </td>
                        <td style={{ padding: '14px 16px', color: 'var(--text-secondary)' }}>{o.orderedBy ?? '—'}</td>
                        <td style={{ padding: '14px 16px' }}>
                          <span style={{ background: sc.bg, color: sc.color, padding: '4px 10px', borderRadius: 20, fontSize: 12, fontWeight: 700 }}>
                            {o.status}
                          </span>
                        </td>
                        <td style={{ padding: '14px 16px' }}>
                          <button
                            onClick={() => setReordered(o.id)}
                            style={{
                              background: reordered === o.id ? 'rgba(34,197,94,0.12)' : `rgba(90,49,244,0.12)`,
                              color: reordered === o.id ? '#22c55e' : PURPLE,
                              border: 'none', borderRadius: 8, padding: '6px 12px',
                              cursor: 'pointer', fontSize: 12, fontWeight: 700,
                              fontFamily: 'Outfit, sans-serif', whiteSpace: 'nowrap',
                            }}
                          >
                            {reordered === o.id ? '✓ Geplaatst' : 'Herbestellen'}
                          </button>
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
              background: 'rgba(255,255,255,0.02)',
            }}>
              <span style={{ color: 'var(--text-muted)', fontSize: 14 }}>
                {filtered.length} bestelling{filtered.length !== 1 ? 'en' : ''} weergegeven
              </span>
              <span style={{ fontWeight: 900, fontSize: 16 }}>
                Totaal: <span style={{ color: ORANGE }}>€{total.toLocaleString('nl-NL', { minimumFractionDigits: 2 })}</span>
              </span>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
