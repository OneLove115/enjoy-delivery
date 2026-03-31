import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Hoe Het Werkt | EnJoy",
  description: "Ontdek hoe je in een paar stappen je favoriete eten bestelt via EnJoy. Van adres invoeren tot koninklijke bezorging aan je deur.",
  alternates: { canonical: "https://enjoy.veloci.online/how-it-works" },
  openGraph: {
    title: "Hoe Het Werkt | EnJoy",
    description: "Ontdek hoe je in een paar stappen je favoriete eten bestelt via EnJoy. Van adres invoeren tot koninklijke bezorging aan je deur.",
    url: "https://enjoy.veloci.online/how-it-works",
    siteName: "EnJoy",
    locale: "nl_NL",
    type: "website",
    images: [{ url: "https://enjoy.veloci.online/food/hero-feast.png", width: 1200, height: 630, alt: "Hoe EnJoy werkt" }],
  },
};

export default function HowItWorksLayout({ children }: { children: React.ReactNode }) {
  return children;
}
