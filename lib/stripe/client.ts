import "server-only";
import Stripe from "stripe";

let client: Stripe | null = null;

export function getStripe(): Stripe {
  if (!client) {
    const secretKey = process.env.STRIPE_SECRET_KEY;
    if (!secretKey) {
      throw new Error("Variable manquante : STRIPE_SECRET_KEY.");
    }
    client = new Stripe(secretKey, {
      appInfo: { name: "Aura Spa - Reservation" },
    });
  }
  return client;
}
