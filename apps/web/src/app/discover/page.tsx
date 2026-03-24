'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { TranslationProvider } from '../context/TranslationContext';
import { JoyaChatWidget } from '../components/JoyaChatWidget';

const ORANGE = '#FF6B00';
const PURPLE = '#5A31F4';
const PINK   = '#FF0080';
const GREEN  = '#00C37A';

/* ─── Types ─── */
type RestaurantRow = {
  name: string; slug: string; cuisine: string; rating: number;
  time: string; img: string; delivery: string; min: number;
  open: boolean; category: string; openTime?: string;
};
type Cuisine = { bg: string; img: string | null; label: string; match: string; halal?: boolean };
type FilterChip = { label: string; icon: string | null; key: string };

/* ─── Data ─── */
const topCats = [
  { label: 'Restaurants',  img: '/food/hero-feast.png',  key: 'restaurant' },
  { label: 'Boodschappen', img: '/food/cat-curry.png',   key: 'grocery'    },
  { label: 'Alcohol',      img: '/food/cat-kebab.png',   key: 'alcohol'    },
  { label: 'Speciaalzaken',img: '/food/cat-sushi.png',   key: 'specialty'  },
  { label: 'Bakkerijen',   img: '/food/cat-pizza.png',   key: 'bakery'     },
  { label: 'Cadeaus',      img: '/food/cat-dessert.png', key: 'gift'       },
  { label: 'Gezondheid',   img: '/food/cat-curry.png',   key: 'health'     },
];

const cuisines: Cuisine[] = [
  { bg: '#E8703A', img: '/food/cat-pizza.png',   label: 'Italiaanse pizza', match: 'Italian'  },
  { bg: '#3D2B6B', img: '/food/cat-burger.png',  label: 'Burgers',          match: 'Burger'   },
  { bg: '#C0392B', img: '/food/cat-dessert.png', label: 'Snacks',           match: 'Snack'    },
  { bg: '#D4850A', img: '/food/cat-curry.png',   label: 'Kip',              match: 'Curry'    },
  { bg: '#5B9BD5', img: '/food/cat-kebab.png',   label: 'Shoarma',          match: 'Shoarma'  },
  { bg: '#D4608A', img: '/food/cat-sushi.png',   label: 'Sushi',            match: 'Sushi'    },
  { bg: '#2D6A4F', img: null,                    label: '100% Halal', match: 'Halal', halal: true },
  { bg: '#4A235A', img: '/food/cat-curry.png',   label: 'Vegetarisch',      match: 'Vegetar'  },
];

const FILTER_CHIPS: FilterChip[] = [
  { label: 'Aanbiedingen',   icon: '🏷', key: 'deals'  },
  { label: 'Vegetarisch',    icon: null,  key: 'veg'    },
  { label: 'Vegan',          icon: null,  key: 'vegan'  },
  { label: 'Stempelkaart',   icon: null,  key: 'stamp'  },
  { label: 'Gratis bezorging', icon: null, key: 'free'  },
];

