'use client';
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';

const PURPLE = '#5A31F4';
const PINK = '#FF0080';
const ORANGE = '#FF6B35';

const API_URL = process.env.NEXT_PUBLIC_VP_DOMAIN || 'https://www.veloci.online';

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
    case 'pending': case 'in behandeling': return { bg: `${ORANGE}15`, color: ORANGE };
    case 'cancelled': case 'geannuleerd': return { bg: 'rgba(239,68,68,0.12)', color: '#ef4444' };
    default: return { bg: 'rgba(148,163,184,0.12)', color: '#94a3b8' };
  }
};

function AnimatedNumber({ value, prefix = '', suffix = '' }: { value: number; prefix?: string; suffix?: string }) {
  const ref = useRef<HTMLParagraphElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const start = 0;
    const duration = 900;
    const startTime = performance.now();
    const tick = (now: number) => {
      const elapsed = Math.min((now - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - elapsed, 3);
      const current = start + (value - start) * eased;
      const formatted = Number.isInteger(value)
        ? String(Math.round(current))
        : current.toLocaleString('nl-NL', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
      el.textContent = `${prefix}${formatted}${suffix}`;
      if (elapsed < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [value, prefix, suffix]);

  return (
    <p ref={ref} style={{
      fontSize: 30, fontWeight: 950, margin: 0, letterSpacing: -0.5,
    }}>
      {prefix}{value}{suffix}
    </p>
  );
}

function DashboardSkeleton() {
  return (
    <div>
      <style>{`@keyframes shimmer { 0% { background-position: 200% 0; } 100% { background-position: -200% 0; } }`}</style>
      <div style={{ background: 'var(--bg-elevated)', borderRadius: 20, height: 120, marginBottom: 28, animation: 'shimmer 1.8s infinite', backgroundImage: 'linear-gradient(90deg, var(--bg-elevated) 25%, var(--border) 50%, var(--bg-elevated) 75%)', backgroundSize: '200% 100%' }} />
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))', gap: 16, marginBottom: 28 }}>
        {[0,1,2,3].map(i => (
          <div key={i} style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)', borderRadius: 18, height: 100, animation: 'shimmer 1.8s infinite', backgroundImage: 'linear-gradient(90deg, var(--bg-elevated) 25%, var(--border) 50%, var(--bg-elevated) 75%)', backgroundSize: '200% 100%' }} />
        ))}
      </div>
      <div style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)', borderRadius: 18, height: 280, animation: 'shimmer 1.8s infinite', backgroundImage: 'linear-gradient(90deg, var(--bg-elevated) 25%, var(--border) 50%, var(--bg-elevated) 75%)', backgroundSize: '200% 100%' }} />
    </div>
  );
}

const cardVariants = {
  hidden: { opacity: 0, y: 18 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.4, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] },
  }),
};

const QUICK_ACTIONS = [
  { label: 'Bestellingen', href: '/business-portal/orders', icon: '🛍️', color: PURPLE },
  { label: 'Budget', href: '/business-portal/budget', icon: '💰', color: '#22c55e' },
  { label: 'Team', href: '/business-portal/team', icon: '👥', color: PINK },
  { label: 'Instellingen', href: '/business-portal/settings', icon: '⚙️', color: ORANGE },
];

