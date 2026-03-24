'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { TranslationProvider } from '../context/TranslationContext';
import { JoyaChatWidget } from '../components/JoyaChatWidget';

const PURPLE = '#5A31F4';
const PINK   = '#FF0080';
const LOGO   = `linear-gradient(135deg, ${PURPLE}, ${PINK})`;

/* ─── Types ─── */
type RestaurantRow = {
  name: string;
  slug: string;
  cuisine: string;
  rating: number;
  time: string;
  img: string;
  delivery: string;
  min: number;
  open: boolean;
  category: string; // 'restaurant' | 'grocery' | 'alcohol' | 'gift' | 'sweet' | 'specialty' | 'bakery' | 'health'
};

/* ─── Top category strip — matching screenshot 1 ─── */
const topCats = [
  { label: 'Restaurants',           img: '/food/hero-feast.png',   key: 'restaurant' },
  { label: 'Boodschapp...',          img: '/food/cat-curry.png',    key: 'grocery' },
  { label: 'Alcohol',                img: '/food/cat-kebab.png',    key: 'alcohol' },
  { label: 'Cadeaus',                img: '/food/cat-dessert.png',  key: 'gift' },
  { label: 'Snoep & IJs',            img: '/food/cat-dessert.png',  key: 'sweet' },
  { label: 'Speciaalzaken',          img: '/food/cat-sushi.png',    key: 'specialty' },
  { label: 'Bakkerijen',             img: '/food/cat-pizza.png',    key: 'bakery' },
  { label: 'Gezondheid &\nVerzorging', img: '/food/cat-curry.png', key: 'health' },
];

/* ─── Cuisine chips — matching screenshot 2 ─── */
const cuisines = [
  { bg: '#E8703A', img: '/food/cat-pizza.png',  label: 'Italiaanse pi...',  match: 'Italian' },
  { bg: '#3D2B6B', img: '/food/cat-burger.png', label: 'Burgers',           match: 'Burger' },
  { bg: '#B22222', img: '/food/cat-kebab.png',  label: 'Snacks',            match: 'Snack' },
  { bg: '#D4850A', img: '/food/cat-curry.png',  label: 'Kip',               match: 'Curry' },
  { bg: '#5B9BD5', img: '/food/cat-kebab.png',  label: 'Shoarma',           match: 'Shoarma' },
  { bg: '#D4608A', img: '/food/cat-sushi.png',  label: 'Sushi',             match: 'Sushi' },
  { bg: '#E8703A', img: null,                    label: '100% Halal', halal: true, match: 'Halal' },
  { bg: '#4A235A', img: '/food/cat-curry.png',  label: 'Vegetarisch',       match: 'Vegetar' },
];

const DEMO_RESTAURANTS: RestaurantRow[] = [
  { name: 'Royal Kitchen',  slug: '', cuisine: 'Indian · Curry',      rating: 4.8, time: '25-35', img: '/food/royal-kitchen.png', delivery: 'Gratis', min: 10, open: true,  category: 'restaurant' },
  { name: 'Burger Empire',  slug: '', cuisine: 'Burgers · American',  rating: 4.6, time: '15-25', img: '/food/burger-empire.png', delivery: '€1,99',  min: 15, open: true,  category: 'restaurant' },
  { name: 'Sushi Palace',   slug: '', cuisine: 'Japanese · Sushi',    rating: 4.9, time: '30-40', img: '/food/sushi-palace.png',  delivery: 'Gratis', min: 20, open: true,  category: 'restaurant' },
  { name: 'Pizza Throne',   slug: '', cuisine: 'Italian · Pizza',     rating: 4.7, time: '20-30', img: '/food/pizza-throne.png',  delivery: '€0,99',  min: 12, open: true,  category: 'restaurant' },
  { name: 'Taco Kingdom',   slug: '', cuisine: 'Mexican · Street',    rating: 4.5, time: '20-30', img: '/food/taco-kingdom.png',  delivery: 'Gratis', min: 18, open: false, category: 'restaurant' },
  { name: 'Pho Dynasty',    slug: '', cuisine: 'Vietnamese · Soups',  rating: 4.8, time: '25-35', img: '/food/hero-feast.png',    delivery: '€1,50',  min: 15, open: true,  category: 'restaurant' },
  { name: 'Kebab Palace',   slug: '', cuisine: 'Turkish · Shoarma',   rating: 4.4, time: '20-35', img: '/food/royal-kitchen.png', delivery: 'Gratis', min: 8,  open: true,  category: 'restaurant' },
  { name: 'Dragon Wok',     slug: '', cuisine: 'Chinese · Asian',     rating: 4.6, time: '25-40', img: '/food/sushi-palace.png',  delivery: '€2,00',  min: 20, open: false, category: 'restaurant' },
  { name: 'Mama Mia',       slug: '', cuisine: 'Italian · Pasta',     rating: 4.7, time: '30-45', img: '/food/pizza-throne.png',  delivery: 'Gratis', min: 14, open: true,  category: 'restaurant' },
];

