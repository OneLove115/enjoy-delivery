'use client';
import dynamic from 'next/dynamic';
const Client = dynamic(() => import('./SupportClient'), { ssr: false });
export default function SupportPage() { return <Client />; }
