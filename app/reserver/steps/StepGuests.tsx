"use client";

import { Minus, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Lang } from "@/app/_lib/content";
import { BOOKING_UI } from "@/lib/booking/i18n";
import { ALL_IN_PACKAGE, MAX_CAPACITY, MIN_CAPACITY } from "@/lib/booking/pricing-config";
import { StepNav } from "./StepNav";

export function StepGuests({
  lang,
  value,
  onChange,
  onNext,
  onBack,
}: {
  lang: Lang;
  value: number;
  onChange: (value: number) => void;
  onNext: () => void;
  onBack: () => void;
}) {
  const t = BOOKING_UI[lang].guests;

  return (
    <div>
      <h1 className="font-heading text-3xl italic text-[--color-text] md:text-4xl">{t.title}</h1>
      <p className="mt-2 text-sm text-[--color-text]/70">{t.subtitle(MIN_CAPACITY, MAX_CAPACITY)}</p>

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
        <p className="mt-3 text-center text-xs text-[--color-text]/50">{t.allInLimit(ALL_IN_PACKAGE.maxGuests)}</p>
      )}

      <StepNav lang={lang} onBack={onBack} onNext={onNext} />
    </div>
  );
}
