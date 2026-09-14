// Contrôle des créneaux de réservation contre la règle métier :
// ouvert de 08:00 à 04:00 le lendemain, une séance ne se termine jamais après 04:00.
// Lancer le serveur (pnpm dev) puis : node scripts/check-horaires.mjs
import assert from "node:assert/strict";

const BASE = process.env.BASE_URL ?? "http://localhost:3000";

// Une date assez loin pour que le délai de 24h ne masque aucun créneau.
const date = new Date(Date.now() + 30 * 24 * 3600 * 1000).toISOString().slice(0, 10);

async function times(query) {
  const res = await fetch(`${BASE}/api/booking/slots?date=${date}&${query}`);
  assert.equal(res.status, 200, `la route a répondu ${res.status}`);
  const { slots } = await res.json();
  return slots.map((s) => s.time);
}

// --- Séance de 2h (formule de base) ---
const base = await times("packageType=base");

assert.deepEqual(
  base.filter((t) => t <= "02:00"),
  ["00:00", "00:30", "01:00", "01:30", "02:00"],
  "la nuit doit aller jusqu'à 02:00 inclus"
);
assert.ok(!base.includes("02:30"), "02:30 finirait à 04:30, après la fermeture");
assert.ok(
  !base.some((t) => t > "02:00" && t < "08:00"),
  "rien ne doit être proposé entre 02:00 et 08:00"
);
assert.ok(base.includes("08:00"), "l'ouverture est à 08:00");
assert.equal(base.at(-1), "23:30", "le dernier départ de la soirée est 23:30");

// --- Séance de 4h (base + 2h supplémentaires) ---
// La contrainte est l'heure de FIN : le dernier départ recule d'autant.
const long = await times("packageType=a_la_carte&extraHours=2");

assert.ok(long.includes("00:00"), "4h à partir de 00:00 se termine pile à 04:00");
assert.ok(!long.includes("00:30"), "4h à partir de 00:30 déborderait à 04:30");
assert.equal(long.filter((t) => t < "08:00").length, 1, "un seul départ de nuit possible en 4h");

console.log(`OK — ${date} : ${base.length} créneaux en 2h, ${long.length} en 4h`);
