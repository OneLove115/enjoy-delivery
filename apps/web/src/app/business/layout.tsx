import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "EnJoy voor Bedrijven | EnJoy",
  description: "Zakelijke maaltijdoplossingen van EnJoy. Teambudgetten, catering, automatische rapportages en meer voor jouw bedrijf.",
  alternates: { canonical: "https://enjoy.veloci.online/business" },
};

export default function BusinessLayout({ children }: { children: React.ReactNode }) {
  return children;
}
