'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

const PURPLE = '#5A31F4';
const PINK = '#FF0080';
const ORANGE = '#FF6B00';

const API_URL = process.env.NEXT_PUBLIC_VP_DOMAIN || 'https://veloci.online';

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

export default function BudgetPage() {
  const router = useRouter();
  const [data, setData] = useState<BudgetData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showAdjust, setShowAdjust] = useState(false);
  const [newBudget, setNewBudget] = useState('');

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

  return (
    <div style={{ padding: 'clamp(20px,3vw,40px)', maxWidth: 1000, margin: '0 auto' }}>

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 28, flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h1 style={{ fontSize: 'clamp(22px,4vw,30px)', fontWeight: 950, letterSpacing: -0.5, margin: '0 0 6px' }}>
            Budget
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: 14, margin: 0 }}>
            Maandbudget {new Date().toLocaleDateString('nl-NL', { month: 'long', year: 'numeric' })} — {companyName}
          </p>
        </div>
        <button
          onClick={() => setShowAdjust(!showAdjust)}
          style={{
            background: `linear-gradient(135deg,${PURPLE},${PINK})`,
            color: 'white', border: 'none', borderRadius: 12,
            padding: '12px 20px', cursor: 'pointer',
            fontSize: 14, fontWeight: 700, fontFamily: 'Outfit, sans-serif',
            boxShadow: `0 4px 14px ${PURPLE}35`,
          }}
        >
          Budget aanpassen
        </button>
      </div>

      {/* Adjust budget panel */}
      {showAdjust && (
        <div style={{
          background: `rgba(90,49,244,0.06)`, border: `1px solid ${PURPLE}30`,
          borderRadius: 16, padding: '20px 24px', marginBottom: 24,
          display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap',
        }}>
          <div style={{ flex: 1, minWidth: 200 }}>
            <label style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-muted)', display: 'block', marginBottom: 6 }}>
              Nieuw maandbudget (€)
            </label>
            <input
              type="number"
              value={newBudget}
              onChange={e => setNewBudget(e.target.value)}
              style={{
                width: '100%', background: 'rgba(255,255,255,0.06)',
                border: '1px solid rgba(255,255,255,0.12)', borderRadius: 10,
                padding: '12px 16px', color: 'var(--text-primary)',
                fontSize: 15, fontFamily: 'Outfit, sans-serif', outline: 'none',
              }}
            />
          </div>
          <div style={{ display: 'flex', gap: 8, alignSelf: 'flex-end' }}>
            <button
              onClick={() => setShowAdjust(false)}
              style={{
                background: `linear-gradient(135deg,${PURPLE},${PINK})`,
                color: 'white', border: 'none', borderRadius: 10,
                padding: '12px 20px', cursor: 'pointer',
                fontSize: 14, fontWeight: 700, fontFamily: 'Outfit, sans-serif',
              }}
            >
              Opslaan
            </button>
            <button
              onClick={() => setShowAdjust(false)}
              style={{
                background: 'transparent', border: '1px solid var(--border)',
                color: 'var(--text-secondary)', borderRadius: 10,
                padding: '12px 16px', cursor: 'pointer',
                fontSize: 14, fontWeight: 600, fontFamily: 'Outfit, sans-serif',
              }}
            >
              Annuleren
            </button>
          </div>
        </div>
      )}

      {loading ? (
        <Spinner />
      ) : error ? (
        <div style={{
          background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)',
          borderRadius: 16, padding: '20px 24px', color: '#ef4444', fontWeight: 600,
        }}>
          {error}
        </div>
      ) : (
        <>
          {/* Top summary */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(180px,1fr))', gap: 16, marginBottom: 28 }}>
            {[
              { label: 'Totaal budget', value: `€${monthlyBudget.toLocaleString('nl-NL')}`, color: 'var(--text-primary)' },
              { label: 'Gebruikt', value: `€${totalSpent.toLocaleString('nl-NL')}`, color: ORANGE },
              { label: 'Resterend', value: `€${remaining.toLocaleString('nl-NL')}`, color: '#22c55e' },
              { label: 'Medewerkers', value: String(members.length), color: PURPLE },
            ].map(c => (
              <div key={c.label} style={{
                background: 'var(--bg-card)', border: '1px solid var(--border)',
                borderRadius: 16, padding: '20px 22px',
              }}>
                <p style={{ color: 'var(--text-muted)', fontSize: 13, fontWeight: 600, marginBottom: 8 }}>{c.label}</p>
                <p style={{ fontSize: 26, fontWeight: 950, margin: 0, color: c.color }}>{c.value}</p>
              </div>
            ))}
          </div>

          {/* Progress bar */}
          {monthlyBudget > 0 && (
            <div style={{
              background: 'var(--bg-card)', border: '1px solid var(--border)',
              borderRadius: 18, padding: '24px 28px', marginBottom: 28,
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                <h2 style={{ fontSize: 16, fontWeight: 800, margin: 0 }}>
                  Budgetgebruik {new Date().toLocaleDateString('nl-NL', { month: 'long', year: 'numeric' })}
                </h2>
                <span style={{ fontSize: 28, fontWeight: 950, color: budgetPct > 80 ? ORANGE : PURPLE }}>{budgetPct}%</span>
              </div>
              <div style={{ background: 'rgba(255,255,255,0.07)', borderRadius: 10, height: 16, overflow: 'hidden', marginBottom: 10 }}>
                <div style={{
                  width: `${budgetPct}%`, height: '100%', borderRadius: 10,
                  background: budgetPct > 80
                    ? `linear-gradient(90deg,${ORANGE},${PINK})`
                    : `linear-gradient(90deg,${PURPLE},${PINK})`,
                  transition: 'width 0.8s ease',
                }} />
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>€0</span>
                <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>€{(monthlyBudget / 2).toLocaleString('nl-NL')}</span>
                <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>€{monthlyBudget.toLocaleString('nl-NL')}</span>
              </div>
            </div>
          )}

          {/* Per-employee table */}
          <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 18, overflow: 'hidden' }}>
            <div style={{ padding: '18px 24px', borderBottom: '1px solid var(--border)' }}>
              <h2 style={{ fontSize: 16, fontWeight: 800, margin: 0 }}>Budget per medewerker</h2>
            </div>

            {members.length === 0 ? (
              <div style={{ padding: '40px 24px', textAlign: 'center', color: 'var(--text-muted)' }}>
                <p style={{ fontSize: 15, marginBottom: 8 }}>Nog geen medewerkers</p>
                <p style={{ fontSize: 13 }}>Voeg medewerkers toe via het Team-tabblad.</p>
              </div>
            ) : (
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid var(--border)' }}>
                      {['Medewerker', 'Afdeling', 'Budget', 'Gebruikt', 'Resterend', 'Voortgang'].map(h => (
                        <th key={h} style={{ padding: '12px 16px', textAlign: 'left', color: 'var(--text-muted)', fontSize: 12, fontWeight: 700, whiteSpace: 'nowrap' }}>{h}</th>
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
                      return (
                        <tr key={emp.name + i} style={{ borderBottom: i < members.length - 1 ? '1px solid var(--border)' : 'none' }}>
                          <td style={{ padding: '14px 16px', fontWeight: 700 }}>{emp.name}</td>
                          <td style={{ padding: '14px 16px', color: 'var(--text-secondary)' }}>{dept}</td>
                          <td style={{ padding: '14px 16px', fontWeight: 600 }}>€{empBudget}</td>
                          <td style={{ padding: '14px 16px', color: isHigh ? ORANGE : 'var(--text-primary)', fontWeight: 600 }}>
                            €{empUsed}
                          </td>
                          <td style={{ padding: '14px 16px', color: rem < 100 ? ORANGE : '#22c55e', fontWeight: 700 }}>
                            €{rem}
                          </td>
                          <td style={{ padding: '14px 16px', minWidth: 120 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                              <div style={{ flex: 1, background: 'rgba(255,255,255,0.07)', borderRadius: 4, height: 6, overflow: 'hidden' }}>
                                <div style={{
                                  width: `${pct}%`, height: '100%', borderRadius: 4,
                                  background: isHigh ? ORANGE : `linear-gradient(90deg,${PURPLE},${PINK})`,
                                }} />
                              </div>
                              <span style={{ fontSize: 12, color: 'var(--text-muted)', minWidth: 28 }}>{pct}%</span>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
