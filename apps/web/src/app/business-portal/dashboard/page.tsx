'use client';
import Link from 'next/link';

const PURPLE = '#5A31F4';
const PINK = '#FF0080';
const ORANGE = '#FF6B00';

const recentOrders = [
  { id: 'ORD-2631', date: '31 mrt', restaurant: 'Royal Kitchen', items: '12x lunch', amount: '€186,00', status: 'Bezorgd' },
  { id: 'ORD-2630', date: '30 mrt', restaurant: 'Sushi Master', items: '8x bento', amount: '€152,00', status: 'Bezorgd' },
  { id: 'ORD-2628', date: '28 mrt', restaurant: 'Pizza Napoli', items: '15x pizza', amount: '€225,00', status: 'Bezorgd' },
  { id: 'ORD-2627', date: '27 mrt', restaurant: 'Thai Garden', items: '10x curry', amount: '€145,00', status: 'Bezorgd' },
  { id: 'ORD-2625', date: '25 mrt', restaurant: 'Burger Bar', items: '20x burger', amount: '€240,00', status: 'Bezorgd' },
];

const stats = [
  { label: 'Bestellingen deze maand', value: '47', icon: '🛍️', color: PURPLE },
  { label: 'Openstaand bedrag', value: '€2.340', icon: '📄', color: ORANGE },
  { label: 'Budget resterend', value: '€7.660', sub: 'van €10.000', icon: '💰', color: '#22c55e' },
  { label: 'Teamleden', value: '23', icon: '👥', color: PINK },
];

