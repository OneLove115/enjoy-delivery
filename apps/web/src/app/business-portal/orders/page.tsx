'use client';
import { useState } from 'react';

const PURPLE = '#5A31F4';
const PINK = '#FF0080';
const ORANGE = '#FF6B00';

const ALL_ORDERS = [
  { id: 'ORD-2631', date: '31 mrt 2026', restaurant: 'Royal Kitchen', items: '12x lunch', amount: 186, orderedBy: 'Jan de Vries', status: 'Bezorgd' },
  { id: 'ORD-2630', date: '30 mrt 2026', restaurant: 'Sushi Master', items: '8x bento', amount: 152, orderedBy: 'Lisa Bakker', status: 'Bezorgd' },
  { id: 'ORD-2628', date: '28 mrt 2026', restaurant: 'Pizza Napoli', items: '15x pizza', amount: 225, orderedBy: 'Ahmed Hassan', status: 'Bezorgd' },
  { id: 'ORD-2627', date: '27 mrt 2026', restaurant: 'Thai Garden', items: '10x curry', amount: 145, orderedBy: 'Sophie Mulder', status: 'Bezorgd' },
  { id: 'ORD-2625', date: '25 mrt 2026', restaurant: 'Burger Bar', items: '20x burger', amount: 240, orderedBy: 'Tim van den Berg', status: 'Bezorgd' },
  { id: 'ORD-2621', date: '21 mrt 2026', restaurant: 'Royal Kitchen', items: '8x lunch', amount: 124, orderedBy: 'Jan de Vries', status: 'Bezorgd' },
  { id: 'ORD-2618', date: '18 mrt 2026', restaurant: 'Sushi Master', items: '10x sushi', amount: 190, orderedBy: 'Lisa Bakker', status: 'Bezorgd' },
  { id: 'ORD-2614', date: '14 mrt 2026', restaurant: 'De Kas', items: '6x diner', amount: 318, orderedBy: 'Sophie Mulder', status: 'Bezorgd' },
  { id: 'ORD-2610', date: '10 mrt 2026', restaurant: 'Burger Bar', items: '15x burger', amount: 180, orderedBy: 'Ahmed Hassan', status: 'Bezorgd' },
  { id: 'ORD-2607', date: '7 mrt 2026', restaurant: 'Pizza Napoli', items: '12x pizza', amount: 180, orderedBy: 'Tim van den Berg', status: 'Bezorgd' },
  { id: 'ORD-2604', date: '4 mrt 2026', restaurant: 'Thai Garden', items: '8x curry', amount: 116, orderedBy: 'Jan de Vries', status: 'Bezorgd' },
  { id: 'ORD-2601', date: '1 mrt 2026', restaurant: 'Royal Kitchen', items: '20x lunch', amount: 310, orderedBy: 'Lisa Bakker', status: 'Bezorgd' },
  { id: 'ORD-2542', date: '28 feb 2026', restaurant: 'Sushi Master', items: '6x bento', amount: 114, orderedBy: 'Ahmed Hassan', status: 'Bezorgd' },
  { id: 'ORD-2538', date: '21 feb 2026', restaurant: 'Burger Bar', items: '18x burger', amount: 216, orderedBy: 'Sophie Mulder', status: 'Bezorgd' },
  { id: 'ORD-2530', date: '14 feb 2026', restaurant: 'De Kas', items: '8x diner', amount: 424, orderedBy: 'Tim van den Berg', status: 'Bezorgd' },
];

const STATUS_COLORS: Record<string, { bg: string; color: string }> = {
  Bezorgd:    { bg: 'rgba(34,197,94,0.12)',   color: '#22c55e' },
  Onderweg:   { bg: 'rgba(255,107,0,0.12)',    color: ORANGE },
  Geannuleerd: { bg: 'rgba(239,68,68,0.12)',   color: '#ef4444' },
  In_behandeling: { bg: `rgba(90,49,244,0.12)`, color: PURPLE },
};

const MONTHS = ['Alle maanden', 'maart 2026', 'februari 2026'];

export default function OrdersPage() {
  const [monthFilter, setMonthFilter] = useState('Alle maanden');
  const [statusFilter, setStatusFilter] = useState('Alle statussen');
  const [reordered, setReordered] = useState<string | null>(null);

  const filtered = ALL_ORDERS.filter(o => {
    if (monthFilter !== 'Alle maanden' && !o.date.includes(monthFilter.split(' ')[0])) return false;
    if (statusFilter !== 'Alle statussen' && o.status !== statusFilter) return false;
    return true;
  });

  const total = filtered.reduce((s, o) => s + o.amount, 0);

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
          {MONTHS.map(m => <option key={m}>{m}</option>)}
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
                    <td style={{ padding: '14px 16px', fontWeight: 700 }}>€{o.amount.toLocaleString('nl-NL', { minimumFractionDigits: 2 })}</td>
                    <td style={{ padding: '14px 16px', color: 'var(--text-secondary)' }}>{o.orderedBy}</td>
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
      </div>
    </div>
  );
}
