"use client";

import { Check } from "lucide-react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Badge } from "@/components/ui/badge";
import { ALL_IN_PACKAGE, BASE_PACKAGE } from "@/lib/booking/pricing-config";
import { formatPrice, isPriced } from "@/lib/booking/format";
import type { PackageType } from "@/lib/booking/types";
import { StepNav } from "./StepNav";

const OPTIONS: {
  value: PackageType;
  title: string;
  description: string;
  price: string;
  disabled: boolean;
}[] = [
  {
    value: "base",
    title: `Forfait de base — ${BASE_PACKAGE.durationHours}h`,
    description: "L'essentiel : votre espace privatif, sans extra.",
    price: formatPrice(BASE_PACKAGE.price),
    disabled: !isPriced(BASE_PACKAGE.price),
  },
  {
    value: "all_in",
    title: `All-in — ${ALL_IN_PACKAGE.durationHours}h`,
    description: "2h + plateau de fromage, charcuterie et champagne inclus.",
    price: formatPrice(ALL_IN_PACKAGE.price),
    disabled: !isPriced(ALL_IN_PACKAGE.price),
  },
  {
    value: "a_la_carte",
    title: "À la carte",
    description: "Prolongez au-delà de 2h et choisissez librement vos extras.",
    price: `À partir de ${formatPrice(BASE_PACKAGE.price)}`,
    disabled: false,
  },
];

export function StepFormule({
  value,
  onChange,
  onNext,
  onBack,
}: {
  value: PackageType;
  onChange: (value: PackageType) => void;
  onNext: () => void;
  onBack: () => void;
}) {
  return (
    <div>
      <h1 className="font-heading text-3xl italic text-[--color-text] md:text-4xl">
        Choisissez votre formule
      </h1>
      <p className="mt-2 text-sm text-[--color-text]/70">Votre créneau est réservé le temps de finaliser.</p>

      <RadioGroup
        value={value}
        onValueChange={(next) => onChange(next as PackageType)}
        className="mt-8 grid gap-4"
      >
        {OPTIONS.map((option) => (
          <label
            key={option.value}
            className={`flex cursor-pointer items-start gap-4 rounded-[4px] border p-5 transition-colors ${
              value === option.value
                ? "border-[--color-accent] bg-[--color-cream-warm]"
                : "border-[--color-border] bg-[--card]"
            } ${option.disabled ? "cursor-not-allowed opacity-50" : ""}`}
          >
            <RadioGroupItem value={option.value} disabled={option.disabled} className="mt-1" />
            <div className="flex-1">
              <div className="flex items-center justify-between gap-3">
                <span className="font-heading text-lg text-[--color-text]">{option.title}</span>
                {option.disabled ? (
                  <Badge variant="outline" className="border-[--color-border] text-[--color-text]/60">
                    {option.price}
                  </Badge>
                ) : (
                  <span className="text-sm font-medium text-[--color-accent]">{option.price}</span>
                )}
              </div>
              <p className="mt-1 text-sm text-[--color-text]/70">{option.description}</p>
              {value === option.value && !option.disabled && (
                <span className="mt-2 inline-flex items-center gap-1 text-xs text-[--color-accent]">
                  <Check className="size-3.5" /> Sélectionné
                </span>
              )}
            </div>
          </label>
        ))}
      </RadioGroup>

      <StepNav onBack={onBack} onNext={onNext} />
    </div>
  );
}
