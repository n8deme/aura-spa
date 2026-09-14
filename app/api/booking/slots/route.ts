import { NextResponse } from "next/server";
import { z } from "zod";
import {
  fetchBookingsInRange,
  isPastMinAdvance,
  overlapsWithBuffer,
} from "@/lib/booking/availability";
import {
  candidateStartMinutes,
  endsBeforeClosing,
  formatHHMM,
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

  // Les horaires franchissent minuit : chaque créneau reste rattaché à sa vraie
  // date calendaire (00:00 → 02:00 appartiennent au jour qui commence, pas à la
  // soirée de la veille). Un créneau n'est proposé que si la séance entière
  // tient avant l'heure de fermeture — le dernier départ dépend donc de la durée.
  const candidates: { time: string; startTime: Date; endTime: Date }[] = [];
  for (const m of candidateStartMinutes()) {
    const time = formatHHMM(m);
    const startTime = zonedTimeToUtc(date, time, SPA_TIMEZONE);
    const endTime = new Date(startTime.getTime() + durationHours * 60 * 60 * 1000);
    if (!endsBeforeClosing(startTime, endTime)) continue;
    candidates.push({ time, startTime, endTime });
  }

  if (candidates.length === 0) {
    return NextResponse.json({ durationHours, slots: [] });
  }

  const marginMs = 24 * 60 * 60 * 1000;
  const rangeStart = new Date(candidates[0].startTime.getTime() - marginMs);
  const rangeEnd = new Date(candidates[candidates.length - 1].endTime.getTime() + marginMs);
  const existingBookings = await fetchBookingsInRange(rangeStart, rangeEnd);

  const slots = candidates.map(({ time, startTime, endTime }) => ({
    time,
    startTime: startTime.toISOString(),
    available:
      isPastMinAdvance(startTime) &&
      !existingBookings.some((booking) => overlapsWithBuffer(startTime, endTime, booking)),
  }));

  return NextResponse.json({ durationHours, slots });
}
