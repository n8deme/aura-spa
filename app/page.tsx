import type { Lang } from "./_lib/content";
import { AuraSpaApp } from "./_components/AuraSpaApp";

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ lang?: string }>;
}) {
  const { lang: rawLang } = await searchParams;
  const initialLang: Lang = rawLang === "nl" ? "nl" : "fr";
  return <AuraSpaApp initialLang={initialLang} />;
}
