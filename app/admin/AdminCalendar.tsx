"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft, ChevronRight, LogOut, Loader2 } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { formatPrice, packageTypeLabel } from "@/lib/booking/format";
import { SPA_TIMEZONE } from "@/lib/booking/timezone";
import type { PackageType } from "@/lib/booking/types";

type BookingStatus = "pending" | "confirmed" | "cancelled";

type AdminBooking = {
  id: string;
  start_time: string;
  end_time: string;
  package_type: PackageType;
  guest_count: number;
  total_price: number;
  customer_name: string;
  customer_email: string;
  customer_phone: string | null;
  customer_notes: string | null;
  status: BookingStatus;
};

const STATUS_LABEL: Record<BookingStatus, string> = {
  pending: "En attente",
  confirmed: "Confirmée",
  cancelled: "Annulée",
};

const STATUS_VARIANT: Record<BookingStatus, "default" | "secondary" | "outline"> = {
  pending: "outline",
  confirmed: "default",
  cancelled: "secondary",
};

function dayKey(date: Date): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: SPA_TIMEZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date);
}

function monthKey(date: Date): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
}

function formatHour(iso: string): string {
  return new Intl.DateTimeFormat("fr-BE", { hour: "2-digit", minute: "2-digit", timeZone: SPA_TIMEZONE }).format(
    new Date(iso)
  );
}

export function AdminCalendar() {
  const router = useRouter();
  const [month, setMonth] = useState(() => new Date());
  const [bookings, setBookings] = useState<AdminBooking[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDay, setSelectedDay] = useState<Date | undefined>(new Date());
  const [loggingOut, setLoggingOut] = useState(false);

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    fetch(`/api/admin/bookings?month=${monthKey(month)}`, { signal: controller.signal })
      .then((res) => {
        if (res.status === 401) {
          router.push("/admin/login");
          return null;
        }
        if (!res.ok) throw new Error();
        return res.json();
      })
      .then((data: { bookings: AdminBooking[] } | null) => {
        if (data) setBookings(data.bookings);
      })
      .catch(() => {
        if (!controller.signal.aborted) setBookings([]);
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });
    return () => controller.abort();
  }, [month, router]);

  const bookingsByDay = useMemo(() => {
    const map = new Map<string, AdminBooking[]>();
    for (const booking of bookings) {
      const key = dayKey(new Date(booking.start_time));
      const list = map.get(key) ?? [];
      list.push(booking);
      map.set(key, list);
    }
    return map;
  }, [bookings]);

  const daysWithBookings = useMemo(
    () => Array.from(bookingsByDay.keys()).map((key) => new Date(`${key}T12:00:00`)),
    [bookingsByDay]
  );

  const selectedDayBookings = selectedDay ? (bookingsByDay.get(dayKey(selectedDay)) ?? []) : [];

  async function handleLogout() {
    setLoggingOut(true);
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <div className="min-h-screen bg-[--color-cream] px-6 py-10 md:px-12">
      <div className="mx-auto max-w-4xl">
        <div className="flex items-center justify-between">
          <h1 className="font-heading text-3xl italic text-[--color-text]">Réservations</h1>
          <Button variant="ghost" onClick={handleLogout} disabled={loggingOut} className="gap-1.5 text-[--color-text]">
            <LogOut className="size-4" /> Déconnexion
          </Button>
        </div>

        <div className="mt-8 grid gap-8 md:grid-cols-[auto_1fr]">
          <div>
            <div className="mb-2 flex items-center justify-between gap-4">
              <Button
                variant="outline"
                size="icon"
                onClick={() => setMonth((m) => new Date(m.getFullYear(), m.getMonth() - 1, 1))}
              >
                <ChevronLeft className="size-4" />
              </Button>
              <span className="text-sm font-medium text-[--color-text] capitalize">
                {new Intl.DateTimeFormat("fr-BE", { month: "long", year: "numeric" }).format(month)}
              </span>
              <Button
                variant="outline"
                size="icon"
                onClick={() => setMonth((m) => new Date(m.getFullYear(), m.getMonth() + 1, 1))}
              >
                <ChevronRight className="size-4" />
              </Button>
            </div>
            <Calendar
              mode="single"
              month={month}
              onMonthChange={setMonth}
              selected={selectedDay}
              onSelect={setSelectedDay}
              modifiers={{ hasBookings: daysWithBookings }}
              modifiersClassNames={{
                hasBookings:
                  "relative after:absolute after:bottom-1 after:left-1/2 after:size-1 after:-translate-x-1/2 after:rounded-full after:bg-[--color-accent]",
              }}
              className="rounded-[4px] border border-[--color-border] bg-[--card] p-3"
            />
          </div>

          <div>
            {loading && (
              <p className="flex items-center gap-2 text-sm text-[--color-text]/60">
                <Loader2 className="size-4 animate-spin" /> Chargement…
              </p>
            )}

            {!loading && selectedDayBookings.length === 0 && (
              <p className="text-sm text-[--color-text]/60">Aucune réservation ce jour-là.</p>
            )}

            <div className="grid gap-4">
              {selectedDayBookings.map((booking) => (
                <div key={booking.id} className="rounded-[4px] border border-[--color-border] bg-[--card] p-4">
                  <div className="flex items-center justify-between gap-3">
                    <span className="font-heading text-lg text-[--color-text]">
                      {formatHour(booking.start_time)} – {formatHour(booking.end_time)}
                    </span>
                    <Badge variant={STATUS_VARIANT[booking.status]}>{STATUS_LABEL[booking.status]}</Badge>
                  </div>
                  <p className="mt-2 text-sm text-[--color-text]">
                    {packageTypeLabel(booking.package_type)} — {booking.guest_count} pers. —{" "}
                    {formatPrice(booking.total_price)}
                  </p>
                  <Separator className="my-3 bg-[--color-border]" />
                  <p className="text-sm text-[--color-text]">{booking.customer_name}</p>
                  <p className="text-sm text-[--color-text]/70">{booking.customer_email}</p>
                  {booking.customer_phone && <p className="text-sm text-[--color-text]/70">{booking.customer_phone}</p>}
                  {booking.customer_notes && (
                    <p className="mt-2 rounded-[2px] bg-[--color-cream-warm] p-2 text-sm text-[--color-text]">
                      {booking.customer_notes}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
