import {
  ALL_IN_PACKAGE,
  BASE_PACKAGE,
  BOOKING_RULES,
  EXTRAS_CATALOG,
  EXTRA_HOUR_PRICE,
} from "./pricing-config";
import type { PriceBreakdown, PricingSelection } from "./types";

export class BookingValidationError extends Error {}

export const EXTRAS_BY_ID = new Map(EXTRAS_CATALOG.map((extra) => [extra.id, extra]));

// Durée totale du créneau pour une sélection donnée, sans calculer le prix
// (utilisé par la vérification de disponibilité, qui n'a pas besoin du prix).
export function resolveDurationHours(selection: Pick<PricingSelection, "packageType" | "extraHours">): number {
  if (selection.packageType === "base") return BASE_PACKAGE.durationHours;
  if (selection.packageType === "all_in") return ALL_IN_PACKAGE.durationHours;

  const extraHours = selection.extraHours ?? 0;
  if (extraHours < 0 || !Number.isInteger(extraHours)) {
    throw new BookingValidationError("Nombre d'heures supplémentaires invalide.");
  }
  const totalHours = BASE_PACKAGE.durationHours + extraHours;
  if (totalHours > BOOKING_RULES.maxHours) {
    throw new BookingValidationError(
      `La durée totale ne peut pas dépasser ${BOOKING_RULES.maxHours}h.`
    );
  }
  return totalHours;
}

export function computePrice(selection: PricingSelection): PriceBreakdown {
  const { packageType } = selection;

  if (packageType === "base") {
    if (selection.extraHours || selection.extras?.length) {
      throw new BookingValidationError(
        "Le forfait de base ne peut pas inclure d'heures ou d'extras supplémentaires."
      );
    }
    return {
      durationHours: BASE_PACKAGE.durationHours,
      lineItems: [
        { label: `Forfait de base (${BASE_PACKAGE.durationHours}h)`, amount: BASE_PACKAGE.price },
      ],
      total: BASE_PACKAGE.price,
    };
  }

  if (packageType === "all_in") {
    if (selection.extraHours || selection.extras?.length) {
      throw new BookingValidationError(
        "Le forfait All-in ne peut pas inclure d'heures ou d'extras supplémentaires."
      );
    }
    return {
      durationHours: ALL_IN_PACKAGE.durationHours,
      lineItems: [
        { label: `Forfait All-in (${ALL_IN_PACKAGE.durationHours}h)`, amount: ALL_IN_PACKAGE.price },
      ],
      total: ALL_IN_PACKAGE.price,
    };
  }

  // À la carte
  const extraHours = selection.extraHours ?? 0;
  const totalHours = resolveDurationHours(selection);

  const lineItems = [
    { label: `Forfait de base (${BASE_PACKAGE.durationHours}h)`, amount: BASE_PACKAGE.price },
  ];

  if (extraHours > 0) {
    lineItems.push({
      label: `${extraHours}h supplémentaire(s)`,
      amount: extraHours * EXTRA_HOUR_PRICE,
    });
  }

  for (const { extraId, quantity } of selection.extras ?? []) {
    const extra = EXTRAS_BY_ID.get(extraId);
    if (!extra) {
      throw new BookingValidationError(`Extra inconnu : ${extraId}`);
    }
    if (quantity < 1 || !Number.isInteger(quantity)) {
      throw new BookingValidationError(`Quantité invalide pour ${extra.label}.`);
    }
    lineItems.push({
      label: quantity > 1 ? `${extra.label} x${quantity}` : extra.label,
      amount: extra.price * quantity,
    });
  }

  return {
    durationHours: totalHours,
    lineItems,
    total: lineItems.reduce((sum, item) => sum + item.amount, 0),
  };
}
