import type { Metadata } from "next";

/**
 * Construit le canonical et les hreflang d'UNE page.
 *
 * À déclarer page par page : posé dans le layout racine, Next le fait hériter,
 * et chaque page annonce alors la page d'accueil comme sa version canonique —
 * ce qui revient à demander à Google de ne pas l'indexer.
 */
export function alternatesFor(path: string): Metadata["alternates"] {
  return {
    canonical: path,
    languages: {
      "fr-BE": path,
      "nl-BE": `${path}?lang=nl`,
    },
  };
}
