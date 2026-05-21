"use client";

interface WordmarkProps {
  variant?: "dark" | "light";
  className?: string;
}

export function Wordmark({ variant = "dark", className = "" }: WordmarkProps) {
  const textColor = variant === "light" ? "#F5EDE3" : "#2C1810";
  const accentColor = "#C4956A";

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {/* Galets SVG */}
      <svg
        width="28"
        height="36"
        viewBox="0 0 28 36"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        {/* Galet bas — large */}
        <ellipse cx="14" cy="30" rx="13" ry="5.5" fill={accentColor} opacity="0.9" />
        {/* Galet milieu */}
        <ellipse cx="14" cy="20" rx="10" ry="4.5" fill={accentColor} opacity="0.85" />
        {/* Galet haut — petit */}
        <ellipse cx="14" cy="11" rx="7" ry="3.5" fill={accentColor} opacity="0.8" />
      </svg>

      {/* Texte */}
      <div className="flex flex-col leading-none">
        <span
          style={{
            fontFamily: "var(--font-cormorant)",
            fontStyle: "italic",
            fontWeight: 500,
            fontSize: "1.5rem",
            letterSpacing: "-0.02em",
            color: textColor,
            lineHeight: 1,
          }}
        >
          Aura Spa
        </span>
        <span
          style={{
            fontFamily: "var(--font-dm-sans)",
            fontWeight: 300,
            fontSize: "0.6rem",
            letterSpacing: "0.15em",
            textTransform: "uppercase",
            color: textColor,
            opacity: 0.7,
            lineHeight: 1,
            marginTop: "0.2rem",
          }}
        >
          Espace Privatif
        </span>
      </div>
    </div>
  );
}
