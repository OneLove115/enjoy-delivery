'use client';
import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { TranslationProvider } from '../context/TranslationContext';
import { Footer } from '../components/Footer';
import { JoyaChatWidget } from '../components/JoyaChatWidget';

const ORANGE = '#FF6B00';
const PURPLE = '#5A31F4';
const PINK   = '#FF0080';
const GREEN  = '#00C37A';
const LOGO   = `linear-gradient(135deg, ${PURPLE}, ${PINK})`;

/* ─── Types ─── */
type RestaurantRow = {
  name: string; slug: string; cuisine: string; rating: number;
  time: string; img: string; delivery: string; min: number;
  open: boolean; category: string; openTime?: string;
  cuisineCategories?: string[];
};
type Cuisine = { bg: string; img: string; label: string; match: string };
type FilterChip = { label: string; icon: string | null; key: string };

/* ─── Data ─── */
const topCats = [
  { label: 'Restaurants',        img: '/cat/restaurants.png',  key: 'restaurant' },
  { label: 'Boodschappen',       img: '/cat/boodschappen.png', key: 'grocery'    },
  { label: 'Alcohol',            img: '/cat/alcohol.png',      key: 'alcohol'    },
  { label: 'Speciaalzaken',      img: '/cat/speciaalzaken.png',key: 'specialty'  },
  { label: 'Cadeaus',            img: '/cat/cadeaus.png',      key: 'gift'       },
  { label: 'Snoep & IJs',        img: '/cat/snoep-ijs.png',   key: 'sweet'      },
  { label: 'Bakkerijen',         img: '/cat/bakkerijen.png',   key: 'bakery'     },
  { label: 'Gezondheid &\nVerzorging', img: '/cat/gezondheid.png', key: 'health' },
];

const cuisines: Cuisine[] = [
  { bg: '#C0392B', img: '/cuisine/pizza.png',       label: 'Italiaanse pizza', match: 'Italian'  },
  { bg: '#3D2B6B', img: '/cuisine/burger.png',      label: 'Burgers',          match: 'Burger'   },
  { bg: '#7B4E2D', img: '/cuisine/snacks.png',      label: 'Snacks',           match: 'Snack'    },
  { bg: '#D4850A', img: '/cuisine/kip.png',         label: 'Kip',              match: 'Curry'    },
  { bg: '#5C7A3A', img: '/cuisine/shoarma.png',     label: 'Shoarma',          match: 'Shoarma'  },
  { bg: '#1A5276', img: '/cuisine/sushi.png',       label: 'Sushi',            match: 'Sushi'    },
  { bg: '#1A6E20', img: '/cuisine/halal.png',       label: '100% Halal',       match: 'Halal'    },
  { bg: '#4A235A', img: '/cuisine/vegetarisch.png', label: 'Vegetarisch',      match: 'Vegetar'  },
];

/* All cuisine categories (shown in "Alle categorieën" modal) */
const ALL_CUISINE_CATS: { label: string; count: number }[] = [
  { label: '100% Halal',      count: 19 }, { label: 'Afghaans',         count: 1  }, { label: 'Afrikaans',        count: 0  },
  { label: 'Amerikaans',      count: 1  }, { label: 'Amerikaanse pizza',count: 2  }, { label: 'Anders',           count: 1  },
  { label: 'Antilliaans',     count: 1  }, { label: 'Argentijns',       count: 0  }, { label: 'Aziatisch',        count: 10 },
  { label: 'Balkankeuken',    count: 1  }, { label: 'Broodjes',         count: 18 }, { label: 'Bubble Tea',       count: 6  },
  { label: 'Burgers',         count: 15 }, { label: 'Chinees',          count: 15 }, { label: 'Curry',            count: 6  },
  { label: 'Döner',           count: 13 }, { label: 'Egyptisch',        count: 1  }, { label: 'Falafel',          count: 2  },
  { label: 'Frans',           count: 0  }, { label: 'Gezond',           count: 1  }, { label: 'Glutenvrij',       count: 0  },
  { label: 'Grieks',          count: 0  }, { label: 'Grill',            count: 1  }, { label: 'Gyros',            count: 0  },
  { label: 'IJs',             count: 0  }, { label: 'Indiaas',          count: 9  }, { label: 'Indonesisch',      count: 12 },
  { label: 'Iraans',          count: 1  }, { label: 'Italiaans',        count: 5  }, { label: 'Italiaanse pizza', count: 23 },
  { label: 'Japans',          count: 13 }, { label: 'Kapsalon',         count: 11 }, { label: 'Kip',              count: 14 },
  { label: 'Koffie',          count: 0  }, { label: 'Koreaans',         count: 1  }, { label: 'Libanees',         count: 2  },
  { label: 'Lokale Helden',   count: 1  }, { label: 'Lunch',            count: 17 }, { label: 'Marokkaans',       count: 1  },
  { label: 'Mexicaans',       count: 2  }, { label: 'Nagerechten',      count: 3  }, { label: 'Noedels',          count: 7  },
  { label: 'Ontbijt',         count: 2  }, { label: 'Pannenkoeken',     count: 1  }, { label: 'Pasta',            count: 10 },
  { label: 'Patat',           count: 8  }, { label: 'Poké bowl',        count: 13 }, { label: 'Portugees',        count: 1  },
  { label: 'Roti',            count: 2  }, { label: 'Rundvlees',        count: 1  }, { label: 'Salades',          count: 3  },
  { label: 'Shoarma',         count: 1  }, { label: 'Smoothies/sappen', count: 3  }, { label: 'Snacks',           count: 19 },
  { label: 'Steaks',          count: 4  }, { label: 'Surinaams',        count: 5  }, { label: 'Sushi',            count: 18 },
  { label: 'Syrisch',         count: 1  }, { label: 'Taart',            count: 1  }, { label: "Taco's",           count: 2  },
  { label: 'Tandoori',        count: 2  }, { label: 'Thais',            count: 0  }, { label: 'Turks',            count: 18 },
  { label: 'Turkse pizza',    count: 7  }, { label: 'Vegan',            count: 12 }, { label: 'Vegetarisch',      count: 4  },
  { label: 'Vietnamees',      count: 1  }, { label: 'Vis',              count: 7  }, { label: 'Wok',              count: 9  },
  { label: 'Wraps',           count: 3  }, { label: 'Zeevruchten',      count: 1  },
];

const FILTER_CHIPS: FilterChip[] = [
  { label: 'Aanbiedingen',   icon: '🏷', key: 'deals'  },
  { label: 'Vegetarisch',    icon: null,  key: 'veg'    },
  { label: 'Vegan',          icon: null,  key: 'vegan'  },
  { label: 'Stempelkaart',   icon: null,  key: 'stamp'  },
  { label: 'Gratis bezorging', icon: null, key: 'free'  },
];

const DEALS = [
  { name: 'Royal Kitchen', deal: '30% korting',     emoji: '🍛', color: '#E8703A' },
  { name: 'Burger Empire', deal: 'Gratis bezorging', emoji: '🍔', color: '#3D2B6B' },
  { name: 'Sushi Palace',  deal: '2+1 gratis',      emoji: '🍣', color: '#D4608A' },
];

