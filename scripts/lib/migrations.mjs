// Outils purs du système de migrations : lecture de fichiers, découpage SQL
// conscient des chaînes et des blocs `$tag$`, sommes de contrôle, plan
// d'application. Aucun accès réseau ici — tout est testable hors ligne
// (`test/migrations.test.ts`).
import { createHash } from "node:crypto";
import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";

/** Table de suivi, créée par le runner avant la première migration. */
export const MIGRATIONS_TABLE = "schema_migrations";

/** `0001_initial_schema.sql` -> { version: 1, name: "initial_schema" }. */
const FILENAME_PATTERN = /^(\d{4})_([a-z0-9]+(?:_[a-z0-9]+)*)\.sql$/;

export function parseMigrationFilename(filename) {
  const match = FILENAME_PATTERN.exec(filename);
  if (!match) return null;
  return {
    version: Number(match[1]),
    name: match[2],
    filename,
  };
}

/**
 * Normalise les fins de ligne avant hachage : le même fichier récupéré sous
 * Windows ne doit pas être vu comme modifié.
 */
export function normalizeSource(source) {
  return source.replace(/\r\n?/g, "\n");
}

export function checksum(source) {
  return createHash("sha256").update(normalizeSource(source), "utf8").digest("hex");
}

/**
 * Découpe un fichier SQL en instructions.
 *
 * Le découpage naïf sur `;` casse dès qu'un point-virgule apparaît dans un
 * commentaire, une chaîne ou un bloc `$$ ... $$` (fonctions, blocs `DO`). Ici
 * on suit l'état lexical du fichier : chaînes `'…'` (avec `''`), identifiants
 * `"…"`, commentaires `--` et `/* … *​/`, et citations `$tag$ … $tag$`.
 */
export function splitStatements(source) {
  const text = normalizeSource(source);
  const statements = [];
  let current = "";
  let state = "normal"; // normal | line | block | single | double | dollar
  let dollarTag = "";
  let index = 0;

  const push = () => {
    if (hasSql(current)) statements.push(current.trim());
    current = "";
  };

  while (index < text.length) {
    const char = text[index];
    const next = text[index + 1];

    if (state === "line") {
      current += char;
      if (char === "\n") state = "normal";
      index += 1;
      continue;
    }

    if (state === "block") {
      if (char === "*" && next === "/") {
        current += "*/";
        index += 2;
        state = "normal";
        continue;
      }
      current += char;
      index += 1;
      continue;
    }

    if (state === "single") {
      if (char === "'" && next === "'") {
        current += "''";
        index += 2;
        continue;
      }
      current += char;
      if (char === "'") state = "normal";
      index += 1;
      continue;
    }

    if (state === "double") {
      if (char === '"' && next === '"') {
        current += '""';
        index += 2;
        continue;
      }
      current += char;
      if (char === '"') state = "normal";
      index += 1;
      continue;
    }

    if (state === "dollar") {
      if (text.startsWith(dollarTag, index)) {
        current += dollarTag;
        index += dollarTag.length;
        state = "normal";
        continue;
      }
      current += char;
      index += 1;
      continue;
    }

    // state === "normal"
    if (char === "-" && next === "-") {
      current += "--";
      index += 2;
      state = "line";
      continue;
    }

    if (char === "/" && next === "*") {
      current += "/*";
      index += 2;
      state = "block";
      continue;
    }

    if (char === "'") {
      current += char;
      index += 1;
      state = "single";
      continue;
    }

    if (char === '"') {
      current += char;
      index += 1;
      state = "double";
      continue;
    }

    if (char === "$") {
      const tag = /^\$[A-Za-z_][A-Za-z0-9_]*\$|^\$\$/.exec(text.slice(index));
      if (tag) {
        dollarTag = tag[0];
        current += dollarTag;
        index += dollarTag.length;
        state = "dollar";
        continue;
      }
    }

    if (char === ";") {
      push();
      index += 1;
      continue;
    }

    current += char;
    index += 1;
  }

  push();
  return statements;
}

