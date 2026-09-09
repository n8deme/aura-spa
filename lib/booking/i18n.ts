import type { Lang } from "@/app/_lib/content";
import type { ExtraId, PackageType } from "./types";

// Libellés affichés (menu, formules) — séparés de pricing-config.ts qui ne
// contient que les données business (id, prix), indépendantes de la langue.
export const EXTRAS_LABELS: Record<Lang, Record<ExtraId, string>> = {
  fr: {
    charcuterie_fromage: "Plateau charcuterie & fromage",
    sushis: "Plateau de sushis",
    dessert: "Plateau dessert",
    cocktail_aperol: "Cocktail — Aperol Spritz",
    cocktail_passion: "Cocktail — Passion Fruit Martini",
    cocktail_mojito: "Cocktail — Mojito fraise",
    soft_drink: "Soft drink (à préciser en remarque)",
    shisha: "Chicha (goût au choix, à préciser en remarque)",
    prosecco: "Bouteille de prosecco",
    champagne: "Bouteille de champagne",
    vin_blanc: "Bouteille de vin blanc",
  },
  nl: {
    charcuterie_fromage: "Charcuterie- & kaasplank",
    sushis: "Sushiplank",
    dessert: "Dessertplank",
    cocktail_aperol: "Cocktail — Aperol Spritz",
    cocktail_passion: "Cocktail — Passion Fruit Martini",
    cocktail_mojito: "Cocktail — Mojito aardbei",
    soft_drink: "Frisdrank (te specificeren in opmerkingen)",
    shisha: "Waterpijp (smaak naar keuze, vermeld in opmerkingen)",
    prosecco: "Fles prosecco",
    champagne: "Fles champagne",
    vin_blanc: "Fles witte wijn",
  },
};

export const PACKAGE_LABELS: Record<Lang, Record<PackageType, string>> = {
  fr: { base: "Forfait de base", all_in: "Forfait All-in", a_la_carte: "À la carte" },
  nl: { base: "Basisformule", all_in: "All-in formule", a_la_carte: "À la carte" },
};

export const PRICING_TEXT: Record<
  Lang,
  {
    basePackage: (hours: number) => string;
    allInPackage: (hours: number) => string;
    extraHours: (hours: number) => string;
    withQuantity: (label: string, quantity: number) => string;
    comingSoon: string;
  }
> = {
  fr: {
    basePackage: (h) => `Forfait de base (${h}h)`,
    allInPackage: (h) => `Forfait All-in (${h}h)`,
    extraHours: (h) => `${h}h supplémentaire${h > 1 ? "s" : ""}`,
    withQuantity: (label, qty) => (qty > 1 ? `${label} x${qty}` : label),
    comingSoon: "Bientôt disponible",
  },
  nl: {
    basePackage: (h) => `Basisformule (${h}u)`,
    allInPackage: (h) => `All-in formule (${h}u)`,
    extraHours: (h) => `${h}u extra`,
    withQuantity: (label, qty) => (qty > 1 ? `${label} x${qty}` : label),
    comingSoon: "Binnenkort beschikbaar",
  },
};

export const ERRORS: Record<
  Lang,
  {
    guestCountRange: (min: number, max: number) => string;
    allInMaxGuests: (n: number) => string;
    baseNoExtras: string;
    allInNoExtras: string;
    invalidExtraHours: string;
    maxDuration: (h: number) => string;
    unknownExtra: (id: string) => string;
    invalidQuantity: (label: string) => string;
    invalidSlot: string;
    minAdvance: (h: number) => string;
    outsideOpeningHours: (start: string, end: string) => string;
    slotConflict: string;
  }
