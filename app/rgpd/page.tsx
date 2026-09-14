import type { Metadata } from "next";
import type { Lang } from "@/app/_lib/content";
import { LegalLayout, LegalSection } from "@/app/_components/LegalLayout";
import { RGPD_I18N } from "@/lib/legal/i18n";

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<{ lang?: string }>;
}): Promise<Metadata> {
  const { lang: rawLang } = await searchParams;
  const lang: Lang = rawLang === "nl" ? "nl" : "fr";
  return { title: RGPD_I18N[lang].pageTitle };
}

export default async function RGPD({
  searchParams,
}: {
  searchParams: Promise<{ lang?: string }>;
}) {
  const { lang: rawLang } = await searchParams;
  const lang: Lang = rawLang === "nl" ? "nl" : "fr";
  const t = RGPD_I18N[lang];

  return (
    <LegalLayout lang={lang} title={t.heading}>
      <LegalSection title={t.dataTitle}>
        <p>{t.dataText}</p>
        {/* TODO: Compléter avec la politique complète de confidentialité */}
      </LegalSection>

      <LegalSection title={t.rightsTitle}>
        <p>{t.rightsText}</p>
        <p style={{ marginTop: "1rem" }}>
          {t.contactText}{" "}
          <a href="mailto:Kamanrobert@icloud.com" style={{ color: "#C4956A", textDecoration: "none" }}>
            Kamanrobert@icloud.com
          </a>
        </p>
      </LegalSection>
    </LegalLayout>
  );
}
