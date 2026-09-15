-- "CJ Massage" (Catherine + Junarra) : massage en option, réservable
-- uniquement avec une résa spa, min. 14 jours à l'avance (vérifié côté
-- application dans lib/booking/massage-availability.ts). Le nombre de
-- personnes massées est borné (2 à 6) et ne peut pas dépasser guest_count
-- (vérifié côté application dans lib/booking/pricing.ts). massage_unit_price
-- fige le tarif au moment de la résa, comme unit_price sur booking_extras.
alter table bookings add column if not exists massage_included boolean not null default false;
alter table bookings add column if not exists massage_guest_count int null check (massage_guest_count is null or massage_guest_count between 2 and 6);
alter table bookings add column if not exists massage_unit_price numeric null;
