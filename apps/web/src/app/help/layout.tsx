import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Help | EnJoy",
  description: "Hulp nodig? Vind antwoorden, neem contact op met ons supportteam of chat met Joya AI voor directe assistentie.",
  alternates: { canonical: "https://enjoy.veloci.online/help" },
};

export default function HelpLayout({ children }: { children: React.ReactNode }) {
  return children;
}
