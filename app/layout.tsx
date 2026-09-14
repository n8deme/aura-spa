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
  title: "Aura Spa — Espace Privatif près de Bruxelles",
  description:
    "Réservez votre espace bien-être privatif à 15 minutes de Bruxelles. Bains à bulles, chaleur et sérénité pour 2 à 10 personnes. 150€ / 2 heures.",
  openGraph: {
    title: "Aura Spa — Espace Privatif près de Bruxelles",
    description:
      "Réservez votre espace bien-être privatif à 15 minutes de Bruxelles. Bains à bulles, chaleur et sérénité pour 2 à 10 personnes. 150€ / 2 heures.",
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
    "Espace bien-être privatif à 15 minutes de Bruxelles et à deux pas de Brussels Airport. Bains à bulles et sérénité pour 2 à 10 personnes.",
  url: "https://aura-spa.be",
  telephone: "+32494379099",
  email: "Kamanrobert@icloud.com",
  address: {
    "@type": "PostalAddress",
    streetAddress: "Steenwagenstraat 121",
    postalCode: "1820",
    addressLocality: "Melsbroek",
    addressRegion: "Steenokkerzeel",
    addressCountry: "BE",
  },
  geo: {
    "@type": "GeoCoordinates",
    latitude: 50.91327,
    longitude: 4.47090,
  },
  hasMap: "https://www.google.com/maps/search/?api=1&query=Steenwagenstraat+121+1820+Melsbroek",
  priceRange: "150€ - 220€",
  // Les horaires franchissent minuit : la forme structurée lève l'ambiguïté que
  // la chaîne "08:00-04:00" laissait planer.
  openingHoursSpecification: {
    "@type": "OpeningHoursSpecification",
    dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
    opens: "08:00",
    closes: "04:00",
  },
  // Était "og-image.jpg", qui renvoyait 404 : l'image est générée par la route
  // app/opengraph-image.tsx, pas servie depuis public/.
  image: "https://aura-spa.be/opengraph-image",
  sameAs: ["https://www.instagram.com/espace.privatif"],
  areaServed: ["Bruxelles", "Steenokkerzeel", "Zaventem", "Vilvoorde", "Brabant flamand"],
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
