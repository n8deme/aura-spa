import { NextResponse } from "next/server";
import { z } from "zod";
import { checkAvailability } from "@/lib/booking/availability";
import { BookingValidationError, resolveDurationHours } from "@/lib/booking/pricing";

const bodySchema = z.object({
  startTime: z.iso.datetime(),
  packageType: z.enum(["base", "all_in", "a_la_carte"]),
  extraHours: z.number().int().min(0).optional(),
});

export async function POST(request: Request) {
  const parsed = bodySchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: "Requête invalide." }, { status: 400 });
  }

  try {
    const durationHours = resolveDurationHours(parsed.data);
    const startTime = new Date(parsed.data.startTime);
    const endTime = new Date(startTime.getTime() + durationHours * 60 * 60 * 1000);

    const result = await checkAvailability(startTime, endTime);
    return NextResponse.json(result);
  } catch (error) {
    if (error instanceof BookingValidationError) {
      return NextResponse.json({ available: false, reason: error.message }, { status: 400 });
    }
    console.error("Erreur availability:", error);
    return NextResponse.json({ error: "Erreur serveur." }, { status: 500 });
  }
}
