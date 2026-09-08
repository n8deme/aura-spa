import { NextResponse } from "next/server";
import { z } from "zod";
import { EXTRAS_CATALOG } from "@/lib/booking/pricing-config";
import { createBookingCheckout } from "@/lib/booking/create";
import { BookingValidationError } from "@/lib/booking/pricing";
import type { ExtraId } from "@/lib/booking/types";

const extraIds = EXTRAS_CATALOG.map((extra) => extra.id) as [ExtraId, ...ExtraId[]];

const bodySchema = z.object({
  startTime: z.iso.datetime(),
  packageType: z.enum(["base", "all_in", "a_la_carte"]),
  extraHours: z.number().int().min(0).optional(),
  extras: z
    .array(
      z.object({
        extraId: z.enum(extraIds),
        quantity: z.number().int().min(1),
      })
    )
    .optional(),
  customer: z.object({
    name: z.string().trim().min(1),
    email: z.email(),
    phone: z.string().trim().min(1).optional(),
  }),
});

export async function POST(request: Request) {
  const parsed = bodySchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: "Requête invalide." }, { status: 400 });
  }

  const { customer, ...selection } = parsed.data;
  const origin = new URL(request.url).origin;

  try {
    const result = await createBookingCheckout(selection, customer, origin);
    return NextResponse.json(result);
  } catch (error) {
    if (error instanceof BookingValidationError) {
      return NextResponse.json({ error: error.message }, { status: 409 });
    }
    console.error("Erreur create booking:", error);
    return NextResponse.json({ error: "Erreur serveur." }, { status: 500 });
  }
}
