'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';

const PURPLE = '#5A31F4';
const PINK = '#FF0080';
const ORANGE = '#FF6B35';

const API_URL = process.env.NEXT_PUBLIC_VP_DOMAIN || 'https://www.veloci.online';

interface BudgetMember {
  name: string;
  dept?: string;
  department?: string;
  budget: number;
  monthlyBudget?: number;
  used?: number;
  spent?: number;
}

interface BudgetData {
  monthlyBudget?: number;
  totalSpent?: number;
  remaining?: number;
  members?: BudgetMember[];
}

function BudgetSkeleton() {
  return (
    <div>
      <style>{`@keyframes shimmer { 0% { background-position: 200% 0; } 100% { background-position: -200% 0; } }`}</style>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(180px,1fr))', gap: 16, marginBottom: 28 }}>
        {[0,1,2,3].map(i => (
          <div key={i} style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)', borderRadius: 18, height: 96, animation: 'shimmer 1.8s infinite', backgroundImage: 'linear-gradient(90deg, var(--bg-elevated) 25%, var(--border) 50%, var(--bg-elevated) 75%)', backgroundSize: '200% 100%' }} />
        ))}
      </div>
      <div style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)', borderRadius: 18, height: 130, animation: 'shimmer 1.8s infinite', backgroundImage: 'linear-gradient(90deg, var(--bg-elevated) 25%, var(--border) 50%, var(--bg-elevated) 75%)', backgroundSize: '200% 100%' }} />
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

