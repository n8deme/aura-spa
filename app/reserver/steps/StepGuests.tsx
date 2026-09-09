"use client";

import { Minus, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ALL_IN_PACKAGE, MAX_CAPACITY, MIN_CAPACITY } from "@/lib/booking/pricing-config";
import { StepNav } from "./StepNav";

export function StepGuests({
  value,
  onChange,
  onNext,
  onBack,
}: {
  value: number;
  onChange: (value: number) => void;
  onNext: () => void;
  onBack: () => void;
}) {
  return (
    <div>
      <h1 className="font-heading text-3xl italic text-[--color-text] md:text-4xl">Combien serez-vous ?</h1>
      <p className="mt-2 text-sm text-[--color-text]/70">
        L&apos;espace privatif accueille de {MIN_CAPACITY} à {MAX_CAPACITY} personnes.
      </p>

      <div className="mt-8 flex items-center justify-center gap-6 rounded-[4px] border border-[--color-border] bg-[--card] p-10">
        <Button
          type="button"
          variant="outline"
          size="icon"
          disabled={value <= MIN_CAPACITY}
          onClick={() => onChange(value - 1)}
        >
          <Minus className="size-4" />
        </Button>
        <span className="w-20 text-center font-heading text-4xl text-[--color-text]">{value}</span>
        <Button
          type="button"
          variant="outline"
          size="icon"
          disabled={value >= MAX_CAPACITY}
          onClick={() => onChange(value + 1)}
        >
          <Plus className="size-4" />
        </Button>
      </div>

      {value > ALL_IN_PACKAGE.maxGuests && (
        <p className="mt-3 text-center text-xs text-[--color-text]/50">
          Le forfait All-in est réservé aux groupes de {ALL_IN_PACKAGE.maxGuests} personnes.
        </p>
      )}

      <StepNav onBack={onBack} onNext={onNext} />
    </div>
  );
}
