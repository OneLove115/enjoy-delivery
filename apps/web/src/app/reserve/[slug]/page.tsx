'use client';
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';

const PURPLE = '#5A31F4';
const PINK   = '#FF0080';
const ORANGE = '#FF6B35';
const VP_API = process.env.NEXT_PUBLIC_VP_DOMAIN || 'https://www.veloci.online';

type BusinessHours = {
  [day: string]: { open: string; close: string; closed: boolean };
};

type Restaurant = {
  id: string;
  name: string;
  slug: string;
  logo: string | null;
  heroImage: string | null;
  primaryColor: string | null;
  address: string | null;
  businessHours: BusinessHours | null;
  timezone: string;
  reservationsEnabled?: boolean;
  depositRequired?: boolean;
  depositAmount?: number;
};

const OCCASIONS = [
  { value: '', label: 'Geen' },
  { value: 'birthday', label: 'Verjaardag' },
  { value: 'anniversary', label: 'Jubileum' },
  { value: 'business', label: 'Zakelijk' },
  { value: 'other', label: 'Overig' },
];

const DAY_MAP: Record<string, number> = {
  sunday: 0, monday: 1, tuesday: 2, wednesday: 3,
  thursday: 4, friday: 5, saturday: 6,
};

/** Generate 30-minute time slots between two "HH:MM" strings */
function buildTimeSlots(open: string, close: string): string[] {
  const slots: string[] = [];
  const [oh, om] = open.split(':').map(Number);
  const [ch, cm] = close.split(':').map(Number);
  let cur = oh * 60 + om;
  const end = ch * 60 + cm;
  while (cur < end) {
    const h = String(Math.floor(cur / 60)).padStart(2, '0');
    const m = String(cur % 60).padStart(2, '0');
    slots.push(`${h}:${m}`);
    cur += 30;
  }
  return slots;
}

/** Return today's date string as YYYY-MM-DD */
function todayStr(): string {
  const d = new Date();
  return d.toISOString().split('T')[0];
}

/** Return day-of-week key for a YYYY-MM-DD string */
function dayKey(dateStr: string): string {
  const days = ['sunday','monday','tuesday','wednesday','thursday','friday','saturday'];
  return days[new Date(dateStr + 'T12:00:00').getDay()];
}

const PAGE_BG   = '#0A0A0F';
const CARD_BG   = '#13131a';
const INPUT_BG  = 'rgba(255,255,255,0.06)';
const BORDER    = 'rgba(255,255,255,0.10)';

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '14px 16px',
  borderRadius: 12,
  border: `1px solid ${BORDER}`,
  background: INPUT_BG,
  color: '#ffffff',
  fontSize: 15,
  fontFamily: 'Outfit, sans-serif',
  outline: 'none',
  boxSizing: 'border-box',
  transition: 'border-color 0.2s',
};

const labelStyle: React.CSSProperties = {
  fontSize: 12,
  fontWeight: 700,
  color: 'rgba(255,255,255,0.55)',
  textTransform: 'uppercase',
  letterSpacing: '0.06em',
  marginBottom: 6,
  display: 'block',
};

const fieldStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
};