> = {
  fr: {
    guestCountRange: (min, max) => `Le nombre de personnes doit être compris entre ${min} et ${max}.`,
    allInMaxGuests: (n) => `Le forfait All-in est réservé aux groupes de ${n} personnes maximum.`,
    baseNoExtras: "Le forfait de base ne peut pas inclure d'heures ou d'extras supplémentaires.",
    allInNoExtras: "Le forfait All-in ne peut pas inclure d'heures ou d'extras supplémentaires.",
    invalidExtraHours: "Nombre d'heures supplémentaires invalide.",
    maxDuration: (h) => `La durée totale ne peut pas dépasser ${h}h.`,
    unknownExtra: (id) => `Extra inconnu : ${id}`,
    invalidQuantity: (label) => `Quantité invalide pour ${label}.`,
    invalidSlot: "Créneau invalide.",
    minAdvance: (h) => `Réservation possible à partir de ${h}h à l'avance.`,
    outsideOpeningHours: (start, end) => `Le créneau doit se situer entre ${start} et ${end}.`,
    slotConflict: "Ce créneau chevauche une réservation existante (temps de battement compris).",
  },
  nl: {
    guestCountRange: (min, max) => `Het aantal personen moet tussen ${min} en ${max} liggen.`,
    allInMaxGuests: (n) => `De All-in formule is voorbehouden aan groepen van maximaal ${n} personen.`,
    baseNoExtras: "De basisformule kan geen extra uren of extra's bevatten.",
    allInNoExtras: "De All-in formule kan geen extra uren of extra's bevatten.",
    invalidExtraHours: "Ongeldig aantal extra uren.",
    maxDuration: (h) => `De totale duur mag niet meer dan ${h}u bedragen.`,
    unknownExtra: (id) => `Onbekende extra: ${id}`,
    invalidQuantity: (label) => `Ongeldig aantal voor ${label}.`,
    invalidSlot: "Ongeldig tijdslot.",
    minAdvance: (h) => `Reserveren kan vanaf ${h}u op voorhand.`,
    outsideOpeningHours: (start, end) => `Het tijdslot moet tussen ${start} en ${end} vallen.`,
    slotConflict: "Dit tijdslot overlapt met een bestaande reservering (inclusief buffertijd).",
  },
};

