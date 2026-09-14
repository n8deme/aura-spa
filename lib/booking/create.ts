import "server-only";
import type { Lang } from "@/app/_lib/content";
import { getSupabaseAdmin } from "@/lib/supabase/admin";
import { getStripe } from "@/lib/stripe/client";
import { checkAvailability } from "./availability";
import { BookingValidationError, EXTRAS_BY_ID, computePrice, resolveDurationHours } from "./pricing";
import type { BookingSelection, CustomerInfo } from "./types";

// Stripe impose un minimum de 30 min. On met 31 : l'arrondi à la seconde
// inférieure plus la latence réseau font arriver la valeur légèrement sous le
// seuil, et la tolérance de Stripe là-dessus n'est pas documentée.
// Voir l'usage plus bas pour le choix d'un délai aussi court.
const CHECKOUT_EXPIRY_MINUTES = 31;

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
  origin: string,
  lang: Lang = "fr"
): Promise<{ checkoutUrl: string; bookingId: string }> {
  const durationHours = resolveDurationHours(selection, lang);
  const startTime = new Date(selection.startTime);
  const endTime = new Date(startTime.getTime() + durationHours * 60 * 60 * 1000);

  const availability = await checkAvailability(startTime, endTime, lang);
  if (!availability.available) {
    throw new BookingValidationError(availability.reason);
  }

  const breakdown = computePrice(selection, lang);

  const supabase = getSupabaseAdmin();
  const { data: booking, error: insertError } = await supabase
    .from("bookings")
    .insert({
      start_time: startTime.toISOString(),
      end_time: endTime.toISOString(),
      package_type: selection.packageType,
      guest_count: selection.guestCount,
      total_price: breakdown.total,
      customer_name: customer.name,
      customer_email: customer.email,
      customer_phone: customer.phone ?? null,
      customer_notes: customer.notes ?? null,
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
      success_url: `${origin}/reserver/success?session_id={CHECKOUT_SESSION_ID}&lang=${lang}`,
      cancel_url: `${origin}/reserver?cancelled=1&lang=${lang}`,
      metadata: { bookingId: booking.id as string },
      // 30 min, le minimum autorisé par Stripe (défaut : 24h). Tant que la
      // session n'a pas expiré, la résa reste "pending" et bloque le créneau —
      // avec 24h, un panier abandonné le bloquait bien après l'heure du rendez-vous.
      expires_at: Math.floor(Date.now() / 1000) + CHECKOUT_EXPIRY_MINUTES * 60,
      integration_identifier: `aura_spa_booking_${randomLetters(8)}`,
      locale: lang === "nl" ? "nl" : "fr",
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
