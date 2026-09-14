-- Remarques client (allergies, halal, sans alcool, goût de chicha, etc.)
alter table bookings add column if not exists customer_notes text;
