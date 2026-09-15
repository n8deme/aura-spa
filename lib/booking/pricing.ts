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
import type { ExtraId, PackageType, PriceBreakdown, PricingSelection } from "./types";

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

export type PersistedExtra = { extra_id: string; quantity: number; unit_price: number };

/**
 * Reconstruit le détail d'une réservation à partir de ce qui est EN BASE.
 *
 * Deux partis pris :
 * - les montants viennent de `unit_price` stocké au moment de la réservation,
 *   pas du catalogue actuel : une résa passée doit montrer ce qui a réellement
 *   été facturé, même si Rob change un prix ensuite ;
 * - les heures supplémentaires se déduisent de la durée, la table `bookings`
 *   ne les stocke pas.
 */
export function lineItemsFromBooking(
  booking: {
    packageType: PackageType;
    startTime: string;
    endTime: string;
    extras: PersistedExtra[];
  },
  lang: Lang = "fr"
): { label: string; amount: number }[] {
  const pricingText = PRICING_TEXT[lang];
  const extrasLabels = EXTRAS_LABELS[lang];

  if (booking.packageType === "all_in") {
    return [
      { label: pricingText.allInPackage(ALL_IN_PACKAGE.durationHours), amount: ALL_IN_PACKAGE.price },
    ];
  }

  const lines = [
    { label: pricingText.basePackage(BASE_PACKAGE.durationHours), amount: BASE_PACKAGE.price },
  ];
  if (booking.packageType === "base") return lines;

  const dureeHeures = Math.round(
    (new Date(booking.endTime).getTime() - new Date(booking.startTime).getTime()) / 3_600_000
  );
  const heuresSup = Math.max(0, dureeHeures - BASE_PACKAGE.durationHours);
  if (heuresSup > 0) {
    lines.push({ label: pricingText.extraHours(heuresSup), amount: heuresSup * EXTRA_HOUR_PRICE });
  }

  for (const extra of booking.extras) {
    const connu = extra.extra_id in extrasLabels;
    const libelle = connu ? extrasLabels[extra.extra_id as ExtraId] : extra.extra_id;
    lines.push({
      label: pricingText.withQuantity(libelle, extra.quantity),
      amount: extra.unit_price * extra.quantity,
    });
  }
  return lines;
}
