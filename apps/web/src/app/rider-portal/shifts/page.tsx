'use client';
import { useState } from 'react';

const PURPLE = '#5A31F4';
const PINK = '#FF0080';
const ORANGE = '#FF6B00';

type ShiftStatus = 'bevestigd' | 'open' | 'swap-aangevraagd';

interface Shift {
  id: number;
  dag: string;
  datum: string;
  tijd: string;
  gebied: string;
  restaurant: string;
  status: ShiftStatus;
  mijnDienst?: boolean;
}

const confirmedShifts: Shift[] = [
  { id: 1, dag: 'Maandag', datum: '14 apr', tijd: '17:00 - 21:00', gebied: 'Amsterdam Zuid', restaurant: 'Pizzeria Napoli', status: 'bevestigd', mijnDienst: true },
  { id: 2, dag: 'Dinsdag', datum: '15 apr', tijd: '12:00 - 15:00', gebied: 'Amsterdam Centrum', restaurant: 'Sushi Yama', status: 'open', mijnDienst: true },
  { id: 3, dag: 'Donderdag', datum: '17 apr', tijd: '17:00 - 22:00', gebied: 'Amsterdam West', restaurant: 'Pizzeria Napoli', status: 'bevestigd', mijnDienst: true },
  { id: 4, dag: 'Vrijdag', datum: '18 apr', tijd: '18:00 - 23:00', gebied: 'Amsterdam Noord', restaurant: 'Burgermeester', status: 'bevestigd', mijnDienst: true },
];

const availableShifts: Shift[] = [
  { id: 10, dag: 'Woensdag', datum: '16 apr', tijd: '11:00 - 15:00', gebied: 'Amsterdam Oost', restaurant: 'Koto Ramen', status: 'open' },
  { id: 11, dag: 'Woensdag', datum: '16 apr', tijd: '17:00 - 21:00', gebied: 'Amsterdam Zuid', restaurant: 'Pizzeria Napoli', status: 'open' },
  { id: 12, dag: 'Zaterdag', datum: '19 apr', tijd: '12:00 - 18:00', gebied: 'Amsterdam Centrum', restaurant: 'Various', status: 'open' },
  { id: 13, dag: 'Zondag', datum: '20 apr', tijd: '14:00 - 20:00', gebied: 'Amsterdam West', restaurant: 'Various', status: 'open' },
];

const swapRequests: { id: number; vanRider: string; dienst: string; biedt: string; status: 'wachtend' | 'aanvaard' }[] = [
  { id: 20, vanRider: 'Yohannes T.', dienst: 'Do 17 apr 17:00–22:00', biedt: 'Vr 18 apr 12:00–16:00', status: 'wachtend' },
  { id: 21, vanRider: 'Fatima A.', dienst: 'Di 15 apr 12:00–15:00', biedt: 'Wo 16 apr 17:00–21:00', status: 'wachtend' },
];

function StatusBadge({ status }: { status: ShiftStatus }) {
  const map = {
    bevestigd: { label: 'Bevestigd', bg: `${PURPLE}20`, color: PURPLE },
    open: { label: 'Open', bg: `${ORANGE}20`, color: ORANGE },
    'swap-aangevraagd': { label: 'Swap aangevraagd', bg: 'rgba(234,179,8,0.15)', color: '#ca8a04' },
  };
  const s = map[status];
  return (
    <span style={{ fontSize: 12, fontWeight: 700, padding: '4px 10px', borderRadius: 99, background: s.bg, color: s.color, whiteSpace: 'nowrap' }}>
      {s.label}
    </span>
  );
}

