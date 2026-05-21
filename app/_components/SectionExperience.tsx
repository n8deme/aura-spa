"use client";

import { motion } from "framer-motion";
import { Waves, Users, Clock } from "lucide-react";
import type { Lang } from "../_lib/content";
import { content } from "../_lib/content";

interface SectionExperienceProps {
  lang: Lang;
}

const icons = [Waves, Users, Clock];

export function SectionExperience({ lang }: SectionExperienceProps) {
  const t = content[lang].experience;

  return (
    <section
      id="experience"
      style={{
        backgroundColor: "#F5EDE3",
        paddingTop: "clamp(60px, 10vw, 128px)",
        paddingBottom: "clamp(60px, 10vw, 128px)",
        position: "relative",
      }}
    >
      <div
        className="px-6 md:px-8 lg:px-16"
        style={{ maxWidth: "1280px", margin: "0 auto" }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "clamp(40px, 6vw, 96px)",
            alignItems: "start",
          }}
          className="grid-cols-1 md:grid-cols-2"
        >
          {/* Gauche */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            style={{ position: "relative" }}
          >
            {/* Grand chiffre décoratif */}
            <div
              aria-hidden="true"
              style={{
                position: "absolute",
                top: "-20px",
                left: "-10px",
                fontFamily: "var(--font-cormorant)",
                fontStyle: "italic",
                fontSize: "clamp(120px, 18vw, 200px)",
                fontWeight: 500,
                color: "rgba(196,149,106,0.12)",
                lineHeight: 1,
                userSelect: "none",
                pointerEvents: "none",
              }}
            >
              200€
            </div>

            <div style={{ position: "relative", zIndex: 1 }}>
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
                  fontSize: "clamp(36px, 4vw, 52px)",
                  lineHeight: 1.1,
                  color: "#2C1810",
                  margin: "0 0 1.5rem 0",
                }}
              >
                {t.headline}
              </h2>
              <p
                style={{
                  fontFamily: "var(--font-dm-sans)",
                  fontWeight: 300,
                  fontSize: "1rem",
                  lineHeight: 1.7,
                  color: "#2C1810",
                  opacity: 0.75,
                  maxWidth: "400px",
                }}
              >
                {t.description}
              </p>
            </div>
          </motion.div>

          {/* Droite — Cards */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "1.25rem",
              marginTop: "-40px",
              position: "relative",
              zIndex: 10,
            }}
          >
            {t.cards.map((card, i) => {
              const Icon = icons[i];
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{
                    duration: 0.6,
                    delay: i * 0.12,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: "1.25rem",
                    padding: "1.5rem",
                    backgroundColor: "#EDE0D4",
                    borderRadius: "4px",
                    border: "1px solid rgba(212,187,168,0.5)",
                    boxShadow: "0 4px 16px rgba(44,24,16,0.04)",
                  }}
                >
                  <div
                    style={{
                      flexShrink: 0,
                      width: "44px",
                      height: "44px",
                      borderRadius: "50%",
                      backgroundColor: "rgba(196,149,106,0.12)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Icon size={20} color="#C4956A" />
                  </div>
                  <div>
                    <h3
                      style={{
                        fontFamily: "var(--font-cormorant)",
                        fontWeight: 600,
                        fontSize: "1.1875rem",
                        color: "#2C1810",
                        margin: "0 0 0.375rem 0",
                      }}
                    >
                      {card.title}
                    </h3>
                    <p
                      style={{
                        fontFamily: "var(--font-dm-sans)",
                        fontWeight: 300,
                        fontSize: "0.875rem",
                        lineHeight: 1.6,
                        color: "#2C1810",
                        opacity: 0.7,
                        margin: 0,
                      }}
                    >
                      {card.description}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
