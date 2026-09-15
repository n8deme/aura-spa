import "server-only";
import { getSupabaseAdmin } from "@/lib/supabase/admin";
import { SPA_TIMEZONE, zonedTimeToUtc } from "./timezone";
import { bookingNightKey, nextDateKey } from "./opening-hours";
import { BOOKING_RULES, MASSAGE } from "./pricing-config";

export function isMassageEligible(startTime: Date, now = new Date()): boolean {
  const minStart = new Date(now.getTime() + MASSAGE.minAdvanceDays * 24 * 60 * 60 * 1000);
  return startTime >= minStart;
}

// Le massage démarre à l'heure du créneau spa (pas d'heure dédiée) et occupe
// 45 min par personne massée — c'est le temps réel bloqué dans le planning
// de Catherine/Junarra, jamais affiché côté client.
function massageWindow(startTime: Date, massageGuestCount: number): { start: number; end: number } {
  const durationMs = MASSAGE.internalDurationMinutesPerPerson * massageGuestCount * 60 * 1000;
  return { start: startTime.getTime(), end: startTime.getTime() + durationMs };
}

// Plusieurs résas massage peuvent coexister le même jour : Catherine et
// Junarra en assurent une chacune, tant que leurs fenêtres ne se chevauchent
// pas (confirmé par Kev le 2026-09-15 — pas d'exclusivité par jour).
export async function isMassageConflict(startTime: Date, massageGuestCount: number): Promise<boolean> {
  const nightKey = bookingNightKey(startTime);
  const rangeStart = zonedTimeToUtc(nightKey, BOOKING_RULES.openingHours.start, SPA_TIMEZONE);
  const rangeEnd = zonedTimeToUtc(nextDateKey(nightKey), BOOKING_RULES.openingHours.start, SPA_TIMEZONE);

  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from("bookings")
    .select("start_time, massage_guest_count")
    .eq("massage_included", true)
    .neq("status", "cancelled")
    .gte("start_time", rangeStart.toISOString())
    .lt("start_time", rangeEnd.toISOString());

  if (error) {
    throw new Error(`Erreur de lecture des réservations massage : ${error.message}`);
  }

  const candidate = massageWindow(startTime, massageGuestCount);
  return (data ?? []).some((booking) => {
    const existing = massageWindow(new Date(booking.start_time), booking.massage_guest_count ?? MASSAGE.minGuests);
    return existing.start < candidate.end && existing.end > candidate.start;
  });
}
