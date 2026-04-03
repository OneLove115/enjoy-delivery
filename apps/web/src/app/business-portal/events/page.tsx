'use client';
import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';

const PURPLE = '#5A31F4';
const PINK = '#FF0080';
const ORANGE = '#FF6B00';

const API_URL = process.env.NEXT_PUBLIC_VP_DOMAIN || 'https://www.veloci.online';

interface Event {
  id: string | number;
  name?: string;
  eventName?: string;
  date?: string;
  eventDate?: string;
  persons?: number;
  guestCount?: number;
  location?: string;
  restaurantPreference?: string;
  budget?: number;
  budgetPerPerson?: number;
  isPast?: boolean;
}

const EMPTY_FORM = { name: '', date: '', persons: '', cuisine: '', budgetPP: '', notes: '' };

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

function getEventName(e: Event) { return e.name ?? e.eventName ?? ''; }
function getEventDate(e: Event) { return e.date ?? e.eventDate ?? ''; }
function getEventPersons(e: Event) { return e.persons ?? e.guestCount ?? 0; }
function getEventLocation(e: Event) { return e.location ?? e.restaurantPreference ?? ''; }
function getEventBudget(e: Event) {
  if (e.budget) return e.budget;
  if (e.budgetPerPerson && getEventPersons(e)) return e.budgetPerPerson * getEventPersons(e);
  return 0;
}

