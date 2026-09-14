import type { Metadata } from "next";
import type { Lang } from "@/app/_lib/content";
import { LegalLayout, LegalSection } from "@/app/_components/LegalLayout";
import { CGV_I18N } from "@/lib/legal/i18n";

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<{ lang?: string }>;
}): Promise<Metadata> {
  const { lang: rawLang } = await searchParams;
  const lang: Lang = rawLang === "nl" ? "nl" : "fr";
  return { title: CGV_I18N[lang].pageTitle };
}

export default async function CGV({
  searchParams,
}: {
  searchParams: Promise<{ lang?: string }>;
}) {
  const { lang: rawLang } = await searchParams;
  const lang: Lang = rawLang === "nl" ? "nl" : "fr";
  const t = CGV_I18N[lang];

  return (
    <LegalLayout lang={lang} title={t.heading}>
      <LegalSection title={t.objectTitle}>
        <p>{t.objectText}</p>
        {/* TODO: Compléter avec les CGV complètes (politique d'annulation, conditions d'accès, responsabilités, etc.) */}
      </LegalSection>

      <LegalSection title={t.pricingTitle}>
        <p>{t.pricingText}</p>
      </LegalSection>

      <LegalSection title={t.cancellationTitle}>
        <p>{t.cancellationText}</p>
      </LegalSection>
    </LegalLayout>
  );
}
