import { afterEach, beforeAll, beforeEach, describe, expect, it, vi } from "vitest";
import {
  clearLoginFailures,
  isLoginIpRateLimited,
  isRateLimited,
  loginLockRemaining,
  registerLoginFailure,
} from "@/lib/rate-limit";
import { purgeStaleRateLimits } from "@/lib/db/queries";
import { getDb } from "@/lib/db/client";
import { clearRateLimitTable, ensureSchema, hasTestDatabase } from "./setup/db";

/**
 * Suite SQL réelle : elle vérifie l'upsert atomique, la fenêtre glissante et
 * les verrous de la table `rate_limits` — la partie que des mocks ne
 * testeraient pas.
 *
 * Nécessite `TEST_DATABASE_URL` (branche Neon dédiée) ; la suite est ignorée
 * sinon, pour que `npm test` reste utilisable hors ligne.
 */
const describeDb = hasTestDatabase ? describe : describe.skip;

describeDb("limiteur de débit (SQL réel)", () => {
  beforeAll(async () => {
    await ensureSchema();
  });

  beforeEach(async () => {
    await clearRateLimitTable();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("bloque après 5 échecs pour un même couple email + IP", async () => {
    const results = [];
    for (let attempt = 1; attempt <= 5; attempt += 1) {
      results.push(await registerLoginFailure("admin@test.local", "203.0.113.1"));
    }

    expect(results.slice(0, 4).map((r) => r.locked)).toEqual([
      false,
      false,
      false,
      false,
    ]);
    expect(results[4].locked).toBe(true);
    expect(
      await loginLockRemaining("admin@test.local", "203.0.113.1")
    ).toBeGreaterThan(0);
  });

  it("n'étend pas le verrou à une autre IP (pas de blocage ciblé d'un compte)", async () => {
    for (let attempt = 1; attempt <= 5; attempt += 1) {
      await registerLoginFailure("victime@test.local", "203.0.113.1");
    }

    expect(
      await loginLockRemaining("victime@test.local", "203.0.113.1")
    ).toBeGreaterThan(0);
    // Un attaquant connaissant l'email ne peut pas bloquer l'admin légitime.
    expect(await loginLockRemaining("victime@test.local", "198.51.100.9")).toBe(0);
  });

  it("pose un verrou global par email face à une attaque distribuée", async () => {
    let lastLocked = false;
    for (let attempt = 1; attempt <= 20; attempt += 1) {
      const { locked } = await registerLoginFailure(
        "cible@test.local",
        `198.51.100.${attempt}`
      );
      lastLocked = locked;
    }

    expect(lastLocked).toBe(true);
    expect(
      await loginLockRemaining("cible@test.local", "203.0.113.250")
    ).toBeGreaterThan(0);
  });

  it("libère le verrou après une connexion réussie", async () => {
    for (let attempt = 1; attempt <= 5; attempt += 1) {
      await registerLoginFailure("admin2@test.local", "203.0.113.2");
    }
    expect(await loginLockRemaining("admin2@test.local", "203.0.113.2")).toBeGreaterThan(0);

    await clearLoginFailures("admin2@test.local", "203.0.113.2");

    expect(await loginLockRemaining("admin2@test.local", "203.0.113.2")).toBe(0);
  });

  it("bloque au-delà du quota sur une fenêtre glissante", async () => {
    const results = [];
    for (let call = 1; call <= 3; call += 1) {
      results.push(await isRateLimited("test-quota", "203.0.113.10", 2, 60_000));
    }

    expect(results).toEqual([false, false, true]);
  });

  it("ignore les clients sans IP plutôt que de les regrouper", async () => {
    for (let call = 1; call <= 5; call += 1) {
      expect(await isRateLimited("test-quota", null, 1, 60_000)).toBe(false);
      expect(await isLoginIpRateLimited(null)).toBe(false);
    }
  });

  it("purge les compteurs inactifs", async () => {
    const sql = getDb();
    await sql`
      INSERT INTO rate_limits (key, count, window_start, updated_at)
      VALUES ('vieux-compteur', 3, now(), now() - interval '2 days')
    `;

    await purgeStaleRateLimits();

    const rows = await sql`SELECT key FROM rate_limits WHERE key = 'vieux-compteur'`;
    expect(rows).toHaveLength(0);
  });

  it("échoue en mode ouvert quand la base renvoie une erreur", async () => {
    const spy = vi.spyOn(console, "error").mockImplementation(() => {});
    const sql = getDb();

    // Erreur de base réelle (table absente), indépendante du transport.
    await sql`ALTER TABLE rate_limits RENAME TO rate_limits_hors_service`;
    try {
      // Un limiteur ne doit jamais devenir un point de panne du site.
      expect(await isRateLimited("test-quota", "203.0.113.3", 1, 60_000)).toBe(false);
      expect(await loginLockRemaining("panne@test.local", "203.0.113.3")).toBe(0);
      expect(
        (await registerLoginFailure("panne@test.local", "203.0.113.3")).locked
      ).toBe(false);
    } finally {
      await sql`ALTER TABLE rate_limits_hors_service RENAME TO rate_limits`;
    }

    expect(spy).toHaveBeenCalled();
  });
});
