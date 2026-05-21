export type Lang = "fr" | "nl";

export const content = {
  fr: {
    nav: {
      experience: "L'expérience",
      lieu: "Le lieu",
      tarif: "Tarif",
      reserver: "Réserver",
    },
    hero: {
      title: ["Votre bulle", "à deux."],
      subtitle:
        "Un espace privatif pour 2 à 4 personnes.\nBains, chaleur et sérénité au cœur de Bruxelles.",
      ctaPrimary: "Réserver — 200€",
      ctaSecondary: "Découvrir",
      badge: "Déjà disponible à Bruxelles",
    },
    experience: {
      sectionTitle: "L'expérience",
      headline: "Une soirée rien qu'à vous",
      description:
        "Oubliez les spas classiques avec leurs salles communes et leurs plannings chargés. Aura Spa, c'est un espace entier réservé pour vous seuls — bains à bulles, chaleur enveloppante, et le silence que vous méritez.",
      cards: [
        {
          title: "Bains à bulles privatifs",
          description:
            "Jacuzzi et bains nordiques réservés exclusivement pour votre groupe.",
        },
        {
          title: "Jusqu'à 4 personnes",
          description:
            "Couple, amis ou collègues — l'espace s'adapte à votre groupe.",
        },
        {
          title: "2 heures de sérénité",
          description:
            "Un créneau dédié, sans interruption, pour déconnecter vraiment.",
        },
      ],
    },
    howItWorks: {
      sectionTitle: "Comment ça marche",
      steps: [
        { number: "01", title: "Choisissez votre créneau", description: "Consultez le calendrier et sélectionnez la date et l'heure qui vous conviennent." },
        { number: "02", title: "Payez en ligne", description: "Paiement sécurisé de 200€ via Stripe. Carte, Bancontact ou Apple Pay." },
        { number: "03", title: "Recevez votre confirmation", description: "Un email de confirmation avec toutes les informations pratiques vous est envoyé." },
        { number: "04", title: "Profitez de votre espace", description: "Arrivez, entrez dans votre espace privatif et laissez-vous porter." },
      ],
    },
    lieu: {
      sectionTitle: "Le lieu",
      title: ["Un écrin", "pensé pour vous"],
      description:
        "Au cœur de Bruxelles, Aura Spa est un espace intimiste pensé dans les moindres détails — lumières tamisées, chaleur maîtrisée, acoustique douce.",
      videoPlaceholder: "Vidéo du lieu — bientôt disponible",
      stats: ["2–4 personnes", "2 heures", "Bruxelles"],
    },
    booking: {
      sectionTitle: "Réserver",
      title: "Réservez votre moment",
      subtitle: "Choisissez votre créneau, payez en ligne. C'est tout.",
      payment: "Paiement sécurisé via Stripe",
      paymentMethods: "Carte, Bancontact, Apple Pay acceptés",
    },
    testimonials: {
      sectionTitle: "Ils en parlent",
      items: [
        {
          text: "Une bulle hors du temps. Nous avons passé 2 heures de pur bonheur, sans penser à rien. Le lieu est magnifique.",
          author: "Sophie & Marc",
          location: "Bruxelles",
        },
        {
          text: "Idéal pour un anniversaire surprise. Mon amie était sous le choc — c'est rare de trouver un espace aussi intimiste à Bruxelles.",
          author: "Charlotte V.",
          location: "Ixelles",
        },
        {
          text: "On a emmené nos collègues pour clôturer un projet. L'ambiance est parfaite et le concept est vraiment unique.",
          author: "Thomas D.",
          location: "Etterbeek",
        },
      ],
    },
    footer: {
      tagline: "Espace Privatif · Bruxelles",
      nav: {
        title: "Navigation",
        links: [
          { label: "L'expérience", href: "#experience" },
          { label: "Le lieu", href: "#lieu" },
          { label: "Réserver", href: "#reserver" },
          { label: "Contact", href: "mailto:contact@aura-spa.be" },
        ],
      },
      infos: {
        title: "Infos pratiques",
        items: ["Ouvert 7j/7", "Groupes de 2 à 4 personnes", "200€ / 2 heures"],
      },
      contact: {
        title: "Contact",
        email: "contact@aura-spa.be",
        instagram: "https://instagram.com/auraspa.brussels",
        facebook: "https://facebook.com/auraspa.brussels",
      },
      legal: "© 2026 Aura Spa",
      links: [
        { label: "Mentions légales", href: "/mentions-legales" },
        { label: "RGPD", href: "/rgpd" },
        { label: "CGV", href: "/cgv" },
      ],
    },
  },
  nl: {
    nav: {
      experience: "De ervaring",
      lieu: "De locatie",
      tarif: "Tarief",
      reserver: "Reserveren",
    },
    hero: {
      title: ["Uw eigen bubbel", "voor twee."],
      subtitle:
        "Een privéruimte voor 2 tot 4 personen.\nBaden, warmte en sereniteit in het hart van Brussel.",
      ctaPrimary: "Reserveren — 200€",
      ctaSecondary: "Ontdekken",
      badge: "Nu beschikbaar in Brussel",
    },
    experience: {
      sectionTitle: "De ervaring",
      headline: "Een avond alleen voor u",
      description:
        "Vergeet klassieke spa's met hun gemeenschappelijke ruimtes en drukke schema's. Aura Spa is een volledige ruimte die exclusief voor u is gereserveerd — jacuzzi, omhullende warmte en de stilte die u verdient.",
      cards: [
        {
          title: "Privé bubbelbaden",
          description:
            "Jacuzzi en Scandinavische baden exclusief gereserveerd voor uw groep.",
        },
        {
          title: "Tot 4 personen",
          description:
            "Koppel, vrienden of collega's — de ruimte past zich aan uw groep aan.",
        },
        {
          title: "2 uur sereniteit",
          description:
            "Een dedicated tijdslot, zonder onderbreking, om écht te ontkoppelen.",
        },
      ],
    },
    howItWorks: {
      sectionTitle: "Hoe het werkt",
      steps: [
        { number: "01", title: "Kies uw tijdslot", description: "Bekijk de kalender en selecteer de datum en het tijdstip dat u past." },
        { number: "02", title: "Betaal online", description: "Beveiligde betaling van 200€ via Stripe. Kaart, Bancontact of Apple Pay." },
        { number: "03", title: "Ontvang uw bevestiging", description: "Een bevestigingsmail met alle praktische informatie wordt naar u verzonden." },
        { number: "04", title: "Geniet van uw ruimte", description: "Kom aan, betreed uw privéruimte en laat u meevoeren." },
      ],
    },
    lieu: {
      sectionTitle: "De locatie",
      title: ["Een juweel", "voor u ontworpen"],
      description:
        "In het hart van Brussel is Aura Spa een intieme ruimte tot in de kleinste details ontworpen — gedempte verlichting, gecontroleerde warmte, zachte akoestiek.",
      videoPlaceholder: "Video van de locatie — binnenkort beschikbaar",
      stats: ["2–4 personen", "2 uur", "Brussel"],
    },
    booking: {
      sectionTitle: "Reserveren",
      title: "Reserveer uw moment",
      subtitle: "Kies uw tijdslot, betaal online. Dat is alles.",
      payment: "Beveiligde betaling via Stripe",
      paymentMethods: "Kaart, Bancontact, Apple Pay aanvaard",
    },
    testimonials: {
      sectionTitle: "Wat ze zeggen",
      items: [
        {
          text: "Een tijdloze bubbel. We hebben 2 uur puur geluk doorgebracht, zonder aan iets te denken. De locatie is prachtig.",
          author: "Sophie & Marc",
          location: "Brussel",
        },
        {
          text: "Perfect voor een verrassingsverjaardag. Mijn vriendin was verbluft — het is zeldzaam om zo'n intieme ruimte in Brussel te vinden.",
          author: "Charlotte V.",
          location: "Elsene",
        },
        {
          text: "We namen onze collega's mee om een project af te sluiten. De sfeer is perfect en het concept is echt uniek.",
          author: "Thomas D.",
          location: "Etterbeek",
        },
      ],
    },
    footer: {
      tagline: "Privéruimte · Brussel",
      nav: {
        title: "Navigatie",
        links: [
          { label: "De ervaring", href: "#experience" },
          { label: "De locatie", href: "#lieu" },
          { label: "Reserveren", href: "#reserver" },
          { label: "Contact", href: "mailto:contact@aura-spa.be" },
        ],
      },
      infos: {
        title: "Praktische info",
        items: ["7 dagen op 7 open", "Groepen van 2 tot 4 personen", "200€ / 2 uur"],
      },
      contact: {
        title: "Contact",
        email: "contact@aura-spa.be",
        instagram: "https://instagram.com/auraspa.brussels",
        facebook: "https://facebook.com/auraspa.brussels",
      },
      legal: "© 2026 Aura Spa",
      links: [
        { label: "Juridische vermeldingen", href: "/mentions-legales" },
        { label: "AVG", href: "/rgpd" },
        { label: "AV", href: "/cgv" },
      ],
    },
  },
} as const;
