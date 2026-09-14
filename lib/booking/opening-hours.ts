import { BASE_PACKAGE, BOOKING_RULES } from "./pricing-config";
import { SPA_TIMEZONE, zonedTimeToUtc } from "./timezone";

// Les horaires franchissent minuit : ouvert de 08:00 jusqu'à 04:00 le lendemain
// matin, donc fermé uniquement entre 04:00 et 08:00. Toute la logique de
// créneaux vit ici (fonctions pures, sans accès base de données) pour rester
// vérifiable indépendamment — voir scripts/check-horaires.mjs.

export const SLOT_STEP_MINUTES = 30;
const MINUTES_PER_DAY = 24 * 60;

export function parseHHMM(value: string): number {
  const [hour, minute] = value.split(":").map(Number);
  return hour * 60 + minute;
}

export function formatHHMM(minutes: number): string {
  const m = ((minutes % MINUTES_PER_DAY) + MINUTES_PER_DAY) % MINUTES_PER_DAY;
  const hh = Math.floor(m / 60).toString().padStart(2, "0");
  const mm = (m % 60).toString().padStart(2, "0");
  return `${hh}:${mm}`;
}

export const OPENING_MINUTES = parseHHMM(BOOKING_RULES.openingHours.start);
export const LAST_END_MINUTES = parseHHMM(BOOKING_RULES.openingHours.lastEnd);

// Dernier départ théorique : celui de la séance la plus courte (2h) qui se
// termine pile à l'heure de fermeture. Avec 04:00 de fermeture, ça donne 02:00.
// Une séance plus longue se verra proposer un dernier départ plus tôt, puisque
// c'est l'heure de FIN qui est la vraie contrainte (voir endsBeforeClosing).
export const LAST_START_MINUTES =
  ((LAST_END_MINUTES - BASE_PACKAGE.durationHours * 60) % MINUTES_PER_DAY + MINUTES_PER_DAY) % MINUTES_PER_DAY;

/** Heure murale à Bruxelles, en minutes depuis minuit. */
export function minutesSinceMidnight(date: Date): number {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: SPA_TIMEZONE,
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).formatToParts(date);
  const hour = Number(parts.find((p) => p.type === "hour")?.value ?? "0") % 24;
  const minute = Number(parts.find((p) => p.type === "minute")?.value ?? "0");
  return hour * 60 + minute;
}

/** Date calendaire locale (YYYY-MM-DD) à Bruxelles. */
function zonedDateKey(date: Date): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: SPA_TIMEZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date);
}

// Arithmétique de calendrier pure : ajouter 24h à un instant ne donne pas
// toujours le lendemain (les jours de changement d'heure font 23h ou 25h).
function nextDateKey(key: string): string {
  const [year, month, day] = key.split("-").map(Number);
  return new Date(Date.UTC(year, month - 1, day + 1)).toISOString().slice(0, 10);
}

/** La fenêtre franchit minuit : 08:00 → 23:59, puis 00:00 → 02:00. */
export function isOpenStartMinutes(minutes: number): boolean {
  return minutes >= OPENING_MINUTES || minutes <= LAST_START_MINUTES;
}

export function isWithinOpeningHours(startTime: Date): boolean {
  return isOpenStartMinutes(minutesSinceMidnight(startTime));
}

/**
 * Instant de fermeture qui suit un départ donné : le prochain 04:00 local
 * strictement après lui. Un départ à 23:00 ferme donc à 04:00 le lendemain,
 * un départ à 01:00 ferme à 04:00 le matin même.
 */
export function closingInstantFor(startTime: Date): Date {
  const dayKey = zonedDateKey(startTime);
  const sameDay = zonedTimeToUtc(dayKey, BOOKING_RULES.openingHours.lastEnd, SPA_TIMEZONE);
  if (sameDay.getTime() > startTime.getTime()) return sameDay;
  return zonedTimeToUtc(nextDateKey(dayKey), BOOKING_RULES.openingHours.lastEnd, SPA_TIMEZONE);
}

/** Une séance ne peut jamais déborder au-delà de l'heure de fermeture. */
export function endsBeforeClosing(startTime: Date, endTime: Date): boolean {
  return endTime.getTime() <= closingInstantFor(startTime).getTime();
}

/**
 * Départs proposés pour une date calendaire donnée, dans l'ordre chronologique
 * de cette journée : 00:00 → 02:00 (fin de la nuit précédente), puis
 * 08:00 → 23:30.
 */
export function candidateStartMinutes(): number[] {
  const minutes: number[] = [];
  for (let m = 0; m < MINUTES_PER_DAY; m += SLOT_STEP_MINUTES) {
    if (isOpenStartMinutes(m)) minutes.push(m);
  }
  return minutes;
}
