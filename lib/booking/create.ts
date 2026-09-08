import "server-only";
import { getSupabaseAdmin } from "@/lib/supabase/admin";
import { getStripe } from "@/lib/stripe/client";
import { checkAvailability } from "./availability";
import { BookingValidationError, EXTRAS_BY_ID, computePrice, resolveDurationHours } from "./pricing";
import type { BookingSelection, CustomerInfo } from "./types";

function randomLetters(length: number): string {
  const alphabet = "abcdefghijklmnopqrstuvwxyz";
  let result = "";
  for (let i = 0; i < length; i++) {
    result += alphabet[Math.floor(Math.random() * alphabet.length)];
  }
  return result;
}

export async function createBookingCheckout(
  selection: BookingSelection,
  customer: CustomerInfo,
  origin: string
): Promise<{ checkoutUrl: string; bookingId: string }> {
  const durationHours = resolveDurationHours(selection);
  const startTime = new Date(selection.startTime);
  const endTime = new Date(startTime.getTime() + durationHours * 60 * 60 * 1000);

  const availability = await checkAvailability(startTime, endTime);
  if (!availability.available) {
    throw new BookingValidationError(availability.reason);
  }

  const breakdown = computePrice(selection);

  const supabase = getSupabaseAdmin();
  const { data: booking, error: insertError } = await supabase
    .from("bookings")
    .insert({
      start_time: startTime.toISOString(),
      end_time: endTime.toISOString(),
      package_type: selection.packageType,
      total_price: breakdown.total,
      customer_name: customer.name,
      customer_email: customer.email,
      customer_phone: customer.phone ?? null,
      status: "pending",
    })
    .select("id")
    .single();

  if (insertError || !booking) {
    throw new Error(`Impossible de créer la réservation : ${insertError?.message}`);
  }

  if (selection.extras?.length) {
    const extraRows = selection.extras.map(({ extraId, quantity }) => ({
      booking_id: booking.id as string,
      extra_id: extraId,
      quantity,
      unit_price: EXTRAS_BY_ID.get(extraId)?.price ?? 0,
    }));
    const { error: extrasError } = await supabase.from("booking_extras").insert(extraRows);
    if (extrasError) {
      await supabase.from("bookings").delete().eq("id", booking.id);
      throw new Error(`Impossible d'enregistrer les extras : ${extrasError.message}`);
    }
  }

  try {
    const stripe = getStripe();
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      customer_email: customer.email,
      line_items: breakdown.lineItems.map((item) => ({
        price_data: {
          currency: "eur",
          product_data: { name: item.label },
          unit_amount: Math.round(item.amount * 100),
        },
        quantity: 1,
      })),
      success_url: `${origin}/reserver/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/reserver?cancelled=1`,
      metadata: { bookingId: booking.id as string },
      integration_identifier: `aura_spa_booking_${randomLetters(8)}`,
    });

    if (!session.url) {
      throw new Error("Stripe n'a pas renvoyé d'URL de paiement.");
    }

    await supabase
      .from("bookings")
      .update({ stripe_payment_id: session.id })
      .eq("id", booking.id);

    return { checkoutUrl: session.url, bookingId: booking.id as string };
  } catch (error) {
    await supabase.from("bookings").delete().eq("id", booking.id);
    throw error;
  }
}
