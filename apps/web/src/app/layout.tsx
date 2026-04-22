import type { Metadata } from 'next';
import Script from 'next/script';
import './globals.css';
import { ThemeProvider } from './context/ThemeContext';
import { PWAInstall } from './components/PWAInstall';
import { GoogleAnalytics } from './components/GoogleAnalytics';
import { MetaPixel } from './components/MetaPixel';
import { CookieConsent } from './components/CookieConsent';
import { ServiceWorkerRegister } from './components/ServiceWorkerRegister';

export const metadata: Metadata = {
  title: 'EnJoy — Elite Gourmet Delivery | Order Signature Local Favorites',
  description: 'Order from 1000+ curated restaurants with EnJoy. AI-powered ordering via Joya, real-time tracking, and royal delivery to your door.',
  keywords: [
    'food delivery', 'order food online', 'restaurant delivery', 'gourmet delivery', 'takeaway',
    'best food delivery app', 'EnJoy delivery', 'eten bestellen', 'bezorgen', 'maaltijdbezorging',
    'food delivery near me', 'restaurants near me', 'order food', 'fast delivery', 'premium food',
    'AI food ordering', 'voice ordering', 'curated restaurants', 'local food delivery',
    'pizza delivery', 'burger delivery', 'sushi delivery', 'healthy food delivery',
    'food delivery Netherlands', 'food delivery Europe', 'gourmet takeaway',
  ],
  openGraph: {
    title: 'EnJoy — Elite Gourmet Delivery',
    description: 'Order from 1000+ curated restaurants. Royal delivery, AI-powered concierge, and premium food experience.',
    type: 'website',
    locale: 'en_US',
    alternateLocale: 'nl_NL',
    siteName: 'EnJoy',
    url: 'https://enjoy.veloci.online',
    images: [{ url: 'https://enjoy.veloci.online/food/hero-feast.png', width: 1200, height: 630, alt: 'EnJoy — Elite Gourmet Delivery' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'EnJoy — Elite Gourmet Delivery',
    description: 'Discover the finest restaurants near you. Royal delivery, curated menus, and Joya AI concierge.',
  },
  robots: { index: true, follow: true },
  alternates: { canonical: 'https://enjoy.veloci.online' },
  category: 'Food & Drink',
};

const themeScript = `(function(){
  var t=localStorage.getItem('enjoy-theme')||'system';
  var dark=t==='system'?window.matchMedia('(prefers-color-scheme:dark)').matches:t!=='light';
  if(!dark)document.documentElement.classList.add('light');
})();`;

const jsonLd = [
  {
    '@context': 'https://schema.org', '@type': 'WebApplication',
    name: 'EnJoy', applicationCategory: 'FoodEstablishment', operatingSystem: 'Web, iOS, Android',
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'EUR' },
    aggregateRating: { '@type': 'AggregateRating', ratingValue: '4.8', reviewCount: '2450', bestRating: '5' },
  },
  {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'EnJoy',
    url: 'https://enjoy.veloci.online',
    potentialAction: {
      '@type': 'SearchAction',
      target: 'https://enjoy.veloci.online/discover?q={search_term_string}',
      'query-input': 'required name=search_term_string',
    },
  },
  {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'EnJoy',
    url: 'https://enjoy.veloci.online',
    description: 'Ontdek en bestel bij de beste restaurants bij jou in de buurt. Snel, eenvoudig, en altijd vers.',
    sameAs: ['https://share.google/VETw20Tk9HSBxLKJ3'],
    foundingDate: '2016',
    founder: {
      '@type': 'Person',
      name: 'Jay Owusu',
      jobTitle: 'CEO',
    },
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'customer support',
      availableLanguage: ['Dutch', 'English'],
    },
  },
];

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <script dangerouslySetInnerHTML={{ __html: `
          window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}
          gtag('consent','default',{ad_storage:'denied',ad_user_data:'denied',ad_personalization:'denied',analytics_storage:'denied',wait_for_update:500});
          gtag('set','url_passthrough',true);
          gtag('set','ads_data_redaction',true);
          var s=document.createElement('script');s.async=true;s.src='https://www.googletagmanager.com/gtag/js?id=G-DQCX271YXF';document.head.appendChild(s);
          gtag('js',new Date());gtag('config','G-DQCX271YXF');
        `}} />
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
        <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;600;700;800;900&display=swap" rel="stylesheet" />
        {/* PWA manifest — .webmanifest is the spec-compliant extension */}
        <link rel="manifest" href="/manifest.webmanifest" />
        {/* Keep legacy manifest.json reference for older crawlers */}
        <link rel="manifest" href="/manifest.json" />
        <meta name="msvalidate.01" content="4F0157ECF36BED1E2A38D246D51BAED2" />
        <meta name="theme-color" content="#5A31F4" />
        {/* Viewport: viewport-fit=cover lets the app extend under iOS safe areas */}
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="EnJoy" />
        <link rel="apple-touch-icon" sizes="180x180" href="/icons/apple-touch-icon.png" />
        <link rel="apple-touch-icon" sizes="152x152" href="/icons/icon-152.png" />
        <link rel="apple-touch-icon" sizes="144x144" href="/icons/icon-144.png" />
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        <link rel="icon" type="image/png" sizes="192x192" href="/icons/icon-192.png" />
        <link rel="icon" type="image/png" sizes="512x512" href="/icons/icon-512.png" />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      </head>
      <body style={{ fontFamily: 'Outfit, sans-serif' }}>
        <ServiceWorkerRegister />
        <GoogleAnalytics />
        <MetaPixel />
        <ThemeProvider>
          <PWAInstall />
          {children}
        </ThemeProvider>
        <CookieConsent />
        <Script src="/translate-all.js" strategy="afterInteractive" />
      </body>
    </html>
  );
}
