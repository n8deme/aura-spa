"use client";

import { ArrowLeft, ArrowRight, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Lang } from "@/app/_lib/content";
import { BOOKING_UI } from "@/lib/booking/i18n";

export function StepNav({
  lang = "fr",
  onBack,
  onNext,
  nextLabel,
  nextDisabled = false,
  nextLoading = false,
}: {
  lang?: Lang;
  onBack?: () => void;
  onNext: () => void;
  nextLabel?: string;
  nextDisabled?: boolean;
  nextLoading?: boolean;
}) {
  const t = BOOKING_UI[lang].nav;

  return (
    <div className="mt-8 flex items-center justify-between gap-4">
      {onBack ? (
        <Button type="button" variant="ghost" size="lg" onClick={onBack} className="gap-1.5 text-[--color-text]">
          <ArrowLeft className="size-4" />
          {t.back}
        </Button>
      ) : (
        <span />
      )}
      <Button
        type="button"
        size="lg"
        onClick={onNext}
        disabled={nextDisabled || nextLoading}
        className="gap-1.5 rounded-[2px] bg-[--color-accent] px-8 text-[--color-cream] hover:bg-[color-mix(in_oklch,var(--color-accent),black_10%)]"
      >
        {nextLoading ? <Loader2 className="size-4 animate-spin" /> : (nextLabel ?? t.next)}
        {!nextLoading && <ArrowRight className="size-4" />}
      </Button>
    </div>
  );
}
