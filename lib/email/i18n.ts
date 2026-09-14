import type { Lang } from "@/app/_lib/content";

// Textes de l'email de confirmation. Séparés de lib/booking/i18n.ts, qui est
// importé côté client : ceux-ci ne servent qu'au serveur et n'ont rien à faire
// dans le bundle du navigateur.
export const EMAIL_I18N: Record<
  Lang,
  {
    subject: string;
    heading: string;
    greeting: (name: string) => string;
    intro: string;
    dateLabel: string;
    timeLabel: string;
    packageLabel: string;
    totalLabel: string;
    signoff: string;
    team: string;
    practicalTitle: string;
    cancellation: (hours: number) => string;
    questionsLabel: string;
    siteLabel: string;
  }
> = {
  fr: {
    subject: "Votre réservation Aura Spa est confirmée",
    heading: "Réservation confirmée",
    greeting: (name) => `Bonjour ${name},`,
    intro: "Votre réservation est confirmée. Voici le récapitulatif :",
    dateLabel: "Date",
    timeLabel: "Heure",
    packageLabel: "Formule",
    totalLabel: "Total payé",
    signoff: "À très vite,",
    team: "L'équipe Aura Spa",
    practicalTitle: "Bon à savoir",
    cancellation: (hours) =>
      `Annulation remboursée intégralement jusqu'à ${hours}h avant votre créneau. Passé ce délai, la réservation n'est plus remboursable.`,
    questionsLabel: "Une question ?",
    siteLabel: "Voir le site",
  },
  nl: {
    subject: "Uw reservering bij Aura Spa is bevestigd",
    heading: "Reservering bevestigd",
    greeting: (name) => `Dag ${name},`,
    intro: "Uw reservering is bevestigd. Hier is het overzicht:",
    dateLabel: "Datum",
    timeLabel: "Uur",
    packageLabel: "Formule",
    totalLabel: "Totaal betaald",
    signoff: "Tot binnenkort,",
    team: "Het team van Aura Spa",
    practicalTitle: "Goed om te weten",
    cancellation: (hours) =>
      `Volledige terugbetaling bij annulering tot ${hours}u voor uw tijdslot. Daarna is de reservering niet meer terugbetaalbaar.`,
    questionsLabel: "Een vraag?",
    siteLabel: "Naar de website",
  },
};