export default function RiderShiftsPage() {
  const [claimedIds, setClaimedIds] = useState<number[]>([]);
  const [respondedSwaps, setRespondedSwaps] = useState<Record<number, 'aanvaard' | 'afgewezen'>>({});

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
              Diensten
            </h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: 16, margin: 0 }}>
              Beheer je diensten, claim nieuwe shiften en handel swap-verzoeken af.
            </p>
          </div>

          {/* Summary row */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 16, marginBottom: 28 }}>
            {[
              { label: 'Bevestigde diensten', value: String(confirmedShifts.filter(s => s.status === 'bevestigd').length) },
              { label: 'Open slots', value: String(availableShifts.length) },
              { label: 'Swap verzoeken', value: String(swapRequests.length) },
              { label: 'Uren deze week', value: '16u' },
            ].map(stat => (
              <div key={stat.label} style={{ background: 'var(--bg-card)', borderRadius: 16, border: '1px solid var(--border)', padding: '18px 20px' }}>
                <p style={{ fontSize: 24, fontWeight: 950, letterSpacing: -0.5, margin: '0 0 4px', background: `linear-gradient(135deg,${PURPLE},${PINK})`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>{stat.value}</p>
                <p style={{ fontSize: 12, color: 'var(--text-muted)', fontWeight: 600, margin: 0 }}>{stat.label}</p>
              </div>
            ))}
          </div>

          {/* My confirmed shifts */}
          <div style={card}>
            <p style={sectionLabel}>Mijn aankomende diensten</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
              {confirmedShifts.map((shift, i) => (
                <div key={shift.id} style={{
                  display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 14,
                  padding: '16px 0',
                  borderBottom: i < confirmedShifts.length - 1 ? '1px solid var(--border)' : 'none',
                }}>
                  {/* Date pill */}
                  <div style={{ textAlign: 'center', minWidth: 58, background: `${PURPLE}15`, borderRadius: 12, padding: '8px 10px', flexShrink: 0 }}>
                    <p style={{ fontSize: 12, fontWeight: 800, color: PURPLE, margin: 0, textTransform: 'uppercase', letterSpacing: 0.5 }}>{shift.dag.slice(0, 2)}</p>
                    <p style={{ fontSize: 18, fontWeight: 950, color: 'var(--text-primary)', margin: 0, letterSpacing: -0.5 }}>{shift.datum.split(' ')[0]}</p>
                    <p style={{ fontSize: 11, color: 'var(--text-muted)', margin: 0 }}>{shift.datum.split(' ')[1]}</p>
                  </div>

                  <div style={{ flex: 1, minWidth: 120 }}>
                    <p style={{ fontSize: 15, fontWeight: 700, margin: '0 0 2px' }}>{shift.tijd}</p>
                    <p style={{ fontSize: 13, color: 'var(--text-muted)', margin: 0 }}>{shift.restaurant} · {shift.gebied}</p>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
                    <StatusBadge status={shift.status} />
                    <button style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', color: 'var(--text-muted)', borderRadius: 8, padding: '6px 14px', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
                      Swap aanvragen
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Available shifts to claim */}
          <div style={card}>
            <p style={sectionLabel}>Beschikbare diensten — claimbaar</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
              {availableShifts.map((shift, i) => {
                const claimed = claimedIds.includes(shift.id);
                return (
                  <div key={shift.id} style={{
                    display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 14,
                    padding: '16px 0',
                    borderBottom: i < availableShifts.length - 1 ? '1px solid var(--border)' : 'none',
                    opacity: claimed ? 0.5 : 1,
                  }}>
                    <div style={{ textAlign: 'center', minWidth: 58, background: 'rgba(255,255,255,0.04)', borderRadius: 12, padding: '8px 10px', flexShrink: 0 }}>
                      <p style={{ fontSize: 12, fontWeight: 800, color: 'var(--text-muted)', margin: 0, textTransform: 'uppercase', letterSpacing: 0.5 }}>{shift.dag.slice(0, 2)}</p>
                      <p style={{ fontSize: 18, fontWeight: 950, color: 'var(--text-primary)', margin: 0, letterSpacing: -0.5 }}>{shift.datum.split(' ')[0]}</p>
                      <p style={{ fontSize: 11, color: 'var(--text-muted)', margin: 0 }}>{shift.datum.split(' ')[1]}</p>
                    </div>

                    <div style={{ flex: 1, minWidth: 120 }}>
                      <p style={{ fontSize: 15, fontWeight: 700, margin: '0 0 2px' }}>{shift.tijd}</p>
                      <p style={{ fontSize: 13, color: 'var(--text-muted)', margin: 0 }}>{shift.restaurant} · {shift.gebied}</p>
                    </div>

                    <button
                      onClick={() => !claimed && setClaimedIds(prev => [...prev, shift.id])}
                      style={{
                        background: claimed ? 'rgba(34,197,94,0.12)' : `linear-gradient(135deg,${PURPLE},${PINK})`,
                        color: claimed ? '#22c55e' : 'white',
                        border: 'none', borderRadius: 10, padding: '9px 20px',
                        fontSize: 14, fontWeight: 700, cursor: claimed ? 'default' : 'pointer',
                        flexShrink: 0, boxShadow: claimed ? 'none' : `0 4px 14px ${PURPLE}30`,
                      }}
                    >
                      {claimed ? '✓ Geclaimd' : 'Claimen'}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Swap requests */}
          <div style={card}>
            <p style={sectionLabel}>Swap verzoeken</p>
            {swapRequests.length === 0 ? (
              <p style={{ color: 'var(--text-muted)', fontSize: 14 }}>Geen openstaande swap-verzoeken.</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                {swapRequests.map(req => {
                  const response = respondedSwaps[req.id];
                  return (
                    <div key={req.id} style={{ background: 'rgba(255,255,255,0.03)', borderRadius: 14, border: '1px solid var(--border)', padding: '18px 20px' }}>
                      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
                        <div>
                          <p style={{ fontSize: 14, fontWeight: 700, margin: '0 0 6px' }}>{req.vanRider} vraagt een swap</p>
                          <p style={{ fontSize: 13, color: 'var(--text-muted)', margin: '0 0 2px' }}>
                            <span style={{ fontWeight: 600, color: 'var(--text-secondary)' }}>Wil jouw dienst:</span> {req.dienst}
                          </p>
                          <p style={{ fontSize: 13, color: 'var(--text-muted)', margin: 0 }}>
                            <span style={{ fontWeight: 600, color: 'var(--text-secondary)' }}>Biedt aan:</span> {req.biedt}
                          </p>
                        </div>

                        {response ? (
                          <span style={{
                            fontSize: 13, fontWeight: 700, padding: '6px 14px', borderRadius: 99,
                            background: response === 'aanvaard' ? 'rgba(34,197,94,0.12)' : 'rgba(239,68,68,0.1)',
                            color: response === 'aanvaard' ? '#22c55e' : '#ef4444',
                          }}>
                            {response === 'aanvaard' ? '✓ Aanvaard' : '✕ Afgewezen'}
                          </span>
                        ) : (
                          <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
                            <button
                              onClick={() => setRespondedSwaps(prev => ({ ...prev, [req.id]: 'aanvaard' }))}
                              style={{ background: `linear-gradient(135deg,${PURPLE},${PINK})`, color: 'white', border: 'none', borderRadius: 10, padding: '8px 18px', fontSize: 14, fontWeight: 700, cursor: 'pointer' }}>
                              Aanvaarden
                            </button>
                            <button
                              onClick={() => setRespondedSwaps(prev => ({ ...prev, [req.id]: 'afgewezen' }))}
                              style={{ background: 'rgba(239,68,68,0.1)', color: '#ef4444', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 10, padding: '8px 18px', fontSize: 14, fontWeight: 700, cursor: 'pointer' }}>
                              Afwijzen
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
