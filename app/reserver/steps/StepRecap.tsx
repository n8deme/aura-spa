"use client";

import { useEffect, useState } from "react";
import { Loader2, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { computePrice } from "@/lib/booking/pricing";
import { formatDateLong, formatPrice, formatTime } from "@/lib/booking/format";
import type { CustomerInfo, ExtraSelection, PackageType } from "@/lib/booking/types";
import { StepNav } from "./StepNav";

type Slot = { time: string; startTime: string; available: boolean };

export function StepRecap({
  startTime,
  packageType,
  extraHours,
  extras,
  customer,
  onCustomerChange,
  onBack,
  onSlotUnavailable,
}: {
  startTime: string;
  packageType: PackageType;
  extraHours: number;
  extras: ExtraSelection[];
  customer: CustomerInfo;
  onCustomerChange: (customer: CustomerInfo) => void;
  onBack: () => void;
  onSlotUnavailable: () => void;
}) {
  const [checking, setChecking] = useState(true);
  const [conflict, setConflict] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const breakdown = computePrice({ packageType, extraHours, extras });
  const start = new Date(startTime);

  useEffect(() => {
    const dateKey = startTime.slice(0, 10);
    const controller = new AbortController();
    setChecking(true);
    fetch(
      `/api/booking/slots?date=${dateKey}&packageType=${packageType}${
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
        body: JSON.stringify({ startTime, packageType, extraHours, extras, customer }),
      });
      const data = await res.json();
      if (!res.ok) {
        if (res.status === 409) {
          setConflict(true);
          setError(data.error ?? "Ce créneau n'est plus disponible.");
        } else {
          setError(data.error ?? "Une erreur est survenue.");
        }
        return;
      }
      window.location.href = data.checkoutUrl;
    } catch {
      setError("Une erreur est survenue. Veuillez réessayer.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div>
      <h1 className="font-heading text-3xl italic text-[--color-text] md:text-4xl">
        Récapitulatif &amp; paiement
      </h1>

      <section className="mt-8 rounded-[4px] border border-[--color-border] bg-[--card] p-5">
        <p className="text-sm text-[--color-text]/70">Créneau</p>
        <p className="mt-1 font-heading text-lg text-[--color-text]">
          {formatDateLong(start)} à {formatTime(start)}
        </p>

        <Separator className="my-4 bg-[--color-border]" />

        {breakdown.lineItems.map((item, index) => (
          <div key={index} className="flex justify-between py-1 text-sm text-[--color-text]">
            <span>{item.label}</span>
            <span>{formatPrice(item.amount)}</span>
          </div>
        ))}
        <Separator className="my-3 bg-[--color-border]" />
        <div className="flex justify-between text-lg font-medium text-[--color-text]">
          <span>Total</span>
          <span>{formatPrice(breakdown.total)}</span>
        </div>
      </section>

      {checking && (
        <p className="mt-4 flex items-center gap-2 text-sm text-[--color-text]/60">
          <Loader2 className="size-4 animate-spin" /> Vérification du créneau…
        </p>
      )}

      {!checking && conflict && (
        <Alert variant="destructive" className="mt-4 border-[--color-bordeaux]">
          <AlertDescription>
            Ce créneau vient d&apos;être réservé par quelqu&apos;un d&apos;autre.{" "}
            <button type="button" onClick={onSlotUnavailable} className="underline">
              Choisir un autre créneau
            </button>
            .
          </AlertDescription>
        </Alert>
      )}

      <section className="mt-6 grid gap-4">
        <div className="grid gap-1.5">
          <Label htmlFor="name">Nom complet</Label>
          <Input
            id="name"
            value={customer.name}
            onChange={(e) => onCustomerChange({ ...customer, name: e.target.value })}
            placeholder="Jeanne Dupont"
          />
        </div>
        <div className="grid gap-1.5">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            value={customer.email}
            onChange={(e) => onCustomerChange({ ...customer, email: e.target.value })}
            placeholder="jeanne@example.com"
          />
        </div>
        <div className="grid gap-1.5">
          <Label htmlFor="phone">Téléphone (optionnel)</Label>
          <Input
            id="phone"
            type="tel"
            value={customer.phone ?? ""}
            onChange={(e) => onCustomerChange({ ...customer, phone: e.target.value })}
            placeholder="+32 4xx xx xx xx"
          />
        </div>
      </section>

      {error && <p className="mt-4 text-sm text-[--color-bordeaux]">{error}</p>}

      <p className="mt-6 flex items-center gap-2 text-xs text-[--color-text]/50">
        <ShieldCheck className="size-3.5" /> Paiement sécurisé via Stripe. Carte, Bancontact, Apple Pay.
      </p>

      <div className="mt-4 flex items-center justify-between gap-4">
        <Button type="button" variant="ghost" size="lg" onClick={onBack} className="text-[--color-text]">
          Retour
        </Button>
        <Button
          type="button"
          size="lg"
          disabled={!canSubmit || submitting}
          onClick={handleSubmit}
          className="gap-1.5 rounded-[2px] bg-[--color-accent] px-8 text-[--color-cream] hover:bg-[color-mix(in_oklch,var(--color-accent),black_10%)]"
        >
          {submitting ? <Loader2 className="size-4 animate-spin" /> : `Payer ${formatPrice(breakdown.total)}`}
        </Button>
      </div>
    </div>
  );
}
