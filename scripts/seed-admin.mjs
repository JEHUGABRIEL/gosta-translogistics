// Crée le tout premier compte admin (ou en réinitialise le mot de passe s'il
// existe déjà). Le mot de passe est généré aléatoirement et affiché une
// seule fois — note-le immédiatement, il n'est jamais stocké en clair.
// Usage : node scripts/seed-admin.mjs email@exemple.com
import { randomBytes, scrypt } from "node:crypto";
import { promisify } from "node:util";
import { neon } from "@neondatabase/serverless";

const scryptAsync = promisify(scrypt);

const url = process.env.DATABASE_URL;
if (!url) {
  console.error("DATABASE_URL manquant. Ajoute-le dans .env.local (voir .env.example).");
  process.exit(1);
}

const email = process.argv[2]?.trim().toLowerCase();
if (!email || !email.includes("@")) {
  console.error("Usage : node scripts/seed-admin.mjs email@exemple.com");
  process.exit(1);
}

function generatePassword() {
  // 20 caractères lisibles (base64url), largement suffisant en entropie
  return randomBytes(15).toString("base64url");
}

async function hashPassword(password) {
  const salt = randomBytes(16);
  const derived = await scryptAsync(password, salt, 64);
  return `scrypt:16384:${salt.toString("hex")}:${derived.toString("hex")}`;
}

const password = generatePassword();
const passwordHash = await hashPassword(password);

const sql = neon(url);
await sql`
  INSERT INTO admin_users (email, password_hash)
  VALUES (${email}, ${passwordHash})
  ON CONFLICT (email) DO UPDATE SET password_hash = EXCLUDED.password_hash
`;

console.log("");
console.log("Compte admin prêt.");
console.log(`  Email     : ${email}`);
console.log(`  Mot de passe : ${password}`);
console.log("");
console.log("Note-le maintenant : il n'est affiché qu'une seule fois.");
console.log("Connexion sur /admin/login, puis change-le depuis /admin/account.");
