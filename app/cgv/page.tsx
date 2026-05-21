import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Conditions Générales de Vente — Aura Spa",
};

export default function CGV() {
  return (
    <div
      style={{
        backgroundColor: "#F5EDE3",
        minHeight: "100vh",
        paddingTop: "120px",
        paddingBottom: "80px",
      }}
    >
      <div style={{ maxWidth: "768px", margin: "0 auto", padding: "0 24px" }}>
        <h1
          style={{
            fontFamily: "var(--font-cormorant)",
            fontStyle: "italic",
            fontWeight: 500,
            fontSize: "clamp(36px, 5vw, 52px)",
            color: "#2C1810",
            marginBottom: "2rem",
          }}
        >
          Conditions Générales de Vente
        </h1>

        <div
          style={{
            fontFamily: "var(--font-dm-sans)",
            fontWeight: 300,
            fontSize: "1rem",
            lineHeight: 1.7,
            color: "#2C1810",
            opacity: 0.8,
          }}
        >
          <section style={{ marginBottom: "2.5rem" }}>
            <h2
              style={{
                fontFamily: "var(--font-cormorant)",
                fontWeight: 600,
                fontSize: "1.375rem",
                color: "#2C1810",
                opacity: 1,
                marginBottom: "1rem",
              }}
            >
              Objet
            </h2>
            <p>
              Les présentes conditions générales de vente régissent la location
              de l&apos;espace privatif Aura Spa à Bruxelles. Toute réservation
              implique l&apos;acceptation pleine et entière des présentes CGV.
            </p>
            {/* TODO: Compléter avec les CGV complètes (politique d'annulation, conditions d'accès, responsabilités, etc.) */}
          </section>

          <section style={{ marginBottom: "2.5rem" }}>
            <h2
              style={{
                fontFamily: "var(--font-cormorant)",
                fontWeight: 600,
                fontSize: "1.375rem",
                color: "#2C1810",
                opacity: 1,
                marginBottom: "1rem",
              }}
            >
              Tarifs et paiement
            </h2>
            <p>
              Le tarif unique est de <strong>200€ pour 2 heures</strong> pour
              un groupe de 2 à 4 personnes. Le paiement est effectué en ligne,
              au moment de la réservation, via la plateforme Stripe.
            </p>
          </section>

          <section style={{ marginBottom: "2.5rem" }}>
            <h2
              style={{
                fontFamily: "var(--font-cormorant)",
                fontWeight: 600,
                fontSize: "1.375rem",
                color: "#2C1810",
                opacity: 1,
                marginBottom: "1rem",
              }}
            >
              Annulation
            </h2>
            <p>
              {/* TODO: Préciser la politique d'annulation avec la cliente */}
              La politique d&apos;annulation sera précisée prochainement. Pour
              toute question, contactez-nous à contact@aura-spa.be.
            </p>
          </section>
        </div>

        <a
          href="/"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "0.5rem",
            fontFamily: "var(--font-dm-sans)",
            fontWeight: 400,
            fontSize: "0.875rem",
            color: "#C4956A",
            textDecoration: "none",
            marginTop: "1rem",
          }}
        >
          ← Retour à l&apos;accueil
        </a>
      </div>
    </div>
  );
}
