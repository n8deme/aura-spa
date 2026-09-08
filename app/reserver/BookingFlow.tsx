"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Check } from "lucide-react";
import { Wordmark } from "@/app/_components/Wordmark";
import { SPA_TIMEZONE, zonedTimeToUtc } from "@/lib/booking/timezone";
import { toDateKey } from "@/lib/booking/format";
import type { CustomerInfo, ExtraSelection, PackageType } from "@/lib/booking/types";
import { StepSlot } from "./steps/StepSlot";
import { StepFormule } from "./steps/StepFormule";
import { StepExtras } from "./steps/StepExtras";
import { StepRecap } from "./steps/StepRecap";

type Step = "slot" | "formule" | "extras" | "recap";

const STEP_LABELS: Record<Step, string> = {
  slot: "Créneau",
  formule: "Formule",
  extras: "Extras",
  recap: "Récapitulatif",
};

export function BookingFlow() {
  const [step, setStep] = useState<Step>("slot");
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [time, setTime] = useState<string | null>(null);
  const [packageType, setPackageType] = useState<PackageType>("base");
  const [extraHours, setExtraHours] = useState(0);
  const [extras, setExtras] = useState<ExtraSelection[]>([]);
  const [customer, setCustomer] = useState<CustomerInfo>({ name: "", email: "", phone: "" });

  const stepOrder: Step[] = useMemo(
    () => (packageType === "a_la_carte" ? ["slot", "formule", "extras", "recap"] : ["slot", "formule", "recap"]),
    [packageType]
  );

  const currentIndex = stepOrder.indexOf(step);

  function goNext() {
    const next = stepOrder[currentIndex + 1];
    if (next) setStep(next);
  }

  function goBack() {
    const prev = stepOrder[currentIndex - 1];
    if (prev) setStep(prev);
  }

  const startTimeIso = useMemo(() => {
    if (!date || !time) return null;
    return zonedTimeToUtc(toDateKey(date), time, SPA_TIMEZONE).toISOString();
  }, [date, time]);

  return (
    <div className="min-h-screen bg-[--color-cream]">
      <header className="flex items-center justify-between border-b border-[--color-border] px-6 py-5 md:px-12">
        <Link href="/">
          <Wordmark />
        </Link>
        <ol className="hidden items-center gap-2 text-xs text-[--color-text]/60 md:flex">
          {stepOrder.map((key, index) => (
            <li key={key} className="flex items-center gap-2">
              <span
                className={`flex size-5 items-center justify-center rounded-full text-[10px] ${
                  index < currentIndex
                    ? "bg-[--color-accent] text-[--color-cream]"
                    : index === currentIndex
                      ? "border border-[--color-accent] text-[--color-accent]"
                      : "border border-[--color-border] text-[--color-text]/40"
                }`}
              >
                {index < currentIndex ? <Check className="size-3" /> : index + 1}
              </span>
              <span className={index === currentIndex ? "text-[--color-text]" : ""}>{STEP_LABELS[key]}</span>
              {index < stepOrder.length - 1 && <span className="mx-1 text-[--color-border]">—</span>}
            </li>
          ))}
        </ol>
      </header>

      <main className="mx-auto max-w-3xl px-6 py-16 md:py-24">
        {step === "slot" && (
          <StepSlot date={date} time={time} onChange={(d, t) => { setDate(d); setTime(t); }} onNext={goNext} />
        )}

        {step === "formule" && (
          <StepFormule value={packageType} onChange={setPackageType} onNext={goNext} onBack={goBack} />
        )}

        {step === "extras" && packageType === "a_la_carte" && (
          <StepExtras
            extraHours={extraHours}
            onExtraHoursChange={setExtraHours}
            extras={extras}
            onExtrasChange={setExtras}
            onNext={goNext}
            onBack={goBack}
          />
        )}

        {step === "recap" && startTimeIso && (
          <StepRecap
            startTime={startTimeIso}
            packageType={packageType}
            extraHours={packageType === "a_la_carte" ? extraHours : 0}
            extras={packageType === "a_la_carte" ? extras : []}
            customer={customer}
            onCustomerChange={setCustomer}
            onBack={goBack}
            onSlotUnavailable={() => setStep("slot")}
          />
        )}
      </main>
    </div>
  );
}