/** Vrai si le fragment contient autre chose que des blancs et des commentaires. */
export function hasSql(fragment) {
  return stripComments(fragment).trim().length > 0;
}

function stripComments(fragment) {
  return fragment
    .replace(/\/\*[\s\S]*?\*\//g, " ")
    .replace(/--[^\n]*/g, " ");
}

/**
 * Charge les migrations d'un dossier : triées par version, versions uniques et
 * contiguës à partir de 1 (une version sautée est une erreur de nommage, pas
 * une migration future).
 */
export function loadMigrations(dir) {
  const filenames = readdirSync(dir)
    .filter((filename) => filename.endsWith(".sql"))
    .sort();

  const migrations = [];
  const seen = new Set();

  for (const filename of filenames) {
    const parsed = parseMigrationFilename(filename);
    if (!parsed) {
      throw new Error(
        `Nom de migration invalide : ${filename} — attendu 0001_nom_en_minuscules.sql.`
      );
    }
    if (seen.has(parsed.version)) {
      throw new Error(`Version ${parsed.version} en double (${filename}).`);
    }
    seen.add(parsed.version);

    const source = readFileSync(join(dir, filename), "utf8");
    const statements = splitStatements(source);
    if (statements.length === 0) {
      throw new Error(`Migration vide : ${filename}.`);
    }

    migrations.push({
      ...parsed,
      source,
      checksum: checksum(source),
      statements,
    });
  }

  migrations.sort((a, b) => a.version - b.version);

  for (const [position, migration] of migrations.entries()) {
    const expected = position + 1;
    if (migration.version !== expected) {
      throw new Error(
        `Numérotation non contiguë : ${String(expected).padStart(4, "0")} attendu, ` +
          `${migration.filename} trouvé.`
      );
    }
  }

  return migrations;
}

/**
 * Compare les fichiers aux lignes de `schema_migrations`.
 * - `pending` : jamais appliquées ;
 * - `changed` : appliquées puis modifiées (somme de contrôle différente) ;
 * - `orphaned` : appliquées mais absentes du dossier.
 */
export function planMigrations(migrations, appliedRows) {
  const applied = new Map(
    appliedRows.map((row) => [Number(row.version), row])
  );

  const pending = migrations.filter((migration) => !applied.has(migration.version));
  const changed = migrations
    .filter((migration) => {
      const row = applied.get(migration.version);
      return row && row.checksum !== migration.checksum;
    })
    .map((migration) => ({
      ...migration,
      appliedChecksum: applied.get(migration.version).checksum,
    }));
  const known = new Set(migrations.map((migration) => migration.version));
  const orphaned = appliedRows.filter((row) => !known.has(Number(row.version)));

  return { pending, changed, orphaned };
}

/** Masque le mot de passe d'une chaîne de connexion avant de la journaliser. */
export function redactDatabaseUrl(url) {
  try {
    const parsed = new URL(url);
    if (parsed.password) parsed.password = "***";
    return parsed.toString();
  } catch {
    return "<DATABASE_URL illisible>";
  }
}

/**
 * Champs utiles d'une erreur Postgres ou réseau. Le pilote Neon renvoie des
 * `NeonDbError` sans `code` pour les échecs de transport : on les reconnaît au
 * message (`fetch failed`, `ETIMEDOUT`, `ENETUNREACH`, …).
 */
export function describeDbError(error) {
  const message = String(error?.message ?? error);
  return {
    message,
    code: error?.code ?? null,
    detail: error?.detail ?? null,
    hint: error?.hint ?? null,
    position: error?.position ?? null,
    where: error?.where ?? null,
    routine: error?.routine ?? null,
    network:
      /fetch failed|Error connecting to database|Failed to parse URL|ETIMEDOUT|ENETUNREACH|ENOTFOUND|ECONNREFUSED|ECONNRESET|getaddrinfo|EAI_AGAIN/i.test(
        message
      ),
  };
}
