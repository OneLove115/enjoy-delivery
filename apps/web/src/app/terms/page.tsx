'use client';
import Link from 'next/link';

const S = { page: { background: '#0A0A0F', minHeight: '100vh', color: 'white', fontFamily: 'Outfit, sans-serif' } as const, container: { maxWidth: 800, margin: '0 auto', padding: '120px 40px 60px' } as const, h1: { fontSize: 42, fontWeight: 900, marginBottom: 32, background: 'linear-gradient(135deg,#5A31F4,#FF0080)', WebkitBackgroundClip: 'text' as const, WebkitTextFillColor: 'transparent' as const } as const, h2: { fontSize: 24, fontWeight: 800, marginTop: 40, marginBottom: 16, color: '#fff' } as const, p: { color: 'rgba(255,255,255,0.6)', lineHeight: 1.8, fontSize: 16, marginBottom: 16 } as const, back: { display: 'inline-block', marginBottom: 32, color: '#5A31F4', fontWeight: 700, fontSize: 14 } as const };

export default function TermsPage() {
  return (
    <div style={S.page}><div style={S.container}>
      <Link href="/" style={S.back}>← Back to EnJoy</Link>
      <h1 style={S.h1}>Terms of Service</h1>
      <p style={S.p}><strong>Effective Date:</strong> March 20, 2026</p>
      <p style={S.p}>Welcome to EnJoy. By accessing or using our platform, you agree to these Terms of Service. Please read them carefully.</p>

      <h2 style={S.h2}>1. Platform Description</h2>
      <p style={S.p}>EnJoy is a premium food delivery marketplace connecting users with restaurant partners. We facilitate ordering, payment processing, and delivery logistics. EnJoy does not prepare food; our restaurant partners are responsible for food quality and preparation.</p>

      <h2 style={S.h2}>2. Account Registration</h2>
      <p style={S.p}>To use our services, you must create an account with accurate information. You are responsible for maintaining the confidentiality of your credentials and for all activities under your account. You must be at least 16 years old.</p>

      <h2 style={S.h2}>3. Orders & Payments</h2>
      <p style={S.p}>All prices are displayed in EUR and include applicable VAT. Payment is processed at the time of order. We accept major credit/debit cards, iDEAL, and digital wallets. Refunds are handled per our refund policy and are subject to the nature of the complaint.</p>

      <h2 style={S.h2}>4. Delivery</h2>
      <p style={S.p}>Delivery times are estimates and may vary. EnJoy partners with independent couriers. We are not liable for delays caused by traffic, weather, or restaurant preparation times. If your order does not arrive, contact our support team immediately.</p>

      <h2 style={S.h2}>5. User Conduct</h2>
      <p style={S.p}>You agree not to: use the platform for illegal purposes, harass delivery personnel or restaurant staff, create fake accounts or reviews, attempt to circumvent security measures, or reverse engineer any part of our platform.</p>

      <h2 style={S.h2}>6. Intellectual Property</h2>
      <p style={S.p}>All content, branding, logos (including the EnJoy crown and purple branded bag), and AI features (Joya concierge) are the exclusive property of EnJoy B.V. Unauthorized use is prohibited.</p>

      <h2 style={S.h2}>7. Limitation of Liability</h2>
      <p style={S.p}>EnJoy&apos;s liability is limited to the amount paid for the relevant order. We are not liable for indirect, incidental, or consequential damages arising from the use of our platform.</p>

      <h2 style={S.h2}>8. Governing Law</h2>
      <p style={S.p}>These terms are governed by the laws of The Netherlands. Disputes will be settled in the courts of Den Haag.</p>
    </div></div>
  );
}
