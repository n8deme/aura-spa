import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Aura Spa — Espace Privatif à Bruxelles";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          justifyContent: "flex-end",
          backgroundColor: "#2C1810",
          padding: "60px 80px",
          fontFamily: "serif",
        }}
      >
        {/* Dégradé radial */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "radial-gradient(ellipse 60% 50% at 50% 40%, rgba(196,149,106,0.2) 0%, transparent 70%)",
          }}
        />

        {/* Accent top-right */}
        <div
          style={{
            position: "absolute",
            top: 40,
            right: 80,
            display: "flex",
            alignItems: "center",
            gap: 8,
          }}
        >
          <div
            style={{
              width: 6,
              height: 6,
              borderRadius: "50%",
              backgroundColor: "#C4956A",
            }}
          />
          <span
            style={{
              fontSize: 13,
              fontFamily: "sans-serif",
              fontWeight: 300,
              letterSpacing: "0.15em",
              textTransform: "uppercase",
              color: "rgba(245,237,227,0.5)",
            }}
          >
            BRUXELLES · BELGIQUE
          </span>
        </div>

        {/* Titre */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 12,
            position: "relative",
            zIndex: 1,
          }}
        >
          <span
            style={{
              fontSize: 96,
              fontWeight: 500,
              fontStyle: "italic",
              color: "#F5EDE3",
              lineHeight: 0.95,
              letterSpacing: "-0.02em",
            }}
          >
            Aura Spa
          </span>
          <span
            style={{
              fontSize: 18,
              fontFamily: "sans-serif",
              fontWeight: 300,
              letterSpacing: "0.15em",
              textTransform: "uppercase",
              color: "rgba(245,237,227,0.55)",
            }}
          >
            Espace Privatif
          </span>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              marginTop: 16,
            }}
          >
            <div
              style={{
                padding: "10px 24px",
                backgroundColor: "#C4956A",
                borderRadius: 2,
                fontSize: 15,
                fontFamily: "sans-serif",
                fontWeight: 500,
                color: "#F5EDE3",
              }}
            >
              150€ / 2 heures · 2–4 personnes
            </div>
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
