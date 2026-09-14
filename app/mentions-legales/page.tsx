import type { Metadata } from "next";
import type { Lang } from "@/app/_lib/content";
import { LegalLayout, LegalSection } from "@/app/_components/LegalLayout";
import { MENTIONS_LEGALES_I18N } from "@/lib/legal/i18n";

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<{ lang?: string }>;
}): Promise<Metadata> {
  const { lang: rawLang } = await searchParams;
  const lang: Lang = rawLang === "nl" ? "nl" : "fr";
  return { title: MENTIONS_LEGALES_I18N[lang].pageTitle };
}

export default async function MentionsLegales({
  searchParams,
}: {
  searchParams: Promise<{ lang?: string }>;
}) {
  const { lang: rawLang } = await searchParams;
  const lang: Lang = rawLang === "nl" ? "nl" : "fr";
  const t = MENTIONS_LEGALES_I18N[lang];

  return (
    <LegalLayout lang={lang} title={t.heading}>
      <LegalSection title={t.editorTitle}>
        <p>
          {t.editorLines.map((line, index) => (
            <span key={index}>
              {index === 0 ? <strong>{line}</strong> : line}
              {index < t.editorLines.length - 1 && <br />}
            </span>
          ))}
        </p>
        {/* TODO: Compléter avec les informations légales de la société (numéro BCE, forme juridique, adresse complète) */}
      </LegalSection>

      <LegalSection title={t.hostingTitle}>
        <p>{t.hostingText}</p>
      </LegalSection>

      <LegalSection title={t.ipTitle}>
        <p>{t.ipText}</p>
      </LegalSection>
    </LegalLayout>
  );
}