export default function EventsPage() {
  const router = useRouter();
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);

  const set = (key: string, val: string) => setForm(prev => ({ ...prev, [key]: val }));

  const fetchEvents = useCallback(() => {
    const token = localStorage.getItem('enjoy-business-token');
    if (!token) {
      router.replace('/business-portal');
      return;
    }

    fetch(`${API_URL}/api/business-portal/events`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(async res => {
        if (res.status === 401) {
          localStorage.removeItem('enjoy-business-token');
          router.replace('/business-portal');
          return;
        }
        if (!res.ok) throw new Error('Fout bij ophalen evenementen');
        return res.json();
      })
      .then(json => {
        if (json) setEvents(json.events ?? []);
      })
      .catch(err => setError(err.message || 'Netwerkfout'))
      .finally(() => setLoading(false));
  }, [router]);

  useEffect(() => { fetchEvents(); }, [fetchEvents]);

  const handleSubmit = async () => {
    if (!form.name || !form.date || !form.persons) {
      setSubmitError('Vul naam, datum en aantal personen in.');
      return;
    }
    setSubmitError('');
    setSubmitting(true);

    const token = localStorage.getItem('enjoy-business-token');
    try {
      const res = await fetch(`${API_URL}/api/business-portal/events`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          eventName: form.name,
          eventDate: form.date,
          guestCount: Number(form.persons),
          restaurantPreference: form.cuisine,
          budgetPerPerson: Number(form.budgetPP) || undefined,
          notes: form.notes,
        }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || err.error || 'Opslaan mislukt');
      }
      setForm(EMPTY_FORM);
      setShowForm(false);
      fetchEvents();
    } catch (err: any) {
      setSubmitError(err.message || 'Evenement opslaan mislukt');
    } finally {
      setSubmitting(false);
    }
  };

  const now = new Date();
  const upcoming = events.filter(e => {
    const d = new Date(getEventDate(e));
    return !isNaN(d.getTime()) ? d >= now : !e.isPast;
  });
  const past = events.filter(e => {
    const d = new Date(getEventDate(e));
    return !isNaN(d.getTime()) ? d < now : !!e.isPast;
  });

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

  const EventCard = ({ event, isUpcoming }: { event: Event; isUpcoming: boolean }) => {
    const budget = getEventBudget(event);
    const persons = getEventPersons(event);
    return (
      <div style={{
        background: 'var(--bg-card)', border: `1px solid ${isUpcoming ? PURPLE + '30' : 'var(--border)'}`,
        borderRadius: 18, padding: '22px 24px',
        borderLeft: isUpcoming ? `4px solid ${PURPLE}` : `4px solid rgba(255,255,255,0.1)`,
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 12 }}>
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
              <span style={{ fontSize: 20 }}>{isUpcoming ? '📅' : '✅'}</span>
              <h3 style={{ fontWeight: 800, fontSize: 16, margin: 0 }}>{getEventName(event)}</h3>
              {isUpcoming && (
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
                <span>📆</span> {getEventDate(event)}
              </span>
              {persons > 0 && (
                <span style={{ fontSize: 14, color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: 5 }}>
                  <span>👥</span> {persons} personen
                </span>
              )}
              {getEventLocation(event) && (
                <span style={{ fontSize: 14, color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: 5 }}>
                  <span>📍</span> {getEventLocation(event)}
                </span>
              )}
            </div>
          </div>
          {budget > 0 && (
            <div style={{ textAlign: 'right' }}>
              <p style={{ fontWeight: 950, fontSize: 20, margin: '0 0 4px', color: isUpcoming ? ORANGE : 'var(--text-secondary)' }}>
                €{budget.toLocaleString('nl-NL', { minimumFractionDigits: 2 })}
              </p>
              {persons > 0 && (
                <p style={{ color: 'var(--text-muted)', fontSize: 12, margin: 0 }}>
                  €{Math.round(budget / persons)} p.p.
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    );
  };

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
              onClick={() => { setShowForm(false); setSubmitError(''); }}
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

          {submitError && (
            <p style={{ color: '#ef4444', fontSize: 13, fontWeight: 600, marginTop: 12 }}>{submitError}</p>
          )}

          <div style={{ display: 'flex', gap: 10, marginTop: 20 }}>
            <button
              onClick={handleSubmit}
              disabled={submitting}
              style={{
                background: `linear-gradient(135deg,${PURPLE},${PINK})`,
                color: 'white', border: 'none', borderRadius: 12,
                padding: '13px 24px', cursor: submitting ? 'not-allowed' : 'pointer',
                fontSize: 15, fontWeight: 700, fontFamily: 'Outfit, sans-serif',
                boxShadow: `0 4px 14px ${PURPLE}35`,
                opacity: submitting ? 0.7 : 1,
              }}
            >
              {submitting ? 'Opslaan…' : 'Evenement opslaan'}
            </button>
            <button
              onClick={() => { setForm(EMPTY_FORM); setShowForm(false); setSubmitError(''); }}
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

      {loading ? (
        <Spinner />
      ) : error ? (
        <div style={{
          background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)',
          borderRadius: 16, padding: '20px 24px', color: '#ef4444', fontWeight: 600,
        }}>
          {error}
        </div>
      ) : events.length === 0 ? (
        <div style={{
          background: 'var(--bg-card)', border: '1px solid var(--border)',
          borderRadius: 18, padding: '48px 24px', textAlign: 'center', color: 'var(--text-muted)',
        }}>
          <p style={{ fontSize: 16, fontWeight: 700, marginBottom: 8 }}>Nog geen evenementen</p>
          <p style={{ fontSize: 14 }}>Plan je eerste teamlunch of bedrijfsevenement via de knop hierboven.</p>
        </div>
      ) : (
        <>
          {/* Upcoming events */}
          {upcoming.length > 0 && (
            <section style={{ marginBottom: 36 }}>
              <h2 style={{ fontSize: 17, fontWeight: 800, marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ width: 8, height: 8, borderRadius: '50%', background: `linear-gradient(135deg,${PURPLE},${PINK})`, display: 'inline-block' }} />
                Aankomende evenementen
              </h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {upcoming.map(e => <EventCard key={String(e.id)} event={e} isUpcoming />)}
              </div>
            </section>
          )}

          {/* Past events */}
          {past.length > 0 && (
            <section>
              <h2 style={{ fontSize: 17, fontWeight: 800, marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--border-strong)', display: 'inline-block' }} />
                Afgelopen evenementen
              </h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {past.map(e => <EventCard key={String(e.id)} event={e} isUpcoming={false} />)}
              </div>
            </section>
          )}
        </>
      )}
    </div>
  );
}
