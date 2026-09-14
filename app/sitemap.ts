import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://aura-spa.be";
  return [
    { url: base, lastModified: new Date(), changeFrequency: "weekly", priority: 1 },
    // La page de réservation manquait, alors que c'est celle qui porte
    // l'intention d'achat.
    { url: `${base}/reserver`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.9 },
    { url: `${base}/mentions-legales`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.3 },
    { url: `${base}/rgpd`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.3 },
    { url: `${base}/cgv`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.3 },
  ];
}