export default function BusinessDashboardPage() {
  const budgetPct = Math.round((2340 / 10000) * 100);

  return (
    <div style={{ padding: 'clamp(20px,3vw,40px)', maxWidth: 1100, margin: '0 auto' }}>

      {/* Welcome banner */}
      <div style={{
        background: `linear-gradient(135deg,${PURPLE}22,${PINK}15)`,
        border: `1px solid ${PURPLE}30`,
        borderRadius: 20, padding: 'clamp(20px,3vw,32px)',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        flexWrap: 'wrap', gap: 16, marginBottom: 28,
      }}>
        <div>
          <p style={{ color: 'var(--text-muted)', fontSize: 14, marginBottom: 6 }}>Welkom terug</p>
          <h1 style={{ fontSize: 'clamp(22px,4vw,32px)', fontWeight: 950, letterSpacing: -0.5, margin: 0 }}>
            TechCorp BV
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: 15, marginTop: 6 }}>
            Dinsdag 1 april 2026 &nbsp;·&nbsp; Amsterdam
          </p>
        </div>
        <Link
          href="/discover"
          style={{
            background: `linear-gradient(135deg,${PURPLE},${PINK})`,
            color: 'white', borderRadius: 14, padding: '14px 24px',
            fontWeight: 800, fontSize: 15, boxShadow: `0 6px 20px ${PURPLE}40`,
            whiteSpace: 'nowrap',
          }}
        >
          + Snel bestellen
        </Link>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))', gap: 16, marginBottom: 28 }}>
        {stats.map(s => (
          <div key={s.label} style={{
            background: 'var(--bg-card)', border: '1px solid var(--border)',
            borderRadius: 18, padding: '22px 24px',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
              <p style={{ color: 'var(--text-muted)', fontSize: 13, fontWeight: 600, margin: 0 }}>{s.label}</p>
              <span style={{ fontSize: 22 }}>{s.icon}</span>
            </div>
            <p style={{ fontSize: 28, fontWeight: 950, margin: 0, color: s.color }}>{s.value}</p>
            {s.sub && <p style={{ color: 'var(--text-muted)', fontSize: 12, margin: '4px 0 0' }}>{s.sub}</p>}
          </div>
        ))}
      </div>

      {/* Budget progress */}
      <div style={{
        background: 'var(--bg-card)', border: '1px solid var(--border)',
        borderRadius: 18, padding: '22px 24px', marginBottom: 28,
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
          <p style={{ fontWeight: 800, fontSize: 15, margin: 0 }}>Maandbudget april 2026</p>
          <span style={{ color: 'var(--text-muted)', fontSize: 14 }}>{budgetPct}% gebruikt</span>
        </div>
        <div style={{ background: 'rgba(255,255,255,0.07)', borderRadius: 8, height: 10, overflow: 'hidden' }}>
          <div style={{
            width: `${budgetPct}%`, height: '100%', borderRadius: 8,
            background: `linear-gradient(90deg,${PURPLE},${PINK})`,
            transition: 'width 0.6s ease',
          }} />
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8 }}>
          <span style={{ color: ORANGE, fontSize: 13, fontWeight: 700 }}>€2.340 gebruikt</span>
          <span style={{ color: '#22c55e', fontSize: 13, fontWeight: 700 }}>€7.660 resterend</span>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: 20, alignItems: 'start' }} className="bp-dash-bottom">

        {/* Recent orders */}
        <div style={{
          background: 'var(--bg-card)', border: '1px solid var(--border)',
          borderRadius: 18, overflow: 'hidden',
        }}>
          <div style={{ padding: '20px 24px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border)' }}>
            <h2 style={{ fontSize: 16, fontWeight: 800, margin: 0 }}>Recente bestellingen</h2>
            <Link href="/business-portal/orders" style={{ color: PURPLE, fontSize: 13, fontWeight: 700 }}>Alle bekijken →</Link>
          </div>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border)' }}>
                  {['#', 'Datum', 'Restaurant', 'Items', 'Bedrag', 'Status'].map(h => (
                    <th key={h} style={{ padding: '10px 16px', textAlign: 'left', color: 'var(--text-muted)', fontSize: 12, fontWeight: 700, whiteSpace: 'nowrap' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((o, i) => (
                  <tr key={o.id} style={{ borderBottom: i < recentOrders.length - 1 ? '1px solid var(--border)' : 'none' }}>
                    <td style={{ padding: '14px 16px', color: 'var(--text-muted)', fontSize: 12 }}>{o.id}</td>
                    <td style={{ padding: '14px 16px', whiteSpace: 'nowrap' }}>{o.date}</td>
                    <td style={{ padding: '14px 16px', fontWeight: 600 }}>{o.restaurant}</td>
                    <td style={{ padding: '14px 16px', color: 'var(--text-secondary)' }}>{o.items}</td>
                    <td style={{ padding: '14px 16px', fontWeight: 700 }}>{o.amount}</td>
                    <td style={{ padding: '14px 16px' }}>
                      <span style={{
                        background: 'rgba(34,197,94,0.12)', color: '#22c55e',
                        padding: '4px 10px', borderRadius: 20, fontSize: 12, fontWeight: 700,
                      }}>
                        {o.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Upcoming event */}
        <div style={{
          background: `linear-gradient(135deg,${PURPLE}18,${PINK}10)`,
          border: `1px solid ${PURPLE}25`,
          borderRadius: 18, padding: 24, minWidth: 240,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
            <span style={{ fontSize: 22 }}>📅</span>
            <h3 style={{ fontSize: 14, fontWeight: 800, margin: 0 }}>Aankomend evenement</h3>
          </div>
          <p style={{ fontWeight: 900, fontSize: 16, margin: '0 0 8px' }}>Teamlunch vrijdag</p>
          <p style={{ color: 'var(--text-secondary)', fontSize: 14, margin: '0 0 6px' }}>4 april 2026</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4, marginBottom: 16 }}>
            <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>👥 25 personen</span>
            <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>🍜 Thai Garden</span>
            <span style={{ fontSize: 13, fontWeight: 700, color: ORANGE }}>€375,00</span>
          </div>
          <Link
            href="/business-portal/events"
            style={{
              display: 'block', textAlign: 'center',
              background: `linear-gradient(135deg,${PURPLE},${PINK})`,
              color: 'white', borderRadius: 10, padding: '10px 0',
              fontWeight: 700, fontSize: 13,
            }}
          >
            Alle evenementen
          </Link>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .bp-dash-bottom { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}
