import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Blog | EnJoy",
  description: "Lees het laatste nieuws over EnJoy, food tech, AI-innovatie en de toekomst van bezorging.",
  alternates: { canonical: "https://enjoy.veloci.online/blog" },
};

export default function BlogLayout({ children }: { children: React.ReactNode }) {
  return children;
}
