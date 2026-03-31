import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact | EnJoy",
  description: "Neem contact op met EnJoy voor vragen over bestellingen, partnerschappen, media of andere zaken.",
  alternates: { canonical: "https://enjoy.veloci.online/contact" },
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return children;
}