export default function ReservePage() {
  const params  = useParams();
  const router  = useRouter();
  const slug    = typeof params?.slug === 'string' ? params.slug
    : Array.isArray(params?.slug) ? params.slug[0] : '';

  const [restaurant, setRestaurant]   = useState<Restaurant | null>(null);
  const [loading, setLoading]         = useState(true);
  const [submitting, setSubmitting]   = useState(false);
  const [error, setError]             = useState<string | null>(null);

  // Form fields
  const [date, setDate]           = useState('');
  const [time, setTime]           = useState('');
  const [partySize, setPartySize] = useState(2);
  const [name, setName]           = useState('');
  const [email, setEmail]         = useState('');
  const [phone, setPhone]         = useState('');
  const [notes, setNotes]         = useState('');
  const [occasion, setOccasion]   = useState('');

  useEffect(() => {
    if (!slug) return;
    fetch('/api/restaurants')
      .then(r => r.json())
      .then(data => {
        const found = (data.restaurants || []).find((r: Restaurant) => r.slug === slug) || null;
        setRestaurant(found);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [slug]);

  // Build time slots for the selected date
  const timeSlots: string[] = (() => {
    if (!date || !restaurant?.businessHours) return [];
    const key  = dayKey(date);
    const hours = restaurant.businessHours[key];
    if (!hours || hours.closed) return [];
    return buildTimeSlots(hours.open, hours.close);
  })();

  // Reset time when date changes if previous time is no longer valid
  useEffect(() => {
    if (time && !timeSlots.includes(time)) setTime('');
  }, [date, timeSlots, time]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!restaurant) return;
    if (!date || !time || !name || !email) {
      setError('Vul alle verplichte velden in.');
      return;
    }
    setError(null);
    setSubmitting(true);
    try {
      const res = await fetch('/api/consumer/reservations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tenantId: restaurant.id,
          reservationDate: `${date}T${time}:00`,
          partySize,
          customerName: name,
          customerEmail: email,
          customerPhone: phone,
          notes,
          occasion,
          source: 'enjoy',
        }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body?.error || body?.message || 'Er ging iets mis. Probeer opnieuw.');
      }
      const data = await res.json();
      const reservationId = data?.reservation?.id || data?.id || '';
      const depositPaid = data?.reservation?.deposit_amount || 0;
      router.push(`/reserve/${slug}/success?id=${reservationId}&date=${encodeURIComponent(date)}&time=${encodeURIComponent(time)}&party=${partySize}&deposit=${depositPaid}`);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Er ging iets mis. Probeer opnieuw.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div style={{ background: PAGE_BG, minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Outfit, sans-serif' }}>
        <div style={{ width: 44, height: 44, borderRadius: '50%', border: `3px solid ${PURPLE}`, borderTopColor: 'transparent', animation: 'spin 0.8s linear infinite' }} />
        <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
      </div>
    );
  }

  if (!restaurant) {
    return (
      <div style={{ background: PAGE_BG, minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 16, fontFamily: 'Outfit, sans-serif', color: '#ffffff' }}>
        <div style={{ fontSize: 48 }}>😕</div>
        <div style={{ fontSize: 20, fontWeight: 800 }}>Restaurant niet gevonden</div>
        <Link href="/discover" style={{ background: `linear-gradient(135deg,${PURPLE},${PINK})`, color: 'white', padding: '10px 24px', borderRadius: 12, fontWeight: 800, textDecoration: 'none' }}>
          Terug naar overzicht
        </Link>
      </div>
    );
  }

  const accent   = restaurant.primaryColor || PURPLE;
  const initials = restaurant.name.split(' ').map((w: string) => w[0]).join('').slice(0, 2).toUpperCase();
  const deposit  = restaurant.depositRequired ? (restaurant.depositAmount || 0) : 0;

  return (
    <div style={{ background: PAGE_BG, minHeight: '100vh', color: '#ffffff', fontFamily: 'Outfit, sans-serif' }}>
      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        input[type="date"]::-webkit-calendar-picker-indicator { filter: invert(0.6); cursor: pointer; }
        select option { background: #1a1a2e !important; color: white !important; }
        input:focus, select:focus, textarea:focus { border-color: ${PURPLE} !important; }
        input[type="date"] { color-scheme: dark; }
      `}</style>

      {/* Nav */}
      <nav style={{
        height: 60,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 20px',
        background: 'rgba(10,10,15,0.92)',
        borderBottom: '1px solid rgba(255,255,255,0.08)',
        position: 'sticky', top: 0, zIndex: 100,
        backdropFilter: 'blur(12px)',
      }}>
        <Link href={`/menu/${slug}`} style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'rgba(255,255,255,0.55)', fontWeight: 700, fontSize: 14, textDecoration: 'none' }}>
          <span>←</span><span>Menu</span>
        </Link>
        <Link href="/" style={{ textDecoration: 'none' }}>
          <img src="/logo-enjoy.png" alt="EnJoy" style={{ height: 40 }} />
        </Link>
        <div style={{ width: 60 }} />
      </nav>

      <div style={{ maxWidth: 560, margin: '0 auto', padding: '40px 20px 80px' }}>

        {/* Restaurant header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 32 }}
        >
          <div style={{
            width: 64, height: 64, borderRadius: 16, flexShrink: 0, overflow: 'hidden',
            background: `linear-gradient(135deg,${accent},${PINK})`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: `0 8px 24px rgba(90,49,244,0.25)`,
          }}>
            {restaurant.logo
              ? <img src={restaurant.logo} alt={restaurant.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              : <span style={{ fontSize: 22, fontWeight: 900, color: 'white' }}>{initials}</span>
            }
          </div>
          <div>
            <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)', fontWeight: 600, marginBottom: 4 }}>Reservering bij</div>
            <h1 style={{ fontSize: 24, fontWeight: 900, lineHeight: 1.1 }}>{restaurant.name}</h1>
          </div>
        </motion.div>

        {/* Form card */}
        <motion.form
          onSubmit={handleSubmit}
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.08 }}
          style={{
            background: CARD_BG,
            borderRadius: 24,
            border: '1px solid rgba(255,255,255,0.09)',
            overflow: 'hidden',
            boxShadow: '0 24px 64px rgba(0,0,0,0.5)',
          }}
        >
          {/* Date & Time */}
          <div style={{ padding: '28px 28px 0' }}>
            <div style={{ fontSize: 11, fontWeight: 800, color: PURPLE, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 18 }}>
              Wanneer
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 20 }}>
              <div style={fieldStyle}>
                <label style={labelStyle}>Datum *</label>
                <input
                  type="date"
                  required
                  value={date}
                  min={todayStr()}
                  onChange={e => setDate(e.target.value)}
                  style={inputStyle}
                />
              </div>
              <div style={fieldStyle}>
                <label style={labelStyle}>Tijd *</label>
                <select
                  required
                  value={time}
                  onChange={e => setTime(e.target.value)}
                  disabled={!date || timeSlots.length === 0}
                  style={{ ...inputStyle, cursor: !date || timeSlots.length === 0 ? 'not-allowed' : 'pointer', opacity: !date || timeSlots.length === 0 ? 0.5 : 1 }}
                >
                  <option value="">
                    {!date ? 'Kies datum eerst' : timeSlots.length === 0 ? 'Gesloten' : 'Kies tijd'}
                  </option>
                  {timeSlots.map(slot => (
                    <option key={slot} value={slot}>{slot}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Party size */}
            <div style={{ marginBottom: 20 }}>
              <label style={labelStyle}>Aantal personen *</label>
              <div style={{ display: 'flex', alignItems: 'center', gap: 0, background: INPUT_BG, borderRadius: 12, border: `1px solid ${BORDER}`, overflow: 'hidden' }}>
                <button
                  type="button"
                  onClick={() => setPartySize(p => Math.max(1, p - 1))}
                  style={{ width: 48, height: 48, border: 'none', background: 'transparent', color: '#ffffff', fontSize: 22, fontWeight: 900, cursor: 'pointer', flexShrink: 0 }}
                >
                  −
                </button>
                <span style={{ flex: 1, textAlign: 'center', fontSize: 18, fontWeight: 900, color: '#ffffff' }}>{partySize}</span>
                <button
                  type="button"
                  onClick={() => setPartySize(p => Math.min(12, p + 1))}
                  style={{ width: 48, height: 48, border: 'none', background: 'transparent', color: '#ffffff', fontSize: 22, fontWeight: 900, cursor: 'pointer', flexShrink: 0 }}
                >
                  +
                </button>
              </div>
              <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.35)', marginTop: 6 }}>1 – 12 personen</div>
            </div>

            {/* Occasion */}
            <div style={{ marginBottom: 28 }}>
              <label style={labelStyle}>Gelegenheid</label>
              <select
                value={occasion}
                onChange={e => setOccasion(e.target.value)}
                style={{ ...inputStyle, cursor: 'pointer' }}
              >
                {OCCASIONS.map(o => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Divider */}
          <div style={{ height: 1, background: 'rgba(255,255,255,0.06)' }} />

          {/* Contact details */}
          <div style={{ padding: '28px 28px 0' }}>
            <div style={{ fontSize: 11, fontWeight: 800, color: PINK, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 18 }}>
              Jouw gegevens
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div style={fieldStyle}>
                <label style={labelStyle}>Naam *</label>
                <input
                  type="text"
                  required
                  placeholder="Voor- en achternaam"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  style={inputStyle}
                />
              </div>
              <div style={fieldStyle}>
                <label style={labelStyle}>E-mailadres *</label>
                <input
                  type="email"
                  required
                  placeholder="jouw@email.nl"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  style={inputStyle}
                />
              </div>
              <div style={fieldStyle}>
                <label style={labelStyle}>Telefoonnummer</label>
                <input
                  type="tel"
                  placeholder="+31 6 12345678"
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  style={inputStyle}
                />
              </div>
              <div style={{ ...fieldStyle, marginBottom: 28 }}>
                <label style={labelStyle}>Bijzondere wensen</label>
                <textarea
                  rows={3}
                  placeholder="Allergieën, speciale verzoeken, ..."
                  value={notes}
                  onChange={e => setNotes(e.target.value)}
                  style={{ ...inputStyle, resize: 'vertical', minHeight: 80, lineHeight: 1.5 }}
                />
              </div>
            </div>
          </div>

          {/* Deposit notice */}
          {deposit > 0 && (
            <>
              <div style={{ height: 1, background: 'rgba(255,255,255,0.06)' }} />
              <div style={{ padding: '22px 28px', background: `rgba(255,107,53,0.06)` }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ width: 40, height: 40, borderRadius: 10, background: `rgba(255,107,53,0.15)`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, flexShrink: 0 }}>
                    💳
                  </div>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 800, marginBottom: 2 }}>Aanbetaling vereist</div>
                    <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.55)' }}>
                      Voor deze reservering is een aanbetaling van{' '}
                      <span style={{ color: ORANGE, fontWeight: 800 }}>
                        {new Intl.NumberFormat('nl-NL', { style: 'currency', currency: 'EUR' }).format(deposit)}
                      </span>
                      {' '}vereist. Je wordt doorgestuurd naar de betaalpagina na het bevestigen.
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* Error */}
          {error && (
            <div style={{ margin: '0 28px 16px', padding: '12px 16px', borderRadius: 10, background: 'rgba(239,68,68,0.10)', border: '1px solid rgba(239,68,68,0.25)', fontSize: 13, color: '#EF4444' }}>
              {error}
            </div>
          )}

          {/* Submit */}
          <div style={{ padding: '0 28px 28px' }}>
            <motion.button
              type="submit"
              disabled={submitting}
              whileHover={!submitting ? { scale: 1.02 } : undefined}
              whileTap={!submitting ? { scale: 0.98 } : undefined}
              style={{
                width: '100%',
                padding: '16px',
                borderRadius: 14,
                border: 'none',
                background: submitting
                  ? 'rgba(255,255,255,0.10)'
                  : `linear-gradient(135deg,${PURPLE},${PINK})`,
                color: 'white',
                fontSize: 16,
                fontWeight: 900,
                cursor: submitting ? 'not-allowed' : 'pointer',
                boxShadow: submitting ? 'none' : '0 8px 24px rgba(90,49,244,0.35)',
                transition: 'background 0.2s, box-shadow 0.2s',
                fontFamily: 'Outfit, sans-serif',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
              }}
            >
              {submitting ? (
                <>
                  <div style={{ width: 18, height: 18, borderRadius: '50%', border: '2px solid rgba(255,255,255,0.3)', borderTopColor: 'white', animation: 'spin 0.7s linear infinite' }} />
                  Even geduld...
                </>
              ) : (
                deposit > 0 ? 'Reserveer en betaal' : 'Reserveer een tafel'
              )}
            </motion.button>
          </div>
        </motion.form>

        {/* Footer note */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          style={{ textAlign: 'center', fontSize: 12, color: 'rgba(255,255,255,0.35)', marginTop: 20, lineHeight: 1.6 }}
        >
          Je ontvangt een bevestiging per e-mail. Gratis annuleren tot 2 uur voor aanvang.
        </motion.p>
      </div>
    </div>
  );
}
