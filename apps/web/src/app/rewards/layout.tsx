import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Beloningen | EnJoy",
  description: "Verdien punten en stempels met elke bestelling. Ontdek het EnJoy beloningsprogramma en win gratis maaltijden.",
  alternates: { canonical: "https://enjoy.veloci.online/rewards" },
  openGraph: {
    title: "Beloningen | EnJoy",
    description: "Verdien punten en stempels met elke bestelling. Ontdek het EnJoy beloningsprogramma en win gratis maaltijden.",
    url: "https://enjoy.veloci.online/rewards",
    siteName: "EnJoy",
    locale: "nl_NL",
    type: "website",
    images: [{ url: "https://enjoy.veloci.online/food/hero-feast.png", width: 1200, height: 630, alt: "EnJoy Beloningen" }],
  },
};

export default function RewardsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
