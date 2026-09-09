"use client";

import { useEffect, useState } from "react";
import { Loader2, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import type { Lang } from "@/app/_lib/content";
import { BOOKING_UI } from "@/lib/booking/i18n";
import { computePrice } from "@/lib/booking/pricing";
import { formatDateLong, formatPrice, formatTime } from "@/lib/booking/format";
import type { CustomerInfo, ExtraSelection, PackageType } from "@/lib/booking/types";
import { StepNav } from "./StepNav";

type Slot = { time: string; startTime: string; available: boolean };

export function StepRecap({
  lang,
  startTime,
  packageType,
  guestCount,
  extraHours,
  extras,
  customer,
  onCustomerChange,
  onBack,
  onSlotUnavailable,
}: {
  lang: Lang;
  startTime: string;
  packageType: PackageType;
  guestCount: number;
  extraHours: number;
  extras: ExtraSelection[];
  customer: CustomerInfo;
  onCustomerChange: (customer: CustomerInfo) => void;
  onBack: () => void;
  onSlotUnavailable: () => void;
}) {
  const t = BOOKING_UI[lang].recap;
  const [checking, setChecking] = useState(true);
  const [conflict, setConflict] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const breakdown = computePrice({ packageType, guestCount, extraHours, extras }, lang);
  const start = new Date(startTime);

  useEffect(() => {
    const dateKey = startTime.slice(0, 10);
    const controller = new AbortController();
    setChecking(true);
    fetch(
      `/api/booking/slots?date=${dateKey}&packageType=${packageType}&lang=${lang}${
        packageType === "a_la_carte" ? `&extraHours=${extraHours}` : ""
      }`,
      { signal: controller.signal }
    )
      .then((res) => res.json())
      .then((data: { slots: Slot[] }) => {
        const match = data.slots.find((slot) => slot.startTime === startTime);
        setConflict(!match || !match.available);
      })
      .catch(() => {
        if (!controller.signal.aborted) setConflict(false);
      })
      .finally(() => {
        if (!controller.signal.aborted) setChecking(false);
      });
    return () => controller.abort();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const canSubmit =
    !checking &&
    !conflict &&
    customer.name.trim().length > 0 &&
    /.+@.+\..+/.test(customer.email);

  async function handleSubmit() {
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch("/api/booking/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ startTime, packageType, guestCount, extraHours, extras, customer, lang }),
      });
      const data = await res.json();
      if (!res.ok) {
        if (res.status === 409) {
          setConflict(true);
          setError(data.error ?? t.slotGoneError);
        } else {
          setError(data.error ?? t.genericError);
        }
        return;
      }
      window.location.href = data.checkoutUrl;
    } catch {
      setError(t.retryError);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div>
      <h1 className="font-heading text-3xl italic text-[--color-text] md:text-4xl">{t.title}</h1>

      <section className="mt-8 rounded-[4px] border border-[--color-border] bg-[--card] p-5">
        <p className="text-sm text-[--color-text]/70">{t.slotLabel}</p>
        <p className="mt-1 font-heading text-lg text-[--color-text]">
          {formatDateLong(start, lang)} à {formatTime(start, lang)}
        </p>
        <p className="mt-1 text-sm text-[--color-text]/70">{t.guestsLabel(guestCount)}</p>

        <Separator className="my-4 bg-[--color-border]" />

        {breakdown.lineItems.map((item, index) => (
          <div key={index} className="flex justify-between py-1 text-sm text-[--color-text]">
            <span>{item.label}</span>
            <span>{formatPrice(item.amount, lang)}</span>
          </div>
        ))}
        <Separator className="my-3 bg-[--color-border]" />
        <div className="flex justify-between text-lg font-medium text-[--color-text]">
          <span>{t.total}</span>
          <span>{formatPrice(breakdown.total, lang)}</span>
        </div>
      </section>

      {checking && (
        <p className="mt-4 flex items-center gap-2 text-sm text-[--color-text]/60">
          <Loader2 className="size-4 animate-spin" /> {t.checking}
        </p>
      )}

      {!checking && conflict && (
        <Alert variant="destructive" className="mt-4 border-[--color-bordeaux]">
          <AlertDescription>
            {t.conflictText}{" "}
            <button type="button" onClick={onSlotUnavailable} className="underline">
              {t.pickAnother}
            </button>
            .
          </AlertDescription>
        </Alert>
      )}

      <section className="mt-6 grid gap-4">
        <div className="grid gap-1.5">
          <Label htmlFor="name">{t.nameLabel}</Label>
          <Input
            id="name"
            value={customer.name}
            onChange={(e) => onCustomerChange({ ...customer, name: e.target.value })}
            placeholder={t.namePlaceholder}
          />
        </div>
        <div className="grid gap-1.5">
          <Label htmlFor="email">{t.emailLabel}</Label>
          <Input
            id="email"
            type="email"
            value={customer.email}
            onChange={(e) => onCustomerChange({ ...customer, email: e.target.value })}
            placeholder={t.emailPlaceholder}
          />
        </div>
        <div className="grid gap-1.5">
          <Label htmlFor="phone">{t.phoneLabel}</Label>
          <Input
            id="phone"
            type="tel"
            value={customer.phone ?? ""}
            onChange={(e) => onCustomerChange({ ...customer, phone: e.target.value })}
            placeholder={t.phonePlaceholder}
          />
        </div>
        <div className="grid gap-1.5">
          <Label htmlFor="notes">{t.notesLabel}</Label>
          <Textarea
            id="notes"
            value={customer.notes ?? ""}
            onChange={(e) => onCustomerChange({ ...customer, notes: e.target.value })}
            placeholder={t.notesPlaceholder}
            rows={3}
          />
        </div>
      </section>

      {error && <p className="mt-4 text-sm text-[--color-bordeaux]">{error}</p>}

      <p className="mt-6 flex items-center gap-2 text-xs text-[--color-text]/50">
        <ShieldCheck className="size-3.5" /> {t.secure}
      </p>

      <div className="mt-4 flex items-center justify-between gap-4">
        <Button type="button" variant="ghost" size="lg" onClick={onBack} className="text-[--color-text]">
          {t.back}
        </Button>
        <Button
          type="button"
          size="lg"
          disabled={!canSubmit || submitting}
          onClick={handleSubmit}
          className="gap-1.5 rounded-[2px] bg-[--color-accent] px-8 text-[--color-cream] hover:bg-[color-mix(in_oklch,var(--color-accent),black_10%)]"
        >
          {submitting ? <Loader2 className="size-4 animate-spin" /> : t.pay(formatPrice(breakdown.total, lang))}
        </Button>
      </div>
    </div>
  );
}
