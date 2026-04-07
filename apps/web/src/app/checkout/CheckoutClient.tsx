'use client';
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCartStore } from '../../store/cart';
import { motion, AnimatePresence } from 'framer-motion';

const STORAGE_KEY = 'enjoy-checkout-details';

interface CheckoutDetails {
  street: string;
  postcode: string;
  city: string;
  notes: string;
  name: string;
  phone: string;
  email: string;
  payment: string;
}

const EMPTY: CheckoutDetails = {
  street: '', postcode: '', city: '', notes: '',
  name: '', phone: '', email: '', payment: 'ideal',
};

const PURPLE = '#5A31F4';
const PINK   = '#FF0080';
const ORANGE = '#FF6B35';

const GRADIENT = `linear-gradient(135deg, ${PURPLE}, ${PINK})`;
const GRADIENT_HOVER = `linear-gradient(135deg, #6B42FF, #FF1A8C)`;

export default function CheckoutClient() {
  const { items, restaurantName, restaurantSlug, total, itemCount, clearCart, currency, locale } = useCartStore();
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [tip, setTip] = useState<number>(0);
  const [form, setForm] = useState<CheckoutDetails>(EMPTY);
  const [showSuccess, setShowSuccess] = useState(false);
  const pendingRedirect = useRef<() => void>(() => {});
  const [authChecked, setAuthChecked] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    fetch('/api/auth/me')
      .then(r => { setIsLoggedIn(r.ok); setAuthChecked(true); })
      .catch(() => { setIsLoggedIn(false); setAuthChecked(true); });
  }, []);

  const subtotal = total();
  const TAX_RATE = 0.09;
  const SERVICE_FEE_RATE = 0.05;
  const taxAmount = subtotal * TAX_RATE;
  const serviceFee = subtotal * SERVICE_FEE_RATE;
  const grandTotal = subtotal + taxAmount + serviceFee + tip;

  const formatPrice = (n: number) =>
    new Intl.NumberFormat(locale || 'nl-NL', { style: 'currency', currency: currency || 'EUR' }).format(n);

  const set = (key: keyof CheckoutDetails, val: string) => {
    setForm(prev => {
      const next = { ...prev, [key]: val };
      try { localStorage.setItem(STORAGE_KEY, JSON.stringify(next)); } catch {}
      return next;
    });
  };

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved) as Partial<CheckoutDetails>;
        setForm(prev => ({ ...prev, ...parsed }));
      }
    } catch {}
  }, []);

  const validate = (): string | null => {
    if (!form.street.trim()) return 'Vul je straat en huisnummer in';
    if (!form.postcode.trim()) return 'Vul je postcode in';
    if (!form.city.trim()) return 'Vul je stad in';
    if (!form.name.trim()) return 'Vul je naam in';
    if (!form.phone.trim()) return 'Vul je telefoonnummer in';
    if (!form.email.trim() || !form.email.includes('@')) return 'Vul een geldig e-mailadres in';
    if (items.length === 0) return 'Je winkelmandje is leeg';
    return null;
  };

  const handleOrder = async () => {
    const err = validate();
    if (err) { setError(err); return; }
    setError('');
    setSubmitting(true);
    try {
      const res = await fetch('/api/consumer/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: items.map(i => ({
            menuItemId: i.id,
            name: i.name,
            quantity: i.qty,
            unitPrice: i.basePrice,
            price: (parseFloat(i.basePrice) + (i.modifiers || []).reduce((sum: number, m: any) => sum + (m.priceAdjustment || 0), 0)).toFixed(2),
            modifiers: (i.modifiers || []).map(m => ({
              groupId: m.groupId,
              groupName: m.groupName,
              modifierId: m.modifierId,
              name: m.name,
              priceAdjustment: m.priceAdjustment,
            })),
          })),
          restaurantSlug: restaurantSlug || undefined,
          deliveryAddress: `${form.street}, ${form.postcode} ${form.city}`,
          customerName: form.name,
          customerPhone: form.phone,
          customerEmail: form.email,
          notes: form.notes || undefined,
          tip,
          total: grandTotal.toFixed(2),
          paymentMethod: form.payment,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(data.error || data.message || 'Bestelling mislukt');
      }
      if (data.checkoutUrl) {
        clearCart();
        pendingRedirect.current = () => { window.location.href = data.checkoutUrl; };
      } else {
        clearCart();
        pendingRedirect.current = () => { router.push(`/order-success?order=${data.orderNumber || ''}`); };
      }
      setShowSuccess(true);
      setTimeout(() => {
        pendingRedirect.current();
      }, 1500);
    } catch (e: any) {
      setError(e.message || 'Bestelling mislukt. Probeer opnieuw.');
    } finally {
      setSubmitting(false);
    }
  };

  const isDisabled = submitting || items.length === 0;

  if (authChecked && !isLoggedIn) {
    return (
      <div style={{
        background: '#0A0A0F',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: "'Outfit', system-ui, sans-serif",
        padding: 24,
      }}>
        <motion.div
          initial={{ opacity: 0, y: 24, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
          style={{
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: 24,
            padding: '48px 40px',
            maxWidth: 420,
            width: '100%',
            textAlign: 'center',
          }}
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 260, damping: 20, delay: 0.15 }}
            style={{ fontSize: 56, marginBottom: 20, lineHeight: 1 }}
          >
            🔒
          </motion.div>
          <h2 style={{
            fontSize: 26,
            fontWeight: 900,
            color: '#fff',
            marginBottom: 10,
            letterSpacing: '-0.02em',
          }}>
            Log in om te bestellen
          </h2>
          <p style={{
            color: 'rgba(255,255,255,0.45)',
            fontSize: 15,
            lineHeight: 1.6,
            marginBottom: 32,
          }}>
            Je moet ingelogd zijn om een bestelling te plaatsen. Log in of maak een account aan om verder te gaan.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <Link
              href="/login?next=/checkout"
              style={{
                display: 'block',
                padding: '15px 24px',
                borderRadius: 14,
                background: GRADIENT,
                color: '#fff',
                fontSize: 15,
                fontWeight: 800,
                textDecoration: 'none',
                textAlign: 'center',
                boxShadow: '0 6px 24px rgba(90,49,244,0.35)',
                transition: 'transform 0.15s, box-shadow 0.15s',
              }}
            >
              Inloggen
            </Link>
            <Link
              href="/signup?next=/checkout"
              style={{
                display: 'block',
                padding: '15px 24px',
                borderRadius: 14,
                background: 'rgba(255,255,255,0.06)',
                border: '1px solid rgba(255,255,255,0.1)',
                color: '#fff',
                fontSize: 15,
                fontWeight: 700,
                textDecoration: 'none',
                textAlign: 'center',
                transition: 'background 0.15s',
              }}
            >
              Account aanmaken
            </Link>
          </div>
          <Link
            href={restaurantSlug ? `/menu/${restaurantSlug}` : '/discover'}
            style={{
              display: 'inline-block',
              marginTop: 24,
              color: 'rgba(255,255,255,0.35)',
              fontSize: 13,
              fontWeight: 600,
              textDecoration: 'none',
              transition: 'color 0.15s',
            }}
          >
            ← Terug naar menu
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div style={{
      background: 'var(--bg-page, #0A0A0F)',
      minHeight: '100vh',
      color: 'var(--text-primary, #fff)',
      fontFamily: "'Outfit', system-ui, sans-serif",
    }}>
      <style>{`
        @keyframes enjoy-spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes checkout-glow-pulse {
          0%, 100% { opacity: 0.5; }
          50% { opacity: 1; }
        }
        .checkout-input {
          width: 100%;
          background: var(--bg-card, rgba(255,255,255,0.03));
          border: 1px solid var(--border, rgba(255,255,255,0.06));
          border-radius: 10px;
          padding: 12px 16px;
          color: var(--text-primary, #fff);
          font-size: 15px;
          outline: none;
          font-family: inherit;
          box-sizing: border-box;
          transition: border-color 0.15s, box-shadow 0.15s, background 0.15s;
        }
        .checkout-input:focus {
          border-color: ${PURPLE};
          box-shadow: 0 0 0 3px rgba(90,49,244,0.18);
          background: rgba(90,49,244,0.04);
        }
        .checkout-input::placeholder {
          color: var(--text-muted, rgba(255,255,255,0.35));
        }
      `}</style>

      {/* Success overlay */}
      <AnimatePresence>
        {showSuccess && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: 'fixed', inset: 0, zIndex: 9999,
              background: 'rgba(10,10,15,0.95)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              flexDirection: 'column', gap: 20,
            }}
          >
            {/* Glow behind checkmark */}
            <div style={{
              position: 'absolute',
              width: 200, height: 200,
              borderRadius: '50%',
              background: `radial-gradient(circle, rgba(90,49,244,0.25) 0%, transparent 70%)`,
              animation: 'checkout-glow-pulse 1.5s ease-in-out infinite',
            }} />
            <motion.svg
              width={100} height={100} viewBox="0 0 100 100"
              initial={{ scale: 0.6, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: 'spring', stiffness: 260, damping: 20 }}
              style={{ position: 'relative', zIndex: 1 }}
            >
              <defs>
                <linearGradient id="success-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor={PURPLE} />
                  <stop offset="100%" stopColor={PINK} />
                </linearGradient>
              </defs>
              <motion.circle
                cx={50} cy={50} r={44}
                fill="none"
                stroke="url(#success-grad)"
                strokeWidth={4}
                strokeLinecap="round"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
              />
              <motion.path
                d="M28 50 L44 66 L72 36"
                fill="none"
                stroke="url(#success-grad)"
                strokeWidth={6}
                strokeLinecap="round"
                strokeLinejoin="round"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.45, ease: 'easeOut', delay: 0.45 }}
              />
            </motion.svg>
            <motion.p
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              style={{ fontSize: 20, fontWeight: 800, color: 'white', position: 'relative', zIndex: 1 }}
            >
              Bestelling geplaatst!
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Navbar */}
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
        height: 64,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 24px',
        background: 'var(--bg-nav, rgba(10,10,15,0.88))',
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid var(--border, rgba(255,255,255,0.06))',
      }}>
        <Link
          href={restaurantSlug ? `/menu/${restaurantSlug}` : '/discover'}
          style={{
            display: 'flex', alignItems: 'center', gap: 8,
            color: 'var(--text-secondary, rgba(255,255,255,0.55))',
            fontSize: 14, fontWeight: 600, textDecoration: 'none',
            transition: 'color 0.15s',
          }}
        >
          <svg width={16} height={16} viewBox="0 0 16 16" fill="none" style={{ flexShrink: 0 }}>
            <path d="M10 3L5 8L10 13" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <span>Terug naar menu</span>
        </Link>
        <Link href="/" style={{ textDecoration: 'none' }}>
          <img src="/logo-enjoy.png" alt="EnJoy" style={{ height: 34, width: 'auto' }} />
        </Link>
        {/* Spacer to center logo */}
        <div style={{ width: 120 }} />
      </nav>

      {/* Page title */}
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
        style={{
          maxWidth: 1100, margin: '0 auto',
          padding: '92px 24px 0',
          display: 'flex', alignItems: 'baseline', gap: 12,
        }}
      >
        <h1 style={{ fontSize: 30, fontWeight: 900, letterSpacing: '-0.02em' }}>Afrekenen</h1>
        {restaurantName && (
          <span style={{ fontSize: 15, color: 'var(--text-muted, rgba(255,255,255,0.35))', fontWeight: 500 }}>
            bij {restaurantName}
          </span>
        )}
      </motion.div>

      <div style={{
        maxWidth: 1100,
        margin: '0 auto',
        padding: '24px 24px 60px',
        display: 'flex',
        gap: 28,
        alignItems: 'flex-start',
        flexWrap: 'wrap',
      }}>

        {/* Left column: form sections */}
        <div style={{ flex: 1, minWidth: 300, display: 'flex', flexDirection: 'column', gap: 0 }}>

          {/* Error banner */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -8, height: 0 }}
                animate={{ opacity: 1, y: 0, height: 'auto' }}
                exit={{ opacity: 0, y: -8, height: 0 }}
                style={{
                  padding: '13px 16px',
                  borderRadius: 12,
                  background: 'rgba(239,68,68,0.08)',
                  border: '1px solid rgba(239,68,68,0.25)',
                  color: '#fc8181',
                  fontWeight: 600,
                  fontSize: 14,
                  marginBottom: 20,
                  display: 'flex', alignItems: 'center', gap: 10,
                }}
              >
                <svg width={16} height={16} viewBox="0 0 16 16" fill="none" style={{ flexShrink: 0 }}>
                  <circle cx={8} cy={8} r={7} stroke="#fc8181" strokeWidth={1.5} />
                  <path d="M8 5v3M8 10.5v.5" stroke="#fc8181" strokeWidth={1.5} strokeLinecap="round" />
                </svg>
                {error}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Section: Bezorgadres */}
          <FormSection title="Bezorgadres" icon="📍" index={0}>
            <FormField label="Straat en huisnummer">
              <input
                className="checkout-input"
                type="text"
                value={form.street}
                onChange={e => set('street', e.target.value)}
                placeholder="Bijv. Hoofdstraat 42"
              />
            </FormField>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: 12 }}>
              <FormField label="Postcode">
                <input
                  className="checkout-input"
                  type="text"
                  value={form.postcode}
                  onChange={e => set('postcode', e.target.value)}
                  placeholder="1234 AB"
                />
              </FormField>
              <FormField label="Stad">
                <input
                  className="checkout-input"
                  type="text"
                  value={form.city}
                  onChange={e => set('city', e.target.value)}
                  placeholder="Amsterdam"
                />
              </FormField>
            </div>
            <FormField label="Bijzonderheden (optioneel)">
              <input
                className="checkout-input"
                type="text"
                value={form.notes}
                onChange={e => set('notes', e.target.value)}
                placeholder="Bijv. bel twee keer"
              />
            </FormField>
          </FormSection>

          {/* Section: Contactgegevens */}
          <FormSection title="Contactgegevens" icon="👤" index={1}>
            <FormField label="Naam">
              <input
                className="checkout-input"
                type="text"
                value={form.name}
                onChange={e => set('name', e.target.value)}
                placeholder="Voornaam en achternaam"
              />
            </FormField>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <FormField label="Telefoonnummer">
                <input
                  className="checkout-input"
                  type="tel"
                  value={form.phone}
                  onChange={e => set('phone', e.target.value)}
                  placeholder="+31 6 12345678"
                />
              </FormField>
              <FormField label="E-mailadres">
                <input
                  className="checkout-input"
                  type="email"
                  value={form.email}
                  onChange={e => set('email', e.target.value)}
                  placeholder="jouw@email.nl"
                />
              </FormField>
            </div>
          </FormSection>

          {/* Section: Betaalmethode */}
          <FormSection title="Betaalmethode" icon="💳" index={2}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {[
                { id: 'ideal',  label: 'iDEAL',                desc: 'Betaal via je bank',       icon: '🏦' },
                { id: 'card',   label: 'Creditcard / Debitcard', desc: 'Visa, Mastercard, Maestro', icon: '💳' },
                { id: 'paypal', label: 'PayPal',               desc: 'Snel en veilig',            icon: '🅿️' },
              ].map(m => (
                <PaymentOption
                  key={m.id}
                  id={m.id}
                  label={m.label}
                  desc={m.desc}
                  icon={m.icon}
                  selected={form.payment === m.id}
                  onSelect={() => set('payment', m.id)}
                />
              ))}
            </div>
          </FormSection>

          {/* Section: Tip */}
          <FormSection title="Tip voor de bezorger" icon="🎁" index={3}>
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
              {[0, 1, 2, 3].map(amt => (
                <TipButton key={amt} selected={tip === amt} onClick={() => setTip(amt)}>
                  {amt === 0 ? 'Geen tip' : `€ ${amt},00`}
                </TipButton>
              ))}
            </div>
          </FormSection>
        </div>

        {/* Right column: Order summary */}
        <motion.div
          initial={{ opacity: 0, x: 16 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, ease: 'easeOut', delay: 0.15 }}
          style={{ width: 340, flexShrink: 0, position: 'sticky', top: 84 }}
        >
          {/* Glassmorphism card */}
          <div style={{
            background: 'rgba(255,255,255,0.03)',
            backdropFilter: 'blur(24px)',
            WebkitBackdropFilter: 'blur(24px)',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: 20,
            overflow: 'hidden',
          }}>
            {/* Card header with gradient accent */}
            <div style={{
              padding: '18px 20px',
              borderBottom: '1px solid rgba(255,255,255,0.06)',
              background: 'linear-gradient(135deg, rgba(90,49,244,0.08) 0%, rgba(255,0,128,0.04) 100%)',
            }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ fontSize: 16, fontWeight: 800, letterSpacing: '-0.01em' }}>
                    {restaurantName || 'Winkelmandje'}
                  </div>
                  <div style={{ fontSize: 12, color: 'var(--text-muted, rgba(255,255,255,0.35))', marginTop: 3 }}>
                    {itemCount()} product{itemCount() !== 1 ? 'en' : ''}
                  </div>
                </div>
                <Link
                  href={restaurantSlug ? `/menu/${restaurantSlug}` : '/discover'}
                  style={{
                    fontSize: 12,
                    fontWeight: 700,
                    textDecoration: 'none',
                    background: GRADIENT,
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                  }}
                >
                  Wijzigen
                </Link>
              </div>
            </div>

            {/* Cart items */}
            <div style={{ padding: '16px 20px' }}>
              {items.length === 0 ? (
                <p style={{
                  color: 'var(--text-muted, rgba(255,255,255,0.35))',
                  fontSize: 14, textAlign: 'center',
                  padding: '20px 0',
                }}>
                  Je winkelmandje is leeg
                </p>
              ) : (
                <div style={{
                  display: 'flex', flexDirection: 'column', gap: 10,
                  marginBottom: 4,
                  maxHeight: 210,
                  overflowY: 'auto',
                  paddingRight: 4,
                }}>
                  {items.map(item => {
                    const modExtra = (item.modifiers || []).reduce((s: number, m: any) => s + (m.priceAdjustment || 0), 0);
                    const linePrice = (parseFloat(item.basePrice) + modExtra) * item.qty;
                    return (
                      <div key={item.id} style={{ fontSize: 14 }}>
                        <div style={{
                          display: 'flex', justifyContent: 'space-between',
                          alignItems: 'flex-start',
                        }}>
                          <div style={{ display: 'flex', gap: 10, flex: 1, minWidth: 0 }}>
                            <span style={{
                              fontWeight: 800, fontSize: 12,
                              minWidth: 22, height: 22,
                              display: 'flex', alignItems: 'center', justifyContent: 'center',
                              borderRadius: 6,
                              background: 'rgba(90,49,244,0.15)',
                              color: '#a78bfa',
                              flexShrink: 0,
                            }}>
                              {item.qty}
                            </span>
                            <span style={{
                              fontWeight: 500, lineHeight: 1.4,
                              color: 'var(--text-secondary, rgba(255,255,255,0.8))',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              whiteSpace: 'nowrap',
                            }}>
                              {item.name}
                            </span>
                          </div>
                          <span style={{ fontWeight: 700, flexShrink: 0, marginLeft: 10, fontSize: 14 }}>
                            {formatPrice(linePrice)}
                          </span>
                        </div>
                        {item.modifiers && item.modifiers.length > 0 && (
                          <div style={{ paddingLeft: 32, marginTop: 2 }}>
                            {item.modifiers.map((m: any, idx: number) => (
                              <div key={idx} style={{
                                fontSize: 11,
                                color: 'var(--text-muted, rgba(255,255,255,0.35))',
                                lineHeight: 1.6,
                              }}>
                                {m.name}{m.priceAdjustment > 0 ? ` (+${formatPrice(m.priceAdjustment)})` : m.priceAdjustment === 0 ? '' : ''}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Price breakdown */}
            <div style={{
              padding: '16px 20px',
              borderTop: '1px solid rgba(255,255,255,0.06)',
              display: 'flex', flexDirection: 'column', gap: 9,
            }}>
              <PriceRow label="Subtotaal" value={formatPrice(subtotal)} />
              <PriceRow label="BTW (9%)" value={formatPrice(taxAmount)} />
              <PriceRow label="Servicekosten (5%)" value={formatPrice(serviceFee)} />
              <PriceRow
                label="Bezorgkosten"
                value="Gratis"
                valueStyle={{ color: '#4ade80', fontWeight: 700 }}
              />
              {tip > 0 && <PriceRow label="Tip bezorger" value={formatPrice(tip)} />}
            </div>

            {/* Grand total */}
            <div style={{
              padding: '14px 20px 16px',
              borderTop: '1px solid rgba(255,255,255,0.06)',
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            }}>
              <span style={{ fontSize: 15, fontWeight: 700 }}>Totaal</span>
              <span style={{
                fontSize: 22, fontWeight: 900, letterSpacing: '-0.03em',
                background: GRADIENT,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}>
                {formatPrice(grandTotal)}
              </span>
            </div>

            {/* CTA button */}
            <div style={{ padding: '0 20px 20px' }}>
              <OrderButton
                onClick={handleOrder}
                disabled={isDisabled}
                submitting={submitting}
              />
              <p style={{
                textAlign: 'center', fontSize: 11,
                color: 'var(--text-muted, rgba(255,255,255,0.3))',
                lineHeight: 1.5, marginTop: 12,
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5,
              }}>
                <svg width={12} height={12} viewBox="0 0 12 12" fill="none" style={{ flexShrink: 0 }}>
                  <rect x={1} y={5} width={10} height={7} rx={1.5} stroke="currentColor" strokeWidth={1.2} />
                  <path d="M3.5 5V3.5a2.5 2.5 0 015 0V5" stroke="currentColor" strokeWidth={1.2} strokeLinecap="round" />
                </svg>
                Veilig betalen via SSL-encryptie
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

/* ─── Sub-components ─── */

function FormSection({
  title, icon, children, index,
}: {
  title: string; icon: string; children: React.ReactNode; index: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: 'easeOut', delay: index * 0.07 }}
      style={{
        background: 'var(--bg-card, rgba(255,255,255,0.03))',
        border: '1px solid var(--border, rgba(255,255,255,0.06))',
        borderRadius: 16,
        padding: '20px 20px 22px',
        marginBottom: 16,
      }}
    >
      <div style={{
        display: 'flex', alignItems: 'center', gap: 10, marginBottom: 18,
      }}>
        <span style={{ fontSize: 16 }}>{icon}</span>
        <h2 style={{
          fontSize: 14, fontWeight: 700,
          color: 'var(--text-primary, #fff)',
          letterSpacing: '0.01em',
        }}>
          {title}
        </h2>
      </div>
      {children}
    </motion.div>
  );
}

function FormField({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: 14 }}>
      <label style={{
        display: 'block', fontSize: 12, fontWeight: 600,
        marginBottom: 6,
        color: 'var(--text-muted, rgba(255,255,255,0.4))',
        letterSpacing: '0.02em',
      }}>
        {label}
      </label>
      {children}
    </div>
  );
}

function PaymentOption({
  id, label, desc, icon, selected, onSelect,
}: {
  id: string; label: string; desc: string; icon: string; selected: boolean; onSelect: () => void;
}) {
  return (
    <label
      style={{
        display: 'flex', alignItems: 'center', gap: 14,
        padding: '13px 16px',
        borderRadius: 12,
        border: selected ? '1.5px solid rgba(90,49,244,0.5)' : '1px solid var(--border, rgba(255,255,255,0.06))',
        cursor: 'pointer',
        background: selected
          ? 'linear-gradient(135deg, rgba(90,49,244,0.08), rgba(255,0,128,0.04))'
          : 'transparent',
        transition: 'border-color 0.15s, background 0.15s',
      }}
    >
      <input
        type="radio"
        name="payment"
        checked={selected}
        onChange={onSelect}
        style={{ accentColor: '#5A31F4', flexShrink: 0 }}
      />
      <span style={{ fontSize: 18, flexShrink: 0 }}>{icon}</span>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontWeight: 700, fontSize: 14 }}>{label}</div>
        <div style={{ fontSize: 12, color: 'var(--text-muted, rgba(255,255,255,0.35))', marginTop: 1 }}>{desc}</div>
      </div>
      {selected && (
        <div style={{
          width: 18, height: 18, borderRadius: '50%',
          background: 'linear-gradient(135deg, #5A31F4, #FF0080)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          flexShrink: 0,
        }}>
          <svg width={10} height={10} viewBox="0 0 10 10" fill="none">
            <path d="M2 5L4 7L8 3" stroke="white" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      )}
    </label>
  );
}

function TipButton({
  selected, onClick, children,
}: {
  selected: boolean; onClick: () => void; children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: '9px 18px',
        borderRadius: 50,
        border: selected ? '1.5px solid transparent' : '1px solid var(--border-strong, rgba(255,255,255,0.12))',
        background: selected
          ? 'linear-gradient(135deg, #5A31F4, #FF0080)'
          : 'var(--bg-card, rgba(255,255,255,0.04))',
        color: 'white',
        fontWeight: 700,
        fontSize: 14,
        cursor: 'pointer',
        transform: selected ? 'scale(1.04)' : 'scale(1)',
        boxShadow: selected ? '0 4px 16px rgba(90,49,244,0.35)' : 'none',
        transition: 'transform 0.15s ease, box-shadow 0.15s ease, background 0.15s ease',
        fontFamily: 'inherit',
      }}
    >
      {children}
    </button>
  );
}

function OrderButton({
  onClick, disabled, submitting,
}: {
  onClick: () => void; disabled: boolean; submitting: boolean;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        width: '100%',
        padding: '15px 20px',
        background: disabled
          ? 'rgba(255,255,255,0.07)'
          : 'linear-gradient(135deg, #5A31F4, #FF0080)',
        color: disabled ? 'rgba(255,255,255,0.3)' : '#fff',
        border: 'none',
        borderRadius: 12,
        fontSize: 15,
        fontWeight: 800,
        cursor: disabled ? 'not-allowed' : 'pointer',
        boxShadow: disabled ? 'none' : '0 6px 24px rgba(90,49,244,0.35)',
        transition: 'opacity 0.2s, transform 0.15s, box-shadow 0.2s',
        opacity: submitting ? 0.85 : 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 10,
        fontFamily: 'inherit',
        letterSpacing: '-0.01em',
      }}
    >
      {submitting && (
        <svg
          width={18} height={18} viewBox="0 0 18 18"
          style={{ animation: 'enjoy-spin 0.75s linear infinite', flexShrink: 0 }}
        >
          <circle cx={9} cy={9} r={7} fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth={2.5} />
          <path d="M9 2 A7 7 0 0 1 16 9" fill="none" stroke="white" strokeWidth={2.5} strokeLinecap="round" />
        </svg>
      )}
      {submitting ? 'Bestelling plaatsen…' : 'Bestel en betaal'}
    </button>
  );
}

function PriceRow({ label, value, valueStyle }: {
  label: string; value: string; valueStyle?: React.CSSProperties;
}) {
  return (
    <div style={{
      display: 'flex', justifyContent: 'space-between',
      fontSize: 13,
      color: 'var(--text-muted, rgba(255,255,255,0.4))',
    }}>
      <span>{label}</span>
      <span style={{ fontWeight: 600, color: 'var(--text-secondary, rgba(255,255,255,0.6))', ...valueStyle }}>
        {value}
      </span>
    </div>
  );
}
