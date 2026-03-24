'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { TranslationProvider, useTranslation } from './context/TranslationContext';
import { JoyaChatWidget } from './components/JoyaChatWidget';
import { Nav } from './components/Nav';
import { Footer } from './components/Footer';

const PURPLE = '#5A31F4';
const PINK   = '#FF0080';

/* ─── Hero ─── */
function HeroSection() {
  const { t } = useTranslation();
  const router = useRouter();
  const [address, setAddress] = useState('');
  const [locating, setLocating] = useState(false);

  const goDiscover = (addr: string) => {
    if (addr.trim()) localStorage.setItem('enjoyAddress', addr.trim());
    router.push('/discover');
  };

  const handleSearch = (e?: React.FormEvent) => {
    e?.preventDefault();
    goDiscover(address);
  };

  const handleGeolocate = () => {
    if (!navigator.geolocation) return;
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      async pos => {
        try {
          const r = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${pos.coords.latitude}&lon=${pos.coords.longitude}&format=json`
          );
          const d = await r.json();
          const addr = d.display_name?.split(',').slice(0, 3).join(',') || `${pos.coords.latitude.toFixed(4)}, ${pos.coords.longitude.toFixed(4)}`;
          setAddress(addr);
          goDiscover(addr);
        } catch {
          goDiscover('');
        } finally {
          setLocating(false);
        }
      },
      () => setLocating(false)
    );
  };

  return (
    <section className="hero-section" style={{ display: 'flex', alignItems: 'center', position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 30% 50%, rgba(90,49,244,0.15) 0%, transparent 60%)' }} />

      <div className="hero-inner" style={{ width: '100%', zIndex: 2 }}>
        {/* Text side */}
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} style={{ maxWidth: 580, flex: '0 0 auto' }}>
          <h1 className="hero-title" style={{ fontWeight: 950, lineHeight: 1.05, marginBottom: 20, letterSpacing: -2 }}>
            {t('hero_title').split(',')[0]},<br />
            <span style={{ background: `linear-gradient(135deg,${PURPLE},${PINK},#FF6B35)`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              {t('hero_title').split(',')[1]}
            </span>
          </h1>
          <p style={{ fontSize: 18, color: 'var(--text-secondary)', marginBottom: 32, lineHeight: 1.6 }}>{t('hero_subtitle')}</p>

          <motion.form onSubmit={handleSearch} className="hero-form" style={{
            display: 'flex', gap: 8, background: 'rgba(255,255,255,0.05)',
            padding: 8, borderRadius: 50, border: '1px solid var(--border-strong)',
            backdropFilter: 'blur(20px)', boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
          }}>
            {/* Geo button */}
            <button type="button" onClick={handleGeolocate} title="Use my location" style={{
              flexShrink: 0, width: 46, height: 46, borderRadius: 40,
              background: 'rgba(255,255,255,0.08)', border: 'none',
              fontSize: 20, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              {locating ? '⏳' : '📍'}
            </button>

            <input
              type="text"
              placeholder="Enter your address..."
              value={address}
              onChange={e => setAddress(e.target.value)}
              style={{
                flex: 1, background: 'transparent', border: 'none',
                padding: '12px 8px', color: 'var(--text-primary)', fontSize: 15,
                outline: 'none', fontFamily: 'inherit', minWidth: 0,
              }}
            />
            <button type="submit" style={{
              background: `linear-gradient(135deg,${PURPLE},${PINK},#FF6B35)`,
              color: 'white', border: 'none', padding: '12px 28px',
              borderRadius: 40, fontSize: 15, fontWeight: 800, cursor: 'pointer',
              boxShadow: '0 8px 16px rgba(90,49,244,0.3)', whiteSpace: 'nowrap', flexShrink: 0,
            }}>Zoeken</button>
          </motion.form>
        </motion.div>

        {/* Hero image */}
        <motion.div className="hero-image" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.3 }}>
          <div style={{ position: 'relative', width: '100%', maxWidth: 520 }}>
            <img src="/food/hero-feast.png" alt="Couple enjoying a feast" style={{ width: '100%', borderRadius: 24, boxShadow: '0 30px 80px rgba(90,49,244,0.25)', border: '2px solid rgba(90,49,244,0.2)' }} />
            <div className="hide-mobile" style={{ position: 'absolute', top: -10, right: -10, width: 64, height: 64, borderRadius: '50%', overflow: 'hidden', border: '3px solid #5A31F4', boxShadow: '0 8px 20px rgba(0,0,0,0.4)' }}>
              <img src="/food/cat-pizza.png" alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
            <div className="hide-mobile" style={{ position: 'absolute', bottom: 20, left: -16, width: 58, height: 58, borderRadius: '50%', overflow: 'hidden', border: '3px solid #FF0080', boxShadow: '0 8px 20px rgba(0,0,0,0.4)' }}>
              <img src="/food/cat-sushi.png" alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
          </div>
        </motion.div>
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
        <HeroSection />
        <FoodCultureSection />
        <PopularRestaurants />
        <HowItWorks />
        <Footer />
        <JoyaChatWidget />
      </div>
    </TranslationProvider>
  );
}
