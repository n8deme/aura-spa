-- Système de réservation Aura Spa : bookings + booking_extras.
-- Un seul espace privatif -> pas de table "resources", juste un contrôle de
-- chevauchement sur bookings.start_time / end_time (voir lib/booking/availability.ts).

create table if not exists bookings (
  id uuid primary key default gen_random_uuid(),
  start_time timestamptz not null,
  end_time timestamptz not null,
  package_type text not null check (package_type in ('base', 'all_in', 'a_la_carte')),
  total_price numeric not null check (total_price >= 0),
  customer_name text not null,
  customer_email text not null,
  customer_phone text,
  status text not null default 'pending' check (status in ('pending', 'confirmed', 'cancelled')),
  stripe_payment_id text,
  created_at timestamptz not null default now(),
  constraint bookings_end_after_start check (end_time > start_time)
);

create index if not exists bookings_time_range_idx on bookings (start_time, end_time);
create index if not exists bookings_stripe_payment_id_idx on bookings (stripe_payment_id);

create table if not exists booking_extras (
  id uuid primary key default gen_random_uuid(),
  booking_id uuid not null references bookings (id) on delete cascade,
  extra_id text not null,
  quantity int not null default 1 check (quantity > 0),
  unit_price numeric not null check (unit_price >= 0)
);

create index if not exists booking_extras_booking_id_idx on booking_extras (booking_id);

-- RLS activée sur les deux tables, sans policy pour anon/authenticated :
-- toutes les données client + paiement transitent uniquement par les routes
-- serveur (service_role, qui contourne la RLS). Voir lib/supabase/admin.ts.
alter table bookings enable row level security;
alter table booking_extras enable row level security;
