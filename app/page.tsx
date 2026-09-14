import type { Lang } from "./_lib/content";
import { AuraSpaApp } from "./_components/AuraSpaApp";
import type { Metadata } from "next";
import { alternatesFor } from "@/lib/seo/alternates";

export const metadata: Metadata = {
  alternates: alternatesFor("/"),
};

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ lang?: string }>;
}) {
  const { lang: rawLang } = await searchParams;
  const initialLang: Lang = rawLang === "nl" ? "nl" : "fr";
  return <AuraSpaApp initialLang={initialLang} />;
}
