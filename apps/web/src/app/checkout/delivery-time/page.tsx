'use client';
import dynamic from 'next/dynamic';
const Client = dynamic(() => import('./DeliveryTimeClient'), { ssr: false });
export default function DeliveryTimePage() { return <Client />; }
