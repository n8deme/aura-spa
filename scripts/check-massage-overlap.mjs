// Contrôle pur (sans DB) de la détection de chevauchement massage/spa dans le
// même espace : un massage peut prolonger l'occupation au-delà de la formule
// spa réservée, et ça doit se voir dans overlapsWithBuffer.
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

// --- occupiedEndTime : la fin réelle est la plus tardive des deux ---
assert.equal(
  occupiedEndTime(iso("10:00"), iso("12:00"), true, 6).toISOString(),
  iso("14:30").toISOString(),
  "massage 6 pers (4h30) doit repousser la fin au-delà des 2h de base"
);
assert.equal(
  occupiedEndTime(iso("10:00"), iso("18:00"), true, 2).toISOString(),
  iso("18:00").toISOString(),
  "un massage plus court que la formule ne doit pas raccourcir la fin"
);

// --- Le trou signalé par Kev : massage qui déborde sur la résa suivante ---
const A = booking("10:00", "12:00", 6); // base 2h + massage 6 pers → occupé jusqu'à 14:30
const B_start = iso("12:30"); // 30 min après la FIN DU FORFAIT de A (12:00), pas de son massage
const B_occupiedEnd = iso("14:30"); // B lui-même sans massage, 2h
assert.ok(
  overlapsWithBuffer(B_start, B_occupiedEnd, A),
  "B chevauche le massage de A encore en cours à 12:30 — doit être détecté"
);

// --- Un vrai créneau libre après la fin réelle (massage + battement) ---
const C_start = iso("15:30");
const C_occupiedEnd = iso("17:30");
assert.ok(
  !overlapsWithBuffer(C_start, C_occupiedEnd, A),
  "C démarre après la fin du massage de A + battement — ne doit pas être bloqué"
);

// --- Deux massages le même jour, qui ne se chevauchent pas : OK ---
const D1 = booking("10:00", "12:00", 2); // occupé jusqu'à 11:30
assert.ok(
  !overlapsWithBuffer(iso("13:00"), iso("14:30"), D1),
  "deux massages bien séparés le même jour ne doivent pas se bloquer"
);

// --- Deux massages le même jour, qui SE chevauchent : bloqué ---
const D2 = booking("10:00", "12:00", 6); // occupé jusqu'à 14:30
assert.ok(
  overlapsWithBuffer(iso("13:00"), iso("14:30"), D2),
  "un massage qui empiète sur un autre doit être bloqué"
);

console.log("OK — chevauchement massage/spa correctement détecté dans le même espace.");
