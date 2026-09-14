// Applique un fichier .sql de supabase/migrations/ directement sur la base
// (via POSTGRES_URL_NON_POOLING), en l'absence de la CLI Supabase en local.
// Usage : node scripts/apply-migration.mjs supabase/migrations/<fichier>.sql
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import pg from "pg";

const projectRoot = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const envPath = path.join(projectRoot, ".env.local");
const sqlArg = process.argv[2];

if (!sqlArg) {
  console.error("Usage: node scripts/apply-migration.mjs <path-to-sql-file>");
  process.exit(1);
}

const sqlPath = path.isAbsolute(sqlArg) ? sqlArg : path.join(projectRoot, sqlArg);

const envText = fs.readFileSync(envPath, "utf-8");
const match = envText.match(/^POSTGRES_URL_NON_POOLING="?([^"\n\r]+)"?$/m);
if (!match) {
  console.error("POSTGRES_URL_NON_POOLING introuvable dans .env.local");
  process.exit(1);
}

const sql = fs.readFileSync(sqlPath, "utf-8");
const connectionUrl = new URL(match[1]);
connectionUrl.searchParams.delete("sslmode");
const client = new pg.Client({
  connectionString: connectionUrl.toString(),
  ssl: { rejectUnauthorized: false },
});

async function main() {
  await client.connect();
  await client.query(sql);
  console.log("Migration appliquée avec succès :", sqlArg);
  await client.end();
}

main().catch((err) => {
  console.error("Erreur migration:", err.message);
  process.exit(1);
});
