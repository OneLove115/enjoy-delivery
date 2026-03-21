'use client';
import Link from 'next/link';

const S = { page: { background: '#0A0A0F', minHeight: '100vh', color: 'white', fontFamily: 'Outfit, sans-serif' } as const, container: { maxWidth: 800, margin: '0 auto', padding: '120px 40px 60px' } as const, h1: { fontSize: 42, fontWeight: 900, marginBottom: 32, background: 'linear-gradient(135deg,#5A31F4,#FF0080)', WebkitBackgroundClip: 'text' as const, WebkitTextFillColor: 'transparent' as const } as const, h2: { fontSize: 24, fontWeight: 800, marginTop: 40, marginBottom: 16, color: '#fff' } as const, p: { color: 'rgba(255,255,255,0.6)', lineHeight: 1.8, fontSize: 16, marginBottom: 16 } as const, back: { display: 'inline-block', marginBottom: 32, color: '#5A31F4', fontWeight: 700, fontSize: 14 } as const };

export default function CookiesPage() {
  return (
    <div style={S.page}><div style={S.container}>
      <Link href="/" style={S.back}>← Back to EnJoy</Link>
      <h1 style={S.h1}>Cookie Policy</h1>
      <p style={S.p}><strong>Effective Date:</strong> March 20, 2026</p>
      <p style={S.p}>EnJoy uses cookies to enhance your browsing experience, analyze traffic, and personalize content. This policy explains what cookies are, how we use them, and your choices.</p>

      <h2 style={S.h2}>What Are Cookies?</h2>
      <p style={S.p}>Cookies are small text files stored on your device when you visit a website. They help the site remember your preferences, login status, and browsing behavior.</p>

      <h2 style={S.h2}>Cookies We Use</h2>
      <p style={S.p}><strong>Essential Cookies:</strong> Required for basic functionality — login sessions, cart contents, and security tokens. Cannot be disabled.</p>
      <p style={S.p}><strong>Performance Cookies:</strong> Help us understand how visitors interact with our platform by collecting anonymous analytics data (page views, bounce rates, popular features).</p>
      <p style={S.p}><strong>Functional Cookies:</strong> Remember your preferences such as language (Dutch/English), delivery mode, and saved addresses.</p>
      <p style={S.p}><strong>Marketing Cookies:</strong> Used with your consent to deliver personalized promotions and track the effectiveness of our campaigns across channels.</p>

      <h2 style={S.h2}>Managing Cookies</h2>
      <p style={S.p}>You can manage cookie preferences through your browser settings. Note that disabling essential cookies may prevent you from using certain features. Most browsers allow you to block or delete cookies — check your browser&apos;s help documentation for instructions.</p>

      <h2 style={S.h2}>Third-Party Cookies</h2>
      <p style={S.p}>We may use cookies from trusted third parties including Google Analytics, Vercel Analytics, and payment processors. These cookies are governed by the respective third party&apos;s privacy policy.</p>
    </div></div>
  );
}
