import "server-only";
import { Resend } from "resend";

let client: Resend | null = null;

// Reste `null` tant que RESEND_API_KEY n'est pas configuré (domaine Resend pas
// encore vérifié côté DNS). Les appelants doivent gérer ce cas sans planter.
export function getResend(): Resend | null {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return null;
  if (!client) {
    client = new Resend(apiKey);
  }
  return client;
}
