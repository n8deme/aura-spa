"use client";

import { motion } from "framer-motion";
import { Play } from "lucide-react";
import type { Lang } from "../_lib/content";
import { content } from "../_lib/content";

interface SectionLieuProps {
  lang: Lang;
}

export function SectionLieu({ lang }: SectionLieuProps) {
  const t = content[lang].lieu;

  return (
    <section
      id="lieu"
      style={{
        backgroundColor: "#2C1810",
        paddingTop: "clamp(60px, 10vw, 128px)",
        paddingBottom: "clamp(60px, 10vw, 128px)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div
        className="px-6 md:px-8 lg:px-16"
        style={{ maxWidth: "1280px", margin: "0 auto" }}
      >
        <div
          style={{
            display: "grid",
            /* Colonne texte légèrement plus large pour créer l'overlap naturel */
            gridTemplateColumns: "1fr 1.5fr",
            gap: "0",
            alignItems: "center",
          }}
          className="lieu-grid"
        >
          {/* Gauche — texte, avance de 32px sur la vidéo via marginRight négatif */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            style={{
              position: "relative",
              zIndex: 2,
              /* Overlap sur desktop : le bloc texte empiète de 32px sur la vidéo */
              marginRight: "-32px",
              paddingRight: "clamp(24px, 4vw, 64px)",
            }}
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
                marginBottom: "1rem",
              }}
            >
              {t.sectionTitle}
            </span>
            <h2
              style={{
                fontFamily: "var(--font-cormorant)",
                fontStyle: "italic",
                fontWeight: 500,
                fontSize: "clamp(40px, 5vw, 64px)",
                lineHeight: 1.0,
                color: "#F5EDE3",
                margin: "0 0 1.5rem 0",
              }}
            >
              {t.title[0]}
              <br />
              {t.title[1]}
            </h2>
            <p
              style={{
                fontFamily: "var(--font-dm-sans)",
                fontWeight: 300,
                fontSize: "1rem",
                lineHeight: 1.7,
                color: "#F5EDE3",
                opacity: 0.65,
                maxWidth: "360px",
              }}
            >
              {t.description}
            </p>
          </motion.div>

          {/* Droite — vidéo placeholder, z-index 1 (derrière le texte) */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
            style={{ position: "relative", zIndex: 1 }}
          >
            {/* Zone vidéo 16:9 */}
            <div
              style={{
                position: "relative",
                aspectRatio: "16 / 9",
                backgroundColor: "#3D2318",
                borderRadius: "8px",
                overflow: "hidden",
                border: "1px solid rgba(196,149,106,0.15)",
              }}
            >
              {/* Grain */}
              <svg
                style={{
                  position: "absolute",
                  inset: 0,
                  width: "100%",
                  height: "100%",
                  opacity: 0.06,
                  pointerEvents: "none",
                }}
                aria-hidden="true"
              >
                <filter id="grain-lieu">
                  <feTurbulence
                    type="fractalNoise"
                    baseFrequency="0.7"
                    numOctaves="3"
                    stitchTiles="stitch"
                  />
                  <feColorMatrix type="saturate" values="0" />
                </filter>
                <rect width="100%" height="100%" filter="url(#grain-lieu)" />
              </svg>

              {/* Contenu placeholder */}
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "1rem",
                }}
              >
                <div
                  style={{
                    width: "64px",
                    height: "64px",
                    borderRadius: "50%",
                    backgroundColor: "rgba(196,149,106,0.15)",
                    border: "1px solid rgba(196,149,106,0.3)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Play size={24} color="#C4956A" fill="#C4956A" />
                </div>
                <p
                  style={{
                    fontFamily: "var(--font-dm-sans)",
                    fontWeight: 300,
                    fontSize: "0.8125rem",
                    letterSpacing: "0.05em",
                    color: "rgba(245,237,227,0.4)",
                    textAlign: "center",
                    margin: 0,
                    padding: "0 1rem",
                  }}
                >
                  {t.videoPlaceholder}
                </p>
              </div>
            </div>

            {/* Stats en bas */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginTop: "1.5rem",
              }}
            >
              {t.stats.map((stat, i) => (
                <span key={i} style={{ display: "flex", alignItems: "center" }}>
                  <span
                    style={{
                      fontFamily: "var(--font-dm-sans)",
                      fontWeight: 400,
                      fontSize: "0.6875rem",
                      letterSpacing: "0.2em",
                      textTransform: "uppercase",
                      color: "rgba(245,237,227,0.45)",
                    }}
                  >
                    {stat}
                  </span>
                  {i < t.stats.length - 1 && (
                    <span
                      style={{
                        margin: "0 16px",
                        color: "rgba(196,149,106,0.3)",
                        fontSize: "0.75rem",
                      }}
                    >
                      ·
                    </span>
                  )}
                </span>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
