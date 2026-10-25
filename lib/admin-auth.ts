import "server-only";

import { randomBytes, randomInt, scrypt, timingSafeEqual, createHash } from "node:crypto";
import { promisify } from "node:util";
import { cookies } from "next/headers";
import { getDb } from "./db/client";
import { deleteExpiredSessions } from "./db/queries";

const scryptAsync = promisify(scrypt) as (
  password: string,
  salt: Buffer,
  keylen: number
) => Promise<Buffer>;

const COOKIE_NAME = "admin_session";
// Le cookie est restreint à /admin : il n'est jamais envoyé au site public ni
// à /api. Toute suppression doit donc réutiliser ce même path (cf.
// destroySession) : un Set-Cookie avec Path=/ ne remplace pas un cookie
// scope /admin, il en crée un second.
const COOKIE_PATH = "/admin";
const SESSION_TTL_MS = 12 * 60 * 60 * 1000;
const SCRYPT_N = 16384;
const SCRYPT_KEYLEN = 64;

// Hash factice, au bon format et de bonne longueur : il sert à exécuter un
// scrypt complet quand l'email n'existe pas, pour que le temps de réponse ne
// révèle pas l'existence d'un compte.
const DUMMY_PASSWORD_HASH =
  "scrypt:16384:ed2c4181bdd3ab08d8d173d9954c3383:ef8420bf2fda3a699cf9d6179c395c66eac43c7161c3d2f9ad83dedbcd6def16b42dadd33ef54070f327955c5a9f0bdb6455a5e843df27558e637d9879965f88";
export const MAX_PASSWORD_LENGTH = 128;

export async function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(16);
  const derived = await scryptAsync(password, salt, SCRYPT_KEYLEN);
  return `scrypt:${SCRYPT_N}:${salt.toString("hex")}:${derived.toString("hex")}`;
}

export async function verifyPassword(
  password: string,
  stored: string
): Promise<boolean> {
  if (password.length > MAX_PASSWORD_LENGTH) return false;
  const parts = stored.split(":");
  if (parts.length !== 4 || parts[0] !== "scrypt") return false;
  const [, , saltHex, hashHex] = parts;
  const salt = Buffer.from(saltHex, "hex");
  const expected = Buffer.from(hashHex, "hex");
  const derived = await scryptAsync(password, salt, expected.length);
  return derived.length === expected.length && timingSafeEqual(derived, expected);
}

export function sha256Hex(value: string) {
  return createHash("sha256").update(value).digest("hex");
}

const hashToken = sha256Hex;

export function generateInviteToken() {
  return randomBytes(32).toString("base64url");
}

export function generateOtp() {
  return String(randomInt(1_000_000)).padStart(6, "0");
}

export function timingSafeEqualHex(a: string, b: string) {
  const bufA = Buffer.from(a, "hex");
  const bufB = Buffer.from(b, "hex");
  if (bufA.length !== bufB.length) return false;
  return timingSafeEqual(bufA, bufB);
}

export async function createSession(userId: number) {
  const token = randomBytes(32).toString("base64url");
  const tokenHash = hashToken(token);
  const expiresAt = new Date(Date.now() + SESSION_TTL_MS);

  // Entretien : les sessions expirées ne servent plus à rien.
  await deleteExpiredSessions();

  const sql = getDb();
  await sql`
    INSERT INTO sessions (user_id, token_hash, expires_at)
    VALUES (${userId}, ${tokenHash}, ${expiresAt.toISOString()})
  `;

  const store = await cookies();
  store.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: COOKIE_PATH,
    expires: expiresAt,
  });
}

export async function destroySession() {
  const store = await cookies();
  const token = store.get(COOKIE_NAME)?.value;
  if (token) {
    const sql = getDb();
    await sql`DELETE FROM sessions WHERE token_hash = ${hashToken(token)}`;
  }
  // cookies().delete() émet un Set-Cookie avec Path=/ par défaut, qui ne
  // supprime pas le cookie scope /admin. On le réécrit vide sur le bon path.
  store.set(COOKIE_NAME, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: COOKIE_PATH,
    maxAge: 0,
  });
}

/**
 * Exécute un scrypt de coût équivalent pour un email inconnu, puis échoue.
 * Empêche l'énumération de comptes par mesure de temps de réponse.
 */
export async function verifyAgainstDummyHash(password: string) {
  await verifyPassword(password, DUMMY_PASSWORD_HASH);
  return false;
}

/**
 * Empreinte du token de la session courante, pour distinguer « cette session »
 * des autres dans la liste des sessions actives.
 */
export async function getCurrentSessionTokenHash(): Promise<string | null> {
  const store = await cookies();
  const token = store.get(COOKIE_NAME)?.value;
  return token ? hashToken(token) : null;
}

export type AdminUser = {
  id: number;
  email: string;
  first_name: string | null;
  last_name: string | null;
};

export async function getSessionUser(): Promise<AdminUser | null> {
  const store = await cookies();
  const token = store.get(COOKIE_NAME)?.value;
  if (!token) return null;

  const sql = getDb();
  const rows = await sql`
    SELECT u.id, u.email, u.first_name, u.last_name
    FROM sessions s
    JOIN admin_users u ON u.id = s.user_id
    WHERE s.token_hash = ${hashToken(token)} AND s.expires_at > now()
  `;
  return (rows[0] as AdminUser | undefined) ?? null;
}

export async function hasValidAdminSession() {
  return (await getSessionUser()) !== null;
}

export async function findUserByEmail(email: string) {
  const sql = getDb();
  const rows = await sql`
    SELECT id, email, password_hash FROM admin_users WHERE email = ${email}
  `;
  return rows[0] as { id: number; email: string; password_hash: string } | undefined;
}

export async function touchLastLogin(userId: number) {
  const sql = getDb();
  await sql`UPDATE admin_users SET last_login_at = now() WHERE id = ${userId}`;
}
