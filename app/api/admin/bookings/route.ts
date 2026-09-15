import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { ADMIN_COOKIE_NAME, isValidSessionToken } from "@/lib/admin/session";
import { getSupabaseAdmin } from "@/lib/supabase/admin";
import { SPA_TIMEZONE, zonedTimeToUtc } from "@/lib/booking/timezone";
import { BOOKING_RULES } from "@/lib/booking/pricing-config";

const querySchema = z.object({ month: z.string().regex(/^\d{4}-\d{2}$/) });

export async function GET(request: NextRequest) {
  if (!isValidSessionToken(request.cookies.get(ADMIN_COOKIE_NAME)?.value)) {
    return NextResponse.json({ error: "Non authentifié." }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const parsed = querySchema.safeParse({ month: searchParams.get("month") });
  if (!parsed.success) {
    return NextResponse.json({ error: "Requête invalide." }, { status: 400 });
  }

  const [year, month] = parsed.data.month.split("-").map(Number);
  // Le mois couvre des NUITS, pas des journées calendaires : une nuit court de
  // 08:00 au lendemain 08:00. Sans ce décalage, une résa à 01:00 le 1er du mois
  // suivant (donc la nuit du dernier jour de ce mois-ci) manquerait à l'appel.
  const ouverture = BOOKING_RULES.openingHours.start;
  const rangeStart = zonedTimeToUtc(`${parsed.data.month}-01`, ouverture, SPA_TIMEZONE);
  const nextMonth = month === 12 ? `${year + 1}-01` : `${year}-${String(month + 1).padStart(2, "0")}`;
  const rangeEnd = zonedTimeToUtc(`${nextMonth}-01`, ouverture, SPA_TIMEZONE);

  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from("bookings")
    .select(
      "id, start_time, end_time, package_type, guest_count, total_price, customer_name, customer_email, customer_phone, customer_notes, status, massage_included, massage_guest_count, booking_extras(extra_id, quantity, unit_price)"
    )
    .gte("start_time", rangeStart.toISOString())
    .lt("start_time", rangeEnd.toISOString())
    .order("start_time", { ascending: true });

  if (error) {
    console.error("Erreur admin bookings:", error);
    return NextResponse.json({ error: "Erreur serveur." }, { status: 500 });
  }

  return NextResponse.json({ bookings: data });
}