const DEMO: RestaurantRow[] = [
  { name: 'Royal Kitchen', slug: 'royal-kitchen', cuisine: 'Indian · Curry',     rating: 4.8, time: '25-35', img: '', delivery: 'Gratis', min: 10, open: true,  category: 'restaurant' },
  { name: 'Burger Empire', slug: 'burger-empire', cuisine: 'Burgers · American', rating: 4.6, time: '15-25', img: '', delivery: '€1,99',  min: 15, open: true,  category: 'restaurant' },
  { name: 'Sushi Palace',  slug: 'sushi-palace',  cuisine: 'Japanese · Sushi',   rating: 4.9, time: '30-40', img: '', delivery: 'Gratis', min: 20, open: true,  category: 'restaurant' },
  { name: 'Pizza Throne',  slug: 'pizza-throne',  cuisine: 'Italian · Pizza',    rating: 4.7, time: '20-30', img: '', delivery: '€0,99',  min: 12, open: true,  category: 'restaurant' },
  { name: 'Taco Kingdom',  slug: 'taco-kingdom',  cuisine: 'Mexican · Street',   rating: 4.5, time: '20-30', img: '', delivery: 'Gratis', min: 18, open: false, category: 'restaurant', openTime: '17:00' },
  { name: 'Pho Dynasty',   slug: 'pho-dynasty',   cuisine: 'Vietnamese · Soups', rating: 4.8, time: '25-35', img: '', delivery: '€1,50',  min: 15, open: true,  category: 'restaurant' },
  { name: 'Kebab Palace',  slug: 'kebab-palace',  cuisine: 'Turkish · Shoarma',  rating: 4.4, time: '20-35', img: '', delivery: 'Gratis', min: 8,  open: false, category: 'restaurant', openTime: '15:00' },
  { name: 'Dragon Wok',    slug: 'dragon-wok',    cuisine: 'Chinese · Asian',    rating: 4.6, time: '25-40', img: '', delivery: '€2,00',  min: 20, open: false, category: 'restaurant', openTime: '16:30' },
  { name: 'Mama Mia',      slug: 'mama-mia',      cuisine: 'Italian · Pasta',    rating: 4.7, time: '30-45', img: '', delivery: 'Gratis', min: 14, open: true,  category: 'restaurant' },
];

const RESTAURANT_EMOJIS: Record<string, string> = {
  'Royal Kitchen': '🍛', 'Burger Empire': '🍔', 'Sushi Palace': '🍣',
  'Pizza Throne': '🍕',  'Taco Kingdom': '🌮',  'Pho Dynasty': '🍜',
  'Kebab Palace': '🌯',  'Dragon Wok': '🥡',   'Mama Mia': '🍝',
};

