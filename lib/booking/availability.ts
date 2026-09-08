import "server-only";
import { getSupabaseAdmin } from "@/lib/supabase/admin";
import { BOOKING_RULES } from "./pricing-config";
import { SPA_TIMEZONE } from "./timezone";

export type AvailabilityResult = { available: true } | { available: false; reason: string };

export type ExistingBooking = { start_time: string; end_time: string };

function minutesSinceMidnight(date: Date): number {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: SPA_TIMEZONE,
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).formatToParts(date);
  const hour = Number(parts.find((p) => p.type === "hour")?.value ?? "0");
  const minute = Number(parts.find((p) => p.type === "minute")?.value ?? "0");
  return hour * 60 + minute;
}

export function parseHHMM(value: string): number {
  const [hour, minute] = value.split(":").map(Number);
  return hour * 60 + minute;
}

export function isWithinOpeningHours(startTime: Date, endTime: Date): boolean {
  const openMinutes = parseHHMM(BOOKING_RULES.openingHours.start);
  const closeMinutes = parseHHMM(BOOKING_RULES.openingHours.end);
  return minutesSinceMidnight(startTime) >= openMinutes && minutesSinceMidnight(endTime) <= closeMinutes;
}

export function isPastMinAdvance(startTime: Date, now = new Date()): boolean {
  const minStart = new Date(now.getTime() + BOOKING_RULES.minAdvanceHours * 60 * 60 * 1000);
  return startTime >= minStart;
}

// Chevauchement entre [candidateStart, candidateEnd] et une résa existante,
// en respectant le temps de battement minimum entre deux résas.
export function overlapsWithBuffer(
  candidateStart: Date,
  candidateEnd: Date,
  existing: ExistingBooking,
  bufferMinutes = BOOKING_RULES.bufferMinutes
): boolean {
  const bufferMs = bufferMinutes * 60 * 1000;
  const bufferedStart = candidateStart.getTime() - bufferMs;
  const bufferedEnd = candidateEnd.getTime() + bufferMs;
  const existingStart = new Date(existing.start_time).getTime();
  const existingEnd = new Date(existing.end_time).getTime();
  return existingStart < bufferedEnd && existingEnd > bufferedStart;
}

export async function fetchBookingsInRange(rangeStart: Date, rangeEnd: Date): Promise<ExistingBooking[]> {
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from("bookings")
    .select("start_time, end_time")
    .neq("status", "cancelled")
    .lt("start_time", rangeEnd.toISOString())
    .gt("end_time", rangeStart.toISOString());

  if (error) {
    throw new Error(`Erreur de lecture des réservations : ${error.message}`);
  }
  return data ?? [];
}

export async function checkAvailability(startTime: Date, endTime: Date): Promise<AvailabilityResult> {
  if (Number.isNaN(startTime.getTime()) || Number.isNaN(endTime.getTime()) || endTime <= startTime) {
    return { available: false, reason: "Créneau invalide." };
  }

  if (!isPastMinAdvance(startTime)) {
    return {
      available: false,
      reason: `Réservation possible à partir de ${BOOKING_RULES.minAdvanceHours}h à l'avance.`,
    };
  }

  if (!isWithinOpeningHours(startTime, endTime)) {
    return {
      available: false,
      reason: `Le créneau doit se situer entre ${BOOKING_RULES.openingHours.start} et ${BOOKING_RULES.openingHours.end}.`,
    };
  }

  const bufferMs = BOOKING_RULES.bufferMinutes * 60 * 1000;
  const existingBookings = await fetchBookingsInRange(
    new Date(startTime.getTime() - bufferMs),
    new Date(endTime.getTime() + bufferMs)
  );

  const conflict = existingBookings.some((booking) => overlapsWithBuffer(startTime, endTime, booking));
  if (conflict) {
    return {
      available: false,
      reason: "Ce créneau chevauche une réservation existante (temps de battement compris).",
    };
  }

  return { available: true };
}
