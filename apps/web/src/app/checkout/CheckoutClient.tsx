'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCartStore } from '../../store/cart';

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

export default function CheckoutClient() {
  const { items, restaurantName, restaurantSlug, total, itemCount, clearCart, currency, locale } = useCartStore();
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [tip, setTip] = useState<number>(0);
  const [form, setForm] = useState<CheckoutDetails>(EMPTY);

  const subtotal = total();
  const TAX_RATE = 0.09;
  const taxAmount = subtotal * TAX_RATE;
  const grandTotal = subtotal + taxAmount + tip;

  const formatPrice = (n: number) =>
    new Intl.NumberFormat(locale || 'nl-NL', { style: 'currency', currency: currency || 'EUR' }).format(n);

  const set = (key: keyof CheckoutDetails, val: string) => {
    setForm(prev => {
      const next = { ...prev, [key]: val };
      try { localStorage.setItem(STORAGE_KEY, JSON.stringify(next)); } catch {}
      return next;
    });
  };

  // Load saved details on mount
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
        // Redirect to Stripe checkout
        clearCart();
        window.location.href = data.checkoutUrl;
      } else {
        // Fallback: order created without payment
        clearCart();
        router.push(`/order-success?order=${data.orderNumber || ''}`);
      }
    } catch (e: any) {
      setError(e.message || 'Bestelling mislukt. Probeer opnieuw.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{ background: '#0A0A0F', minHeight: '100vh', color: 'white', fontFamily: 'Outfit, sans-serif' }}>
      {/* Navbar */}
      <nav style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100, height: 70, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 32px', background: 'rgba(10,10,15,0.9)', backdropFilter: 'blur(20px)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <Link href={restaurantSlug ? `/menu/${restaurantSlug}` : '/discover'} style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'rgba(255,255,255,0.6)', fontSize: 14, fontWeight: 600, textDecoration: 'none' }}>
          <span style={{ fontSize: 18 }}>←</span><span>Terug naar menu</span>
        </Link>
        <Link href="/" style={{ fontSize: 24, fontWeight: 900, textDecoration: 'none', color: 'white' }}>
          <img src="/logo-enjoy.png" alt="EnJoy" style={{ height: 36, width: 'auto' }} />
        </Link>
      </nav>

      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '100px 24px 60px', display: 'flex', gap: 32, alignItems: 'flex-start', flexWrap: 'wrap' }}>
        {/* Left: Details */}
        <div style={{ flex: 1, minWidth: 300 }}>
          <h1 style={{ fontSize: 28, fontWeight: 900, marginBottom: 32 }}>Afrekenen</h1>

          {error && (
            <div style={{ padding: '14px 18px', borderRadius: 12, background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', color: '#ef4444', fontWeight: 600, fontSize: 14, marginBottom: 24 }}>
              {error}
            </div>
          )}

          <Section title="Bezorgadres">
            <InputRow label="Straat en huisnummer">
              <input type="text" value={form.street} onChange={e => set('street', e.target.value)} placeholder="Bijv. Hoofdstraat 42" style={inputStyle} />
            </InputRow>
            <InputRow label="Postcode">
              <input type="text" value={form.postcode} onChange={e => set('postcode', e.target.value)} placeholder="1234 AB" style={inputStyle} />
            </InputRow>
            <InputRow label="Stad">
              <input type="text" value={form.city} onChange={e => set('city', e.target.value)} placeholder="Amsterdam" style={inputStyle} />
            </InputRow>
            <InputRow label="Bijzonderheden (optioneel)">
              <input type="text" value={form.notes} onChange={e => set('notes', e.target.value)} placeholder="Bijv. bel twee keer" style={inputStyle} />
            </InputRow>
          </Section>

          <Section title="Contactgegevens">
            <InputRow label="Naam">
              <input type="text" value={form.name} onChange={e => set('name', e.target.value)} placeholder="Voornaam en achternaam" style={inputStyle} />
            </InputRow>
            <InputRow label="Telefoonnummer">
              <input type="tel" value={form.phone} onChange={e => set('phone', e.target.value)} placeholder="+31 6 12345678" style={inputStyle} />
            </InputRow>
            <InputRow label="E-mailadres">
              <input type="email" value={form.email} onChange={e => set('email', e.target.value)} placeholder="jouw@email.nl" style={inputStyle} />
            </InputRow>
          </Section>

          <Section title="Betaalmethode">
            {[
              { id: 'ideal', label: 'iDEAL', icon: '🏦' },
              { id: 'card', label: 'Creditcard / Debitcard', icon: '💳' },
              { id: 'paypal', label: 'PayPal', icon: '🅿️' },
            ].map(m => (
              <label key={m.id} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '14px 18px', borderRadius: 12, border: form.payment === m.id ? '2px solid #FF6B35' : '1px solid rgba(255,255,255,0.08)', marginBottom: 10, cursor: 'pointer', background: form.payment === m.id ? 'rgba(255,107,53,0.06)' : 'rgba(255,255,255,0.03)' }}>
                <input type="radio" name="payment" checked={form.payment === m.id} onChange={() => set('payment', m.id)} style={{ accentColor: '#FF6B35' }} />
                <span style={{ fontSize: 20 }}>{m.icon}</span>
                <span style={{ fontWeight: 700, fontSize: 15 }}>{m.label}</span>
              </label>
            ))}
          </Section>

          <Section title="Tip voor de bezorger">
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
              {[0, 1, 2, 3].map(amt => (
                <button key={amt} onClick={() => setTip(amt)} style={{ padding: '8px 16px', borderRadius: 24, border: tip === amt ? '2px solid #FF6B35' : '1px solid rgba(255,255,255,0.12)', background: tip === amt ? 'rgba(255,107,53,0.1)' : 'rgba(255,255,255,0.04)', color: 'white', fontWeight: 800, fontSize: 14, cursor: 'pointer' }}>
                  {amt === 0 ? 'Geen' : `€ ${amt},00`}
                </button>
              ))}
            </div>
          </Section>
        </div>

        {/* Right: Order Summary */}
        <div style={{ width: 340, flexShrink: 0, position: 'sticky', top: 90 }}>
          <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 20, padding: 24 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
              <div>
                <div style={{ fontSize: 17, fontWeight: 900 }}>{restaurantName || 'Winkelmandje'}</div>
                <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', marginTop: 2 }}>{itemCount()} product{itemCount() !== 1 ? 'en' : ''}</div>
              </div>
              <Link href={restaurantSlug ? `/menu/${restaurantSlug}` : '/discover'} style={{ fontSize: 13, color: '#FF6B35', fontWeight: 700, textDecoration: 'none' }}>Wijzigen</Link>
            </div>

            {items.length === 0 ? (
              <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: 14, textAlign: 'center', padding: '24px 0' }}>Je winkelmandje is leeg</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 20, maxHeight: 240, overflowY: 'auto' }}>
                {items.map(item => (
                  <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', fontSize: 14 }}>
                    <div style={{ display: 'flex', gap: 10 }}>
                      <span style={{ color: 'rgba(255,255,255,0.4)', fontWeight: 700, minWidth: 20 }}>{item.qty}×</span>
                      <span style={{ fontWeight: 600, lineHeight: 1.35 }}>{item.name}</span>
                    </div>
                    <span style={{ fontWeight: 800, flexShrink: 0, marginLeft: 8 }}>{formatPrice(parseFloat(item.basePrice) * item.qty)}</span>
                  </div>
                ))}
              </div>
            )}

            <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: 16, display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 20 }}>
              <PriceRow label="Subtotaal" value={formatPrice(subtotal)} />
              <PriceRow label="BTW (9%)" value={formatPrice(taxAmount)} />
              <PriceRow label="Bezorgkosten" value="Gratis" valueStyle={{ color: '#4ade80' }} />
              {tip > 0 && <PriceRow label="Tip" value={formatPrice(tip)} />}
              <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 900, fontSize: 17, paddingTop: 10, borderTop: '1px solid rgba(255,255,255,0.08)' }}>
                <span>Totaal</span>
                <span>{formatPrice(grandTotal)}</span>
              </div>
            </div>

            <button onClick={handleOrder} disabled={submitting || items.length === 0} style={{ width: '100%', padding: '16px', background: submitting || items.length === 0 ? '#555' : '#FF6B35', color: '#fff', border: 'none', borderRadius: 8, fontSize: 16, fontWeight: 900, cursor: submitting || items.length === 0 ? 'not-allowed' : 'pointer', marginBottom: 16, boxShadow: submitting || items.length === 0 ? 'none' : '0 4px 16px rgba(255,107,53,0.3)', transition: 'background 0.2s' }}>
              {submitting ? 'Bezig…' : 'Bestel en betaal'}
            </button>
            <p style={{ textAlign: 'center', fontSize: 12, color: 'rgba(255,255,255,0.3)', lineHeight: 1.5 }}>🔒 Veilig betalen via SSL-encryptie</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: 32 }}>
      <h2 style={{ fontSize: 16, fontWeight: 800, marginBottom: 16, color: 'rgba(255,255,255,0.7)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{title}</h2>
      {children}
    </div>
  );
}

function InputRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: 14 }}>
      <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 6, color: 'rgba(255,255,255,0.55)' }}>{label}</label>
      {children}
    </div>
  );
}

function PriceRow({ label, value, valueStyle }: { label: string; value: string; valueStyle?: React.CSSProperties }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14, color: 'rgba(255,255,255,0.6)' }}>
      <span>{label}</span>
      <span style={{ fontWeight: 700, ...valueStyle }}>{value}</span>
    </div>
  );
}

const inputStyle: React.CSSProperties = {
  width: '100%', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)',
  borderRadius: 10, padding: '12px 16px', color: 'white', fontSize: 15, outline: 'none', fontFamily: 'inherit',
  boxSizing: 'border-box',
};
