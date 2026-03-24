'use client';
import Link from 'next/link';
import { Nav } from '../components/Nav';
import { Footer } from '../components/Footer';

const S = { page: { background: '#0A0A0F', minHeight: '100vh', color: 'white', fontFamily: 'Outfit, sans-serif' } as const, container: { maxWidth: 800, margin: '0 auto', padding: '40px 40px 60px' } as const, h1: { fontSize: 42, fontWeight: 900, marginBottom: 32, background: 'linear-gradient(135deg,#5A31F4,#FF0080)', WebkitBackgroundClip: 'text' as const, WebkitTextFillColor: 'transparent' as const } as const, h2: { fontSize: 24, fontWeight: 800, marginTop: 40, marginBottom: 16, color: '#fff' } as const, p: { color: 'rgba(255,255,255,0.6)', lineHeight: 1.8, fontSize: 16, marginBottom: 16 } as const, back: { display: 'inline-block', marginBottom: 32, color: '#5A31F4', fontWeight: 700, fontSize: 14 } as const };

export default function PrivacyPage() {
  return (
    <div style={S.page}>
      <Nav />
      <div style={S.container}>
      <h1 style={S.h1}>Privacy Policy</h1>
      <p style={S.p}><strong>Effective Date:</strong> March 20, 2026</p>
      <p style={S.p}>EnJoy (&quot;we,&quot; &quot;us,&quot; or &quot;our&quot;) is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our food delivery platform, mobile application, and website.</p>

      <h2 style={S.h2}>1. Information We Collect</h2>
      <p style={S.p}><strong>Personal Data:</strong> Name, email address, phone number, delivery address, payment information, and location data when you use our services.</p>
      <p style={S.p}><strong>Usage Data:</strong> Browser type, device information, pages visited, time spent, click patterns, and search queries within our platform.</p>
      <p style={S.p}><strong>Location Data:</strong> With your consent, we collect precise geolocation data to provide delivery services and show restaurants near you.</p>

      <h2 style={S.h2}>2. How We Use Your Information</h2>
      <p style={S.p}>We use your personal data to: process and deliver your food orders, provide customer support via Joya AI concierge, personalize your experience and recommendations, send order updates and promotional communications (with consent), improve our platform and develop new features, and ensure the security of our services.</p>

      <h2 style={S.h2}>3. Data Sharing</h2>
      <p style={S.p}>We share your information with: restaurant partners (order details for preparation), delivery couriers (delivery address and contact), payment processors (encrypted payment data), and analytics services (anonymized usage data). We never sell your personal data to third parties.</p>

      <h2 style={S.h2}>4. Data Security</h2>
      <p style={S.p}>We implement industry-standard security measures including SSL/TLS encryption, secure API proxies, tokenized payments, and regular security audits to protect your information.</p>

      <h2 style={S.h2}>5. Your Rights (GDPR)</h2>
      <p style={S.p}>Under the General Data Protection Regulation, you have the right to: access your personal data, rectify inaccurate data, request erasure of your data, restrict processing, data portability, and object to processing. Contact us at privacy@enjoy.delivery to exercise these rights.</p>

      <h2 style={S.h2}>6. Cookies</h2>
      <p style={S.p}>We use cookies and similar technologies to enhance your experience. See our <Link href="/cookies" style={{ color: '#5A31F4' }}>Cookie Policy</Link> for details.</p>

      <h2 style={S.h2}>7. Contact Us</h2>
      <p style={S.p}>For privacy-related inquiries, contact our Data Protection Officer at <strong>privacy@enjoy.delivery</strong> or write to EnJoy B.V., Den Haag, The Netherlands.</p>
    </div>
      <Footer />
    </div>
  );
}
