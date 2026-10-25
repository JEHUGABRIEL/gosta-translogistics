import "server-only";

import { randomBytes } from "node:crypto";
import { cookies } from "next/headers";
import * as OTPAuth from "otpauth";
import { sha256Hex } from "./admin-auth";
import { createMfaChallenge } from "./db/queries";

/**
 * Double authentification TOTP (application d'authentification type
 * Google Authenticator / Authy).
 *
 * Le mot de passe seul n'ouvre plus de session quand MFA est actif : un défi
 * intermédiaire est créé (`admin_mfa_challenges`) et son token opaque voyage
 * dans un cookie dédié. Aucune session n'existe tant que le code n'est pas
 * validé.
 */

const ISSUER = "GOSTA TRANS Admin";

// Même contrainte de path que la session : le cookie n'est envoyé qu'à /admin.
const CHALLENGE_COOKIE = "admin_mfa_challenge";
const CHALLENGE_PATH = "/admin";
const CHALLENGE_TTL_MS = 10 * 60 * 1000;
/** Nombre d'essais par défi : borne le bruteforce d'un code à 6 chiffres. */
export const MFA_MAX_ATTEMPTS = 5;

export function generateTotpSecret() {
  return new OTPAuth.Secret({ size: 20 }).base32;
}

export function buildTotpUri(email: string, secret: string) {
  return new OTPAuth.TOTP({
    issuer: ISSUER,
    label: email,
    algorithm: "SHA1",
    digits: 6,
    period: 30,
    secret: OTPAuth.Secret.fromBase32(secret),
  }).toString();
}

/**
 * Vérifie un code TOTP à ±1 période (30 s) pour tolérer une légère dérive
 * d'horloge entre le serveur et le téléphone.
 */
export function verifyTotp(secret: string, token: string): boolean {
  const code = token.replace(/\s/g, "");
  if (!/^\d{6}$/.test(code)) return false;
  const totp = new OTPAuth.TOTP({
    issuer: ISSUER,
    algorithm: "SHA1",
    digits: 6,
    period: 30,
    secret: OTPAuth.Secret.fromBase32(secret),
  });
  return totp.validate({ token: code, window: 1 }) !== null;
}

/** Crée un défi de connexion et pose le cookie correspondant. */
export async function startMfaChallenge(userId: number) {
  const token = randomBytes(32).toString("base64url");
  const expiresAt = new Date(Date.now() + CHALLENGE_TTL_MS);

  await createMfaChallenge({
    userId,
    tokenHash: sha256Hex(token),
    expiresAt: expiresAt.toISOString(),
  });

  const store = await cookies();
  store.set(CHALLENGE_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: CHALLENGE_PATH,
    expires: expiresAt,
  });
}

/** Token du défi en cours, ou null. */
export async function readMfaChallengeToken() {
  const store = await cookies();
  return store.get(CHALLENGE_COOKIE)?.value ?? null;
}

export async function clearMfaChallengeCookie() {
  const store = await cookies();
  store.set(CHALLENGE_COOKIE, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: CHALLENGE_PATH,
    maxAge: 0,
  });
}
