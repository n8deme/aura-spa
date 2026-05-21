"use client";

// TODO: remplacer par embed Calendly quand le compte est créé
// URL Calendly : https://calendly.com/aura-spa/2h
// Pour activer : remplacer le bloc CTA ci-dessous par <iframe src={CALENDLY_URL} ... />

import { motion } from "framer-motion";
import { ArrowRight, Lock } from "lucide-react";
import type { Lang } from "../_lib/content";
import { content } from "../_lib/content";

const CONTACT_EMAIL = "contact@auraspa.be";

export function SectionBooking({ lang }: { lang: "fr" | "nl" }) {
  const t = content[lang].booking;

  return (
    <section
      id="reserver"
      style={{
        backgroundColor: "#EDE0D4",
        paddingTop: "clamp(60px, 10vw, 128px)",
        paddingBottom: "clamp(60px, 10vw, 128px)",
      }}
    >
      <div
        className="px-6 md:px-8 lg:px-16"
        style={{ maxWidth: "800px", margin: "0 auto" }}
      >
        {/* En-tête */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          style={{ textAlign: "center", marginBottom: "3rem" }}
        >
          <span
            style={{
              fontFamily: "var(--font-dm-sans)",
              fontWeight: 300,
              fontSize: "0.75rem",
              letterSpacing: "0.15em",
              textTransform: "uppercase",
              color: "#C4956A",
              display: "block",
              marginBottom: "0.75rem",
            }}
          >
            {t.sectionTitle}
          </span>
          <h2
            style={{
              fontFamily: "var(--font-cormorant)",
              fontStyle: "italic",
              fontWeight: 500,
              fontSize: "clamp(36px, 5vw, 56px)",
              color: "#2C1810",
              margin: "0 0 1rem 0",
            }}
          >
            {t.title}
          </h2>
          <p
            style={{
              fontFamily: "var(--font-dm-sans)",
              fontWeight: 300,
              fontSize: "1rem",
              color: "#2C1810",
              opacity: 0.7,
              margin: 0,
            }}
          >
            {t.subtitle}
          </p>
        </motion.div>

        {/* Zone principale — CTA + info */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
          style={{
            backgroundColor: "#F5EDE3",
            borderRadius: "8px",
            border: "1px solid rgba(212,187,168,0.5)",
            padding: "clamp(32px, 5vw, 56px)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "1.5rem",
            textAlign: "center",
          }}
        >
          {/* Grand CTA */}
          <a
            href="#"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.625rem",
              padding: "18px 40px",
              backgroundColor: "#C4956A",
              color: "#F5EDE3",
              fontFamily: "var(--font-dm-sans)",
              fontWeight: 500,
              fontSize: "1rem",
              letterSpacing: "0.02em",
              textDecoration: "none",
              borderRadius: "2px",
              transition: "background-color 0.2s",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.backgroundColor = "#b8845a")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.backgroundColor = "#C4956A")
            }
          >
            {lang === "fr" ? "Choisir mon créneau" : "Mijn tijdslot kiezen"}
            <ArrowRight size={16} />
          </a>

          {/* Divider */}
          <div
            style={{
              width: "40px",
              height: "1px",
              backgroundColor: "rgba(196,149,106,0.3)",
            }}
          />

          {/* Note disponibilité + email */}
          <div style={{ maxWidth: "420px" }}>
            <p
              style={{
                fontFamily: "var(--font-dm-sans)",
                fontWeight: 300,
                fontSize: "0.875rem",
                lineHeight: 1.65,
                color: "#2C1810",
                opacity: 0.6,
                margin: "0 0 0.625rem 0",
              }}
            >
              {lang === "fr"
                ? "La réservation en ligne sera disponible très prochainement. Contactez-nous par email pour réserver dès maintenant."
                : "Online reserveren komt binnenkort beschikbaar. Neem contact op per e-mail om nu al te reserveren."}
            </p>
            <a
              href={`mailto:${CONTACT_EMAIL}`}
              style={{
                fontFamily: "var(--font-dm-sans)",
                fontWeight: 500,
                fontSize: "0.9375rem",
                color: "#C4956A",
                textDecoration: "none",
                letterSpacing: "0.01em",
                borderBottom: "1px solid rgba(196,149,106,0.3)",
                paddingBottom: "1px",
                transition: "border-color 0.2s",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.borderColor = "#C4956A")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.borderColor = "rgba(196,149,106,0.3)")
              }
            >
              {CONTACT_EMAIL}
            </a>
          </div>
        </motion.div>

        {/* Méthodes de paiement */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
          style={{
            marginTop: "2rem",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "0.75rem",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              color: "#2C1810",
              opacity: 0.5,
            }}
          >
            <Lock size={12} />
            <p
              style={{
                fontFamily: "var(--font-dm-sans)",
                fontWeight: 400,
                fontSize: "0.8125rem",
                color: "#2C1810",
                margin: 0,
                letterSpacing: "0.02em",
              }}
            >
              {t.payment}
            </p>
          </div>

          {/* Icônes paiement SVG */}
          <div style={{ display: "flex", alignItems: "center", gap: "0.625rem" }}>
            <svg width="44" height="28" viewBox="0 0 44 28" fill="none" aria-label="Visa">
              <rect x="0.5" y="0.5" width="43" height="27" rx="3.5" fill="white" stroke="#D4BBA8" />
              <text x="50%" y="60%" dominantBaseline="middle" textAnchor="middle" fill="#1A1F71" fontFamily="Arial" fontWeight="bold" fontSize="10">VISA</text>
            </svg>
            <svg width="44" height="28" viewBox="0 0 44 28" fill="none" aria-label="Mastercard">
              <rect x="0.5" y="0.5" width="43" height="27" rx="3.5" fill="white" stroke="#D4BBA8" />
              <circle cx="17" cy="14" r="8" fill="#EB001B" opacity="0.9" />
              <circle cx="27" cy="14" r="8" fill="#F79E1B" opacity="0.9" />
              <path d="M22 8.5a8 8 0 0 1 0 11 8 8 0 0 1 0-11z" fill="#FF5F00" />
            </svg>
            <svg width="44" height="28" viewBox="0 0 44 28" fill="none" aria-label="Bancontact">
              <rect x="0.5" y="0.5" width="43" height="27" rx="3.5" fill="white" stroke="#D4BBA8" />
              <text x="50%" y="60%" dominantBaseline="middle" textAnchor="middle" fill="#005498" fontFamily="Arial" fontWeight="bold" fontSize="7">BANCONTACT</text>
            </svg>
            <svg width="44" height="28" viewBox="0 0 44 28" fill="none" aria-label="Apple Pay">
              <rect x="0.5" y="0.5" width="43" height="27" rx="3.5" fill="white" stroke="#D4BBA8" />
              <text x="50%" y="60%" dominantBaseline="middle" textAnchor="middle" fill="#000000" fontFamily="Arial" fontWeight="bold" fontSize="7.5">Apple Pay</text>
            </svg>
          </div>

          <p
            style={{
              fontFamily: "var(--font-dm-sans)",
              fontWeight: 300,
              fontSize: "0.75rem",
              color: "#2C1810",
              opacity: 0.4,
              margin: 0,
            }}
          >
            {t.paymentMethods}
          </p>
        </motion.div>
      </div>
    </section>
  );
}
