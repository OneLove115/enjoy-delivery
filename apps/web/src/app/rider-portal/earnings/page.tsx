'use client';
import { useRouter } from 'next/navigation';

const PURPLE = '#5A31F4';
const PINK = '#FF0080';
const ORANGE = '#FF6B00';

const weeklyBreakdown = [
  { dag: 'Maandag 7 apr', bestellingen: 6, uren: 3.5, bedrag: '€42,00' },
  { dag: 'Dinsdag 8 apr', bestellingen: 4, uren: 2.5, bedrag: '€28,00' },
  { dag: 'Woensdag 9 apr', bestellingen: 0, uren: 0, bedrag: '€0,00' },
  { dag: 'Donderdag 10 apr', bestellingen: 8, uren: 4.5, bedrag: '€52,50' },
  { dag: 'Vrijdag 11 apr', bestellingen: 11, uren: 5, bedrag: '€65,00' },
  { dag: 'Zaterdag 12 apr', bestellingen: 0, uren: 0, bedrag: '€0,00' },
  { dag: 'Zondag 13 apr', bestellingen: 0, uren: 0, bedrag: '€0,00' },
];

const monthlySummary = [
  { week: 'Week 1 (1–7 apr)', bedrag: '€168,00', bestellingen: 28 },
  { week: 'Week 2 (8–13 apr)', bedrag: '€187,50', bestellingen: 29, huidig: true },
  { week: 'Week 3 (14–20 apr)', bedrag: '—', bestellingen: '—' },
  { week: 'Week 4 (21–27 apr)', bedrag: '—', bestellingen: '—' },
];

const payoutHistory = [
  { datum: '11 apr 2026', periode: '24 mrt – 6 apr', bedrag: '€256,50', status: 'betaald' as const },
  { datum: '28 mrt 2026', periode: '10 mrt – 23 mrt', bedrag: '€312,00', status: 'betaald' as const },
  { datum: '14 mrt 2026', periode: '24 feb – 9 mrt', bedrag: '€289,75', status: 'betaald' as const },
  { datum: '28 feb 2026', periode: '10 feb – 23 feb', bedrag: '€198,00', status: 'betaald' as const },
  { datum: '18 apr 2026', periode: '7 apr – 18 apr', bedrag: '€187,50', status: 'in behandeling' as const },
];