/* ─── Logo ─── */
function Logo() {
  return (
    <Link href="/" style={{ textDecoration: 'none', flexShrink: 0 }}>
      <span style={{ fontSize: 22, fontWeight: 900, color: 'white' }}>
        En<span style={{ background: LOGO, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Joy</span>
      </span>
    </Link>
  );
}

/* ─── Category icon — transparent floating image style (screenshot 1) ─── */
function CatIcon({ cat, active, onClick }: {
  cat: typeof topCats[0]; active: boolean; onClick: () => void;
}) {
  return (
    <button onClick={onClick} style={{
      display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8,
      padding: '14px 12px 10px', background: 'transparent', border: 'none', cursor: 'pointer',
      borderBottom: active ? `3px solid ${PINK}` : '3px solid transparent',
      transition: 'border-color 0.2s', minWidth: 88, flexShrink: 0,
    }}>
      <div style={{ width: 88, height: 72, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <img
          src={cat.img} alt={cat.label}
          style={{
            maxWidth: 88, maxHeight: 72, objectFit: 'contain',
            filter: active
              ? 'drop-shadow(0 4px 14px rgba(255,128,0,0.5)) drop-shadow(0 2px 6px rgba(0,0,0,0.4))'
              : 'drop-shadow(0 4px 10px rgba(0,0,0,0.5))',
            transform: active ? 'scale(1.1)' : 'scale(1)',
            transition: 'transform 0.2s, filter 0.2s',
          }}
        />
      </div>
      <span style={{
        fontSize: 12, fontWeight: 700, textAlign: 'center', lineHeight: 1.3,
        color: active ? 'white' : 'rgba(255,255,255,0.75)', maxWidth: 88,
        whiteSpace: 'pre-line',
      }}>{cat.label}</span>
    </button>
  );
}

/* ─── Cuisine chip — colored squircle (screenshot 2) ─── */
function CuisineChip({ c, active, onClick }: {
  c: typeof cuisines[0]; active: boolean; onClick: () => void;
}) {
  return (
    <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.95 }} onClick={onClick} style={{
      display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 7,
      padding: 0, background: 'transparent', border: 'none', cursor: 'pointer', minWidth: 82, flexShrink: 0,
    }}>
      <div style={{
        width: 86, height: 86, borderRadius: 22, background: c.bg, overflow: 'hidden', position: 'relative',
        border: active ? '3px solid white' : '3px solid transparent',
        boxShadow: active ? `0 0 0 2px rgba(255,255,255,0.3), 0 6px 20px rgba(0,0,0,0.4)` : '0 4px 14px rgba(0,0,0,0.35)',
        transition: 'all 0.2s',
      }}>
        {(c as any).halal ? (
          <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ fontSize: 22, fontWeight: 900, color: 'white', fontFamily: 'serif' }}>حلال</div>
            <div style={{ fontSize: 11, fontWeight: 900, color: 'white', letterSpacing: 1 }}>HALAL</div>
          </div>
        ) : c.img ? (
          <img src={c.img} alt={c.label} style={{ width: '115%', height: '115%', objectFit: 'cover', marginLeft: '-7.5%', marginTop: '-7.5%', filter: 'contrast(1.08) saturate(1.15)' }} />
        ) : null}
      </div>
      <span style={{ fontSize: 12, fontWeight: 700, color: 'rgba(255,255,255,0.88)', whiteSpace: 'nowrap' }}>{c.label}</span>
    </motion.button>
  );
}

