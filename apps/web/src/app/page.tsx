'use client';
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { TranslationProvider, useTranslation } from './context/TranslationContext';
import { Nav } from './components/Nav';
import { Footer } from './components/Footer';

const PURPLE = '#5A31F4';
const PINK   = '#FF0080';

/* ─── Hero Image ─── */
function HeroCoupleSection() {
  const { t } = useTranslation();
  return (
    <section className="hero-couple" style={{ position: 'relative', width: '100%', overflow: 'hidden' }}>
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
        textAlign: 'center', padding: '0 20px',
      }}>
        <motion.h1
          initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}
          style={{
            fontSize: 'clamp(28px, 7vw, 76px)', fontWeight: 950,
            lineHeight: 1.08, color: 'white', letterSpacing: 'clamp(-1px, -0.03em, -2px)',
            marginBottom: 12, textShadow: '0 4px 24px rgba(0,0,0,0.5)',
          }}
        >
          {t('hero_title').split(',')[0]},<br />
          <span style={{ background: `linear-gradient(135deg,${PURPLE},${PINK},#FF6B35)`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            {t('hero_title').split(',')[1]}
          </span>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
          style={{ fontSize: 'clamp(14px, 3.5vw, 18px)', color: 'rgba(255,255,255,0.85)', maxWidth: 480, lineHeight: 1.65, textShadow: '0 1px 10px rgba(0,0,0,0.5)' }}
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
  const [suggestions, setSuggestions] = useState<{ display_name: string; place_id: number }[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

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
    setShowSuggestions(false);
    goDiscover(address);
  };

  const handleGeolocate = () => detectLocation();

  /** Fetch address suggestions from Nominatim as user types */
  const fetchSuggestions = (query: string) => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (query.length < 3) { setSuggestions([]); setShowSuggestions(false); return; }
    debounceRef.current = setTimeout(async () => {
      try {
        const r = await fetch(
          `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=jsonv2&addressdetails=1&limit=5&countrycodes=nl,be,de`
        );
        const data = await r.json() as { display_name: string; place_id: number }[];
        setSuggestions(data);
        setShowSuggestions(data.length > 0);
      } catch { /* ignore */ }
    }, 320);
  };

  const selectSuggestion = (s: { display_name: string; place_id: number }) => {
    setAddress(s.display_name);
    localStorage.setItem('enjoyAddress', s.display_name);
    setSuggestions([]);
    setShowSuggestions(false);
  };

  return (
    <section id="address-section" style={{ background: 'var(--bg-page)', padding: '32px 16px 48px' }}>
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
                borderRadius: 14, padding: '14px 16px', marginBottom: 14,
                display: 'flex', alignItems: 'flex-start', gap: 12,
              }}
            >
              <span style={{ fontSize: 20, flexShrink: 0 }}>⚠️</span>
              <div>
                <p style={{ fontSize: 14, fontWeight: 700, color: '#FFA000', marginBottom: 3 }}>
                  Locatietoegang uitgeschakeld
                </p>
                <p style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                  Zet locatietoegang aan in je apparaatinstellingen zodat we je exacte locatie kunnen bepalen,
                  of voer je adres handmatig in hieronder.
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Search form + autocomplete wrapper */}
        <div style={{ position: 'relative' }}>
          <motion.form
            onSubmit={handleSearch}
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
            style={{
              display: 'flex', gap: 8, alignItems: 'center',
              background: 'var(--bg-card)',
              padding: 8, borderRadius: 50,
              border: `1px solid ${error ? 'rgba(255,60,60,0.5)' : 'var(--border-strong)'}`,
              backdropFilter: 'blur(20px)',
              boxShadow: error
                ? '0 0 0 3px rgba(255,60,60,0.1), 0 16px 32px rgba(0,0,0,0.2)'
                : '0 16px 32px rgba(0,0,0,0.2)',
              transition: 'border-color 0.2s, box-shadow 0.2s',
            }}
          >
            {/* Geo button — always visible */}
            <button
              type="button"
              onClick={handleGeolocate}
              title="Gebruik mijn locatie"
              style={{
                flexShrink: 0, width: 46, height: 46, borderRadius: 40,
                background: locating ? 'rgba(90,49,244,0.2)' : 'rgba(255,255,255,0.08)',
                border: 'none', fontSize: 20, cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                transition: 'background 0.2s', minWidth: 46,
              }}
            >
              {locating ? '⏳' : '📍'}
            </button>

            {/* Input — font-size 16px prevents iOS auto-zoom */}
            <input
              id="address-input"
              type="text"
              placeholder="Jouw bezorgadres... (verplicht)"
              value={address}
              onChange={e => {
                const val = e.target.value;
                setAddress(val);
                if (val.trim()) setError('');
                fetchSuggestions(val);
              }}
              onBlur={() => setTimeout(() => setShowSuggestions(false), 180)}
              onFocus={() => { if (suggestions.length > 0) setShowSuggestions(true); }}
              style={{
                flex: 1, background: 'transparent', border: 'none',
                padding: '10px 4px', color: 'var(--text-primary)', fontSize: 16,
                outline: 'none', fontFamily: 'inherit', minWidth: 0,
              }}
              autoComplete="off"
            />

            {/* Submit — short on mobile, full label on desktop */}
            <button
              type="submit"
              style={{
                background: address.trim()
                  ? `linear-gradient(135deg,${PURPLE},${PINK},#FF6B35)`
                  : 'rgba(255,255,255,0.1)',
                color: address.trim() ? 'white' : 'var(--text-muted)',
                border: 'none', padding: '11px 20px',
                borderRadius: 40, fontSize: 15, fontWeight: 800, cursor: 'pointer',
                boxShadow: address.trim() ? '0 6px 14px rgba(90,49,244,0.3)' : 'none',
                whiteSpace: 'nowrap', flexShrink: 0,
                transition: 'background 0.2s, box-shadow 0.2s, color 0.2s',
                minHeight: 46,
              }}
            >
              <span className="address-btn-label">Ontdek →</span>
              <span className="address-btn-icon">→</span>
            </button>
          </motion.form>

          {/* Address suggestions dropdown */}
          {showSuggestions && suggestions.length > 0 && (
            <div style={{
              position: 'absolute', top: 'calc(100% + 8px)', left: 0, right: 0, zIndex: 50,
              background: 'var(--bg-card)', borderRadius: 16,
              border: '1px solid var(--border-strong)',
              boxShadow: '0 12px 40px rgba(0,0,0,0.25)',
              overflow: 'hidden',
            }}>
              {suggestions.map((s, i) => (
                <button
                  key={s.place_id}
                  type="button"
                  onMouseDown={() => selectSuggestion(s)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 12,
                    width: '100%', padding: '13px 16px',
                    background: 'transparent', border: 'none',
                    borderBottom: i < suggestions.length - 1 ? '1px solid var(--border)' : 'none',
                    cursor: 'pointer', textAlign: 'left',
                    transition: 'background 0.15s',
                  }}
                  onMouseEnter={e => (e.currentTarget.style.background = 'var(--bg-page)')}
                  onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                >
                  <span style={{ fontSize: 16, flexShrink: 0 }}>📍</span>
                  <span style={{
                    fontSize: 14, color: 'var(--text-primary)', lineHeight: 1.4,
                    overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                  }}>{s.display_name}</span>
                </button>
              ))}
            </div>
          )}
        </div>

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
            Je adres is verplicht om restaurants bij jou in de buurt te ontdekken.
          </p>
        )}
      </div>
    </section>
  );
}

