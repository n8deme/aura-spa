import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "RGPD — Politique de confidentialité — Aura Spa",
};

export default function RGPD() {
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
          Politique de confidentialité (RGPD)
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
              Données collectées
            </h2>
            <p>
              Dans le cadre de la réservation de votre créneau, Aura Spa
              collecte les données suivantes : nom, prénom, adresse email,
              numéro de téléphone et informations de paiement (traitées par
              Stripe).
            </p>
            {/* TODO: Compléter avec la politique complète de confidentialité */}
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
              Vos droits
            </h2>
            <p>
              Conformément au Règlement Général sur la Protection des Données
              (RGPD), vous disposez des droits suivants : accès, rectification,
              suppression, portabilité et opposition au traitement de vos
              données personnelles.
            </p>
            <p style={{ marginTop: "1rem" }}>
              Pour exercer ces droits, contactez-nous à :{" "}
              <a
                href="mailto:contact@aura-spa.be"
                style={{ color: "#C4956A", textDecoration: "none" }}
              >
                contact@aura-spa.be
              </a>
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
