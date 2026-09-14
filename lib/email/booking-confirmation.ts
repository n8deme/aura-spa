import "server-only";
import { getResend } from "./resend";
import { formatDateLong, formatPrice, formatTime, packageTypeLabel } from "@/lib/booking/format";
import type { PackageType } from "@/lib/booking/types";
import type { Lang } from "@/app/_lib/content";
import { EMAIL_I18N } from "./i18n";

const FROM_EMAIL = process.env.RESEND_FROM_EMAIL ?? "reservations@aura-spa.be";

export type ConfirmationEmailBooking = {
  customerName: string;
  customerEmail: string;
  startTime: string;
  packageType: PackageType;
  totalPrice: number;
  // Langue choisie par le client pendant la réservation, transportée jusqu'ici
  // via les métadonnées de la session Stripe.
  lang: Lang;
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

function renderConfirmationHtml(booking: ConfirmationEmailBooking, start: Date): string {
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
          <td style="padding: 8px 0; color: #8C7565;">${t.packageLabel}</td>
          <td style="padding: 8px 0; text-align: right;">${packageTypeLabel(booking.packageType, lang)}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; border-top: 1px solid #D4BBA8; font-weight: 600;">${t.totalLabel}</td>
          <td style="padding: 8px 0; border-top: 1px solid #D4BBA8; text-align: right; font-weight: 600;">${formatPrice(booking.totalPrice, lang)}</td>
        </tr>
      </table>
      <p style="font-size: 13px; line-height: 1.6; margin: 24px 0 0; color: #8C7565;">
        ${t.signoff}<br />${t.team}
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
