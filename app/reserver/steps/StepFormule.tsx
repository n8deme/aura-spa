"use client";

import { Check } from "lucide-react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Badge } from "@/components/ui/badge";
import type { Lang } from "@/app/_lib/content";
import { BOOKING_UI } from "@/lib/booking/i18n";
import { ALL_IN_PACKAGE, BASE_PACKAGE } from "@/lib/booking/pricing-config";
import { formatPrice, isPriced } from "@/lib/booking/format";
import type { PackageType } from "@/lib/booking/types";
import { StepNav } from "./StepNav";

function getOptions(
  lang: Lang,
  guestCount: number
): {
  value: PackageType;
  title: string;
  description: string;
  price: string;
  disabled: boolean;
}[] {
  const t = BOOKING_UI[lang].formule;
  const options = [
    {
      value: "base" as const,
      title: t.baseTitle(BASE_PACKAGE.durationHours),
      description: t.baseDescription,
      price: formatPrice(BASE_PACKAGE.price, lang),
      disabled: !isPriced(BASE_PACKAGE.price),
    },
    {
      value: "all_in" as const,
      title: t.allInTitle(ALL_IN_PACKAGE.durationHours),
      description: t.allInDescription(ALL_IN_PACKAGE.maxGuests),
      price: formatPrice(ALL_IN_PACKAGE.price, lang),
      disabled: !isPriced(ALL_IN_PACKAGE.price),
    },
    {
      value: "a_la_carte" as const,
      title: t.alaCarteTitle,
      description: t.alaCarteDescription,
      price: t.fromPrice(formatPrice(BASE_PACKAGE.price, lang)),
      disabled: false,
    },
  ];

  // L'All-in disparaît des choix proposés au-delà de sa capacité max.
  return options.filter((option) => option.value !== "all_in" || guestCount <= ALL_IN_PACKAGE.maxGuests);
}

export function StepFormule({
  lang,
  value,
  guestCount,
  onChange,
  onNext,
  onBack,
}: {
  lang: Lang;
  value: PackageType;
  guestCount: number;
  onChange: (value: PackageType) => void;
  onNext: () => void;
  onBack: () => void;
}) {
  const t = BOOKING_UI[lang].formule;
  const options = getOptions(lang, guestCount);

  return (
    <div>
      <h1 className="font-heading text-3xl italic text-[--color-text] md:text-4xl">{t.title}</h1>
      <p className="mt-2 text-sm text-[--color-text]/70">{t.subtitle}</p>

      <RadioGroup
        value={value}
        onValueChange={(next) => onChange(next as PackageType)}
        className="mt-8 grid gap-4"
      >
        {options.map((option) => (
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
                  <Check className="size-3.5" /> {t.selected}
                </span>
              )}
            </div>
          </label>
        ))}
      </RadioGroup>

      <StepNav lang={lang} onBack={onBack} onNext={onNext} />
    </div>
  );
}
