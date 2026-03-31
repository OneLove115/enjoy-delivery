import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Word Partner | EnJoy",
  description: "Sluit je aan als partnerrestaurant bij EnJoy. Bereik duizenden klanten via het Veloci-platform met AI-besteltechnologie en koninklijke bezorging.",
  alternates: { canonical: "https://enjoy.veloci.online/partners" },
  openGraph: {
    title: "Word Partner | EnJoy",
    description: "Sluit je aan als partnerrestaurant bij EnJoy. Bereik duizenden klanten via het Veloci-platform met AI-besteltechnologie en koninklijke bezorging.",
    url: "https://enjoy.veloci.online/partners",
    siteName: "EnJoy",
    locale: "nl_NL",
    type: "website",
    images: [{ url: "https://enjoy.veloci.online/food/hero-feast.png", width: 1200, height: 630, alt: "Word Partner bij EnJoy" }],
  },
};

export default function PartnersLayout({ children }: { children: React.ReactNode }) {
  return children;
}
