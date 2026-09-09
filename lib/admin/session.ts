import "server-only";
import crypto from "node:crypto";

export const ADMIN_COOKIE_NAME = "admin_session";
const MAX_AGE_MS = 7 * 24 * 60 * 60 * 1000; // 7 jours
export const ADMIN_COOKIE_MAX_AGE_SECONDS = MAX_AGE_MS / 1000;

function getSecret(): string {
  const secret = process.env.ADMIN_SESSION_SECRET;
  if (!secret) throw new Error("Variable manquante : ADMIN_SESSION_SECRET.");
  return secret;
}

function sign(value: string): string {
  return crypto.createHmac("sha256", getSecret()).update(value).digest("hex");
}

function timingSafeEqualStrings(a: string, b: string): boolean {
  const bufferA = Buffer.from(a);
  const bufferB = Buffer.from(b);
  if (bufferA.length !== bufferB.length) return false;
  return crypto.timingSafeEqual(bufferA, bufferB);
}

// Cookie de session sans état côté serveur : signé par HMAC, auto-vérifiable.
export function createSessionToken(): string {
  const issuedAt = Date.now().toString();
  return `${issuedAt}.${sign(issuedAt)}`;
}

export function isValidSessionToken(token: string | undefined | null): boolean {
  if (!token) return false;
  const [issuedAt, signature] = token.split(".");
  if (!issuedAt || !signature) return false;
  if (!timingSafeEqualStrings(sign(issuedAt), signature)) return false;
  const age = Date.now() - Number(issuedAt);
  return age >= 0 && age <= MAX_AGE_MS;
}

export function verifyPassword(password: string): boolean {
  const expected = process.env.ADMIN_PASSWORD;
  if (!expected) return false;
  return timingSafeEqualStrings(password, expected);
}
