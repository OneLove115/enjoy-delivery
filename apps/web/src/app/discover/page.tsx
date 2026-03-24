'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { TranslationProvider } from '../context/TranslationContext';
import { JoyaChatWidget } from '../components/JoyaChatWidget';

/* ─── Brand ─── */
const PURPLE = '#5A31F4';
const PINK   = '#FF0080';
const LOGO_GRADIENT = `linear-gradient(135deg, ${PURPLE}, ${PINK})`;

/* ─── Top Category Strip ─── */
const topCats = [
  { label: 'Restaurants',             img: '/food/cat-restaurants.jpg' },
  { label: 'Boodschappen',            img: '/food/cat-boodschappen.jpg' },
  { label: 'Alcohol',                 img: '/food/cat-alcohol.jpg' },
  { label: 'Speciaalzaken',           img: '/food/cat-speciaal.jpg' },
  { label: 'Cadeaus',                 img: '/food/cat-cadeaus.jpg' },
  { label: 'Snoep & IJs',            img: '/food/cat-snoep.jpg' },
  { label: 'Bakkerijen',              img: '/food/cat-bakkerijen.jpg' },
  { label: 'Gezondheid & Verzorging', img: '/food/cat-gezondheid.jpg' },
];

/* ─── Cuisine Chips ─── */
const cuisines = [
  { bg: '#E8703A', img: '/food/cat-pizza.png',   label: 'Italiaanse pi...' },
  { bg: '#5C3566', img: '/food/cat-burger.png',  label: 'Burgers' },
  { bg: '#C0392B', img: '/food/cat-kebab.png',   label: 'Snacks' },
  { bg: '#F5B940', img: '/food/cat-curry.png',   label: 'Kip' },
  { bg: '#AED6F1', img: '/food/cat-kebab.png',   label: 'Shoarma' },
  { bg: '#F1948A', img: '/food/cat-sushi.png',   label: 'Sushi' },
  { bg: '#E8703A', img: null,                    label: '100% Halal', halal: true },
  { bg: '#4A235A', img: '/food/cat-curry.png',   label: 'Vegetarisch' },
];

/* ─── Restaurant type ─── */
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
};

const DEMO_RESTAURANTS: RestaurantRow[] = [
  { name: 'Royal Kitchen',   slug: '', cuisine: 'Indian · Curry',       rating: 4.8, time: '25-35', img: '/food/royal-kitchen.png',  delivery: 'Gratis', min: 10,  open: true },
  { name: 'Burger Empire',   slug: '', cuisine: 'Burgers · American',   rating: 4.6, time: '15-25', img: '/food/burger-empire.png',  delivery: '€1,99',  min: 15,  open: true },
  { name: 'Sushi Palace',    slug: '', cuisine: 'Japanese · Sushi',     rating: 4.9, time: '30-40', img: '/food/sushi-palace.png',   delivery: 'Gratis', min: 20,  open: true },
  { name: 'Pizza Throne',    slug: '', cuisine: 'Italian · Pizza',      rating: 4.7, time: '20-30', img: '/food/pizza-throne.png',   delivery: '€0,99',  min: 12,  open: true },
  { name: 'Taco Kingdom',    slug: '', cuisine: 'Mexican · Street',     rating: 4.5, time: '20-30', img: '/food/taco-kingdom.png',   delivery: 'Gratis', min: 18,  open: false },
  { name: 'Pho Dynasty',     slug: '', cuisine: 'Vietnamese · Soups',   rating: 4.8, time: '25-35', img: '/food/hero-feast.png',     delivery: '€1,50',  min: 15,  open: true },
  { name: 'Kebab Palace',    slug: '', cuisine: 'Turkish · Shoarma',    rating: 4.4, time: '20-35', img: '/food/royal-kitchen.png',  delivery: 'Gratis', min: 8,   open: true },
  { name: 'Dragon Wok',      slug: '', cuisine: 'Chinese · Asian',      rating: 4.6, time: '25-40', img: '/food/sushi-palace.png',   delivery: '€2,00',  min: 20,  open: false },
  { name: 'Mama Mia',        slug: '', cuisine: 'Italian · Pasta',      rating: 4.7, time: '30-45', img: '/food/pizza-throne.png',   delivery: 'Gratis', min: 14,  open: true },
];

