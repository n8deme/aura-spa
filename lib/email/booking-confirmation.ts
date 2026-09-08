import "server-only";
import { getResend } from "./resend";
import { formatDateLong, formatPrice, formatTime, packageTypeLabel } from "@/lib/booking/format";
import type { PackageType } from "@/lib/booking/types";

const FROM_EMAIL = process.env.RESEND_FROM_EMAIL ?? "reservations@auraspa.be";

export type ConfirmationEmailBooking = {
  customerName: string;
  customerEmail: string;
  startTime: string;
  packageType: PackageType;
  totalPrice: number;
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
  const { error } = await resend.emails.send({
    from: `Aura Spa <${FROM_EMAIL}>`,
    to: booking.customerEmail,
    subject: "Votre réservation Aura Spa est confirmée",
    html: renderConfirmationHtml(booking, start),
  });

  if (error) {
    console.error("Échec d'envoi de l'email de confirmation :", error);
  }
}

function renderConfirmationHtml(booking: ConfirmationEmailBooking, start: Date): string {
  return `
  <div style="font-family: 'DM Sans', Arial, sans-serif; background-color: #F5EDE3; padding: 32px; color: #2C1810;">
    <div style="max-width: 480px; margin: 0 auto; background-color: #FBF5EE; border: 1px solid #D4BBA8; border-radius: 4px; padding: 32px;">
      <p style="font-size: 12px; letter-spacing: 0.15em; text-transform: uppercase; color: #C4956A; margin: 0 0 12px;">Aura Spa</p>
      <h1 style="font-size: 24px; font-style: italic; font-weight: 500; margin: 0 0 16px;">Réservation confirmée</h1>
      <p style="font-size: 14px; line-height: 1.6; margin: 0 0 24px;">
        Bonjour ${escapeHtml(booking.customerName)},<br />
        Votre réservation est confirmée. Voici le récapitulatif :
      </p>
      <table style="width: 100%; font-size: 14px; border-collapse: collapse;">
        <tr>
          <td style="padding: 8px 0; color: #8C7565;">Date</td>
          <td style="padding: 8px 0; text-align: right;">${formatDateLong(start)}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; color: #8C7565;">Heure</td>
          <td style="padding: 8px 0; text-align: right;">${formatTime(start)}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; color: #8C7565;">Formule</td>
          <td style="padding: 8px 0; text-align: right;">${packageTypeLabel(booking.packageType)}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; border-top: 1px solid #D4BBA8; font-weight: 600;">Total payé</td>
          <td style="padding: 8px 0; border-top: 1px solid #D4BBA8; text-align: right; font-weight: 600;">${formatPrice(booking.totalPrice)}</td>
        </tr>
      </table>
      <p style="font-size: 13px; line-height: 1.6; margin: 24px 0 0; color: #8C7565;">
        À très vite,<br />L'équipe Aura Spa
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
