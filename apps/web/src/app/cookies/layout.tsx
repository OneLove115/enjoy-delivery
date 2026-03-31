import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Cookiebeleid | EnJoy",
  description: "Lees het cookiebeleid van EnJoy. We leggen uit welke cookies we gebruiken en hoe je je voorkeuren kunt beheren.",
  alternates: { canonical: "https://enjoy.veloci.online/cookies" },
};

export default function CookiesLayout({ children }: { children: React.ReactNode }) {
  return children;
}
