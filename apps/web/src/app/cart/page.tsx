'use client';
import dynamic from 'next/dynamic';

// Zustand cart store cannot run on the server.
const CartClient = dynamic(() => import('./CartClient'), { ssr: false });

export default function CartPage() {
  return <CartClient />;
}
