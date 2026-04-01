'use client';
import { useState } from 'react';

const PURPLE = '#5A31F4';
const PINK = '#FF0080';
const ORANGE = '#FF6B00';

const MONTHLY_BUDGET = 10000;
const SPENT = 2340;

const EMPLOYEES = [
  { name: 'Jan de Vries',      dept: 'Engineering', budget: 500, used: 320 },
  { name: 'Lisa Bakker',       dept: 'Marketing',   budget: 500, used: 445 },
  { name: 'Ahmed Hassan',      dept: 'Engineering', budget: 500, used: 210 },
  { name: 'Sophie Mulder',     dept: 'Design',      budget: 500, used: 385 },
  { name: 'Tim van den Berg',  dept: 'Sales',       budget: 500, used: 290 },
  { name: 'Emma Visser',       dept: 'HR',          budget: 400, used: 175 },
  { name: 'Daan Smit',         dept: 'Finance',     budget: 400, used: 310 },
  { name: 'Noor Jansen',       dept: 'Engineering', budget: 500, used: 205 },
];

export default function BudgetPage() {
  const [showAdjust, setShowAdjust] = useState(false);
  const [newBudget, setNewBudget] = useState(String(MONTHLY_BUDGET));

  const remaining = MONTHLY_BUDGET - SPENT;
  const budgetPct = Math.round((SPENT / MONTHLY_BUDGET) * 100);

  return (
    <div style={{ padding: 'clamp(20px,3vw,40px)', maxWidth: 1000, margin: '0 auto' }}>

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 28, flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h1 style={{ fontSize: 'clamp(22px,4vw,30px)', fontWeight: 950, letterSpacing: -0.5, margin: '0 0 6px' }}>
            Budget
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: 14, margin: 0 }}>
            Maandbudget april 2026 — TechCorp BV
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

      {/* Top summary */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(180px,1fr))', gap: 16, marginBottom: 28 }}>
        {[
          { label: 'Totaal budget', value: `€${MONTHLY_BUDGET.toLocaleString('nl-NL')}`, color: 'var(--text-primary)' },
          { label: 'Gebruikt', value: `€${SPENT.toLocaleString('nl-NL')}`, color: ORANGE },
          { label: 'Resterend', value: `€${remaining.toLocaleString('nl-NL')}`, color: '#22c55e' },
          { label: 'Medewerkers', value: String(EMPLOYEES.length), color: PURPLE },
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
      <div style={{
        background: 'var(--bg-card)', border: '1px solid var(--border)',
        borderRadius: 18, padding: '24px 28px', marginBottom: 28,
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <h2 style={{ fontSize: 16, fontWeight: 800, margin: 0 }}>Budgetgebruik april 2026</h2>
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
          <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>€{(MONTHLY_BUDGET / 2).toLocaleString('nl-NL')}</span>
          <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>€{MONTHLY_BUDGET.toLocaleString('nl-NL')}</span>
        </div>
      </div>

      {/* Per-employee table */}
      <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 18, overflow: 'hidden' }}>
        <div style={{ padding: '18px 24px', borderBottom: '1px solid var(--border)' }}>
          <h2 style={{ fontSize: 16, fontWeight: 800, margin: 0 }}>Budget per medewerker</h2>
        </div>
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
              {EMPLOYEES.map((emp, i) => {
                const rem = emp.budget - emp.used;
                const pct = Math.round((emp.used / emp.budget) * 100);
                const isHigh = pct > 80;
                return (
                  <tr key={emp.name} style={{ borderBottom: i < EMPLOYEES.length - 1 ? '1px solid var(--border)' : 'none' }}>
                    <td style={{ padding: '14px 16px', fontWeight: 700 }}>{emp.name}</td>
                    <td style={{ padding: '14px 16px', color: 'var(--text-secondary)' }}>{emp.dept}</td>
                    <td style={{ padding: '14px 16px', fontWeight: 600 }}>€{emp.budget}</td>
                    <td style={{ padding: '14px 16px', color: isHigh ? ORANGE : 'var(--text-primary)', fontWeight: 600 }}>
                      €{emp.used}
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
      </div>
    </div>
  );
}
