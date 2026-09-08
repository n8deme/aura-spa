import { NextResponse } from "next/server";
import { z } from "zod";
import {
  fetchBookingsInRange,
  isPastMinAdvance,
  overlapsWithBuffer,
  parseHHMM,
} from "@/lib/booking/availability";
import { BOOKING_RULES } from "@/lib/booking/pricing-config";
import { BookingValidationError, resolveDurationHours } from "@/lib/booking/pricing";
import { SPA_TIMEZONE, zonedTimeToUtc } from "@/lib/booking/timezone";

const STEP_MINUTES = 30;

const querySchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  packageType: z.enum(["base", "all_in", "a_la_carte"]).default("base"),
  extraHours: z.coerce.number().int().min(0).optional(),
});

function formatHHMM(minutes: number): string {
  const hour = Math.floor(minutes / 60)
    .toString()
    .padStart(2, "0");
  const minute = (minutes % 60).toString().padStart(2, "0");
  return `${hour}:${minute}`;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const parsed = querySchema.safeParse({
    date: searchParams.get("date"),
    packageType: searchParams.get("packageType") ?? undefined,
    extraHours: searchParams.get("extraHours") ?? undefined,
  });

  if (!parsed.success) {
    return NextResponse.json({ error: "Requête invalide." }, { status: 400 });
  }

  let durationHours: number;
  try {
    durationHours = resolveDurationHours(parsed.data);
  } catch (error) {
    if (error instanceof BookingValidationError) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    throw error;
  }

  const { date } = parsed.data;
  const openMinutes = parseHHMM(BOOKING_RULES.openingHours.start);
  const closeMinutes = parseHHMM(BOOKING_RULES.openingHours.end);
  const lastStartMinutes = closeMinutes - durationHours * 60;

  const candidates: { time: string; startTime: Date; endTime: Date }[] = [];
  for (let m = openMinutes; m <= lastStartMinutes; m += STEP_MINUTES) {
    const time = formatHHMM(m);
    const startTime = zonedTimeToUtc(date, time, SPA_TIMEZONE);
    const endTime = new Date(startTime.getTime() + durationHours * 60 * 60 * 1000);
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
