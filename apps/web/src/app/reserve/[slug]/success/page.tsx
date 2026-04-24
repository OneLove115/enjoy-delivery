'use client';
import { useEffect, useRef } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Suspense } from 'react';

const PURPLE = '#5A31F4';
const PINK   = '#FF0080';
const ORANGE = '#FF6B35';

const DAY_LABELS: Record<string, string> = {
  0: 'zondag', 1: 'maandag', 2: 'dinsdag', 3: 'woensdag',
  4: 'donderdag', 5: 'vrijdag', 6: 'zaterdag',
};

const MONTH_LABELS: Record<string, string> = {
  0: 'januari', 1: 'februari', 2: 'maart', 3: 'april',
  4: 'mei', 5: 'juni', 6: 'juli', 7: 'augustus',
  8: 'september', 9: 'oktober', 10: 'november', 11: 'december',
};

function formatDate(dateStr: string): string {
  const d = new Date(dateStr + 'T12:00:00');
  const dayName   = DAY_LABELS[d.getDay()];
  const dayNum    = d.getDate();
  const monthName = MONTH_LABELS[d.getMonth()];
  const year      = d.getFullYear();
  return `${dayName} ${dayNum} ${monthName} ${year}`;
}

/** Animated SVG checkmark */
function Checkmark() {
  return (
    <motion.div
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ type: 'spring', stiffness: 260, damping: 20, delay: 0.1 }}
      style={{
        width: 88, height: 88, borderRadius: '50%',
        background: `linear-gradient(135deg,${PURPLE},${PINK})`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        boxShadow: `0 0 0 12px rgba(90,49,244,0.12), 0 16px 40px rgba(90,49,244,0.4)`,
        margin: '0 auto 28px',
        flexShrink: 0,
      }}
    >
      <motion.svg
        width="42" height="42" viewBox="0 0 42 42" fill="none"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 1 }}
        transition={{ delay: 0.35, duration: 0.55, ease: 'easeOut' }}
      >
        <motion.path
          d="M8 21L17 30L34 13"
          stroke="white"
          strokeWidth="3.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ delay: 0.35, duration: 0.55, ease: 'easeOut' }}
        />
      </motion.svg>
    </motion.div>
  );
}

/** Build an ICS data-URL for "Add to Calendar" — no external deps */
function buildIcsDataUrl(opts: {
  title: string;
  startIso: string; // e.g. "2025-06-15T19:30:00"
  durationMinutes: number;
  description: string;
  uid: string;
}): string {
  const pad = (n: number) => String(n).padStart(2, '0');
  const toIcsDate = (iso: string) => {
    const d = new Date(iso);
    return (
      `${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}` +
      `T${pad(d.getHours())}${pad(d.getMinutes())}00`
    );
  };
  const dtStart = toIcsDate(opts.startIso);
  const end = new Date(opts.startIso);
  end.setMinutes(end.getMinutes() + opts.durationMinutes);
  const dtEnd = toIcsDate(end.toISOString());
  const stamp = toIcsDate(new Date().toISOString());

  const ics = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//EnJoy//Reservation//NL',
    'BEGIN:VEVENT',
    `UID:${opts.uid}@enjoy.veloci.online`,
    `DTSTAMP:${stamp}`,
    `DTSTART:${dtStart}`,
    `DTEND:${dtEnd}`,
    `SUMMARY:${opts.title}`,
    `DESCRIPTION:${opts.description}`,
    'END:VEVENT',
    'END:VCALENDAR',
  ].join('\r\n');

  return `data:text/calendar;charset=utf-8,${encodeURIComponent(ics)}`;
}

type SlugParams = { slug: string };

