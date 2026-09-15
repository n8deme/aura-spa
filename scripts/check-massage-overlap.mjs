// Contrôle pur (sans DB) de la détection de chevauchement massage/spa dans le
// même espace : le massage a lieu APRÈS le forfait spa (pas pendant) et
// prolonge l'occupation de 45 min par personne massée à partir de la fin du
// forfait. Ça doit se voir dans occupiedEndTime et overlapsWithBuffer.
// Lancer : node --import ./scripts/_register.mjs scripts/check-massage-overlap.mjs
import assert from "node:assert/strict";
import { occupiedEndTime, overlapsWithBuffer } from "@/lib/booking/availability.ts";

const iso = (s) => new Date(`2026-10-01T${s}:00Z`);
const booking = (start, end, massageGuestCount) => ({
  start_time: iso(start).toISOString(),
  end_time: iso(end).toISOString(),
  massage_included: massageGuestCount != null,
  massage_guest_count: massageGuestCount ?? null,
});

// --- L'exemple de Kev : spa 8h-10h (2h) + massage 2 pers → occupé jusqu'à 11h30 ---
assert.equal(
  occupiedEndTime(iso("10:00"), true, 2).toISOString(),
  iso("11:30").toISOString(),
  "massage 2 pers (1h30) après la fin du spa (10h) doit repousser la fin à 11h30"
);
assert.equal(
  occupiedEndTime(iso("12:00"), true, 6).toISOString(),
  iso("16:30").toISOString(),
  "massage 6 pers (4h30) après la fin du spa (12h) doit repousser la fin à 16h30"
);
assert.equal(
  occupiedEndTime(iso("18:00"), false, null).toISOString(),
  iso("18:00").toISOString(),
  "sans massage, la fin occupée est la fin du forfait, inchangée"
);

// --- Le trou signalé par Kev : massage qui déborde sur la résa suivante ---
const A = booking("10:00", "12:00", 6); // base 2h + massage 6 pers → occupé jusqu'à 16:30
const B_start = iso("12:30"); // 30 min après la FIN DU FORFAIT de A (12:00), en plein dans son massage
const B_occupiedEnd = iso("14:30"); // B lui-même sans massage, 2h
assert.ok(
  overlapsWithBuffer(B_start, B_occupiedEnd, A),
  "B chevauche le massage de A encore en cours à 12:30 — doit être détecté"
);

// --- Un vrai créneau libre après la fin réelle (massage + battement) ---
const C_start = iso("17:30"); // 30 min après 16:30 + 30 min de battement = 17:00 minimum
const C_occupiedEnd = iso("19:30");
assert.ok(
  !overlapsWithBuffer(C_start, C_occupiedEnd, A),
  "C démarre après la fin du massage de A + battement — ne doit pas être bloqué"
);

// --- L'exemple de Kev, au mot près : spa 8h-10h + massage 2 pers → occupé jusqu'à 11h30 ---
const KevA = booking("08:00", "10:00", 2);
assert.ok(
  overlapsWithBuffer(iso("11:59"), iso("13:59"), KevA),
  "juste avant l'écoulement du battement de 30 min après 11h30 — bloqué"
);
assert.ok(
  !overlapsWithBuffer(iso("12:00"), iso("14:00"), KevA),
  "à 12h00 (11h30 + 30 min de battement pile) — libre"
);

// --- Deux massages le même jour, qui ne se chevauchent pas : OK ---
const D1 = booking("10:00", "12:00", 2); // occupé jusqu'à 13:30
assert.ok(
  !overlapsWithBuffer(iso("14:30"), iso("16:00"), D1),
  "deux massages bien séparés le même jour ne doivent pas se bloquer"
);

// --- Deux massages le même jour, qui SE chevauchent : bloqué ---
const D2 = booking("10:00", "12:00", 6); // occupé jusqu'à 16:30
assert.ok(
  overlapsWithBuffer(iso("13:00"), iso("14:30"), D2),
  "un massage qui empiète sur un autre doit être bloqué"
);

console.log("OK — le massage après le spa prolonge bien l'occupation, et c'est détecté.");
