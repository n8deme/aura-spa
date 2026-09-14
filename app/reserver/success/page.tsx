import type { Metadata } from "next";
import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
import { Wordmark } from "@/app/_components/Wordmark";
import { Button } from "@/components/ui/button";
import type { Lang } from "@/app/_lib/content";
import { BOOKING_UI } from "@/lib/booking/i18n";
import { getStripe } from "@/lib/stripe/client";
import { getSupabaseAdmin } from "@/lib/supabase/admin";
import { formatDateLong, formatPrice, formatTime } from "@/lib/booking/format";

export const metadata: Metadata = {
  title: "Réservation confirmée — Aura Spa",
};

async function getBookingFromSession(sessionId: string) {
  const stripe = getStripe();
  const session = await stripe.checkout.sessions.retrieve(sessionId);
  const bookingId = session.metadata?.bookingId;
  if (!bookingId) return null;

  const supabase = getSupabaseAdmin();
  const { data } = await supabase
    .from("bookings")
    .select("start_time, package_type, total_price, status")
    .eq("id", bookingId)
    .single();

  return data;
}

export default async function SuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ session_id?: string; lang?: string }>;
}) {
  const { session_id, lang: rawLang } = await searchParams;
  const lang: Lang = rawLang === "nl" ? "nl" : "fr";
  const t = BOOKING_UI[lang].success;
  const booking = session_id ? await getBookingFromSession(session_id).catch(() => null) : null;

  return (
    <div className="min-h-screen bg-[--color-cream]">
      <header className="border-b border-[--color-border] px-6 py-5 md:px-12">
        <Link href="/">
          <Wordmark />
        </Link>
      </header>

      <main className="mx-auto max-w-lg px-6 py-24 text-center">
        <CheckCircle2 className="mx-auto size-12 text-[--color-accent]" />
        <h1 className="mt-6 font-heading text-3xl italic text-[--color-text] md:text-4xl">{t.title}</h1>
        <p className="mt-3 text-sm text-[--color-text]/70">{t.thanks}</p>

        {booking && (
          <div className="mt-8 rounded-[4px] border border-[--color-border] bg-[--card] p-6 text-left">
            <p className="text-sm text-[--color-text]/70">{t.slotLabel}</p>
            <p className="mt-1 font-heading text-lg text-[--color-text]">
              {formatDateLong(new Date(booking.start_time), lang)} à {formatTime(new Date(booking.start_time), lang)}
            </p>
            <p className="mt-4 text-sm text-[--color-text]/70">{t.totalPaid}</p>
            <p className="mt-1 font-heading text-lg text-[--color-text]">{formatPrice(booking.total_price, lang)}</p>
          </div>
        )}

        <Button
          render={<Link href="/" />}
          size="lg"
          className="mt-10 rounded-[2px] bg-[--color-accent] px-8 text-[--color-cream]"
        >
          {t.backHome}
        </Button>
      </main>
    </div>
  );
}
