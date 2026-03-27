'use client';
import { useEffect, useState, useRef } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Nav } from '../../components/Nav';

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
  { key: 'confirmed', label: 'Order confirmed', icon: '✅' },
  { key: 'preparing', label: 'Being prepared', icon: '👨‍🍳' },
  { key: 'ready', label: 'Ready for pickup', icon: '📦' },
  { key: 'on_the_way', label: 'On the way', icon: '🚲' },
  { key: 'delivered', label: 'Delivered', icon: '🎉' },
];

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
    <div style={{ borderRadius: 20, overflow: 'hidden', border: '1px solid var(--border)', marginBottom: 24 }}>
      <div ref={containerRef} style={{ width: '100%', height: 260 }} />
      <div style={{ padding: '12px 16px', background: 'var(--bg-card)', display: 'flex', alignItems: 'center', gap: 8 }}>
        <span style={{ fontSize: 16 }}>📍</span>
        <span style={{ fontSize: 13, color: 'var(--text-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{address}</span>
      </div>
    </div>
  );
}

export default function OrderTrackingPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const prevStatusRef = useRef<string>('');

  useEffect(() => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, []);

  useEffect(() => {
    const load = () =>
      fetch(`/api/orders/${id}`)
        .then(r => { if (!r.ok) { setError('Order not found'); return null; } return r.json(); })
        .then(d => {
          if (!d) return;
          // Detect status change
          if (prevStatusRef.current && prevStatusRef.current !== d.status && 'Notification' in window && Notification.permission === 'granted') {
            const msgs: Record<string, string> = {
              confirmed: '✅ Je bestelling is bevestigd!',
              preparing: '👨‍🍳 Je bestelling wordt bereid...',
              ready:     '📦 Je bestelling is klaar voor afhaal!',
              on_the_way:'🚲 Je bezorger is onderweg!',
              delivered: '🎉 Je bestelling is bezorgd. Eet smakelijk!',
              cancelled: '❌ Je bestelling is geannuleerd.',
            };
            const msg = msgs[d.status] || `Status bijgewerkt: ${d.status}`;
            new Notification('EnJoy Bestelling', {
              body: msg,
              icon: '/icons/icon-192.png',
              tag: `order-${d.id}`,
            });
          }
          prevStatusRef.current = d.status;
          setOrder(d);
        })
        .catch(() => setError('Failed to load order'));

    fetch('/api/auth/me')
      .then(r => { if (!r.ok) { router.push('/login'); return false; } return true; })
      .then(ok => ok && load())
      .finally(() => setLoading(false));

    const interval = setInterval(load, 30000);
    return () => clearInterval(interval);
  }, [id, router]);

  const activeStage = order ? STAGES.findIndex(s => s.key === order.status) : -1;

  return (
    <div style={{ background: 'var(--bg-page)', minHeight: '100vh', color: 'var(--text-primary)', fontFamily: 'Outfit, sans-serif' }}>
      <Nav />
      <NotificationBanner />
      <section style={{ padding: '100px 40px 60px', maxWidth: 720, margin: '0 auto' }}>
        {loading ? (
          <div style={{ textAlign: 'center', padding: '80px 0', color: 'var(--text-muted)' }}>Loading your order...</div>
        ) : error ? (
          <div style={{ textAlign: 'center', padding: '80px 0' }}>
            <p style={{ color: '#EF4444', marginBottom: 24 }}>{error}</p>
            <Link href="/account/orders" style={{ color: PURPLE, fontWeight: 700, textDecoration: 'none' }}>← Back to orders</Link>
          </div>
        ) : order ? (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <Link href="/account/orders" style={{ color: 'var(--text-muted)', fontSize: 14, textDecoration: 'none', display: 'block', marginBottom: 28 }}>← All orders</Link>
            <h1 style={{ fontSize: 32, fontWeight: 900, marginBottom: 4 }}>Order from {order.restaurantName}</h1>
            {order.estimatedMinutes && order.status !== 'delivered' && (
              <p style={{ fontSize: 18, color: PURPLE, fontWeight: 700, marginBottom: 32 }}>🕐 Arriving in ~{order.estimatedMinutes} minutes</p>
            )}

            {/* Progress tracker */}
            <div style={{ background: 'var(--bg-card)', borderRadius: 20, border: '1px solid var(--border)', padding: '32px 28px', marginBottom: 24 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', position: 'relative' }}>
                <div style={{ position: 'absolute', top: 20, left: '10%', right: '10%', height: 3, background: 'var(--b8)', borderRadius: 4 }} />
                <div style={{ position: 'absolute', top: 20, left: '10%', height: 3, background: `linear-gradient(90deg,${PURPLE},${PINK})`, borderRadius: 4, width: `${Math.min(activeStage / (STAGES.length - 1) * 80, 80)}%`, transition: 'width 1s ease' }} />
                {STAGES.map((s, i) => (
                  <div key={s.key} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10, zIndex: 1 }}>
                    <div style={{ width: 40, height: 40, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, background: i <= activeStage ? `linear-gradient(135deg,${PURPLE},${PINK})` : 'rgba(255,255,255,0.06)', transition: 'background 0.5s', boxShadow: i === activeStage ? `0 0 16px ${PURPLE}60` : 'none' }}>{s.icon}</div>
                    <span style={{ fontSize: 11, color: i <= activeStage ? 'white' : 'rgba(255,255,255,0.25)', fontWeight: 700, textAlign: 'center', maxWidth: 70 }}>{s.label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Interactive map */}
            <MapView address={order.address} />

            {/* Rider info */}
            {order.rider && order.status === 'on_the_way' && (
              <div style={{ background: `${PURPLE}10`, border: `1px solid ${PURPLE}30`, borderRadius: 16, padding: '20px 24px', marginBottom: 24, display: 'flex', alignItems: 'center', gap: 16 }}>
                <div style={{ width: 48, height: 48, background: `linear-gradient(135deg,${PURPLE},${PINK})`, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22 }}>🚲</div>
                <div>
                  <p style={{ fontWeight: 800, fontSize: 16, margin: 0 }}>{order.rider.name} is on the way</p>
                  <p style={{ color: 'var(--text-muted)', fontSize: 14, margin: 0 }}>Delivering to {order.address}</p>
                </div>
              </div>
            )}

            {/* Order items */}
            <div style={{ background: 'var(--bg-card)', borderRadius: 20, border: '1px solid var(--border)', padding: '24px 28px' }}>
              <h3 style={{ fontSize: 18, fontWeight: 800, marginBottom: 16 }}>Order summary</h3>
              {order.items.map((item, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: i < order.items.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none' }}>
                  <span style={{ color: 'rgba(255,255,255,0.7)' }}>{item.quantity}× {item.name}</span>
                  <span style={{ fontWeight: 700 }}>€{(item.price / 100).toFixed(2)}</span>
                </div>
              ))}
              <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: 16, marginTop: 4 }}>
                <span style={{ fontWeight: 800, fontSize: 16 }}>Total</span>
                <span style={{ fontWeight: 900, fontSize: 16 }}>€{(order.total / 100).toFixed(2)}</span>
              </div>
            </div>
          </motion.div>
        ) : null}
      </section>
    </div>
  );
}
