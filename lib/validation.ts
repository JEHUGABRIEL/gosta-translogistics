/**
 * Helpers de validation partagés par les routes publiques (`/api/quote`,
 * `/api/contact`) : une seule définition des longueurs maximales et du
 * nettoyage des champs courts, pour éviter la dérive entre les deux endpoints.
 */

/**
 * Retire les caractères de contrôle (retours à la ligne inclus) et compacte
 * les espaces. Réservé aux champs courts (nom, email, téléphone, service) :
 * un message libre garde ses retours à la ligne.
 */
export function cleanSingleLine(value: string) {
  return value
    .replace(/[\u0000-\u001F\u007F]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/** Longueurs maximales des champs reçus du public. */
export const FIELD_LIMITS = {
  name: 200,
  email: 320,
  phone: 30,
  service: 200,
  message: 2000,
} as const;

export const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/**
 * Tronque sans couper une paire de substitution UTF-16 : un demi-emoji en base
 * produirait un caractère invalide à l'affichage.
 */
export function truncate(value: string, max: number) {
  if (value.length <= max) return value;
  let out = value.slice(0, max);
  const last = out.charCodeAt(out.length - 1);
  if (last >= 0xd800 && last <= 0xdbff) out = out.slice(0, -1);
  return out;
}

/**
 * Lit un champ texte d'un corps JSON inconnu, le nettoie et le borne.
 * Les champs absents ou d'un autre type deviennent `undefined`.
 */
export function readSingleLine(
  body: unknown,
  field: string,
  max: number
): string | undefined {
  const record = body as Record<string, unknown> | null;
  const value = record?.[field];
  if (typeof value !== "string") return undefined;
  return truncate(cleanSingleLine(value), max);
}

/** Variante pour les champs longs (message) : garde la mise en forme. */
export function readMultiline(
  body: unknown,
  field: string,
  max: number
): string | undefined {
  const record = body as Record<string, unknown> | null;
  const value = record?.[field];
  if (typeof value !== "string") return undefined;
  return truncate(value.trim(), max);
}
