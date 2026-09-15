"use client";

import { Minus, Plus, Users } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import type { Lang } from "@/app/_lib/content";
import { BOOKING_UI } from "@/lib/booking/i18n";
import { MASSAGE } from "@/lib/booking/pricing-config";
import { formatPrice } from "@/lib/booking/format";
import { StepNav } from "./StepNav";

export function StepMassage({
  lang,
  startTime,
  guestCount,
  included,
  massageGuestCount,
  onIncludedChange,
  onMassageGuestCountChange,
  onNext,
  onBack,
}: {
  lang: Lang;
  startTime: string;
  guestCount: number;
  included: boolean;
  massageGuestCount: number;
  onIncludedChange: (value: boolean) => void;
  onMassageGuestCountChange: (value: number) => void;
  onNext: () => void;
  onBack: () => void;
}) {
  const t = BOOKING_UI[lang].massage;
  const eligible =
    new Date(startTime).getTime() - Date.now() >= MASSAGE.minAdvanceDays * 24 * 60 * 60 * 1000;
  const maxGuests = Math.min(MASSAGE.maxGuests, guestCount);
  const canOffer = eligible && maxGuests >= MASSAGE.minGuests;

  return (
    <div>
      <h1 className="font-heading text-3xl italic text-[--color-text] md:text-4xl">{t.title}</h1>
      <p className="mt-2 text-sm text-[--color-text]/70">{t.subtitle}</p>

      {!canOffer && (
        <section className="mt-8 rounded-[4px] border border-[--color-border] bg-[--card] p-5 text-sm text-[--color-text]/70">
          {t.notEligible}
        </section>
      )}

      {canOffer && (
        <section className="mt-8 rounded-[4px] border border-[--color-border] bg-[--card] p-5">
          <label className="flex cursor-pointer items-start gap-3">
            <Checkbox checked={included} onCheckedChange={(next) => onIncludedChange(next === true)} />
            <span>
              <span className="block text-sm text-[--color-text]">{t.addLabel}</span>
              <span className="mt-1 block text-xs text-[--color-text]/60">{t.description}</span>
              <span className="mt-1 block text-xs text-[--color-text]/50">{t.rangeHint(MASSAGE.minGuests, MASSAGE.maxGuests)}</span>
            </span>
          </label>

          {included && (
            <div className="mt-4 flex flex-wrap items-center gap-4">
              <Users className="size-4 text-[--color-text]/60" />
              <div className="flex items-center gap-3">
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  disabled={massageGuestCount <= MASSAGE.minGuests}
                  onClick={() => onMassageGuestCountChange(Math.max(MASSAGE.minGuests, massageGuestCount - 1))}
                >
                  <Minus className="size-4" />
                </Button>
                <span className="w-28 text-center text-sm text-[--color-text]">
                  {t.guestsLabel(massageGuestCount)}
                </span>
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  disabled={massageGuestCount >= maxGuests}
                  onClick={() => onMassageGuestCountChange(Math.min(maxGuests, massageGuestCount + 1))}
                >
                  <Plus className="size-4" />
                </Button>
              </div>
              <span className="ml-auto text-sm font-medium text-[--color-text]">
                {formatPrice(MASSAGE.pricePerPerson * massageGuestCount, lang)}
              </span>
            </div>
          )}
        </section>
      )}

      <StepNav lang={lang} onBack={onBack} onNext={onNext} />
    </div>
  );
}
