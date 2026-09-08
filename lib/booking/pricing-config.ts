// Placeholders en attente des tarifs définitifs de Rob — voir topo réservation.
// Une fois les vrais prix connus, ne changer que ce fichier.

export const BASE_PACKAGE = {
  durationHours: 2,
  price: 150,
};

export const EXTRA_HOUR_PRICE = 0; // placeholder

export const ALL_IN_PACKAGE = {
  durationHours: 2,
  price: 0, // placeholder
  includedExtras: ["fromage", "champagne", "charcuterie"] as const,
};

export const EXTRAS_CATALOG = [
  { id: "fromage", label: "Plateau de fromage", price: 0 },
  { id: "charcuterie", label: "Plateau de charcuterie", price: 0 },
  { id: "sushis", label: "Plateau de sushis", price: 0 },
  { id: "cocktail", label: "Cocktail", price: 0 },
  { id: "prosecco", label: "Bouteille de prosecco", price: 0 },
  { id: "champagne", label: "Bouteille de champagne", price: 0 },
  { id: "dessert", label: "Plateau dessert", price: 0 },
] as const;

export type ExtraId = (typeof EXTRAS_CATALOG)[number]["id"];

export const BOOKING_RULES = {
  maxHours: 5, // placeholder
  bufferMinutes: 30, // placeholder
  minAdvanceHours: 2, // placeholder
  openingHours: { start: "10:00", end: "22:00" }, // placeholder
};
