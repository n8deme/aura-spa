import "server-only";
import { MASSAGE } from "./pricing-config";

export function isMassageEligible(startTime: Date, now = new Date()): boolean {
  const minStart = new Date(now.getTime() + MASSAGE.minAdvanceDays * 24 * 60 * 60 * 1000);
  return startTime >= minStart;
}
