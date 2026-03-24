'use client';
import dynamic from 'next/dynamic';

// Zustand (cart store) cannot run on the server — load checkout client-side only.
const CheckoutClient = dynamic(() => import('./CheckoutClient'), { ssr: false });

export default function CheckoutPage() {
  return <CheckoutClient />;
}
