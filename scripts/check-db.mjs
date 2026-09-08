// Vérifie que les tables de réservation existent avec la RLS activée.
// Usage : node scripts/check-db.mjs
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import pg from "pg";

const projectRoot = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const envText = fs.readFileSync(path.join(projectRoot, ".env.local"), "utf-8");
const match = envText.match(/^POSTGRES_URL_NON_POOLING="?([^"\n\r]+)"?$/m);
if (!match) {
  console.error("POSTGRES_URL_NON_POOLING introuvable dans .env.local");
  process.exit(1);
}

const url = new URL(match[1]);
url.searchParams.delete("sslmode");
const client = new pg.Client({ connectionString: url.toString(), ssl: { rejectUnauthorized: false } });

async function main() {
  await client.connect();
  const res = await client.query(
    "select tablename, rowsecurity from pg_tables where tablename in ('bookings','booking_extras') order by tablename"
  );
  console.table(res.rows);
  await client.end();
}

main().catch((err) => {
  console.error("Erreur:", err.message);
  process.exit(1);
});
