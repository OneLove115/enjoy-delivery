import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Ontdek Restaurants | EnJoy",
  description: "Ontdek de beste restaurants bij jou in de buurt. Bestel je favoriete gerechten met koninklijke bezorging via EnJoy.",
  alternates: { canonical: "https://enjoy.veloci.online/discover" },
  openGraph: {
    title: "Ontdek Restaurants | EnJoy",
    description: "Ontdek de beste restaurants bij jou in de buurt. Bestel je favoriete gerechten met koninklijke bezorging via EnJoy.",
    url: "https://enjoy.veloci.online/discover",
    siteName: "EnJoy",
    locale: "nl_NL",
    type: "website",
    images: [{ url: "https://enjoy.veloci.online/food/hero-feast.png", width: 1200, height: 630, alt: "EnJoy — Ontdek Restaurants" }],
  },
};

const discoverSchema = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  "name": "Restaurants on EnJoy",
  "description": "Browse and order from the best restaurants near you on EnJoy.",
  "url": "https://enjoy.veloci.online/discover",
  "numberOfItems": 1000,
  "itemListOrder": "https://schema.org/ItemListUnordered",
};

export default function DiscoverLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(discoverSchema) }}
      />
      {children}
    </>
  );
}
