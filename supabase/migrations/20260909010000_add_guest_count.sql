-- Nombre de personnes de la réservation (l'All-in est limité à 2 personnes,
-- vérifié côté application dans lib/booking/pricing.ts).
alter table bookings add column if not exists guest_count int not null default 2 check (guest_count between 2 and 10);
