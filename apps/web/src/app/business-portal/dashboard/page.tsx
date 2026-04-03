'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const PURPLE = '#5A31F4';
const PINK = '#FF0080';
const ORANGE = '#FF6B00';

const API_URL = process.env.NEXT_PUBLIC_VP_DOMAIN || 'https://veloci.online';

interface RecentOrder {
  id: string;
  date: string;
  restaurant: string;
  items: string;
  amount: string;
  status: string;
}

interface NextEvent {
  name: string;
  date: string;
  persons: number;
  location: string;
  budget: string;
}

interface DashboardData {
  account?: { companyName?: string };
  orderCount?: number;
  outstandingAmount?: number | string;
  budgetRemaining?: number | string;
  monthlyBudget?: number | string;
  teamCount?: number;
  recentOrders?: RecentOrder[];
  nextEvent?: NextEvent | null;
}

const statusColor = (s: string) => {
  switch (s.toLowerCase()) {
    case 'bezorgd': case 'delivered': case 'completed': return { bg: 'rgba(34,197,94,0.12)', color: '#22c55e' };
    case 'pending': case 'in behandeling': return { bg: 'rgba(234,179,8,0.12)', color: '#ca8a04' };
    case 'cancelled': case 'geannuleerd': return { bg: 'rgba(239,68,68,0.12)', color: '#ef4444' };
    default: return { bg: 'rgba(148,163,184,0.12)', color: '#94a3b8' };
  }
};

function Spinner() {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 200 }}>
      <div style={{
        width: 36, height: 36, borderRadius: '50%',
        border: `3px solid rgba(90,49,244,0.15)`,
        borderTopColor: PURPLE,
        animation: 'spin 0.7s linear infinite',
      }} />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

export default function BusinessDashboardPage() {
  const router = useRouter();
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('enjoy-business-token');
    if (!token) {
      router.replace('/business-portal');
      return;
    }

    fetch(`${API_URL}/api/business-portal/dashboard`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(async res => {
        if (res.status === 401) {
          localStorage.removeItem('enjoy-business-token');
          router.replace('/business-portal');
          return;
        }
        if (!res.ok) throw new Error('Fout bij ophalen dashboarddata');
        return res.json();
      })
      .then(json => {
        if (json) setData(json);
      })
      .catch(err => setError(err.message || 'Netwerkfout'))
      .finally(() => setLoading(false));
  }, [router]);

  const companyName =
    data?.account?.companyName ||
    (typeof window !== 'undefined' ? localStorage.getItem('enjoy-business-company') : null) ||
    'Jouw bedrijf';

  const orderCount = data?.orderCount ?? 0;
  const outstandingAmount = Number(data?.outstandingAmount ?? 0);
  const monthlyBudget = Number(data?.monthlyBudget ?? 0);
  const budgetRemaining = Number(data?.budgetRemaining ?? 0);
  const teamCount = data?.teamCount ?? 0;
  const recentOrders: RecentOrder[] = data?.recentOrders ?? [];
  const nextEvent = data?.nextEvent ?? null;

  const totalSpent = monthlyBudget - budgetRemaining;
  const budgetPct = monthlyBudget > 0 ? Math.min(Math.round((totalSpent / monthlyBudget) * 100), 100) : 0;

  const stats = [
    { label: 'Bestellingen deze maand', value: String(orderCount), icon: '🛍️', color: PURPLE },
    { label: 'Openstaand bedrag', value: `€${outstandingAmount.toLocaleString('nl-NL', { minimumFractionDigits: 2 })}`, icon: '📄', color: ORANGE },
    { label: 'Budget resterend', value: `€${budgetRemaining.toLocaleString('nl-NL', { minimumFractionDigits: 0 })}`, sub: monthlyBudget > 0 ? `van €${monthlyBudget.toLocaleString('nl-NL', { minimumFractionDigits: 0 })}` : undefined, icon: '💰', color: '#22c55e' },
    { label: 'Teamleden', value: String(teamCount), icon: '👥', color: PINK },
  ];

  if (loading) {
    return (
      <div style={{ padding: 'clamp(20px,3vw,40px)', maxWidth: 1100, margin: '0 auto' }}>
        <Spinner />
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: 'clamp(20px,3vw,40px)', maxWidth: 1100, margin: '0 auto' }}>
        <div style={{
          background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)',
          borderRadius: 16, padding: '20px 24px', color: '#ef4444', fontWeight: 600,
        }}>
          {error}
        </div>
      </div>
    );
  }

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
            {companyName}
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: 15, marginTop: 6 }}>
            {new Date().toLocaleDateString('nl-NL', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
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
      {monthlyBudget > 0 && (
        <div style={{
          background: 'var(--bg-card)', border: '1px solid var(--border)',
          borderRadius: 18, padding: '22px 24px', marginBottom: 28,
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
            <p style={{ fontWeight: 800, fontSize: 15, margin: 0 }}>
              Maandbudget {new Date().toLocaleDateString('nl-NL', { month: 'long', year: 'numeric' })}
            </p>
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
            <span style={{ color: ORANGE, fontSize: 13, fontWeight: 700 }}>
              €{totalSpent.toLocaleString('nl-NL', { minimumFractionDigits: 2 })} gebruikt
            </span>
            <span style={{ color: '#22c55e', fontSize: 13, fontWeight: 700 }}>
              €{budgetRemaining.toLocaleString('nl-NL', { minimumFractionDigits: 2 })} resterend
            </span>
          </div>
        </div>
      )}

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

          {recentOrders.length === 0 ? (
            <div style={{ padding: '40px 24px', textAlign: 'center', color: 'var(--text-muted)' }}>
              <p style={{ fontSize: 15, marginBottom: 8 }}>Nog geen bestellingen</p>
              <p style={{ fontSize: 13 }}>Bestellingen verschijnen hier zodra teamleden beginnen te bestellen.</p>
            </div>
          ) : (
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
                          background: statusColor(o.status).bg, color: statusColor(o.status).color,
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
          )}
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

          {nextEvent ? (
            <>
              <p style={{ fontWeight: 900, fontSize: 16, margin: '0 0 8px' }}>{nextEvent.name}</p>
              <p style={{ color: 'var(--text-secondary)', fontSize: 14, margin: '0 0 6px' }}>{nextEvent.date}</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4, marginBottom: 16 }}>
                <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>👥 {nextEvent.persons} personen</span>
                {nextEvent.location && (
                  <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>🍜 {nextEvent.location}</span>
                )}
                {nextEvent.budget && (
                  <span style={{ fontSize: 13, fontWeight: 700, color: ORANGE }}>{nextEvent.budget}</span>
                )}
              </div>
            </>
          ) : (
            <p style={{ color: 'var(--text-muted)', fontSize: 14, marginBottom: 16 }}>
              Geen aankomende evenementen gepland.
            </p>
          )}

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
