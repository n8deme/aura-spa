import type { Metadata } from "next";
import type { Lang } from "@/app/_lib/content";
import { BookingFlow } from "./BookingFlow";

export const metadata: Metadata = {
  title: "Réserver — Aura Spa",
  description: "Réservez votre espace privatif Aura Spa en ligne : créneau, formule et paiement sécurisé.",
  robots: { index: false, follow: false },
};

export default async function ReserverPage({
  searchParams,
}: {
  searchParams: Promise<{ lang?: string }>;
}) {
  const { lang: rawLang } = await searchParams;
  const lang: Lang = rawLang === "nl" ? "nl" : "fr";
  return <BookingFlow lang={lang} />;
}
