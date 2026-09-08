"use client";

import { Minus, Plus } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { BASE_PACKAGE, BOOKING_RULES, EXTRAS_CATALOG, EXTRA_HOUR_PRICE } from "@/lib/booking/pricing-config";
import { computePrice } from "@/lib/booking/pricing";
import { formatPrice, isPriced } from "@/lib/booking/format";
import type { ExtraId, ExtraSelection } from "@/lib/booking/types";
import { StepNav } from "./StepNav";

const MAX_EXTRA_HOURS = BOOKING_RULES.maxHours - BASE_PACKAGE.durationHours;

export function StepExtras({
  extraHours,
  onExtraHoursChange,
  extras,
  onExtrasChange,
  onNext,
  onBack,
}: {
  extraHours: number;
  onExtraHoursChange: (value: number) => void;
  extras: ExtraSelection[];
  onExtrasChange: (value: ExtraSelection[]) => void;
  onNext: () => void;
  onBack: () => void;
}) {
  const extraHoursPriced = isPriced(EXTRA_HOUR_PRICE);
  const selectedQuantity = (id: ExtraId) => extras.find((e) => e.extraId === id)?.quantity ?? 0;

  function toggleExtra(id: ExtraId, checked: boolean) {
    if (checked) onExtrasChange([...extras, { extraId: id, quantity: 1 }]);
    else onExtrasChange(extras.filter((e) => e.extraId !== id));
  }

  function setQuantity(id: ExtraId, quantity: number) {
    onExtrasChange(extras.map((e) => (e.extraId === id ? { ...e, quantity } : e)));
  }

  const breakdown = computePrice({ packageType: "a_la_carte", extraHours, extras });

  return (
    <div>
      <h1 className="font-heading text-3xl italic text-[--color-text] md:text-4xl">
        Personnalisez votre moment
      </h1>
      <p className="mt-2 text-sm text-[--color-text]/70">
        Ajoutez des heures et des extras. Vous pourrez toujours en ajouter sur place.
      </p>

      <section className="mt-8 rounded-[4px] border border-[--color-border] bg-[--card] p-5">
        <h2 className="font-heading text-lg text-[--color-text]">Heures supplémentaires</h2>
        {!extraHoursPriced && (
          <Badge variant="outline" className="mt-2 border-[--color-border] text-[--color-text]/60">
            Tarif bientôt disponible
          </Badge>
        )}
        <div className="mt-3 flex items-center gap-4">
          <Button
            type="button"
            variant="outline"
            size="icon"
            disabled={!extraHoursPriced || extraHours <= 0}
            onClick={() => onExtraHoursChange(Math.max(0, extraHours - 1))}
          >
            <Minus className="size-4" />
          </Button>
          <span className="w-24 text-center text-sm text-[--color-text]">
            {BASE_PACKAGE.durationHours + extraHours}h au total
          </span>
          <Button
            type="button"
            variant="outline"
            size="icon"
            disabled={!extraHoursPriced || extraHours >= MAX_EXTRA_HOURS}
            onClick={() => onExtraHoursChange(Math.min(MAX_EXTRA_HOURS, extraHours + 1))}
          >
            <Plus className="size-4" />
          </Button>
        </div>
      </section>

      <section className="mt-6 rounded-[4px] border border-[--color-border] bg-[--card] p-5">
        <h2 className="font-heading text-lg text-[--color-text]">Extras</h2>
        <div className="mt-3 divide-y divide-[--color-border]">
          {EXTRAS_CATALOG.map((extra) => {
            const priced = isPriced(extra.price);
            const quantity = selectedQuantity(extra.id);
            const checked = quantity > 0;
            return (
              <div key={extra.id} className="flex items-center justify-between gap-4 py-3">
                <label className={`flex items-center gap-3 ${priced ? "cursor-pointer" : "cursor-not-allowed opacity-50"}`}>
                  <Checkbox
                    checked={checked}
                    disabled={!priced}
                    onCheckedChange={(next) => toggleExtra(extra.id, next === true)}
                  />
                  <span className="text-sm text-[--color-text]">{extra.label}</span>
                </label>
                <div className="flex items-center gap-3">
                  <span className="text-sm text-[--color-text]/70">{formatPrice(extra.price)}</span>
                  {checked && priced && (
                    <div className="flex items-center gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        size="icon-sm"
                        onClick={() => setQuantity(extra.id, Math.max(1, quantity - 1))}
                      >
                        <Minus className="size-3.5" />
                      </Button>
                      <span className="w-4 text-center text-sm">{quantity}</span>
                      <Button
                        type="button"
                        variant="outline"
                        size="icon-sm"
                        onClick={() => setQuantity(extra.id, Math.min(10, quantity + 1))}
                      >
                        <Plus className="size-3.5" />
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <section className="mt-6 rounded-[4px] border border-[--color-border] bg-[--color-cream-warm] p-5">
        {breakdown.lineItems.map((item, index) => (
          <div key={index} className="flex justify-between py-1 text-sm text-[--color-text]">
            <span>{item.label}</span>
            <span>{formatPrice(item.amount)}</span>
          </div>
        ))}
        <Separator className="my-3 bg-[--color-border]" />
        <div className="flex justify-between text-base font-medium text-[--color-text]">
          <span>Total</span>
          <span>{formatPrice(breakdown.total)}</span>
        </div>
      </section>

      <StepNav onBack={onBack} onNext={onNext} />
    </div>
  );
}