const DEMO: RestaurantRow[] = [
  { name: 'Royal Kitchen', slug: '', cuisine: 'Indian · Curry',     rating: 4.8, time: '25-35', img: '/food/royal-kitchen.png', delivery: 'Gratis', min: 10, open: true,  category: 'restaurant' },
  { name: 'Burger Empire', slug: '', cuisine: 'Burgers · American', rating: 4.6, time: '15-25', img: '/food/burger-empire.png', delivery: '€1,99',  min: 15, open: true,  category: 'restaurant' },
  { name: 'Sushi Palace',  slug: '', cuisine: 'Japanese · Sushi',   rating: 4.9, time: '30-40', img: '/food/sushi-palace.png',  delivery: 'Gratis', min: 20, open: true,  category: 'restaurant' },
  { name: 'Pizza Throne',  slug: '', cuisine: 'Italian · Pizza',    rating: 4.7, time: '20-30', img: '/food/pizza-throne.png',  delivery: '€0,99',  min: 12, open: true,  category: 'restaurant' },
  { name: 'Taco Kingdom',  slug: '', cuisine: 'Mexican · Street',   rating: 4.5, time: '20-30', img: '/food/taco-kingdom.png',  delivery: 'Gratis', min: 18, open: false, category: 'restaurant', openTime: '17:00' },
  { name: 'Pho Dynasty',   slug: '', cuisine: 'Vietnamese · Soups', rating: 4.8, time: '25-35', img: '/food/hero-feast.png',    delivery: '€1,50',  min: 15, open: true,  category: 'restaurant' },
  { name: 'Kebab Palace',  slug: '', cuisine: 'Turkish · Shoarma',  rating: 4.4, time: '20-35', img: '/food/royal-kitchen.png', delivery: 'Gratis', min: 8,  open: false, category: 'restaurant', openTime: '15:00' },
  { name: 'Dragon Wok',    slug: '', cuisine: 'Chinese · Asian',    rating: 4.6, time: '25-40', img: '/food/sushi-palace.png',  delivery: '€2,00',  min: 20, open: false, category: 'restaurant', openTime: '16:30' },
  { name: 'Mama Mia',      slug: '', cuisine: 'Italian · Pasta',    rating: 4.7, time: '30-45', img: '/food/pizza-throne.png',  delivery: 'Gratis', min: 14, open: true,  category: 'restaurant' },
];

