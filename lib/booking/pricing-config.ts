// Tarifs confirmés par Rob le 2026-09-09 (voir memory/site-finalization-checklist).
// Champs encore marqués "placeholder" : pas communiqués, à corriger ici dès que connus.

export const BASE_PACKAGE = {
  durationHours: 2,
  price: 150, // pour 2 personnes — flou sur le prix à 3-4 pers, voir note ci-dessous
};

export const EXTRA_HOUR_PRICE = 25;

export const ALL_IN_PACKAGE = {
  durationHours: 2,
  price: 220,
  // Contenu exact du "tout compris" à confirmer avec Rob (voir note ci-dessous).
  includedExtras: ["charcuterie_fromage", "champagne"] as const,
};

export const EXTRAS_CATALOG = [
  { id: "charcuterie_fromage", label: "Plateau charcuterie & fromage", price: 25 },
  { id: "sushis", label: "Plateau de sushis", price: 20 },
  { id: "dessert", label: "Plateau dessert", price: 15 },
  { id: "cocktail_aperol", label: "Cocktail — Aperol Spritz", price: 10 },
  { id: "cocktail_passion", label: "Cocktail — Passion Fruit Martini", price: 10 },
  { id: "cocktail_mojito", label: "Cocktail — Mojito fraise", price: 10 },
  { id: "soft_drink", label: "Soft drink", price: 3 },
  { id: "shisha", label: "Chicha (goût au choix, à préciser en remarque)", price: 25 },
  { id: "prosecco", label: "Bouteille de prosecco", price: 0 }, // prix pas encore donné
  { id: "champagne", label: "Bouteille de champagne", price: 0 }, // prix pas encore donné
] as const;

export type ExtraId = (typeof EXTRAS_CATALOG)[number]["id"];

export const BOOKING_RULES = {
  maxHours: 4, // confirmé : 4h max en tout
  bufferMinutes: 30, // confirmé
  minAdvanceHours: 2, // placeholder — pas communiqué
  openingHours: { start: "10:00", end: "22:00" }, // placeholder — pas communiqué
};

// Annulation possible avec remboursement si faite au moins ce délai à l'avance.
export const CANCELLATION_MIN_HOURS = 24;
