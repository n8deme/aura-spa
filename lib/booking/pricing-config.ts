// Tarifs confirmés par Rob le 2026-09-09 (voir memory/site-finalization-checklist).
// Champs encore marqués "placeholder" : pas communiqués, à corriger ici dès que connus.

export const BASE_PACKAGE = {
  durationHours: 2,
  price: 150, // flat, quel que soit le nombre de personnes (confirmé par Kev)
};

// Capacité du groupe (au-delà de 4, pour grosses soirées/anniversaires).
export const MIN_CAPACITY = 2;
export const MAX_CAPACITY = 10;

export const EXTRA_HOUR_PRICE = 25;

export const ALL_IN_PACKAGE = {
  durationHours: 2,
  price: 220,
  maxGuests: 2, // confirmé : réservé aux groupes de 2 personnes
  // Contenu exact du "tout compris" à confirmer avec Rob (voir note ci-dessous).
  includedExtras: ["charcuterie_fromage", "champagne"] as const,
};

// Les libellés affichés (fr/nl) vivent dans lib/booking/i18n.ts — ici,
// uniquement les données business indépendantes de la langue.
// `category` ne sert qu'à grouper la carte affichée sur la page d'accueil
// (SectionTarifs). Le flow de réservation l'ignore.
export const EXTRAS_CATALOG = [
  { id: "charcuterie_fromage", price: 25, category: "food" },
  { id: "sushis", price: 20, category: "food" },
  { id: "dessert", price: 15, category: "food" },
  { id: "champagne", price: 40, category: "drink" },
  { id: "prosecco", price: 40, category: "drink" },
  { id: "vin_blanc", price: 25, category: "drink" },
  { id: "cocktail_aperol", price: 10, category: "drink" },
  { id: "cocktail_passion", price: 10, category: "drink" },
  { id: "cocktail_mojito", price: 10, category: "drink" },
  { id: "soft_drink", price: 3, category: "drink" },
  { id: "shisha", price: 25, category: "other" },
] as const;

export type ExtraCategory = (typeof EXTRAS_CATALOG)[number]["category"];

export type ExtraId = (typeof EXTRAS_CATALOG)[number]["id"];

export const BOOKING_RULES = {
  maxHours: 8, // 8h max en tout (soit 6h supplémentaires au-delà des 2h de base)
  bufferMinutes: 30, // confirmé
  minAdvanceHours: 2, // délai mini AVANT de réserver un créneau (différent de bufferMinutes, le battement ENTRE deux résas, et de CANCELLATION_MIN_HOURS)
  // Ouvert de 08:00 jusqu'à 04:00 le lendemain matin (fermé 04:00 -> 08:00).
  // `lastEnd` est la vraie contrainte : une séance ne peut jamais se terminer
  // après. Le dernier départ proposé en découle et dépend donc de la durée
  // choisie — 02:00 pour 2h, 00:00 pour 4h, 20:00 pour 8h.
  openingHours: { start: "08:00", lastEnd: "04:00" },
};

// Annulation possible avec remboursement si faite au moins ce délai à l'avance.
export const CANCELLATION_MIN_HOURS = 24;
