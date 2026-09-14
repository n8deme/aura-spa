// Contrôle des créneaux de réservation contre la règle métier.
// Une "nuit" de réservation va de 08:00 au lendemain 02:00 (fin à 04:00 max) :
// les créneaux d'après minuit sont rattachés à la soirée qui les a commencés,
// pas à leur date calendaire.
// Lancer le serveur (pnpm dev) puis : node scripts/check-horaires.mjs
import assert from "node:assert/strict";

const BASE = process.env.BASE_URL ?? "http://localhost:3000";

// Une date assez loin pour que le délai minimum ne masque aucun créneau.
const date = new Date(Date.now() + 30 * 24 * 3600 * 1000).toISOString().slice(0, 10);
const lendemain = new Date(Date.now() + 31 * 24 * 3600 * 1000).toISOString().slice(0, 10);

async function slots(query) {
  const res = await fetch(`${BASE}/api/booking/slots?date=${date}&${query}`);
  assert.equal(res.status, 200, `la route a répondu ${res.status}`);
  return (await res.json()).slots;
}

const jour = (s) => s.filter((x) => !x.nextDay).map((x) => x.time);
const nuit = (s) => s.filter((x) => x.nextDay).map((x) => x.time);

// startTime est en UTC : minuit à Bruxelles, c'est 22:00 UTC la veille. Il faut
// donc repasser en heure locale avant de comparer à une date calendaire.
const dateLocale = (iso) =>
  new Intl.DateTimeFormat("en-CA", {
    timeZone: "Europe/Brussels",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date(iso));

// --- Séance de 2h (formule de base) ---
const base = await slots("packageType=base");

assert.equal(base[0].time, "08:00", "la nuit doit commencer à l'ouverture");
assert.equal(base.at(-1).time, "02:00", "le dernier départ en 2h est 02:00");
assert.deepEqual(jour(base).at(-1), "23:30", "la soirée va jusqu'à 23:30");
assert.deepEqual(
  nuit(base),
  ["00:00", "00:30", "01:00", "01:30", "02:00"],
  "l'après-minuit va de 00:00 à 02:00"
);
assert.ok(
  !base.some((s) => s.time > "02:00" && s.time < "08:00"),
  "rien ne doit être proposé entre 02:00 et 08:00"
);

// Le rattachement : les créneaux d'après minuit tombent bien le LENDEMAIN.
for (const s of base.filter((x) => x.nextDay)) {
  assert.equal(dateLocale(s.startTime), lendemain, `${s.time} devrait tomber le ${lendemain}`);
}
for (const s of base.filter((x) => !x.nextDay)) {
  assert.equal(dateLocale(s.startTime), date, `${s.time} devrait tomber le ${date}`);
}

// --- Séance de 4h (base + 2h supplémentaires) ---
// La contrainte est l'heure de FIN : le dernier départ recule d'autant.
const long = await slots("packageType=a_la_carte&extraHours=2");

assert.deepEqual(nuit(long), ["00:00"], "en 4h, seul 00:00 tient avant 04:00");
assert.ok(!long.some((s) => s.time === "00:30"), "4h à partir de 00:30 déborderait à 04:30");

console.log(`OK — nuit du ${date} : ${jour(base).length} créneaux en soirée, ${nuit(base).length} après minuit`);
console.log(`     en 4h : ${jour(long).length} en soirée, ${nuit(long).length} après minuit`);
