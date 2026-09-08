import type { Metadata } from "next";
import { Cormorant_Garamond, DM_Sans } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  style: ["normal", "italic"],
  display: "swap",
});

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://aura-spa.be"),
  title: "Aura Spa — Espace Privatif à Bruxelles",
  description:
    "Réservez votre espace bien-être privatif à Bruxelles. Bains à bulles, chaleur et sérénité pour 2 à 4 personnes. 150€ / 2 heures.",
  openGraph: {
    title: "Aura Spa — Espace Privatif à Bruxelles",
    description:
      "Réservez votre espace bien-être privatif à Bruxelles. Bains à bulles, chaleur et sérénité pour 2 à 4 personnes. 150€ / 2 heures.",
    locale: "fr_BE",
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
  },
};

const localBusinessSchema = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  name: "Aura Spa",
  description:
    "Espace bien-être privatif à Bruxelles. Bains à bulles et sérénité pour 2 à 4 personnes.",
  url: "https://aura-spa.be",
  telephone: "",
  email: "contact@aura-spa.be",
  address: {
    "@type": "PostalAddress",
    addressLocality: "Bruxelles",
    addressCountry: "BE",
  },
  priceRange: "€€",
  openingHours: "Mo-Su 00:00-24:00",
  image: "https://aura-spa.be/og-image.jpg",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="fr"
      className={cn("h-full", "antialiased", cormorant.variable, dmSans.variable)}
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
        />
      </head>
      <body className="min-h-full flex flex-col" style={{ overflowX: "hidden" }}>
        {children}
      </body>
    </html>
  );
}
