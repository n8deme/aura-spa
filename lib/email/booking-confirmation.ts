import "server-only";
import { getResend } from "./resend";
import { formatDateLong, formatPrice, formatTime, packageTypeLabel } from "@/lib/booking/format";
import type { PackageType } from "@/lib/booking/types";
import type { Lang } from "@/app/_lib/content";
import { EMAIL_I18N } from "./i18n";
import { CANCELLATION_MIN_HOURS } from "@/lib/booking/pricing-config";

const FROM_EMAIL = process.env.RESEND_FROM_EMAIL ?? "reservations@aura-spa.be";
const CONTACT_EMAIL = "Kamanrobert@icloud.com";
const CONTACT_PHONE = "+32 494 37 90 99";
const SITE_URL = "https://aura-spa.be";
const MAP_URL =
  "https://www.google.com/maps/search/?api=1&query=Steenwagenstraat+121+1820+Melsbroek";

export type ConfirmationEmailBooking = {
  customerName: string;
  customerEmail: string;
  startTime: string;
  packageType: PackageType;
  totalPrice: number;
  // Langue choisie par le client pendant la réservation, transportée jusqu'ici
  // via les métadonnées de la session Stripe.
  lang: Lang;
  // Détail ligne par ligne, reconstruit depuis la base par lineItemsFromBooking.
  lineItems: { label: string; amount: number }[];
};

export async function sendBookingConfirmationEmail(booking: ConfirmationEmailBooking): Promise<void> {
  const resend = getResend();
  if (!resend) {
    console.warn(
      "Email de confirmation non envoyé (RESEND_API_KEY absent) pour",
      booking.customerEmail
    );
    return;
  }

  const start = new Date(booking.startTime);
  const t = EMAIL_I18N[booking.lang];

  // Le détail est reconstruit à partir de la base, le total vient de la colonne
  // `total_price`. Les deux doivent concorder : un écart signifie que la
  // reconstruction a dérivé, et le client recevrait un récapitulatif qui ne
  // correspond pas à ce qu'il a payé. On envoie quand même — mieux vaut un
  // détail imparfait qu'aucune confirmation — mais ça doit se voir dans les logs.
  const sommeLignes = booking.lineItems.reduce((total, item) => total + item.amount, 0);
  if (Math.abs(sommeLignes - booking.totalPrice) > 0.01) {
    console.error(
      `Email de confirmation : le détail (${sommeLignes}) ne correspond pas au montant payé (${booking.totalPrice}) pour ${booking.customerEmail}`
    );
  }
  const { error } = await resend.emails.send({
    from: `Aura Spa <${FROM_EMAIL}>`,
    to: booking.customerEmail,
    subject: t.subject,
    html: renderConfirmationHtml(booking, start),
  });

  if (error) {
    console.error("Échec d'envoi de l'email de confirmation :", error);
  }
}

// Exporté pour pouvoir rendre le gabarit hors envoi (aperçu, vérification visuelle).
export function renderConfirmationHtml(booking: ConfirmationEmailBooking, start: Date): string {
  const { lang } = booking;
  const t = EMAIL_I18N[lang];
  return `
  <div style="font-family: 'DM Sans', Arial, sans-serif; background-color: #F5EDE3; padding: 32px; color: #2C1810;">
    <div style="max-width: 480px; margin: 0 auto; background-color: #FBF5EE; border: 1px solid #D4BBA8; border-radius: 4px; padding: 32px;">
      <p style="font-size: 12px; letter-spacing: 0.15em; text-transform: uppercase; color: #C4956A; margin: 0 0 12px;">Aura Spa</p>
      <h1 style="font-size: 24px; font-style: italic; font-weight: 500; margin: 0 0 16px;">${t.heading}</h1>
      <p style="font-size: 14px; line-height: 1.6; margin: 0 0 24px;">
        ${t.greeting(escapeHtml(booking.customerName))}<br />
        ${t.intro}
      </p>
      <table style="width: 100%; font-size: 14px; border-collapse: collapse;">
        <tr>
          <td style="padding: 8px 0; color: #8C7565;">${t.dateLabel}</td>
          <td style="padding: 8px 0; text-align: right;">${formatDateLong(start, lang)}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; color: #8C7565;">${t.timeLabel}</td>
          <td style="padding: 8px 0; text-align: right;">${formatTime(start, lang)}</td>
        </tr>
        <tr>
          <td colspan="2" style="padding: 14px 0 6px; border-top: 1px solid #EDE0D4;"></td>
        </tr>
        ${booking.lineItems
          .map(
            (item) => `<tr>
          <td style="padding: 6px 0; color: #5C4638;">${escapeHtml(item.label)}</td>
          <td style="padding: 6px 0; text-align: right; color: #5C4638;">${formatPrice(item.amount, lang)}</td>
        </tr>`
          )
          .join("")}
        <tr>
          <td style="padding: 8px 0; border-top: 1px solid #D4BBA8; font-weight: 600;">${t.totalLabel}</td>
          <td style="padding: 8px 0; border-top: 1px solid #D4BBA8; text-align: right; font-weight: 600;">${formatPrice(booking.totalPrice, lang)}</td>
        </tr>
      </table>
      <div style="margin: 28px 0 0; padding: 18px 20px; background-color: #F5EDE3; border-radius: 4px;">
        <p style="font-size: 11px; letter-spacing: 0.12em; text-transform: uppercase; color: #C4956A; margin: 0 0 10px;">${t.practicalTitle}</p>
        <p style="font-size: 13px; line-height: 1.6; margin: 0 0 12px; color: #5C4638;">
          <strong style="font-weight: 600; color: #2C1810;">${t.addressLabel}</strong><br />
          ${t.address}<br />
          <a href="${MAP_URL}" style="color: #8B3A2A; text-decoration: none;">${t.mapLabel} &rarr;</a>
        </p>
        <p style="font-size: 13px; line-height: 1.6; margin: 0 0 12px; color: #5C4638;">
          ${t.cancellation(CANCELLATION_MIN_HOURS)}
        </p>
        <p style="font-size: 13px; line-height: 1.6; margin: 0; color: #5C4638;">
          ${t.questionsLabel}
          <a href="mailto:${CONTACT_EMAIL}" style="color: #8B3A2A; text-decoration: none;">${CONTACT_EMAIL}</a>
          &nbsp;&middot;&nbsp;
          <a href="tel:${CONTACT_PHONE.replace(/\s/g, "")}" style="color: #8B3A2A; text-decoration: none;">${CONTACT_PHONE}</a>
        </p>
      </div>

      <p style="font-size: 13px; line-height: 1.6; margin: 24px 0 0; color: #8C7565;">
        ${t.signoff}<br />${t.team}
      </p>

      <p style="margin: 20px 0 0; padding-top: 16px; border-top: 1px solid #EDE0D4;">
        <a href="${SITE_URL}" style="font-size: 12px; letter-spacing: 0.08em; color: #C4956A; text-decoration: none;">${t.siteLabel} &rarr;</a>
      </p>
    </div>
  </div>`;
}

function escapeHtml(value: string): string {
  return value.replace(/[&<>"']/g, (char) => {
    switch (char) {
      case "&":
        return "&amp;";
      case "<":
        return "&lt;";
      case ">":
        return "&gt;";
      case '"':
        return "&quot;";
      default:
        return "&#39;";
    }
  });
}
