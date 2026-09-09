import type { Lang } from "@/app/_lib/content";
import {
  ALL_IN_PACKAGE,
  BASE_PACKAGE,
  BOOKING_RULES,
  EXTRAS_CATALOG,
  EXTRA_HOUR_PRICE,
  MAX_CAPACITY,
  MIN_CAPACITY,
} from "./pricing-config";
import { EXTRAS_LABELS, ERRORS, PRICING_TEXT } from "./i18n";
import type { PriceBreakdown, PricingSelection } from "./types";

export class BookingValidationError extends Error {}

export const EXTRAS_BY_ID = new Map(EXTRAS_CATALOG.map((extra) => [extra.id, extra]));

// Durée totale du créneau pour une sélection donnée, sans calculer le prix
// (utilisé par la vérification de disponibilité, qui n'a pas besoin du prix).
export function resolveDurationHours(
  selection: Pick<PricingSelection, "packageType" | "extraHours">,
  lang: Lang = "fr"
): number {
  if (selection.packageType === "base") return BASE_PACKAGE.durationHours;
  if (selection.packageType === "all_in") return ALL_IN_PACKAGE.durationHours;

  const extraHours = selection.extraHours ?? 0;
  if (extraHours < 0 || !Number.isInteger(extraHours)) {
    throw new BookingValidationError(ERRORS[lang].invalidExtraHours);
  }
  const totalHours = BASE_PACKAGE.durationHours + extraHours;
  if (totalHours > BOOKING_RULES.maxHours) {
    throw new BookingValidationError(ERRORS[lang].maxDuration(BOOKING_RULES.maxHours));
  }
  return totalHours;
}

export function computePrice(selection: PricingSelection, lang: Lang = "fr"): PriceBreakdown {
  const { packageType, guestCount } = selection;
  const errors = ERRORS[lang];
  const pricingText = PRICING_TEXT[lang];
  const extrasLabels = EXTRAS_LABELS[lang];

  if (!Number.isInteger(guestCount) || guestCount < MIN_CAPACITY || guestCount > MAX_CAPACITY) {
    throw new BookingValidationError(errors.guestCountRange(MIN_CAPACITY, MAX_CAPACITY));
  }

  if (packageType === "all_in" && guestCount > ALL_IN_PACKAGE.maxGuests) {
    throw new BookingValidationError(errors.allInMaxGuests(ALL_IN_PACKAGE.maxGuests));
  }

  if (packageType === "base") {
    if (selection.extraHours || selection.extras?.length) {
      throw new BookingValidationError(errors.baseNoExtras);
    }
    return {
      durationHours: BASE_PACKAGE.durationHours,
      lineItems: [{ label: pricingText.basePackage(BASE_PACKAGE.durationHours), amount: BASE_PACKAGE.price }],
      total: BASE_PACKAGE.price,
    };
  }

  if (packageType === "all_in") {
    if (selection.extraHours || selection.extras?.length) {
      throw new BookingValidationError(errors.allInNoExtras);
    }
    return {
      durationHours: ALL_IN_PACKAGE.durationHours,
      lineItems: [{ label: pricingText.allInPackage(ALL_IN_PACKAGE.durationHours), amount: ALL_IN_PACKAGE.price }],
      total: ALL_IN_PACKAGE.price,
    };
  }

  // À la carte
  const extraHours = selection.extraHours ?? 0;
  const totalHours = resolveDurationHours(selection, lang);

  const lineItems = [{ label: pricingText.basePackage(BASE_PACKAGE.durationHours), amount: BASE_PACKAGE.price }];

  if (extraHours > 0) {
    lineItems.push({
      label: pricingText.extraHours(extraHours),
      amount: extraHours * EXTRA_HOUR_PRICE,
    });
  }

  for (const { extraId, quantity } of selection.extras ?? []) {
    const extra = EXTRAS_BY_ID.get(extraId);
    if (!extra) {
      throw new BookingValidationError(errors.unknownExtra(extraId));
    }
    const label = extrasLabels[extraId];
    if (quantity < 1 || !Number.isInteger(quantity)) {
      throw new BookingValidationError(errors.invalidQuantity(label));
    }
    lineItems.push({
      label: pricingText.withQuantity(label, quantity),
      amount: extra.price * quantity,
    });
  }

  return {
    durationHours: totalHours,
    lineItems,
    total: lineItems.reduce((sum, item) => sum + item.amount, 0),
  };
}