/* ─── EnJoy Logo ─── */
function Logo({ size = 22 }: { size?: number }) {
  return (
    <Link href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', flexShrink: 0 }}>
      <span style={{ fontSize: size, fontWeight: 900, color: 'white', lineHeight: 1 }}>
        En<span style={{ background: LOGO_GRADIENT, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Joy</span>
      </span>
    </Link>
  );
}

/* ─── Category Icon ─── */
function CatIcon({ cat, active, onClick }: { cat: typeof topCats[0]; active: boolean; onClick: () => void }) {
  return (
    <button onClick={onClick} style={{
      display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10,
      padding: '14px 18px 10px', background: 'transparent', border: 'none', cursor: 'pointer',
      borderBottom: active ? `3px solid ${PINK}` : '3px solid transparent',
      transition: 'border-color 0.2s', minWidth: 110, flexShrink: 0,
    }}>
      <div style={{ width: 120, height: 110, position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <img src={cat.img} alt={cat.label} style={{
          width: '100%', height: '100%', objectFit: 'cover', borderRadius: 14,
          filter: 'drop-shadow(0 6px 16px rgba(0,0,0,0.7)) brightness(1.05) saturate(1.2)',
          outline: active ? `3px solid ${PINK}` : '3px solid transparent',
          outlineOffset: 2,
          transition: 'outline 0.2s, transform 0.15s',
          transform: active ? 'scale(1.05)' : 'scale(1)',
        }} />
      </div>
      <span style={{
        fontSize: 12, fontWeight: 700, color: active ? 'white' : 'rgba(255,255,255,0.7)',
        textAlign: 'center', lineHeight: 1.3, maxWidth: 110,
      }}>
        {cat.label}
      </span>
    </button>
  );
}

/* ─── Cuisine Chip ─── */
function CuisineChip({ c, active, onClick }: { c: typeof cuisines[0]; active: boolean; onClick: () => void }) {
  return (
    <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }} onClick={onClick} style={{
      display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8,
      padding: 0, background: 'transparent', border: 'none', cursor: 'pointer', minWidth: 88, flexShrink: 0,
    }}>
      <div style={{
        width: 88, height: 88, borderRadius: 22, background: c.bg, overflow: 'hidden', position: 'relative',
        border: active ? '3px solid white' : '3px solid transparent',
        boxShadow: active ? '0 0 0 2px rgba(255,255,255,0.25)' : '0 4px 12px rgba(0,0,0,0.35)',
        transition: 'all 0.2s',
      }}>
        {c.halal ? (
          <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 11, fontWeight: 900, color: 'white', letterSpacing: 0.5 }}>حلال</div>
              <div style={{ fontSize: 13, fontWeight: 900, color: 'white', letterSpacing: 1 }}>HALAL</div>
            </div>
          </div>
        ) : c.img ? (
          <img src={c.img} alt={c.label} style={{ width: '110%', height: '110%', objectFit: 'cover', marginLeft: '-5%', marginTop: '-5%', filter: 'contrast(1.1) saturate(1.2)' }} />
        ) : null}
      </div>
      <span style={{ fontSize: 12, fontWeight: 700, color: 'rgba(255,255,255,0.85)', whiteSpace: 'nowrap' }}>{c.label}</span>
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

/* ─── Page ─── */
function DiscoverContent() {
  const [search, setSearch]               = useState('');
  const [sort, setSort]                   = useState('Beste match');
  const [openOnly, setOpenOnly]           = useState(false);
  const [newOnly, setNewOnly]             = useState(false);
  const [freeDelivery, setFreeDelivery]   = useState(false);
  const [minOrder, setMinOrder]           = useState('all');
  const [activeCuisine, setActiveCuisine] = useState<string | null>(null);
  const [activeTopCat, setActiveTopCat]   = useState(0);
  const [showAll, setShowAll]             = useState(false);
  const [restaurants, setRestaurants]     = useState<RestaurantRow[]>(DEMO_RESTAURANTS);

  useEffect(() => {
    fetch('/api/restaurants')
      .then(r => r.json())
      .then(data => {
        const real: RestaurantRow[] = (data.restaurants || []).map((t: any) => ({
          name: t.name,
          slug: t.slug || '',
          cuisine: t.tagline || 'Restaurant',
          rating: 0,
          time: '30–45',
          img: t.logo || '/food/hero-feast.png',
          delivery: 'Gratis',
          min: 0,
          open: true,
        }));
        if (real.length > 0) setRestaurants(real);
      })
      .catch(() => {/* keep demo data */});
  }, []);

  const filtered = restaurants.filter(r => {
    if (search && !r.name.toLowerCase().includes(search.toLowerCase()) && !r.cuisine.toLowerCase().includes(search.toLowerCase())) return false;
    if (openOnly && !r.open) return false;
    if (freeDelivery && r.delivery !== 'Gratis') return false;
    if (minOrder === '10' && r.min > 10) return false;
    if (minOrder === '15' && r.min > 15) return false;
    if (activeCuisine) {
      const chip = cuisines.find(x => x.label === activeCuisine);
      if (chip && !r.cuisine.toLowerCase().includes(chip.label.replace('...', '').toLowerCase()) &&
          !r.name.toLowerCase().includes(chip.label.replace('...', '').toLowerCase())) return false;
    }
    return true;
  });

  const visibleCuisines = showAll ? cuisines : cuisines.slice(0, 7);

  return (
    <div style={{ background: '#1C1C1C', minHeight: '100vh', color: 'white', fontFamily: '"Inter", "Helvetica Neue", sans-serif' }}>

      {/* ══════════════════════════════════════════
          NAVBAR — single row, non-sticky
      ══════════════════════════════════════════ */}
      <nav style={{
        position: 'relative',
        background: '#1C1C1C',
        borderBottom: '1px solid rgba(255,255,255,0.07)',
        height: 68,
        display: 'flex',
        alignItems: 'center',
        padding: '0 20px',
        gap: 12,
      }}>
        {/* Logo — left */}
        <Logo size={22} />

        {/* Center: location pill + delivery tabs — all inline */}
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
          {/* Location pill */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: 6,
            background: 'rgba(255,255,255,0.08)', borderRadius: 22,
            padding: '8px 16px', cursor: 'pointer', whiteSpace: 'nowrap',
          }}>
            <span style={{ fontSize: 14 }}>📍</span>
            <span style={{ fontSize: 13, fontWeight: 600, color: 'rgba(255,255,255,0.9)' }}>Hengelolaan 115, 2545 JD Den Haag</span>
            <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.4)' }}>▼</span>
          </div>

          {/* Delivery mode tabs */}
          <div style={{ display: 'flex', background: 'rgba(255,255,255,0.07)', borderRadius: 22, padding: 3, gap: 2 }}>
            {[
              { icon: '🔥', label: 'Bezorgen',   active: true },
              { icon: '🏪', label: 'Afhalen',    active: false },
              { icon: '🍽️', label: 'Reserveren', active: false },
            ].map(({ icon, label, active }) => (
              <button key={label} style={{
                display: 'flex', alignItems: 'center', gap: 5,
                padding: '7px 14px', borderRadius: 18, border: 'none',
                background: active ? `linear-gradient(135deg, ${PURPLE}, ${PINK})` : 'transparent',
                color: active ? 'white' : 'rgba(255,255,255,0.5)',
                fontSize: 13, fontWeight: 700, cursor: 'pointer', whiteSpace: 'nowrap',
              }}>
                <span>{icon}</span> {label}
              </button>
            ))}
          </div>
        </div>

        {/* Right: Dutch flag + hamburger */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
          <div style={{ width: 30, height: 20, borderRadius: 4, overflow: 'hidden', border: '1px solid rgba(255,255,255,0.15)', cursor: 'pointer' }}>
            <div style={{ height: '33.3%', background: '#AE1C28' }} />
            <div style={{ height: '33.4%', background: '#FFFFFF' }} />
            <div style={{ height: '33.3%', background: '#21468B' }} />
          </div>
          <button style={{
            width: 40, height: 40, borderRadius: '50%', background: 'rgba(255,255,255,0.07)',
            border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center',
            justifyContent: 'center', color: 'white', fontSize: 18, position: 'relative',
          }}>
            ☰
            <span style={{ position: 'absolute', top: 6, right: 6, width: 8, height: 8, borderRadius: '50%', background: PINK }} />
          </button>
        </div>
      </nav>

      {/* ══════════════════════════════════════════
          TOP CATEGORY STRIP — realistic photos
      ══════════════════════════════════════════ */}
      <div style={{ background: '#242424', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <div style={{ display: 'flex', justifyContent: 'center', overflowX: 'auto', padding: '0 12px', scrollbarWidth: 'none' }}>
          {topCats.map((cat, i) => (
            <CatIcon key={i} cat={cat} active={activeTopCat === i} onClick={() => setActiveTopCat(i)} />
          ))}
        </div>
      </div>

      {/* ══════════════════════════════════════════
          MAIN LAYOUT: sidebar + content
      ══════════════════════════════════════════ */}
      <div style={{ display: 'flex', maxWidth: 1280, margin: '0 auto', padding: '24px 20px', gap: 32, alignItems: 'flex-start' }}>

        {/* ─── LEFT SIDEBAR ─── */}
        <aside style={{ width: 220, flexShrink: 0 }}>
          <p style={{ fontSize: 22, fontWeight: 900, marginBottom: 24 }}>{filtered.length} Partners</p>

          {[
            { label: 'Nu geopend',       val: openOnly,     set: setOpenOnly },
            { label: 'Nieuw',            val: newOnly,      set: setNewOnly },
            { label: 'Gratis bezorging', val: freeDelivery, set: setFreeDelivery },
          ].map(({ label, val, set }) => (
            <div key={label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <span style={{ fontSize: 15, fontWeight: 600, color: 'rgba(255,255,255,0.88)' }}>{label}</span>
              <Toggle val={val} onToggle={() => set(!val)} />
            </div>
          ))}

          <div style={{ height: 1, background: 'rgba(255,255,255,0.08)', margin: '14px 0 18px' }} />

          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 12 }}>
            <span style={{ fontSize: 12, fontWeight: 700, color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: 0.5 }}>Minimum bestelbedrag</span>
            <div style={{ width: 16, height: 16, borderRadius: '50%', background: PINK, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 900, color: 'white', flexShrink: 0 }}>i</div>
          </div>
          {[
            { val: 'all', label: 'Toon alles',        count: restaurants.length },
            { val: '10',  label: '€ 10,00 of minder', count: restaurants.filter(r => r.min <= 10).length },
            { val: '15',  label: '€ 15,00 of minder', count: restaurants.filter(r => r.min <= 15).length },
          ].map(opt => (
            <label key={opt.val} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14, cursor: 'pointer' }} onClick={() => setMinOrder(opt.val)}>
              <div style={{
                width: 22, height: 22, borderRadius: '50%',
                border: `2px solid ${minOrder === opt.val ? PINK : 'rgba(255,255,255,0.3)'}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, transition: 'border-color 0.2s',
              }}>
                {minOrder === opt.val && <div style={{ width: 12, height: 12, borderRadius: '50%', background: PINK }} />}
              </div>
              <span style={{ fontSize: 14, color: 'rgba(255,255,255,0.78)', lineHeight: 1.3 }}>{opt.label} ({opt.count})</span>
            </label>
          ))}
        </aside>

        {/* ─── RIGHT CONTENT ─── */}
        <div style={{ flex: 1, minWidth: 0 }}>

          {/* Search + Sort */}
          <div style={{ display: 'flex', gap: 10, alignItems: 'center', marginBottom: 18 }}>
            <div style={{
              flex: 1, display: 'flex', alignItems: 'center', gap: 12,
              background: '#2C2C2C', borderRadius: 40,
              border: '1px solid rgba(255,255,255,0.1)', padding: '0 20px', height: 52,
            }}>
              <span style={{ fontSize: 18, color: 'rgba(255,255,255,0.35)' }}>🔍</span>
              <input
                type="text" placeholder="Iets vinden?" value={search}
                onChange={e => setSearch(e.target.value)}
                style={{ flex: 1, background: 'transparent', border: 'none', color: 'white', fontSize: 15, outline: 'none', fontFamily: 'inherit' }}
              />
            </div>
            <span style={{ fontSize: 14, fontWeight: 700, color: 'rgba(255,255,255,0.75)', whiteSpace: 'nowrap' }}>Sorteren op</span>
            <div style={{ position: 'relative' }}>
              <select value={sort} onChange={e => setSort(e.target.value)} style={{
                appearance: 'none', WebkitAppearance: 'none',
                background: '#2C2C2C', border: '1px solid rgba(255,255,255,0.12)',
                borderRadius: 12, color: 'white', padding: '12px 44px 12px 18px',
                fontSize: 14, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit',
                outline: 'none', minWidth: 160,
              }}>
                <option>Beste match</option>
                <option>Beoordeling</option>
                <option>Levertijd</option>
                <option>Bezorgkosten</option>
              </select>
              <span style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: 'rgba(255,255,255,0.5)', fontSize: 12 }}>▼</span>
            </div>
            <button style={{ width: 52, height: 52, borderRadius: 12, background: '#2C2C2C', border: '1px solid rgba(255,255,255,0.12)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, color: 'rgba(255,255,255,0.6)', flexShrink: 0 }}>⚙️</button>
          </div>

          {/* Cuisine Chips */}
          <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start', marginBottom: 28, overflowX: 'auto', paddingBottom: 4, scrollbarWidth: 'none' }}>
            {visibleCuisines.map((c, i) => (
              <CuisineChip key={i} c={c} active={activeCuisine === c.label} onClick={() => setActiveCuisine(activeCuisine === c.label ? null : c.label)} />
            ))}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, minWidth: 88, flexShrink: 0 }}>
              <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => setShowAll(!showAll)}
                style={{ width: 52, height: 52, borderRadius: '50%', background: 'transparent', border: '2px solid rgba(255,255,255,0.35)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: 22, fontWeight: 700, flexShrink: 0, marginTop: 18 }}>
                {showAll ? '‹' : '›'}
              </motion.button>
              <span style={{ fontSize: 12, fontWeight: 700, color: 'rgba(255,255,255,0.7)', whiteSpace: 'nowrap' }}>Toon alles</span>
            </div>
          </div>

          {/* Section Header */}
          <h2 style={{ fontSize: 24, fontWeight: 900, marginBottom: 20 }}>Lokale helden</h2>

          {/* Restaurant Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(290px, 1fr))', gap: 16, paddingBottom: 80 }}>
            {filtered.length === 0 ? (
              <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '80px 0', color: 'rgba(255,255,255,0.25)' }}>
                <p style={{ fontSize: 48, marginBottom: 16 }}>🍽️</p>
                <p style={{ fontSize: 20, fontWeight: 700 }}>Geen restaurants gevonden</p>
                <p style={{ fontSize: 14, marginTop: 8 }}>Pas je filters aan</p>
              </div>
            ) : filtered.map((r, i) => (
              <Link key={r.slug || r.name} href={r.slug ? `/menu/${r.slug}` : '#'} style={{ textDecoration: 'none', display: 'block' }}>
              <motion.div
                initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}
                whileHover={{ y: -2, boxShadow: '0 8px 32px rgba(0,0,0,0.4)' }}
                style={{ background: '#2A2A2A', borderRadius: 16, overflow: 'hidden', cursor: 'pointer', border: '1px solid rgba(255,255,255,0.07)', transition: 'box-shadow 0.2s' }}>
                <div style={{ height: 168, position: 'relative', overflow: 'hidden' }}>
                  <img src={r.img} alt={r.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, transparent 50%, rgba(0,0,0,0.5) 100%)' }} />
                  {!r.open && (
                    <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.65)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <span style={{ background: '#333', color: 'rgba(255,255,255,0.75)', padding: '8px 20px', borderRadius: 10, fontSize: 14, fontWeight: 700 }}>Gesloten</span>
                    </div>
                  )}
                  <div style={{ position: 'absolute', top: 10, right: 10, background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(8px)', borderRadius: 8, padding: '4px 10px', fontSize: 13, fontWeight: 800, color: '#FFD700', display: 'flex', alignItems: 'center', gap: 4 }}>
                    ⭐ {r.rating}
                  </div>
                  {r.delivery === 'Gratis' && (
                    <div style={{ position: 'absolute', top: 10, left: 10, background: '#27AE60', borderRadius: 8, padding: '4px 10px', fontSize: 11, fontWeight: 800, color: 'white' }}>
                      Gratis bezorging
                    </div>
                  )}
                </div>
                <div style={{ padding: '14px 16px 16px' }}>
                  <h3 style={{ fontSize: 15, fontWeight: 800, marginBottom: 3, color: 'white' }}>{r.name}</h3>
                  <p style={{ color: 'rgba(255,255,255,0.42)', fontSize: 13, marginBottom: 10 }}>{r.cuisine}</p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 14, fontSize: 13 }}>
                    <span style={{ color: 'rgba(255,255,255,0.5)' }}>🕐 {r.time} min</span>
                    <span style={{ color: r.delivery === 'Gratis' ? '#2ECC71' : 'rgba(255,255,255,0.5)' }}>
                      {r.delivery === 'Gratis' ? '✓ Gratis' : r.delivery}
                    </span>
                    <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: 12 }}>Min. €{r.min}</span>
                  </div>
                </div>
              </motion.div>
              </Link>
            ))}
          </div>
        </div>
      </div>

      <JoyaChatWidget />
    </div>
  );
}

export default function DiscoverPage() {
  return <TranslationProvider><DiscoverContent /></TranslationProvider>;
}
