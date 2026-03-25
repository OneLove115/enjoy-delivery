'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { TranslationProvider, useTranslation } from './context/TranslationContext';
import { JoyaChatWidget } from './components/JoyaChatWidget';
import { Nav } from './components/Nav';
import { Footer } from './components/Footer';

const PURPLE = '#5A31F4';
const PINK   = '#FF0080';

/* ─── Hero Image ─── */
function HeroCoupleSection() {
  const { t } = useTranslation();
  return (
    <section style={{ position: 'relative', width: '100%', height: 'min(75vh, 640px)', overflow: 'hidden', marginTop: 64 }}>
      <img
        src="/food/hero-feast.png"
        alt="Couple enjoying a meal together"
        style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center 30%', display: 'block' }}
      />
      {/* Gradient overlay */}
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(10,10,15,0.25) 0%, rgba(10,10,15,0.6) 100%)' }} />

      {/* Headline over image */}
      <div style={{
        position: 'absolute', inset: 0,
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        textAlign: 'center', padding: '0 24px',
      }}>
        <motion.h1
          initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}
          style={{
            fontSize: 'clamp(34px, 6vw, 76px)', fontWeight: 950,
            lineHeight: 1.06, color: 'white', letterSpacing: -2,
            marginBottom: 16, textShadow: '0 4px 24px rgba(0,0,0,0.5)',
          }}
        >
          {t('hero_title').split(',')[0]},<br />
          <span style={{ background: `linear-gradient(135deg,${PURPLE},${PINK},#FF6B35)`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            {t('hero_title').split(',')[1]}
          </span>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
          style={{ fontSize: 18, color: 'rgba(255,255,255,0.85)', maxWidth: 480, lineHeight: 1.65, textShadow: '0 1px 10px rgba(0,0,0,0.5)' }}
        >
          {t('hero_subtitle')}
        </motion.p>
      </div>
    </section>
  );
}

