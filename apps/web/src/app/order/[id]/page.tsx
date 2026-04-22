'use client';
import { useEffect, useState, useRef } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { Nav } from '../../components/Nav';
import { useOrderStream, type OrderStatus } from '@/hooks/useOrderStream';

const PURPLE = '#5A31F4';
const PINK = '#FF0080';

type Order = {
  id: string;
  restaurantName: string;
  status: 'confirmed' | 'preparing' | 'ready' | 'on_the_way' | 'delivered' | 'cancelled';
  total: number;
  estimatedMinutes?: number;
  items: { name: string; quantity: number; price: number }[];
  rider?: { name: string };
  address: string;
};

const STAGES = [
  { key: 'confirmed',  label: 'Bedankt voor je bestelling', sub: 'We hebben je bestelling ontvangen en gaan ermee aan de slag.', icon: '✅' },
  { key: 'preparing',  label: 'Bereiden en bezorgen',       sub: 'Je bestelling wordt bereid in de keuken.', icon: '👨‍🍳' },
  { key: 'ready',      label: 'Klaar voor afhaal',          sub: 'Je bestelling staat klaar.', icon: '📦' },
  { key: 'on_the_way', label: 'Onderweg',                   sub: 'Je bezorger is onderweg.', icon: '🚲' },
  { key: 'delivered',  label: 'Bezorgd',                    sub: 'Eet smakelijk!', icon: '🎉' },
];

/* ── Shimmer keyframes (injected once) ── */
const shimmerCSS = `
@keyframes shimmer {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}
@keyframes pulse-glow {
  0%, 100% { box-shadow: 0 0 12px rgba(90,49,244,0.35); }
  50% { box-shadow: 0 0 24px rgba(90,49,244,0.7); }
}
@keyframes checkmark-draw {
  0% { stroke-dashoffset: 24; }
  100% { stroke-dashoffset: 0; }
}
`;

function ShimmerStyles() {
  return <style dangerouslySetInnerHTML={{ __html: shimmerCSS }} />;
}

/* ── Shimmer block helper ── */
function ShimmerBlock({ width, height, borderRadius = 12, style }: { width: string | number; height: string | number; borderRadius?: number; style?: React.CSSProperties }) {
  return (
    <div
      style={{
        width,
        height,
        borderRadius,
        background: 'linear-gradient(90deg, var(--bg-elevated) 25%, var(--border) 50%, var(--bg-elevated) 75%)',
        backgroundSize: '200% 100%',
        animation: 'shimmer 1.4s ease-in-out infinite',
        ...style,
      }}
    />
  );
}

/* ── Skeleton loading state ── */
function OrderSkeleton() {
  return (
    <div>
      {/* Back link skeleton */}
      <ShimmerBlock width={100} height={14} borderRadius={6} style={{ marginBottom: 28 }} />

      {/* Title skeleton */}
      <ShimmerBlock width="70%" height={32} borderRadius={8} style={{ marginBottom: 8 }} />
      <ShimmerBlock width="45%" height={20} borderRadius={6} style={{ marginBottom: 32 }} />

      {/* Progress tracker skeleton */}
      <div style={{ background: 'var(--bg-card)', borderRadius: 20, border: '1px solid var(--border)', padding: '32px 28px', marginBottom: 24 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          {[0, 1, 2, 3, 4].map(i => (
            <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
              <ShimmerBlock width={40} height={40} borderRadius={20} />
              <ShimmerBlock width={50} height={10} borderRadius={4} />
            </div>
          ))}
        </div>
      </div>

      {/* Map skeleton */}
      <div style={{ borderRadius: 20, overflow: 'hidden', border: '1px solid var(--border)', marginBottom: 24 }}>
        <ShimmerBlock width="100%" height={260} borderRadius={0} />
        <div style={{ padding: '12px 16px', background: 'var(--bg-card)', display: 'flex', alignItems: 'center', gap: 8 }}>
          <ShimmerBlock width={20} height={20} borderRadius={10} />
          <ShimmerBlock width="60%" height={13} borderRadius={4} />
        </div>
      </div>

      {/* Order items skeleton */}
      <div style={{ background: 'var(--bg-card)', borderRadius: 20, border: '1px solid var(--border)', padding: '24px 28px' }}>
        <ShimmerBlock width={140} height={20} borderRadius={6} style={{ marginBottom: 20 }} />
        {[0, 1, 2].map(i => (
          <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0', borderBottom: i < 2 ? '1px solid rgba(255,255,255,0.04)' : 'none' }}>
            <ShimmerBlock width="55%" height={14} borderRadius={4} />
            <ShimmerBlock width={60} height={14} borderRadius={4} />
          </div>
        ))}
        <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: 16, marginTop: 4 }}>
          <ShimmerBlock width={60} height={18} borderRadius={4} />
          <ShimmerBlock width={80} height={18} borderRadius={4} />
        </div>
      </div>
    </div>
  );
}

