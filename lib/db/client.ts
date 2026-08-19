import { neon } from "@neondatabase/serverless";

export function getDb() {
  const url = process.env.DATABASE_URL;
  if (!url) {
    throw new Error(
      "DATABASE_URL manquant. Ajoute-le dans .env.local (dev) et dans les variables d'environnement Vercel (production)."
    );
  }
  return neon(url);
}
