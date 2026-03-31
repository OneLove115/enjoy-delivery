import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Steden | EnJoy",
  description: "Bekijk in welke steden EnJoy actief is en waar we binnenkort lanceren. Van Amsterdam tot Rotterdam en verder.",
  alternates: { canonical: "https://enjoy.veloci.online/cities" },
};

const citiesSchema = {
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  "name": "EnJoy Cities — Food Delivery Across Netherlands, Ghana & Europe",
  "description": "Find EnJoy food delivery in your city. Active in the Netherlands, Ghana, and expanding across Europe.",
  "url": "https://enjoy.veloci.online/cities",
};

export default function CitiesLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(citiesSchema) }}
      />
      {children}
    </>
  );
}