/* ─── Bottom nav ─── */
function BottomNav() {
  const path = usePathname();
  const tabs = [
    { href: '/discover',       key: 'home',    label: 'Home',        svg: <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />, filled: true  },
    { href: '/account/orders', key: 'orders',  label: 'Bestellingen',svg: <><rect x="5" y="2" width="14" height="20" rx="2"/><line x1="9" y1="7" x2="15" y2="7"/><line x1="9" y1="11" x2="15" y2="11"/><line x1="9" y1="15" x2="13" y2="15"/></>, filled: false },
    { href: '/rewards',        key: 'rewards', label: 'Beloningen',  svg: <><polyline points="20 12 20 22 4 22 4 12"/><rect x="2" y="7" width="20" height="5"/><line x1="12" y1="22" x2="12" y2="7"/><path d="M12 7H7.5a2.5 2.5 0 010-5C11 2 12 7 12 7z"/><path d="M12 7h4.5a2.5 2.5 0 000-5C13 2 12 7 12 7z"/></>, filled: false },
    { href: '/account',        key: 'account', label: 'Account',     svg: <><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></>, filled: false },
  ];
  return (
    <nav style={{
      position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 100,
      background: '#1C1C1E', borderTop: '1px solid rgba(255,255,255,0.08)',
      display: 'flex', paddingBottom: 'env(safe-area-inset-bottom, 0px)',
    }}>
      {tabs.map(t => {
        const active = path === t.href;
        const col = active ? ORANGE : 'rgba(255,255,255,0.4)';
        return (
          <Link key={t.href} href={t.href} style={{
            flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center',
            justifyContent: 'center', gap: 3, textDecoration: 'none', padding: '10px 0 12px',
          }}>
            <svg width="24" height="24" viewBox="0 0 24 24"
              fill={t.filled ? col : 'none'}
              stroke={t.filled ? 'none' : col}
              strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              {t.svg}
            </svg>
            <span style={{ fontSize: 10, fontWeight: active ? 700 : 500, color: col }}>{t.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}

/* ─── Category icon ─── */
function CatIcon({ cat, active, onClick }: { cat: typeof topCats[0]; active: boolean; onClick: () => void }) {
  return (
    <button onClick={onClick} style={{
      display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 7,
      padding: '12px 10px 10px', background: 'transparent', border: 'none', cursor: 'pointer',
      borderBottom: active ? `3px solid ${ORANGE}` : '3px solid transparent',
      transition: 'border-color 0.2s', minWidth: 78, flexShrink: 0,
    }}>
      <div style={{ width: 76, height: 60, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <img src={cat.img} alt={cat.label} style={{
          maxWidth: 76, maxHeight: 60, objectFit: 'contain',
          filter: active ? 'drop-shadow(0 4px 12px rgba(255,107,0,0.5))' : 'drop-shadow(0 2px 8px rgba(0,0,0,0.5))',
          transform: active ? 'scale(1.1)' : 'scale(1)', transition: 'transform 0.2s, filter 0.2s',
        }} />
      </div>
      <span style={{ fontSize: 11, fontWeight: 700, textAlign: 'center', color: active ? 'white' : 'rgba(255,255,255,0.58)' }}>
        {cat.label}
      </span>
    </button>
  );
}

/* ─── Cuisine chip (squircle) ─── */
function CuisineChip({ c, active, onClick }: { c: Cuisine; active: boolean; onClick: () => void }) {
  return (
    <motion.button whileTap={{ scale: 0.94 }} onClick={onClick} style={{
      display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6,
      padding: 0, background: 'transparent', border: 'none', cursor: 'pointer', minWidth: 82, flexShrink: 0,
    }}>
      <div style={{
        width: 84, height: 84, borderRadius: 22, background: c.bg, overflow: 'hidden', position: 'relative',
        border: active ? '3px solid white' : '3px solid transparent',
        boxShadow: active ? '0 0 0 2px rgba(255,255,255,0.25), 0 6px 20px rgba(0,0,0,0.4)' : '0 4px 14px rgba(0,0,0,0.35)',
        transition: 'all 0.2s',
      }}>
        {c.halal ? (
          <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ fontSize: 20, fontWeight: 900, color: 'white', fontFamily: 'serif' }}>حلال</div>
            <div style={{ fontSize: 10, fontWeight: 900, color: 'white', letterSpacing: 1 }}>HALAL</div>
          </div>
        ) : c.img ? (
          <img src={c.img} alt={c.label} style={{ width: '115%', height: '115%', objectFit: 'cover', marginLeft: '-7.5%', marginTop: '-7.5%' }} />
        ) : null}
      </div>
      <span style={{ fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.85)', textAlign: 'center', maxWidth: 82, lineHeight: 1.3 }}>{c.label}</span>
    </motion.button>
  );
}

/* ─── Restaurant card — big image mobile style ─── */
function RestaurantCard({ r }: { r: RestaurantRow }) {
  return (
    <Link href={r.slug ? `/menu/${r.slug}` : '#'} style={{ textDecoration: 'none', display: 'block', marginBottom: 20 }}>
      <div style={{ borderRadius: 16, overflow: 'hidden', background: '#2A2A2A' }}>
        {!r.open && r.openTime && (
          <div style={{ background: '#333', padding: '8px 16px', textAlign: 'center', fontSize: 13, color: 'rgba(255,255,255,0.65)', fontWeight: 600 }}>
            Opent om {r.openTime}
          </div>
        )}
        <div style={{ position: 'relative', height: 190 }}>
          <img src={r.img} alt={r.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          {!r.open && <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.48)' }} />}
          {/* Logo badge */}
          <div style={{
            position: 'absolute', bottom: 12, left: 12,
            width: 54, height: 54, borderRadius: 13, background: 'white',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 4px 14px rgba(0,0,0,0.5)', border: '2px solid rgba(255,255,255,0.15)',
            fontSize: 26, overflow: 'hidden',
          }}>🍽️</div>
          {r.rating > 0 && (
            <div style={{
              position: 'absolute', top: 10, right: 10,
              background: 'rgba(0,0,0,0.72)', backdropFilter: 'blur(6px)',
              borderRadius: 8, padding: '3px 9px', fontSize: 12, fontWeight: 800, color: '#FFD700',
            }}>⭐ {r.rating}</div>
          )}
          {r.delivery === 'Gratis' && r.open && (
            <div style={{
              position: 'absolute', top: 10, left: 10,
              background: '#27AE60', borderRadius: 8, padding: '3px 10px', fontSize: 11, fontWeight: 800, color: 'white',
            }}>Gratis bezorging</div>
          )}
        </div>
      </div>
      <div style={{ padding: '10px 4px 0' }}>
        <h3 style={{ fontSize: 15, fontWeight: 800, color: 'white', marginBottom: 3 }}>{r.name}</h3>
        <div style={{ display: 'flex', gap: 6, fontSize: 12, color: 'rgba(255,255,255,0.45)', flexWrap: 'wrap' }}>
          {!r.open ? (
            <span style={{ color: '#FF6B6B' }}>Gesloten</span>
          ) : (
            <>
              <span>{r.delivery === 'Gratis' ? '✓ Gratis bezorging' : `Bezorging ${r.delivery}`}</span>
              <span>·</span><span>{r.time} min</span>
              {r.min > 0 && <><span>·</span><span>Min. €{r.min}</span></>}
            </>
          )}
        </div>
      </div>
    </Link>
  );
}

/* ─── Toggle ─── */
function Toggle({ val, onToggle }: { val: boolean; onToggle: () => void }) {
  return (
    <button onClick={onToggle} style={{
      width: 46, height: 26, borderRadius: 13, border: 'none', cursor: 'pointer',
      position: 'relative', background: val ? ORANGE : 'rgba(255,255,255,0.18)', transition: 'background 0.25s',
    }}>
      <span style={{
        position: 'absolute', top: 3, left: val ? 23 : 3, width: 20, height: 20,
        borderRadius: '50%', background: 'white', transition: 'left 0.25s', display: 'block',
        boxShadow: '0 1px 4px rgba(0,0,0,0.3)',
      }} />
    </button>
  );
}

/* ─── Main ─── */
function DiscoverContent() {
  const [restaurants, setRestaurants]       = useState<RestaurantRow[]>(DEMO);
  const [address, setAddress]               = useState('');
  const [search, setSearch]                 = useState('');
  const [sort, setSort]                     = useState('Beste match');
  const [openOnly, setOpenOnly]             = useState(false);
  const [freeDelivery, setFreeDelivery]     = useState(false);
  const [minOrder, setMinOrder]             = useState('all');
  const [activeTopCat, setActiveTopCat]     = useState(0);
  const [activeCuisines, setActiveCuisines] = useState<Set<string>>(new Set());
  const [activeChips, setActiveChips]       = useState<Set<string>>(new Set());
  const [deliveryMode, setDeliveryMode]     = useState<'bezorgen' | 'afhalen'>('bezorgen');
  const [filtersOpen, setFiltersOpen]       = useState(false);
  const [isMobile, setIsMobile]             = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('enjoyAddress');
    if (saved) setAddress(saved);

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

    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  const toggleCuisine = (label: string) =>
    setActiveCuisines(prev => { const n = new Set(prev); n.has(label) ? n.delete(label) : n.add(label); return n; });

  const toggleChip = (key: string) =>
    setActiveChips(prev => { const n = new Set(prev); n.has(key) ? n.delete(key) : n.add(key); return n; });

  const selectedCat = topCats[activeTopCat];
  const applyFreeDelivery = freeDelivery || activeChips.has('free');

  const filtered = restaurants.filter(r => {
    if (selectedCat.key !== 'restaurant' && r.category !== selectedCat.key) return false;
    if (search && !r.name.toLowerCase().includes(search.toLowerCase()) && !r.cuisine.toLowerCase().includes(search.toLowerCase())) return false;
    if (openOnly && !r.open) return false;
    if (applyFreeDelivery && r.delivery !== 'Gratis') return false;
    if (minOrder === '10' && r.min > 10) return false;
    if (minOrder === '15' && r.min > 15) return false;
    if (activeCuisines.size > 0) {
      const anyMatch = [...activeCuisines].some(label => {
        const chip = cuisines.find(x => x.label === label);
        return chip && (r.cuisine.toLowerCase().includes(chip.match.toLowerCase()) || r.name.toLowerCase().includes(chip.match.toLowerCase()));
      });
      if (!anyMatch) return false;
    }
    return true;
  });

  const openRestaurants   = filtered.filter(r => r.open);
  const closedRestaurants = filtered.filter(r => !r.open);

  const resetAll = () => {
    setSearch(''); setOpenOnly(false); setFreeDelivery(false);
    setMinOrder('all'); setActiveCuisines(new Set()); setActiveTopCat(0); setActiveChips(new Set());
  };

  /* Sidebar filters (shared between desktop aside + mobile drawer) */
  const SidebarContent = () => (
    <div>
      <p style={{ fontSize: 20, fontWeight: 900, marginBottom: 20, color: 'white' }}>{filtered.length} Partners</p>
      {([
        { label: 'Nu geopend',       val: openOnly,     set: setOpenOnly     },
        { label: 'Gratis bezorging', val: freeDelivery, set: setFreeDelivery },
      ] as const).map(({ label, val, set }) => (
        <div key={label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
          <span style={{ fontSize: 14, fontWeight: 600, color: 'rgba(255,255,255,0.88)' }}>{label}</span>
          <Toggle val={val} onToggle={() => set(!val)} />
        </div>
      ))}
      <div style={{ height: 1, background: 'rgba(255,255,255,0.08)', margin: '12px 0 16px' }} />
      <p style={{ fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.45)', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 12 }}>Minimum bestelling</p>
      {[
        { val: 'all', label: 'Toon alles',        count: restaurants.length         },
        { val: '10',  label: '€ 10,00 of minder', count: restaurants.filter(r => r.min <= 10).length },
        { val: '15',  label: '€ 15,00 of minder', count: restaurants.filter(r => r.min <= 15).length },
      ].map(opt => (
        <label key={opt.val} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12, cursor: 'pointer' }} onClick={() => setMinOrder(opt.val)}>
          <div style={{ width: 20, height: 20, borderRadius: '50%', border: `2px solid ${minOrder === opt.val ? ORANGE : 'rgba(255,255,255,0.3)'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            {minOrder === opt.val && <div style={{ width: 10, height: 10, borderRadius: '50%', background: ORANGE }} />}
          </div>
          <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.75)' }}>{opt.label} ({opt.count})</span>
        </label>
      ))}
      {(openOnly || freeDelivery || minOrder !== 'all' || activeCuisines.size > 0) && (
        <button onClick={resetAll} style={{ marginTop: 16, width: '100%', padding: '10px', borderRadius: 12, background: 'rgba(255,107,0,0.12)', border: `1px solid ${ORANGE}`, color: ORANGE, fontWeight: 700, cursor: 'pointer', fontSize: 13 }}>
          Reset filters
        </button>
      )}
    </div>
  );

  return (
    <div style={{ background: '#1C1C1C', minHeight: '100vh', color: 'white', fontFamily: '"Outfit","Helvetica Neue",sans-serif', paddingBottom: isMobile ? 72 : 0 }}>

      {/* ══ HEADER (non-sticky) ══ */}
      <header style={{ background: '#1C1C1C', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>

        {/* Row 1: Address + Delivery mode */}
        <div style={{ padding: '16px 16px 12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
          <Link href="/" style={{ textDecoration: 'none', flex: 1, minWidth: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
              <span style={{ fontSize: isMobile ? 17 : 21, fontWeight: 900, color: 'white', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {address || 'Voeg adres toe'}
              </span>
              <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.45)', flexShrink: 0, marginTop: 2 }}>▼</span>
            </div>
          </Link>

          {/* Bezorgen / Afhalen pill toggle */}
          <div style={{ display: 'flex', alignItems: 'center', background: '#2A2A2A', borderRadius: 22, border: '1px solid rgba(255,255,255,0.1)', padding: 4, gap: 2, flexShrink: 0 }}>
            <button
              onClick={() => setDeliveryMode('bezorgen')}
              style={{
                width: 36, height: 30, borderRadius: 16, border: 'none', cursor: 'pointer',
                background: deliveryMode === 'bezorgen' ? 'rgba(255,255,255,0.1)' : 'transparent',
                fontSize: 17, display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'background 0.2s',
              }}
              title="Bezorgen"
            >🚲</button>
            <button
              onClick={() => setDeliveryMode('afhalen')}
              style={{
                padding: '6px 13px', borderRadius: 16, border: 'none', cursor: 'pointer',
                background: deliveryMode === 'afhalen' ? 'white' : 'transparent',
                color: deliveryMode === 'afhalen' ? '#1C1C1C' : 'rgba(255,255,255,0.45)',
                fontSize: 13, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 5, transition: 'all 0.2s',
              }}
            >🥡 Afhalen</button>
          </div>
        </div>

        {/* Row 2: Search bar */}
        <div style={{ padding: '0 16px 14px', display: 'flex', gap: 8, alignItems: 'center' }}>
          <div style={{
            flex: 1, display: 'flex', alignItems: 'center', gap: 10,
            background: '#2A2A2A', borderRadius: 40, border: '1px solid rgba(255,255,255,0.08)',
            padding: '0 16px', height: 48, minWidth: 0,
          }}>
            <span style={{ fontSize: 16, color: ORANGE, flexShrink: 0 }}>🔍</span>
            <input
              type="text" placeholder="Restaurants vinden?" value={search}
              onChange={e => setSearch(e.target.value)}
              style={{ flex: 1, background: 'transparent', border: 'none', color: 'white', fontSize: 14, outline: 'none', fontFamily: 'inherit', minWidth: 0 }}
            />
            {search && (
              <button onClick={() => setSearch('')} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.35)', cursor: 'pointer', fontSize: 16, flexShrink: 0 }}>✕</button>
            )}
          </div>
          {/* Filter sliders icon */}
          <button
            onClick={() => setFiltersOpen(true)}
            style={{
              width: 48, height: 48, borderRadius: '50%', cursor: 'pointer',
              background: '#2A2A2A', border: '1px solid rgba(255,255,255,0.08)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
            }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.7)" strokeWidth="2" strokeLinecap="round">
              <line x1="4" y1="6" x2="20" y2="6"/><line x1="8" y1="12" x2="16" y2="12"/><line x1="11" y1="18" x2="13" y2="18"/>
            </svg>
          </button>
          {/* AI Joya button */}
          <button style={{
            width: 48, height: 48, borderRadius: '50%', border: 'none', cursor: 'pointer',
            background: `linear-gradient(135deg,${ORANGE},#FF3355)`,
            display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
            boxShadow: '0 4px 16px rgba(255,107,0,0.4)', fontSize: 20,
          }}>✦</button>
        </div>

        {/* Row 3: Category strip */}
        <div style={{ background: '#242424', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
          <div className="scroll-x" style={{ display: 'flex', padding: '0 4px' }}>
            {topCats.map((cat, i) => (
              <CatIcon key={i} cat={cat} active={activeTopCat === i} onClick={() => setActiveTopCat(i)} />
            ))}
          </div>
        </div>
      </header>

      {/* ══ CONTENT ══ */}
      {isMobile ? (
        /* ─── MOBILE ─── */
        <div style={{ padding: '20px 16px' }}>

          {/* "Vind iets lekkers" + "Toon alles" */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
            <h2 style={{ fontSize: 17, fontWeight: 900 }}>Vind iets lekkers</h2>
            <Link href="#" style={{ fontSize: 13, fontWeight: 700, color: GREEN, textDecoration: 'none' }}>Toon alles</Link>
          </div>

          {/* Cuisine squircle chips */}
          <div className="scroll-x" style={{ display: 'flex', gap: 10, marginBottom: 22, paddingBottom: 4 }}>
            {cuisines.map((c, i) => (
              <CuisineChip key={i} c={c} active={activeCuisines.has(c.label)} onClick={() => toggleCuisine(c.label)} />
            ))}
          </div>

          {/* Text filter chips */}
          <div className="scroll-x" style={{ display: 'flex', gap: 8, marginBottom: 22 }}>
            {FILTER_CHIPS.map(chip => {
              const on = activeChips.has(chip.key);
              return (
                <button
                  key={chip.key}
                  onClick={() => toggleChip(chip.key)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 5,
                    padding: '8px 14px', borderRadius: 20, flexShrink: 0,
                    border: `1.5px solid ${on ? ORANGE : 'rgba(255,255,255,0.2)'}`,
                    background: on ? 'rgba(255,107,0,0.14)' : 'transparent',
                    color: on ? ORANGE : 'rgba(255,255,255,0.75)',
                    fontSize: 13, fontWeight: 700, cursor: 'pointer', whiteSpace: 'nowrap',
                  }}
                >
                  {chip.icon && <span>{chip.icon}</span>}
                  {chip.label}
                </button>
              );
            })}
          </div>

          {/* Restaurant count */}
          <p style={{ fontSize: 16, fontWeight: 900, color: 'white', marginBottom: 18 }}>
            Bestel bij {filtered.length} locaties
          </p>

          {/* Open restaurants */}
          {openRestaurants.map((r, i) => <RestaurantCard key={r.slug || r.name + i} r={r} />)}

          {/* Binnenkort geopend */}
          {closedRestaurants.length > 0 && (
            <>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, margin: '8px 0 16px' }}>
                <h3 style={{ fontSize: 16, fontWeight: 900 }}>Binnenkort geopend</h3>
                <div style={{ width: 18, height: 18, borderRadius: '50%', border: '1.5px solid rgba(255,255,255,0.35)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, color: 'rgba(255,255,255,0.45)', cursor: 'pointer' }}>i</div>
              </div>
              {closedRestaurants.map((r, i) => <RestaurantCard key={r.slug || r.name + i} r={r} />)}
            </>
          )}

          {filtered.length === 0 && (
            <div style={{ textAlign: 'center', padding: '60px 0', color: 'rgba(255,255,255,0.3)' }}>
              <p style={{ fontSize: 40, marginBottom: 12 }}>🍽️</p>
              <p style={{ fontSize: 18, fontWeight: 700, color: 'rgba(255,255,255,0.6)' }}>Geen restaurants gevonden</p>
              <button onClick={resetAll} style={{ marginTop: 16, padding: '10px 24px', borderRadius: 12, background: `linear-gradient(135deg,${ORANGE},${PINK})`, border: 'none', color: 'white', fontWeight: 700, cursor: 'pointer', fontSize: 14 }}>Reset alles</button>
            </div>
          )}
        </div>

      ) : (
        /* ─── DESKTOP ─── */
        <div style={{ display: 'flex', maxWidth: 1280, margin: '0 auto', padding: '28px 24px', gap: 36, alignItems: 'flex-start' }}>
          <aside style={{ width: 220, flexShrink: 0 }}><SidebarContent /></aside>
          <div style={{ flex: 1, minWidth: 0 }}>
            {/* Desktop search + sort */}
            <div style={{ display: 'flex', gap: 10, alignItems: 'center', marginBottom: 22 }}>
              <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 10, background: '#2C2C2C', borderRadius: 40, border: '1px solid rgba(255,255,255,0.1)', padding: '0 18px', height: 50 }}>
                <span style={{ color: ORANGE }}>🔍</span>
                <input type="text" placeholder="Restaurants vinden?" value={search} onChange={e => setSearch(e.target.value)}
                  style={{ flex: 1, background: 'transparent', border: 'none', color: 'white', fontSize: 14, outline: 'none', fontFamily: 'inherit' }} />
              </div>
              <span style={{ fontSize: 13, fontWeight: 700, color: 'rgba(255,255,255,0.5)', whiteSpace: 'nowrap' }}>Sorteren op</span>
              <select value={sort} onChange={e => setSort(e.target.value)}
                style={{ appearance: 'none', background: '#2C2C2C', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 12, color: 'white', padding: '11px 36px 11px 16px', fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit', outline: 'none', minWidth: 150 }}>
                <option>Beste match</option><option>Beoordeling</option><option>Levertijd</option><option>Bezorgkosten</option>
              </select>
            </div>
            {/* Cuisine chips */}
            <div className="scroll-x" style={{ display: 'flex', gap: 10, marginBottom: 24 }}>
              {cuisines.map((c, i) => <CuisineChip key={i} c={c} active={activeCuisines.has(c.label)} onClick={() => toggleCuisine(c.label)} />)}
            </div>
            <h2 style={{ fontSize: 18, fontWeight: 900, marginBottom: 18 }}>{selectedCat.label} — {filtered.length} partners</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(280px,1fr))', gap: 14, paddingBottom: 40 }}>
              {filtered.length === 0 ? (
                <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '60px 0', color: 'rgba(255,255,255,0.25)' }}>
                  <p style={{ fontSize: 40, marginBottom: 12 }}>🍽️</p>
                  <p style={{ fontSize: 18, fontWeight: 700 }}>Geen restaurants gevonden</p>
                  <button onClick={resetAll} style={{ marginTop: 16, padding: '10px 24px', borderRadius: 12, background: `linear-gradient(135deg,${PURPLE},${PINK})`, border: 'none', color: 'white', fontWeight: 700, cursor: 'pointer', fontSize: 14 }}>Reset alles</button>
                </div>
              ) : filtered.map((r, i) => (
                <Link key={r.slug || r.name + i} href={r.slug ? `/menu/${r.slug}` : '#'} style={{ textDecoration: 'none' }}>
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}
                    whileHover={{ y: -2 }}
                    style={{ background: '#2A2A2A', borderRadius: 14, overflow: 'hidden', border: '1px solid rgba(255,255,255,0.07)' }}>
                    <div style={{ height: 160, position: 'relative', overflow: 'hidden' }}>
                      <img src={r.img} alt={r.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      {!r.open && <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><span style={{ background: '#333', color: 'rgba(255,255,255,0.75)', padding: '7px 18px', borderRadius: 10, fontSize: 13, fontWeight: 700 }}>Gesloten</span></div>}
                      {r.rating > 0 && <div style={{ position: 'absolute', top: 10, right: 10, background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(8px)', borderRadius: 8, padding: '3px 9px', fontSize: 12, fontWeight: 800, color: '#FFD700' }}>⭐ {r.rating}</div>}
                    </div>
                    <div style={{ padding: '12px 14px 14px' }}>
                      <h3 style={{ fontSize: 14, fontWeight: 800, marginBottom: 2 }}>{r.name}</h3>
                      <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 12, marginBottom: 8 }}>{r.cuisine}</p>
                      <div style={{ display: 'flex', gap: 12, fontSize: 12 }}>
                        <span style={{ color: 'rgba(255,255,255,0.5)' }}>🕐 {r.time} min</span>
                        <span style={{ color: r.delivery === 'Gratis' ? '#2ECC71' : 'rgba(255,255,255,0.5)' }}>{r.delivery === 'Gratis' ? '✓ Gratis' : r.delivery}</span>
                      </div>
                    </div>
                  </motion.div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ══ FILTERS DRAWER ══ */}
      <AnimatePresence>
        {filtersOpen && (
          <>
            <motion.div key="bd" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setFiltersOpen(false)}
              style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.65)', zIndex: 200 }} />
            <motion.div key="dr" initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              style={{ position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 201, background: '#2A2A2A', borderRadius: '20px 20px 0 0', padding: 24, maxHeight: '80vh', overflowY: 'auto' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                <h3 style={{ fontSize: 18, fontWeight: 900 }}>Filters</h3>
                <button onClick={() => setFiltersOpen(false)} style={{ background: 'none', border: 'none', color: 'white', fontSize: 22, cursor: 'pointer' }}>✕</button>
              </div>
              <SidebarContent />
              <button onClick={() => setFiltersOpen(false)}
                style={{ width: '100%', marginTop: 20, padding: '14px', borderRadius: 14, background: `linear-gradient(135deg,${ORANGE},${PINK})`, border: 'none', color: 'white', fontWeight: 800, fontSize: 16, cursor: 'pointer' }}>
                Toon {filtered.length} resultaten
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {isMobile && <BottomNav />}
      <JoyaChatWidget />
    </div>
  );
}

export default function DiscoverPage() {
  return <TranslationProvider><DiscoverContent /></TranslationProvider>;
}
