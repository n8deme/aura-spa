"use client";

import { motion } from "framer-motion";
import type { Lang } from "../_lib/content";
import { content } from "../_lib/content";
import {
  ALL_IN_PACKAGE,
  BASE_PACKAGE,
  EXTRAS_CATALOG,
  EXTRA_HOUR_PRICE,
  type ExtraCategory,
} from "@/lib/booking/pricing-config";
import { EXTRAS_LABELS } from "@/lib/booking/i18n";

interface SectionTarifsProps {
  lang: Lang;
}

// Deux colonnes plutôt que trois : "other" ne contient qu'un extra, seul dans
// sa colonne il passait pour un bug d'affichage. Empilé sous "food", l'équilibre
// tombe à 4 lignes à gauche contre 7 à droite.
const COLONNES: ExtraCategory[][] = [
  ["food", "other"],
  ["drink"],
];

export function SectionTarifs({ lang }: SectionTarifsProps) {
  const t = content[lang].pricing;
  const labels = EXTRAS_LABELS[lang];

  // Les montants viennent de pricing-config, la même source que le moteur de
  // réservation : un prix affiché ici ne peut pas diverger de celui facturé.
  const formules = [
    { name: t.baseName, detail: t.baseDetail, price: BASE_PACKAGE.price },
    { name: t.allInName, detail: t.allInDetail, price: ALL_IN_PACKAGE.price },
  ];

  return (
    <section
      id="tarifs"
      style={{
        backgroundColor: "#F5EDE3",
        paddingTop: "clamp(60px, 10vw, 128px)",
        paddingBottom: "clamp(60px, 10vw, 128px)",
      }}
    >
      <div className="px-6 md:px-8 lg:px-16" style={{ maxWidth: "1280px", margin: "0 auto" }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          style={{ marginBottom: "clamp(40px, 6vw, 64px)" }}
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
              fontSize: "clamp(32px, 4vw, 48px)",
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
              lineHeight: 1.7,
              color: "rgba(44,24,16,0.7)",
              maxWidth: "540px",
              margin: 0,
            }}
          >
            {t.subtitle}
          </p>
        </motion.div>

        {/* Les deux formules */}
        <div
          className="grid-cols-1 md:grid-cols-2"
          style={{
            display: "grid",
            gap: "clamp(16px, 2vw, 24px)",
            marginBottom: "clamp(16px, 2vw, 24px)",
          }}
        >
          {formules.map((formule, i) => (
            <motion.div
              key={formule.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
              style={{
                backgroundColor: "#EDE0D4",
                border: "1px solid rgba(196,149,106,0.25)",
                borderRadius: "4px",
                padding: "clamp(24px, 3vw, 36px)",
                display: "flex",
                flexDirection: "column",
                gap: "0.75rem",
              }}
            >
              <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: "1rem" }}>
                <h3
                  style={{
                    fontFamily: "var(--font-cormorant)",
                    fontWeight: 600,
                    fontSize: "clamp(20px, 2.2vw, 26px)",
                    color: "#2C1810",
                    margin: 0,
                  }}
                >
                  {formule.name}
                </h3>
                <span
                  style={{
                    fontFamily: "var(--font-cormorant)",
                    fontWeight: 600,
                    fontSize: "clamp(28px, 3.2vw, 38px)",
                    color: "#8B3A2A",
                    whiteSpace: "nowrap",
                    fontVariantNumeric: "tabular-nums",
                  }}
                >
                  {formule.price} €
                </span>
              </div>
              <p
                style={{
                  fontFamily: "var(--font-dm-sans)",
                  fontWeight: 300,
                  fontSize: "0.9375rem",
                  lineHeight: 1.65,
                  color: "rgba(44,24,16,0.7)",
                  margin: 0,
                }}
              >
                {formule.detail}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Heure supplémentaire */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          style={{
            display: "flex",
            alignItems: "baseline",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: "0.5rem 1rem",
            padding: "clamp(18px, 2vw, 24px) clamp(24px, 3vw, 36px)",
            border: "1px solid rgba(196,149,106,0.25)",
            borderRadius: "4px",
            marginBottom: "clamp(48px, 7vw, 80px)",
          }}
        >
          <span
            style={{
              fontFamily: "var(--font-dm-sans)",
              fontWeight: 400,
              fontSize: "0.9375rem",
              color: "#2C1810",
            }}
          >
            {t.extraHourName}
            <span style={{ fontWeight: 300, color: "rgba(44,24,16,0.55)" }}> — {t.extraHourDetail}</span>
          </span>
          <span
            style={{
              fontFamily: "var(--font-dm-sans)",
              fontWeight: 500,
              fontSize: "1rem",
              color: "#8B3A2A",
              whiteSpace: "nowrap",
              fontVariantNumeric: "tabular-nums",
            }}
          >
            +{EXTRA_HOUR_PRICE} € <span style={{ fontWeight: 300, fontSize: "0.8125rem" }}>{t.perHour}</span>
          </span>
        </motion.div>

        {/* La carte */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          style={{ marginBottom: "clamp(32px, 4vw, 48px)" }}
        >
          <h3
            style={{
              fontFamily: "var(--font-cormorant)",
              fontStyle: "italic",
              fontWeight: 500,
              fontSize: "clamp(26px, 3vw, 36px)",
              color: "#2C1810",
              margin: "0 0 0.75rem 0",
            }}
          >
            {t.extrasTitle}
          </h3>
          <p
            style={{
              fontFamily: "var(--font-dm-sans)",
              fontWeight: 300,
              fontSize: "0.9375rem",
              color: "rgba(44,24,16,0.65)",
              margin: 0,
            }}
          >
            {t.extrasSubtitle}
          </p>
        </motion.div>

        <div
          className="grid-cols-1 md:grid-cols-2"
          style={{ display: "grid", gap: "clamp(32px, 4vw, 56px)", alignItems: "start" }}
        >
          {COLONNES.map((colonne, i) => (
            <motion.div
              key={colonne.join("-")}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
              style={{ display: "grid", gap: "clamp(28px, 3vw, 40px)" }}
            >
              {colonne.map((categorie) => {
                const items = EXTRAS_CATALOG.filter((extra) => extra.category === categorie);
                if (items.length === 0) return null;
                return (
                  <div key={categorie}>
                <h4
                  style={{
                    fontFamily: "var(--font-dm-sans)",
                    fontWeight: 500,
                    fontSize: "0.6875rem",
                    letterSpacing: "0.15em",
                    textTransform: "uppercase",
                    color: "#C4956A",
                    margin: "0 0 1.25rem 0",
                  }}
                >
                  {t.categories[categorie]}
                </h4>
                <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "grid", gap: "0.875rem" }}>
                  {items.map((extra) => (
                    <li
                      key={extra.id}
                      style={{
                        display: "flex",
                        alignItems: "baseline",
                        justifyContent: "space-between",
                        gap: "1rem",
                        paddingBottom: "0.875rem",
                        borderBottom: "1px solid rgba(196,149,106,0.2)",
                      }}
                    >
                      <span
                        style={{
                          fontFamily: "var(--font-dm-sans)",
                          fontWeight: 300,
                          fontSize: "0.9375rem",
                          lineHeight: 1.5,
                          color: "#2C1810",
                        }}
                      >
                        {labels[extra.id]}
                      </span>
                      <span
                        style={{
                          fontFamily: "var(--font-dm-sans)",
                          fontWeight: 500,
                          fontSize: "0.9375rem",
                          color: "#8B3A2A",
                          whiteSpace: "nowrap",
                          fontVariantNumeric: "tabular-nums",
                        }}
                      >
                        {extra.price} €
                      </span>
                    </li>
                  ))}
                    </ul>
                  </div>
                );
              })}
            </motion.div>
          ))}
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          style={{
            fontFamily: "var(--font-dm-sans)",
            fontWeight: 300,
            fontSize: "0.8125rem",
            color: "rgba(44,24,16,0.5)",
            marginTop: "clamp(32px, 4vw, 48px)",
            marginBottom: 0,
          }}
        >
          {t.vatNote}
        </motion.p>
      </div>
    </section>
  );
}
