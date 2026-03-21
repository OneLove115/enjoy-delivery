'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { TranslationProvider, useTranslation } from '../context/TranslationContext';
import { JoyaChatWidget } from '../components/JoyaChatWidget';

const categories = [
  { icon: '🍕', label: 'Pizza' }, { icon: '🍔', label: 'Burgers' },
  { icon: '🍱', label: 'Sushi' }, { icon: '🥙', label: 'Kebab' },
  { icon: '🍜', label: 'Asian' }, { icon: '🥗', label: 'Healthy' },
  { icon: '🍰', label: 'Dessert' }, { icon: '☕', label: 'Drinks' },
];

const restaurants = [
  { name: 'Royal Kitchen', cuisine: 'Indian · Curry', rating: 4.8, time: '25-35', emoji: '🍛', img: '/food/royal-kitchen.png' },
  { name: 'Burger Empire', cuisine: 'Burgers · American', rating: 4.6, time: '15-25', emoji: '🍔', img: '/food/burger-empire.png' },
  { name: 'Sushi Palace', cuisine: 'Japanese · Sushi', rating: 4.9, time: '30-40', emoji: '🍣', img: '/food/sushi-palace.png' },
  { name: 'Pizza Throne', cuisine: 'Italian · Pizza', rating: 4.7, time: '20-30', emoji: '🍕', img: '/food/pizza-throne.png' },
  { name: 'Taco Kingdom', cuisine: 'Mexican · Street', rating: 4.5, time: '20-30', emoji: '🌮', img: '/food/taco-kingdom.png' },
  { name: 'Pho Dynasty', cuisine: 'Vietnamese · Soups', rating: 4.8, time: '25-35', emoji: '🍜', img: '/food/hero-feast.png' },
];

function DiscoverContent() {
  const { t } = useTranslation();
  const [search, setSearch] = useState('');
  const filtered = restaurants.filter(r =>
    r.name.toLowerCase().includes(search.toLowerCase()) ||
    r.cuisine.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{ background: '#0A0A0F', minHeight: '100vh', color: 'white', paddingTop: '90px' }}>
      {/* Back Nav */}
      <nav style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100, height: '70px', display: 'flex', alignItems: 'center', padding: '0 32px', background: 'rgba(10,10,15,0.9)', backdropFilter: 'blur(20px)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <Link href="/" style={{ fontSize: '24px', fontWeight: '900', textDecoration: 'none', color: 'white' }}>
          En<span style={{ background: 'linear-gradient(135deg, #5A31F4, #FF0080)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Joy</span>
        </Link>
      </nav>

      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '0 24px' }}>
        {/* Search */}
        <div style={{ display: 'flex', background: 'rgba(255,255,255,0.05)', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.08)', padding: '4px', marginBottom: '40px' }}>
          <input type="text" placeholder="Search restaurants or dishes…" value={search} onChange={e => setSearch(e.target.value)}
            style={{ flex: 1, background: 'transparent', border: 'none', padding: '16px 20px', color: 'white', fontSize: '16px', outline: 'none', fontFamily: 'inherit' }} />
        </div>

        {/* Categories */}
        <h2 style={{ fontSize: '24px', fontWeight: '800', marginBottom: '20px' }}>{t('explore_cuisines')}</h2>
        <div style={{ display: 'flex', gap: '16px', overflowX: 'auto', marginBottom: '48px', paddingBottom: '8px' }}>
          {categories.map((c, i) => (
            <div key={i} style={{ textAlign: 'center', minWidth: '80px', cursor: 'pointer' }}>
              <div style={{ width: '64px', height: '64px', borderRadius: '20px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 8px', fontSize: '28px', transition: 'all 0.2s' }}>
                {c.icon}
              </div>
              <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: '13px', fontWeight: '600' }}>{c.label}</span>
            </div>
          ))}
        </div>

        {/* Restaurant Grid */}
        <h2 style={{ fontSize: '24px', fontWeight: '800', marginBottom: '24px' }}>{t('popular_near')}</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '20px', paddingBottom: '60px' }}>
          {filtered.map((r, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
              style={{ display: 'flex', background: 'rgba(255,255,255,0.03)', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.06)', overflow: 'hidden', cursor: 'pointer', transition: 'border-color 0.2s' }}>
              <div style={{ width: '140px', minHeight: '130px', position: 'relative', overflow: 'hidden' }}>
                <img src={r.img} alt={r.name} style={{ width: '100%', height: '100%', objectFit: 'cover', position: 'absolute', inset: 0 }} />
                <span style={{ position: 'absolute', bottom: '8px', right: '8px', fontSize: '20px', background: 'rgba(0,0,0,0.5)', borderRadius: '8px', padding: '2px 6px' }}>{r.emoji}</span>
              </div>
              <div style={{ flex: 1, padding: '16px' }}>
                <h3 style={{ fontSize: '16px', fontWeight: '800', marginBottom: '4px' }}>{r.name}</h3>
                <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: '13px', marginBottom: '10px' }}>{r.cuisine}</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span style={{ background: 'rgba(255,215,0,0.1)', color: '#FFD700', padding: '3px 8px', borderRadius: '8px', fontSize: '13px', fontWeight: '700' }}>⭐ {r.rating}</span>
                  <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: '13px' }}>{r.time} min</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
      <JoyaChatWidget />
    </div>
  );
}

export default function DiscoverPage() {
  return <TranslationProvider><DiscoverContent /></TranslationProvider>;
}
