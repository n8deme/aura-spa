import "server-only";
import { getSupabaseAdmin } from "@/lib/supabase/admin";
import { SPA_TIMEZONE, zonedTimeToUtc } from "./timezone";
import { bookingNightKey, nextDateKey } from "./opening-hours";
import { BOOKING_RULES, MASSAGE } from "./pricing-config";

export function isMassageEligible(startTime: Date, now = new Date()): boolean {
  const minStart = new Date(now.getTime() + MASSAGE.minAdvanceDays * 24 * 60 * 60 * 1000);
  return startTime >= minStart;
}

// Catherine et Junarra n'assurent qu'un seul massage par nuit de réservation
// (voir MASSAGE_ONE_PER_NIGHT) : elles ne servent jamais deux groupes en
// parallèle, quelle que soit la taille de chacun.
export async function isMassageNightTaken(startTime: Date): Promise<boolean> {
  const nightKey = bookingNightKey(startTime);
  const rangeStart = zonedTimeToUtc(nightKey, BOOKING_RULES.openingHours.start, SPA_TIMEZONE);
  const rangeEnd = zonedTimeToUtc(nextDateKey(nightKey), BOOKING_RULES.openingHours.start, SPA_TIMEZONE);

  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from("bookings")
    .select("id")
    .eq("massage_included", true)
    .neq("status", "cancelled")
    .gte("start_time", rangeStart.toISOString())
    .lt("start_time", rangeEnd.toISOString())
    .limit(1);

  if (error) {
    throw new Error(`Erreur de lecture des réservations massage : ${error.message}`);
  }
  return (data?.length ?? 0) > 0;
}
