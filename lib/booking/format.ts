import { SPA_TIMEZONE } from "./timezone";
import type { PackageType } from "./types";

const PACKAGE_LABELS: Record<PackageType, string> = {
  base: "Forfait de base",
  all_in: "Forfait All-in",
  a_la_carte: "À la carte",
};

export function packageTypeLabel(packageType: PackageType): string {
  return PACKAGE_LABELS[packageType];
}

// Un montant à 0€ signifie "pas encore tarifé" (placeholder en attente de Rob).
export function isPriced(amount: number): boolean {
  return amount > 0;
}

export function formatPrice(amount: number): string {
  return isPriced(amount) ? `${amount}€` : "Bientôt disponible";
}

export function formatDateLong(date: Date): string {
  return new Intl.DateTimeFormat("fr-BE", {
    weekday: "long",
    day: "numeric",
    month: "long",
    timeZone: SPA_TIMEZONE,
  }).format(date);
}

export function formatTime(date: Date): string {
  return new Intl.DateTimeFormat("fr-BE", {
    hour: "2-digit",
    minute: "2-digit",
    timeZone: SPA_TIMEZONE,
  }).format(date);
}

// Formate un objet Date (jour local du navigateur) en "YYYY-MM-DD" sans décalage
// de fuseau horaire (éviter toISOString(), qui bascule sur UTC).
export function toDateKey(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}
