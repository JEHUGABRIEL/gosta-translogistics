// Applique lib/db/schema.sql sur la base Neon pointée par DATABASE_URL.
// Usage : npm run db:migrate  (lit .env.local si présent)
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { neon } from "@neondatabase/serverless";

const url = process.env.DATABASE_URL;
if (!url) {
  console.error(
    "DATABASE_URL manquant. Ajoute-le dans .env.local (voir .env.example)."
  );
  process.exit(1);
}

const schemaPath = fileURLToPath(new URL("../lib/db/schema.sql", import.meta.url));
const schema = readFileSync(schemaPath, "utf8");

const sql = neon(url);

const statements = schema
  .split(";")
  .map((s) => s.trim())
  .filter(Boolean);

for (const statement of statements) {
  await sql.query(statement);
  const label = statement.split("\n")[0].slice(0, 60);
  console.log(`OK: ${label}`);
}

console.log(`Migration terminée (${statements.length} instructions).`);
