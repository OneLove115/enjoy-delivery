'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { TranslationProvider } from '../context/TranslationContext';
import { JoyaChatWidget } from '../components/JoyaChatWidget';

/* ─── Top Category Strip ─── */
const topCats = [
  { label: 'Restaurants',           img: '/food/cat-restaurants.jpg' },
  { label: 'Boodschappen',          img: '/food/cat-boodschappen.jpg' },
  { label: 'Alcohol',               img: '/food/cat-alcohol.jpg' },
  { label: 'Cadeaus',               img: '/food/cat-cadeaus.jpg' },
  { label: 'Snoep & IJs',           img: '/food/cat-snoep.jpg' },
  { label: 'Speciaalzaken',         img: '/food/cat-speciaal.jpg' },
  { label: 'Bakkerijen',            img: '/food/cat-bakkerijen.jpg' },
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

/* ─── Restaurants ─── */
const restaurants = [
  { name: 'Royal Kitchen',   cuisine: 'Indian · Curry',       rating: 4.8, time: '25-35', img: '/food/royal-kitchen.png',  delivery: 'Gratis', min: 10,  open: true },
  { name: 'Burger Empire',   cuisine: 'Burgers · American',   rating: 4.6, time: '15-25', img: '/food/burger-empire.png',  delivery: '€1,99',  min: 15,  open: true },
  { name: 'Sushi Palace',    cuisine: 'Japanese · Sushi',     rating: 4.9, time: '30-40', img: '/food/sushi-palace.png',   delivery: 'Gratis', min: 20,  open: true },
  { name: 'Pizza Throne',    cuisine: 'Italian · Pizza',      rating: 4.7, time: '20-30', img: '/food/pizza-throne.png',   delivery: '€0,99',  min: 12,  open: true },
  { name: 'Taco Kingdom',    cuisine: 'Mexican · Street',     rating: 4.5, time: '20-30', img: '/food/taco-kingdom.png',   delivery: 'Gratis', min: 18,  open: false },
  { name: 'Pho Dynasty',     cuisine: 'Vietnamese · Soups',   rating: 4.8, time: '25-35', img: '/food/hero-feast.png',     delivery: '€1,50',  min: 15,  open: true },
  { name: 'Kebab Palace',    cuisine: 'Turkish · Shoarma',    rating: 4.4, time: '20-35', img: '/food/royal-kitchen.png',  delivery: 'Gratis', min: 8,   open: true },
  { name: 'Dragon Wok',      cuisine: 'Chinese · Asian',      rating: 4.6, time: '25-40', img: '/food/sushi-palace.png',   delivery: '€2,00',  min: 20,  open: false },
  { name: 'Mama Mia',        cuisine: 'Italian · Pasta',      rating: 4.7, time: '30-45', img: '/food/pizza-throne.png',   delivery: 'Gratis', min: 14,  open: true },
];

/* ─── Top Category Icon (photo-based) ─── */
function CatIcon({ cat, active, onClick }: { cat: typeof topCats[0]; active: boolean; onClick: () => void }) {
  return (
    <button onClick={onClick} style={{
      display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8,
      padding: '16px 16px 12px', background: 'transparent', border: 'none', cursor: 'pointer',
      borderBottom: active ? '3px solid #E8703A' : '3px solid transparent',
      transition: 'border-color 0.2s', minWidth: 96,
    }}>
      <div style={{
        width: 88, height: 80, position: 'relative', borderRadius: 12, overflow: 'hidden',
        boxShadow: '0 4px 16px rgba(0,0,0,0.5)',
      }}>
        <img
          src={cat.img}
          alt={cat.label}
          style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.3s' }}
        />
        {/* subtle dark vignette so photos read on dark bg */}
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, transparent 40%, rgba(0,0,0,0.25) 100%)' }} />
      </div>
      <span style={{
        fontSize: 12, fontWeight: 600, textAlign: 'center', lineHeight: 1.3, maxWidth: 88,
        color: active ? 'white' : 'rgba(255,255,255,0.65)',
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
      padding: 0, background: 'transparent', border: 'none', cursor: 'pointer', minWidth: 88,
    }}>
      <div style={{
        width: 88, height: 88, borderRadius: 22, background: c.bg, overflow: 'hidden', position: 'relative',
        border: active ? '3px solid white' : '3px solid transparent',
        boxShadow: active ? '0 0 0 2px rgba(255,255,255,0.3)' : '0 4px 12px rgba(0,0,0,0.3)',
        transition: 'all 0.2s',
      }}>
        {c.halal ? (
          <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: c.bg }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 11, fontWeight: 900, color: 'white', letterSpacing: 0.5, lineHeight: 1 }}>حلال</div>
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

/* ─── Toggle Switch ─── */
function Toggle({ val, onToggle }: { val: boolean; onToggle: () => void }) {
  return (
    <button onClick={onToggle} style={{
      width: 48, height: 26, borderRadius: 13, border: 'none', cursor: 'pointer', position: 'relative',
      background: val ? '#E8703A' : 'rgba(255,255,255,0.18)', transition: 'background 0.25s', flexShrink: 0,
    }}>
      <span style={{
        position: 'absolute', top: 3, left: val ? 25 : 3, width: 20, height: 20,
        borderRadius: '50%', background: 'white', transition: 'left 0.25s',
        display: 'block', boxShadow: '0 1px 4px rgba(0,0,0,0.3)',
      }} />
    </button>
  );
}

/* ─── Main Content ─── */
function DiscoverContent() {
  const [search, setSearch]             = useState('');
  const [sort, setSort]                 = useState('Beste match');
  const [openOnly, setOpenOnly]         = useState(false);
  const [newOnly, setNewOnly]           = useState(false);
  const [freeDelivery, setFreeDelivery] = useState(false);
  const [minOrder, setMinOrder]         = useState('all');
  const [activeCuisine, setActiveCuisine] = useState<string | null>(null);
  const [activeTopCat, setActiveTopCat]   = useState(0);
  const [showAllCuisines, setShowAllCuisines] = useState(false);

  const filtered = restaurants.filter(r => {
    if (search && !r.name.toLowerCase().includes(search.toLowerCase()) && !r.cuisine.toLowerCase().includes(search.toLowerCase())) return false;
    if (openOnly && !r.open) return false;
    if (freeDelivery && r.delivery !== 'Gratis') return false;
    if (minOrder === '10' && r.min > 10) return false;
    if (minOrder === '15' && r.min > 15) return false;
    if (activeCuisine) {
      const chip = cuisines.find(x => x.label === activeCuisine);
      if (chip && !r.cuisine.toLowerCase().includes(chip.label.replace('...', '').toLowerCase()) && !r.name.toLowerCase().includes(chip.label.replace('...', '').toLowerCase())) return false;
    }
    return true;
  });

  const visibleCuisines = showAllCuisines ? cuisines : cuisines.slice(0, 7);

  return (
    <div style={{ background: '#1C1C1C', minHeight: '100vh', color: 'white', fontFamily: '"Inter", "Helvetica Neue", sans-serif' }}>

      {/* ══ NAVBAR — non-sticky, relative position ══ */}
      <nav style={{
        position: 'relative',
        background: '#1C1C1C',
        borderBottom: '1px solid rgba(255,255,255,0.07)',
        zIndex: 10,
      }}>
        <div style={{ height: 68, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 24px' }}>

          {/* Logo */}
          <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 8, textDecoration: 'none', flexShrink: 0 }}>
            <div style={{ width: 36, height: 36, background: 'linear-gradient(135deg, #E8703A, #FF4500)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>🛵</div>
            <span style={{ fontSize: 20, fontWeight: 900, color: 'white' }}>
              En<span style={{ color: '#E8703A' }}>Joy</span><span style={{ color: '#E8703A', fontSize: 13 }}>.nl</span>
            </span>
          </Link>

          {/* CENTER: location + delivery tabs */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, position: 'absolute', left: '50%', transform: 'translateX(-50%)' }}>
            {/* Location pill */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'rgba(255,255,255,0.07)', borderRadius: 20, padding: '6px 16px', cursor: 'pointer' }}>
              <span style={{ fontSize: 14 }}>📍</span>
              <span style={{ fontSize: 13, fontWeight: 600, color: 'rgba(255,255,255,0.9)', whiteSpace: 'nowrap' }}>Hengelolaan 115, 2545 JD Den Haag</span>
              <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.4)' }}>▼</span>
            </div>
            {/* Bezorgen / Afhalen / Reserveren */}
            <div style={{ display: 'flex', background: 'rgba(255,255,255,0.07)', borderRadius: 20, padding: 3, gap: 2 }}>
              {[
                { icon: '🔥', label: 'Bezorgen',   active: true },
                { icon: '🏪', label: 'Afhalen',    active: false },
                { icon: '🍽️', label: 'Reserveren', active: false },
              ].map(({ icon, label, active }) => (
                <button key={label} style={{
                  display: 'flex', alignItems: 'center', gap: 5, padding: '7px 14px',
                  borderRadius: 16, border: 'none',
                  background: active ? '#333' : 'transparent',
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
            <button style={{ width: 40, height: 40, borderRadius: '50%', background: 'rgba(255,255,255,0.07)', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: 18, position: 'relative' }}>
              ☰
              <span style={{ position: 'absolute', top: 6, right: 6, width: 8, height: 8, borderRadius: '50%', background: '#E8703A' }} />
            </button>
          </div>
        </div>
      </nav>

      {/* ══ TOP CATEGORY STRIP — high-quality photo icons ══ */}
      <div style={{ background: '#252525', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <div style={{ display: 'flex', justifyContent: 'center', overflowX: 'auto', padding: '0 16px', scrollbarWidth: 'none' }}>
          {topCats.map((cat, i) => (
            <CatIcon key={i} cat={cat} active={activeTopCat === i} onClick={() => setActiveTopCat(i)} />
          ))}
        </div>
      </div>

      {/* ══ MAIN LAYOUT ══ */}
      <div style={{ display: 'flex', maxWidth: 1280, margin: '0 auto', padding: '28px 24px', gap: 36, alignItems: 'flex-start' }}>

        {/* ── LEFT SIDEBAR ── */}
        <aside style={{ width: 210, flexShrink: 0, paddingTop: 4 }}>
          <p style={{ fontSize: 22, fontWeight: 900, marginBottom: 24, lineHeight: 1 }}>{filtered.length} Partners</p>

          {[
            { label: 'Nu geopend',       val: openOnly,     set: setOpenOnly },
            { label: 'Nieuw',            val: newOnly,      set: setNewOnly },
            { label: 'Gratis bezorging', val: freeDelivery, set: setFreeDelivery },
          ].map(({ label, val, set }) => (
            <div key={label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 22 }}>
              <span style={{ fontSize: 15, fontWeight: 600, color: 'rgba(255,255,255,0.88)' }}>{label}</span>
              <Toggle val={val} onToggle={() => set(!val)} />
            </div>
          ))}

          <div style={{ height: 1, background: 'rgba(255,255,255,0.08)', margin: '12px 0 20px' }} />

          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 14 }}>
            <span style={{ fontSize: 13, fontWeight: 700, color: 'rgba(255,255,255,0.55)', textTransform: 'uppercase', letterSpacing: 0.5 }}>Minimum bestelbedrag</span>
            <div style={{ width: 16, height: 16, borderRadius: '50%', background: '#E8703A', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 900, color: 'white', flexShrink: 0 }}>i</div>
          </div>
          {[
            { val: 'all', label: 'Toon alles',          count: restaurants.length },
            { val: '10',  label: '€ 10,00 of minder',   count: restaurants.filter(r => r.min <= 10).length },
            { val: '15',  label: '€ 15,00 of minder',   count: restaurants.filter(r => r.min <= 15).length },
          ].map(opt => (
            <label key={opt.val} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14, cursor: 'pointer' }} onClick={() => setMinOrder(opt.val)}>
              <div style={{ width: 22, height: 22, borderRadius: '50%', border: `2px solid ${minOrder === opt.val ? '#E8703A' : 'rgba(255,255,255,0.3)'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, transition: 'border-color 0.2s' }}>
                {minOrder === opt.val && <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#E8703A' }} />}
              </div>
              <span style={{ fontSize: 14, color: 'rgba(255,255,255,0.78)', lineHeight: 1.3 }}>{opt.label} ({opt.count})</span>
            </label>
          ))}
        </aside>

        {/* ── RIGHT CONTENT ── */}
        <div style={{ flex: 1, minWidth: 0 }}>

          {/* Search + Sort */}
          <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 20 }}>
            <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 12, background: '#2C2C2C', borderRadius: 40, border: '1px solid rgba(255,255,255,0.1)', padding: '0 20px', height: 52 }}>
              <span style={{ fontSize: 18, color: 'rgba(255,255,255,0.35)' }}>🔍</span>
              <input
                type="text" placeholder="Iets vinden?" value={search} onChange={e => setSearch(e.target.value)}
                style={{ flex: 1, background: 'transparent', border: 'none', color: 'white', fontSize: 15, outline: 'none', fontFamily: 'inherit' }}
              />
            </div>
            <span style={{ fontSize: 14, fontWeight: 700, color: 'rgba(255,255,255,0.75)', whiteSpace: 'nowrap' }}>Sorteren op</span>
            <div style={{ position: 'relative' }}>
              <select value={sort} onChange={e => setSort(e.target.value)} style={{
                appearance: 'none', WebkitAppearance: 'none', background: '#2C2C2C',
                border: '1px solid rgba(255,255,255,0.12)', borderRadius: 12, color: 'white',
                padding: '12px 44px 12px 18px', fontSize: 14, fontWeight: 600, cursor: 'pointer',
                fontFamily: 'inherit', outline: 'none', minWidth: 170,
              }}>
                <option>Beste match</option>
                <option>Beoordeling</option>
                <option>Levertijd</option>
                <option>Bezorgkosten</option>
              </select>
              <span style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: 'rgba(255,255,255,0.5)', fontSize: 12 }}>▼</span>
            </div>
            <button style={{ width: 52, height: 52, borderRadius: 12, background: '#2C2C2C', border: '1px solid rgba(255,255,255,0.12)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, color: 'rgba(255,255,255,0.6)', flexShrink: 0 }}>
              ⚙️
            </button>
          </div>

          {/* Cuisine Chips */}
          <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start', marginBottom: 32, overflowX: 'auto', paddingBottom: 4, scrollbarWidth: 'none' }}>
            {visibleCuisines.map((c, i) => (
              <CuisineChip key={i} c={c} active={activeCuisine === c.label} onClick={() => setActiveCuisine(activeCuisine === c.label ? null : c.label)} />
            ))}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, minWidth: 88, flexShrink: 0 }}>
              <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => setShowAllCuisines(!showAllCuisines)}
                style={{ width: 52, height: 52, borderRadius: '50%', background: 'transparent', border: '2px solid rgba(255,255,255,0.35)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: 22, fontWeight: 700, flexShrink: 0, transition: 'border-color 0.2s', marginTop: 18 }}>
                {showAllCuisines ? '‹' : '›'}
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
              <motion.div key={i} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}
                whileHover={{ y: -2, boxShadow: '0 8px 32px rgba(0,0,0,0.4)' }}
                style={{ background: '#2A2A2A', borderRadius: 16, overflow: 'hidden', cursor: 'pointer', border: '1px solid rgba(255,255,255,0.07)', transition: 'box-shadow 0.2s' }}>
                {/* Restaurant image */}
                <div style={{ height: 168, position: 'relative', overflow: 'hidden' }}>
                  <img src={r.img} alt={r.name} style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.3s' }} />
                  <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, transparent 50%, rgba(0,0,0,0.5) 100%)' }} />
                  {!r.open && (
                    <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.65)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <span style={{ background: '#333', color: 'rgba(255,255,255,0.75)', padding: '8px 20px', borderRadius: 10, fontSize: 14, fontWeight: 700, letterSpacing: 0.5 }}>Gesloten</span>
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
                {/* Info */}
                <div style={{ padding: '14px 16px 16px' }}>
                  <h3 style={{ fontSize: 15, fontWeight: 800, marginBottom: 3, color: 'white' }}>{r.name}</h3>
                  <p style={{ color: 'rgba(255,255,255,0.42)', fontSize: 13, marginBottom: 10 }}>{r.cuisine}</p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 14, fontSize: 13 }}>
                    <span style={{ color: 'rgba(255,255,255,0.5)', display: 'flex', alignItems: 'center', gap: 4 }}>🕐 {r.time} min</span>
                    <span style={{ color: r.delivery === 'Gratis' ? '#2ECC71' : 'rgba(255,255,255,0.5)' }}>
                      {r.delivery === 'Gratis' ? '✓ Gratis' : r.delivery}
                    </span>
                    <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: 12 }}>Min. €{r.min}</span>
                  </div>
                </div>
              </motion.div>
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
