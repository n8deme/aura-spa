import { NextResponse } from "next/server";
import { z } from "zod";
import {
  fetchBookingsInRange,
  isPastMinAdvance,
  overlapsWithBuffer,
} from "@/lib/booking/availability";
import {
  candidateStarts,
  endsBeforeClosing,
  formatHHMM,
  nextDateKey,
} from "@/lib/booking/opening-hours";
import { BookingValidationError, resolveDurationHours } from "@/lib/booking/pricing";
import { SPA_TIMEZONE, zonedTimeToUtc } from "@/lib/booking/timezone";

const querySchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  packageType: z.enum(["base", "all_in", "a_la_carte"]).default("base"),
  extraHours: z.coerce.number().int().min(0).optional(),
  lang: z.enum(["fr", "nl"]).default("fr"),
});

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const parsed = querySchema.safeParse({
    date: searchParams.get("date"),
    packageType: searchParams.get("packageType") ?? undefined,
    extraHours: searchParams.get("extraHours") ?? undefined,
    lang: searchParams.get("lang") ?? undefined,
  });

  if (!parsed.success) {
    return NextResponse.json({ error: "Requête invalide." }, { status: 400 });
  }

  let durationHours: number;
  try {
    durationHours = resolveDurationHours(parsed.data, parsed.data.lang);
  } catch (error) {
    if (error instanceof BookingValidationError) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    throw error;
  }

  const { date } = parsed.data;

  // `date` désigne une NUIT de réservation (08:00 → lendemain 08:00), pas une
  // journée calendaire : les créneaux de 00:00 à 02:00 tombent le lendemain et
  // sont proposés ici, sous la soirée qui les a commencés. Un créneau n'est
  // retenu que si la séance entière tient avant l'heure de fermeture — le
  // dernier départ dépend donc de la durée choisie.
  const candidates: { time: string; startTime: Date; endTime: Date; nextDay: boolean }[] = [];
  for (const { minutes, nextDay } of candidateStarts()) {
    const time = formatHHMM(minutes);
    const startTime = zonedTimeToUtc(nextDay ? nextDateKey(date) : date, time, SPA_TIMEZONE);
    const endTime = new Date(startTime.getTime() + durationHours * 60 * 60 * 1000);
    if (!endsBeforeClosing(startTime, endTime)) continue;
    candidates.push({ time, startTime, endTime, nextDay });
  }

  if (candidates.length === 0) {
    return NextResponse.json({ durationHours, slots: [] });
  }

  const marginMs = 24 * 60 * 60 * 1000;
  const rangeStart = new Date(candidates[0].startTime.getTime() - marginMs);
  const rangeEnd = new Date(candidates[candidates.length - 1].endTime.getTime() + marginMs);
  const existingBookings = await fetchBookingsInRange(rangeStart, rangeEnd);

  const slots = candidates.map(({ time, startTime, endTime, nextDay }) => ({
    time,
    nextDay,
    startTime: startTime.toISOString(),
    available:
      isPastMinAdvance(startTime) &&
      !existingBookings.some((booking) => overlapsWithBuffer(startTime, endTime, booking)),
  }));

  return NextResponse.json({ durationHours, slots });
}
