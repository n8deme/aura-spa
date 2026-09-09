import type { Lang } from "@/app/_lib/content";

export const LEGAL_COMMON: Record<Lang, { backHome: string }> = {
  fr: { backHome: "← Retour à l'accueil" },
  nl: { backHome: "← Terug naar de homepage" },
};

export const MENTIONS_LEGALES_I18N: Record<
  Lang,
  {
    pageTitle: string;
    heading: string;
    editorTitle: string;
    editorLines: string[];
    hostingTitle: string;
    hostingText: string;
    ipTitle: string;
    ipText: string;
  }
> = {
  fr: {
    pageTitle: "Mentions légales — Aura Spa",
    heading: "Mentions légales",
    editorTitle: "Éditeur du site",
    editorLines: ["Aura Spa", "Espace Privatif", "Melsbroek, Belgique", "Email : Kamanrobert@icloud.com"],
    hostingTitle: "Hébergement",
    hostingText:
      "Ce site est hébergé par Vercel Inc., 340 Pine Street, Suite 701, San Francisco, California 94104, États-Unis.",
    ipTitle: "Propriété intellectuelle",
    ipText:
      "L'ensemble du contenu de ce site (textes, images, vidéos, graphismes) est la propriété exclusive d'Aura Spa et est protégé par les lois belges et internationales relatives à la propriété intellectuelle. Toute reproduction, même partielle, est strictement interdite sans autorisation préalable.",
  },
  nl: {
    pageTitle: "Juridische vermeldingen — Aura Spa",
    heading: "Juridische vermeldingen",
    editorTitle: "Uitgever van de site",
    editorLines: ["Aura Spa", "Privéruimte", "Melsbroek, België", "E-mail: Kamanrobert@icloud.com"],
    hostingTitle: "Hosting",
    hostingText:
      "Deze site wordt gehost door Vercel Inc., 340 Pine Street, Suite 701, San Francisco, California 94104, Verenigde Staten.",
    ipTitle: "Intellectuele eigendom",
    ipText:
      "Alle inhoud van deze site (teksten, afbeeldingen, video's, grafisch materiaal) is exclusief eigendom van Aura Spa en wordt beschermd door de Belgische en internationale wetgeving inzake intellectuele eigendom. Elke, ook gedeeltelijke, reproductie is strikt verboden zonder voorafgaande toestemming.",
  },
};

export const RGPD_I18N: Record<
  Lang,
  {
    pageTitle: string;
    heading: string;
    dataTitle: string;
    dataText: string;
    rightsTitle: string;
    rightsText: string;
    contactText: string;
  }
> = {
  fr: {
    pageTitle: "RGPD — Politique de confidentialité — Aura Spa",
    heading: "Politique de confidentialité (RGPD)",
    dataTitle: "Données collectées",
    dataText:
      "Dans le cadre de la réservation de votre créneau, Aura Spa collecte les données suivantes : nom, prénom, adresse email, numéro de téléphone et informations de paiement (traitées par Stripe).",
    rightsTitle: "Vos droits",
    rightsText:
      "Conformément au Règlement Général sur la Protection des Données (RGPD), vous disposez des droits suivants : accès, rectification, suppression, portabilité et opposition au traitement de vos données personnelles.",
    contactText: "Pour exercer ces droits, contactez-nous à :",
  },
  nl: {
    pageTitle: "AVG — Privacybeleid — Aura Spa",
    heading: "Privacybeleid (AVG)",
    dataTitle: "Verzamelde gegevens",
    dataText:
      "Bij het reserveren van uw tijdslot verzamelt Aura Spa de volgende gegevens: naam, voornaam, e-mailadres, telefoonnummer en betalingsgegevens (verwerkt door Stripe).",
    rightsTitle: "Uw rechten",
    rightsText:
      "Conform de Algemene Verordening Gegevensbescherming (AVG) heeft u de volgende rechten: toegang, rectificatie, verwijdering, overdraagbaarheid en verzet tegen de verwerking van uw persoonsgegevens.",
    contactText: "Om deze rechten uit te oefenen, contacteer ons via:",
  },
};

export const CGV_I18N: Record<
  Lang,
  {
    pageTitle: string;
    heading: string;
    objectTitle: string;
    objectText: string;
    pricingTitle: string;
    pricingText: string;
    cancellationTitle: string;
    cancellationText: string;
  }
> = {
  fr: {
    pageTitle: "Conditions Générales de Vente — Aura Spa",
    heading: "Conditions Générales de Vente",
    objectTitle: "Objet",
    objectText:
      "Les présentes conditions générales de vente régissent la location de l'espace privatif Aura Spa à Bruxelles. Toute réservation implique l'acceptation pleine et entière des présentes CGV.",
    pricingTitle: "Tarifs et paiement",
    pricingText:
      "Le forfait de base est de 150€ pour 2 heures pour un groupe de 2 à 10 personnes, avec possibilité de prolonger (25€ par heure supplémentaire, dans la limite de 4h au total) et d'ajouter des extras à la carte. Un forfait All-in à 220€ tout compris est également disponible. Le paiement est effectué en ligne, au moment de la réservation, via la plateforme Stripe. Un extra ajouté sur place se règle directement sur place.",
    cancellationTitle: "Annulation",
    cancellationText:
      "Toute annulation effectuée au moins 24 heures avant le créneau réservé donne droit à un remboursement intégral. En deçà de ce délai, la réservation n'est pas remboursable. Pour annuler ou pour toute question, contactez-nous à Kamanrobert@icloud.com.",
  },
  nl: {
    pageTitle: "Algemene Verkoopsvoorwaarden — Aura Spa",
    heading: "Algemene Verkoopsvoorwaarden",
    objectTitle: "Voorwerp",
    objectText:
      "Deze algemene verkoopsvoorwaarden regelen de verhuur van de privéruimte Aura Spa in Brussel. Elke reservering impliceert de volledige aanvaarding van deze voorwaarden.",
    pricingTitle: "Tarieven en betaling",
    pricingText:
      "De basisformule bedraagt 150€ voor 2 uur voor een groep van 2 tot 10 personen, met de mogelijkheid om te verlengen (25€ per extra uur, tot maximaal 4u in totaal) en extra's à la carte toe te voegen. Een All-in formule van 220€ all-in is ook beschikbaar. De betaling gebeurt online, op het moment van reservering, via het Stripe-platform. Een extra die ter plaatse wordt toegevoegd, wordt ook ter plaatse afgerekend.",
    cancellationTitle: "Annulering",
    cancellationText:
      "Elke annulering ten minste 24 uur voor het gereserveerde tijdslot geeft recht op een volledige terugbetaling. Binnen deze termijn is de reservering niet terugbetaalbaar. Om te annuleren of voor vragen, contacteer ons via Kamanrobert@icloud.com.",
  },
};
