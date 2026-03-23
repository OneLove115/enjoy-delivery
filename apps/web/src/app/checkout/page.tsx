'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCartStore } from '../../store/cart';

export default function CheckoutPage() {
  const { items, restaurantName, restaurantSlug, total, itemCount, clearCart } = useCartStore();
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [tip, setTip] = useState<number>(0);

  const grandTotal = total() + tip;

  const formatPrice = (n: number) =>
    `€ ${n.toFixed(2).replace('.', ',')}`;

  const handleOrder = async () => {
    if (items.length === 0) return;
    setSubmitting(true);
    try {
      const res = await fetch('/api/consumer/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: items.map(i => ({
            menuItemId: i.id,
            quantity: i.qty,
            unitPrice: i.basePrice,
          })),
        }),
      });
      if (!res.ok) throw new Error('Order failed');
      clearCart();
      router.push('/');
    } catch {
      alert('Bestelling mislukt. Probeer opnieuw.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      style={{
        background: '#0A0A0F',
        minHeight: '100vh',
        color: 'white',
        fontFamily: 'Outfit, sans-serif',
      }}
    >
      {/* Navbar */}
      <nav
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 100,
          height: 70,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 32px',
          background: 'rgba(10,10,15,0.9)',
          backdropFilter: 'blur(20px)',
          borderBottom: '1px solid rgba(255,255,255,0.06)',
        }}
      >
        <Link
          href={restaurantSlug ? `/menu/${restaurantSlug}` : '/discover'}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            color: 'rgba(255,255,255,0.6)',
            fontSize: 14,
            fontWeight: 600,
            textDecoration: 'none',
          }}
        >
          <span style={{ fontSize: 18 }}>←</span>
          <span>Terug naar menu</span>
        </Link>
        <Link
          href="/"
          style={{ fontSize: 24, fontWeight: 900, textDecoration: 'none', color: 'white' }}
        >
          En
          <span
            style={{
              background: 'linear-gradient(135deg, #5A31F4, #FF0080)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            Joy
          </span>
        </Link>
      </nav>

      {/* Page body */}
      <div
        style={{
          maxWidth: 1100,
          margin: '0 auto',
          padding: '100px 24px 60px',
          display: 'flex',
          gap: 32,
          alignItems: 'flex-start',
          flexWrap: 'wrap',
        }}
      >
        {/* ── Left: Delivery details ── */}
        <div style={{ flex: 1, minWidth: 300 }}>
          <h1 style={{ fontSize: 28, fontWeight: 900, marginBottom: 32 }}>Afrekenen</h1>

          {/* Delivery address */}
          <Section title="Bezorgadres">
            <InputRow label="Straat en huisnummer">
              <input
                type="text"
                placeholder="Bijv. Hoofdstraat 42"
                style={inputStyle}
              />
            </InputRow>
            <InputRow label="Postcode">
              <input
                type="text"
                placeholder="1234 AB"
                style={inputStyle}
              />
            </InputRow>
            <InputRow label="Stad">
              <input
                type="text"
                placeholder="Amsterdam"
                style={inputStyle}
              />
            </InputRow>
            <InputRow label="Bijzonderheden (optioneel)">
              <input
                type="text"
                placeholder="Bijv. bel twee keer"
                style={inputStyle}
              />
            </InputRow>
          </Section>

          {/* Contact */}
          <Section title="Contactgegevens">
            <InputRow label="Naam">
              <input type="text" placeholder="Voornaam en achternaam" style={inputStyle} />
            </InputRow>
            <InputRow label="Telefoonnummer">
              <input type="tel" placeholder="+31 6 12345678" style={inputStyle} />
            </InputRow>
            <InputRow label="E-mailadres">
              <input type="email" placeholder="jouw@email.nl" style={inputStyle} />
            </InputRow>
          </Section>

          {/* Payment method */}
          <Section title="Betaalmethode">
            {[
              { id: 'ideal', label: 'iDEAL', icon: '🏦' },
              { id: 'card', label: 'Creditcard / Debitcard', icon: '💳' },
              { id: 'paypal', label: 'PayPal', icon: '🅿️' },
            ].map((m) => (
              <label
                key={m.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 14,
                  padding: '14px 18px',
                  borderRadius: 12,
                  border: '1px solid rgba(255,255,255,0.08)',
                  marginBottom: 10,
                  cursor: 'pointer',
                  background: 'rgba(255,255,255,0.03)',
                }}
              >
                <input type="radio" name="payment" defaultChecked={m.id === 'ideal'} style={{ accentColor: '#FF6B35' }} />
                <span style={{ fontSize: 20 }}>{m.icon}</span>
                <span style={{ fontWeight: 700, fontSize: 15 }}>{m.label}</span>
              </label>
            ))}
          </Section>

          {/* Tip */}
          <Section title="Tip voor de bezorger">
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
              {[0, 1, 2, 3].map((amt) => (
                <button
                  key={amt}
                  onClick={() => setTip(amt)}
                  style={{
                    padding: '8px 16px',
                    borderRadius: 24,
                    border: tip === amt ? '2px solid #FF6B35' : '1px solid rgba(255,255,255,0.12)',
                    background: tip === amt ? 'rgba(255,107,53,0.1)' : 'rgba(255,255,255,0.04)',
                    color: 'white',
                    fontWeight: 800,
                    fontSize: 14,
                    cursor: 'pointer',
                  }}
                >
                  {amt === 0 ? 'Geen' : `€ ${amt},00`}
                </button>
              ))}
            </div>
          </Section>
        </div>

        {/* ── Right: Order Summary ── */}
        <div
          style={{
            width: 340,
            flexShrink: 0,
            position: 'sticky',
            top: 90,
          }}
        >
          <div
            style={{
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: 20,
              padding: 24,
            }}
          >
            {/* Restaurant name + count */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: 20,
              }}
            >
              <div>
                <div style={{ fontSize: 17, fontWeight: 900 }}>
                  {restaurantName || 'Winkelmandje'}
                </div>
                <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', marginTop: 2 }}>
                  {itemCount()} product{itemCount() !== 1 ? 'en' : ''}
                </div>
              </div>
              <Link
                href={restaurantSlug ? `/menu/${restaurantSlug}` : '/discover'}
                style={{
                  fontSize: 13,
                  color: '#FF6B35',
                  fontWeight: 700,
                  textDecoration: 'none',
                }}
              >
                Wijzigen
              </Link>
            </div>

            {/* Item list */}
            {items.length === 0 ? (
              <p
                style={{
                  color: 'rgba(255,255,255,0.35)',
                  fontSize: 14,
                  textAlign: 'center',
                  padding: '24px 0',
                }}
              >
                Je winkelmandje is leeg
              </p>
            ) : (
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 12,
                  marginBottom: 20,
                  maxHeight: 240,
                  overflowY: 'auto',
                }}
              >
                {items.map((item) => (
                  <div
                    key={item.id}
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'flex-start',
                      fontSize: 14,
                    }}
                  >
                    <div style={{ display: 'flex', gap: 10 }}>
                      <span style={{ color: 'rgba(255,255,255,0.4)', fontWeight: 700, minWidth: 20 }}>
                        {item.qty}×
                      </span>
                      <span style={{ fontWeight: 600, lineHeight: 1.35 }}>{item.name}</span>
                    </div>
                    <span style={{ fontWeight: 800, flexShrink: 0, marginLeft: 8 }}>
                      {formatPrice(parseFloat(item.basePrice) * item.qty)}
                    </span>
                  </div>
                ))}
              </div>
            )}

            {/* Price breakdown */}
            <div
              style={{
                borderTop: '1px solid rgba(255,255,255,0.08)',
                paddingTop: 16,
                display: 'flex',
                flexDirection: 'column',
                gap: 10,
                marginBottom: 20,
              }}
            >
              <PriceRow label="Subtotaal" value={formatPrice(total())} />
              <PriceRow label="Bezorgkosten" value="Gratis" valueStyle={{ color: '#4ade80' }} />
              {tip > 0 && <PriceRow label="Tip" value={formatPrice(tip)} />}
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  fontWeight: 900,
                  fontSize: 17,
                  paddingTop: 10,
                  borderTop: '1px solid rgba(255,255,255,0.08)',
                }}
              >
                <span>Totaal</span>
                <span>{formatPrice(grandTotal)}</span>
              </div>
            </div>

            {/* CTA */}
            <button
              onClick={handleOrder}
              disabled={submitting || items.length === 0}
              style={{
                width: '100%',
                padding: '16px',
                background: submitting || items.length === 0 ? '#555' : '#FF6B35',
                color: '#fff',
                border: 'none',
                borderRadius: 8,
                fontSize: 16,
                fontWeight: 900,
                cursor: submitting || items.length === 0 ? 'not-allowed' : 'pointer',
                marginBottom: 16,
                boxShadow: submitting || items.length === 0 ? 'none' : '0 4px 16px rgba(255,107,53,0.3)',
                transition: 'background 0.2s',
              }}
            >
              {submitting ? 'Bezig…' : 'Bestel en betaal'}
            </button>

            {/* Security note */}
            <p
              style={{
                textAlign: 'center',
                fontSize: 12,
                color: 'rgba(255,255,255,0.3)',
                lineHeight: 1.5,
              }}
            >
              🔒 Veilig betalen via SSL-encryptie
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Small helper components ─── */

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div style={{ marginBottom: 32 }}>
      <h2
        style={{
          fontSize: 16,
          fontWeight: 800,
          marginBottom: 16,
          color: 'rgba(255,255,255,0.7)',
          textTransform: 'uppercase',
          letterSpacing: '0.06em',
        }}
      >
        {title}
      </h2>
      {children}
    </div>
  );
}

function InputRow({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div style={{ marginBottom: 14 }}>
      <label
        style={{
          display: 'block',
          fontSize: 13,
          fontWeight: 600,
          marginBottom: 6,
          color: 'rgba(255,255,255,0.55)',
        }}
      >
        {label}
      </label>
      {children}
    </div>
  );
}

function PriceRow({
  label,
  value,
  valueStyle,
}: {
  label: string;
  value: string;
  valueStyle?: React.CSSProperties;
}) {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        fontSize: 14,
        color: 'rgba(255,255,255,0.6)',
      }}
    >
      <span>{label}</span>
      <span style={{ fontWeight: 700, ...valueStyle }}>{value}</span>
    </div>
  );
}

const inputStyle: React.CSSProperties = {
  width: '100%',
  background: 'rgba(255,255,255,0.04)',
  border: '1px solid rgba(255,255,255,0.1)',
  borderRadius: 10,
  padding: '12px 16px',
  color: 'white',
  fontSize: 15,
  outline: 'none',
  fontFamily: 'inherit',
};
