// Exécution des migrations versionnées. Partagé par le CLI
// (`scripts/migrate.mjs`) et par le bootstrap des tests (`test/setup/db.ts`) :
// les deux passent par exactement le même chemin.
import { MIGRATIONS_TABLE, loadMigrations, planMigrations } from "./migrations.mjs";

/** Le suivi existe-t-il déjà ? (lecture seule, pour `--status`). */
export async function schemaMigrationsExists(sql) {
  const rows = await sql.query(
    `SELECT to_regclass('public.${MIGRATIONS_TABLE}') AS name`
  );
  return Boolean(rows[0]?.name);
}

export async function ensureMigrationsTable(sql) {
  await sql.query(
    `CREATE TABLE IF NOT EXISTS ${MIGRATIONS_TABLE} (
       version INTEGER PRIMARY KEY,
       name TEXT NOT NULL,
       checksum TEXT NOT NULL,
       applied_at TIMESTAMPTZ NOT NULL DEFAULT now()
     )`
  );
}

export async function readAppliedMigrations(sql) {
  const rows = await sql.query(
    `SELECT version, name, checksum, applied_at FROM ${MIGRATIONS_TABLE} ORDER BY version`
  );
  return rows.map((row) => ({
    version: Number(row.version),
    name: row.name,
    checksum: row.checksum,
    appliedAt: row.applied_at,
  }));
}

/**
 * Applique les migrations en attente, dans l'ordre, une transaction par
 * fichier : les instructions et l'enregistrement dans `schema_migrations`
 * commitent ensemble, donc une migration en échec ne laisse rien derrière elle.
 *
 * Lève une erreur si une migration déjà appliquée a été modifiée : c'est le
 * garde-fou contre les corrections « en douce » d'un fichier historique.
 */
export async function applyMigrations({
  sql,
  dir,
  log = () => {},
  dryRun = false,
}) {
  const migrations = loadMigrations(dir);

  const tableExists = await schemaMigrationsExists(sql);
  const applied = tableExists ? await readAppliedMigrations(sql) : [];
  const plan = planMigrations(migrations, applied);

  if (!tableExists && !dryRun) {
    await ensureMigrationsTable(sql);
  }

  if (plan.changed.length > 0) {
    const list = plan.changed
      .map((migration) => `${migration.filename}`)
      .join(", ");
    throw new Error(
      `Migration(s) déjà appliquée(s) puis modifiée(s) : ${list}. ` +
        `Ne jamais éditer un fichier historique : ajoute une nouvelle migration.`
    );
  }

  for (const row of plan.orphaned) {
    log("warn", `Migration ${row.version} (${row.name}) appliquée mais absente du dossier.`);
  }

  if (dryRun) {
    return { migrations, applied, plan, appliedNow: [] };
  }

  const appliedNow = [];

  for (const migration of plan.pending) {
    const startedAt = Date.now();
    await sql.transaction((txn) => [
      ...migration.statements.map((statement) => txn`${txn.unsafe(statement)}`),
      txn`INSERT INTO ${txn.unsafe(MIGRATIONS_TABLE)} (version, name, checksum)
          VALUES (${migration.version}, ${migration.name}, ${migration.checksum})`,
    ]);
    const durationMs = Date.now() - startedAt;
    appliedNow.push({ ...migration, durationMs });
    log("ok", `${migration.filename} (${migration.statements.length} instruction(s), ${durationMs} ms)`);
  }

  // Relit le suivi pour que l'appelant voie l'état d'après application.
  const appliedAfter =
    appliedNow.length > 0 ? await readAppliedMigrations(sql) : applied;

  return { migrations, applied: appliedAfter, plan, appliedNow };
}
