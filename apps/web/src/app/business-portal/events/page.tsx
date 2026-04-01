'use client';
import { useState } from 'react';

const PURPLE = '#5A31F4';
const PINK = '#FF0080';
const ORANGE = '#FF6B00';

const UPCOMING = [
  { id: 1, name: 'Teamlunch vrijdag', date: '4 apr 2026', persons: 25, location: 'Thai Garden', budget: 375, cuisine: 'Thai' },
  { id: 2, name: 'Directiediner', date: '10 apr 2026', persons: 8, location: 'Restaurant De Kas', budget: 640, cuisine: 'Nederlands' },
  { id: 3, name: 'Borrel Q2 kickoff', date: '18 apr 2026', persons: 40, location: 'Burger Bar', budget: 520, cuisine: 'Internationaal' },
];

const PAST = [
  { id: 4, name: 'Paasontbijt', date: '31 mrt 2026', persons: 30, location: 'Royal Kitchen', budget: 450 },
  { id: 5, name: 'Teamlunch maart', date: '14 mrt 2026', persons: 22, location: 'Sushi Master', budget: 396 },
  { id: 6, name: 'Verjaardag CEO', date: '5 mrt 2026', persons: 15, location: 'Pizza Napoli', budget: 225 },
];

const EMPTY_FORM = { name: '', date: '', persons: '', cuisine: '', budgetPP: '', notes: '' };

