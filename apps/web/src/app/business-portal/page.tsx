'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Nav } from '../components/Nav';
import { Footer } from '../components/Footer';

const PURPLE = '#5A31F4';
const PINK = '#FF0080';
const ORANGE = '#FF6B00';

const API_URL = process.env.NEXT_PUBLIC_VP_DOMAIN || 'https://veloci.online';

const inputStyle: React.CSSProperties = {
  width: '100%',
  background: 'rgba(255,255,255,0.04)',
  border: '1px solid rgba(255,255,255,0.1)',
  borderRadius: 12,
  padding: '14px 18px',
  color: 'var(--text-primary)',
  fontSize: 15,
  outline: 'none',
  fontFamily: 'Outfit, sans-serif',
  boxSizing: 'border-box',
};

const labelStyle: React.CSSProperties = {
  fontSize: 13,
  fontWeight: 700,
  color: 'var(--text-muted)',
  display: 'block',
  marginBottom: 6,
};

export default function BusinessPortalPage() {
  const router = useRouter();
  const [tab, setTab] = useState<'login' | 'signup'>('login');

  // Login state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginError, setLoginError] = useState('');

  // Signup state
  const [companyName, setCompanyName] = useState('');
  const [contactName, setContactName] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [teamSize, setTeamSize] = useState('');
  const [signupLoading, setSignupLoading] = useState(false);
  const [signupError, setSignupError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginLoading(true);
    setLoginError('');
    try {
      const res = await fetch(`${API_URL}/api/business-portal/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: loginEmail, password: loginPassword }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || err.error || 'Inloggen mislukt. Controleer je gegevens.');
      }
      const data = await res.json();
      localStorage.setItem('enjoy-business-token', data.token);
      if (data.account?.companyName) {
        localStorage.setItem('enjoy-business-company', data.account.companyName);
      }
      router.push('/business-portal/dashboard');
    } catch (err: any) {
      setLoginError(err.message || 'Inloggen mislukt. Probeer opnieuw.');
    } finally {
      setLoginLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setSignupLoading(true);
    setSignupError('');
    try {
      const res = await fetch(`${API_URL}/api/business-portal/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          companyName,
          contactName,
          email: signupEmail,
          password: signupPassword,
          teamSize,
        }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || err.error || 'Registratie mislukt. Probeer opnieuw.');
      }
      const data = await res.json();
      localStorage.setItem('enjoy-business-token', data.token);
      if (data.account?.companyName) {
        localStorage.setItem('enjoy-business-company', data.account.companyName);
      }
      router.push('/business-portal/dashboard');
    } catch (err: any) {
      setSignupError(err.message || 'Registratie mislukt. Probeer opnieuw.');
    } finally {
      setSignupLoading(false);
    }
  };

  return (
    <div style={{ background: 'var(--bg-page)', minHeight: '100vh', color: 'var(--text-primary)', fontFamily: 'Outfit, sans-serif' }}>
      <Nav />

      <section style={{
        minHeight: 'calc(100vh - 140px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: 'clamp(32px,5vw,80px) clamp(16px,4vw,40px)',
        position: 'relative',
      }}>
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 50% 40%, rgba(90,49,244,0.1) 0%, transparent 65%)' }} />

        <div style={{ position: 'relative', zIndex: 1, width: '100%', maxWidth: 520 }}>
          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: 40 }}>
            <div style={{
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
              width: 72, height: 72, borderRadius: 20,
              background: `linear-gradient(135deg,${PURPLE},${PINK})`,
              fontSize: 32, marginBottom: 20,
              boxShadow: `0 8px 24px ${PURPLE}40`,
            }}>
              🏢
            </div>
            <h1 style={{ fontSize: 'clamp(24px,5vw,36px)', fontWeight: 950, letterSpacing: -1, marginBottom: 10 }}>
              Business Portal
            </h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: 16, lineHeight: 1.6 }}>
              Beheer zakelijke maaltijdbestellingen voor jouw team.
            </p>
          </div>

          {/* Tabs */}
          <div style={{
            display: 'flex', background: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(255,255,255,0.08)', borderRadius: 14,
            padding: 4, marginBottom: 24,
          }}>
            {(['login', 'signup'] as const).map(t => (
              <button
                key={t}
                onClick={() => setTab(t)}
                style={{
                  flex: 1, padding: '12px 0', borderRadius: 10, border: 'none',
                  cursor: 'pointer', fontSize: 15, fontWeight: 700,
                  fontFamily: 'Outfit, sans-serif',
                  background: tab === t ? `linear-gradient(135deg,${PURPLE},${PINK})` : 'transparent',
                  color: tab === t ? 'white' : 'var(--text-secondary)',
                  transition: 'all 0.2s',
                }}
              >
                {t === 'login' ? 'Inloggen' : 'Account aanmaken'}
              </button>
            ))}
          </div>

          {/* Login form */}
          {tab === 'login' && (
            <form onSubmit={handleLogin} style={{
              background: 'var(--bg-card)', borderRadius: 24,
              border: '1px solid var(--border)',
              padding: 'clamp(24px,4vw,40px)',
              display: 'flex', flexDirection: 'column', gap: 18,
            }}>
              <div>
                <label style={labelStyle}>E-mailadres *</label>
                <input
                  type="email" required
                  value={loginEmail} onChange={e => setLoginEmail(e.target.value)}
                  placeholder="jij@bedrijf.nl"
                  style={inputStyle}
                />
              </div>
              <div>
                <label style={labelStyle}>Wachtwoord *</label>
                <input
                  type="password" required
                  value={loginPassword} onChange={e => setLoginPassword(e.target.value)}
                  placeholder="Jouw wachtwoord"
                  style={inputStyle}
                />
              </div>

              {loginError && (
                <p style={{ color: '#ef4444', fontSize: 14, fontWeight: 600, margin: 0 }}>{loginError}</p>
              )}

              <button
                type="submit" disabled={loginLoading}
                style={{
                  background: `linear-gradient(135deg,${PURPLE},${PINK})`,
                  color: 'white', border: 'none', borderRadius: 14,
                  padding: '17px 0', fontSize: 16, fontWeight: 900,
                  cursor: loginLoading ? 'not-allowed' : 'pointer',
                  opacity: loginLoading ? 0.7 : 1,
                  boxShadow: `0 8px 24px ${PURPLE}35`,
                  letterSpacing: '-0.2px', fontFamily: 'Outfit, sans-serif',
                }}
              >
                {loginLoading ? 'Inloggen…' : 'Inloggen →'}
              </button>

              <div style={{ textAlign: 'center', paddingTop: 8, borderTop: '1px solid var(--border)' }}>
                <Link href="/business" style={{ color: ORANGE, fontWeight: 700, fontSize: 14 }}>
                  Zakelijk account aanvragen →
                </Link>
              </div>
            </form>
          )}

          {/* Signup form */}
          {tab === 'signup' && (
            <form onSubmit={handleSignup} style={{
              background: 'var(--bg-card)', borderRadius: 24,
              border: '1px solid var(--border)',
              padding: 'clamp(24px,4vw,40px)',
              display: 'flex', flexDirection: 'column', gap: 18,
            }}>
              <div>
                <label style={labelStyle}>Bedrijfsnaam *</label>
                <input
                  type="text" required
                  value={companyName} onChange={e => setCompanyName(e.target.value)}
                  placeholder="TechCorp BV"
                  style={inputStyle}
                />
              </div>
              <div>
                <label style={labelStyle}>Contactpersoon *</label>
                <input
                  type="text" required
                  value={contactName} onChange={e => setContactName(e.target.value)}
                  placeholder="Jan de Vries"
                  style={inputStyle}
                />
              </div>
              <div>
                <label style={labelStyle}>E-mailadres *</label>
                <input
                  type="email" required
                  value={signupEmail} onChange={e => setSignupEmail(e.target.value)}
                  placeholder="jan@techcorp.nl"
                  style={inputStyle}
                />
              </div>
              <div>
                <label style={labelStyle}>Wachtwoord *</label>
                <input
                  type="password" required
                  value={signupPassword} onChange={e => setSignupPassword(e.target.value)}
                  placeholder="Minimaal 8 tekens"
                  style={inputStyle}
                />
              </div>
              <div>
                <label style={labelStyle}>Teamgrootte</label>
                <select
                  value={teamSize} onChange={e => setTeamSize(e.target.value)}
                  style={{ ...inputStyle, appearance: 'none' as any }}
                >
                  <option value="">Selecteer teamgrootte</option>
                  <option value="1-10">1 – 10 medewerkers</option>
                  <option value="11-50">11 – 50 medewerkers</option>
                  <option value="51-200">51 – 200 medewerkers</option>
                  <option value="201-500">201 – 500 medewerkers</option>
                  <option value="500+">500+ medewerkers</option>
                </select>
              </div>

              {signupError && (
                <p style={{ color: '#ef4444', fontSize: 14, fontWeight: 600, margin: 0 }}>{signupError}</p>
              )}

              <button
                type="submit" disabled={signupLoading}
                style={{
                  background: `linear-gradient(135deg,${PURPLE},${PINK})`,
                  color: 'white', border: 'none', borderRadius: 14,
                  padding: '17px 0', fontSize: 16, fontWeight: 900,
                  cursor: signupLoading ? 'not-allowed' : 'pointer',
                  opacity: signupLoading ? 0.7 : 1,
                  boxShadow: `0 8px 24px ${PURPLE}35`,
                  letterSpacing: '-0.2px', fontFamily: 'Outfit, sans-serif',
                }}
              >
                {signupLoading ? 'Account aanmaken…' : 'Account aanmaken →'}
              </button>

              <p style={{ color: 'var(--text-muted)', fontSize: 13, textAlign: 'center', lineHeight: 1.5, margin: 0 }}>
                Door je te registreren ga je akkoord met onze{' '}
                <Link href="/terms" style={{ color: 'var(--text-secondary)', fontWeight: 600 }}>voorwaarden</Link>
                {' '}en{' '}
                <Link href="/privacy" style={{ color: 'var(--text-secondary)', fontWeight: 600 }}>privacybeleid</Link>.
              </p>
            </form>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}
