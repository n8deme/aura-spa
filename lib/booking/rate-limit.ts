import "server-only";

// Limiteur en mémoire (par instance) : dissuade le spam de créations de
// réservation (écriture DB + appel Stripe à chaque requête). Pas distribué,
// suffisant pour un trafic de petit site.
const attempts = new Map<string, { count: number; resetAt: number }>();
const WINDOW_MS = 10 * 60 * 1000;
const MAX_ATTEMPTS = 8;

export function isBookingCreateRateLimited(key: string): boolean {
  const now = Date.now();
  const entry = attempts.get(key);
  if (!entry || now > entry.resetAt) {
    attempts.set(key, { count: 1, resetAt: now + WINDOW_MS });
    return false;
  }
  entry.count += 1;
  return entry.count > MAX_ATTEMPTS;
}