/* ─── EnJoy Logo ─── */
function EnJoyLogo() {
  return (
    <Link href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', flexShrink: 0 }}>
      <span translate="no" style={{ fontSize: 22, fontWeight: 900, color: 'var(--text-primary)' }}>
        En<span style={{ background: LOGO, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Joy</span>
      </span>
    </Link>
  );
}

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
      background: 'var(--discover-nav)', borderTop: '1px solid var(--border)',
      display: 'flex', paddingBottom: 'env(safe-area-inset-bottom, 0px)',
    }}>
      {tabs.map(t => {
        const active = path === t.href;
        const col = active ? ORANGE : 'var(--t45)';
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

/* ─── Toggle ─── */
function Toggle({ val, onToggle }: { val: boolean; onToggle: () => void }) {
  return (
    <button onClick={onToggle} style={{
      position: 'relative', width: 46, height: 26, borderRadius: 13,
      background: val ? ORANGE : 'var(--b20)',
      border: 'none', cursor: 'pointer', transition: 'background 0.25s', flexShrink: 0,
    }}>
      <span style={{
        position: 'absolute', top: 3, left: val ? 23 : 3, width: 20, height: 20,
        borderRadius: '50%', background: 'white', transition: 'left 0.25s', display: 'block',
        boxShadow: '0 1px 4px rgba(0,0,0,0.3)',
      }} />
    </button>
  );
}

/* ─── Checkbox ─── */
function Checkbox({ label, checked, onChange, count }: { label: string; checked: boolean; onChange: (v: boolean) => void; count?: number }) {
  return (
    <label style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 11, cursor: 'pointer' }} onClick={() => onChange(!checked)}>
      <div style={{
        width: 22, height: 22, borderRadius: 5, flexShrink: 0,
        border: `2px solid ${checked ? ORANGE : 'var(--b20)'}`,
        background: checked ? ORANGE : 'transparent',
        display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.15s',
      }}>
        {checked && <svg width="12" height="10" viewBox="0 0 12 10"><polyline points="1.5 5 4.5 8 10.5 2" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" fill="none"/></svg>}
      </div>
      <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>
        {label}{count !== undefined && <span style={{ color: 'var(--t45)' }}> ({count})</span>}
      </span>
    </label>
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
        <img
          src={cat.img}
          alt={cat.label}
          style={{
            maxWidth: 76, maxHeight: 60, objectFit: 'contain',
            filter: active ? 'drop-shadow(0 4px 12px rgba(255,107,0,0.45))' : 'drop-shadow(0 2px 6px rgba(0,0,0,0.3))',
            transform: active ? 'scale(1.12)' : 'scale(1)',
            transition: 'transform 0.2s, filter 0.2s',
          }}
        />
      </div>
      <span style={{
        fontSize: 11, fontWeight: 700, textAlign: 'center', whiteSpace: 'pre-line',
        color: active ? 'var(--text-primary)' : 'var(--t58)',
      }}>{cat.label}</span>
    </button>
  );
}

/* ─── Cuisine chip ─── */
function CuisineChip({ c, active, onClick }: { c: Cuisine; active: boolean; onClick: () => void }) {
  return (
    <motion.button whileTap={{ scale: 0.94 }} onClick={onClick} style={{
      display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6,
      padding: 0, background: 'transparent', border: 'none', cursor: 'pointer', minWidth: 82, flexShrink: 0,
    }}>
      <div style={{
        width: 84, height: 84, borderRadius: 22, background: c.bg, position: 'relative',
        border: active ? '3px solid white' : '3px solid transparent',
        boxShadow: active ? '0 0 0 2px rgba(255,255,255,0.25), 0 6px 20px rgba(0,0,0,0.4)' : '0 4px 14px rgba(0,0,0,0.35)',
        transition: 'all 0.2s', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden',
      }}>
        <img
          src={c.img}
          alt={c.label}
          style={{
            width: '100%', height: '100%', objectFit: 'cover',
            filter: 'drop-shadow(0 2px 6px rgba(0,0,0,0.3))',
          }}
        />
      </div>
      <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--t88)', textAlign: 'center', maxWidth: 82, lineHeight: 1.3 }}>{c.label}</span>
    </motion.button>
  );
}

/* ─── Restaurant card ─── */
function RestaurantCard({ r, hasOrdered }: { r: RestaurantRow; hasOrdered?: boolean }) {
  const emo = RESTAURANT_EMOJIS[r.name] || '🍽️';
  return (
    <Link href={r.slug ? `/menu/${r.slug}` : '#'} data-track="order-cta" style={{ textDecoration: 'none', display: 'block', marginBottom: 20 }}>
      <div style={{ borderRadius: 16, overflow: 'hidden', background: 'var(--discover-card)' }}>
        {!r.open && r.openTime && (
          <div style={{ background: 'var(--discover-input)', padding: '8px 16px', textAlign: 'center', fontSize: 13, color: 'var(--t58)', fontWeight: 600 }}>
            Opent om {r.openTime}
          </div>
        )}
        <div style={{ position: 'relative', height: 190, background: 'var(--discover-input)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <span style={{ fontSize: 80, filter: 'drop-shadow(0 4px 16px rgba(0,0,0,0.4))' }}>{emo}</span>
          {!r.open && <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.48)' }} />}
          <div style={{
            position: 'absolute', bottom: 12, left: 12,
            width: 54, height: 54, borderRadius: 13, background: 'var(--discover-card)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 4px 14px rgba(0,0,0,0.5)', border: '2px solid var(--b15)',
            fontSize: 28,
          }}>{emo}</div>
          {r.rating > 0 && (
            <div style={{ position: 'absolute', top: 10, right: 10, background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(8px)', borderRadius: 8, padding: '3px 9px', fontSize: 12, fontWeight: 800, color: '#FFD700' }}>⭐ {r.rating}</div>
          )}
          {r.delivery === 'Gratis' && r.open && (
            <div style={{ position: 'absolute', top: 10, left: 10, background: '#27AE60', borderRadius: 8, padding: '3px 10px', fontSize: 11, fontWeight: 800, color: 'white' }}>Gratis</div>
          )}
        </div>
        <div style={{ padding: '12px 14px 14px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 2 }}>
            <h3 style={{ fontSize: 15, fontWeight: 800, color: 'var(--text-primary)' }}>{r.name}</h3>
            {r.open ? (
              <span className="flex items-center gap-1 text-[10px] font-semibold text-green-400" style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 10, fontWeight: 700, color: '#4ade80', flexShrink: 0 }}>
                <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#4ade80', display: 'inline-block', animation: 'pulse 2s cubic-bezier(0.4,0,0.6,1) infinite' }} />
                Open
              </span>
            ) : (
              <span style={{ fontSize: 10, fontWeight: 700, color: 'var(--t40)', flexShrink: 0 }}>Closed</span>
            )}
          </div>
          <p style={{ color: 'var(--t45)', fontSize: 12, marginBottom: 8 }}>{r.cuisine}</p>
          <div style={{ display: 'flex', gap: 12, fontSize: 12, alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', gap: 12 }}>
              <span style={{ color: 'var(--t40)' }}>🕐 {r.time} min</span>
              <span style={{ color: r.delivery === 'Gratis' ? '#2ECC71' : 'var(--t40)' }}>{r.delivery === 'Gratis' ? '✓ Gratis' : r.delivery}</span>
            </div>
            {hasOrdered && (
              <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--t55)', whiteSpace: 'nowrap' }}>⟳ Quick reorder</span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}

/* ─── Account Drawer ─── */
function AccountDrawer({ open, onClose }: { open: boolean; onClose: () => void }) {
  const menuItems = [
    { icon: '🛍', label: 'Bestellingen',    href: '/account/orders'  },
    { icon: '⭐', label: 'Beloningen',      href: '/rewards'         },
    { icon: '🎟', label: 'Stempelkaarten',  href: '/account/stamp-card' },
    { icon: 'ℹ', label: 'Hulp nodig?',     href: '/help'               },
    { icon: '🎁', label: 'Cadeaukaarten',   href: '/account/gift-card'  },
  ];
  const footerItems = [
    { icon: '🛵', label: 'Word bezorger',          href: '/riders'   },
    { icon: '🏢', label: 'EnJoy for business',     href: '/business' },
    { icon: '🏪', label: 'Word partner',            href: '/partners' },
  ];

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div key="acc-bd"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={onClose}
            style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 300 }}
          />
          <motion.div key="acc-dr"
            initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
            transition={{ type: 'tween', duration: 0.28 }}
            style={{
              position: 'fixed', top: 0, right: 0, bottom: 0, width: 380, maxWidth: '100vw',
              background: 'var(--discover-card)', zIndex: 301, display: 'flex', flexDirection: 'column',
              borderLeft: '1px solid var(--border)',
            }}
          >
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 24px', borderBottom: '1px solid var(--border)' }}>
              <h2 style={{ fontSize: 20, fontWeight: 900, color: 'var(--text-primary)' }}>Mijn account</h2>
              <button onClick={onClose} style={{ width: 34, height: 34, borderRadius: 10, background: 'var(--b8)', border: 'none', cursor: 'pointer', fontSize: 20, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>×</button>
            </div>

            <div style={{ flex: 1, overflowY: 'auto' }}>
              {/* Login banner */}
              <div style={{ margin: '20px 20px 8px', borderRadius: 16, background: '#1a3a7a', padding: '20px 20px', display: 'flex', gap: 16, alignItems: 'center' }}>
                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: 16, fontWeight: 900, color: 'white', marginBottom: 10, lineHeight: 1.35 }}>Meld je aan voor meer voordelen</p>
                  <ul style={{ listStyle: 'none', padding: 0, marginBottom: 16 }}>
                    {['Beloningen en besparingen', 'Bestel sneller', 'Volg bestellingen eenvoudig'].map(s => (
                      <li key={s} style={{ fontSize: 13, color: 'rgba(255,255,255,0.85)', marginBottom: 4, display: 'flex', alignItems: 'center', gap: 6 }}>
                        <span style={{ color: 'rgba(255,255,255,0.6)', fontSize: 10 }}>●</span> {s}
                      </li>
                    ))}
                  </ul>
                  <Link href="/login" style={{
                    display: 'inline-block', background: ORANGE, color: 'white', fontWeight: 800,
                    fontSize: 14, padding: '10px 20px', borderRadius: 24, textDecoration: 'none',
                  }}>Log in of registreer je</Link>
                </div>
                <div style={{ fontSize: 52, flexShrink: 0 }}>🔓</div>
              </div>

              {/* Menu items */}
              <div style={{ padding: '8px 0' }}>
                {menuItems.map((item, i) => (
                  <Link key={i} href={item.href} onClick={onClose} style={{
                    display: 'flex', alignItems: 'center', gap: 14, padding: '14px 24px',
                    textDecoration: 'none', color: 'var(--text-primary)', borderBottom: '1px solid var(--border)',
                    fontSize: 15, fontWeight: 600, transition: 'background 0.15s',
                  }}>
                    <span style={{ fontSize: 20, width: 28, textAlign: 'center' }}>{item.icon}</span>
                    {item.label}
                  </Link>
                ))}

                <div style={{ height: 8, background: 'var(--b8)' }} />

                {/* Footer links */}
                {footerItems.map((item, i) => (
                  <Link key={i} href={item.href} onClick={onClose} style={{
                    display: 'flex', alignItems: 'center', gap: 14, padding: '14px 24px',
                    textDecoration: 'none', color: 'var(--text-primary)', borderBottom: '1px solid var(--border)',
                    fontSize: 15, fontWeight: 600,
                  }}>
                    <span style={{ fontSize: 20, width: 28, textAlign: 'center' }}>{item.icon}</span>
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

/* ─── Main ─── */
function DiscoverContent() {
  const router = useRouter();
  const [restaurants, setRestaurants]       = useState<RestaurantRow[]>(DEMO);
  const [orderedRestaurantNames, setOrderedRestaurantNames] = useState<Set<string>>(new Set());
  const [address, setAddress]               = useState('');
  const [search, setSearch]                 = useState('');
  const [sort, setSort]                     = useState('Beste match');
  const [openOnly, setOpenOnly]             = useState(false);
  const [isNew, setIsNew]                   = useState(false);
  const [reservation, setReservation]       = useState(false);
  const [freeDelivery, setFreeDelivery]     = useState(false);
  const [minOrder, setMinOrder]             = useState('all');
  const [starRating, setStarRating]         = useState(0);
  const [hasDeal, setHasDeal]               = useState(false);
  const [hasStampCard, setHasStampCard]     = useState(false);
  const [isVeg, setIsVeg]                   = useState(false);
  const [isVegan, setIsVegan]               = useState(false);
  const [isGlutenFree, setIsGlutenFree]     = useState(false);
  const [isHalal, setIsHalal]               = useState(false);
  const [activeTopCat, setActiveTopCat]     = useState(0);
  const [activeCuisines, setActiveCuisines] = useState<Set<string>>(new Set());
  const [activeChips, setActiveChips]       = useState<Set<string>>(new Set());
  const [deliveryMode, setDeliveryMode]     = useState<'bezorgen' | 'afhalen'>('bezorgen');
  const [filtersOpen, setFiltersOpen]       = useState(false);
  const [accountOpen, setAccountOpen]       = useState(false);
  const [allCatsOpen, setAllCatsOpen]       = useState(false);
  const [catSearch, setCatSearch]           = useState('');
  const [isMobile, setIsMobile]             = useState(true);
  const [canScrollL, setCanScrollL]         = useState(false);
  const [canScrollR, setCanScrollR]         = useState(true);
  const [joyaTrigger, setJoyaTrigger]       = useState(0);
  const cuisineRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const saved = localStorage.getItem('enjoyAddress');
    if (saved) setAddress(saved);

    fetch('/api/restaurants')
      .then(r => r.json())
      .then(data => {
        const real: RestaurantRow[] = (data.restaurants || []).map((t: any) => ({
          name: t.name, slug: t.slug || '', cuisine: t.tagline || 'Restaurant',
          rating: 0, time: '30–45', img: t.logo || '',
          delivery: 'Gratis', min: 0, open: true, category: 'restaurant',
          cuisineCategories: t.cuisineCategories || [],
        }));
        if (real.length > 0) setRestaurants(real);
      })
      .catch(() => {});

    // Fetch order history to enable "Quick reorder" indicators
    fetch('/api/account/orders')
      .then(r => r.ok ? r.json() : [])
      .then((data: any[]) => {
        if (Array.isArray(data)) {
          const names = new Set(data.map((o: any) => o.restaurantName).filter(Boolean));
          setOrderedRestaurantNames(names);
        }
      })
      .catch(() => {});

    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, [router]);

  const updateScroll = () => {
    const el = cuisineRef.current;
    if (!el) return;
    setCanScrollL(el.scrollLeft > 10);
    setCanScrollR(el.scrollLeft < el.scrollWidth - el.clientWidth - 10);
  };

  const scrollCuisines = (dir: 'left' | 'right') => {
    cuisineRef.current?.scrollBy({ left: dir === 'right' ? 280 : -280, behavior: 'smooth' });
    setTimeout(updateScroll, 350);
  };

  const toggleCuisine = (label: string) =>
    setActiveCuisines(prev => { const n = new Set(prev); n.has(label) ? n.delete(label) : n.add(label); return n; });

  const toggleChip = (key: string) =>
    setActiveChips(prev => { const n = new Set(prev); n.has(key) ? n.delete(key) : n.add(key); return n; });

  const selectedCat = topCats[activeTopCat];
  const isRestaurant = selectedCat.key === 'restaurant';
  const applyFreeDelivery = freeDelivery || activeChips.has('free');

  const filtered = restaurants.filter(r => {
    if (selectedCat.key !== 'restaurant' && r.category !== selectedCat.key) return false;
    if (search && !r.name.toLowerCase().includes(search.toLowerCase()) && !r.cuisine.toLowerCase().includes(search.toLowerCase())) return false;
    if (openOnly && !r.open) return false;
    if (applyFreeDelivery && r.delivery !== 'Gratis') return false;
    if (minOrder === '10' && r.min > 10) return false;
    if (minOrder === '15' && r.min > 15) return false;
    if (starRating > 0 && r.rating < starRating) return false;
    if (activeCuisines.size > 0) {
      const anyMatch = [...activeCuisines].some(label => {
        // Check cuisineCategories array first (most accurate)
        if (r.cuisineCategories && r.cuisineCategories.length > 0) {
          return r.cuisineCategories.includes(label);
        }
        // Fallback: match via cuisine chip's keyword pattern
        const chip = cuisines.find(x => x.label === label);
        if (chip) {
          return r.cuisine.toLowerCase().includes(chip.match.toLowerCase()) || r.name.toLowerCase().includes(chip.match.toLowerCase());
        }
        // Final fallback: direct text match
        return r.cuisine.toLowerCase().includes(label.toLowerCase()) || r.name.toLowerCase().includes(label.toLowerCase());
      });
      if (!anyMatch) return false;
    }
    return true;
  });

  const openRestaurants   = filtered.filter(r => r.open);
  const closedRestaurants = filtered.filter(r => !r.open);

  // Dynamic category counts from real restaurant data
  const categoryCounts = new Map<string, number>();
  for (const r of restaurants) {
    if (r.category !== 'restaurant') continue;
    for (const cat of (r.cuisineCategories || [])) {
      categoryCounts.set(cat, (categoryCounts.get(cat) || 0) + 1);
    }
  }

  const resetAll = () => {
    setSearch(''); setOpenOnly(false); setIsNew(false); setFreeDelivery(false);
    setMinOrder('all'); setActiveCuisines(new Set()); setActiveTopCat(0); setActiveChips(new Set());
    setReservation(false); setStarRating(0); setHasDeal(false); setHasStampCard(false);
    setIsVeg(false); setIsVegan(false); setIsGlutenFree(false); setIsHalal(false);
  };

  /* ─── Sidebar filters ─── */
  const SidebarContent = () => (
    <div>
      <p style={{ fontSize: 20, fontWeight: 900, marginBottom: 20, color: 'var(--text-primary)' }}>{filtered.length} Partners</p>

      {/* Toggles */}
      {([
        { label: 'Nu geopend',       val: openOnly,     set: setOpenOnly     },
        { label: 'Nieuw',            val: isNew,        set: setIsNew        },
        { label: 'Reservering',      val: reservation,  set: setReservation  },
        { label: 'Gratis bezorging', val: freeDelivery, set: setFreeDelivery },
      ] as const).map(({ label, val, set }) => (
        <div key={label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
          <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--t88)' }}>{label}</span>
          <Toggle val={val} onToggle={() => set(!val)} />
        </div>
      ))}

      <div style={{ height: 1, background: 'var(--border)', margin: '12px 0 16px' }} />

      {/* Minimum bestelling */}
      <p style={{ fontSize: 11, fontWeight: 700, color: 'var(--t45)', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 12 }}>Minimum bestelling</p>
      {[
        { val: 'all', label: 'Toon alles',        count: restaurants.length                             },
        { val: '10',  label: '€ 10,00 of minder', count: restaurants.filter(r => r.min <= 10).length   },
        { val: '15',  label: '€ 15,00 of minder', count: restaurants.filter(r => r.min <= 15).length   },
      ].map(opt => (
        <label key={opt.val} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12, cursor: 'pointer' }} onClick={() => setMinOrder(opt.val)}>
          <div style={{ width: 20, height: 20, borderRadius: '50%', border: `2px solid ${minOrder === opt.val ? ORANGE : 'var(--b20)'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            {minOrder === opt.val && <div style={{ width: 10, height: 10, borderRadius: '50%', background: ORANGE }} />}
          </div>
          <span style={{ fontSize: 13, color: 'var(--t75)' }}>{opt.label} ({opt.count})</span>
        </label>
      ))}

      {/* Beoordeling */}
      <div style={{ height: 1, background: 'var(--border)', margin: '12px 0 16px' }} />
      <p style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 10 }}>Beoordeling</p>
      <div style={{ display: 'flex', gap: 2, marginBottom: starRating > 0 ? 6 : 16 }}>
        {[1, 2, 3, 4, 5].map(s => (
          <button key={s} onClick={() => setStarRating(starRating === s ? 0 : s)} style={{
            background: 'none', border: 'none', cursor: 'pointer',
            fontSize: 28, padding: '0 2px', lineHeight: 1,
            color: s <= starRating ? '#FFD700' : 'var(--b20)',
            transition: 'color 0.15s, transform 0.1s',
            transform: s <= starRating ? 'scale(1.12)' : 'scale(1)',
          }}>★</button>
        ))}
      </div>
      {starRating > 0 && (
        <p style={{ fontSize: 12, color: 'var(--t45)', marginBottom: 14 }}>{starRating}+ sterren</p>
      )}

      {/* Aanbiedingen en acties */}
      <div style={{ height: 1, background: 'var(--border)', margin: '4px 0 16px' }} />
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
        <p style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)' }}>Aanbiedingen en acties</p>
        <div style={{ width: 18, height: 18, borderRadius: '50%', border: '1.5px solid var(--b30)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, color: 'var(--t45)', cursor: 'help' }}>i</div>
      </div>
      <Checkbox label="Aanbiedingen" checked={hasDeal}       onChange={setHasDeal}      count={51} />
      <Checkbox label="Stempelkaarten" checked={hasStampCard} onChange={setHasStampCard} count={89} />

      {/* Dieetwensen */}
      <div style={{ height: 1, background: 'var(--border)', margin: '4px 0 16px' }} />
      <p style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 12 }}>Dieetwensen</p>
      <Checkbox label="Vegetarisch"     checked={isVeg}       onChange={setIsVeg}       count={31} />
      <Checkbox label="Vegan"           checked={isVegan}     onChange={setIsVegan}     count={12} />
      <Checkbox label="Glutenvrije opties" checked={isGlutenFree} onChange={setIsGlutenFree} count={2} />
      <Checkbox label="Halal"           checked={isHalal}     onChange={setIsHalal}     count={19} />

      {/* Reset */}
      {(openOnly || isNew || freeDelivery || minOrder !== 'all' || activeCuisines.size > 0 || starRating > 0 || hasDeal || hasStampCard || isVeg || isVegan || isGlutenFree || isHalal) && (
        <button onClick={resetAll} style={{ marginTop: 16, width: '100%', padding: '10px', borderRadius: 12, background: `rgba(255,107,0,0.1)`, border: `1px solid ${ORANGE}`, color: ORANGE, fontWeight: 700, cursor: 'pointer', fontSize: 13 }}>
          Reset filters
        </button>
      )}
    </div>
  );

  return (
    <div style={{ background: 'var(--discover-bg)', minHeight: '100vh', color: 'var(--text-primary)', fontFamily: '"Outfit","Helvetica Neue",sans-serif', paddingBottom: isMobile ? 72 : 0 }}>

      {/* ══ MOBILE HEADER ══ */}
      {isMobile && (
        <header style={{ background: 'var(--discover-nav)', borderBottom: '1px solid var(--border)' }}>
          {/* Row 1: Logo + Address pill + Hamburger */}
          <div style={{ padding: '12px 16px 10px', display: 'flex', alignItems: 'center', gap: 10 }}>
            <Link href="/" style={{ textDecoration: 'none', flexShrink: 0 }}>
              <span translate="no" style={{ fontSize: 20, fontWeight: 900, color: 'var(--text-primary)' }}>
                En<span style={{ background: LOGO, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Joy</span>
              </span>
            </Link>
            <Link href="/" style={{ flex: 1, minWidth: 0, textDecoration: 'none' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 5, background: 'var(--discover-input)', borderRadius: 22, padding: '7px 12px', border: '1px solid var(--border-strong)' }}>
                <span style={{ fontSize: 13, flexShrink: 0 }}>📍</span>
                <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{address || 'Voeg adres toe'}</span>
                <span style={{ fontSize: 10, color: 'var(--t40)', flexShrink: 0, marginLeft: 2 }}>▼</span>
              </div>
            </Link>
            <button onClick={() => setAccountOpen(true)} style={{ width: 36, height: 36, borderRadius: '50%', background: 'var(--discover-input)', border: '1px solid var(--border-strong)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', flexShrink: 0, position: 'relative' }}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="var(--text-primary)" strokeWidth="2.5" strokeLinecap="round">
                <line x1="4" y1="6" x2="20" y2="6"/><line x1="4" y1="12" x2="20" y2="12"/><line x1="4" y1="18" x2="20" y2="18"/>
              </svg>
              <div style={{ position: 'absolute', top: 6, right: 6, width: 8, height: 8, borderRadius: '50%', background: ORANGE, border: '2px solid var(--discover-nav)' }} />
            </button>
          </div>

          {/* Row 2: Bezorgen / Afhalen full-width toggle */}
          <div style={{ padding: '0 16px 10px' }}>
            <div style={{ display: 'flex', background: 'var(--discover-input)', borderRadius: 24, border: '1px solid var(--border-strong)', padding: 3 }}>
              <button onClick={() => setDeliveryMode('bezorgen')} style={{ flex: 1, padding: '9px 0', borderRadius: 20, border: 'none', cursor: 'pointer', background: deliveryMode === 'bezorgen' ? 'var(--text-primary)' : 'transparent', color: deliveryMode === 'bezorgen' ? 'var(--discover-bg)' : 'var(--t55)', fontSize: 13, fontWeight: 700, transition: 'all 0.2s', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>🚲 Bezorgen</button>
              <button onClick={() => setDeliveryMode('afhalen')} style={{ flex: 1, padding: '9px 0', borderRadius: 20, border: 'none', cursor: 'pointer', background: deliveryMode === 'afhalen' ? 'var(--text-primary)' : 'transparent', color: deliveryMode === 'afhalen' ? 'var(--discover-bg)' : 'var(--t55)', fontSize: 13, fontWeight: 700, transition: 'all 0.2s', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>🥡 Afhalen</button>
            </div>
          </div>

          {/* Row 3: Search + filter + Joya AI button */}
          {isRestaurant && (
            <div style={{ padding: '0 16px 12px', display: 'flex', gap: 8, alignItems: 'center' }}>
              <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 10, background: 'var(--discover-input)', borderRadius: 40, border: '1px solid var(--b8)', padding: '0 16px', height: 46, minWidth: 0 }}>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="var(--t45)" strokeWidth="2.5" strokeLinecap="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
                <input type="text" placeholder="Zoek een restaurant of categorie" value={search} onChange={e => setSearch(e.target.value)}
                  style={{ flex: 1, background: 'transparent', border: 'none', color: 'var(--text-primary)', fontSize: 14, outline: 'none', fontFamily: 'inherit', minWidth: 0 }} />
                {search && <button onClick={() => setSearch('')} style={{ background: 'none', border: 'none', color: 'var(--t35)', cursor: 'pointer', fontSize: 16, flexShrink: 0 }}>✕</button>}
              </div>
              <button onClick={() => setFiltersOpen(true)} style={{ width: 46, height: 46, borderRadius: '50%', cursor: 'pointer', background: 'var(--discover-input)', border: '1px solid var(--b8)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--t75)" strokeWidth="2" strokeLinecap="round">
                  <line x1="4" y1="6" x2="20" y2="6"/><line x1="8" y1="12" x2="16" y2="12"/><line x1="11" y1="18" x2="13" y2="18"/>
                </svg>
              </button>
              {/* Joya AI orange button */}
              <button
                onClick={() => setJoyaTrigger(t => t + 1)}
                title="Joya AI — Bestelassistent"
                style={{
                  width: 46, height: 46, borderRadius: '50%', flexShrink: 0,
                  background: `linear-gradient(135deg, ${ORANGE}, ${PINK})`,
                  border: 'none', cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  boxShadow: `0 4px 16px rgba(255,107,0,0.4)`,
                }}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3z"/>
                  <path d="M19 10v2a7 7 0 0 1-14 0v-2"/>
                  <line x1="12" y1="19" x2="12" y2="22"/>
                  <line x1="8" y1="22" x2="16" y2="22"/>
                </svg>
              </button>
            </div>
          )}

          {/* Category strip */}
          <div style={{ background: 'var(--catstrip-bg)', borderBottom: '1px solid var(--b8)' }}>
            <div className="scroll-x" style={{ display: 'flex', padding: '0 4px' }}>
              {topCats.map((cat, i) => <CatIcon key={i} cat={cat} active={activeTopCat === i} onClick={() => setActiveTopCat(i)} />)}
            </div>
          </div>
        </header>
      )}

      {/* ══ DESKTOP HEADER ══ */}
      {!isMobile && (
        <header style={{ background: 'var(--discover-nav)', borderBottom: '1px solid var(--border)' }}>
          <div style={{ height: 70, display: 'flex', alignItems: 'center', padding: '0 40px', gap: 24 }}>
            <EnJoyLogo />

            {/* Center */}
            <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10 }}>
              <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 8, textDecoration: 'none', padding: '9px 16px', borderRadius: 24, background: 'var(--discover-input)', border: '1px solid var(--border-strong)', cursor: 'pointer' }}>
                <span style={{ fontSize: 16 }}>📍</span>
                <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)', maxWidth: 220, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{address || 'Voeg adres toe'}</span>
                <span style={{ color: 'var(--t40)', fontSize: 11 }}>▼</span>
              </Link>
              <div style={{ display: 'flex', background: 'var(--discover-input)', borderRadius: 24, border: '1px solid var(--border-strong)', padding: 3 }}>
                <button onClick={() => setDeliveryMode('bezorgen')} style={{ padding: '8px 20px', borderRadius: 20, border: 'none', cursor: 'pointer', background: deliveryMode === 'bezorgen' ? 'var(--text-primary)' : 'transparent', color: deliveryMode === 'bezorgen' ? 'var(--discover-bg)' : 'var(--t55)', fontSize: 13, fontWeight: 700, transition: 'all 0.2s' }}>Bezorgen</button>
                <button onClick={() => setDeliveryMode('afhalen')} style={{ padding: '8px 20px', borderRadius: 20, border: 'none', cursor: 'pointer', background: deliveryMode === 'afhalen' ? 'var(--text-primary)' : 'transparent', color: deliveryMode === 'afhalen' ? 'var(--discover-bg)' : 'var(--t55)', fontSize: 13, fontWeight: 700, transition: 'all 0.2s' }}>Afhalen</button>
              </div>
            </div>

            {/* Right: flag + account (hamburger) */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              <button onClick={() => setAccountOpen(true)} style={{ position: 'relative', width: 42, height: 42, borderRadius: '50%', background: 'var(--discover-input)', border: '1px solid var(--border-strong)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--text-primary)" strokeWidth="2" strokeLinecap="round">
                  <line x1="4" y1="6" x2="20" y2="6"/><line x1="4" y1="12" x2="20" y2="12"/><line x1="4" y1="18" x2="20" y2="18"/>
                </svg>
                <div style={{ position: 'absolute', top: 8, right: 8, width: 9, height: 9, borderRadius: '50%', background: ORANGE, border: '2px solid var(--discover-nav)' }} />
              </button>
            </div>
          </div>

          {/* Full-width category strip */}
          <div style={{ background: 'var(--catstrip-bg)', borderBottom: '1px solid var(--b8)' }}>
            <div style={{ display: 'flex', justifyContent: 'center', maxWidth: 1280, margin: '0 auto', padding: '0 40px' }}>
              {topCats.map((cat, i) => <CatIcon key={i} cat={cat} active={activeTopCat === i} onClick={() => setActiveTopCat(i)} />)}
            </div>
          </div>
        </header>
      )}

      {/* ══ CONTENT ══ */}
      <h1 style={{ position: 'absolute', width: 1, height: 1, padding: 0, margin: -1, overflow: 'hidden', clip: 'rect(0,0,0,0)', whiteSpace: 'nowrap', borderWidth: 0 }}>
        Ontdek Restaurants Bij Jou In De Buurt
      </h1>
      {isMobile ? (
        /* ─── MOBILE ─── */
        <div style={{ padding: '20px 16px' }}>

          {/* Cuisine + filter chips — restaurant only */}
          {isRestaurant && (
            <>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
                <h2 style={{ fontSize: 17, fontWeight: 900 }}>Vind iets lekkers</h2>
                <button onClick={() => setAllCatsOpen(true)} style={{ fontSize: 13, fontWeight: 700, color: GREEN, background: 'none', border: 'none', cursor: 'pointer', padding: 0, fontFamily: 'inherit' }}>Toon alles</button>
              </div>
              <div className="scroll-x" style={{ display: 'flex', gap: 10, marginBottom: 22, paddingBottom: 4 }}>
                {cuisines.map((c, i) => <CuisineChip key={i} c={c} active={activeCuisines.has(c.label)} onClick={() => toggleCuisine(c.label)} />)}
              </div>
              <div className="scroll-x" style={{ display: 'flex', gap: 8, marginBottom: 22 }}>
                {FILTER_CHIPS.map(chip => {
                  const on = activeChips.has(chip.key);
                  return (
                    <button key={chip.key} onClick={() => toggleChip(chip.key)} style={{
                      display: 'flex', alignItems: 'center', gap: 5,
                      padding: '8px 14px', borderRadius: 20, flexShrink: 0,
                      border: `1.5px solid ${on ? ORANGE : 'var(--b20)'}`,
                      background: on ? `rgba(255,107,0,0.12)` : 'transparent',
                      color: on ? ORANGE : 'var(--t75)',
                      fontSize: 13, fontWeight: 700, cursor: 'pointer', whiteSpace: 'nowrap',
                    }}>
                      {chip.icon && <span>{chip.icon}</span>}
                      {chip.label}
                    </button>
                  );
                })}
              </div>
            </>
          )}

          {/* Deals — mobile */}
          {isRestaurant && (
            <div style={{ marginBottom: 22 }}>
              <h2 style={{ fontSize: 16, fontWeight: 900, marginBottom: 12 }}>Aanbiedingen van vandaag 🔥</h2>
              <div className="scroll-x" style={{ display: 'flex', gap: 10, paddingBottom: 4 }}>
                {DEALS.map((d, i) => (
                  <div key={i} style={{ borderRadius: 14, overflow: 'hidden', position: 'relative', minWidth: 180, height: 110, background: d.color, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', flexShrink: 0 }}>
                    <span style={{ fontSize: 52, filter: 'drop-shadow(0 2px 8px rgba(0,0,0,0.4))' }}>{d.emoji}</span>
                    <div style={{ position: 'absolute', top: 8, left: 8, background: '#F5C518', borderRadius: 6, padding: '3px 8px', fontSize: 11, fontWeight: 800, color: '#1C1C1C' }}>{d.deal}</div>
                    <div style={{ position: 'absolute', bottom: 8, left: 10 }}>
                      <p style={{ fontSize: 12, fontWeight: 800, color: 'white' }}>{d.name}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <p style={{ fontSize: 16, fontWeight: 900, color: 'var(--text-primary)', marginBottom: 18 }}>
            Bestel bij {filtered.length} locaties
          </p>

          {openRestaurants.map((r, i) => <RestaurantCard key={r.slug || r.name + i} r={r} hasOrdered={orderedRestaurantNames.has(r.name)} />)}

          {closedRestaurants.length > 0 && (
            <>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, margin: '8px 0 16px' }}>
                <h3 style={{ fontSize: 16, fontWeight: 900 }}>Binnenkort geopend</h3>
                <div style={{ width: 18, height: 18, borderRadius: '50%', border: '1.5px solid var(--b20)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, color: 'var(--t45)', cursor: 'pointer' }}>i</div>
              </div>
              {closedRestaurants.map((r, i) => <RestaurantCard key={r.slug || r.name + i} r={r} hasOrdered={orderedRestaurantNames.has(r.name)} />)}
            </>
          )}

          {filtered.length === 0 && (
            <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--t30)' }}>
              <p style={{ fontSize: 40, marginBottom: 12 }}>🍽️</p>
              <p style={{ fontSize: 18, fontWeight: 700, color: 'var(--t58)' }}>
                {search ? `No results for "${search}"` : 'Geen restaurants gevonden'}
              </p>
              <button onClick={resetAll} style={{ marginTop: 16, padding: '10px 24px', borderRadius: 12, background: `linear-gradient(135deg,${ORANGE},${PINK})`, border: 'none', color: 'white', fontWeight: 700, cursor: 'pointer', fontSize: 14 }}>Reset alles</button>
            </div>
          )}
        </div>

      ) : (
        /* ─── DESKTOP ─── */
        <div style={{ display: 'flex', maxWidth: 1280, margin: '0 auto', padding: '28px 40px', gap: 36, alignItems: 'flex-start' }}>
          {/* Sidebar */}
          <aside style={{ width: 240, flexShrink: 0 }}>
            <SidebarContent />
          </aside>

          {/* Main */}
          <div style={{ flex: 1, minWidth: 0 }}>

            {/* Search + sort + grid — restaurant only */}
            {isRestaurant && (
              <>
                <div style={{ display: 'flex', gap: 10, alignItems: 'center', marginBottom: 18 }}>
                  <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 10, background: 'var(--discover-input)', borderRadius: 40, border: '1px solid var(--border-strong)', padding: '0 18px', height: 50 }}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--t40)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
                    </svg>
                    <input type="text" placeholder="Iets vinden?" value={search} onChange={e => setSearch(e.target.value)}
                      style={{ flex: 1, background: 'transparent', border: 'none', color: 'var(--text-primary)', fontSize: 14, outline: 'none', fontFamily: 'inherit' }} />
                    {search && <button onClick={() => setSearch('')} style={{ background: 'none', border: 'none', color: 'var(--t35)', cursor: 'pointer', fontSize: 16 }}>✕</button>}
                  </div>
                  <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--t40)', whiteSpace: 'nowrap', flexShrink: 0 }}>Sorteren op</span>
                  <div style={{ position: 'relative', flexShrink: 0 }}>
                    <select value={sort} onChange={e => setSort(e.target.value)}
                      style={{ appearance: 'none', background: 'var(--discover-input)', border: '1px solid var(--border-strong)', borderRadius: 12, color: 'var(--text-primary)', padding: '11px 44px 11px 16px', fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit', outline: 'none', minWidth: 160 }}>
                      <option>Beste match</option><option>Beoordeling</option><option>Levertijd</option><option>Bezorgkosten</option>
                    </select>
                    <svg style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--t40)" strokeWidth="2.5" strokeLinecap="round"><polyline points="6 9 12 15 18 9"/></svg>
                  </div>
                  <button onClick={() => setFiltersOpen(true)} style={{ width: 46, height: 46, borderRadius: 12, background: 'var(--discover-input)', border: '1px solid var(--border-strong)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', flexShrink: 0 }}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--t75)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/>
                      <rect x="14" y="14" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/>
                    </svg>
                  </button>
                </div>

                {/* Cuisine chips with scroll arrows */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 28 }}>
                  <button onClick={() => scrollCuisines('left')} disabled={!canScrollL} style={{ width: 36, height: 36, borderRadius: '50%', border: '1px solid var(--b15)', background: canScrollL ? 'var(--discover-input)' : 'transparent', cursor: canScrollL ? 'pointer' : 'default', color: canScrollL ? 'var(--text-primary)' : 'var(--t25)', fontSize: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, transition: 'all 0.2s' }}>◀</button>
                  <div ref={cuisineRef} onScroll={updateScroll} className="scroll-x" style={{ display: 'flex', gap: 10, flex: 1 }}>
                    {cuisines.map((c, i) => <CuisineChip key={i} c={c} active={activeCuisines.has(c.label)} onClick={() => toggleCuisine(c.label)} />)}
                  </div>
                  <button onClick={() => scrollCuisines('right')} disabled={!canScrollR} style={{ width: 36, height: 36, borderRadius: '50%', border: '1px solid var(--b15)', background: canScrollR ? 'var(--discover-input)' : 'transparent', cursor: canScrollR ? 'pointer' : 'default', color: canScrollR ? 'var(--text-primary)' : 'var(--t25)', fontSize: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, transition: 'all 0.2s' }}>▶</button>
                  <button onClick={() => setAllCatsOpen(true)} style={{ padding: '10px 18px', borderRadius: 22, border: '1.5px solid var(--b20)', background: 'transparent', color: 'var(--t88)', fontWeight: 700, fontSize: 13, cursor: 'pointer', flexShrink: 0, whiteSpace: 'nowrap', transition: 'all 0.2s' }}>Toon alles</button>
                </div>

                {/* Deals section */}
                <div style={{ marginBottom: 32 }}>
                  <h2 style={{ fontSize: 20, fontWeight: 900, marginBottom: 16 }}>De aanbiedingen van vandaag 🔥</h2>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14 }}>
                    {DEALS.map((d, i) => (
                      <div key={i} style={{ borderRadius: 16, overflow: 'hidden', position: 'relative', height: 150, background: d.color, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                        <span style={{ fontSize: 72, filter: 'drop-shadow(0 4px 16px rgba(0,0,0,0.4))' }}>{d.emoji}</span>
                        <div style={{ position: 'absolute', top: 10, left: 10, background: '#F5C518', borderRadius: 8, padding: '4px 10px', fontSize: 12, fontWeight: 800, color: '#1C1C1C' }}>{d.deal}</div>
                        <div style={{ position: 'absolute', bottom: 10, left: 12 }}>
                          <p style={{ fontSize: 13, fontWeight: 800, color: 'white' }}>{d.name}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}

            {/* Restaurant count */}
            <h2 style={{ fontSize: 18, fontWeight: 900, marginBottom: 20 }}>{selectedCat.label} — {filtered.length} partners</h2>

            {/* Restaurant grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(280px,1fr))', gap: 16, paddingBottom: 60 }}>
              {filtered.length === 0 ? (
                <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '60px 0', color: 'var(--t25)' }}>
                  <p style={{ fontSize: 40, marginBottom: 12 }}>🍽️</p>
                  <p style={{ fontSize: 18, fontWeight: 700, color: 'var(--t58)' }}>
                    {search ? `No results for "${search}"` : 'Geen restaurants gevonden'}
                  </p>
                  <button onClick={resetAll} style={{ marginTop: 16, padding: '10px 24px', borderRadius: 12, background: `linear-gradient(135deg,${PURPLE},${PINK})`, border: 'none', color: 'white', fontWeight: 700, cursor: 'pointer', fontSize: 14 }}>Reset alles</button>
                </div>
              ) : filtered.map((r, i) => {
                const emo = RESTAURANT_EMOJIS[r.name] || '🍽️';
                const hasOrdered = orderedRestaurantNames.has(r.name);
                return (
                  <Link key={r.slug || r.name + i} href={r.slug ? `/menu/${r.slug}` : '#'} style={{ textDecoration: 'none' }}>
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}
                      whileHover={{ y: -3 }}
                      style={{ background: 'var(--discover-card)', borderRadius: 14, overflow: 'hidden', border: '1px solid var(--b8)', cursor: 'pointer' }}>
                      <div style={{ height: 160, position: 'relative', background: 'var(--discover-input)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <span style={{ fontSize: 70, filter: 'drop-shadow(0 4px 14px rgba(0,0,0,0.4))' }}>{emo}</span>
                        {!r.open && (
                          <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <span style={{ background: 'var(--discover-input)', color: 'var(--t75)', padding: '7px 18px', borderRadius: 10, fontSize: 13, fontWeight: 700 }}>Gesloten</span>
                          </div>
                        )}
                        {r.rating > 0 && (
                          <div style={{ position: 'absolute', top: 10, right: 10, background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(8px)', borderRadius: 8, padding: '3px 9px', fontSize: 12, fontWeight: 800, color: '#FFD700' }}>⭐ {r.rating}</div>
                        )}
                        {r.delivery === 'Gratis' && r.open && (
                          <div style={{ position: 'absolute', top: 10, left: 10, background: '#27AE60', borderRadius: 8, padding: '3px 10px', fontSize: 11, fontWeight: 800, color: 'white' }}>Gratis</div>
                        )}
                      </div>
                      <div style={{ padding: '12px 14px 14px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 2 }}>
                          <h3 style={{ fontSize: 14, fontWeight: 800, color: 'var(--text-primary)' }}>{r.name}</h3>
                          {r.open ? (
                            <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 10, fontWeight: 700, color: '#4ade80', flexShrink: 0 }}>
                              <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#4ade80', display: 'inline-block', animation: 'pulse 2s cubic-bezier(0.4,0,0.6,1) infinite' }} />
                              Open
                            </span>
                          ) : (
                            <span style={{ fontSize: 10, fontWeight: 700, color: 'var(--t40)', flexShrink: 0 }}>Closed</span>
                          )}
                        </div>
                        <p style={{ color: 'var(--t40)', fontSize: 12, marginBottom: 8 }}>{r.cuisine}</p>
                        <div style={{ display: 'flex', gap: 12, fontSize: 12, alignItems: 'center', justifyContent: 'space-between' }}>
                          <div style={{ display: 'flex', gap: 12 }}>
                            <span style={{ color: 'var(--t40)' }}>🕐 {r.time} min</span>
                            <span style={{ color: r.delivery === 'Gratis' ? '#2ECC71' : 'var(--t40)' }}>{r.delivery === 'Gratis' ? '✓ Gratis' : r.delivery}</span>
                          </div>
                          {hasOrdered && (
                            <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--t55)', whiteSpace: 'nowrap' }}>⟳ Quick reorder</span>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ══ ALL CATEGORIES MODAL ══ */}
      <AnimatePresence>
        {allCatsOpen && (
          <>
            <motion.div key="ac-bd" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => { setAllCatsOpen(false); setCatSearch(''); }}
              style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', zIndex: 400 }} />
            <motion.div key="ac-panel"
              initial={isMobile ? { y: '100%' } : { opacity: 0, y: 20 }}
              animate={isMobile ? { y: 0 } : { opacity: 1, y: 0 }}
              exit={isMobile ? { y: '100%' } : { opacity: 0, y: 20 }}
              transition={{ type: 'spring', damping: 30, stiffness: 320 }}
              style={isMobile ? {
                position: 'fixed', inset: 0, zIndex: 401,
                background: 'var(--discover-card)', borderRadius: 0,
                display: 'flex', flexDirection: 'column', overflow: 'hidden',
              } : {
                position: 'fixed', top: '50%', left: '50%',
                marginLeft: '-46vw', marginTop: '-41vh',
                width: '92vw', maxWidth: 700, height: '82vh',
                background: 'var(--discover-card)', borderRadius: 20, zIndex: 401,
                display: 'flex', flexDirection: 'column', overflow: 'hidden',
                boxShadow: '0 24px 80px rgba(0,0,0,0.7)',
              }}>
              {/* Modal header */}
              <div style={{ padding: '22px 24px 16px', borderBottom: '1px solid var(--border)', flexShrink: 0 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                  <h2 style={{ fontSize: 22, fontWeight: 900, color: 'var(--text-primary)' }}>Alle categorieën</h2>
                  <button onClick={() => { setAllCatsOpen(false); setCatSearch(''); }}
                    style={{ width: 34, height: 34, borderRadius: 10, background: 'var(--b8)', border: 'none', cursor: 'pointer', fontSize: 20, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>×</button>
                </div>
                {/* Search */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, background: 'var(--discover-input)', borderRadius: 40, border: '1px solid var(--border-strong)', padding: '0 16px', height: 46 }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--t40)" strokeWidth="2.5" strokeLinecap="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
                  <input type="text" placeholder="Zoeken in categorieën" value={catSearch} onChange={e => setCatSearch(e.target.value)}
                    style={{ flex: 1, background: 'transparent', border: 'none', color: 'var(--text-primary)', fontSize: 14, outline: 'none', fontFamily: 'inherit' }} />
                  {catSearch && <button onClick={() => setCatSearch('')} style={{ background: 'none', border: 'none', color: 'var(--t35)', cursor: 'pointer', fontSize: 16, lineHeight: 1 }}>✕</button>}
                </div>
              </div>
              {/* Category grid */}
              <div style={{ overflowY: 'auto', padding: '12px 20px 20px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '0 8px' }}>
                  {ALL_CUISINE_CATS
                    .filter(c => c.label.toLowerCase().includes(catSearch.toLowerCase()))
                    .map(c => {
                      const count = categoryCounts.get(c.label) ?? c.count;
                      const active = activeCuisines.has(c.label);
                      const disabled = count === 0;
                      return (
                        <button key={c.label}
                          disabled={disabled}
                          onClick={() => {
                            if (disabled) return;
                            toggleCuisine(c.label);
                            setAllCatsOpen(false);
                            setCatSearch('');
                          }}
                          style={{
                            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                            padding: '14px 6px', background: 'transparent', border: 'none',
                            borderBottom: '1px solid var(--border)', cursor: disabled ? 'default' : 'pointer',
                            textAlign: 'left', width: '100%', transition: 'background 0.15s',
                          }}
                          onMouseEnter={e => { if (!disabled) (e.currentTarget as HTMLButtonElement).style.background = 'var(--b8)'; }}
                          onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = 'transparent'; }}
                        >
                          <span style={{
                            fontSize: 14, fontWeight: active ? 800 : 600,
                            color: disabled ? 'var(--t30)' : active ? ORANGE : 'var(--text-primary)',
                          }}>{c.label}</span>
                          <span style={{ fontSize: 12, color: disabled ? 'var(--t25)' : 'var(--t45)', marginLeft: 4, flexShrink: 0 }}>({count})</span>
                        </button>
                      );
                    })}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ══ FILTERS DRAWER ══ */}
      <AnimatePresence>
        {filtersOpen && (
          <>
            <motion.div key="bd" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setFiltersOpen(false)}
              style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.65)', zIndex: 200 }} />
            <motion.div key="dr" initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              style={{ position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 201, background: 'var(--discover-card)', borderRadius: '20px 20px 0 0', padding: 24, maxHeight: '85vh', overflowY: 'auto' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                <h3 style={{ fontSize: 18, fontWeight: 900, color: 'var(--text-primary)' }}>Filters</h3>
                <button onClick={() => setFiltersOpen(false)} style={{ background: 'none', border: 'none', color: 'var(--text-primary)', fontSize: 22, cursor: 'pointer' }}>✕</button>
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

      {/* ══ ACCOUNT DRAWER ══ */}
      <AccountDrawer open={accountOpen} onClose={() => setAccountOpen(false)} />

      <JoyaChatWidget triggerOpen={joyaTrigger} />
      {isMobile && <BottomNav />}
      {!isMobile && <Footer />}
    </div>
  );
}

export default function DiscoverPage() {
  return <TranslationProvider><DiscoverContent /></TranslationProvider>;
}
