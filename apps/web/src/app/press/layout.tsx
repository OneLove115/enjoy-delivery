import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pers | EnJoy",
  description: "Persberichten, mediakit en contactgegevens voor journalisten en media over EnJoy.",
  alternates: { canonical: "https://enjoy.veloci.online/press" },
};

export default function PressLayout({ children }: { children: React.ReactNode }) {
  return children;
}
