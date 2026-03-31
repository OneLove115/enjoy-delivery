import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Werken bij EnJoy | EnJoy",
  description: "Bekijk openstaande vacatures bij EnJoy. Word onderdeel van ons team en bouw mee aan de toekomst van food delivery.",
  alternates: { canonical: "https://enjoy.veloci.online/careers" },
};

export default function CareersLayout({ children }: { children: React.ReactNode }) {
  return children;
}
