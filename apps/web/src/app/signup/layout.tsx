import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Account Aanmaken | EnJoy",
  description: "Maak een gratis EnJoy-account aan en begin met bestellen bij de beste restaurants bij jou in de buurt.",
  alternates: { canonical: "https://enjoy.veloci.online/signup" },
  openGraph: {
    title: "Account Aanmaken | EnJoy",
    description: "Maak een gratis EnJoy-account aan en begin met bestellen bij de beste restaurants bij jou in de buurt.",
    url: "https://enjoy.veloci.online/signup",
    siteName: "EnJoy",
    locale: "nl_NL",
    type: "website",
    images: [{ url: "https://enjoy.veloci.online/food/hero-feast.png", width: 1200, height: 630, alt: "Account aanmaken bij EnJoy" }],
  },
};

export default function SignupLayout({ children }: { children: React.ReactNode }) {
  return children;
}
