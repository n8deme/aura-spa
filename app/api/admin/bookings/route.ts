import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { ADMIN_COOKIE_NAME, isValidSessionToken } from "@/lib/admin/session";
import { getSupabaseAdmin } from "@/lib/supabase/admin";
import { SPA_TIMEZONE, zonedTimeToUtc } from "@/lib/booking/timezone";

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
  const rangeStart = zonedTimeToUtc(`${parsed.data.month}-01`, "00:00", SPA_TIMEZONE);
  const nextMonth = month === 12 ? `${year + 1}-01` : `${year}-${String(month + 1).padStart(2, "0")}`;
  const rangeEnd = zonedTimeToUtc(`${nextMonth}-01`, "00:00", SPA_TIMEZONE);

  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from("bookings")
    .select(
      "id, start_time, end_time, package_type, guest_count, total_price, customer_name, customer_email, customer_phone, customer_notes, status"
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
