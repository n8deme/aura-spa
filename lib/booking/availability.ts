import "server-only";
import type { Lang } from "@/app/_lib/content";
import { getSupabaseAdmin } from "@/lib/supabase/admin";
import { BOOKING_RULES } from "./pricing-config";
import { ERRORS } from "./i18n";
import {
  LAST_START_MINUTES,
  endsBeforeClosing,
  formatHHMM,
  isWithinOpeningHours,
} from "./opening-hours";

export type AvailabilityResult = { available: true } | { available: false; reason: string };

export type ExistingBooking = { start_time: string; end_time: string };

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

export async function checkAvailability(
  startTime: Date,
  endTime: Date,
  lang: Lang = "fr"
): Promise<AvailabilityResult> {
  const errors = ERRORS[lang];

  if (Number.isNaN(startTime.getTime()) || Number.isNaN(endTime.getTime()) || endTime <= startTime) {
    return { available: false, reason: errors.invalidSlot };
  }

  if (!isPastMinAdvance(startTime)) {
    return { available: false, reason: errors.minAdvance(BOOKING_RULES.minAdvanceHours) };
  }

  if (!isWithinOpeningHours(startTime)) {
    return {
      available: false,
      reason: errors.outsideOpeningHours(
        BOOKING_RULES.openingHours.start,
        formatHHMM(LAST_START_MINUTES)
      ),
    };
  }

  if (!endsBeforeClosing(startTime, endTime)) {
    return {
      available: false,
      reason: errors.endsAfterClosing(BOOKING_RULES.openingHours.lastEnd),
    };
  }

  const bufferMs = BOOKING_RULES.bufferMinutes * 60 * 1000;
  const existingBookings = await fetchBookingsInRange(
    new Date(startTime.getTime() - bufferMs),
    new Date(endTime.getTime() + bufferMs)
  );

  const conflict = existingBookings.some((booking) => overlapsWithBuffer(startTime, endTime, booking));
  if (conflict) {
    return { available: false, reason: errors.slotConflict };
  }

  return { available: true };
}