export default function EventsPage() {
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);

  const set = (key: string, val: string) => setForm(prev => ({ ...prev, [key]: val }));

  const inputStyle: React.CSSProperties = {
    width: '100%', background: 'rgba(255,255,255,0.05)',
    border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10,
    padding: '12px 16px', color: 'var(--text-primary)',
    fontSize: 15, fontFamily: 'Outfit, sans-serif', outline: 'none',
    boxSizing: 'border-box',
  };

  const labelStyle: React.CSSProperties = {
    fontSize: 12, fontWeight: 700, color: 'var(--text-muted)',
    display: 'block', marginBottom: 6, textTransform: 'uppercase', letterSpacing: 0.5,
  };

  const EventCard = ({ event, upcoming }: { event: typeof UPCOMING[0] | typeof PAST[0]; upcoming: boolean }) => (
    <div style={{
      background: 'var(--bg-card)', border: `1px solid ${upcoming ? PURPLE + '30' : 'var(--border)'}`,
      borderRadius: 18, padding: '22px 24px',
      borderLeft: upcoming ? `4px solid ${PURPLE}` : `4px solid rgba(255,255,255,0.1)`,
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 12 }}>
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
            <span style={{ fontSize: 20 }}>{upcoming ? '📅' : '✅'}</span>
            <h3 style={{ fontWeight: 800, fontSize: 16, margin: 0 }}>{event.name}</h3>
            {upcoming && (
              <span style={{
                background: `rgba(90,49,244,0.15)`, color: PURPLE,
                padding: '3px 8px', borderRadius: 20, fontSize: 11, fontWeight: 700,
              }}>
                Aankomend
              </span>
            )}
          </div>
          <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap' }}>
            <span style={{ fontSize: 14, color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: 5 }}>
              <span>📆</span> {event.date}
            </span>
            <span style={{ fontSize: 14, color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: 5 }}>
              <span>👥</span> {event.persons} personen
            </span>
            <span style={{ fontSize: 14, color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: 5 }}>
              <span>📍</span> {event.location}
            </span>
          </div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <p style={{ fontWeight: 950, fontSize: 20, margin: '0 0 4px', color: upcoming ? ORANGE : 'var(--text-secondary)' }}>
            €{event.budget.toLocaleString('nl-NL', { minimumFractionDigits: 2 })}
          </p>
          <p style={{ color: 'var(--text-muted)', fontSize: 12, margin: 0 }}>
            €{Math.round(event.budget / event.persons)} p.p.
          </p>
        </div>
      </div>
    </div>
  );

  return (
    <div style={{ padding: 'clamp(20px,3vw,40px)', maxWidth: 900, margin: '0 auto' }}>

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 28, flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h1 style={{ fontSize: 'clamp(22px,4vw,30px)', fontWeight: 950, letterSpacing: -0.5, margin: '0 0 6px' }}>
            Evenementen
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: 14, margin: 0 }}>
            Plan en beheer zakelijke maaltijdevenementen
          </p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          style={{
            background: `linear-gradient(135deg,${PURPLE},${PINK})`,
            color: 'white', border: 'none', borderRadius: 12,
            padding: '12px 20px', cursor: 'pointer',
            fontSize: 14, fontWeight: 700, fontFamily: 'Outfit, sans-serif',
            boxShadow: `0 4px 14px ${PURPLE}35`,
          }}
        >
          + Nieuw evenement plannen
        </button>
      </div>

      {/* New event form */}
      {showForm && (
        <div style={{
          background: 'var(--bg-card)', border: `1px solid ${PURPLE}30`,
          borderRadius: 20, padding: 'clamp(20px,3vw,32px)', marginBottom: 28,
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
            <h2 style={{ fontSize: 17, fontWeight: 800, margin: 0 }}>Nieuw evenement plannen</h2>
            <button
              onClick={() => setShowForm(false)}
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', fontSize: 22 }}
            >
              ✕
            </button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(220px,1fr))', gap: 16 }}>
            <div>
              <label style={labelStyle}>Evenement naam *</label>
              <input value={form.name} onChange={e => set('name', e.target.value)} placeholder="Teamlunch mei" style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>Datum *</label>
              <input type="date" value={form.date} onChange={e => set('date', e.target.value)} style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>Aantal personen *</label>
              <input type="number" value={form.persons} onChange={e => set('persons', e.target.value)} placeholder="20" style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>Restaurant / keukenvoorkeur</label>
              <input value={form.cuisine} onChange={e => set('cuisine', e.target.value)} placeholder="Bijv. Italiaans, Japans…" style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>Budget per persoon (€)</label>
              <input type="number" value={form.budgetPP} onChange={e => set('budgetPP', e.target.value)} placeholder="25" style={inputStyle} />
            </div>
          </div>

          <div style={{ marginTop: 16 }}>
            <label style={labelStyle}>Notities</label>
            <textarea
              value={form.notes} onChange={e => set('notes', e.target.value)}
              placeholder="Bijzonderheden, dieetwensen, etc."
              rows={3}
              style={{ ...inputStyle, resize: 'vertical' }}
            />
          </div>

          <div style={{ display: 'flex', gap: 10, marginTop: 20 }}>
            <button
              style={{
                background: `linear-gradient(135deg,${PURPLE},${PINK})`,
                color: 'white', border: 'none', borderRadius: 12,
                padding: '13px 24px', cursor: 'pointer',
                fontSize: 15, fontWeight: 700, fontFamily: 'Outfit, sans-serif',
                boxShadow: `0 4px 14px ${PURPLE}35`,
              }}
              onClick={() => setShowForm(false)}
            >
              Evenement opslaan
            </button>
            <button
              onClick={() => { setForm(EMPTY_FORM); setShowForm(false); }}
              style={{
                background: 'transparent', border: '1px solid var(--border)',
                color: 'var(--text-secondary)', borderRadius: 12,
                padding: '13px 20px', cursor: 'pointer',
                fontSize: 15, fontWeight: 600, fontFamily: 'Outfit, sans-serif',
              }}
            >
              Annuleren
            </button>
          </div>
        </div>
      )}

      {/* Upcoming events */}
      <section style={{ marginBottom: 36 }}>
        <h2 style={{ fontSize: 17, fontWeight: 800, marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ width: 8, height: 8, borderRadius: '50%', background: `linear-gradient(135deg,${PURPLE},${PINK})`, display: 'inline-block' }} />
          Aankomende evenementen
        </h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {UPCOMING.map(e => <EventCard key={e.id} event={e} upcoming />)}
        </div>
      </section>

      {/* Past events */}
      <section>
        <h2 style={{ fontSize: 17, fontWeight: 800, marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--border-strong)', display: 'inline-block' }} />
          Afgelopen evenementen
        </h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {PAST.map(e => <EventCard key={e.id} event={e} upcoming={false} />)}
        </div>
      </section>
    </div>
  );
}
