import "server-only";

import {
  clearRateLimits,
  getRateLimitRow,
  hitRateLimit,
  lockRateLimit,
  purgeStaleRateLimits,
} from "./db/queries";

/**
 * Limitation de débit partagée, état stocké dans Neon.
 *
 * L'implémentation précédente gardait ses compteurs dans des `Map` en mémoire :
 * sur Vercel, chaque instance serverless avait les siens et chaque cold start
 * les remettait à zéro — donc aucune protection réelle contre le bruteforce
 * ou le spam. L'état vit désormais en base, partagé par toutes les instances.
 *
 * Politique de panne : si la base répond mal, on laisse passer (fail open) et
 * on loggue. Un limiteur ne doit pas devenir un point de panne du site public.
 */

const FAIL_WINDOW_SEC = 15 * 60;
const FAIL_LOCK_SEC = 15 * 60;
/** Tentatives par couple email + IP avant blocage. */
const MAX_FAILS_PER_IDENTITY = 5;
/** Plafond global par email : couvre un attaquant distribué (botnet). */
const MAX_FAILS_PER_EMAIL = 20;

const LOGIN_IP_MAX = 20;
const LOGIN_IP_WINDOW_MS = 10 * 60 * 1000;
// Marge volontairement large : un parcours légitime (formulaire + renvois +
// vérifications) consomme une dizaine d'appels d'affilée.
const INVITE_IP_MAX = 30;
const INVITE_IP_WINDOW_MS = 10 * 60 * 1000;

const normalizeEmail = (email: string) => email.trim().toLowerCase();

const identityKey = (email: string, ip: string | null) =>
  `login:${normalizeEmail(email)}:${ip ?? "no-ip"}`;
const emailKey = (email: string) => `login-email:${normalizeEmail(email)}`;

function lockSecondsLeft(lockedUntil: string | null): number {
  if (!lockedUntil) return 0;
  const ms = new Date(lockedUntil).getTime() - Date.now();
  return ms > 0 ? Math.ceil(ms / 1000) : 0;
}

function report(error: unknown, context: string) {
  console.error(`[rate-limit] ${context}`, error);
}

/** Entretien opportuniste : évite que la table des compteurs grossisse sans fin. */
async function maybePurge() {
  if (Math.random() > 0.02) return;
  try {
    await purgeStaleRateLimits();
  } catch (error) {
    report(error, "purge");
  }
}

/**
 * Secondes de blocage restantes pour cette tentative de connexion (0 = ok).
 * Deux verrous sont consultés : le couple email + IP (attaque locale) et
 * l'email seul (attaque distribuée).
 */
export async function loginLockRemaining(
  email: string,
  ip: string | null
): Promise<number> {
  try {
    const [identity, global] = await Promise.all([
      getRateLimitRow(identityKey(email, ip)),
      getRateLimitRow(emailKey(email)),
    ]);
    return Math.max(
      lockSecondsLeft(identity?.locked_until ?? null),
      lockSecondsLeft(global?.locked_until ?? null)
    );
  } catch (error) {
    report(error, "lecture du verrou de connexion");
    return 0;
  }
}

export async function registerLoginFailure(
  email: string,
  ip: string | null
): Promise<{ locked: boolean }> {
  try {
    const identityCount = await hitRateLimit(
      identityKey(email, ip),
      FAIL_WINDOW_SEC
    );
    if (identityCount >= MAX_FAILS_PER_IDENTITY) {
      await lockRateLimit(identityKey(email, ip), FAIL_LOCK_SEC);
      return { locked: true };
    }

    const globalCount = await hitRateLimit(emailKey(email), FAIL_WINDOW_SEC);
    if (globalCount >= MAX_FAILS_PER_EMAIL) {
      await lockRateLimit(emailKey(email), FAIL_LOCK_SEC);
      return { locked: true };
    }

    return { locked: false };
  } catch (error) {
    report(error, "enregistrement d'un échec de connexion");
    return { locked: false };
  }
}

export async function clearLoginFailures(email: string, ip: string | null) {
  try {
    await clearRateLimits([identityKey(email, ip), emailKey(email)]);
  } catch (error) {
    report(error, "réinitialisation du verrou de connexion");
  }
}

/**
 * Vrai si l'appelant doit être bloqué. `ip` peut être null quand le proxy n'a
 * fourni aucune adresse : on ne regroupe alors pas tout le monde dans un même
 * compteur (ce qui permettrait à un seul client d'épuiser le quota de tous).
 */
export async function isRateLimited(
  key: string,
  ip: string | null,
  maxRequests: number,
  windowMs: number
): Promise<boolean> {
  if (!ip) return false;
  await maybePurge();
  try {
    const count = await hitRateLimit(
      `${key}:${ip}`,
      Math.ceil(windowMs / 1000)
    );
    return count > maxRequests;
  } catch (error) {
    report(error, `limitation ${key}`);
    return false;
  }
}

/** Throttle des tentatives de connexion, toutes adresses email confondues. */
export function isLoginIpRateLimited(ip: string | null) {
  return isRateLimited("login-ip", ip, LOGIN_IP_MAX, LOGIN_IP_WINDOW_MS);
}

/** Throttle du parcours d'invitation (formulaire, renvoi et vérification d'OTP). */
export function isInviteIpRateLimited(ip: string | null) {
  return isRateLimited("invite-ip", ip, INVITE_IP_MAX, INVITE_IP_WINDOW_MS);
}