/* ─── Address Bar (directly below hero — required to enter) ─── */
function AddressBar() {
  const router = useRouter();
  const [address, setAddress] = useState('');
  const [locating, setLocating] = useState(false);
  const [error, setError] = useState('');
  const [locationDenied, setLocationDenied] = useState(false);

  /** Build a clean full address from Nominatim structured data */
  const formatAddress = (d: Record<string, unknown>): string => {
    const a = (d.address || {}) as Record<string, string>;
    const parts = [
      [a.road, a.house_number].filter(Boolean).join(' '),
      a.city || a.town || a.village || a.municipality || '',
      a.postcode || '',
    ].filter(Boolean);
    return parts.join(', ') || (d.display_name as string) || '';
  };

  /** Request geolocation and reverse-geocode to full address */
  const detectLocation = () => {
    if (!navigator.geolocation) return;
    setLocating(true);
    setError('');
    setLocationDenied(false);

    navigator.geolocation.getCurrentPosition(
      async pos => {
        try {
          const r = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${pos.coords.latitude}&lon=${pos.coords.longitude}&format=jsonv2&addressdetails=1`
          );
          const d = await r.json();
          const addr = formatAddress(d);
          setAddress(addr);
          localStorage.setItem('enjoyAddress', addr);
          setError('');
        } catch {
          setError('Kon je locatie niet ophalen. Voer je adres handmatig in.');
        } finally {
          setLocating(false);
        }
      },
      err => {
        setLocating(false);
        if (err.code === err.PERMISSION_DENIED) {
          setLocationDenied(true);
        } else {
          setError('Locatie niet beschikbaar. Voer je adres handmatig in.');
        }
      },
      { enableHighAccuracy: true, timeout: 8000 }
    );
  };

  // On mount: use saved address OR auto-detect
  useEffect(() => {
    const saved = localStorage.getItem('enjoyAddress');
    if (saved) {
      setAddress(saved);
    } else {
      detectLocation();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const goDiscover = (addr: string) => {
    if (!addr.trim()) {
      setError('Voer je bezorgadres in — dit is verplicht om restaurants in jouw buurt te vinden.');
      return;
    }
    localStorage.setItem('enjoyAddress', addr.trim());
    router.push('/discover');
  };

  const handleSearch = (e?: React.FormEvent) => {
    e?.preventDefault();
    goDiscover(address);
  };

  const handleGeolocate = () => detectLocation();

  return (
    <section style={{ background: 'var(--bg-page)', padding: '36px 24px 52px' }}>
      <div style={{ maxWidth: 680, margin: '0 auto' }}>

        <motion.p
          initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}
          style={{
            textAlign: 'center', fontSize: 13, fontWeight: 700,
            color: 'var(--text-secondary)', textTransform: 'uppercase',
            letterSpacing: 1.2, marginBottom: 16,
          }}
        >
          📍 Waar wil je laten bezorgen?
        </motion.p>

        {/* Location denied banner */}
        <AnimatePresence>
          {locationDenied && (
            <motion.div
              initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
              style={{
                background: 'rgba(255,160,0,0.08)', border: '1px solid rgba(255,160,0,0.25)',
                borderRadius: 14, padding: '14px 18px', marginBottom: 14,
                display: 'flex', alignItems: 'flex-start', gap: 12,
              }}
            >
              <span style={{ fontSize: 20, flexShrink: 0 }}>⚠️</span>
              <div>
                <p style={{ fontSize: 14, fontWeight: 700, color: '#FFA000', marginBottom: 3 }}>
                  Locatietoegang uitgeschakeld
                </p>
                <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                  Zet locatietoegang aan in je apparaatinstellingen zodat we je exacte locatie kunnen bepalen voor bezorging,
                  of voer je adres handmatig in hieronder.
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Search form */}
        <motion.form
          onSubmit={handleSearch}
          initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
          style={{
            display: 'flex', gap: 8,
            background: 'var(--bg-card)',
            padding: 8, borderRadius: 50,
            border: `1px solid ${error ? 'rgba(255,60,60,0.5)' : 'var(--border-strong)'}`,
            backdropFilter: 'blur(20px)',
            boxShadow: error
              ? '0 0 0 3px rgba(255,60,60,0.1), 0 20px 40px rgba(0,0,0,0.2)'
              : '0 20px 40px rgba(0,0,0,0.2)',
            transition: 'border-color 0.2s, box-shadow 0.2s',
          }}
        >
          {/* Geo button */}
          <button
            type="button"
            onClick={handleGeolocate}
            title="Gebruik mijn locatie"
            style={{
              flexShrink: 0, width: 50, height: 50, borderRadius: 40,
              background: locating ? 'rgba(90,49,244,0.2)' : 'rgba(255,255,255,0.08)',
              border: 'none', fontSize: 20, cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              transition: 'background 0.2s',
            }}
          >
            {locating ? '⏳' : '📍'}
          </button>

          <input
            type="text"
            placeholder="Voer je bezorgadres in... (verplicht)"
            value={address}
            onChange={e => { setAddress(e.target.value); if (e.target.value.trim()) setError(''); }}
            style={{
              flex: 1, background: 'transparent', border: 'none',
              padding: '12px 8px', color: 'var(--text-primary)', fontSize: 15,
              outline: 'none', fontFamily: 'inherit', minWidth: 0,
            }}
          />

          <button
            type="submit"
            style={{
              background: address.trim()
                ? `linear-gradient(135deg,${PURPLE},${PINK},#FF6B35)`
                : 'rgba(255,255,255,0.1)',
              color: address.trim() ? 'white' : 'var(--text-muted)',
              border: 'none', padding: '12px 28px',
              borderRadius: 40, fontSize: 15, fontWeight: 800, cursor: 'pointer',
              boxShadow: address.trim() ? '0 8px 16px rgba(90,49,244,0.3)' : 'none',
              whiteSpace: 'nowrap', flexShrink: 0,
              transition: 'background 0.2s, box-shadow 0.2s, color 0.2s',
            }}
          >
            Ontdek →
          </button>
        </motion.form>

        {/* Error message */}
        <AnimatePresence>
          {error && (
            <motion.p
              initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              style={{ color: '#FF4444', fontSize: 13, marginTop: 10, textAlign: 'center', fontWeight: 600 }}
            >
              ⚠️ {error}
            </motion.p>
          )}
        </AnimatePresence>

        {!error && (
          <p style={{ textAlign: 'center', fontSize: 12, color: 'var(--text-muted)', marginTop: 12, lineHeight: 1.5 }}>
            Je adres is verplicht om restaurants bij jou in de buurt te ontdekken. We bezorgen alleen op het door jou opgegeven adres.
          </p>
        )}
      </div>
    </section>
  );
}

/* ─── Food Culture Gallery ─── */
function FoodCultureSection() {
  const cuisines = [
    { img: '/food/cat-pizza.png',   name: 'Pizza',   href: '/discover' },
    { img: '/food/cat-burger.png',  name: 'Burgers', href: '/discover' },
    { img: '/food/cat-sushi.png',   name: 'Sushi',   href: '/discover' },
    { img: '/food/cat-curry.png',   name: 'Curry',   href: '/discover' },
    { img: '/food/cat-kebab.png',   name: 'Kebab',   href: '/discover' },
    { img: '/food/cat-dessert.png', name: 'Dessert', href: '/discover' },
  ];
  return (
    <section className="section-pad" style={{ background: 'rgba(90,49,244,0.03)' }}>
      <h2 style={{ textAlign: 'center', fontSize: 36, fontWeight: 900, marginBottom: 14 }}>
        A World of <span style={{ background: `linear-gradient(135deg,${PURPLE},${PINK})`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Flavor</span>
      </h2>
      <p style={{ textAlign: 'center', color: 'var(--text-secondary)', fontSize: 16, marginBottom: 40, maxWidth: 560, margin: '0 auto 40px' }}>
        From street food to fine dining — every culture, every craving, royally delivered.
      </p>
      <div className="grid-3" style={{ gap: 16, maxWidth: 900, margin: '0 auto' }}>
        {cuisines.map((c, i) => (
          <Link key={i} href={c.href}>
            <motion.div initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }}
              style={{ position: 'relative', borderRadius: 18, overflow: 'hidden', aspectRatio: '4/3', cursor: 'pointer', border: '1px solid var(--border)' }}>
              <img src={c.img} alt={c.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 60%)' }} />
              <span style={{ position: 'absolute', bottom: 14, left: 18, fontSize: 18, fontWeight: 800, color: 'white' }}>{c.name}</span>
            </motion.div>
          </Link>
        ))}
      </div>
    </section>
  );
}

/* ─── How It Works ─── */
function HowItWorks() {
  const steps = [
    { icon: '📍', title: 'Find or Book', text: 'Enter your address or let us detect your location to discover nearby restaurants.' },
    { icon: '🍳', title: 'Browse & Order', text: 'Browse curated menus, add items to your cart, and place your order in seconds.' },
    { icon: '👑', title: 'Royal Delivery', text: 'Our dedicated fleet delivers hot and fresh — typically in 30 minutes or less.' },
  ];
  return (
    <section className="section-pad">
      <h2 style={{ textAlign: 'center', fontSize: 36, fontWeight: 900, marginBottom: 48 }}>How EnJoy Works</h2>
      <div className="grid-3" style={{ gap: 24, maxWidth: 960, margin: '0 auto' }}>
        {steps.map((s, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.15 }}
            style={{ textAlign: 'center', padding: '36px 24px', borderRadius: 20, background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
            <div style={{ fontSize: 44, marginBottom: 18 }}>{s.icon}</div>
            <h3 style={{ fontSize: 19, fontWeight: 800, marginBottom: 10 }}>{s.title}</h3>
            <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6, fontSize: 14 }}>{s.text}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

/* ─── Popular Restaurants Preview ─── */
function PopularRestaurants() {
  const { t } = useTranslation();
  const restaurants = [
    { name: 'Royal Kitchen', cuisine: 'Indian · Curry',     rating: 4.8, time: '25-35 min', img: '/food/royal-kitchen.png',  slug: '' },
    { name: 'Burger Empire', cuisine: 'Burgers · American', rating: 4.6, time: '15-25 min', img: '/food/burger-empire.png', slug: '' },
    { name: 'Sushi Palace',  cuisine: 'Japanese · Sushi',   rating: 4.9, time: '30-40 min', img: '/food/sushi-palace.png',  slug: '' },
    { name: 'Pizza Throne',  cuisine: 'Italian · Pizza',    rating: 4.7, time: '20-30 min', img: '/food/pizza-throne.png',  slug: '' },
  ];
  return (
    <section className="section-pad" style={{ background: 'rgba(90,49,244,0.02)' }}>
      <h2 style={{ textAlign: 'center', fontSize: 36, fontWeight: 900, marginBottom: 40 }}>{t('popular_near')}</h2>
      <div className="grid-2" style={{ gap: 20, maxWidth: 960, margin: '0 auto' }}>
        {restaurants.map((r, i) => (
          <Link key={i} href={r.slug ? `/menu/${r.slug}` : '/discover'} style={{ display: 'block' }}>
            <motion.div initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }}
              style={{ display: 'flex', background: 'var(--bg-card)', borderRadius: 18, border: '1px solid var(--border)', overflow: 'hidden', cursor: 'pointer' }}>
              <div style={{ width: 140, height: 120, position: 'relative', overflow: 'hidden', flexShrink: 0 }}>
                <img src={r.img} alt={r.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
              <div style={{ flex: 1, padding: '16px 18px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <h3 style={{ fontSize: 16, fontWeight: 800, marginBottom: 3, color: 'var(--text-primary)' }}>{r.name}</h3>
                <p style={{ color: 'var(--text-muted)', fontSize: 13, marginBottom: 10 }}>{r.cuisine}</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <span style={{ background: 'rgba(255,215,0,0.12)', color: '#FFD700', padding: '3px 9px', borderRadius: 8, fontSize: 12, fontWeight: 700 }}>⭐ {r.rating}</span>
                  <span style={{ color: 'var(--text-muted)', fontSize: 12 }}>{r.time}</span>
                </div>
              </div>
            </motion.div>
          </Link>
        ))}
      </div>
      <div style={{ textAlign: 'center', marginTop: 32 }}>
        <Link href="/discover" style={{
          display: 'inline-block', padding: '14px 36px', borderRadius: 50,
          background: `linear-gradient(135deg,${PURPLE},${PINK})`,
          color: 'white', fontWeight: 800, fontSize: 16,
        }}>View all restaurants →</Link>
      </div>
    </section>
  );
}

/* ─── Main ─── */
export default function LandingPage() {
  return (
    <TranslationProvider>
      <div style={{ background: 'var(--bg-page)', minHeight: '100vh', color: 'var(--text-primary)', overflowX: 'hidden' }}>
        <Nav />
        <HeroCoupleSection />
        <AddressBar />
        <FoodCultureSection />
        <PopularRestaurants />
        <HowItWorks />
        <Footer />
        <JoyaChatWidget />
      </div>
    </TranslationProvider>
  );
}
