"use client";

import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { Wordmark } from "./Wordmark";
import type { Lang } from "../_lib/content";
import { content } from "../_lib/content";

interface NavProps {
  lang: Lang;
  onLangChange: (lang: Lang) => void;
}

export function Nav({ lang, onLangChange }: NavProps) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const t = content[lang].nav;

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { label: t.experience, href: "#experience" },
    { label: t.lieu, href: "#lieu" },
    { label: t.tarif, href: "#reserver" },
  ];

  const headerStyle: React.CSSProperties = {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 50,
    transition: "background-color 0.3s ease-out, backdrop-filter 0.3s ease-out, border-color 0.3s ease-out, box-shadow 0.3s ease-out",
    backgroundColor: scrolled ? "rgba(44,24,16,0.65)" : "transparent",
    backdropFilter: scrolled ? "blur(20px) saturate(1.4)" : "none",
    WebkitBackdropFilter: scrolled ? "blur(20px) saturate(1.4)" : "none",
    borderBottom: scrolled
      ? "1px solid rgba(255,255,255,0.08)"
      : "1px solid transparent",
    boxShadow: scrolled ? "0 1px 24px rgba(44,24,16,0.2)" : "none",
  };

  return (
    <header style={headerStyle}>
      <nav className="max-w-7xl mx-auto px-6 md:px-8 lg:px-16 h-16 md:h-20 flex items-center justify-between">
        <a href="#" aria-label="Aura Spa — Accueil">
          {/* Wordmark toujours en version light car fond toujours sombre (photo ou verre teinté) */}
          <Wordmark variant="light" />
        </a>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <a
              key={link.href + link.label}
              href={link.href}
              style={{
                fontFamily: "var(--font-dm-sans)",
                fontWeight: 400,
                fontSize: "0.875rem",
                letterSpacing: "0.02em",
                color: "#F5EDE3",
                textDecoration: "none",
                opacity: 0.8,
                transition: "opacity 0.2s",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.opacity = "1")}
              onMouseLeave={(e) => (e.currentTarget.style.opacity = "0.8")}
            >
              {link.label}
            </a>
          ))}

          {/* Lang toggle */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "2px",
              fontFamily: "var(--font-dm-sans)",
              fontSize: "0.75rem",
              letterSpacing: "0.05em",
            }}
          >
            <button
              onClick={() => onLangChange("fr")}
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                padding: "4px 6px",
                color: "#F5EDE3",
                fontWeight: lang === "fr" ? 600 : 300,
                opacity: lang === "fr" ? 1 : 0.45,
                transition: "opacity 0.2s",
              }}
            >
              FR
            </button>
            <span style={{ color: "rgba(245,237,227,0.25)", userSelect: "none" }}>|</span>
            <button
              onClick={() => onLangChange("nl")}
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                padding: "4px 6px",
                color: "#F5EDE3",
                fontWeight: lang === "nl" ? 600 : 300,
                opacity: lang === "nl" ? 1 : 0.45,
                transition: "opacity 0.2s",
              }}
            >
              NL
            </button>
          </div>

          {/* CTA Réserver */}
          <a
            href="#reserver"
            style={{
              display: "inline-flex",
              alignItems: "center",
              padding: "10px 24px",
              backgroundColor: "#C4956A",
              color: "#F5EDE3",
              fontFamily: "var(--font-dm-sans)",
              fontWeight: 500,
              fontSize: "0.875rem",
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
            {t.reserver}
          </a>
        </div>

        {/* Mobile burger — toujours en clair */}
        <button
          className="md:hidden"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label={menuOpen ? "Fermer le menu" : "Ouvrir le menu"}
          style={{
            color: "#F5EDE3",
            background: "none",
            border: "none",
            cursor: "pointer",
          }}
        >
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </nav>

      {/* Mobile menu — verre teinté sombre */}
      {menuOpen && (
        <div
          style={{
            backgroundColor: "rgba(44,24,16,0.92)",
            backdropFilter: "blur(20px)",
            WebkitBackdropFilter: "blur(20px)",
            borderTop: "1px solid rgba(255,255,255,0.07)",
            padding: "28px 24px",
          }}
        >
          <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            {navLinks.map((link) => (
              <a
                key={link.href + link.label}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                style={{
                  fontFamily: "var(--font-dm-sans)",
                  fontWeight: 400,
                  fontSize: "1.0625rem",
                  color: "#F5EDE3",
                  textDecoration: "none",
                  opacity: 0.85,
                }}
              >
                {link.label}
              </a>
            ))}

            <div
              style={{
                display: "flex",
                gap: "8px",
                paddingTop: "4px",
                alignItems: "center",
              }}
            >
              <button
                onClick={() => onLangChange("fr")}
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  fontFamily: "var(--font-dm-sans)",
                  fontSize: "0.875rem",
                  color: "#F5EDE3",
                  fontWeight: lang === "fr" ? 600 : 300,
                  opacity: lang === "fr" ? 1 : 0.45,
                }}
              >
                FR
              </button>
              <span style={{ color: "rgba(245,237,227,0.25)" }}>|</span>
              <button
                onClick={() => onLangChange("nl")}
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  fontFamily: "var(--font-dm-sans)",
                  fontSize: "0.875rem",
                  color: "#F5EDE3",
                  fontWeight: lang === "nl" ? 600 : 300,
                  opacity: lang === "nl" ? 1 : 0.45,
                }}
              >
                NL
              </button>
            </div>

            <a
              href="#reserver"
              onClick={() => setMenuOpen(false)}
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "13px 24px",
                backgroundColor: "#C4956A",
                color: "#F5EDE3",
                fontFamily: "var(--font-dm-sans)",
                fontWeight: 500,
                fontSize: "0.9375rem",
                textDecoration: "none",
                borderRadius: "2px",
              }}
            >
              {t.reserver}
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
