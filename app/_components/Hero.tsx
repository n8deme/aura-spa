"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import type { Lang } from "../_lib/content";
import { content } from "../_lib/content";

interface HeroProps {
  lang: Lang;
}

const HERO_IMG = "/images/hero.jpg";

export function Hero({ lang }: HeroProps) {
  const t = content[lang].hero;

  return (
    <section
      id="hero"
      style={{
        position: "relative",
        height: "100vh",
        minHeight: "600px",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
      }}
    >
      {/* ── Photo background ── */}
      <Image
        src={HERO_IMG}
        alt="Aura Spa — espace privatif Bruxelles"
        fill
        priority
        sizes="100vw"
        style={{ objectFit: "cover", objectPosition: "center" }}
      />

      {/* ── Overlay gradient chaud du haut vers le bas ── */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(to bottom, rgba(44,24,16,0.45) 0%, rgba(44,24,16,0.55) 50%, rgba(44,24,16,0.82) 100%)",
          zIndex: 1,
        }}
      />

      {/* ── Grain texture animé ── */}
      <svg
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          opacity: 0.06,
          pointerEvents: "none",
          zIndex: 2,
        }}
        aria-hidden="true"
      >
        <filter id="grain-hero">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.65"
            numOctaves="3"
            stitchTiles="stitch"
          >
            <animate
              attributeName="baseFrequency"
              values="0.65;0.75;0.65"
              dur="8s"
              repeatCount="indefinite"
            />
          </feTurbulence>
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width="100%" height="100%" filter="url(#grain-hero)" />
      </svg>

      {/* ── ZONE HAUTE : titre seul, aligné en bas de la zone ── */}
      <div
        style={{
          flex: 1,
          display: "flex",
          alignItems: "flex-end",
          paddingLeft: "8vw",
          paddingBottom: "clamp(24px, 4vh, 48px)",
          position: "relative",
          zIndex: 10,
        }}
      >
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          style={{
            fontFamily: "var(--font-cormorant)",
            fontStyle: "italic",
            fontWeight: 500,
            fontSize: "clamp(64px, 12vw, 160px)",
            lineHeight: 0.9,
            color: "#F5EDE3",
            letterSpacing: "-0.02em",
            margin: 0,
            whiteSpace: "nowrap",
            /* Légère ombre de texte pour lisibilité sur la photo */
            textShadow: "0 2px 40px rgba(44,24,16,0.4)",
          }}
        >
          {t.title[0]}
          <br />
          {t.title[1]}
        </motion.h1>
      </div>

      {/* ── ZONE BASSE : sous-titre + CTAs à gauche / badge à droite ── */}
      <div
        style={{
          position: "relative",
          zIndex: 10,
          display: "flex",
          alignItems: "flex-end",
          justifyContent: "space-between",
          paddingLeft: "8vw",
          paddingRight: "clamp(24px, 4vw, 64px)",
          paddingBottom: "48px",
          gap: "1rem",
        }}
      >
        {/* Sous-titre + CTAs */}
        <div style={{ maxWidth: "520px" }}>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
            style={{
              fontFamily: "var(--font-dm-sans)",
              fontWeight: 300,
              fontSize: "clamp(0.9375rem, 1.5vw, 1.125rem)",
              lineHeight: 1.65,
              color: "#F5EDE3",
              opacity: 0.8,
              marginBottom: "1.5rem",
              whiteSpace: "pre-line",
            }}
          >
            {t.subtitle}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
          >
            <a
              href="#reserver"
              style={{
                display: "inline-flex",
                alignItems: "center",
                padding: "13px 28px",
                backgroundColor: "#C4956A",
                color: "#F5EDE3",
                fontFamily: "var(--font-dm-sans)",
                fontWeight: 500,
                fontSize: "0.9375rem",
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
              {lang === "fr" ? "Réserver" : "Reserveren"}
            </a>
          </motion.div>
        </div>

      </div>
    </section>
  );
}
