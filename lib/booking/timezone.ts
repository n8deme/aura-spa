export const SPA_TIMEZONE = "Europe/Brussels";

// Convertit une date/heure "murale" (ex: 10:00 à Bruxelles) en instant UTC réel,
// en tenant compte du décalage DST. Technique standard : on part d'une estimation
// UTC naïve, on regarde à quelle heure locale elle correspond réellement, puis on
// corrige l'écart.
export function zonedTimeToUtc(dateStr: string, timeStr: string, timeZone: string): Date {
  const [year, month, day] = dateStr.split("-").map(Number);
  const [hour, minute] = timeStr.split(":").map(Number);
  const utcGuess = new Date(Date.UTC(year, month - 1, day, hour, minute));

  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  }).formatToParts(utcGuess);

  const get = (type: string) => Number(parts.find((p) => p.type === type)?.value ?? "0");
  const observedHour = get("hour") % 24; // Intl peut renvoyer "24" pour minuit
  const asUtc = Date.UTC(get("year"), get("month") - 1, get("day"), observedHour, get("minute"), get("second"));
  const diff = asUtc - utcGuess.getTime();
  return new Date(utcGuess.getTime() - diff);
}
