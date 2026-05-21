"use client";

// TODO: remplacer par les vrais témoignages clients

import { motion } from "framer-motion";
import { Star } from "lucide-react";
import type { Lang } from "../_lib/content";
import { content } from "../_lib/content";

interface SectionTestimonialsProps {
  lang: Lang;
}

export function SectionTestimonials({ lang }: SectionTestimonialsProps) {
  const t = content[lang].testimonials;

  return (
    <section
      id="temoignages"
      style={{
        backgroundColor: "#F5EDE3",
        paddingTop: "clamp(60px, 10vw, 128px)",
        paddingBottom: "clamp(60px, 10vw, 128px)",
      }}
    >
      <div
        className="px-6 md:px-8 lg:px-16"
        style={{ maxWidth: "1280px", margin: "0 auto" }}
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          style={{ marginBottom: "clamp(40px, 6vw, 64px)" }}
        >
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
            {t.sectionTitle}
          </h2>
        </motion.div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: "1.5rem",
          }}
          className="grid-cols-1 md:grid-cols-3"
        >
          {t.items.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{
                duration: 0.6,
                delay: i * 0.1,
                ease: [0.22, 1, 0.36, 1],
              }}
              style={{
                padding: "2rem",
                backgroundColor: "#EDE0D4",
                borderRadius: "4px",
                border: "1px solid rgba(212,187,168,0.4)",
                display: "flex",
                flexDirection: "column",
                gap: "1rem",
              }}
            >
              {/* Étoiles */}
              <div style={{ display: "flex", gap: "3px" }}>
                {[...Array(5)].map((_, s) => (
                  <Star
                    key={s}
                    size={14}
                    color="#C4956A"
                    fill="#C4956A"
                  />
                ))}
              </div>

              <p
                style={{
                  fontFamily: "var(--font-cormorant)",
                  fontStyle: "italic",
                  fontWeight: 400,
                  fontSize: "1.125rem",
                  lineHeight: 1.6,
                  color: "#2C1810",
                  margin: 0,
                  flexGrow: 1,
                }}
              >
                &ldquo;{item.text}&rdquo;
              </p>

              <div>
                <p
                  style={{
                    fontFamily: "var(--font-dm-sans)",
                    fontWeight: 500,
                    fontSize: "0.875rem",
                    color: "#2C1810",
                    margin: "0 0 0.125rem 0",
                  }}
                >
                  {item.author}
                </p>
                <p
                  style={{
                    fontFamily: "var(--font-dm-sans)",
                    fontWeight: 300,
                    fontSize: "0.75rem",
                    color: "#2C1810",
                    opacity: 0.55,
                    margin: 0,
                  }}
                >
                  {item.location}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
