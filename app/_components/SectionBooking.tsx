"use client";

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
            href="/reserver"
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
                ? "Choisissez votre créneau et payez en ligne en quelques minutes. Une question ? Contactez-nous par email."
                : "Kies uw tijdslot en betaal online in enkele minuten. Een vraag? Neem contact op per e-mail."}
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

          {/* Logos paiement */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "1.5rem" }}>
            <svg viewBox="0 0 48 16" style={{ height: "24px", width: "auto" }} fill="none" aria-label="Visa">
              <text x="0" y="13" fontFamily="Arial" fontWeight="bold" fontSize="16" fill="#1A1F71">VISA</text>
            </svg>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg"
              alt="Mastercard"
              style={{ height: "32px", width: "auto" }}
            />
            <span
              style={{
                fontFamily: "var(--font-dm-sans)",
                fontWeight: 700,
                fontSize: "0.8125rem",
                letterSpacing: "0.05em",
                color: "#005498",
                border: "1px solid #005498",
                borderRadius: "4px",
                padding: "4px 8px",
                lineHeight: 1,
              }}
            >
              Bancontact
            </span>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/b/b0/Apple_Pay_logo.svg"
              alt="Apple Pay"
              style={{ height: "32px", width: "auto" }}
            />
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
