import type { Lang } from "@/app/_lib/content";
import { PACKAGE_LABELS, PRICING_TEXT } from "./i18n";
import { SPA_TIMEZONE } from "./timezone";
import type { PackageType } from "./types";

export function packageTypeLabel(packageType: PackageType, lang: Lang = "fr"): string {
  return PACKAGE_LABELS[lang][packageType];
}

// Un montant à 0€ signifie "pas encore tarifé" (placeholder en attente de Rob).
export function isPriced(amount: number): boolean {
  return amount > 0;
}

export function formatPrice(amount: number, lang: Lang = "fr"): string {
  return isPriced(amount) ? `${amount}€` : PRICING_TEXT[lang].comingSoon;
}

function locale(lang: Lang): string {
  return lang === "nl" ? "nl-BE" : "fr-BE";
}

export function formatDateLong(date: Date, lang: Lang = "fr"): string {
  return new Intl.DateTimeFormat(locale(lang), {
    weekday: "long",
    day: "numeric",
    month: "long",
    timeZone: SPA_TIMEZONE,
  }).format(date);
}

export function formatTime(date: Date, lang: Lang = "fr"): string {
  return new Intl.DateTimeFormat(locale(lang), {
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