/* ─── Shared address guard ─── */
function useAddressGuard() {
  const router = useRouter();
  return (dest: string = '/discover') => {
    const addr = (typeof window !== 'undefined' ? localStorage.getItem('enjoyAddress') : null) || '';
    if (!addr.trim()) {
      const el = document.getElementById('address-section');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        // Flash the input
        const input = document.getElementById('address-input') as HTMLInputElement | null;
        if (input) {
          input.focus();
          input.style.outline = '3px solid #FF6B00';
          setTimeout(() => { input.style.outline = ''; }, 1800);
        }
      }
      return;
    }
    router.push(dest);
  };
}

/* ─── Food Culture Gallery ─── */
function FoodCultureSection() {
  const goDiscover = useAddressGuard();
  const cuisines = [
    { img: '/food/cat-pizza.png',   name: 'Pizza'   },
    { img: '/food/cat-burger.png',  name: 'Burgers' },
    { img: '/food/cat-sushi.png',   name: 'Sushi'   },
    { img: '/food/cat-curry.png',   name: 'Curry'   },
    { img: '/food/cat-kebab.png',   name: 'Kebab'   },
    { img: '/food/cat-dessert.png', name: 'Dessert' },
  ];
  return (
    <section className="section-pad" style={{ background: 'rgba(90,49,244,0.03)' }}>
      <h2 style={{ textAlign: 'center', fontSize: 'clamp(22px, 5vw, 36px)', fontWeight: 900, marginBottom: 14 }}>
        A World of <span style={{ background: `linear-gradient(135deg,${PURPLE},${PINK})`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Flavor</span>
      </h2>
      <p style={{ textAlign: 'center', color: 'var(--text-secondary)', fontSize: 'clamp(14px, 3vw, 16px)', maxWidth: 560, margin: '0 auto 36px' }}>
        From street food to fine dining — every culture, every craving, royally delivered.
      </p>
      <div className="grid-3" style={{ gap: 12, maxWidth: 900, margin: '0 auto' }}>
        {cuisines.map((c, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }}
            onClick={() => goDiscover()}
            style={{ position: 'relative', borderRadius: 16, overflow: 'hidden', aspectRatio: '4/3', cursor: 'pointer', border: '1px solid var(--border)' }}>
            <img src={c.img} alt={c.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 60%)' }} />
            <span style={{ position: 'absolute', bottom: 10, left: 14, fontSize: 'clamp(13px, 3vw, 18px)', fontWeight: 800, color: 'white' }}>{c.name}</span>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

/* ─── How It Works ─── */
function HowItWorks() {
  const steps = [
    { icon: '📍', title: 'Vind of boek', text: 'Voer je adres in of laat ons je locatie detecteren om restaurants in de buurt te ontdekken.' },
    { icon: '🍳', title: 'Blader en bestel', text: 'Blader door samengestelde menu\'s, voeg items toe aan je winkelmandje en plaats je bestelling.' },
    { icon: '👑', title: 'Koninklijke bezorging', text: 'Onze bezorgers leveren heet en vers — doorgaans binnen 30 minuten.' },
  ];
  return (
    <section className="section-pad">
      <h2 style={{ textAlign: 'center', fontSize: 'clamp(22px, 5vw, 36px)', fontWeight: 900, marginBottom: 40 }}>Hoe EnJoy werkt</h2>
      {/* grid-how: 3-col desktop, 1-col mobile */}
      <div className="grid-3 grid-how" style={{ gap: 20, maxWidth: 960, margin: '0 auto' }}>
        {steps.map((s, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.12 }}
            style={{ textAlign: 'center', padding: '32px 22px', borderRadius: 20, background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
            <div style={{ fontSize: 40, marginBottom: 16 }}>{s.icon}</div>
            <h3 style={{ fontSize: 18, fontWeight: 800, marginBottom: 10 }}>{s.title}</h3>
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
  const goDiscover = useAddressGuard();
  const restaurants = [
    { name: 'Royal Kitchen', cuisine: 'Indian · Curry',     rating: 4.8, time: '25-35 min', img: '/food/royal-kitchen.png',  slug: '' },
    { name: 'Burger Empire', cuisine: 'Burgers · American', rating: 4.6, time: '15-25 min', img: '/food/burger-empire.png', slug: '' },
    { name: 'Sushi Palace',  cuisine: 'Japanese · Sushi',   rating: 4.9, time: '30-40 min', img: '/food/sushi-palace.png',  slug: '' },
    { name: 'Pizza Throne',  cuisine: 'Italian · Pizza',    rating: 4.7, time: '20-30 min', img: '/food/pizza-throne.png',  slug: '' },
  ];
  return (
    <section className="section-pad" style={{ background: 'rgba(90,49,244,0.02)' }}>
      <h2 style={{ textAlign: 'center', fontSize: 'clamp(22px, 5vw, 36px)', fontWeight: 900, marginBottom: 32 }}>{t('popular_near')}</h2>
      <div className="grid-2" style={{ gap: 16, maxWidth: 960, margin: '0 auto' }}>
        {restaurants.map((r, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }}
            onClick={() => goDiscover(r.slug ? `/menu/${r.slug}` : '/discover')}
            style={{ display: 'flex', background: 'var(--bg-card)', borderRadius: 16, border: '1px solid var(--border)', overflow: 'hidden', cursor: 'pointer' }}>
            <div style={{ width: 120, minHeight: 110, position: 'relative', overflow: 'hidden', flexShrink: 0 }}>
              <img src={r.img} alt={r.name} style={{ width: '100%', height: '100%', objectFit: 'cover', position: 'absolute', inset: 0 }} />
            </div>
            <div style={{ flex: 1, padding: '14px 16px', display: 'flex', flexDirection: 'column', justifyContent: 'center', minWidth: 0 }}>
              <h3 style={{ fontSize: 15, fontWeight: 800, marginBottom: 3, color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{r.name}</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: 12, marginBottom: 10, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{r.cuisine}</p>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
                <span style={{ background: 'rgba(255,215,0,0.12)', color: '#FFD700', padding: '2px 8px', borderRadius: 8, fontSize: 12, fontWeight: 700, whiteSpace: 'nowrap' }}>⭐ {r.rating}</span>
                <span style={{ color: 'var(--text-muted)', fontSize: 12, whiteSpace: 'nowrap' }}>{r.time}</span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
      <div style={{ textAlign: 'center', marginTop: 28 }}>
        <button
          onClick={() => goDiscover()}
          style={{
            display: 'inline-block', padding: '14px 32px', borderRadius: 50,
            background: `linear-gradient(135deg,${PURPLE},${PINK})`,
            color: 'white', fontWeight: 800, fontSize: 16,
            border: 'none', cursor: 'pointer',
          }}
        >Bekijk alle restaurants →</button>
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
      </div>
    </TranslationProvider>
  );
}
