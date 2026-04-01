'use client';
import { useState } from 'react';

const PURPLE = '#5A31F4';
const PINK = '#FF0080';
const ORANGE = '#FF6B00';

const mockProfile = {
  firstName: 'Daan',
  lastName: 'Visser',
  email: 'daan.visser@gmail.com',
  telefoon: '+31 6 12 34 56 78',
  stad: 'Amsterdam',
  postcode: '1012 AB',
  vehicle: 'E-bike',
  iban: 'NL91 ABNA 0417 1643 00',
  aangemeldOp: '12 januari 2026',
  actief: true,
};

const documents = [
  { label: 'Identiteitsbewijs', status: 'goedgekeurd' as const },
  { label: 'CV / Motivatie', status: 'goedgekeurd' as const },
  { label: 'IBAN rekeningnummer', status: 'goedgekeurd' as const },
  { label: 'VOG (Verklaring Omtrent Gedrag)', status: 'in behandeling' as const },
];

const vehicleInfo = {
  type: 'E-bike',
  merk: 'Gazelle',
  model: 'Ultimate C380',
  kenteken: 'N.v.t.',
  verzekerd: true,
};

export default function RiderProfilePage() {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [editMode, setEditMode] = useState(false);

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

  const infoGrid: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: 20,
  };

  const infoItem = (label: string, value: string) => (
    <div key={label}>
      <p style={{ fontSize: 12, color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 4 }}>{label}</p>
      <p style={{ fontSize: 15, fontWeight: 600, margin: 0 }}>{value}</p>
    </div>
  );

  return (
    <div style={{ minHeight: '100vh', color: 'var(--text-primary)', fontFamily: 'Outfit, sans-serif' }}>
      <div style={{ position: 'relative' }}>
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 60% 0%, rgba(90,49,244,0.07) 0%, transparent 60%)', pointerEvents: 'none' }} />

        <div style={{ position: 'relative', zIndex: 1, maxWidth: 900, margin: '0 auto', padding: 'clamp(32px,5vw,56px) clamp(16px,4vw,40px)' }}>

          {/* Page header */}
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16, marginBottom: 40 }}>
            <div>
              <h1 style={{ fontSize: 'clamp(26px,5vw,42px)', fontWeight: 950, letterSpacing: -1, marginBottom: 8 }}>
                Mijn Profiel
              </h1>
              <p style={{ color: 'var(--text-secondary)', fontSize: 16, margin: 0 }}>
                Beheer je persoonlijke gegevens en documenten.
              </p>
            </div>
            <button
              onClick={() => setEditMode(!editMode)}
              style={{
                background: editMode ? `linear-gradient(135deg,${PURPLE},${PINK})` : 'rgba(255,255,255,0.05)',
                border: editMode ? 'none' : '1px solid rgba(255,255,255,0.1)',
                color: editMode ? 'white' : 'var(--text-secondary)',
                borderRadius: 12, padding: '11px 24px', fontSize: 15,
                fontWeight: 700, cursor: 'pointer', flexShrink: 0,
              }}>
              {editMode ? 'Opslaan' : 'Bewerken'}
            </button>
          </div>

          {/* Avatar + status */}
          <div style={{ ...card, display: 'flex', alignItems: 'center', gap: 24, flexWrap: 'wrap' }}>
            <div style={{ width: 80, height: 80, borderRadius: '50%', background: `linear-gradient(135deg,${PURPLE},${PINK})`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 32, fontWeight: 900, color: 'white', flexShrink: 0 }}>
              {mockProfile.firstName[0]}{mockProfile.lastName[0]}
            </div>
            <div style={{ flex: 1 }}>
              <h2 style={{ fontSize: 22, fontWeight: 900, margin: '0 0 4px' }}>{mockProfile.firstName} {mockProfile.lastName}</h2>
              <p style={{ color: 'var(--text-secondary)', margin: '0 0 10px', fontSize: 14 }}>{mockProfile.email}</p>
              <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                <span style={{ fontSize: 12, fontWeight: 700, padding: '4px 12px', borderRadius: 99, background: 'rgba(34,197,94,0.12)', color: '#22c55e' }}>
                  ● Actief bezorger
                </span>
                <span style={{ fontSize: 12, fontWeight: 700, padding: '4px 12px', borderRadius: 99, background: `${PURPLE}18`, color: PURPLE }}>
                  {mockProfile.vehicle}
                </span>
                <span style={{ fontSize: 12, fontWeight: 600, padding: '4px 12px', borderRadius: 99, background: 'rgba(255,255,255,0.06)', color: 'var(--text-muted)' }}>
                  Lid sinds {mockProfile.aangemeldOp}
                </span>
              </div>
            </div>
          </div>

          {/* Personal info */}
          <div style={card}>
            <p style={sectionLabel}>Persoonlijke gegevens</p>
            <div style={infoGrid}>
              {infoItem('Voornaam', mockProfile.firstName)}
              {infoItem('Achternaam', mockProfile.lastName)}
              {infoItem('E-mailadres', mockProfile.email)}
              {infoItem('Telefoonnummer', mockProfile.telefoon)}
              {infoItem('Stad', mockProfile.stad)}
              {infoItem('Postcode', mockProfile.postcode)}
              {infoItem('Vervoersmiddel', mockProfile.vehicle)}
            </div>
            {editMode && (
              <p style={{ marginTop: 16, fontSize: 13, color: 'var(--text-muted)', background: `${PURPLE}10`, padding: '10px 14px', borderRadius: 10, border: `1px solid ${PURPLE}20` }}>
                Neem contact op met support om je gegevens te wijzigen.
              </p>
            )}
          </div>

          {/* Document status */}
          <div style={card}>
            <p style={sectionLabel}>Documenten</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
              {documents.map((doc, i) => (
                <div key={doc.label} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12, padding: '14px 0', borderBottom: i < documents.length - 1 ? '1px solid var(--border)' : 'none' }}>
                  <span style={{ fontSize: 15, fontWeight: 600 }}>{doc.label}</span>
                  <span style={{
                    fontSize: 12, fontWeight: 700, padding: '5px 12px', borderRadius: 99,
                    background: doc.status === 'goedgekeurd' ? 'rgba(34,197,94,0.12)' : `${ORANGE}18`,
                    color: doc.status === 'goedgekeurd' ? '#22c55e' : ORANGE,
                  }}>
                    {doc.status === 'goedgekeurd' ? '✓ Goedgekeurd' : 'In behandeling'}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Vehicle info */}
          <div style={card}>
            <p style={sectionLabel}>Voertuiginformatie</p>
            <div style={infoGrid}>
              {infoItem('Type', vehicleInfo.type)}
              {infoItem('Merk', vehicleInfo.merk)}
              {infoItem('Model', vehicleInfo.model)}
              {infoItem('Kenteken', vehicleInfo.kenteken)}
              {infoItem('Verzekerd', vehicleInfo.verzekerd ? 'Ja' : 'Nee')}
            </div>
          </div>

          {/* Bank account */}
          <div style={card}>
            <p style={sectionLabel}>Bankgegevens</p>
            <div style={infoGrid}>
              {infoItem('IBAN', mockProfile.iban)}
              {infoItem('Uitbetalingsfrequentie', 'Tweewekelijks')}
            </div>
          </div>

          {/* Danger zone */}
          <div style={{ borderRadius: 20, border: '1px solid rgba(239,68,68,0.2)', padding: 'clamp(20px,4vw,32px)', background: 'rgba(239,68,68,0.03)', marginBottom: 24 }}>
            <p style={{ ...sectionLabel, color: '#ef4444' }}>Gevaarlijke zone</p>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
              <div>
                <p style={{ fontSize: 15, fontWeight: 700, margin: '0 0 4px' }}>Account verwijderen</p>
                <p style={{ fontSize: 14, color: 'var(--text-muted)', margin: 0 }}>
                  Verwijder je account en alle bijbehorende gegevens definitief.
                </p>
              </div>
              <button
                onClick={() => setShowDeleteConfirm(true)}
                style={{ background: 'rgba(239,68,68,0.1)', color: '#ef4444', border: '1px solid rgba(239,68,68,0.25)', borderRadius: 12, padding: '11px 24px', fontSize: 14, fontWeight: 700, cursor: 'pointer', flexShrink: 0 }}>
                Account verwijderen
              </button>
            </div>

            {showDeleteConfirm && (
              <div style={{ marginTop: 20, padding: '18px 20px', background: 'rgba(239,68,68,0.08)', borderRadius: 14, border: '1px solid rgba(239,68,68,0.3)' }}>
                <p style={{ fontSize: 15, fontWeight: 700, margin: '0 0 12px', color: '#ef4444' }}>
                  Weet je het zeker?
                </p>
                <p style={{ fontSize: 14, color: 'var(--text-secondary)', margin: '0 0 16px' }}>
                  Deze actie kan niet ongedaan worden gemaakt. Al je gegevens, verdiensten en diensten worden permanent verwijderd.
                </p>
                <div style={{ display: 'flex', gap: 10 }}>
                  <button style={{ background: 'rgba(239,68,68,0.15)', color: '#ef4444', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 10, padding: '10px 22px', fontSize: 14, fontWeight: 700, cursor: 'pointer' }}>
                    Ja, verwijder alles
                  </button>
                  <button onClick={() => setShowDeleteConfirm(false)} style={{ background: 'rgba(255,255,255,0.06)', color: 'var(--text-secondary)', border: '1px solid var(--border)', borderRadius: 10, padding: '10px 22px', fontSize: 14, fontWeight: 700, cursor: 'pointer' }}>
                    Annuleren
                  </button>
                </div>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
