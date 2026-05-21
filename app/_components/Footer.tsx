"use client";

import { Mail } from "lucide-react";

function InstagramIcon({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
      <circle cx="12" cy="12" r="4"/>
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/>
    </svg>
  );
}

function FacebookIcon({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
    </svg>
  );
}
import { Wordmark } from "./Wordmark";
import type { Lang } from "../_lib/content";
import { content } from "../_lib/content";

interface FooterProps {
  lang: Lang;
}

export function Footer({ lang }: FooterProps) {
  const t = content[lang].footer;

  return (
    <footer
      style={{
        backgroundColor: "#2C1810",
        paddingTop: "clamp(48px, 8vw, 80px)",
        paddingBottom: "0",
      }}
    >
      <div
        className="px-6 md:px-8 lg:px-16"
        style={{ maxWidth: "1280px", margin: "0 auto" }}
      >
        {/* Grid 4 colonnes */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "2fr 1fr 1fr 1fr",
            gap: "clamp(32px, 4vw, 64px)",
            paddingBottom: "clamp(40px, 6vw, 64px)",
            borderBottom: "1px solid rgba(245,237,227,0.08)",
          }}
          className="grid-cols-1 sm:grid-cols-2 lg:grid-cols-4"
        >
          {/* Col 1 — Brand */}
          <div>
            <Wordmark variant="light" />
            <p
              style={{
                fontFamily: "var(--font-dm-sans)",
                fontWeight: 300,
                fontSize: "0.8125rem",
                color: "rgba(245,237,227,0.5)",
                marginTop: "1rem",
                letterSpacing: "0.05em",
              }}
            >
              {t.tagline}
            </p>
          </div>

          {/* Col 2 — Navigation */}
          <div>
            <h3
              style={{
                fontFamily: "var(--font-dm-sans)",
                fontWeight: 500,
                fontSize: "0.6875rem",
                letterSpacing: "0.15em",
                textTransform: "uppercase",
                color: "rgba(245,237,227,0.4)",
                margin: "0 0 1.25rem 0",
              }}
            >
              {t.nav.title}
            </h3>
            <nav style={{ display: "flex", flexDirection: "column", gap: "0.625rem" }}>
              {t.nav.links.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  style={{
                    fontFamily: "var(--font-dm-sans)",
                    fontWeight: 300,
                    fontSize: "0.875rem",
                    color: "rgba(245,237,227,0.65)",
                    textDecoration: "none",
                    transition: "color 0.2s",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = "#C4956A")}
                  onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(245,237,227,0.65)")}
                >
                  {link.label}
                </a>
              ))}
            </nav>
          </div>

          {/* Col 3 — Infos pratiques */}
          <div>
            <h3
              style={{
                fontFamily: "var(--font-dm-sans)",
                fontWeight: 500,
                fontSize: "0.6875rem",
                letterSpacing: "0.15em",
                textTransform: "uppercase",
                color: "rgba(245,237,227,0.4)",
                margin: "0 0 1.25rem 0",
              }}
            >
              {t.infos.title}
            </h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.625rem" }}>
              {t.infos.items.map((item, i) => (
                <span
                  key={i}
                  style={{
                    fontFamily: "var(--font-dm-sans)",
                    fontWeight: 300,
                    fontSize: "0.875rem",
                    color: "rgba(245,237,227,0.65)",
                  }}
                >
                  {item}
                </span>
              ))}
            </div>
          </div>

          {/* Col 4 — Contact */}
          <div>
            <h3
              style={{
                fontFamily: "var(--font-dm-sans)",
                fontWeight: 500,
                fontSize: "0.6875rem",
                letterSpacing: "0.15em",
                textTransform: "uppercase",
                color: "rgba(245,237,227,0.4)",
                margin: "0 0 1.25rem 0",
              }}
            >
              {t.contact.title}
            </h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.625rem" }}>
              <a
                href={`mailto:${t.contact.email}`}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  fontFamily: "var(--font-dm-sans)",
                  fontWeight: 300,
                  fontSize: "0.875rem",
                  color: "rgba(245,237,227,0.65)",
                  textDecoration: "none",
                  transition: "color 0.2s",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "#C4956A")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(245,237,227,0.65)")}
              >
                <Mail size={14} />
                {t.contact.email}
              </a>
              <a
                href={t.contact.instagram}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  fontFamily: "var(--font-dm-sans)",
                  fontWeight: 300,
                  fontSize: "0.875rem",
                  color: "rgba(245,237,227,0.65)",
                  textDecoration: "none",
                  transition: "color 0.2s",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "#C4956A")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(245,237,227,0.65)")}
              >
                <InstagramIcon size={14} />
                Instagram
              </a>
              <a
                href={t.contact.facebook}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  fontFamily: "var(--font-dm-sans)",
                  fontWeight: 300,
                  fontSize: "0.875rem",
                  color: "rgba(245,237,227,0.65)",
                  textDecoration: "none",
                  transition: "color 0.2s",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "#C4956A")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(245,237,227,0.65)")}
              >
                <FacebookIcon size={14} />
                Facebook
              </a>
            </div>
          </div>
        </div>

        {/* Barre légale */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: "0.75rem",
            padding: "1.25rem 0",
          }}
        >
          <span
            style={{
              fontFamily: "var(--font-dm-sans)",
              fontWeight: 300,
              fontSize: "0.75rem",
              color: "rgba(245,237,227,0.3)",
            }}
          >
            {t.legal}
          </span>
          <div style={{ display: "flex", gap: "1.5rem", flexWrap: "wrap" }}>
            {t.links.map((link) => (
              <a
                key={link.href}
                href={link.href}
                style={{
                  fontFamily: "var(--font-dm-sans)",
                  fontWeight: 300,
                  fontSize: "0.75rem",
                  color: "rgba(245,237,227,0.3)",
                  textDecoration: "none",
                  transition: "color 0.2s",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "#C4956A")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(245,237,227,0.3)")}
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
