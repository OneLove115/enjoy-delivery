'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { TranslationProvider, useTranslation } from './context/TranslationContext';
import { JoyaChatWidget } from './components/JoyaChatWidget';

/* ─── Navbar ─── */
function Navbar() {
  const { t } = useTranslation();
  const [deliveryMode, setDeliveryMode] = useState<'delivery' | 'pickup' | 'reservation'>('delivery');
  const [location, setLocation] = useState('');
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(async (pos) => {
        try {
          const res = await fetch(`/api/location?lat=${pos.coords.latitude}&lon=${pos.coords.longitude}`);
          const data = await res.json();
          setLocation(`${data.address?.road || ''}, ${data.address?.city || data.address?.town || ''}`);
        } catch {}
      });
    }
  }, []);
  return (
    <nav style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100, height: 70, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 40px', background: 'rgba(10,10,15,0.85)', backdropFilter: 'blur(20px)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 8, textDecoration: 'none' }}>
          <div style={{ width: 36, height: 36, background: 'linear-gradient(135deg, #E8703A, #FF4500)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>🛵</div>
          <span style={{ fontSize: 22, fontWeight: 900, color: 'white' }}>En<span style={{ color: '#E8703A' }}>Joy</span><span style={{ color: '#E8703A', fontSize: 13 }}>.nl</span></span>
        </Link>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'rgba(255,255,255,0.6)', fontSize: 14 }}>📍 <span>{location || 'Detecting...'}</span></div>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <div style={{ display: 'flex', background: 'rgba(255,255,255,0.06)', borderRadius: 10, padding: 3 }}>
          {(['delivery', 'pickup', 'reservation'] as const).map(m => (
            <button key={m} onClick={() => setDeliveryMode(m)} style={{ padding: '8px 16px', border: 'none', borderRadius: 8, cursor: 'pointer', fontSize: 13, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 6, background: deliveryMode === m ? '#5A31F4' : 'transparent', color: deliveryMode === m ? '#fff' : 'rgba(255,255,255,0.5)', transition: 'all 0.2s' }}>
              {m === 'delivery' ? '🚲' : m === 'pickup' ? '🏪' : '🍽️'} {m === 'reservation' ? 'Reserve' : t(m)}
            </button>
          ))}
        </div>
        <button style={{ width: 42, height: 42, borderRadius: 12, background: 'rgba(255,255,255,0.06)', border: 'none', cursor: 'pointer', fontSize: 18, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>🛒</button>
      </div>
    </nav>
  );
}

/* ─── Hero Section with Couple & Purple Bag ─── */
function HeroSection() {
  const { t } = useTranslation();
  const router = useRouter();
  const [address, setAddress] = useState('');
  const handleSearch = (e?: React.FormEvent) => { e?.preventDefault(); router.push('/discover'); };
  return (
    <section style={{ minHeight: '95vh', display: 'flex', alignItems: 'center', padding: '0 60px', paddingTop: 70, position: 'relative', overflow: 'hidden' }}>
      {/* Background glow */}
      <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 30% 50%, rgba(90,49,244,0.15) 0%, transparent 60%)' }} />
      {/* Text content */}
      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} style={{ maxWidth: 580, zIndex: 2, flex: '0 0 auto' }}>
        <h1 style={{ fontSize: 62, fontWeight: 950, lineHeight: 1.05, marginBottom: 24, letterSpacing: -2 }}>
          {t('hero_title').split(',')[0]},<br />
          <span style={{ background: 'linear-gradient(135deg, #5A31F4, #FF0080, #FF6B35)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            {t('hero_title').split(',')[1]}
          </span>
        </h1>
        <p style={{ fontSize: 20, color: 'rgba(255,255,255,0.55)', marginBottom: 40, lineHeight: 1.6 }}>{t('hero_subtitle')}</p>
        <motion.form onSubmit={handleSearch} style={{ display: 'flex', gap: 8, background: 'rgba(255,255,255,0.05)', padding: 8, borderRadius: 50, border: '1px solid rgba(255,255,255,0.1)', maxWidth: 520, backdropFilter: 'blur(20px)', boxShadow: '0 20px 40px rgba(0,0,0,0.3)' }}>
          <input type="text" placeholder="Search delivery, pickup, or reservations..." value={address} onChange={e => setAddress(e.target.value)} style={{ flex: 1, background: 'transparent', border: 'none', padding: '14px 24px', color: 'white', fontSize: 16, outline: 'none', fontFamily: 'inherit' }} />
          <button type="submit" style={{ background: 'linear-gradient(135deg, #5A31F4, #FF0080, #FF6B35)', color: 'white', border: 'none', padding: '14px 36px', borderRadius: 40, fontSize: 16, fontWeight: 800, cursor: 'pointer', boxShadow: '0 8px 16px rgba(90,49,244,0.3)' }}>Explore</button>
        </motion.form>
      </motion.div>
      {/* Couple eating in the restaurant hero image */}
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.3 }} style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', position: 'relative', zIndex: 2 }}>
        <div style={{ position: 'relative', width: '100%', maxWidth: 580 }}>
          <img src="/food/hero-feast.png" alt="Couple enjoying a feast in a restaurant" style={{ width: '100%', borderRadius: 24, boxShadow: '0 30px 80px rgba(90,49,244,0.25)', border: '2px solid rgba(90,49,244,0.2)' }} />
          {/* Floating food badges */}
          <div style={{ position: 'absolute', top: -10, right: -10, width: 70, height: 70, borderRadius: '50%', overflow: 'hidden', border: '3px solid #5A31F4', boxShadow: '0 8px 20px rgba(0,0,0,0.4)' }}>
            <img src="/food/cat-pizza.png" alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>
          <div style={{ position: 'absolute', bottom: 20, left: -20, width: 65, height: 65, borderRadius: '50%', overflow: 'hidden', border: '3px solid #FF0080', boxShadow: '0 8px 20px rgba(0,0,0,0.4)' }}>
            <img src="/food/cat-sushi.png" alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>
          <div style={{ position: 'absolute', top: '40%', right: -25, width: 60, height: 60, borderRadius: '50%', overflow: 'hidden', border: '3px solid #FF6B35', boxShadow: '0 8px 20px rgba(0,0,0,0.4)' }}>
            <img src="/food/cat-burger.png" alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>
        </div>
      </motion.div>
    </section>
  );
}

