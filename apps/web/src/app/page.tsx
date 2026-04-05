'use client';
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { TranslationProvider, useTranslation } from './context/TranslationContext';
import { Nav } from './components/Nav';
import { Footer } from './components/Footer';

const PURPLE = '#5A31F4';
const PINK   = '#FF0080';

/* ─── Hero — rotating food photography backgrounds ─── */
const heroSlides = [
  { src: '/food/hero-feast.png', label: 'Feest' },
  { src: '/food/cat-pizza.png', label: 'Pizza' },
  { src: '/food/cat-sushi.png', label: 'Sushi' },
  { src: '/food/cat-burger.png', label: 'Burgers' },
  { src: '/food/cat-curry.png', label: 'Curry' },
  { src: '/food/cat-dessert.png', label: 'Desserts' },
];

function HeroCoupleSection() {
  const { t } = useTranslation();
  const [slideIdx, setSlideIdx] = useState(0);

  useEffect(() => {
    const iv = setInterval(() => setSlideIdx(i => (i + 1) % heroSlides.length), 4000);
    return () => clearInterval(iv);
  }, []);

  return (
    <section className="hero-couple" style={{ position: 'relative', width: '100%', overflow: 'hidden', minHeight: 'min(70vh, 520px)' }}>
      {/* Rotating background images */}
      <AnimatePresence mode="wait">
        <motion.img
          key={slideIdx}
          src={heroSlides[slideIdx].src}
          alt={heroSlides[slideIdx].label}
          initial={{ opacity: 0, scale: 1.06 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.98 }}
          transition={{ duration: 1.1, ease: 'easeInOut' }}
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center 30%' }}
        />
      </AnimatePresence>

      {/* Gradient overlay */}
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(10,10,15,0.3) 0%, rgba(10,10,15,0.65) 100%)' }} />

      {/* Headline over image */}
      <div style={{
        position: 'relative', zIndex: 1,
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        textAlign: 'center', padding: '80px 20px 60px', minHeight: 'min(70vh, 520px)',
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

        {/* Rotating food label */}
        <div style={{ height: 48, overflow: 'hidden', marginBottom: 10 }}>
          <AnimatePresence mode="wait">
            <motion.span
              key={slideIdx}
              initial={{ y: 36, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -36, opacity: 0 }}
              transition={{ duration: 0.35 }}
              style={{
                display: 'block', fontSize: 'clamp(28px, 6vw, 48px)', fontWeight: 900,
                color: '#FF6B35', textShadow: '0 0 30px rgba(255,107,53,0.5), 0 2px 10px rgba(0,0,0,0.5)',
              }}
            >
              {heroSlides[slideIdx].label}
            </motion.span>
          </AnimatePresence>
        </div>

        <motion.p
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
          style={{ fontSize: 'clamp(14px, 3.5vw, 18px)', color: 'rgba(255,255,255,0.9)', maxWidth: 480, lineHeight: 1.65, textShadow: '0 1px 10px rgba(0,0,0,0.5)' }}
        >
          {t('hero_subtitle')}
        </motion.p>

        {/* Thumbnail dots */}
        <div style={{ display: 'flex', gap: 8, marginTop: 28 }}>
          {heroSlides.map((slide, i) => (
            <button
              key={i}
              onClick={() => setSlideIdx(i)}
              style={{
                width: 40, height: 40, borderRadius: '50%', overflow: 'hidden', padding: 0,
                border: i === slideIdx ? '2px solid #FF6B35' : '2px solid rgba(255,255,255,0.3)',
                cursor: 'pointer', background: 'none',
                boxShadow: i === slideIdx ? '0 0 12px rgba(255,107,53,0.5)' : 'none',
                transition: 'border-color 0.3s, box-shadow 0.3s', opacity: i === slideIdx ? 1 : 0.7,
              }}
            >
              <img src={slide.src} alt={slide.label} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </button>
          ))}
        </div>
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

/* ─── Food Culture Gallery — real photography with hover zoom ─── */
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
      <div className="grid-3" style={{ gap: 14, maxWidth: 900, margin: '0 auto' }}>
        {cuisines.map((c, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            whileHover={{ y: -6, boxShadow: '0 14px 36px rgba(0,0,0,0.18)' }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.08 }}
            onClick={() => goDiscover()}
            style={{
              position: 'relative', borderRadius: 18, overflow: 'hidden',
              aspectRatio: '4/3', cursor: 'pointer',
              border: '1px solid var(--border)',
              boxShadow: '0 4px 16px rgba(0,0,0,0.08)',
            }}
          >
            <motion.img
              src={c.img} alt={c.name}
              whileHover={{ scale: 1.08 }}
              transition={{ duration: 0.4 }}
              style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
            />
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.72) 0%, rgba(0,0,0,0.05) 55%)' }} />
            <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '12px 16px' }}>
              <span style={{ fontSize: 'clamp(15px, 3.5vw, 20px)', fontWeight: 800, color: 'white', textShadow: '0 1px 6px rgba(0,0,0,0.4)' }}>
                {c.name}
              </span>
              <div style={{
                display: 'inline-block', marginLeft: 10,
                padding: '2px 10px', borderRadius: 20,
                background: 'rgba(255,255,255,0.18)', backdropFilter: 'blur(8px)',
                fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.9)',
              }}>
                Ontdek →
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

