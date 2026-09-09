import type { Metadata } from "next";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { ADMIN_COOKIE_NAME, isValidSessionToken } from "@/lib/admin/session";
import { AdminCalendar } from "./AdminCalendar";

export const metadata: Metadata = {
  title: "Réservations — Aura Spa",
  robots: { index: false, follow: false },
};

export default async function AdminPage() {
  const cookieStore = await cookies();
  if (!isValidSessionToken(cookieStore.get(ADMIN_COOKIE_NAME)?.value)) {
    redirect("/admin/login");
  }

  return <AdminCalendar />;
}