/* ── Checkmark SVG with draw animation ── */
function AnimatedCheckmark() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}>
      <path
        d="M5 13l4 4L19 7"
        stroke="white"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{
          strokeDasharray: 24,
          strokeDashoffset: 0,
          animation: 'checkmark-draw 0.4s ease-out forwards',
        }}
      />
    </svg>
  );
}

function NotificationBanner() {
  const [show, setShow] = useState(false);
  useEffect(() => {
    if ('Notification' in window && Notification.permission === 'default') setShow(true);
  }, []);
  if (!show) return null;
  return (
    <div style={{ background: 'rgba(90,49,244,0.12)', borderBottom: '1px solid rgba(90,49,244,0.2)', padding: '10px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
      <span style={{ fontSize: 14, color: 'var(--text-primary)' }}>🔔 Ontvang meldingen bij statusupdates</span>
      <button onClick={() => { Notification.requestPermission().then(() => setShow(false)); }}
        style={{ background: `linear-gradient(135deg,#5A31F4,#FF0080)`, color: 'white', border: 'none', borderRadius: 8, padding: '7px 16px', fontWeight: 700, fontSize: 13, cursor: 'pointer', flexShrink: 0 }}>
        Sta toe
      </button>
    </div>
  );
}

function MapView({ address }: { address: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<unknown>(null);
  const [geocoded, setGeocoded] = useState<[number, number] | null>(null);
  const [mapError, setMapError] = useState(false);
  const [mapLoaded, setMapLoaded] = useState(false);
  const token = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;

  // Geocode address using Nominatim (free, no key needed)
  useEffect(() => {
    if (!address) return;
    fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(address)}&format=json&limit=1`)
      .then(r => r.json())
      .then(data => {
        if (data[0]) setGeocoded([parseFloat(data[0].lon), parseFloat(data[0].lat)]);
      })
      .catch(() => setMapError(true));
  }, [address]);

  // Load Mapbox and render map
  useEffect(() => {
    if (!geocoded || !containerRef.current) return;
    if (!token) { setMapError(true); return; }

    // Load Mapbox GL JS CSS
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://api.mapbox.com/mapbox-gl-js/v3.3.0/mapbox-gl.css';
    document.head.appendChild(link);

    // Load Mapbox GL JS script
    const script = document.createElement('script');
    script.src = 'https://api.mapbox.com/mapbox-gl-js/v3.3.0/mapbox-gl.js';
    script.onload = () => {
      try {
        const mapboxgl = (window as unknown as { mapboxgl: { accessToken: string; Map: new(opts: unknown) => unknown; Marker: new() => { setLngLat: (c: [number, number]) => { addTo: (m: unknown) => unknown } } } }).mapboxgl;
        mapboxgl.accessToken = token!;
        const map = new mapboxgl.Map({
          container: containerRef.current!,
          style: 'mapbox://styles/mapbox/dark-v11',
          center: geocoded,
          zoom: 14,
        });
        new mapboxgl.Marker().setLngLat(geocoded).addTo(map);
        mapRef.current = map;
        setMapLoaded(true);
      } catch {
        setMapError(true);
      }
    };
    script.onerror = () => setMapError(true);
    document.head.appendChild(script);

    return () => {
      link.remove();
      // Note: mapbox map cleanup would go here in production
    };
  }, [geocoded, token]);

  if (!token) {
    return (
      <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 16, padding: '24px', textAlign: 'center', color: 'var(--text-muted)', fontSize: 14 }}>
        🗺️ Voeg <code>NEXT_PUBLIC_MAPBOX_TOKEN</code> toe aan je .env om de kaart te activeren.
      </div>
    );
  }

  if (mapError) {
    return (
      <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 16, padding: '24px', textAlign: 'center', color: 'var(--text-muted)', fontSize: 14 }}>
        📍 Bezorgadres: <strong style={{ color: 'var(--text-primary)' }}>{address}</strong>
      </div>
    );
  }

  return (
    <div style={{ borderRadius: 20, overflow: 'hidden', border: '1px solid var(--border)', marginBottom: 24, position: 'relative' }}>
      {/* Map loading skeleton behind the map */}
      {!mapLoaded && (
        <div style={{ position: 'absolute', inset: 0, zIndex: 1 }}>
          <ShimmerBlock width="100%" height={260} borderRadius={0} />
        </div>
      )}
      <div ref={containerRef} style={{ width: '100%', height: 260, position: 'relative', zIndex: mapLoaded ? 2 : 0 }} />
      <div style={{ padding: '12px 16px', background: 'var(--bg-card)', display: 'flex', alignItems: 'center', gap: 8, position: 'relative', zIndex: 3 }}>
        <span style={{ fontSize: 16 }}>📍</span>
        <span style={{ fontSize: 13, color: 'var(--text-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{address}</span>
      </div>
    </div>
  );
}

/* ── Stagger animation variants ── */
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.05,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] },
  },
};

/* ── Dutch status labels aligned with Veloci's OrderStatus enum ── */
const STATUS_LABELS: Record<string, string> = {
  pending_payment:  'Betaling in afwachting',
  confirmed:        'Bevestigd',
  preparing:        'In de keuken',
  ready_for_pickup: 'Klaar voor afhaal',
  out_for_delivery: 'Onderweg',
  delivered:        'Geleverd',
  cancelled:        'Geannuleerd',
};

/* Map Veloci's canonical OrderStatus to the visual STAGES array */
const STATUS_TO_STAGE: Record<string, string> = {
  pending_payment:  'confirmed',   // show as first step (pre-confirm)
  confirmed:        'confirmed',
  preparing:        'preparing',
  ready_for_pickup: 'ready',
  out_for_delivery: 'on_the_way',
  delivered:        'delivered',
  cancelled:        'delivered',   // render at end but show cancelled banner
};

const CANCEL_WINDOW_SECS = 120;

function canCancelOrder(streamStatus: string | null, orderCreatedAt?: string): boolean {
  if (!streamStatus || !['pending_payment', 'confirmed'].includes(streamStatus)) return false;
  if (!orderCreatedAt) return true;
  const age = (Date.now() - new Date(orderCreatedAt).getTime()) / 1000;
  return age < CANCEL_WINDOW_SECS;
}

/* ── Animated status badge (cross-fades on change) ── */
function StatusBadge({ status, reduced }: { status: string | null; reduced: boolean }) {
  const label = status ? (STATUS_LABELS[status] ?? status) : 'Laden...';
  return (
    <AnimatePresence mode="wait">
      <motion.span
        key={status ?? 'loading'}
        initial={reduced ? false : { opacity: 0, y: -6 }}
        animate={{ opacity: 1, y: 0 }}
        exit={reduced ? undefined : { opacity: 0, y: 6 }}
        transition={{ duration: 0.25 }}
        style={{
          display: 'inline-block',
          padding: '4px 12px',
          borderRadius: 99,
          background: status === 'cancelled'
            ? 'rgba(239,68,68,0.15)'
            : status === 'delivered'
              ? 'rgba(34,197,94,0.15)'
              : 'rgba(90,49,244,0.15)',
          color: status === 'cancelled' ? '#EF4444'
            : status === 'delivered' ? '#22C55E' : PURPLE,
          fontSize: 13,
          fontWeight: 800,
          letterSpacing: '0.03em',
        }}
      >
        {label}
      </motion.span>
    </AnimatePresence>
  );
}

export default function OrderTrackingPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const reduced = useReducedMotion() ?? false;

  /* ── Base order data (one-shot fetch) ── */
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState('');
  const [cancelling, setCancelling] = useState(false);
  const [cancelError, setCancelError] = useState('');

  /* ── Live status from SSE ── */
  const stream = useOrderStream(id ?? null);
  const prevStatusRef = useRef<string>('');

  useEffect(() => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, []);

  /* Initial order load */
  useEffect(() => {
    if (!id) return;
    fetch(`/api/consumer/orders/${id}`)
      .then(r => { if (!r.ok) { setFetchError('Bestelling niet gevonden'); return null; } return r.json(); })
      .then(d => { if (d) setOrder(d as Order); })
      .catch(() => setFetchError('Laden mislukt'))
      .finally(() => setLoading(false));
  }, [id]);

  /* Browser push notification on SSE status change */
  useEffect(() => {
    const newStatus = stream.status;
    if (!newStatus || newStatus === prevStatusRef.current) return;
    if ('Notification' in window && Notification.permission === 'granted') {
      const msg = STATUS_LABELS[newStatus] ?? `Status: ${newStatus}`;
      new Notification('EnJoy Bestelling', {
        body: msg,
        icon: '/icons/icon-192.png',
        tag: `order-${id}`,
      });
    }
    prevStatusRef.current = newStatus;
  }, [stream.status, id]);

  /* Merge live SSE status into the order object for progress tracker */
  const liveStatus = stream.status ?? (order?.status as OrderStatus | undefined) ?? null;
  const mappedStageKey = liveStatus ? (STATUS_TO_STAGE[liveStatus] ?? liveStatus) : null;
  const activeStage = mappedStageKey ? STAGES.findIndex(s => s.key === mappedStageKey) : -1;

  const handleCancel = async () => {
    if (!id) return;
    setCancelling(true);
    setCancelError('');
    try {
      const res = await fetch(`/api/consumer/orders/${id}`, { method: 'DELETE' });
      if (!res.ok) {
        const body = await res.json().catch(() => ({})) as { error?: string };
        throw new Error(body.error ?? 'Annuleren mislukt');
      }
      // Stream will push 'cancelled' status shortly; router stays
    } catch (err: unknown) {
      setCancelError(err instanceof Error ? err.message : 'Annuleren mislukt');
    } finally {
      setCancelling(false);
    }
  };

  const error = fetchError;

  return (
    <div style={{ background: 'var(--bg-page)', minHeight: '100vh', color: 'var(--text-primary)', fontFamily: 'Outfit, sans-serif' }}>
      <ShimmerStyles />
      <Nav />
      <NotificationBanner />
      <section style={{ padding: '100px 40px 60px', maxWidth: 720, margin: '0 auto' }}>
        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div
              key="skeleton"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <OrderSkeleton />
            </motion.div>
          ) : error ? (
            <motion.div
              key="error"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              style={{ textAlign: 'center', padding: '80px 0' }}
            >
              <p style={{ color: '#EF4444', marginBottom: 24 }}>{error}</p>
              <Link href="/account/orders" style={{ color: PURPLE, fontWeight: 700, textDecoration: 'none' }}>← Mijn bestellingen</Link>
            </motion.div>
          ) : order ? (
            <motion.div
              key="content"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              <motion.div variants={itemVariants}>
                <Link href="/account/orders" style={{ color: 'var(--text-muted)', fontSize: 14, textDecoration: 'none', display: 'block', marginBottom: 28 }}>← Mijn bestellingen</Link>
              </motion.div>

              <motion.div variants={itemVariants} style={{ marginBottom: 28 }}>
                <h1 style={{ fontSize: 32, fontWeight: 900, marginBottom: 8 }}>Bestelling bij {order.restaurantName}</h1>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <StatusBadge status={liveStatus} reduced={reduced} />
                  {stream.connected && (
                    <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)', fontWeight: 600 }}>Live</span>
                  )}
                </div>
                {order.estimatedMinutes && liveStatus !== 'delivered' && liveStatus !== 'cancelled' && (
                  <p style={{ fontSize: 16, color: PURPLE, fontWeight: 700, marginTop: 10 }}>Verwachte aankomsttijd: ~{order.estimatedMinutes} min</p>
                )}
              </motion.div>

              {/* Cancelled banner */}
              {liveStatus === 'cancelled' && (
                <motion.div
                  variants={itemVariants}
                  style={{ background: 'rgba(239,68,68,0.10)', border: '1px solid rgba(239,68,68,0.25)', borderRadius: 16, padding: '20px 24px', marginBottom: 24 }}
                >
                  <p style={{ fontWeight: 800, fontSize: 16, margin: '0 0 6px', color: '#EF4444' }}>Je bestelling is geannuleerd</p>
                  <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.55)', margin: 0 }}>Als je een betaling hebt gedaan, wordt het bedrag binnen 5–7 werkdagen teruggestort.</p>
                </motion.div>
              )}

              {/* Progress tracker */}
              <motion.div variants={itemVariants} style={{ background: 'var(--bg-card)', borderRadius: 20, border: '1px solid var(--border)', padding: '32px 28px', marginBottom: 24 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', position: 'relative' }}>
                  <div style={{ position: 'absolute', top: 20, left: '10%', right: '10%', height: 3, background: 'var(--b8)', borderRadius: 4 }} />
                  <motion.div
                    style={{ position: 'absolute', top: 20, left: '10%', height: 3, background: `linear-gradient(90deg,${PURPLE},${PINK})`, borderRadius: 4 }}
                    animate={{ width: `${Math.max(0, Math.min(activeStage / (STAGES.length - 1) * 80, 80))}%` }}
                    transition={reduced ? { duration: 0 } : { duration: 0.8, ease: 'easeOut' }}
                  />
                  {STAGES.map((s, i) => {
                    const isCompleted = i < activeStage;
                    const isActive = i === activeStage;
                    return (
                      <div key={s.key} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10, zIndex: 1 }}>
                        <div
                          style={{
                            width: 40,
                            height: 40,
                            minWidth: 44,
                            minHeight: 44,
                            borderRadius: '50%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: 18,
                            position: 'relative',
                            background: i <= activeStage ? `linear-gradient(135deg,${PURPLE},${PINK})` : 'rgba(255,255,255,0.06)',
                            transition: reduced ? 'none' : 'background 0.5s',
                            animation: isActive && !reduced ? 'pulse-glow 2s ease-in-out infinite' : 'none',
                            boxShadow: isActive ? `0 0 16px ${PURPLE}60` : 'none',
                          }}
                        >
                          {isCompleted ? <AnimatedCheckmark /> : s.icon}
                        </div>
                        <span style={{ fontSize: 11, color: i <= activeStage ? 'white' : 'rgba(255,255,255,0.25)', fontWeight: 700, textAlign: 'center', maxWidth: 70 }}>{s.label}</span>
                      </div>
                    );
                  })}
                </div>
              </motion.div>

              {/* Interactive map */}
              <motion.div variants={itemVariants}>
                <MapView address={order.address} />
              </motion.div>

              {/* Rider info */}
              {order.rider && (liveStatus === 'out_for_delivery' || order.status === 'on_the_way') && (
                <motion.div
                  variants={itemVariants}
                  style={{ background: `${PURPLE}10`, border: `1px solid ${PURPLE}30`, borderRadius: 16, padding: '20px 24px', marginBottom: 24, display: 'flex', alignItems: 'center', gap: 16 }}
                >
                  <div style={{ width: 48, height: 48, minWidth: 48, background: `linear-gradient(135deg,${PURPLE},${PINK})`, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22 }}>🚲</div>
                  <div>
                    <p style={{ fontWeight: 800, fontSize: 16, margin: 0 }}>{order.rider.name} is onderweg</p>
                    <p style={{ color: 'var(--text-muted)', fontSize: 14, margin: 0 }}>Bezorging naar {order.address}</p>
                  </div>
                </motion.div>
              )}

              {/* Cancel order button — visible within 120s window */}
              {canCancelOrder(liveStatus, undefined) && liveStatus !== 'cancelled' && (
                <motion.div variants={itemVariants} style={{ marginBottom: 24 }}>
                  {cancelError && (
                    <p style={{ color: '#EF4444', fontSize: 13, marginBottom: 8 }}>{cancelError}</p>
                  )}
                  <motion.button
                    onClick={handleCancel}
                    disabled={cancelling}
                    whileTap={reduced ? undefined : { scale: 0.97 }}
                    style={{
                      width: '100%',
                      minHeight: 44,
                      padding: '12px 20px',
                      borderRadius: 12,
                      border: '1px solid rgba(239,68,68,0.35)',
                      background: 'rgba(239,68,68,0.08)',
                      color: '#EF4444',
                      fontWeight: 800,
                      fontSize: 15,
                      cursor: cancelling ? 'not-allowed' : 'pointer',
                      fontFamily: 'Outfit, sans-serif',
                      opacity: cancelling ? 0.6 : 1,
                    }}
                  >
                    {cancelling ? 'Annuleren...' : 'Bestelling annuleren'}
                  </motion.button>
                </motion.div>
              )}

              {/* Order items */}
              <motion.div variants={itemVariants} style={{ background: 'var(--bg-card)', borderRadius: 20, border: '1px solid var(--border)', padding: '24px 28px' }}>
                <h3 style={{ fontSize: 18, fontWeight: 800, marginBottom: 16 }}>Samenvatting</h3>
                {order.items.map((item, i) => (
                  <motion.div
                    key={i}
                    initial={reduced ? false : { opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.6 + i * 0.06, duration: 0.35 }}
                    style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: i < order.items.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none' }}
                  >
                    <span style={{ color: 'rgba(255,255,255,0.7)' }}>{item.quantity}× {item.name}</span>
                    <span style={{ fontWeight: 700 }}>€{(item.price / 100).toFixed(2)}</span>
                  </motion.div>
                ))}
                <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: 16, marginTop: 4 }}>
                  <span style={{ fontWeight: 800, fontSize: 16 }}>Totaal</span>
                  <span style={{ fontWeight: 900, fontSize: 16 }}>€{(order.total / 100).toFixed(2)}</span>
                </div>
              </motion.div>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </section>
    </div>
  );
}
