import type { Metadata } from 'next';
import './globals.css';
import { ThemeProvider } from './context/ThemeContext';
import { PWAInstall } from './components/PWAInstall';

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
  robots: { index: true, follow: true },
  alternates: { canonical: 'https://enjoy.delivery' },
  category: 'Food & Drink',
};

const themeScript = `(function(){
  var t=localStorage.getItem('enjoy-theme')||'system';
  var dark=t==='system'?window.matchMedia('(prefers-color-scheme:dark)').matches:t!=='light';
  if(!dark)document.documentElement.classList.add('light');
})();`;

const jsonLd = {
  '@context': 'https://schema.org', '@type': 'WebApplication',
  name: 'EnJoy', applicationCategory: 'FoodEstablishment', operatingSystem: 'Web, iOS, Android',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'EUR' },
  aggregateRating: { '@type': 'AggregateRating', ratingValue: '4.8', reviewCount: '2450', bestRating: '5' },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
        <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;600;700;800;900&display=swap" rel="stylesheet" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#5A31F4" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="EnJoy" />
        <link rel="apple-touch-icon" href="/icons/icon-192.png" />
        <link rel="icon" type="image/png" sizes="192x192" href="/icons/icon-192.png" />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      </head>
      <body style={{ fontFamily: 'Outfit, sans-serif' }}>
        <ThemeProvider>
          <PWAInstall />
          {children}
        </ThemeProvider>
        <script src="https://cdn.weglot.com/weglot.min.js" defer />
        <script
          id="weglot-init"
          dangerouslySetInnerHTML={{
            __html: `
              document.addEventListener('DOMContentLoaded', function() {
                if (typeof Weglot !== 'undefined') {
                  Weglot.initialize({
                    api_key: "wg_69790b255ca245dc694645e23cb984075",
                    auto_switch: true,
                    host_language: "en",
                    destination_languages: ["nl","fr","de","tr","ar","es"]
                  });
                }
              });
            `,
          }}
        />
      </body>
    </html>
  );
}
