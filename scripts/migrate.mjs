// Applique les migrations versionnées de migrations/ sur la base pointée par
// DATABASE_URL. Chaque fichier est appliqué une seule fois, dans sa propre
// transaction, et son empreinte SHA-256 est enregistrée dans
// `schema_migrations`.
//
// Usage :
//   npm run db:migrate            applique les migrations en attente
//   npm run db:status             affiche l'état, n'écrit rien
//   npm run db:migrate -- --dry-run --verbose
import { fileURLToPath } from "node:url";
import { neon } from "@neondatabase/serverless";
import { applyMigrations } from "./lib/migrations-runner.mjs";
import { describeDbError, redactDatabaseUrl } from "./lib/migrations.mjs";

const args = new Set(process.argv.slice(2));
const statusOnly = args.has("--status");
const dryRun = statusOnly || args.has("--dry-run");
const verbose = args.has("--verbose");

const colors = process.stdout.isTTY
  ? {
      dim: "\u001b[2m",
      red: "\u001b[31m",
      green: "\u001b[32m",
      yellow: "\u001b[33m",
      reset: "\u001b[0m",
    }
  : { dim: "", red: "", green: "", yellow: "", reset: "" };

const stamp = () => new Date().toISOString();

/** Journal structuré : une ligne par événement, horodatée, sans secret. */
function log(level, message, extra = {}) {
  const labels = {
    info: `${colors.dim}INFO ${colors.reset}`,
    ok: `${colors.green}OK   ${colors.reset}`,
    warn: `${colors.yellow}WARN ${colors.reset}`,
    error: `${colors.red}ERREUR${colors.reset}`,
  };
  const details = Object.entries(extra)
    .filter(([, value]) => value !== null && value !== undefined && value !== "")
    .map(([key, value]) => `\n         ${key}: ${value}`)
    .join("");
  const line = `${colors.dim}${stamp()}${colors.reset} ${labels[level] ?? level} ${message}${details}`;
  if (level === "error" || level === "warn") console.error(line);
  else console.log(line);
}

/** Erreur fatale : champs Postgres/réseau, instruction fautive, piste de diagnostic. */
function reportFailure(error, context = {}) {
  const info = describeDbError(error);
  log("error", context.message ?? "La migration a échoué.", {
    fichier: context.filename,
    instruction: context.statementIndex,
    code: info.code,
    detail: info.detail,
    hint: info.hint,
    position: info.position,
    routine: info.routine,
    message: info.message,
  });

  if (context.statement) {
    const excerpt = context.statement.split("\n").slice(0, 6).join("\n         ");
    console.error(`${colors.dim}         SQL : ${excerpt}${colors.reset}`);
  }

  if (info.network) {
    console.error(
      `${colors.yellow}         La base n'est pas joignable : vérifie DATABASE_URL, ` +
        `l'accès sortant HTTPS (443) vers Neon et le DNS (certains réseaux ` +
        `n'ont pas de route IPv6).${colors.reset}`
    );
  }

  if (verbose && error?.stack) console.error(error.stack);
}

const url = process.env.DATABASE_URL?.trim();
if (!url) {
  log("error", "DATABASE_URL manquant.", {
    piste: "Ajoute-le dans .env.local (voir .env.example).",
  });
  process.exit(1);
}

const dir = fileURLToPath(new URL("../migrations", import.meta.url));
const sql = neon(url);

log("info", `${statusOnly ? "État des migrations" : "Migrations"} — ${redactDatabaseUrl(url)}`);

try {
  const result = await applyMigrations({ sql, dir, log, dryRun });

  for (const migration of result.migrations) {
    const done = result.applied.some((row) => row.version === migration.version);
    log("info", `${migration.filename} — ${done ? "appliquée" : "en attente"}`);
  }

  if (statusOnly) {
    log(
      "info",
      `${result.plan.pending.length} en attente, ${result.applied.length} appliquée(s).`
    );
  } else if (dryRun) {
    log("info", `Simulation : ${result.plan.pending.length} migration(s) seraient appliquées.`);
  } else if (result.appliedNow.length === 0) {
    log("ok", "Déjà à jour, rien à appliquer.");
  } else {
    log(
      "ok",
      `Migration terminée : ${result.appliedNow.length} fichier(s), ` +
        `${result.appliedNow.reduce((total, item) => total + item.durationMs, 0)} ms.`
    );
  }
} catch (error) {
  const info = describeDbError(error);
  // Trois familles : transport, refus Postgres, erreur de nos fichiers.
  const message = info.network
    ? "Connexion à la base impossible."
    : info.code
      ? "La base a refusé la migration."
      : info.message;
  reportFailure(error, { message });
  process.exit(1);
}