/* ─── Food Culture Gallery ─── */
function FoodCultureSection() {
  const cuisines = [
    { img: '/food/cat-pizza.png', name: 'Pizza' },
    { img: '/food/cat-burger.png', name: 'Burgers' },
    { img: '/food/cat-sushi.png', name: 'Sushi' },
    { img: '/food/cat-curry.png', name: 'Curry' },
    { img: '/food/cat-kebab.png', name: 'Kebab' },
    { img: '/food/cat-dessert.png', name: 'Dessert' },
  ];
  return (
    <section style={{ padding: '80px 60px' }}>
      <h2 style={{ textAlign: 'center', fontSize: 40, fontWeight: 900, marginBottom: 16 }}>
        A World of <span style={{ background: 'linear-gradient(135deg,#5A31F4,#FF0080)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Flavor</span>
      </h2>
      <p style={{ textAlign: 'center', color: 'rgba(255,255,255,0.45)', fontSize: 18, marginBottom: 48, maxWidth: 600, margin: '0 auto 48px' }}>
        From street food to fine dining — every culture, every craving, royally delivered.
      </p>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20, maxWidth: 900, margin: '0 auto' }}>
        {cuisines.map((c, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
            style={{ position: 'relative', borderRadius: 20, overflow: 'hidden', aspectRatio: '4/3', cursor: 'pointer', border: '1px solid rgba(255,255,255,0.06)' }}>
            <img src={c.img} alt={c.name} style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.4s' }} />
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 60%)' }} />
            <span style={{ position: 'absolute', bottom: 16, left: 20, fontSize: 20, fontWeight: 800, color: 'white' }}>{c.name}</span>
          </motion.div>
        ))}
      </div>
      {/* Full width world cuisines banner */}
      <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} style={{ marginTop: 40, borderRadius: 24, overflow: 'hidden', position: 'relative', maxWidth: 900, margin: '40px auto 0' }}>
        <img src="/food/world-cuisines.png" alt="Diverse world cuisines" style={{ width: '100%', borderRadius: 24, border: '1px solid rgba(90,49,244,0.15)' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right, rgba(10,10,15,0.8) 0%, transparent 50%, rgba(10,10,15,0.8) 100%)', borderRadius: 24 }} />
        <div style={{ position: 'absolute', bottom: 30, left: 40 }}>
          <p style={{ fontSize: 28, fontWeight: 900 }}>Every Culture. Every Craving.</p>
          <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: 16 }}>1000+ restaurants. One royal experience.</p>
        </div>
      </motion.div>
    </section>
  );
}

