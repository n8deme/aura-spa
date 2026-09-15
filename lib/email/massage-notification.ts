import "server-only";
import { getResend } from "./resend";
import { formatDateLong, formatTime } from "@/lib/booking/format";
import { MASSAGE_NOTIFICATION_EMAILS } from "@/lib/booking/pricing-config";

const FROM_EMAIL = process.env.RESEND_FROM_EMAIL ?? "reservations@aura-spa.be";

export type MassageNotificationBooking = {
  startTime: string;
  guestCount: number;
  massageGuestCount: number;
  customerName: string;
  customerPhone: string | null;
};

// Envoyée à Catherine (+ Junarra dès qu'on a son email, voir
// MASSAGE_NOTIFICATION_EMAILS) à chaque résa confirmée qui inclut un massage.
// Rob voit déjà tout dans l'admin — ceci est un canal dédié, pas un
// remplacement. Aucune mention de durée : Catherine ne veut rien d'affiché
// ni de communiqué sur le temps que ça prend.
export async function sendMassageNotificationEmail(booking: MassageNotificationBooking): Promise<void> {
  const resend = getResend();
  if (!resend) {
    console.warn("Notification massage non envoyée (RESEND_API_KEY absent)");
    return;
  }

  const start = new Date(booking.startTime);
  const { error } = await resend.emails.send({
    from: `Aura Spa <${FROM_EMAIL}>`,
    to: MASSAGE_NOTIFICATION_EMAILS,
    subject: `Massage à prévoir — ${formatDateLong(start)} à ${formatTime(start)}`,
    html: `
      <div style="font-family: 'DM Sans', Arial, sans-serif; padding: 24px; color: #2C1810;">
        <p style="font-size: 16px; font-weight: 600; margin: 0 0 16px;">Nouveau massage réservé</p>
        <p style="font-size: 14px; line-height: 1.6; margin: 0 0 8px;">
          <strong>Date :</strong> ${formatDateLong(start)}<br />
          <strong>Heure :</strong> ${formatTime(start)}<br />
          <strong>Personnes au massage :</strong> ${booking.massageGuestCount}<br />
          <strong>Groupe total au spa :</strong> ${booking.guestCount}
        </p>
        <p style="font-size: 14px; line-height: 1.6; margin: 16px 0 0;">
          <strong>Client :</strong> ${escapeHtml(booking.customerName)}<br />
          ${booking.customerPhone ? `<strong>Téléphone :</strong> ${escapeHtml(booking.customerPhone)}` : ""}
        </p>
      </div>`,
  });

  if (error) {
    console.error("Échec d'envoi de la notification massage :", error);
  }
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