export default function RiderEarningsPage() {
  const router = useRouter();

  const card: React.CSSProperties = {
    background: 'var(--bg-card)',
    borderRadius: 20,
    border: '1px solid var(--border)',
    padding: 'clamp(20px,4vw,32px)',
    marginBottom: 24,
  };

  const sectionLabel: React.CSSProperties = {
    fontSize: 12,
    fontWeight: 800,
    color: 'var(--text-muted)',
    textTransform: 'uppercase',
    letterSpacing: 1.2,
    marginBottom: 20,
  };

  return (
    <div style={{ minHeight: '100vh', color: 'var(--text-primary)', fontFamily: 'Outfit, sans-serif' }}>
      <div style={{ position: 'relative' }}>
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 60% 0%, rgba(90,49,244,0.07) 0%, transparent 60%)', pointerEvents: 'none' }} />

        <div style={{ position: 'relative', zIndex: 1, maxWidth: 900, margin: '0 auto', padding: 'clamp(32px,5vw,56px) clamp(16px,4vw,40px)' }}>

          {/* Page header */}
          <div style={{ marginBottom: 40 }}>
            <h1 style={{ fontSize: 'clamp(26px,5vw,42px)', fontWeight: 950, letterSpacing: -1, marginBottom: 8 }}>
              Verdiensten
            </h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: 16, margin: 0 }}>
              Overzicht van je inkomsten en uitbetalingen.
            </p>
          </div>

          {/* Next payout banner */}
          <div style={{ background: `linear-gradient(135deg, ${PURPLE}18, ${PINK}10)`, border: `1px solid ${PURPLE}30`, borderRadius: 20, padding: '20px 28px', marginBottom: 24, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
            <div>
              <p style={{ fontSize: 12, fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 4 }}>Volgende uitbetaling</p>
              <p style={{ fontSize: 20, fontWeight: 900, margin: 0 }}>Vrijdag 18 april — <span style={{ background: `linear-gradient(135deg,${PURPLE},${PINK})`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>€187,50</span></p>
            </div>
            <div style={{ textAlign: 'right' }}>
              <p style={{ fontSize: 12, color: 'var(--text-muted)', margin: 0 }}>Status</p>
              <p style={{ fontSize: 14, fontWeight: 700, color: ORANGE, margin: 0 }}>In behandeling</p>
            </div>
          </div>

          {/* Summary cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 16, marginBottom: 24 }}>
            {[
              { label: 'Deze week', value: '€187,50', sub: '29 bestellingen' },
              { label: 'Deze maand', value: '€355,50', sub: '57 bestellingen' },
              { label: 'Dit jaar', value: '€2.450,00', sub: '391 bestellingen' },
            ].map(item => (
              <div key={item.label} style={{ background: 'var(--bg-card)', borderRadius: 16, border: '1px solid var(--border)', padding: '20px 22px' }}>
                <p style={{ fontSize: 12, color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 8 }}>{item.label}</p>
                <p style={{ fontSize: 28, fontWeight: 950, letterSpacing: -1, margin: '0 0 4px', background: `linear-gradient(135deg,${PURPLE},${PINK})`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                  {item.value}
                </p>
                <p style={{ fontSize: 13, color: 'var(--text-muted)', margin: 0 }}>{item.sub}</p>
              </div>
            ))}
          </div>

          {/* Weekly breakdown */}
          <div style={card}>
            <p style={sectionLabel}>Week overzicht — 7 t/m 13 april</p>
            <div>
              <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: 12, padding: '0 0 10px', borderBottom: '1px solid var(--border)', marginBottom: 4 }}>
                {['Dag', 'Bestellingen', 'Uren', 'Verdienst'].map(h => (
                  <span key={h} style={{ fontSize: 11, fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: 0.8 }}>{h}</span>
                ))}
              </div>
              {weeklyBreakdown.map((row, i) => {
                const inactive = row.bestellingen === 0;
                return (
                  <div key={i} style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: 12, padding: '14px 0', borderBottom: i < weeklyBreakdown.length - 1 ? '1px solid var(--border)' : 'none', alignItems: 'center', opacity: inactive ? 0.4 : 1 }}>
                    <span style={{ fontSize: 14, fontWeight: 600 }}>{row.dag}</span>
                    <span style={{ fontSize: 14, color: 'var(--text-secondary)' }}>{row.bestellingen}</span>
                    <span style={{ fontSize: 14, color: 'var(--text-secondary)' }}>{row.uren > 0 ? `${row.uren}u` : '—'}</span>
                    <span style={{ fontSize: 14, fontWeight: 700, color: inactive ? 'var(--text-muted)' : 'var(--text-primary)' }}>{row.bedrag}</span>
                  </div>
                );
              })}
              <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: 12, padding: '16px 0 0', borderTop: '1px solid var(--border)', marginTop: 4 }}>
                <span style={{ fontSize: 14, fontWeight: 800 }}>Totaal</span>
                <span style={{ fontSize: 14, fontWeight: 800 }}>29</span>
                <span style={{ fontSize: 14, fontWeight: 800 }}>16u</span>
                <span style={{ fontSize: 14, fontWeight: 900, color: PURPLE }}>€187,50</span>
              </div>
            </div>
          </div>

          {/* Monthly summary */}
          <div style={card}>
            <p style={sectionLabel}>Maandoverzicht — april 2026</p>
            <div>
              <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: 12, padding: '0 0 10px', borderBottom: '1px solid var(--border)', marginBottom: 4 }}>
                {['Week', 'Bestellingen', 'Verdienst'].map(h => (
                  <span key={h} style={{ fontSize: 11, fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: 0.8 }}>{h}</span>
                ))}
              </div>
              {monthlySummary.map((row, i) => (
                <div key={i} style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: 12, padding: row.huidig ? '14px 8px' : '14px 0', borderBottom: i < monthlySummary.length - 1 ? '1px solid var(--border)' : 'none', alignItems: 'center', background: row.huidig ? `${PURPLE}08` : 'transparent', borderRadius: row.huidig ? 10 : 0, margin: row.huidig ? '0 -8px' : 0 }}>
                  <span style={{ fontSize: 14, fontWeight: row.huidig ? 800 : 600 }}>
                    {row.week}
                    {row.huidig && <span style={{ marginLeft: 8, fontSize: 11, background: `${PURPLE}25`, color: PURPLE, padding: '2px 8px', borderRadius: 99, fontWeight: 700 }}>huidig</span>}
                  </span>
                  <span style={{ fontSize: 14, color: 'var(--text-secondary)' }}>{row.bestellingen}</span>
                  <span style={{ fontSize: 14, fontWeight: 700 }}>{row.bedrag}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Payout history */}
          <div style={card}>
            <p style={sectionLabel}>Uitbetalingsgeschiedenis</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
              {payoutHistory.map((payout, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12, padding: '16px 0', borderBottom: i < payoutHistory.length - 1 ? '1px solid var(--border)' : 'none' }}>
                  <div>
                    <p style={{ fontSize: 14, fontWeight: 700, margin: '0 0 2px' }}>{payout.datum}</p>
                    <p style={{ fontSize: 13, color: 'var(--text-muted)', margin: 0 }}>{payout.periode}</p>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                    <span style={{ fontSize: 18, fontWeight: 800 }}>{payout.bedrag}</span>
                    <span style={{
                      fontSize: 12, fontWeight: 700, padding: '5px 12px', borderRadius: 99,
                      background: payout.status === 'betaald' ? 'rgba(34,197,94,0.12)' : `${ORANGE}18`,
                      color: payout.status === 'betaald' ? '#22c55e' : ORANGE,
                    }}>
                      {payout.status === 'betaald' ? '✓ Betaald' : 'In behandeling'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
