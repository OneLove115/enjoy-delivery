'use client';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';

const PURPLE = '#5A31F4';
const PINK = '#FF0080';

function OrderSuccessContent() {
  const params = useSearchParams();
  const orderNumber = params.get('order');
  const orderId = params.get('session_id') || params.get('orderId');

  return (
    <div style={{
      background: '#0A0A0F', minHeight: '100vh', color: 'white',
      fontFamily: 'Outfit, sans-serif', display: 'flex', alignItems: 'center', justifyContent: 'center',
    }}>
      <div style={{ textAlign: 'center', maxWidth: 500, padding: '40px 24px' }}>
        <div style={{ fontSize: 72, marginBottom: 24 }}>🎉</div>
        <h1 style={{ fontSize: 32, fontWeight: 950, marginBottom: 12 }}>
          Bestelling geplaatst!
        </h1>
        {orderNumber && (
          <p style={{ fontSize: 18, color: 'rgba(255,255,255,0.6)', marginBottom: 8 }}>
            Bestelnummer: <strong style={{ color: 'white' }}>{orderNumber}</strong>
          </p>
        )}
        <p style={{ fontSize: 16, color: 'rgba(255,255,255,0.5)', lineHeight: 1.6, marginBottom: 32 }}>
          Je bestelling is ontvangen en wordt bereid. Je ontvangt een bevestiging per e-mail.
        </p>

        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
          {orderId && (
            <Link href={`/order/${orderId}`} style={{
              background: `linear-gradient(135deg,${PURPLE},${PINK})`,
              color: 'white', padding: '14px 28px', borderRadius: 12,
              fontWeight: 800, fontSize: 16, textDecoration: 'none',
              boxShadow: `0 4px 16px ${PURPLE}40`,
            }}>
              Volg je bestelling 🚲
            </Link>
          )}
          <Link href="/discover" style={{
            background: orderId ? 'rgba(255,255,255,0.08)' : `linear-gradient(135deg,${PURPLE},${PINK})`,
            border: orderId ? '1px solid rgba(255,255,255,0.15)' : 'none',
            color: 'white', padding: '14px 28px', borderRadius: 12,
            fontWeight: 800, fontSize: 16, textDecoration: 'none',
            boxShadow: orderId ? 'none' : `0 4px 16px ${PURPLE}40`,
          }}>
            Terug naar restaurants
          </Link>
          {orderNumber && (
            <Link href={`/account/orders`} style={{
              background: 'rgba(255,255,255,0.08)',
              border: '1px solid rgba(255,255,255,0.15)',
              color: 'white', padding: '14px 28px', borderRadius: 12,
              fontWeight: 800, fontSize: 16, textDecoration: 'none',
            }}>
              Mijn bestellingen
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}

export default function OrderSuccessPage() {
  return (
    <Suspense fallback={<div style={{ background: '#0A0A0F', minHeight: '100vh' }} />}>
      <OrderSuccessContent />
    </Suspense>
  );
}