/* ─── Animated Stats Section ─── */
function AnimatedNumber({ value, suffix }: { value: number; suffix: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [display, setDisplay] = useState(0);
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !hasAnimated) {
        setHasAnimated(true);
        const start = Date.now();
        const tick = () => {
          const progress = Math.min((Date.now() - start) / 2000, 1);
          const eased = 1 - Math.pow(1 - progress, 3);
          setDisplay(Math.round(value * eased));
          if (progress < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      }
    }, { threshold: 0.3 });
    obs.observe(el);
    return () => obs.disconnect();
  }, [value, hasAnimated]);

  return <span ref={ref}>{display.toLocaleString('nl-NL')}{suffix}</span>;
}

function StatsAndHowItWorks() {
  const stats = [
    { label: 'Restaurants', value: 1000, suffix: '+', img: '/food/cat-pizza.png' },
    { label: 'Bestellingen', value: 50000, suffix: '+', img: '/food/hero-feast.png' },
    { label: 'Steden', value: 12, suffix: '', img: '/food/cat-sushi.png' },
    { label: 'Gem. bezorgtijd', value: 28, suffix: ' min', img: '/food/cat-burger.png' },
  ];

  const steps = [
    { icon: '📍', title: 'Vind of boek', text: 'Voer je adres in of laat ons je locatie detecteren om restaurants in de buurt te ontdekken.' },
    { icon: '🍳', title: 'Blader en bestel', text: 'Blader door samengestelde menu\'s, voeg items toe aan je winkelmandje en plaats je bestelling.' },
    { icon: '👑', title: 'Koninklijke bezorging', text: 'Onze bezorgers leveren heet en vers — doorgaans binnen 30 minuten.' },
  ];

  return (
    <section className="section-pad">
      {/* Animated stats */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-60px' }}
        transition={{ duration: 0.6 }}
        style={{
          display: 'flex', justifyContent: 'center', gap: 'clamp(20px, 5vw, 48px)',
          flexWrap: 'wrap', padding: '40px 20px',
          borderRadius: 24, maxWidth: 960, margin: '0 auto 48px',
          background: `linear-gradient(135deg, rgba(90,49,244,0.04), rgba(255,0,128,0.04))`,
          border: '1px solid var(--border)',
        }}
      >
        {stats.map((s, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.12, duration: 0.5 }}
            style={{ textAlign: 'center', minWidth: 110 }}
          >
            <div style={{
              width: 52, height: 52, borderRadius: '50%', overflow: 'hidden',
              margin: '0 auto 10px', boxShadow: '0 3px 10px rgba(0,0,0,0.1)',
              border: '2px solid var(--border)',
            }}>
              <img src={s.img} alt={s.label} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
            <div style={{
              fontSize: 'clamp(24px, 5vw, 34px)', fontWeight: 800,
              background: `linear-gradient(135deg,${PURPLE},${PINK})`,
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
              lineHeight: 1.1,
            }}>
              <AnimatedNumber value={s.value} suffix={s.suffix} />
            </div>
            <div style={{ fontSize: 13, color: 'var(--text-secondary)', marginTop: 4, fontWeight: 600 }}>{s.label}</div>
          </motion.div>
        ))}
      </motion.div>

      {/* How it works */}
      <h2 style={{ textAlign: 'center', fontSize: 'clamp(22px, 5vw, 36px)', fontWeight: 900, marginBottom: 40 }}>Hoe EnJoy werkt</h2>
      <div className="grid-3 grid-how" style={{ gap: 20, maxWidth: 960, margin: '0 auto' }}>
        {steps.map((s, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            whileHover={{ y: -4, boxShadow: '0 10px 28px rgba(0,0,0,0.1)' }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.12 }}
            style={{
              textAlign: 'center', padding: '36px 24px', borderRadius: 22,
              background: 'var(--bg-card)', border: '1px solid var(--border)',
              boxShadow: '0 4px 12px rgba(0,0,0,0.04)',
            }}
          >
            <div style={{
              width: 64, height: 64, borderRadius: '50%', margin: '0 auto 18px',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 32,
              background: `linear-gradient(135deg, rgba(90,49,244,0.08), rgba(255,0,128,0.08))`,
            }}>{s.icon}</div>
            <div style={{
              fontSize: 12, fontWeight: 800, color: PURPLE,
              textTransform: 'uppercase', letterSpacing: 1.5, marginBottom: 8,
            }}>Stap {i + 1}</div>
            <h3 style={{ fontSize: 18, fontWeight: 800, marginBottom: 10 }}>{s.title}</h3>
            <p style={{ color: 'var(--text-secondary)', lineHeight: 1.65, fontSize: 14 }}>{s.text}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

/* ─── Popular Restaurants — enhanced cards with hover effects ─── */
function PopularRestaurants() {
  const { t } = useTranslation();
  const goDiscover = useAddressGuard();
  const restaurants = [
    { name: 'Royal Kitchen', cuisine: 'Indian · Curry',     rating: 4.8, time: '25-35 min', img: '/food/royal-kitchen.png',  slug: '', isNew: true },
    { name: 'Burger Empire', cuisine: 'Burgers · American', rating: 4.6, time: '15-25 min', img: '/food/burger-empire.png', slug: '', discount: '-15%' },
    { name: 'Sushi Palace',  cuisine: 'Japanese · Sushi',   rating: 4.9, time: '30-40 min', img: '/food/sushi-palace.png',  slug: '' },
    { name: 'Pizza Throne',  cuisine: 'Italian · Pizza',    rating: 4.7, time: '20-30 min', img: '/food/pizza-throne.png',  slug: '', isNew: true },
  ];
  return (
    <section className="section-pad" style={{ background: 'rgba(90,49,244,0.02)' }}>
      <h2 style={{ textAlign: 'center', fontSize: 'clamp(22px, 5vw, 36px)', fontWeight: 900, marginBottom: 32 }}>{t('popular_near')}</h2>
      <div className="grid-2" style={{ gap: 18, maxWidth: 960, margin: '0 auto' }}>
        {restaurants.map((r, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            whileHover={{ y: -5, boxShadow: '0 12px 32px rgba(0,0,0,0.14)' }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.08 }}
            onClick={() => goDiscover(r.slug ? `/menu/${r.slug}` : '/discover')}
            style={{
              display: 'flex', background: 'var(--bg-card)', borderRadius: 18,
              border: '1px solid var(--border)', overflow: 'hidden', cursor: 'pointer',
              boxShadow: '0 4px 14px rgba(0,0,0,0.06)',
            }}
          >
            {/* Image with hover zoom */}
            <div style={{ width: 130, minHeight: 120, position: 'relative', overflow: 'hidden', flexShrink: 0 }}>
              <motion.img
                src={r.img} alt={r.name}
                whileHover={{ scale: 1.08 }}
                transition={{ duration: 0.4 }}
                style={{ width: '100%', height: '100%', objectFit: 'cover', position: 'absolute', inset: 0 }}
              />
              {/* Badges */}
              {r.isNew && (
                <span style={{
                  position: 'absolute', top: 8, left: 8,
                  padding: '3px 8px', borderRadius: 12,
                  background: `linear-gradient(135deg,${PURPLE},${PINK})`,
                  color: '#fff', fontSize: 10, fontWeight: 800, letterSpacing: 0.5,
                }}>NIEUW</span>
              )}
              {r.discount && (
                <span style={{
                  position: 'absolute', top: 8, left: 8,
                  padding: '3px 8px', borderRadius: 12,
                  background: '#e74c3c', color: '#fff', fontSize: 10, fontWeight: 800,
                }}>{r.discount}</span>
              )}
            </div>
            <div style={{ flex: 1, padding: '16px 18px', display: 'flex', flexDirection: 'column', justifyContent: 'center', minWidth: 0 }}>
              <h3 style={{ fontSize: 16, fontWeight: 800, marginBottom: 4, color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{r.name}</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: 13, marginBottom: 10, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{r.cuisine}</p>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
                <span style={{
                  background: 'rgba(255,215,0,0.12)', color: '#FFD700',
                  padding: '3px 10px', borderRadius: 10, fontSize: 12, fontWeight: 700, whiteSpace: 'nowrap',
                }}>★ {r.rating}</span>
                <span style={{
                  background: 'rgba(90,49,244,0.06)', color: 'var(--text-secondary)',
                  padding: '3px 10px', borderRadius: 10, fontSize: 12, fontWeight: 600, whiteSpace: 'nowrap',
                }}>{r.time}</span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
      <div style={{ textAlign: 'center', marginTop: 32 }}>
        <motion.button
          onClick={() => goDiscover()}
          whileHover={{ scale: 1.04, boxShadow: '0 8px 24px rgba(90,49,244,0.35)' }}
          whileTap={{ scale: 0.97 }}
          style={{
            display: 'inline-block', padding: '15px 36px', borderRadius: 50,
            background: `linear-gradient(135deg,${PURPLE},${PINK})`,
            color: 'white', fontWeight: 800, fontSize: 16,
            border: 'none', cursor: 'pointer',
          }}
        >Bekijk alle restaurants →</motion.button>
      </div>
    </section>
  );
}

/* ─── Live Order Tracker — blends into page background ─── */
function LiveOrderTracker() {
  const [activeStep, setActiveStep] = useState(0);
  const steps = [
    { label: 'Bestelling geplaatst', icon: '📋' },
    { label: 'Restaurant bereidt voor', icon: '👨‍🍳' },
    { label: 'Koerier onderweg', icon: '🛵' },
    { label: 'Bezorgd!', icon: '🎉' },
  ];

  useEffect(() => {
    const iv = setInterval(() => setActiveStep(s => (s + 1) % steps.length), 3000);
    return () => clearInterval(iv);
  }, [steps.length]);

  return (
    <section style={{ padding: '56px 16px', background: 'var(--bg-page)' }}>
      <div style={{ maxWidth: 520, margin: '0 auto' }}>
        <motion.h2
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          style={{
            textAlign: 'center', fontSize: 'clamp(20px, 5vw, 32px)', fontWeight: 900,
            marginBottom: 8,
          }}
        >
          Live bestelling{' '}
          <span style={{ background: `linear-gradient(135deg,${PURPLE},${PINK})`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            volgen
          </span>
        </motion.h2>
        <p style={{ textAlign: 'center', color: 'var(--text-secondary)', fontSize: 14, marginBottom: 36 }}>
          Volg je bestelling in real-time van keuken tot voordeur
        </p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          style={{
            padding: '32px 28px',
            borderRadius: 24,
            background: 'var(--bg-card)',
            border: '1px solid var(--border)',
            boxShadow: '0 8px 32px rgba(0,0,0,0.06)',
          }}
        >
          {steps.map((step, i) => {
            const isActive = i === activeStep;
            const isCompleted = i < activeStep;

            return (
              <div key={i} style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
                {/* Timeline column */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', minWidth: 44 }}>
                  <motion.div
                    animate={{
                      scale: isActive ? [1, 1.15, 1] : 1,
                      background: isCompleted || isActive
                        ? `linear-gradient(135deg,${PURPLE},${PINK})`
                        : 'var(--bg-page)',
                    }}
                    transition={{
                      scale: { duration: 1.2, repeat: isActive ? Infinity : 0 },
                      background: { duration: 0.3 },
                    }}
                    style={{
                      width: 44, height: 44, borderRadius: '50%',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: 20,
                      border: isCompleted || isActive ? 'none' : '2px solid var(--border)',
                      boxShadow: isActive ? `0 0 20px rgba(90,49,244,0.3)` : 'none',
                      color: isCompleted || isActive ? 'white' : 'var(--text-muted)',
                    }}
                  >
                    {isCompleted ? '✓' : step.icon}
                  </motion.div>

                  {/* Connector line */}
                  {i < steps.length - 1 && (
                    <motion.div
                      animate={{
                        background: isCompleted
                          ? `linear-gradient(to bottom,${PURPLE},${PINK})`
                          : 'var(--border)',
                      }}
                      style={{ width: 3, height: 28, borderRadius: 2 }}
                    />
                  )}
                </div>

                {/* Label */}
                <div style={{ paddingTop: 10, paddingBottom: i < steps.length - 1 ? 16 : 0 }}>
                  <motion.span
                    animate={{
                      color: isActive ? 'var(--text-primary)' : isCompleted ? 'var(--text-muted)' : 'var(--text-muted)',
                    }}
                    style={{
                      fontSize: 15,
                      fontWeight: isActive ? 700 : 400,
                      transition: 'font-weight 0.2s',
                    }}
                  >
                    {step.label}
                  </motion.span>
                  {isActive && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      style={{
                        fontSize: 12, marginTop: 3, fontWeight: 600,
                        background: `linear-gradient(135deg,${PURPLE},${PINK})`,
                        WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                      }}
                    >
                      Nu bezig...
                    </motion.div>
                  )}
                </div>
              </div>
            );
          })}
        </motion.div>
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

        {/* Definition block for AI extractability */}
        <div style={{ maxWidth: 620, margin: '0 auto', padding: '0 20px 32px', textAlign: 'center' }}>
          <p style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.7 }}>
            <strong style={{ color: 'var(--text-primary)' }}>EnJoy</strong> is a premium food delivery platform connecting customers with the best restaurants in the Netherlands and Ghana. As of 2026, EnJoy partners with 1,000+ restaurants across 12 cities, offering AI-powered ordering via Joya, real-time delivery tracking, and a curated gourmet experience.
          </p>
        </div>

        <FoodCultureSection />
        <PopularRestaurants />
        <LiveOrderTracker />
        <StatsAndHowItWorks />
        <Footer />
      </div>
    </TranslationProvider>
  );
}
