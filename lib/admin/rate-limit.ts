import "server-only";

// Limiteur en mémoire (par instance) : suffisant pour dissuader le brute-force
// sur un outil interne à un seul utilisateur. Ne persiste pas entre cold
// starts ni entre régions — pas un rate limit distribué de production.
const attempts = new Map<string, { count: number; resetAt: number }>();
const WINDOW_MS = 15 * 60 * 1000;
const MAX_ATTEMPTS = 5;

export function isRateLimited(key: string): boolean {
  const now = Date.now();
  const entry = attempts.get(key);
  if (!entry || now > entry.resetAt) {
    attempts.set(key, { count: 1, resetAt: now + WINDOW_MS });
    return false;
  }
  entry.count += 1;
  return entry.count > MAX_ATTEMPTS;
}