/* ─── Toggle ─── */
function Toggle({ val, onToggle }: { val: boolean; onToggle: () => void }) {
  return (
    <button onClick={onToggle} style={{
      width: 48, height: 26, borderRadius: 13, border: 'none', cursor: 'pointer',
      position: 'relative', flexShrink: 0,
      background: val ? PINK : 'rgba(255,255,255,0.18)', transition: 'background 0.25s',
    }}>
      <span style={{
        position: 'absolute', top: 3, left: val ? 25 : 3, width: 20, height: 20,
        borderRadius: '50%', background: 'white', transition: 'left 0.25s',
        display: 'block', boxShadow: '0 1px 4px rgba(0,0,0,0.3)',
      }} />
    </button>
  );
}

/* ─── Main page ─── */
function DiscoverContent() {
  const [restaurants, setRestaurants]     = useState<RestaurantRow[]>(DEMO_RESTAURANTS);
  const [address, setAddress]             = useState('');
  const [search, setSearch]               = useState('');
  const [sort, setSort]                   = useState('Beste match');
  const [openOnly, setOpenOnly]           = useState(false);
  const [freeDelivery, setFreeDelivery]   = useState(false);
  const [minOrder, setMinOrder]           = useState('all');
  const [activeTopCat, setActiveTopCat]   = useState(0);
  const [activeCuisines, setActiveCuisines] = useState<Set<string>>(new Set());
  const [showAllCuisines, setShowAllCuisines] = useState(false);
  const [deliveryMode, setDeliveryMode]   = useState<'bezorgen' | 'afhalen' | 'reserveren'>('bezorgen');
  const [filtersOpen, setFiltersOpen]     = useState(false);
  const [isMobile, setIsMobile]           = useState(false);

  useEffect(() => {
    // Read address from localStorage
    const saved = localStorage.getItem('enjoyAddress');
    if (saved) setAddress(saved);

    // Load real restaurants
    fetch('/api/restaurants')
      .then(r => r.json())
      .then(data => {
        const real: RestaurantRow[] = (data.restaurants || []).map((t: any) => ({
          name: t.name, slug: t.slug || '', cuisine: t.tagline || 'Restaurant',
          rating: 0, time: '30–45', img: t.logo || '/food/hero-feast.png',
          delivery: 'Gratis', min: 0, open: true, category: 'restaurant',
        }));
        if (real.length > 0) setRestaurants(real);
      })
      .catch(() => {});

    // Responsive
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  /* Toggle cuisine multi-select */
  const toggleCuisine = (label: string) => {
    setActiveCuisines(prev => {
      const next = new Set(prev);
      next.has(label) ? next.delete(label) : next.add(label);
      return next;
    });
  };

  /* Filter logic */
  const selectedCat = topCats[activeTopCat];
  const filtered = restaurants.filter(r => {
    if (selectedCat.key !== 'restaurant' && r.category !== selectedCat.key) return false;
    if (search && !r.name.toLowerCase().includes(search.toLowerCase()) && !r.cuisine.toLowerCase().includes(search.toLowerCase())) return false;
    if (openOnly && !r.open) return false;
    if (freeDelivery && r.delivery !== 'Gratis') return false;
    if (minOrder === '10' && r.min > 10) return false;
    if (minOrder === '15' && r.min > 15) return false;
    if (activeCuisines.size > 0) {
      const c = cuisines.find(x => activeCuisines.has(x.label));
      if (c && !r.cuisine.toLowerCase().includes(c.match.toLowerCase()) &&
          !r.name.toLowerCase().includes(c.match.toLowerCase())) {
        // Check if at least one active cuisine matches
        const anyMatch = [...activeCuisines].some(label => {
          const chip = cuisines.find(x => x.label === label);
          return chip && (r.cuisine.toLowerCase().includes(chip.match.toLowerCase()) || r.name.toLowerCase().includes(chip.match.toLowerCase()));
        });
        if (!anyMatch) return false;
      }
    }
    return true;
  });

  const visibleCuisines = showAllCuisines ? cuisines : cuisines.slice(0, 8);

  /* Sidebar content (shared between desktop aside and mobile drawer) */
  const SidebarContent = () => (
    <div>
      <p style={{ fontSize: 20, fontWeight: 900, marginBottom: 20, color: 'white' }}>
        {filtered.length} Partners
      </p>
      {[
        { label: 'Nu geopend',       val: openOnly,     set: setOpenOnly },
        { label: 'Gratis bezorging', val: freeDelivery, set: setFreeDelivery },
      ].map(({ label, val, set }) => (
        <div key={label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
          <span style={{ fontSize: 14, fontWeight: 600, color: 'rgba(255,255,255,0.88)' }}>{label}</span>
          <Toggle val={val} onToggle={() => set(!val)} />
        </div>
      ))}
      <div style={{ height: 1, background: 'rgba(255,255,255,0.08)', margin: '12px 0 16px' }} />
      <p style={{ fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.45)', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 12 }}>Minimum bestelling</p>
      {[
        { val: 'all', label: 'Toon alles',        count: restaurants.length },
        { val: '10',  label: '€ 10,00 of minder', count: restaurants.filter(r => r.min <= 10).length },
        { val: '15',  label: '€ 15,00 of minder', count: restaurants.filter(r => r.min <= 15).length },
      ].map(opt => (
        <label key={opt.val} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12, cursor: 'pointer' }} onClick={() => setMinOrder(opt.val)}>
          <div style={{ width: 20, height: 20, borderRadius: '50%', border: `2px solid ${minOrder === opt.val ? PINK : 'rgba(255,255,255,0.3)'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            {minOrder === opt.val && <div style={{ width: 10, height: 10, borderRadius: '50%', background: PINK }} />}
          </div>
          <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.75)' }}>{opt.label} ({opt.count})</span>
        </label>
      ))}
      {/* Reset filters */}
      {(openOnly || freeDelivery || minOrder !== 'all' || activeCuisines.size > 0) && (
        <button onClick={() => { setOpenOnly(false); setFreeDelivery(false); setMinOrder('all'); setActiveCuisines(new Set()); }}
          style={{ marginTop: 16, width: '100%', padding: '10px', borderRadius: 12, background: 'rgba(255,128,0,0.12)', border: '1px solid rgba(255,128,0,0.3)', color: PINK, fontWeight: 700, cursor: 'pointer', fontSize: 13 }}>
          Reset filters
        </button>
      )}
    </div>
  );

  return (
    <div style={{ background: '#1C1C1C', minHeight: '100vh', color: 'white', fontFamily: '"Outfit", "Helvetica Neue", sans-serif' }}>

      {/* ══ NON-STICKY HEADER ══ */}
      <header style={{ background: '#1C1C1C', borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
        {/* Top nav row */}
        <div style={{ height: 62, display: 'flex', alignItems: 'center', padding: '0 20px', gap: 12 }}>
          <Logo />
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, flexWrap: 'wrap' }}>
            {/* Address pill */}
            <Link href="/" style={{
              display: 'flex', alignItems: 'center', gap: 6,
              background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: 22, padding: '7px 14px', cursor: 'pointer', maxWidth: 280,
            }}>
              <span style={{ color: PINK, fontSize: 14 }}>📍</span>
              <span style={{ fontSize: 13, fontWeight: 600, color: 'rgba(255,255,255,0.9)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {address || 'Voeg adres toe'}
              </span>
              <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.4)', flexShrink: 0 }}>▼</span>
            </Link>

            {/* Delivery mode toggle */}
            <div style={{ display: 'flex', background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 22, padding: 3, gap: 2 }}>
              {([
                { key: 'bezorgen',   icon: '🛵', label: 'Bezorgen' },
                { key: 'afhalen',    icon: '🏪', label: 'Afhalen' },
                { key: 'reserveren', icon: '🍽️', label: 'Reserveren' },
              ] as const).map(({ key, icon, label }) => (
                <button key={key} onClick={() => setDeliveryMode(key)} style={{
                  display: 'flex', alignItems: 'center', gap: 5,
                  padding: isMobile ? '6px 10px' : '7px 14px',
                  borderRadius: 18, border: 'none',
                  background: deliveryMode === key ? `linear-gradient(135deg,${PURPLE},${PINK})` : 'transparent',
                  color: deliveryMode === key ? 'white' : 'rgba(255,255,255,0.5)',
                  fontSize: 13, fontWeight: 700, cursor: 'pointer', whiteSpace: 'nowrap',
                  transition: 'all 0.2s',
                }}>
                  <span>{icon}</span>{!isMobile && <span>{label}</span>}
                </button>
              ))}
            </div>
          </div>

          {/* Right */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
            <div style={{ width: 28, height: 20, borderRadius: 3, overflow: 'hidden', border: '1px solid rgba(255,255,255,0.15)', cursor: 'pointer', flexShrink: 0 }}>
              <div style={{ height: '33%', background: '#AE1C28' }} />
              <div style={{ height: '34%', background: '#FFFFFF' }} />
              <div style={{ height: '33%', background: '#21468B' }} />
            </div>
            <Link href="/account/orders" style={{ width: 36, height: 36, borderRadius: '50%', background: 'rgba(255,255,255,0.07)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16 }}>👤</Link>
          </div>
        </div>

        {/* Top category strip — transparent floating images (screenshot 1) */}
        <div style={{ background: '#242424', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
          <div className="scroll-x" style={{ display: 'flex', justifyContent: 'flex-start', padding: '0 8px' }}>
            {topCats.map((cat, i) => (
              <CatIcon key={i} cat={cat} active={activeTopCat === i} onClick={() => setActiveTopCat(i)} />
            ))}
          </div>
        </div>
      </header>

      {/* ══ MAIN LAYOUT ══ */}
      <div style={{ display: 'flex', maxWidth: 1280, margin: '0 auto', padding: isMobile ? '16px 16px' : '24px 20px', gap: 32, alignItems: 'flex-start' }}>

        {/* ─── Desktop sidebar ─── */}
        {!isMobile && (
          <aside style={{ width: 220, flexShrink: 0 }}>
            <SidebarContent />
          </aside>
        )}

        {/* ─── Main content ─── */}
        <div style={{ flex: 1, minWidth: 0 }}>
          {/* Search + Sort + Mobile filters button */}
          <div style={{ display: 'flex', gap: 10, alignItems: 'center', marginBottom: 16, flexWrap: isMobile ? 'wrap' : 'nowrap' }}>
            <div style={{
              flex: 1, display: 'flex', alignItems: 'center', gap: 10,
              background: '#2C2C2C', borderRadius: 40,
              border: '1px solid rgba(255,255,255,0.1)', padding: '0 18px', height: 50, minWidth: 0,
            }}>
              <span style={{ fontSize: 16, color: 'rgba(255,255,255,0.35)', flexShrink: 0 }}>🔍</span>
              <input type="text" placeholder="Iets vinden?" value={search} onChange={e => setSearch(e.target.value)}
                style={{ flex: 1, background: 'transparent', border: 'none', color: 'white', fontSize: 14, outline: 'none', fontFamily: 'inherit', minWidth: 0 }} />
              {search && (
                <button onClick={() => setSearch('')} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.4)', cursor: 'pointer', fontSize: 16, flexShrink: 0 }}>✕</button>
              )}
            </div>
            {!isMobile && (
              <>
                <span style={{ fontSize: 13, fontWeight: 700, color: 'rgba(255,255,255,0.65)', whiteSpace: 'nowrap' }}>Sorteren op</span>
                <div style={{ position: 'relative' }}>
                  <select value={sort} onChange={e => setSort(e.target.value)} style={{
                    appearance: 'none', background: '#2C2C2C', border: '1px solid rgba(255,255,255,0.12)',
                    borderRadius: 12, color: 'white', padding: '11px 40px 11px 16px',
                    fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit', outline: 'none', minWidth: 150,
                  }}>
                    <option>Beste match</option>
                    <option>Beoordeling</option>
                    <option>Levertijd</option>
                    <option>Bezorgkosten</option>
                  </select>
                  <span style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: 'rgba(255,255,255,0.4)', fontSize: 11 }}>▼</span>
                </div>
              </>
            )}
            {/* Mobile: filters button */}
            {isMobile && (
              <button onClick={() => setFiltersOpen(true)} style={{
                flexShrink: 0, height: 50, padding: '0 16px', borderRadius: 40,
                background: '#2C2C2C', border: '1px solid rgba(255,255,255,0.12)',
                color: 'white', fontSize: 13, fontWeight: 700, cursor: 'pointer',
                display: 'flex', alignItems: 'center', gap: 6,
              }}>⚙️ Filters {(openOnly || freeDelivery || minOrder !== 'all' || activeCuisines.size > 0) ? `(${[openOnly, freeDelivery, minOrder !== 'all', activeCuisines.size > 0].filter(Boolean).length})` : ''}</button>
            )}
          </div>

          {/* Cuisine chips (screenshot 2 style) */}
          <div className="scroll-x" style={{ display: 'flex', gap: 10, alignItems: 'flex-start', marginBottom: 24, paddingBottom: 4 }}>
            {visibleCuisines.map((c, i) => (
              <CuisineChip key={i} c={c} active={activeCuisines.has(c.label)} onClick={() => toggleCuisine(c.label)} />
            ))}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 7, minWidth: 82, flexShrink: 0 }}>
              <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => setShowAllCuisines(!showAllCuisines)}
                style={{ width: 86, height: 86, borderRadius: 22, background: 'rgba(255,255,255,0.08)', border: '2px solid rgba(255,255,255,0.2)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: 20, fontWeight: 700, flexShrink: 0 }}>
                {showAllCuisines ? '‹' : '›'}
              </motion.button>
              <span style={{ fontSize: 12, fontWeight: 700, color: 'rgba(255,255,255,0.7)', whiteSpace: 'nowrap' }}>Toon alles</span>
            </div>
          </div>

          {/* Section header */}
          <h2 style={{ fontSize: 20, fontWeight: 900, marginBottom: 16, color: 'rgba(255,255,255,0.9)' }}>
            {selectedCat.label.replace('\n', ' ')} — {filtered.length} partners
          </h2>

          {/* Restaurant grid */}
          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fill, minmax(280px, 1fr))', gap: 14, paddingBottom: 80 }}>
            {filtered.length === 0 ? (
              <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '60px 0', color: 'rgba(255,255,255,0.2)' }}>
                <p style={{ fontSize: 40, marginBottom: 12 }}>🍽️</p>
                <p style={{ fontSize: 18, fontWeight: 700 }}>Geen restaurants gevonden</p>
                <p style={{ fontSize: 13, marginTop: 8 }}>Pas je filters aan</p>
                <button onClick={() => { setSearch(''); setOpenOnly(false); setFreeDelivery(false); setMinOrder('all'); setActiveCuisines(new Set()); setActiveTopCat(0); }}
                  style={{ marginTop: 16, padding: '10px 24px', borderRadius: 12, background: `linear-gradient(135deg,${PURPLE},${PINK})`, border: 'none', color: 'white', fontWeight: 700, cursor: 'pointer', fontSize: 14 }}>
                  Reset alles
                </button>
              </div>
            ) : filtered.map((r, i) => (
              <Link key={r.slug || r.name} href={r.slug ? `/menu/${r.slug}` : '#'} style={{ textDecoration: 'none', display: 'block' }}>
                <motion.div
                  initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}
                  whileHover={{ y: -2, boxShadow: '0 8px 28px rgba(0,0,0,0.45)' }}
                  style={{ background: '#2A2A2A', borderRadius: 14, overflow: 'hidden', cursor: 'pointer', border: '1px solid rgba(255,255,255,0.07)', transition: 'box-shadow 0.2s' }}>
                  <div style={{ height: 156, position: 'relative', overflow: 'hidden' }}>
                    <img src={r.img} alt={r.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, transparent 50%, rgba(0,0,0,0.5) 100%)' }} />
                    {!r.open && (
                      <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.62)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <span style={{ background: '#333', color: 'rgba(255,255,255,0.75)', padding: '7px 18px', borderRadius: 10, fontSize: 13, fontWeight: 700 }}>Gesloten</span>
                      </div>
                    )}
                    {r.rating > 0 && (
                      <div style={{ position: 'absolute', top: 10, right: 10, background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(8px)', borderRadius: 8, padding: '3px 9px', fontSize: 12, fontWeight: 800, color: '#FFD700' }}>
                        ⭐ {r.rating}
                      </div>
                    )}
                    {r.delivery === 'Gratis' && (
                      <div style={{ position: 'absolute', top: 10, left: 10, background: '#27AE60', borderRadius: 8, padding: '3px 9px', fontSize: 11, fontWeight: 800, color: 'white' }}>
                        Gratis bezorging
                      </div>
                    )}
                  </div>
                  <div style={{ padding: '12px 14px 14px' }}>
                    <h3 style={{ fontSize: 14, fontWeight: 800, marginBottom: 2, color: 'white' }}>{r.name}</h3>
                    <p style={{ color: 'rgba(255,255,255,0.42)', fontSize: 12, marginBottom: 8 }}>{r.cuisine}</p>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12, fontSize: 12 }}>
                      <span style={{ color: 'rgba(255,255,255,0.5)' }}>🕐 {r.time} min</span>
                      <span style={{ color: r.delivery === 'Gratis' ? '#2ECC71' : 'rgba(255,255,255,0.5)' }}>{r.delivery === 'Gratis' ? '✓ Gratis' : r.delivery}</span>
                      {r.min > 0 && <span style={{ color: 'rgba(255,255,255,0.3)' }}>Min. €{r.min}</span>}
                    </div>
                  </div>
                </motion.div>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* ══ MOBILE FILTERS DRAWER ══ */}
      <AnimatePresence>
        {filtersOpen && (
          <>
            <motion.div key="backdrop" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setFiltersOpen(false)}
              style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.65)', zIndex: 200 }} />
            <motion.div key="drawer" initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }} transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              style={{ position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 201, background: '#2A2A2A', borderRadius: '20px 20px 0 0', padding: 24, maxHeight: '80vh', overflowY: 'auto' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                <h3 style={{ fontSize: 18, fontWeight: 900 }}>Filters</h3>
                <button onClick={() => setFiltersOpen(false)} style={{ background: 'none', border: 'none', color: 'white', fontSize: 22, cursor: 'pointer' }}>✕</button>
              </div>
              <SidebarContent />
              <button onClick={() => setFiltersOpen(false)} style={{ width: '100%', marginTop: 20, padding: '14px', borderRadius: 14, background: `linear-gradient(135deg,${PURPLE},${PINK})`, border: 'none', color: 'white', fontWeight: 800, fontSize: 16, cursor: 'pointer' }}>
                Toon {filtered.length} resultaten
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <JoyaChatWidget />
    </div>
  );
}

export default function DiscoverPage() {
  return <TranslationProvider><DiscoverContent /></TranslationProvider>;
}
