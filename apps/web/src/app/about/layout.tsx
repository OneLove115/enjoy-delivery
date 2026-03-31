import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Over EnJoy | EnJoy",
  description: "Leer meer over EnJoy, onze missie om eten bezorgen te transformeren tot een koninklijke ervaring, en het team achter het platform.",
  alternates: { canonical: "https://enjoy.veloci.online/about" },
  openGraph: {
    title: "Over EnJoy | EnJoy",
    description: "Leer meer over EnJoy, onze missie om eten bezorgen te transformeren tot een koninklijke ervaring, en het team achter het platform.",
    url: "https://enjoy.veloci.online/about",
    siteName: "EnJoy",
    locale: "nl_NL",
    type: "website",
    images: [{ url: "https://enjoy.veloci.online/food/hero-feast.png", width: 1200, height: 630, alt: "Over EnJoy" }],
  },
};

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return children;
}
