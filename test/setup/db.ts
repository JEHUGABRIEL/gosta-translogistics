import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { getDb } from "@/lib/db/client";

/** Les tests SQL ne tournent que si une base de test dédiée est fournie. */
export const hasTestDatabase = Boolean(process.env.TEST_DATABASE_URL?.trim());

let schemaApplied = false;

/**
 * Applique `lib/db/schema.sql` exactement comme `scripts/migrate.mjs` le fait
 * (découpage sur `;`) : le bootstrap des tests valide donc aussi le chemin de
 * migration. Le schéma est idempotent (`IF NOT EXISTS`).
 */
export async function ensureSchema() {
  if (schemaApplied) return;

  const sql = getDb();
  const schemaPath = fileURLToPath(
    new URL("../../lib/db/schema.sql", import.meta.url)
  );
  const statements = readFileSync(schemaPath, "utf8")
    .split(";")
    .map((statement) => statement.trim())
    .filter(Boolean);

  for (const statement of statements) {
    await sql.query(statement);
  }
  schemaApplied = true;
}

/** Isole chaque test : les compteurs de limitation ne doivent pas fuiter. */
export async function clearRateLimitTable() {
  const sql = getDb();
  await sql`DELETE FROM rate_limits`;
}
