import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Acties | EnJoy",
  description: "Bekijk de nieuwste acties en kortingscodes van EnJoy. Bespaar op je favoriete maaltijden.",
  alternates: { canonical: "https://enjoy.veloci.online/promotions" },
};

export default function PromotionsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