export default function BusinessDashboardPage() {
  const router = useRouter();
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [hoveredAction, setHoveredAction] = useState<string | null>(null);
  const [hoveredRow, setHoveredRow] = useState<string | null>(null);

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
    { label: 'Bestellingen deze maand', value: orderCount, prefix: '', suffix: '', icon: '🛍️', color: PURPLE },
    { label: 'Openstaand bedrag', value: outstandingAmount, prefix: '€', suffix: '', icon: '📄', color: ORANGE },
    { label: 'Budget resterend', value: budgetRemaining, prefix: '€', suffix: '', icon: '💰', color: '#22c55e', sub: monthlyBudget > 0 ? `van €${monthlyBudget.toLocaleString('nl-NL', { minimumFractionDigits: 0 })}` : undefined },
    { label: 'Teamleden', value: teamCount, prefix: '', suffix: '', icon: '👥', color: PINK },
  ];

  if (loading) {
    return (
      <div style={{ padding: 'clamp(20px,3vw,40px)', maxWidth: 1100, margin: '0 auto' }}>
        <DashboardSkeleton />
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
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      style={{ padding: 'clamp(20px,3vw,40px)', maxWidth: 1100, margin: '0 auto' }}
    >

      {/* Welcome banner */}
      <motion.div
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        style={{
          background: `linear-gradient(135deg,${PURPLE}20,${PINK}14)`,
          border: `1px solid ${PURPLE}28`,
          borderRadius: 24, padding: 'clamp(22px,3vw,36px)',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          flexWrap: 'wrap', gap: 16, marginBottom: 28,
          position: 'relative', overflow: 'hidden',
        }}
      >
        {/* Background orbs */}
        <div style={{ position: 'absolute', top: -40, right: -40, width: 180, height: 180, borderRadius: '50%', background: `radial-gradient(circle, ${PINK}18, transparent 70%)`, pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: -30, left: '30%', width: 120, height: 120, borderRadius: '50%', background: `radial-gradient(circle, ${PURPLE}14, transparent 70%)`, pointerEvents: 'none' }} />

        <div style={{ position: 'relative' }}>
          <p style={{ color: 'var(--text-muted)', fontSize: 13, marginBottom: 6, fontWeight: 600 }}>
            {new Date().toLocaleDateString('nl-NL', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
          </p>
          <h1 style={{ fontSize: 'clamp(22px,4vw,34px)', fontWeight: 950, letterSpacing: -1, margin: '0 0 6px', lineHeight: 1.1 }}>
            {companyName}
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: 14, margin: 0 }}>
            Welkom terug in het business portal.
          </p>
        </div>
        <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }} style={{ position: 'relative', flexShrink: 0 }}>
          <Link
            href="/discover"
            style={{
              display: 'block',
              background: `linear-gradient(135deg,${PURPLE},${PINK})`,
              color: 'white', borderRadius: 14, padding: '14px 24px',
              fontWeight: 800, fontSize: 15, boxShadow: `0 8px 24px ${PURPLE}45`,
              textDecoration: 'none', whiteSpace: 'nowrap',
            }}
          >
            + Snel bestellen
          </Link>
        </motion.div>
      </motion.div>

      {/* Quick action cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: 12, marginBottom: 28 }}>
        {QUICK_ACTIONS.map((action, i) => (
          <motion.a
            key={action.label}
            href={action.href}
            custom={i}
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            onHoverStart={() => setHoveredAction(action.label)}
            onHoverEnd={() => setHoveredAction(null)}
            whileHover={{ y: -4, boxShadow: `0 10px 28px ${action.color}22` }}
            whileTap={{ scale: 0.97 }}
            style={{
              display: 'flex', flexDirection: 'column', alignItems: 'center',
              gap: 10, padding: '18px 12px', borderRadius: 18, textDecoration: 'none',
              background: hoveredAction === action.label ? `${action.color}14` : 'var(--bg-card)',
              border: `1px solid ${hoveredAction === action.label ? action.color + '30' : 'var(--border)'}`,
              color: 'var(--text-primary)', fontWeight: 700, fontSize: 13,
              transition: 'background 0.2s, border-color 0.2s', cursor: 'pointer',
            }}
          >
            <span style={{
              fontSize: 24, width: 44, height: 44, borderRadius: 14,
              background: `${action.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center',
              border: `1px solid ${action.color}20`, transition: 'background 0.2s',
            }}>
              {action.icon}
            </span>
            <span style={{ color: hoveredAction === action.label ? action.color : 'var(--text-secondary)' }}>
              {action.label}
            </span>
          </motion.a>
        ))}
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))', gap: 16, marginBottom: 28 }}>
        {stats.map((s, i) => (
          <motion.div
            key={s.label}
            custom={i + 4}
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            whileHover={{ y: -4, boxShadow: `0 12px 36px ${s.color}20` }}
            style={{
              background: 'var(--bg-card)', border: '1px solid var(--border)',
              borderRadius: 18, padding: '22px 24px',
              position: 'relative', overflow: 'hidden', transition: 'border-color 0.2s',
            }}
          >
            <div style={{
              position: 'absolute', top: 0, right: 0, width: 90, height: 90,
              background: `radial-gradient(circle at top right, ${s.color}14, transparent 70%)`,
              pointerEvents: 'none',
            }} />
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
              <p style={{ color: 'var(--text-muted)', fontSize: 12, fontWeight: 700, margin: 0, textTransform: 'uppercase', letterSpacing: 0.5 }}>{s.label}</p>
              <span style={{
                fontSize: 22, width: 40, height: 40, borderRadius: 12,
                background: `${s.color}15`, display: 'flex', alignItems: 'center',
                justifyContent: 'center', border: `1px solid ${s.color}20`,
              }}>
                {s.icon}
              </span>
            </div>
            <div style={{ color: s.color }}>
              <AnimatedNumber value={s.value} prefix={s.prefix} suffix={s.suffix} />
            </div>
            {s.sub && <p style={{ color: 'var(--text-muted)', fontSize: 12, margin: '4px 0 0' }}>{s.sub}</p>}
          </motion.div>
        ))}
      </div>

      {/* Budget progress */}
      {monthlyBudget > 0 && (
        <motion.div
          custom={8}
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          style={{
            background: 'var(--bg-card)', border: '1px solid var(--border)',
            borderRadius: 18, padding: '22px 28px', marginBottom: 28,
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <p style={{ fontWeight: 800, fontSize: 15, margin: 0 }}>
              Maandbudget {new Date().toLocaleDateString('nl-NL', { month: 'long', year: 'numeric' })}
            </p>
            <span style={{
              fontSize: 14, fontWeight: 800,
              color: budgetPct > 80 ? ORANGE : PURPLE,
              background: budgetPct > 80 ? `${ORANGE}15` : `${PURPLE}15`,
              padding: '4px 12px', borderRadius: 20, border: `1px solid ${budgetPct > 80 ? ORANGE : PURPLE}25`,
            }}>
              {budgetPct}% gebruikt
            </span>
          </div>
          <div style={{ background: 'rgba(255,255,255,0.07)', borderRadius: 10, height: 12, overflow: 'hidden', marginBottom: 10 }}>
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${budgetPct}%` }}
              transition={{ duration: 1.2, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
              style={{
                height: '100%', borderRadius: 10,
                background: budgetPct > 80 ? `linear-gradient(90deg,${ORANGE},${PINK})` : `linear-gradient(90deg,${PURPLE},${PINK})`,
              }}
            />
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8 }}>
            <span style={{ color: ORANGE, fontSize: 13, fontWeight: 700 }}>
              €{totalSpent.toLocaleString('nl-NL', { minimumFractionDigits: 2 })} gebruikt
            </span>
            <span style={{ color: '#22c55e', fontSize: 13, fontWeight: 700 }}>
              €{budgetRemaining.toLocaleString('nl-NL', { minimumFractionDigits: 2 })} resterend
            </span>
          </div>
        </motion.div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: 20, alignItems: 'start' }} className="bp-dash-bottom">

        {/* Recent orders */}
        <motion.div
          custom={9}
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          style={{
            background: 'var(--bg-card)', border: '1px solid var(--border)',
            borderRadius: 18, overflow: 'hidden',
          }}
        >
          <div style={{ padding: '20px 24px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border)' }}>
            <h2 style={{ fontSize: 15, fontWeight: 800, margin: 0 }}>Recente bestellingen</h2>
            <Link href="/business-portal/orders" style={{ color: PURPLE, fontSize: 13, fontWeight: 700, textDecoration: 'none' }}>Alle bekijken →</Link>
          </div>

          {recentOrders.length === 0 ? (
            <div style={{ padding: '48px 24px', textAlign: 'center', color: 'var(--text-muted)' }}>
              <div style={{ fontSize: 40, marginBottom: 14 }}>📦</div>
              <p style={{ fontSize: 15, fontWeight: 700, marginBottom: 8 }}>Nog geen bestellingen</p>
              <p style={{ fontSize: 13 }}>Bestellingen verschijnen hier zodra teamleden beginnen te bestellen.</p>
            </div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--border)' }}>
                    {['#', 'Datum', 'Restaurant', 'Items', 'Bedrag', 'Status'].map(h => (
                      <th key={h} style={{ padding: '10px 16px', textAlign: 'left', color: 'var(--text-muted)', fontSize: 11, fontWeight: 700, whiteSpace: 'nowrap', textTransform: 'uppercase', letterSpacing: 0.5 }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {recentOrders.map((o, i) => {
                    const sc = statusColor(o.status);
                    const isHovered = hoveredRow === o.id;
                    return (
                      <tr
                        key={o.id}
                        onMouseEnter={() => setHoveredRow(o.id)}
                        onMouseLeave={() => setHoveredRow(null)}
                        style={{
                          borderBottom: i < recentOrders.length - 1 ? '1px solid var(--border)' : 'none',
                          background: isHovered ? 'rgba(255,255,255,0.025)' : 'transparent',
                          transition: 'background 0.15s',
                          cursor: 'default',
                        }}
                      >
                        <td style={{ padding: '14px 16px', color: PURPLE, fontWeight: 700, fontSize: 12 }}>{o.id}</td>
                        <td style={{ padding: '14px 16px', whiteSpace: 'nowrap', color: 'var(--text-secondary)', fontSize: 13 }}>{o.date}</td>
                        <td style={{ padding: '14px 16px', fontWeight: 600 }}>{o.restaurant}</td>
                        <td style={{ padding: '14px 16px', color: 'var(--text-secondary)' }}>{o.items}</td>
                        <td style={{ padding: '14px 16px', fontWeight: 700 }}>{o.amount}</td>
                        <td style={{ padding: '14px 16px' }}>
                          <span style={{
                            background: sc.bg, color: sc.color,
                            padding: '4px 10px', borderRadius: 20, fontSize: 11, fontWeight: 700,
                            display: 'inline-flex', alignItems: 'center', gap: 5, whiteSpace: 'nowrap',
                          }}>
                            <span style={{ width: 5, height: 5, borderRadius: '50%', background: sc.color, display: 'inline-block' }} />
                            {o.status}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </motion.div>

        {/* Upcoming event */}
        <motion.div
          custom={10}
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          style={{
            background: `linear-gradient(135deg,${PURPLE}16,${PINK}10)`,
            border: `1px solid ${PURPLE}25`,
            borderRadius: 18, padding: 24, minWidth: 248,
            position: 'relative', overflow: 'hidden',
          }}
        >
          <div style={{
            position: 'absolute', top: -20, right: -20, width: 100, height: 100,
            borderRadius: '50%', background: `radial-gradient(circle, ${PINK}20, transparent 70%)`,
            pointerEvents: 'none',
          }} />
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 18 }}>
            <span style={{
              fontSize: 18, width: 38, height: 38, borderRadius: 12,
              background: `${PURPLE}20`, display: 'flex', alignItems: 'center', justifyContent: 'center',
              border: `1px solid ${PURPLE}30`,
            }}>
              📅
            </span>
            <h3 style={{ fontSize: 13, fontWeight: 800, margin: 0, textTransform: 'uppercase', letterSpacing: 0.6, color: 'var(--text-muted)' }}>
              Aankomend evenement
            </h3>
          </div>

          {nextEvent ? (
            <>
              <p style={{ fontWeight: 900, fontSize: 16, margin: '0 0 8px', letterSpacing: -0.3 }}>{nextEvent.name}</p>
              <p style={{ color: 'var(--text-secondary)', fontSize: 14, margin: '0 0 12px' }}>{nextEvent.date}</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 18 }}>
                <span style={{ fontSize: 13, color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: 6 }}>👥 {nextEvent.persons} personen</span>
                {nextEvent.location && (
                  <span style={{ fontSize: 13, color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: 6 }}>🍜 {nextEvent.location}</span>
                )}
                {nextEvent.budget && (
                  <span style={{ fontSize: 13, fontWeight: 700, color: ORANGE, display: 'flex', alignItems: 'center', gap: 6 }}>💰 {nextEvent.budget}</span>
                )}
              </div>
            </>
          ) : (
            <p style={{ color: 'var(--text-muted)', fontSize: 14, marginBottom: 18, lineHeight: 1.6 }}>
              Geen aankomende evenementen gepland.
            </p>
          )}

          <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
            <Link
              href="/business-portal/events"
              style={{
                display: 'block', textAlign: 'center',
                background: `linear-gradient(135deg,${PURPLE},${PINK})`,
                color: 'white', borderRadius: 12, padding: '11px 0',
                fontWeight: 700, fontSize: 13, textDecoration: 'none',
                boxShadow: `0 4px 16px ${PURPLE}35`,
              }}
            >
              Alle evenementen
            </Link>
          </motion.div>
        </motion.div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .bp-dash-bottom { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </motion.div>
  );
}
