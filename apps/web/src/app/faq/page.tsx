'use client';
import Link from 'next/link';
import { Nav } from '../components/Nav';
import { Footer } from '../components/Footer';

const S = { page: { background: '#0A0A0F', minHeight: '100vh', color: 'white', fontFamily: 'Outfit, sans-serif' } as const, container: { maxWidth: 800, margin: '0 auto', padding: '40px 40px 60px' } as const, h1: { fontSize: 42, fontWeight: 900, marginBottom: 16, background: 'linear-gradient(135deg,#5A31F4,#FF0080)', WebkitBackgroundClip: 'text' as const, WebkitTextFillColor: 'transparent' as const } as const, h2: { fontSize: 24, fontWeight: 800, marginTop: 40, marginBottom: 16, color: '#fff' } as const, p: { color: 'rgba(255,255,255,0.6)', lineHeight: 1.8, fontSize: 16, marginBottom: 16 } as const, back: { display: 'inline-block', marginBottom: 32, color: '#5A31F4', fontWeight: 700, fontSize: 14 } as const };

const faqs = [
  { q: 'How do I place an order?', a: 'Simply enter your address on the homepage, browse restaurants near you, select your dishes, and complete checkout. Your meal will be at your door in minutes!' },
  { q: 'What payment methods do you accept?', a: 'We accept Visa, Mastercard, American Express, iDEAL, Apple Pay, Google Pay, and PayPal. All payments are securely processed with end-to-end encryption.' },
  { q: 'Can I track my delivery?', a: 'Yes! Once your order is confirmed, you can track your courier in real-time through our app and website. You will also receive push notifications with updates.' },
  { q: 'What if my order is wrong or missing items?', a: 'Contact our support team through the Joya AI concierge or the Help Center within 24 hours. We will arrange a refund or replacement immediately.' },
  { q: 'How do I become a restaurant partner?', a: 'Visit our Partner page or email partners@enjoy.delivery. We will guide you through onboarding, menu setup (with AI-generated food photography!), and going live.' },
  { q: 'Is there a minimum order?', a: 'Minimum order amounts vary by restaurant partner. The minimum is displayed on each restaurant\'s page before you add items to your cart.' },
  { q: 'How does Joya AI work?', a: 'Joya is our AI-powered food concierge. You can chat or use voice commands to get personalized restaurant recommendations, reorder favorites, or discover new cuisines based on your mood.' },
  { q: 'Do you deliver in my area?', a: 'We are rapidly expanding! Enter your address on the homepage to see if we deliver to you. Currently serving major cities in The Netherlands and expanding across Europe.' },
];

export default function FAQPage() {
  return (
    <div style={S.page}>
      <Nav />
      <div style={S.container}>
      <h1 style={S.h1}>Frequently Asked Questions</h1>
      <p style={{ ...S.p, marginBottom: 40 }}>Everything you need to know about EnJoy. Can&apos;t find your answer? Chat with Joya or contact our support team.</p>
      {faqs.map((f, i) => (
        <div key={i} style={{ marginBottom: 28, padding: '24px 28px', background: 'rgba(255,255,255,0.03)', borderRadius: 16, border: '1px solid rgba(255,255,255,0.06)' }}>
          <h3 style={{ fontSize: 18, fontWeight: 800, marginBottom: 10, color: '#fff' }}>{f.q}</h3>
          <p style={{ ...S.p, marginBottom: 0 }}>{f.a}</p>
        </div>
      ))}
    </div>
      <Footer />
    </div>
  );
}
