import type { Metadata } from "next";
import { BookingFlow } from "./BookingFlow";

export const metadata: Metadata = {
  title: "Réserver — Aura Spa",
  description: "Réservez votre espace privatif Aura Spa en ligne : créneau, formule et paiement sécurisé.",
  robots: { index: false, follow: false },
};

export default function ReserverPage() {
  return <BookingFlow />;
}
