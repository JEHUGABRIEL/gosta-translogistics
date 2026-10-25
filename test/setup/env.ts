/**
 * Bascule la connexion base vers la base de test, avant tout import
 * applicatif.
 *
 * Règle de sécurité : les tests écrivent et vident des tables. Ils ne lisent
 * QUE `TEST_DATABASE_URL`, jamais `DATABASE_URL` — et refusent de démarrer si
 * les deux pointent vers la même base (copier-coller d'une URL de production).
 *
 * Note : Vitest charge les fichiers `.env*` dans `process.env`, donc
 * `DATABASE_URL` peut déjà valoir la base applicative à ce stade. C'est
 * précisément ce que le garde-fou ci-dessous intercepte.
 */
const testUrl = process.env.TEST_DATABASE_URL?.trim();

const globalState = globalThis as typeof globalThis & {
  __testDatabaseUrlApplied?: string;
};

if (testUrl && globalState.__testDatabaseUrlApplied !== testUrl) {
  const current = process.env.DATABASE_URL?.trim();
  if (current && current === testUrl) {
    throw new Error(
      "TEST_DATABASE_URL est identique à DATABASE_URL : les tests refusent de " +
        "s'exécuter sur la base applicative. Utilise une branche Neon dédiée."
    );
  }

  process.env.DATABASE_URL = testUrl;
  globalState.__testDatabaseUrlApplied = testUrl;
}
