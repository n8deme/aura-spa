import type { Lang } from "@/app/_lib/content";
import { LEGAL_COMMON } from "@/lib/legal/i18n";

export function LegalLayout({
  lang,
  title,
  children,
}: {
  lang: Lang;
  title: string;
  children: React.ReactNode;
}) {
  const t = LEGAL_COMMON[lang];

  return (
    <div
      style={{
        backgroundColor: "#F5EDE3",
        minHeight: "100vh",
        paddingTop: "120px",
        paddingBottom: "80px",
      }}
    >
      <div style={{ maxWidth: "768px", margin: "0 auto", padding: "0 24px" }}>
        <h1
          style={{
            fontFamily: "var(--font-cormorant)",
            fontStyle: "italic",
            fontWeight: 500,
            fontSize: "clamp(36px, 5vw, 52px)",
            color: "#2C1810",
            marginBottom: "2rem",
          }}
        >
          {title}
        </h1>

        <div
          style={{
            fontFamily: "var(--font-dm-sans)",
            fontWeight: 300,
            fontSize: "1rem",
            lineHeight: 1.7,
            color: "#2C1810",
            opacity: 0.8,
          }}
        >
          {children}
        </div>

        <a
          href={`/?lang=${lang}`}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "0.5rem",
            fontFamily: "var(--font-dm-sans)",
            fontWeight: 400,
            fontSize: "0.875rem",
            color: "#C4956A",
            textDecoration: "none",
            marginTop: "1rem",
          }}
        >
          {t.backHome}
        </a>
      </div>
    </div>
  );
}

export function LegalSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section style={{ marginBottom: "2.5rem" }}>
      <h2
        style={{
          fontFamily: "var(--font-cormorant)",
          fontWeight: 600,
          fontSize: "1.375rem",
          color: "#2C1810",
          opacity: 1,
          marginBottom: "1rem",
        }}
      >
        {title}
      </h2>
      {children}
    </section>
  );
}