/* ─── How It Works ─── */
function HowItWorks() {
  const { t } = useTranslation();
  const steps = [
    { icon: '📍', title: 'Find or Book', text: 'Discover local gems for delivery or reserve a table' },
    { icon: '🍳', title: 'Savor the Moment', text: 'Browse curated menus with stunning AI photography' },
    { icon: '👑', title: 'Royal Experience', text: 'Enjoy elite service, whether at home or dining in' },
  ];
  return (
    <section style={{ padding: '80px 60px', background: 'rgba(90,49,244,0.03)' }}>
      <h2 style={{ textAlign: 'center', fontSize: 40, fontWeight: 900, marginBottom: 56 }}>How EnJoy Works</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 32, maxWidth: 960, margin: '0 auto' }}>
        {steps.map((s, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.15 }}
            style={{ textAlign: 'center', padding: '40px 24px', borderRadius: 20, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
            <div style={{ fontSize: 48, marginBottom: 20 }}>{s.icon}</div>
            <h3 style={{ fontSize: 20, fontWeight: 800, marginBottom: 12 }}>{s.title}</h3>
            <p style={{ color: 'rgba(255,255,255,0.5)', lineHeight: 1.6, fontSize: 15 }}>{s.text}</p>
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
    { name: 'Royal Kitchen', cuisine: 'Indian · Curry', rating: 4.8, time: '25-35 min', img: '/food/royal-kitchen.png' },
    { name: 'Burger Empire', cuisine: 'Burgers · American', rating: 4.6, time: '15-25 min', img: '/food/burger-empire.png' },
    { name: 'Sushi Palace', cuisine: 'Japanese · Sushi', rating: 4.9, time: '30-40 min', img: '/food/sushi-palace.png' },
    { name: 'Pizza Throne', cuisine: 'Italian · Pizza', rating: 4.7, time: '20-30 min', img: '/food/pizza-throne.png' },
  ];
  return (
    <section style={{ padding: '80px 60px' }}>
      <h2 style={{ textAlign: 'center', fontSize: 40, fontWeight: 900, marginBottom: 48 }}>{t('popular_near')}</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 24, maxWidth: 960, margin: '0 auto' }}>
        {restaurants.map((r, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
            style={{ display: 'flex', background: 'rgba(255,255,255,0.03)', borderRadius: 20, border: '1px solid rgba(255,255,255,0.06)', overflow: 'hidden', cursor: 'pointer' }}>
            <div style={{ width: 160, height: 140, position: 'relative', overflow: 'hidden', flexShrink: 0 }}>
              <img src={r.img} alt={r.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
            <div style={{ flex: 1, padding: '18px 20px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <h3 style={{ fontSize: 18, fontWeight: 800, marginBottom: 4 }}>{r.name}</h3>
              <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: 14, marginBottom: 12 }}>{r.cuisine}</p>
              <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                <span style={{ background: 'rgba(255,215,0,0.1)', color: '#FFD700', padding: '4px 10px', borderRadius: 8, fontSize: 13, fontWeight: 700 }}>⭐ {r.rating}</span>
                <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: 13 }}>{r.time}</span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

/* ─── Footer ─── */
const footerLinks: Record<string, { label: string; href: string }[]> = {
  Company: [{ label: 'About Us', href: '/about' }, { label: 'Careers', href: '/careers' }, { label: 'Blog', href: '/blog' }],
  Support: [{ label: 'Help Center', href: '/help' }, { label: 'Contact', href: '/contact' }, { label: 'FAQ', href: '/faq' }],
  Legal: [{ label: 'Privacy', href: '/privacy' }, { label: 'Terms', href: '/terms' }, { label: 'Cookies', href: '/cookies' }],
};
function Footer() {
  return (
    <footer style={{ padding: '60px 60px 32px', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 40, flexWrap: 'wrap', gap: 40 }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ width: 32, height: 32, background: 'linear-gradient(135deg, #E8703A, #FF4500)', borderRadius: 7, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>🛵</div>
            <span style={{ fontSize: 22, fontWeight: 900, color: 'white' }}>En<span style={{ color: '#E8703A' }}>Joy</span><span style={{ color: '#E8703A', fontSize: 12 }}>.nl</span></span>
          </div>
          <p style={{ color: 'rgba(255,255,255,0.4)', marginTop: 12, fontSize: 14, maxWidth: 280, lineHeight: 1.6 }}>Elite gourmet delivery. Royally crafted, impeccably delivered.</p>
        </div>
        {Object.entries(footerLinks).map(([title, links], i) => (
          <div key={i}>
            <h4 style={{ color: 'white', fontWeight: 800, marginBottom: 16, fontSize: 13, textTransform: 'uppercase', letterSpacing: 1 }}>{title}</h4>
            {links.map(l => <Link key={l.label} href={l.href} style={{ display: 'block', color: 'rgba(255,255,255,0.35)', fontSize: 14, marginBottom: 10, transition: 'color 0.2s' }}>{l.label}</Link>)}
          </div>
        ))}
      </div>
      <div style={{ textAlign: 'center', color: 'rgba(255,255,255,0.2)', fontSize: 13, paddingTop: 24, borderTop: '1px solid rgba(255,255,255,0.04)' }}>© 2026 EnJoy. All rights reserved. Royal Delivery Worldwide.</div>
    </footer>
  );
}

/* ─── Main Page ─── */
export default function LandingPage() {
  return (
    <TranslationProvider>
      <div style={{ background: '#0A0A0F', minHeight: '100vh', color: 'white', overflowX: 'hidden' }}>
        <Navbar />
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
