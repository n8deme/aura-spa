import { NextResponse } from "next/server";
import type Stripe from "stripe";
import { getSupabaseAdmin } from "@/lib/supabase/admin";
import { getStripe } from "@/lib/stripe/client";
import { sendBookingConfirmationEmail } from "@/lib/email/booking-confirmation";
import { sendMassageNotificationEmail } from "@/lib/email/massage-notification";
import type { PackageType } from "@/lib/booking/types";
import { lineItemsFromBooking } from "@/lib/booking/pricing";
import type { Lang } from "@/app/_lib/content";

export const dynamic = "force-dynamic";

// La langue vient des métadonnées de la session Stripe. Une résa antérieure à
// cette mise en place n'en a pas : on retombe sur le français.
function resolveLang(value: string | undefined): Lang {
  return value === "nl" ? "nl" : "fr";
}

async function fulfillBooking(session: Stripe.Checkout.Session) {
  const bookingId = session.metadata?.bookingId;
  if (!bookingId) {
    console.error("Webhook Stripe : bookingId manquant dans les métadonnées de la session.");
    return;
  }
  if (session.payment_status === "unpaid") return;

  const paymentIntentId =
    typeof session.payment_intent === "string" ? session.payment_intent : session.payment_intent?.id;

  const supabase = getSupabaseAdmin();
  // Le filtre status="pending" rend l'opération idempotente : si Stripe relivre
  // le même événement, l'update ne matche plus rien et aucun email n'est renvoyé.
  const { data, error } = await supabase
    .from("bookings")
    .update({ status: "confirmed", stripe_payment_id: paymentIntentId ?? session.id })
    .eq("id", bookingId)
    .eq("status", "pending")
    .select(
      "customer_name, customer_email, customer_phone, start_time, end_time, package_type, guest_count, total_price, massage_included, massage_guest_count, massage_unit_price, booking_extras(extra_id, quantity, unit_price)"
    )
    .single();

  if (error) {
    if (error.code !== "PGRST116") {
      console.error("Webhook Stripe : échec de confirmation de la réservation", bookingId, error.message);
    }
    return;
  }

  const lang = resolveLang(session.metadata?.lang);
  const massage =
    data.massage_included && data.massage_guest_count && data.massage_unit_price
      ? { guestCount: data.massage_guest_count, unitPrice: data.massage_unit_price }
      : null;

  await sendBookingConfirmationEmail({
    customerName: data.customer_name,
    customerEmail: data.customer_email,
    startTime: data.start_time,
    packageType: data.package_type as PackageType,
    totalPrice: data.total_price,
    lang,
    lineItems: lineItemsFromBooking(
      {
        packageType: data.package_type as PackageType,
        startTime: data.start_time,
        endTime: data.end_time,
        extras: data.booking_extras ?? [],
        massage,
      },
      lang
    ),
  });

  if (massage) {
    await sendMassageNotificationEmail({
      startTime: data.start_time,
      guestCount: data.guest_count,
      massageGuestCount: massage.guestCount,
      customerName: data.customer_name,
      customerPhone: data.customer_phone,
    });
  }
}

async function cancelBooking(session: Stripe.Checkout.Session) {
  const bookingId = session.metadata?.bookingId;
  if (!bookingId) return;

  const supabase = getSupabaseAdmin();
  // Le filtre status="pending" protège une résa déjà payée : un événement
  // d'expiration en retard ne doit jamais annuler une réservation confirmée.
  const { error } = await supabase
    .from("bookings")
    .update({ status: "cancelled" })
    .eq("id", bookingId)
    .eq("status", "pending");
  if (error) {
    console.error("Webhook Stripe : échec d'annulation de la réservation", bookingId, error.message);
  }
}

export async function POST(request: Request) {
  const signature = request.headers.get("stripe-signature");
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!signature || !webhookSecret) {
    console.error("Webhook Stripe : signature ou secret manquant.");
    return NextResponse.json({ error: "Configuration webhook manquante." }, { status: 400 });
  }

  const rawBody = await request.text();
  const stripe = getStripe();

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(rawBody, signature, webhookSecret);
  } catch (error) {
    console.error("Webhook Stripe : signature invalide.", error);
    return NextResponse.json({ error: "Signature invalide." }, { status: 400 });
  }

  switch (event.type) {
    case "checkout.session.completed":
    case "checkout.session.async_payment_succeeded":
      await fulfillBooking(event.data.object as Stripe.Checkout.Session);
      break;
    case "checkout.session.async_payment_failed":
    // Paiement abandonné : sans ça, la résa restait "pending" pour toujours
    // et bloquait le créneau alors que personne n'a payé.
    case "checkout.session.expired":
      await cancelBooking(event.data.object as Stripe.Checkout.Session);
      break;
    default:
      break;
  }

  return NextResponse.json({ received: true });
}
