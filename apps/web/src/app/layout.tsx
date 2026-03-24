import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'EnJoy — Elite Gourmet Delivery | Order Signature Local Favorites',
  description: 'Discover the finest restaurants near you with EnJoy. Royal delivery from 1000+ partner restaurants, curated gourmet menus, AI-powered ordering with Joya, and a premium food experience — straight to your door.',
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
  },
  twitter: {
    card: 'summary_large_image',
    title: 'EnJoy — Elite Gourmet Delivery',
    description: 'Discover the finest restaurants near you. Royal delivery, curated menus, and Joya AI concierge.',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-snippet': -1,
      'max-image-preview': 'large',
      'max-video-preview': -1,
    },
  },
  alternates: {
    canonical: 'https://enjoy.delivery',
    languages: { 'en': 'https://enjoy.delivery', 'nl': 'https://enjoy.delivery/nl' },
  },
  category: 'Food & Drink',
  other: {
    'application-name': 'EnJoy',
    'apple-mobile-web-app-title': 'EnJoy',
    'google-site-verification': '',
    'msvalidate.01': '',
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'EnJoy',
  description: 'Elite gourmet food delivery platform. Order from 1000+ curated restaurants with AI-powered concierge.',
  applicationCategory: 'FoodEstablishment',
  operatingSystem: 'Web, iOS, Android',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'EUR' },
  aggregateRating: { '@type': 'AggregateRating', ratingValue: '4.8', reviewCount: '2450', bestRating: '5' },
  potentialAction: {
    '@type': 'SearchAction',
    target: { '@type': 'EntryPoint', urlTemplate: 'https://enjoy.delivery/discover?q={search_term_string}' },
    'query-input': 'required name=search_term_string',
  },
};

const orgJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'EnJoy',
  url: 'https://enjoy.delivery',
  description: 'Premium food delivery platform with AI-powered ordering and royal delivery service.',
  foundingDate: '2026',
  areaServed: { '@type': 'GeoCircle', geoMidpoint: { '@type': 'GeoCoordinates', latitude: 52.07, longitude: 4.30 }, geoRadius: '50000' },
  sameAs: ['https://instagram.com/enjoy.delivery', 'https://twitter.com/enjoydelivery'],
};

const faqJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    { '@type': 'Question', name: 'What is EnJoy?', acceptedAnswer: { '@type': 'Answer', text: 'EnJoy is a premium food delivery platform offering curated gourmet meals from 1000+ partner restaurants, with AI-powered ordering via Joya concierge.' } },
    { '@type': 'Question', name: 'How does EnJoy delivery work?', acceptedAnswer: { '@type': 'Answer', text: 'Share your location, browse curated menus from top-rated local restaurants, place your order, and our dedicated fleet delivers fresh to your door in 15-40 minutes.' } },
    { '@type': 'Question', name: 'Is there an EnJoy mobile app?', acceptedAnswer: { '@type': 'Answer', text: 'Yes! EnJoy is available on iOS (App Store) and Android (Google Play). Download it for the fastest ordering experience with push notifications and exclusive deals.' } },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;600;700;800;900&display=swap" rel="stylesheet" />
        <link rel="canonical" href="https://enjoy.delivery" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#5A31F4" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="EnJoy" />
        <link rel="apple-touch-icon" href="/icons/icon-192.png" />
        <link rel="icon" type="image/png" sizes="192x192" href="/icons/icon-192.png" />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      </head>
      <body style={{ fontFamily: 'Outfit, sans-serif' }}>
        {children}
      </body>
    </html>
  );
}
