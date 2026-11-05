/**
 * Nom du cookie de session admin.
 *
 * Il est partagé par `proxy.ts` (première barrière, qui ne lit que sa présence
 * sans requête base) et par `lib/admin-auth.ts` (émission et vérification).
 * Module volontairement minimal : importable depuis le runtime Edge du proxy,
 * donc aucun import Node et surtout pas `server-only`.
 */
export const ADMIN_SESSION_COOKIE = "admin_session";
