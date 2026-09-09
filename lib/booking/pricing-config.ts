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
export const EXTRAS_CATALOG = [
  { id: "charcuterie_fromage", price: 25 },
  { id: "sushis", price: 20 },
  { id: "dessert", price: 15 },
  { id: "cocktail_aperol", price: 10 },
  { id: "cocktail_passion", price: 10 },
  { id: "cocktail_mojito", price: 10 },
  { id: "soft_drink", price: 3 },
  { id: "shisha", price: 25 },
  { id: "prosecco", price: 40 },
  { id: "champagne", price: 40 },
  { id: "vin_blanc", price: 25 },
] as const;

export type ExtraId = (typeof EXTRAS_CATALOG)[number]["id"];

export const BOOKING_RULES = {
  maxHours: 4, // confirmé : 4h max en tout
  bufferMinutes: 30, // confirmé
  minAdvanceHours: 24, // confirmé — délai mini AVANT de réserver un créneau (différent de bufferMinutes, le battement ENTRE deux résas)
  openingHours: { start: "10:00", end: "22:00" }, // confirmé
};

// Annulation possible avec remboursement si faite au moins ce délai à l'avance.
export const CANCELLATION_MIN_HOURS = 24;
