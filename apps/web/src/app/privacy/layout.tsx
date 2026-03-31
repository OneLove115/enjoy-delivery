import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacybeleid | EnJoy",
  description: "Lees het privacybeleid van EnJoy. We beschermen je gegevens en leggen transparant uit hoe we je informatie verzamelen en gebruiken.",
  alternates: { canonical: "https://enjoy.veloci.online/privacy" },
};

export default function PrivacyLayout({ children }: { children: React.ReactNode }) {
  return children;
}
