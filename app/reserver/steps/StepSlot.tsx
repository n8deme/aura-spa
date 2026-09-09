"use client";

import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import type { Lang } from "@/app/_lib/content";
import { BOOKING_UI } from "@/lib/booking/i18n";
import { formatDateLong, toDateKey } from "@/lib/booking/format";
import { StepNav } from "./StepNav";

type Slot = { time: string; startTime: string; available: boolean };

export function StepSlot({
  lang,
  date,
  time,
  onChange,
  onNext,
}: {
  lang: Lang;
  date: Date | undefined;
  time: string | null;
  onChange: (date: Date | undefined, time: string | null) => void;
  onNext: () => void;
}) {
  const t = BOOKING_UI[lang].slot;
  const [slots, setSlots] = useState<Slot[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!date) {
      setSlots([]);
      return;
    }
    const controller = new AbortController();
    setLoading(true);
    setError(null);
    fetch(`/api/booking/slots?date=${toDateKey(date)}&packageType=base&lang=${lang}`, {
      signal: controller.signal,
    })
      .then((res) => {
        if (!res.ok) throw new Error();
        return res.json();
      })
      .then((data: { slots: Slot[] }) => setSlots(data.slots))
      .catch(() => {
        if (!controller.signal.aborted) setError(t.loadError);
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });
    return () => controller.abort();
  }, [date, lang, t.loadError]);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return (
    <div>
      <h1 className="font-heading text-3xl italic text-[--color-text] md:text-4xl">{t.title}</h1>
      <p className="mt-2 text-sm text-[--color-text]/70">{t.subtitle}</p>

      <div className="mt-8 grid gap-8 md:grid-cols-[auto_1fr]">
        <Calendar
          mode="single"
          selected={date}
          onSelect={(value) => onChange(value, null)}
          disabled={{ before: today }}
          className="rounded-[4px] border border-[--color-border] bg-[--card] p-3"
        />

        <div>
          {!date && <p className="text-sm text-[--color-text]/60">{t.chooseDateFirst}</p>}

          {date && (
            <>
              <p className="mb-3 text-sm font-medium text-[--color-text]">{formatDateLong(date, lang)}</p>

              {loading && (
                <div className="flex items-center gap-2 text-sm text-[--color-text]/60">
                  <Loader2 className="size-4 animate-spin" />
                  {t.loading}
                </div>
              )}

              {error && <p className="text-sm text-[--color-bordeaux]">{error}</p>}

              {!loading && !error && slots.length === 0 && (
                <p className="text-sm text-[--color-text]/60">{t.noSlots}</p>
              )}

              {!loading && !error && slots.length > 0 && (
                <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
                  {slots.map((slot) => (
                    <Button
                      key={slot.time}
                      type="button"
                      variant={time === slot.time ? "default" : "outline"}
                      disabled={!slot.available}
                      onClick={() => onChange(date, slot.time)}
                      className={
                        time === slot.time
                          ? "rounded-[2px] bg-[--color-accent] text-[--color-cream] hover:bg-[--color-accent]"
                          : "rounded-[2px] border-[--color-border]"
                      }
                    >
                      {slot.time}
                    </Button>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>

      <StepNav lang={lang} onNext={onNext} nextDisabled={!date || !time} />
    </div>
  );
}
