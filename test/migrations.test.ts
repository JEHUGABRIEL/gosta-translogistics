import { describe, expect, it } from "vitest";
import { fileURLToPath } from "node:url";
import {
  checksum,
  describeDbError,
  loadMigrations,
  parseMigrationFilename,
  planMigrations,
  redactDatabaseUrl,
  splitStatements,
} from "../scripts/lib/migrations.mjs";

const migrationsDir = fileURLToPath(new URL("../migrations", import.meta.url));

describe("découpage SQL", () => {
  it("sépare les instructions et ignore les points-virgules terminaux", () => {
    const statements = splitStatements("CREATE TABLE a (id INT);\n\nSELECT 1;\n");
    expect(statements).toHaveLength(2);
    expect(statements[0]).toBe("CREATE TABLE a (id INT)");
    expect(statements[1]).toBe("SELECT 1");
  });

  it("ne coupe pas dans une chaîne ni dans un identifiant", () => {
    const statements = splitStatements(
      "INSERT INTO t (a) VALUES ('un;deux'); SELECT \"b;c\" FROM t;"
    );
    expect(statements).toHaveLength(2);
    expect(statements[0]).toContain("'un;deux'");
    expect(statements[1]).toContain('"b;c"');
  });

  it("gère les guillemets doublés", () => {
    const statements = splitStatements("SELECT 'l''été; ici'; SELECT 2;");
    expect(statements).toHaveLength(2);
    expect(statements[0]).toBe("SELECT 'l''été; ici'");
  });

  it("garde un bloc $$ … $$ en une seule instruction", () => {
    const source = [
      "DO $$",
      "BEGIN",
      "  IF true THEN",
      "    RAISE NOTICE 'un; deux';",
      "  END IF;",
      "END",
      "$$;",
      "SELECT 1;",
    ].join("\n");
    const statements = splitStatements(source);
    expect(statements).toHaveLength(2);
    expect(statements[0]).toContain("RAISE NOTICE 'un; deux'");
    expect(statements[0].endsWith("$$")).toBe(true);
  });

  it("gère les citations étiquetées et les commentaires", () => {
    const source = [
      "-- un commentaire avec ; dedans",
      "CREATE FUNCTION f() RETURNS int AS $body$ SELECT 1; $body$ LANGUAGE sql;",
      "/* bloc ; commentaire */",
      "SELECT 2;",
    ].join("\n");
    const statements = splitStatements(source);
    expect(statements).toHaveLength(2);
    expect(statements[0]).toContain("$body$ SELECT 1; $body$");
    expect(statements[1]).toContain("SELECT 2");
  });

  it("ne renvoie rien pour un fichier de commentaires", () => {
    expect(splitStatements("-- rien\n/* que des commentaires ; */\n")).toEqual([]);
  });
});

describe("nommage des migrations", () => {
  it("accepte le format versionné", () => {
    expect(parseMigrationFilename("0007_nouvelle_table.sql")).toEqual({
      version: 7,
      name: "nouvelle_table",
      filename: "0007_nouvelle_table.sql",
    });
  });

  it("refuse les noms non versionnés", () => {
    expect(parseMigrationFilename("schema.sql")).toBeNull();
    expect(parseMigrationFilename("1_court.sql")).toBeNull();
    expect(parseMigrationFilename("0001_Majuscules.sql")).toBeNull();
  });
});

describe("dossier de migrations", () => {
  const migrations = loadMigrations(migrationsDir);

  it("charge des versions uniques, contiguës et croissantes", () => {
    const versions = migrations.map((migration) => migration.version);
    expect(versions.length).toBeGreaterThan(0);
    expect(versions).toEqual(versions.map((_, index) => index + 1));
    expect(new Set(migrations.map((m) => m.filename)).size).toBe(migrations.length);
  });

  it("découpe chaque fichier en instructions non vides", () => {
    for (const migration of migrations) {
      expect(migration.statements.length).toBeGreaterThan(0);
      for (const statement of migration.statements) {
        expect(statement.trim().length).toBeGreaterThan(0);
      }
    }
  });

  it("calcule une empreinte stable et sensible au contenu", () => {
    const [first] = migrations;
    expect(first.checksum).toMatch(/^[a-f0-9]{64}$/);
    expect(checksum(first.source)).toBe(first.checksum);
    expect(checksum(first.source + "\n")).not.toBe(first.checksum);
    expect(checksum(first.source.replace(/\n/g, "\r\n"))).toBe(first.checksum);
  });
});

describe("plan d'application", () => {
  const migrations = loadMigrations(migrationsDir);
  const applied = migrations.slice(0, 2).map((migration) => ({
    version: migration.version,
    name: migration.name,
    checksum: migration.checksum,
  }));

  it("ne propose que les migrations absentes du suivi", () => {
    const plan = planMigrations(migrations, applied);
    expect(plan.pending.map((m: { version: number }) => m.version)).toEqual(
      migrations.slice(2).map((m: { version: number }) => m.version)
    );
    expect(plan.changed).toEqual([]);
    expect(plan.orphaned).toEqual([]);
  });

  it("signale une migration historique modifiée", () => {
    const tampered = [{ ...applied[0], checksum: "0".repeat(64) }];
    const plan = planMigrations(migrations, tampered);
    expect(plan.changed.map((m: { version: number }) => m.version)).toEqual([
      migrations[0].version,
    ]);
  });

  it("signale une migration appliquée absente du dossier", () => {
    const plan = planMigrations(migrations, [
      ...applied,
      { version: 99, name: "fantome", checksum: "x" },
    ]);
    expect(plan.orphaned.map((row: { version: number }) => row.version)).toEqual([99]);
  });
});

describe("diagnostic des erreurs", () => {
  it("masque le mot de passe de la chaîne de connexion", () => {
    const redacted = redactDatabaseUrl(
      "postgresql://user:secret@ep-test-pooler.eu-central-1.aws.neon.tech/neondb?sslmode=require"
    );
    expect(redacted).not.toContain("secret");
    expect(redacted).toContain("user");
    expect(redacted).toContain("ep-test-pooler");
  });

  it("conserve les champs Postgres", () => {
    const error = Object.assign(new Error("relation absente"), {
      code: "42P01",
      detail: "aucune table",
      hint: "vérifie le nom",
      position: "15",
      routine: "parserOpenTable",
    });
    expect(describeDbError(error)).toMatchObject({
      code: "42P01",
      detail: "aucune table",
      hint: "vérifie le nom",
      position: "15",
      routine: "parserOpenTable",
      network: false,
    });
  });

  it("reconnaît un échec réseau du pilote Neon", () => {
    expect(describeDbError(new Error("Error connecting to database: TypeError: fetch failed"))).toMatchObject({
      network: true,
      code: null,
    });
    expect(describeDbError(Object.assign(new Error("connect ETIMEDOUT"), { code: "ETIMEDOUT" })).network).toBe(true);
    expect(
      describeDbError(new Error("Error connecting to database: TypeError: Failed to parse URL from https://api.0.0.1/sql")).network
    ).toBe(true);
  });
});
