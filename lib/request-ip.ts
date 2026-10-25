import "server-only";

import { headers } from "next/headers";

/**
 * Adresse IP du client.
 *
 * Sur Vercel, `x-forwarded-for` est posé par la plateforme et son premier
 * élément est l'adresse réelle du client. Retourne `null` quand aucun en-tête
 * exploitable n'est présent : les appelants doivent alors ignorer la limite
 * plutôt que de regrouper tous ces clients dans un compteur commun (un seul
 * client pourrait sinon épuiser le quota de tout le monde).
 */
export function getClientIpFromHeaders(all: Headers): string | null {
  const forwarded = all.get("x-forwarded-for");
  if (forwarded) {
    const first = forwarded.split(",")[0]?.trim();
    if (first) return first;
  }
  const realIp = all.get("x-real-ip")?.trim();
  return realIp || null;
}

export function getClientIpFromRequest(request: Request): string | null {
  return getClientIpFromHeaders(request.headers);
}

/** Variante pour les Server Actions et Server Components. */
export async function getRequestIp(): Promise<string | null> {
  return getClientIpFromHeaders(await headers());
}
