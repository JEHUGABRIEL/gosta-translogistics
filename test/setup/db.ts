import { fileURLToPath } from "node:url";
import { getDb } from "@/lib/db/client";
import { applyMigrations } from "../../scripts/lib/migrations-runner.mjs";

/** Les tests SQL ne tournent que si une base de test dédiée est fournie. */
export const hasTestDatabase = Boolean(process.env.TEST_DATABASE_URL?.trim());

const migrationsDir = fileURLToPath(new URL("../../migrations", import.meta.url));

let schemaApplied = false;

/**
 * Applique `migrations/` avec le runner de production : le bootstrap des tests
 * valide donc aussi le chemin de migration (découpage SQL, transactions,
 * enregistrement des versions).
 */
export async function ensureSchema() {
  if (schemaApplied) return;
  await applyMigrations({ sql: getDb(), dir: migrationsDir });
  schemaApplied = true;
}

/** Isole chaque test : les compteurs de limitation ne doivent pas fuiter. */
export async function clearRateLimitTable() {
  const sql = getDb();
  await sql`DELETE FROM rate_limits`;
}
