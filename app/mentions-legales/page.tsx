import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Mentions légales — Aura Spa",
};

export default function MentionsLegales() {
  return (
    <div
      style={{
        backgroundColor: "#F5EDE3",
        minHeight: "100vh",
        paddingTop: "120px",
        paddingBottom: "80px",
      }}
    >
      <div
        style={{
          maxWidth: "768px",
          margin: "0 auto",
          padding: "0 24px",
        }}
      >
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
          Mentions légales
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
              Éditeur du site
            </h2>
            <p>
              <strong>Aura Spa</strong>
              <br />
              Espace Privatif
              <br />
              Bruxelles, Belgique
              <br />
              Email : contact@aura-spa.be
            </p>
            {/* TODO: Compléter avec les informations légales de la société (numéro BCE, forme juridique, adresse complète) */}
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
              Hébergement
            </h2>
            <p>
              {/* TODO: Compléter avec les informations d'hébergement */}
              Ce site est hébergé par Vercel Inc., 340 Pine Street, Suite 701,
              San Francisco, California 94104, États-Unis.
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
              Propriété intellectuelle
            </h2>
            <p>
              L&apos;ensemble du contenu de ce site (textes, images, vidéos,
              graphismes) est la propriété exclusive d&apos;Aura Spa et est
              protégé par les lois belges et internationales relatives à la
              propriété intellectuelle. Toute reproduction, même partielle, est
              strictement interdite sans autorisation préalable.
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
