import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Word Bezorger | EnJoy",
  description: "Word bezorger bij EnJoy. Flexibele uren, eerlijke verdiensten en volledige verzekering. Meld je vandaag nog aan.",
  alternates: { canonical: "https://enjoy.veloci.online/riders" },
};

export default function RidersLayout({ children }: { children: React.ReactNode }) {
  return children;
}
