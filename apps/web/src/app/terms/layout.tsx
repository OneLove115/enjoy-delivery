import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Algemene Voorwaarden | EnJoy",
  description: "Lees de algemene voorwaarden van EnJoy voor het gebruik van ons platform, bestellingen en bezorgservice.",
  alternates: { canonical: "https://enjoy.veloci.online/terms" },
};

export default function TermsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
