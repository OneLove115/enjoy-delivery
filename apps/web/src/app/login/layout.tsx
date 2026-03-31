import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Inloggen | EnJoy",
  description: "Log in op je EnJoy-account om restaurants te ontdekken en eten te bestellen.",
  alternates: { canonical: "https://enjoy.veloci.online/login" },
  openGraph: {
    title: "Inloggen | EnJoy",
    description: "Log in op je EnJoy-account om restaurants te ontdekken en eten te bestellen.",
    url: "https://enjoy.veloci.online/login",
    siteName: "EnJoy",
    locale: "nl_NL",
    type: "website",
    images: [{ url: "https://enjoy.veloci.online/food/hero-feast.png", width: 1200, height: 630, alt: "Inloggen bij EnJoy" }],
  },
};

export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return children;
}