export default function BudgetPage() {
  const router = useRouter();
  const [data, setData] = useState<BudgetData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showAdjust, setShowAdjust] = useState(false);
  const [newBudget, setNewBudget] = useState('');
  const [focusedInput, setFocusedInput] = useState(false);
  const [hoveredMember, setHoveredMember] = useState<number | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('enjoy-business-token');
    if (!token) {
      router.replace('/business-portal');
      return;
    }

    fetch(`${API_URL}/api/business-portal/budget`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(async res => {
        if (res.status === 401) {
          localStorage.removeItem('enjoy-business-token');
          router.replace('/business-portal');
          return;
        }
        if (!res.ok) throw new Error('Fout bij ophalen budgetdata');
        return res.json();
      })
      .then(json => {
        if (json) {
          setData(json);
          setNewBudget(String(json.monthlyBudget ?? ''));
        }
      })
      .catch(err => setError(err.message || 'Netwerkfout'))
      .finally(() => setLoading(false));
  }, [router]);

  const monthlyBudget = Number(data?.monthlyBudget ?? 0);
  const totalSpent = Number(data?.totalSpent ?? 0);
  const remaining = Number(data?.remaining ?? 0);
  const members: BudgetMember[] = data?.members ?? [];

  const budgetPct = monthlyBudget > 0 ? Math.min(Math.round((totalSpent / monthlyBudget) * 100), 100) : 0;

  const companyName =
    typeof window !== 'undefined' ? localStorage.getItem('enjoy-business-company') ?? 'Jouw bedrijf' : 'Jouw bedrijf';

  const summaryCards = [
    { label: 'Totaal budget', value: `€${monthlyBudget.toLocaleString('nl-NL')}`, color: 'var(--text-primary)', icon: '💼', raw: monthlyBudget },
    { label: 'Gebruikt',      value: `€${totalSpent.toLocaleString('nl-NL')}`,    color: ORANGE,              icon: '📊', raw: totalSpent },
    { label: 'Resterend',     value: `€${remaining.toLocaleString('nl-NL')}`,     color: '#22c55e',           icon: '💰', raw: remaining },
    { label: 'Medewerkers',   value: String(members.length),                       color: PURPLE,              icon: '👥', raw: members.length },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      style={{ padding: 'clamp(20px,3vw,40px)', maxWidth: 1000, margin: '0 auto' }}
    >

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 28, flexWrap: 'wrap', gap: 12 }}
      >
        <div>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 8, fontSize: 12, fontWeight: 700,
            color: '#22c55e', background: 'rgba(34,197,94,0.12)', padding: '4px 12px', borderRadius: 20,
            marginBottom: 12, border: '1px solid rgba(34,197,94,0.25)',
          }}>
            💰 Budget
          </div>
          <h1 style={{ fontSize: 'clamp(22px,4vw,30px)', fontWeight: 950, letterSpacing: -1, margin: '0 0 6px' }}>
            Budget
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: 14, margin: 0 }}>
            Maandbudget {new Date().toLocaleDateString('nl-NL', { month: 'long', year: 'numeric' })} — {companyName}
          </p>
        </div>
        <motion.button
          onClick={() => setShowAdjust(!showAdjust)}
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.97 }}
          style={{
            background: showAdjust ? 'rgba(255,255,255,0.06)' : `linear-gradient(135deg,${PURPLE},${PINK})`,
            color: showAdjust ? 'var(--text-secondary)' : 'white',
            border: showAdjust ? '1px solid var(--border)' : 'none',
            borderRadius: 12, padding: '12px 20px', cursor: 'pointer',
            fontSize: 14, fontWeight: 700, fontFamily: 'Outfit, sans-serif',
            boxShadow: showAdjust ? 'none' : `0 4px 16px ${PURPLE}35`,
            transition: 'all 0.2s',
          }}
        >
          {showAdjust ? '✕ Sluiten' : 'Budget aanpassen'}
        </motion.button>
      </motion.div>

      {/* Adjust budget panel */}
      {showAdjust && (
        <motion.div
          initial={{ opacity: 0, y: -8, height: 0 }}
          animate={{ opacity: 1, y: 0, height: 'auto' }}
          exit={{ opacity: 0, y: -8, height: 0 }}
          style={{
            background: `${PURPLE}08`, border: `1px solid ${PURPLE}28`,
            borderRadius: 16, padding: '20px 24px', marginBottom: 24,
            display: 'flex', gap: 12, alignItems: 'flex-end', flexWrap: 'wrap',
          }}
        >
          <div style={{ flex: 1, minWidth: 200 }}>
            <label style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-muted)', display: 'block', marginBottom: 6, textTransform: 'uppercase', letterSpacing: 0.5 }}>
              Nieuw maandbudget (€)
            </label>
            <input
              type="number"
              value={newBudget}
              onChange={e => setNewBudget(e.target.value)}
              onFocus={() => setFocusedInput(true)}
              onBlur={() => setFocusedInput(false)}
              style={{
                width: '100%', background: 'rgba(255,255,255,0.06)',
                border: `1px solid ${focusedInput ? PURPLE + '60' : 'rgba(255,255,255,0.12)'}`,
                borderRadius: 12, padding: '12px 16px', color: 'var(--text-primary)',
                fontSize: 15, fontFamily: 'Outfit, sans-serif', outline: 'none',
                boxSizing: 'border-box',
                boxShadow: focusedInput ? `0 0 0 3px ${PURPLE}20` : 'none',
                transition: 'border-color 0.15s, box-shadow 0.15s',
              }}
            />
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <motion.button
              onClick={() => setShowAdjust(false)}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              style={{
                background: `linear-gradient(135deg,${PURPLE},${PINK})`,
                color: 'white', border: 'none', borderRadius: 12,
                padding: '12px 22px', cursor: 'pointer',
                fontSize: 14, fontWeight: 700, fontFamily: 'Outfit, sans-serif',
                boxShadow: `0 4px 14px ${PURPLE}35`,
              }}
            >
              Opslaan
            </motion.button>
            <motion.button
              onClick={() => setShowAdjust(false)}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              style={{
                background: 'transparent', border: '1px solid var(--border)',
                color: 'var(--text-secondary)', borderRadius: 12,
                padding: '12px 18px', cursor: 'pointer',
                fontSize: 14, fontWeight: 600, fontFamily: 'Outfit, sans-serif',
              }}
            >
              Annuleren
            </motion.button>
          </div>
        </motion.div>
      )}

      {loading ? (
        <BudgetSkeleton />
      ) : error ? (
        <div style={{
          background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)',
          borderRadius: 16, padding: '20px 24px', color: '#ef4444', fontWeight: 600,
        }}>
          {error}
        </div>
      ) : (
        <>
          {/* Summary cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(180px,1fr))', gap: 16, marginBottom: 28 }}>
            {summaryCards.map((c, i) => (
              <motion.div
                key={c.label}
                custom={i}
                variants={cardVariants}
                initial="hidden"
                animate="visible"
                whileHover={{ y: -4, boxShadow: `0 10px 30px ${c.color === 'var(--text-primary)' ? PURPLE : c.color}18` }}
                style={{
                  background: 'var(--bg-card)', border: '1px solid var(--border)',
                  borderRadius: 18, padding: '22px 24px',
                  position: 'relative', overflow: 'hidden',
                }}
              >
                <div style={{
                  position: 'absolute', top: 0, right: 0, width: 80, height: 80,
                  background: `radial-gradient(circle at top right, ${c.color === 'var(--text-primary)' ? PURPLE : c.color}14, transparent 70%)`,
                  pointerEvents: 'none',
                }} />
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                  <p style={{ color: 'var(--text-muted)', fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.5, margin: 0 }}>{c.label}</p>
                  <span style={{ fontSize: 20 }}>{c.icon}</span>
                </div>
                <p style={{ fontSize: 26, fontWeight: 950, margin: 0, color: c.color, letterSpacing: -0.5 }}>{c.value}</p>
              </motion.div>
            ))}
          </div>

          {/* Progress bar card */}
          {monthlyBudget > 0 && (
            <motion.div
              custom={4}
              variants={cardVariants}
              initial="hidden"
              animate="visible"
              style={{
                background: 'var(--bg-card)', border: '1px solid var(--border)',
                borderRadius: 18, padding: '24px 28px', marginBottom: 28,
                position: 'relative', overflow: 'hidden',
              }}
            >
              <div style={{
                position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
                background: budgetPct > 80
                  ? `radial-gradient(ellipse at 0% 50%, ${ORANGE}06, transparent 50%)`
                  : `radial-gradient(ellipse at 0% 50%, ${PURPLE}06, transparent 50%)`,
                pointerEvents: 'none',
              }} />
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                <h2 style={{ fontSize: 16, fontWeight: 800, margin: 0 }}>
                  Budgetgebruik {new Date().toLocaleDateString('nl-NL', { month: 'long', year: 'numeric' })}
                </h2>
                <span style={{
                  fontSize: 28, fontWeight: 950, letterSpacing: -1,
                  background: budgetPct > 80 ? `linear-gradient(135deg,${ORANGE},${PINK})` : `linear-gradient(135deg,${PURPLE},${PINK})`,
                  WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                }}>
                  {budgetPct}%
                </span>
              </div>

              {/* Progress track */}
              <div style={{ background: 'rgba(255,255,255,0.07)', borderRadius: 12, height: 18, overflow: 'hidden', marginBottom: 14, position: 'relative' }}>
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${budgetPct}%` }}
                  transition={{ duration: 1.2, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
                  style={{
                    height: '100%', borderRadius: 12,
                    background: budgetPct > 80
                      ? `linear-gradient(90deg,${ORANGE},${PINK})`
                      : `linear-gradient(90deg,${PURPLE},${PINK})`,
                    boxShadow: budgetPct > 80
                      ? `0 0 16px ${ORANGE}40`
                      : `0 0 16px ${PURPLE}30`,
                    position: 'relative',
                  }}
                >
                  {/* Shine effect */}
                  <div style={{
                    position: 'absolute', top: 0, left: 0, right: 0, height: '50%',
                    background: 'rgba(255,255,255,0.18)', borderRadius: '12px 12px 0 0',
                  }} />
                </motion.div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8 }}>
                <div style={{ padding: '8px 14px', background: `${ORANGE}10`, borderRadius: 10, border: `1px solid ${ORANGE}20` }}>
                  <p style={{ fontSize: 11, color: 'var(--text-muted)', margin: '0 0 2px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.5 }}>Gebruikt</p>
                  <p style={{ fontSize: 14, color: ORANGE, fontWeight: 800, margin: 0 }}>
                    €{totalSpent.toLocaleString('nl-NL', { minimumFractionDigits: 2 })}
                  </p>
                </div>
                <div style={{ padding: '8px 14px', background: 'rgba(34,197,94,0.1)', borderRadius: 10, border: '1px solid rgba(34,197,94,0.2)' }}>
                  <p style={{ fontSize: 11, color: 'var(--text-muted)', margin: '0 0 2px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.5 }}>Resterend</p>
                  <p style={{ fontSize: 14, color: '#22c55e', fontWeight: 800, margin: 0 }}>
                    €{remaining.toLocaleString('nl-NL', { minimumFractionDigits: 2 })}
                  </p>
                </div>
              </div>
            </motion.div>
          )}

          {/* Per-employee table */}
          <motion.div
            custom={5}
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 18, overflow: 'hidden' }}
          >
            <div style={{ padding: '18px 24px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ fontSize: 18 }}>👥</span>
              <h2 style={{ fontSize: 15, fontWeight: 800, margin: 0 }}>Budget per medewerker</h2>
            </div>

            {members.length === 0 ? (
              <div style={{ padding: '48px 24px', textAlign: 'center', color: 'var(--text-muted)' }}>
                <div style={{ fontSize: 40, marginBottom: 14 }}>👤</div>
                <p style={{ fontSize: 15, fontWeight: 700, marginBottom: 8 }}>Nog geen medewerkers</p>
                <p style={{ fontSize: 13 }}>Voeg medewerkers toe via het Team-tabblad.</p>
              </div>
            ) : (
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid var(--border)', background: 'rgba(255,255,255,0.02)' }}>
                      {['Medewerker', 'Afdeling', 'Budget', 'Gebruikt', 'Resterend', 'Voortgang'].map(h => (
                        <th key={h} style={{ padding: '12px 16px', textAlign: 'left', color: 'var(--text-muted)', fontSize: 11, fontWeight: 700, whiteSpace: 'nowrap', textTransform: 'uppercase', letterSpacing: 0.5 }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {members.map((emp, i) => {
                      const empBudget = Number(emp.monthlyBudget ?? emp.budget ?? 0);
                      const empUsed = Number(emp.used ?? emp.spent ?? 0);
                      const rem = empBudget - empUsed;
                      const pct = empBudget > 0 ? Math.min(Math.round((empUsed / empBudget) * 100), 100) : 0;
                      const isHigh = pct > 80;
                      const dept = emp.dept ?? emp.department ?? '—';
                      const initials = emp.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
                      const isHovered = hoveredMember === i;

                      return (
                        <tr
                          key={emp.name + i}
                          onMouseEnter={() => setHoveredMember(i)}
                          onMouseLeave={() => setHoveredMember(null)}
                          style={{
                            borderBottom: i < members.length - 1 ? '1px solid var(--border)' : 'none',
                            background: isHovered ? 'rgba(255,255,255,0.025)' : 'transparent',
                            transition: 'background 0.15s',
                          }}
                        >
                          <td style={{ padding: '14px 16px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                              <div style={{
                                width: 34, height: 34, borderRadius: 10, flexShrink: 0,
                                background: isHigh ? `${ORANGE}20` : `${PURPLE}20`,
                                border: `1px solid ${isHigh ? ORANGE : PURPLE}30`,
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                fontSize: 12, fontWeight: 900, color: isHigh ? ORANGE : PURPLE,
                              }}>
                                {initials}
                              </div>
                              <p style={{ fontWeight: 700, fontSize: 14, margin: 0 }}>{emp.name}</p>
                            </div>
                          </td>
                          <td style={{ padding: '14px 16px' }}>
                            <span style={{
                              background: `${PURPLE}12`, color: PURPLE,
                              padding: '4px 10px', borderRadius: 20, fontSize: 11, fontWeight: 700,
                            }}>
                              {dept}
                            </span>
                          </td>
                          <td style={{ padding: '14px 16px', fontWeight: 600 }}>€{empBudget}</td>
                          <td style={{ padding: '14px 16px', color: isHigh ? ORANGE : 'var(--text-primary)', fontWeight: 600 }}>
                            €{empUsed}
                          </td>
                          <td style={{ padding: '14px 16px', color: rem < 100 ? ORANGE : '#22c55e', fontWeight: 700 }}>
                            €{rem}
                          </td>
                          <td style={{ padding: '14px 16px', minWidth: 140 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                              <div style={{ flex: 1, background: 'rgba(255,255,255,0.07)', borderRadius: 6, height: 8, overflow: 'hidden' }}>
                                <motion.div
                                  initial={{ width: 0 }}
                                  animate={{ width: `${pct}%` }}
                                  transition={{ duration: 0.9, delay: i * 0.06 + 0.3, ease: [0.22, 1, 0.36, 1] }}
                                  style={{
                                    height: '100%', borderRadius: 6,
                                    background: isHigh ? `linear-gradient(90deg,${ORANGE},${PINK})` : `linear-gradient(90deg,${PURPLE},${PINK})`,
                                  }}
                                />
                              </div>
                              <span style={{
                                fontSize: 12, fontWeight: 700, minWidth: 34,
                                color: isHigh ? ORANGE : 'var(--text-muted)',
                              }}>
                                {pct}%
                              </span>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </motion.div>
        </>
      )}
    </motion.div>
  );
}
