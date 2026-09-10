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
      title: ["Votre bulle", "de sérénité."],
      subtitle:
        "Un espace privatif pour 2 à 10 personnes.\nBains, chaleur et détente à Bruxelles.",
      ctaPrimary: "Réserver — 150€",
      ctaSecondary: "Découvrir",
      ctaBook: "Réserver",
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
          title: "Jusqu'à 10 personnes",
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
      title: "Simple comme bonjour.",
      steps: [
        { number: "01", title: "Choisissez votre créneau", description: "Consultez le calendrier et sélectionnez la date et l'heure qui vous conviennent." },
        { number: "02", title: "Payez en ligne", description: "Paiement sécurisé de 150€ via Stripe. Carte, Bancontact ou Apple Pay." },
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
      stats: ["2–10 personnes", "2 heures", "Bruxelles"],
    },
    booking: {
      sectionTitle: "Réserver",
      title: "Réservez votre moment",
      subtitle: "Choisissez votre créneau, payez en ligne. C'est tout.",
      ctaChooseSlot: "Choisir mon créneau",
      availabilityNote:
        "Choisissez votre créneau et payez en ligne en quelques minutes. Une question ? Contactez-nous par email.",
      payment: "Paiement sécurisé via Stripe",
      paymentMethods: "Carte, Bancontact, Apple Pay acceptés",
    },
    testimonials: {
      sectionTitle: "Ils en parlent",
      items: [
        {
          text: "J'ai vraiment adoré, c'était un 10/10 avec un service au top. Je recommande vivement :)",
          author: "Marlyse",
        },
        {
          text: "Une escapade réussie ! Un service au top, un accueil chaleureux et bienveillant (elle est pépite) mais vraiment ! Tout était top ! Je recommande vivement !",
          author: "Bajarm",
        },
        {
          text: "J'ai vécu une expérience absolument incroyable au spa, du début à la fin. L'ambiance était paisible, propre et magnifiquement pensée — l'endroit parfait pour se détendre. Le personnel était incroyablement accueillant, professionnel et attentif à chaque détail. Ce qui m'a vraiment marquée, c'est le service client exceptionnel et le souci du détail. De l'ambiance apaisante à la qualité des soins, tout a dépassé mes attentes. Je suis repartie complètement ressourcée, revitalisée et sans stress. Je recommande vivement ce spa à quiconque cherche une expérience de relaxation haut de gamme. Facilement un 10/10. J'ai hâte de revenir en Belgique pour retourner dans ce spa !!",
          author: "Bernice",
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
          { label: "Contact", href: "mailto:Kamanrobert@icloud.com" },
        ],
      },
      infos: {
        title: "Infos pratiques",
        items: ["Ouvert 7j/7", "Groupes de 2 à 10 personnes", "150€ / 2 heures"],
      },
      contact: {
        title: "Contact",
        email: "Kamanrobert@icloud.com",
        instagram: "https://www.instagram.com/espace.privatif",
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
      title: ["Uw eigen bubbel", "van sereniteit."],
      subtitle:
        "Een privéruimte voor 2 tot 10 personen.\nBaden, warmte en ontspanning in Brussel.",
      ctaPrimary: "Reserveren — 150€",
      ctaSecondary: "Ontdekken",
      ctaBook: "Reserveren",
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
          title: "Tot 10 personen",
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
      title: "Kinderspel.",
      steps: [
        { number: "01", title: "Kies uw tijdslot", description: "Bekijk de kalender en selecteer de datum en het tijdstip dat u past." },
        { number: "02", title: "Betaal online", description: "Beveiligde betaling van 150€ via Stripe. Kaart, Bancontact of Apple Pay." },
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
      stats: ["2–10 personen", "2 uur", "Brussel"],
    },
    booking: {
      sectionTitle: "Reserveren",
      title: "Reserveer uw moment",
      subtitle: "Kies uw tijdslot, betaal online. Dat is alles.",
      ctaChooseSlot: "Mijn tijdslot kiezen",
      availabilityNote: "Kies uw tijdslot en betaal online in enkele minuten. Een vraag? Neem contact op per e-mail.",
      payment: "Beveiligde betaling via Stripe",
      paymentMethods: "Kaart, Bancontact, Apple Pay aanvaard",
    },
    testimonials: {
      sectionTitle: "Wat ze zeggen",
      items: [
        {
          text: "ik heb echt genoten, het was een 10/10 met TOPSERVICE. Zeker een aanrader :)",
          author: "Marlyse",
        },
        {
          text: "Een geslaagd uitje! Een topservice, een warme en zorgzame ontvangst (ze is een pareltje), echt waar! Alles was top! Ik raad het ten zeerste aan!",
          author: "Bajarm",
        },
        {
          text: "Ik heb een absoluut geweldige ervaring gehad in de spa, van begin tot eind. De sfeer was rustgevend, netjes en prachtig ingericht — de perfecte plek om te ontspannen. Het personeel was ongelooflijk gastvrij, professioneel en aandachtig voor elk detail. Wat echt opviel was de uitzonderlijke klantenservice en de aandacht voor detail. Van de rustgevende sfeer tot de kwaliteit van de behandelingen, alles overtrof mijn verwachtingen. Ik vertrok volledig verkwikt, fris en stressvrij. Ik raad deze spa ten zeerste aan aan iedereen die op zoek is naar een topervaring op het gebied van ontspanning. Makkelijk een 10/10. Ik kan niet wachten om terug te komen naar België om terug naar deze spa te gaan!!",
          author: "Bernice",
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
          { label: "Contact", href: "mailto:Kamanrobert@icloud.com" },
        ],
      },
      infos: {
        title: "Praktische info",
        items: ["7 dagen op 7 open", "Groepen van 2 tot 10 personen", "150€ / 2 uur"],
      },
      contact: {
        title: "Contact",
        email: "Kamanrobert@icloud.com",
        instagram: "https://www.instagram.com/espace.privatif",
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
