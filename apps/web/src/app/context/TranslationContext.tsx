'use client';
import React, { createContext, useContext, useState, useEffect } from 'react';

type Translations = { [key: string]: string };

const nl: Translations = {
  search_placeholder: 'Typ je adres in voor de lekkerste gerechten...',
  search_button: 'Zoek',
  delivery: 'Bezorgen',
  pickup: 'Afhalen',
  hero_title: 'Elite Smaak, Koninklijk Geleverd',
  hero_subtitle: 'De beste restaurants in jouw buurt, direct aan je deur.',
  how_it_works: 'Jouw Pad naar Smaak',
  step1_title: 'Bepaal je territorium',
  step1_text: 'Deel je locatie zodat we de elite keukens in jouw buurt kunnen onthullen.',
  step2_title: 'Stel je feestmaal samen',
  step2_text: 'Kies uit een gecureerde selectie van signature gerechten en lokale favorieten.',
  step3_title: 'Ontvang de koninklijke behandeling',
  step3_text: 'Onze vloot zorgt dat je maaltijd vers en snel aankomt. Ontspan en EnJoy.',
  download_title: 'Draag het Koninkrijk in je zak',
  download_text: 'Eén tik en je favoriete culinaire ervaring is onderweg.',
  popular_near: 'Populair in jouw buurt',
  explore_cuisines: 'Ontdek Keukens',
};

const en: Translations = {
  search_placeholder: 'Type your address for the finest dishes...',
  search_button: 'Search',
  delivery: 'Delivery',
  pickup: 'Pickup',
  hero_title: 'Elite Flavor, Royally Delivered',
  hero_subtitle: 'The best restaurants in your neighbourhood, straight to your door.',
  how_it_works: 'Your Path to Flavor',
  step1_title: 'Declare your territory',
  step1_text: 'Share your location so we can unveil the elite kitchens serving your area.',
  step2_title: 'Curate your feast',
  step2_text: 'Indulge in a curated selection of signature dishes and local favorites.',
  step3_title: 'Receive the royal treatment',
  step3_text: 'Our dedicated fleet ensures your meal arrives fresh and fast. EnJoy.',
  download_title: 'Carry the Kingdom in your pocket',
  download_text: 'One tap and your favorite gourmet experience is on its way.',
  popular_near: 'Popular Near You',
  explore_cuisines: 'Explore Cuisines',
};

type ContextType = { t: (key: string) => string; locale: string; setLocale: (l: string) => void };
const TranslationContext = createContext<ContextType | undefined>(undefined);

export function TranslationProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocale] = useState('en');
  useEffect(() => { if (navigator.language.startsWith('nl')) setLocale('nl'); }, []);
  const t = (key: string) => (locale === 'nl' ? nl : en)[key] || key;
  return <TranslationContext.Provider value={{ t, locale, setLocale }}>{children}</TranslationContext.Provider>;
}

export function useTranslation() {
  const ctx = useContext(TranslationContext);
  if (!ctx) throw new Error('useTranslation must be inside TranslationProvider');
  return ctx;
}
