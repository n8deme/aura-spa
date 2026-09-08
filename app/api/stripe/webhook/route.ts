import { NextResponse } from "next/server";
import type Stripe from "stripe";
import { getSupabaseAdmin } from "@/lib/supabase/admin";
import { getStripe } from "@/lib/stripe/client";
import { sendBookingConfirmationEmail } from "@/lib/email/booking-confirmation";
import type { PackageType } from "@/lib/booking/types";

export const dynamic = "force-dynamic";

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
    .select("customer_name, customer_email, start_time, package_type, total_price")
    .single();

  if (error) {
    if (error.code !== "PGRST116") {
      console.error("Webhook Stripe : échec de confirmation de la réservation", bookingId, error.message);
    }
    return;
  }

  await sendBookingConfirmationEmail({
    customerName: data.customer_name,
    customerEmail: data.customer_email,
    startTime: data.start_time,
    packageType: data.package_type as PackageType,
    totalPrice: data.total_price,
  });
}

async function cancelBooking(session: Stripe.Checkout.Session) {
  const bookingId = session.metadata?.bookingId;
  if (!bookingId) return;

  const supabase = getSupabaseAdmin();
  const { error } = await supabase.from("bookings").update({ status: "cancelled" }).eq("id", bookingId);
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
      await cancelBooking(event.data.object as Stripe.Checkout.Session);
      break;
    default:
      break;
  }

  return NextResponse.json({ received: true });
}
