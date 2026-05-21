"use client";

import { motion } from "framer-motion";
import type { Lang } from "../_lib/content";
import { content } from "../_lib/content";

interface SectionHowItWorksProps {
  lang: Lang;
}

export function SectionHowItWorks({ lang }: SectionHowItWorksProps) {
  const t = content[lang].howItWorks;

  return (
    <section
      id="comment-ca-marche"
      style={{
        backgroundColor: "#EDE0D4",
        paddingTop: "clamp(60px, 10vw, 128px)",
        paddingBottom: "clamp(60px, 10vw, 128px)",
      }}
    >
      <div
        className="px-6 md:px-8 lg:px-16"
        style={{ maxWidth: "1280px", margin: "0 auto" }}
      >
        {/* Titre section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          style={{ marginBottom: "clamp(48px, 8vw, 80px)" }}
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
              margin: 0,
            }}
          >
            Simple comme bonjour.
          </h2>
        </motion.div>

        {/* Steps layout */}
        <div
          style={{
            position: "relative",
          }}
        >
          {/* Ligne horizontale — desktop uniquement */}
          <div
            aria-hidden="true"
            className="hidden md:block"
            style={{
              position: "absolute",
              top: "32px",
              left: "calc(12.5%)",
              right: "calc(12.5%)",
              height: "1px",
              backgroundColor: "rgba(196,149,106,0.3)",
              zIndex: 0,
            }}
          />

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(4, 1fr)",
              gap: "clamp(24px, 4vw, 48px)",
            }}
            className="grid-cols-1 md:grid-cols-4"
          >
            {t.steps.map((step, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{
                  duration: 0.6,
                  delay: i * 0.12,
                  ease: [0.22, 1, 0.36, 1],
                }}
                style={{
                  position: "relative",
                  textAlign: "center",
                  paddingTop: "8px",
                }}
              >
                {/* Cercle numéroté */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginBottom: "1.5rem",
                  }}
                >
                  <div
                    style={{
                      width: "64px",
                      height: "64px",
                      borderRadius: "50%",
                      backgroundColor: "#F5EDE3",
                      border: "1px solid rgba(196,149,106,0.3)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    <span
                      style={{
                        fontFamily: "var(--font-cormorant)",
                        fontStyle: "italic",
                        fontSize: "1.25rem",
                        fontWeight: 600,
                        color: "#C4956A",
                        lineHeight: 1,
                      }}
                    >
                      {step.number}
                    </span>
                  </div>
                </div>

                <h3
                  style={{
                    fontFamily: "var(--font-cormorant)",
                    fontWeight: 600,
                    fontSize: "1.125rem",
                    color: "#2C1810",
                    margin: "0 0 0.625rem 0",
                  }}
                >
                  {step.title}
                </h3>
                <p
                  style={{
                    fontFamily: "var(--font-dm-sans)",
                    fontWeight: 300,
                    fontSize: "0.875rem",
                    lineHeight: 1.65,
                    color: "#2C1810",
                    opacity: 0.7,
                    margin: 0,
                  }}
                >
                  {step.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
