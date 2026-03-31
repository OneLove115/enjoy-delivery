import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Veelgestelde Vragen | EnJoy",
  description: "Vind antwoorden op veelgestelde vragen over bestellen, bezorging, betalingen en je EnJoy-account.",
  alternates: { canonical: "https://enjoy.veloci.online/faq" },
};

export default function FaqLayout({ children }: { children: React.ReactNode }) {
  return children;
}