export const BOOKING_UI = {
  fr: {
    stepLabels: {
      slot: "Créneau",
      guests: "Personnes",
      formule: "Formule",
      extras: "Extras",
      recap: "Récapitulatif",
    },
    nav: { back: "Retour", next: "Continuer" },
    slot: {
      title: "Choisissez votre créneau",
      subtitle:
        "Sélectionnez une date, puis une heure de début. La durée exacte dépendra de la formule choisie à l'étape suivante.",
      chooseDateFirst: "Choisissez d'abord une date.",
      loading: "Chargement des créneaux…",
      loadError: "Impossible de charger les créneaux.",
      noSlots: "Aucun créneau ce jour-là.",
    },
    guests: {
      title: "Combien serez-vous ?",
      subtitle: (min: number, max: number) => `L'espace privatif accueille de ${min} à ${max} personnes.`,
      allInLimit: (n: number) => `Le forfait All-in est réservé aux groupes de ${n} personnes.`,
    },
    formule: {
      title: "Choisissez votre formule",
      subtitle: "Votre créneau est réservé le temps de finaliser.",
      baseTitle: (h: number) => `Forfait de base — ${h}h`,
      baseDescription: "L'essentiel : votre espace privatif, sans extra.",
      allInTitle: (h: number) => `All-in — ${h}h`,
      allInDescription: (n: number) =>
        `2h + plateau charcuterie & fromage et champagne inclus. Réservé aux groupes de ${n} personnes.`,
      alaCarteTitle: "À la carte",
      alaCarteDescription: "Prolongez au-delà de 2h et choisissez librement vos extras.",
      fromPrice: (price: string) => `À partir de ${price}`,
      selected: "Sélectionné",
    },
    extras: {
      title: "Personnalisez votre moment",
      subtitle: "Ajoutez des heures et des extras. Vous pourrez toujours en ajouter sur place.",
      extraHoursTitle: "Heures supplémentaires",
      totalHours: (h: number) => `${h}h au total`,
      extrasTitle: "Extras",
      total: "Total",
    },
    recap: {
      title: "Récapitulatif & paiement",
      slotLabel: "Créneau",
      guestsLabel: (n: number) => `${n} personne${n > 1 ? "s" : ""}`,
      total: "Total",
      checking: "Vérification du créneau…",
      conflictText: "Ce créneau vient d'être réservé par quelqu'un d'autre.",
      pickAnother: "Choisir un autre créneau",
      nameLabel: "Nom complet",
      namePlaceholder: "Jeanne Dupont",
      emailLabel: "Email",
      emailPlaceholder: "jeanne@example.com",
      phoneLabel: "Téléphone (optionnel)",
      phonePlaceholder: "+32 4xx xx xx xx",
      notesLabel: "Remarques (optionnel)",
      notesPlaceholder: "Allergies, version halal ou sans alcool, goût de chicha souhaité…",
      secure: "Paiement sécurisé via Stripe. Carte, Bancontact, Apple Pay.",
      genericError: "Une erreur est survenue.",
      retryError: "Une erreur est survenue. Veuillez réessayer.",
      slotGoneError: "Ce créneau n'est plus disponible.",
      pay: (price: string) => `Payer ${price}`,
      back: "Retour",
    },
    success: {
      title: "Réservation confirmée",
      thanks: "Merci ! Un email de confirmation vous sera envoyé avec toutes les informations pratiques.",
      slotLabel: "Créneau",
      totalPaid: "Total payé",
      backHome: "Retour à l'accueil",
    },
  },
  nl: {
    stepLabels: {
      slot: "Tijdslot",
      guests: "Personen",
      formule: "Formule",
      extras: "Extras",
      recap: "Overzicht",
    },
    nav: { back: "Terug", next: "Verder" },
    slot: {
      title: "Kies uw tijdslot",
      subtitle:
        "Selecteer een datum en een starttijd. De exacte duur hangt af van de formule die u in de volgende stap kiest.",
      chooseDateFirst: "Kies eerst een datum.",
      loading: "Tijdsloten laden…",
      loadError: "Kan de tijdsloten niet laden.",
      noSlots: "Geen beschikbare tijdsloten op deze dag.",
    },
    guests: {
      title: "Met hoeveel bent u?",
      subtitle: (min: number, max: number) => `De privéruimte biedt plaats aan ${min} tot ${max} personen.`,
      allInLimit: (n: number) => `De All-in formule is voorbehouden aan groepen van ${n} personen.`,
    },
    formule: {
      title: "Kies uw formule",
      subtitle: "Uw tijdslot blijft gereserveerd terwijl u afrondt.",
      baseTitle: (h: number) => `Basisformule — ${h}u`,
      baseDescription: "Het essentiële: uw privéruimte, zonder extra's.",
      allInTitle: (h: number) => `All-in — ${h}u`,
      allInDescription: (n: number) =>
        `2u + charcuterie- & kaasplank en champagne inbegrepen. Voorbehouden aan groepen van ${n} personen.`,
      alaCarteTitle: "À la carte",
      alaCarteDescription: "Verleng voorbij 2u en kies vrij uw extra's.",
      fromPrice: (price: string) => `Vanaf ${price}`,
      selected: "Geselecteerd",
    },
    extras: {
      title: "Personaliseer uw moment",
      subtitle: "Voeg uren en extra's toe. U kunt ook altijd extra's ter plaatse toevoegen.",
      extraHoursTitle: "Extra uren",
      totalHours: (h: number) => `${h}u in totaal`,
      extrasTitle: "Extra's",
      total: "Totaal",
    },
    recap: {
      title: "Overzicht & betaling",
      slotLabel: "Tijdslot",
      guestsLabel: (n: number) => `${n} perso${n > 1 ? "nen" : "on"}`,
      total: "Totaal",
      checking: "Tijdslot wordt gecontroleerd…",
      conflictText: "Dit tijdslot is zojuist door iemand anders gereserveerd.",
      pickAnother: "Kies een ander tijdslot",
      nameLabel: "Volledige naam",
      namePlaceholder: "Jeanne Dupont",
      emailLabel: "E-mail",
      emailPlaceholder: "jeanne@example.com",
      phoneLabel: "Telefoon (optioneel)",
      phonePlaceholder: "+32 4xx xx xx xx",
      notesLabel: "Opmerkingen (optioneel)",
      notesPlaceholder: "Allergieën, halal of alcoholvrije versie, gewenste waterpijpsmaak…",
      secure: "Beveiligde betaling via Stripe. Kaart, Bancontact, Apple Pay.",
      genericError: "Er is een fout opgetreden.",
      retryError: "Er is een fout opgetreden. Probeer het opnieuw.",
      slotGoneError: "Dit tijdslot is niet meer beschikbaar.",
      pay: (price: string) => `Betaal ${price}`,
      back: "Terug",
    },
    success: {
      title: "Reservering bevestigd",
      thanks: "Bedankt! U ontvangt een bevestigingsmail met alle praktische informatie.",
      slotLabel: "Tijdslot",
      totalPaid: "Totaal betaald",
      backHome: "Terug naar de homepage",
    },
  },
} as const;