function SuccessContent({ slug }: SlugParams) {
  const searchParams  = useSearchParams();
  const id            = searchParams.get('id') || '';
  const date          = searchParams.get('date') || '';
  const time          = searchParams.get('time') || '';
  const party         = searchParams.get('party') || '2';
  const depositPaid   = parseFloat(searchParams.get('deposit') || '0');
  const confettiRef   = useRef<HTMLDivElement>(null);

  const icsHref = date && time
    ? buildIcsDataUrl({
        title: `Reservering via EnJoy`,
        startIso: `${date}T${time}:00`,
        durationMinutes: 90,
        description: `${party} personen. Ref: ${id ? id.slice(0, 8).toUpperCase() : 'n/a'}`,
        uid: id || `${date}-${time}`,
      })
    : null;

  // Simple confetti burst on mount using CSS
  useEffect(() => {
    // Trigger a quick confetti-ish glow effect via class toggle
    const el = confettiRef.current;
    if (el) {
      el.classList.add('burst');
      setTimeout(() => el.classList.remove('burst'), 800);
    }
  }, []);

  const details = [
    { icon: '📅', label: 'Datum', value: date ? formatDate(date) : '—' },
    { icon: '🕐', label: 'Tijd',  value: time || '—' },
    {
      icon: '👥',
      label: 'Personen',
      value: `${party} ${parseInt(party) === 1 ? 'persoon' : 'personen'}`,
    },
    ...(id ? [{ icon: '🎫', label: 'Referentie', value: id.slice(0, 8).toUpperCase() }] : []),
    ...(depositPaid > 0 ? [{
      icon: '💳',
      label: 'Aanbetaling',
      value: new Intl.NumberFormat('nl-NL', { style: 'currency', currency: 'EUR' }).format(depositPaid),
    }] : []),
  ];

  return (
    <div style={{ background: 'var(--bg-page)', minHeight: '100vh', color: 'var(--text-primary)', fontFamily: 'Outfit, sans-serif' }}>
      <style>{`
        @keyframes pulseGlow {
          0%, 100% { box-shadow: 0 0 0 0 rgba(90,49,244,0.4); }
          50% { box-shadow: 0 0 0 20px rgba(90,49,244,0); }
        }
        .burst { animation: pulseGlow 0.7s ease-out; }
      `}</style>

      {/* Nav */}
      <nav style={{
        height: 60,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 20px',
        background: 'var(--bg-nav)',
        borderBottom: '1px solid var(--border)',
      }}>
        <div style={{ width: 60 }} />
        <Link href="/" style={{ textDecoration: 'none' }}>
          <div style={{ width: 40, height: 40, borderRadius: '50%', overflow: 'hidden', flexShrink: 0 }}>
            <img src="/logo-enjoy.png" alt="EnJoy" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>
        </Link>
        <div style={{ width: 60 }} />
      </nav>

      <div style={{ maxWidth: 480, margin: '0 auto', padding: '60px 20px 80px', textAlign: 'center' }}>

        {/* Checkmark */}
        <div ref={confettiRef}>
          <Checkmark />
        </div>

        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.4 }}
        >
          <h1 style={{ fontSize: 28, fontWeight: 900, marginBottom: 8 }}>
            Reservering bevestigd!
          </h1>
          <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.55)', marginBottom: 36, lineHeight: 1.6 }}>
            Je ontvangt een bevestiging per e-mail. Tot dan!
          </p>
        </motion.div>

        {/* Reservation details card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.4 }}
          style={{
            background: 'var(--bg-card)',
            borderRadius: 20,
            border: '1px solid rgba(255,255,255,0.07)',
            overflow: 'hidden',
            marginBottom: 24,
            textAlign: 'left',
          }}
        >
          <div style={{ padding: '20px 24px 0', fontSize: 11, fontWeight: 800, color: PURPLE, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            Jouw reservering
          </div>
          <div style={{ padding: '16px 24px 24px', display: 'flex', flexDirection: 'column', gap: 0 }}>
            {details.map((row, i) => (
              <div
                key={row.label}
                style={{
                  display: 'flex', alignItems: 'center', gap: 14,
                  padding: '13px 0',
                  borderBottom: i < details.length - 1 ? '1px solid rgba(255,255,255,0.06)' : 'none',
                }}
              >
                <div style={{ width: 36, height: 36, borderRadius: 10, background: 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, flexShrink: 0 }}>
                  {row.icon}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 2 }}>
                    {row.label}
                  </div>
                  <div style={{ fontSize: 14, fontWeight: 700 }}>{row.value}</div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Email confirmation note */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.75 }}
          style={{
            padding: '16px 20px',
            borderRadius: 14,
            background: `linear-gradient(135deg, rgba(90,49,244,0.10), rgba(255,0,128,0.06))`,
            border: '1px solid rgba(90,49,244,0.20)',
            marginBottom: 32,
            display: 'flex', alignItems: 'center', gap: 12,
            textAlign: 'left',
          }}
        >
          <span style={{ fontSize: 22, flexShrink: 0 }}>✉️</span>
          <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.65)', lineHeight: 1.5 }}>
            Je ontvangt een bevestiging per e-mail met alle details van je reservering.
          </span>
        </motion.div>

        {/* CTA buttons */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.85 }}
          style={{ display: 'flex', flexDirection: 'column', gap: 12 }}
        >
          <Link
            href={`/menu/${slug}`}
            style={{
              display: 'block', padding: '15px',
              background: `linear-gradient(135deg,${PURPLE},${PINK})`,
              borderRadius: 14, color: 'white', fontSize: 15, fontWeight: 900,
              textDecoration: 'none', textAlign: 'center',
              boxShadow: '0 8px 24px rgba(90,49,244,0.35)',
            }}
          >
            Terug naar het menu
          </Link>
          {icsHref && (
            <a
              href={icsHref}
              download={`reservering-${id ? id.slice(0, 8).toLowerCase() : 'enjoy'}.ics`}
              style={{
                display: 'block', padding: '15px',
                background: 'rgba(255,255,255,0.06)',
                border: '1px solid rgba(255,255,255,0.10)',
                borderRadius: 14, color: 'rgba(255,255,255,0.75)', fontSize: 15, fontWeight: 700,
                textDecoration: 'none', textAlign: 'center',
              }}
            >
              Toevoegen aan agenda
            </a>
          )}
          <Link
            href="/discover"
            style={{
              display: 'block', padding: '15px',
              background: 'rgba(255,255,255,0.06)',
              border: '1px solid rgba(255,255,255,0.10)',
              borderRadius: 14, color: 'rgba(255,255,255,0.7)', fontSize: 15, fontWeight: 700,
              textDecoration: 'none', textAlign: 'center',
            }}
          >
            Andere restaurants ontdekken
          </Link>
          <Link
            href="/account/reservations"
            style={{
              display: 'block', padding: '13px',
              color: 'rgba(255,255,255,0.4)', fontSize: 14, fontWeight: 600,
              textDecoration: 'none', textAlign: 'center',
            }}
          >
            Mijn reserveringen bekijken →
          </Link>
        </motion.div>
      </div>
    </div>
  );
}

export default async function ReserveSuccessPage({ params }: { params: Promise<SlugParams> }) {
  const { slug } = await params;
  return (
    <Suspense fallback={
      <div style={{ background: 'var(--bg-page)', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ width: 44, height: 44, borderRadius: '50%', border: `3px solid ${PURPLE}`, borderTopColor: 'transparent', animation: 'spin 0.8s linear infinite' }} />
        <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
      </div>
    }>
      <SuccessContent slug={slug} />
    </Suspense>
  );
}
