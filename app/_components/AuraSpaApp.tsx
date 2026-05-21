"use client";

import { useState } from "react";
import type { Lang } from "../_lib/content";
import { Nav } from "./Nav";
import { Hero } from "./Hero";
import { SectionExperience } from "./SectionExperience";
import { SectionHowItWorks } from "./SectionHowItWorks";
import { SectionLieu } from "./SectionLieu";
import { SectionBooking } from "./SectionBooking";
import { SectionTestimonials } from "./SectionTestimonials";
import { Footer } from "./Footer";

export function AuraSpaApp() {
  const [lang, setLang] = useState<Lang>("fr");

  return (
    <>
      <Nav lang={lang} onLangChange={setLang} />
      <main>
        <Hero lang={lang} />
        <SectionExperience lang={lang} />
        <SectionHowItWorks lang={lang} />
        <SectionLieu lang={lang} />
        <SectionBooking lang={lang} />
        <SectionTestimonials lang={lang} />
      </main>
      <Footer lang={lang} />
    </>
  );
}
