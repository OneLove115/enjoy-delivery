'use client';
import Link from 'next/link';
import { Nav } from '../components/Nav';
import { Footer } from '../components/Footer';

const S = { page: { background: '#0A0A0F', minHeight: '100vh', color: 'white', fontFamily: 'Outfit, sans-serif' } as const, container: { maxWidth: 900, margin: '0 auto', padding: '40px 40px 60px' } as const, h1: { fontSize: 42, fontWeight: 900, marginBottom: 16, background: 'linear-gradient(135deg,#5A31F4,#FF0080)', WebkitBackgroundClip: 'text' as const, WebkitTextFillColor: 'transparent' as const } as const, p: { color: 'rgba(255,255,255,0.6)', lineHeight: 1.8, fontSize: 16, marginBottom: 16 } as const, back: { display: 'inline-block', marginBottom: 32, color: '#5A31F4', fontWeight: 700, fontSize: 14 } as const };

const posts = [
  { title: 'The Rise of AI-Powered Food Photography', date: 'March 20, 2026', excerpt: 'How EnJoy uses artificial intelligence to generate ultra-realistic food images that make your mouth water before you even order.', tag: 'Technology', img: '/food/cat-pizza.png' },
  { title: 'Street Food Around the World: A Royal Tour', date: 'March 18, 2026', excerpt: 'From Tokyo\'s yakitori alleys to Mexico City\'s taco stands — discover how street food culture fuels the EnJoy experience.', tag: 'Food Culture', img: '/food/world-cuisines.png' },
  { title: 'Meet Joya: Your AI Food Concierge', date: 'March 15, 2026', excerpt: 'Voice-powered recommendations, mood-based menus, and learning your preferences. How Joya is redefining the way we order food.', tag: 'Product', img: '/food/cat-sushi.png' },
  { title: 'The Purple Bag Promise: Our Delivery Pledge', date: 'March 12, 2026', excerpt: 'Every EnJoy delivery arrives in our iconic purple branded bag — a symbol of freshness, speed, and the royal treatment.', tag: 'Brand', img: '/food/couple-delivery.png' },
  { title: 'Behind the Kitchen: How We Select Our Partners', date: 'March 10, 2026', excerpt: 'Our rigorous vetting process ensures every restaurant on EnJoy meets our royal standards. Quality over quantity, always.', tag: 'Operations', img: '/food/cat-curry.png' },
  { title: '5 Food Trends Dominating 2026', date: 'March 8, 2026', excerpt: 'Fermentation, plant-forward luxury, and the return of regional comfort food. What\'s hot on the EnJoy platform this year.', tag: 'Trends', img: '/food/hero-feast.png' },
];

export default function BlogPage() {
  return (
    <div style={S.page}>
      <Nav />
      <div style={S.container}>
      <h1 style={S.h1}>The EnJoy Journal</h1>
      <p style={{ ...S.p, fontSize: 20, marginBottom: 48 }}>Food culture, technology, and the royal treatment — stories from the EnJoy kitchen.</p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 24 }}>
        {posts.map((p, i) => (
          <div key={i} style={{ background: 'rgba(255,255,255,0.03)', borderRadius: 20, border: '1px solid rgba(255,255,255,0.06)', overflow: 'hidden', cursor: 'pointer', transition: 'border-color 0.3s' }}>
            <div style={{ height: 180, overflow: 'hidden', position: 'relative' }}>
              <img src={p.img} alt={p.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              <span style={{ position: 'absolute', top: 12, left: 12, background: 'rgba(90,49,244,0.85)', color: 'white', padding: '4px 12px', borderRadius: 8, fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1 }}>{p.tag}</span>
            </div>
            <div style={{ padding: '20px 24px' }}>
              <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: 12, fontWeight: 600, marginBottom: 8 }}>{p.date}</p>
              <h3 style={{ fontSize: 18, fontWeight: 800, marginBottom: 10, lineHeight: 1.3 }}>{p.title}</h3>
              <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: 14, lineHeight: 1.6 }}>{p.excerpt}</p>
            </div>
          </div>
        ))}
      </div>

      <div style={{ textAlign: 'center', marginTop: 48, padding: '32px', background: 'rgba(90,49,244,0.04)', borderRadius: 16 }}>
        <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 15 }}>Full articles are published on our external blog platform and syndicated here automatically.</p>
      </div>
    </div>
      <Footer />
    </div>
  );
}
