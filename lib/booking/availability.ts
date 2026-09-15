import "server-only";
import type { Lang } from "@/app/_lib/content";
import { getSupabaseAdmin } from "@/lib/supabase/admin";
import { BOOKING_RULES, MASSAGE } from "./pricing-config";
import { ERRORS } from "./i18n";
import {
  LAST_START_MINUTES,
  endsBeforeClosing,
  formatHHMM,
  isWithinOpeningHours,
} from "./opening-hours";
import type { MassageSelection } from "./types";

export type AvailabilityResult = { available: true } | { available: false; reason: string };

export type ExistingBooking = {
  start_time: string;
  end_time: string;
  massage_included: boolean;
  massage_guest_count: number | null;
};

export function isPastMinAdvance(startTime: Date, now = new Date()): boolean {
  const minStart = new Date(now.getTime() + BOOKING_RULES.minAdvanceHours * 60 * 60 * 1000);
  return startTime >= minStart;
}

// Le massage démarre à l'heure du spa mais peut durer plus longtemps que la
// formule réservée (45 min par personne massée, voir MASSAGE). Tout se passe
// dans le même espace : la fin réellement occupée est donc la plus tardive
// des deux, pas seulement la fin du forfait spa.
export function occupiedEndTime(
  startTime: Date,
  endTime: Date,
  massageIncluded: boolean,
  massageGuestCount: number | null
): Date {
  if (!massageIncluded || !massageGuestCount) return endTime;
  const massageEnd = new Date(
    startTime.getTime() + MASSAGE.internalDurationMinutesPerPerson * massageGuestCount * 60 * 1000
  );
  return massageEnd > endTime ? massageEnd : endTime;
}

// Chevauchement entre [candidateStart, candidateOccupiedEnd] et une résa
// existante, en respectant le temps de battement minimum — la fin de la résa
// existante tient compte de son propre massage éventuel.
export function overlapsWithBuffer(
  candidateStart: Date,
  candidateOccupiedEnd: Date,
  existing: ExistingBooking,
  bufferMinutes = BOOKING_RULES.bufferMinutes
): boolean {
  const bufferMs = bufferMinutes * 60 * 1000;
  const bufferedStart = candidateStart.getTime() - bufferMs;
  const bufferedEnd = candidateOccupiedEnd.getTime() + bufferMs;
  const existingStart = new Date(existing.start_time).getTime();
  const existingOccupiedEnd = occupiedEndTime(
    new Date(existing.start_time),
    new Date(existing.end_time),
    existing.massage_included,
    existing.massage_guest_count
  ).getTime();
  return existingStart < bufferedEnd && existingOccupiedEnd > bufferedStart;
}

// Un massage peut prolonger l'occupation jusqu'à MASSAGE.maxGuests * durée/pers
// au-delà de la fin du forfait spa : la fenêtre de lecture doit être élargie
// d'autant, sinon une résa qui déborde juste avant `rangeStart` à cause de son
// massage serait ratée par le filtre SQL (basé sur end_time, pas sur la fin
// réellement occupée).
const MAX_MASSAGE_EXTENSION_MS = MASSAGE.maxGuests * MASSAGE.internalDurationMinutesPerPerson * 60 * 1000;

export async function fetchBookingsInRange(rangeStart: Date, rangeEnd: Date): Promise<ExistingBooking[]> {
  const supabase = getSupabaseAdmin();
  const widenedRangeStart = new Date(rangeStart.getTime() - MAX_MASSAGE_EXTENSION_MS);
  const { data, error } = await supabase
    .from("bookings")
    .select("start_time, end_time, massage_included, massage_guest_count")
    .neq("status", "cancelled")
    .lt("start_time", rangeEnd.toISOString())
    .gt("end_time", widenedRangeStart.toISOString());

  if (error) {
    throw new Error(`Erreur de lecture des réservations : ${error.message}`);
  }
  return data ?? [];
}

export async function checkAvailability(
  startTime: Date,
  endTime: Date,
  lang: Lang = "fr",
  // Massage du candidat lui-même : prolonge sa propre occupation au-delà de
  // `endTime` s'il dépasse la formule réservée (voir occupiedEndTime). Les
  // vérifications d'horaires d'ouverture/fermeture ci-dessous restent basées
  // sur `endTime`, la vraie fin de la formule spa réservée.
  massage?: MassageSelection
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

  const candidateOccupiedEnd = occupiedEndTime(
    startTime,
    endTime,
    massage?.included ?? false,
    massage?.guestCount ?? null
  );

  const bufferMs = BOOKING_RULES.bufferMinutes * 60 * 1000;
  const existingBookings = await fetchBookingsInRange(
    new Date(startTime.getTime() - bufferMs),
    new Date(candidateOccupiedEnd.getTime() + bufferMs)
  );

  const conflict = existingBookings.some((booking) => overlapsWithBuffer(startTime, candidateOccupiedEnd, booking));
  if (conflict) {
    return { available: false, reason: errors.slotConflict };
  }

  return { available: true };
}
