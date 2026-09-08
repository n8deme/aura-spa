"use client";

import { ArrowLeft, ArrowRight, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export function StepNav({
  onBack,
  onNext,
  nextLabel = "Continuer",
  nextDisabled = false,
  nextLoading = false,
}: {
  onBack?: () => void;
  onNext: () => void;
  nextLabel?: string;
  nextDisabled?: boolean;
  nextLoading?: boolean;
}) {
  return (
    <div className="mt-8 flex items-center justify-between gap-4">
      {onBack ? (
        <Button type="button" variant="ghost" size="lg" onClick={onBack} className="gap-1.5 text-[--color-text]">
          <ArrowLeft className="size-4" />
          Retour
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
        {nextLoading ? <Loader2 className="size-4 animate-spin" /> : nextLabel}
        {!nextLoading && <ArrowRight className="size-4" />}
      </Button>
    </div>
  );
}
