import { beforeEach, describe, expect, it, vi } from "vitest";

// ---------------------------------------------------------------------------
// Le route handler dépend de deux modules serveur : l'authentification (jeton
// de session absent hors requête Next) et la base. Les deux sont remplacés —
// on teste ici la forme du CSV, l'en-tête d'autorisation et le passage des
// filtres, pas l'exécution SQL.
// ---------------------------------------------------------------------------

vi.mock("@/app/admin/actions", () => ({
  requireAdmin: vi.fn(),
}));

vi.mock("@/lib/db/queries", () => ({
  searchActivity: vi.fn(),
}));

import { GET } from "@/app/api/admin/activity/export/route";
import { requireAdmin } from "@/app/admin/actions";
import { searchActivity } from "@/lib/db/queries";
import type { ActivityRow } from "@/lib/db/queries";

const URL_EXPORT = "https://gosta-trans.local/api/admin/activity/export";

const row = (overrides: Partial<ActivityRow> = {}): ActivityRow => ({
  id: 7,
  action: "auth.login",
  target: null,
  email: "admin@test.local",
  created_at: "2026-10-26T09:15:00.000Z",
  ...overrides,
});

const authenticate = () => {
  vi.mocked(requireAdmin).mockResolvedValue(
    {} as Awaited<ReturnType<typeof requireAdmin>>
  );
};

beforeEach(() => {
  vi.clearAllMocks();
});

describe("GET /api/admin/activity/export", () => {
  it("refuse un visiteur non connecté", async () => {
    vi.mocked(requireAdmin).mockRejectedValue(new Error("Non autorisé."));

    const response = await GET(new Request(URL_EXPORT));

    expect(response.status).toBe(401);
    expect(await response.json()).toEqual({ error: "Non autorisé." });
    expect(searchActivity).not.toHaveBeenCalled();
  });

  it("renvoie un CSV avec BOM, en-têtes et disposition en pièce jointe", async () => {
    authenticate();
    vi.mocked(searchActivity).mockResolvedValue({
      rows: [row({ target: "Connexion depuis l'interface" })],
      total: 1,
    });

    const response = await GET(new Request(URL_EXPORT));

    expect(response.status).toBe(200);
    expect(response.headers.get("content-type")).toContain("text/csv");
    expect(response.headers.get("content-disposition")).toContain(
      'filename="journal-activite-gosta-trans.csv"'
    );
    expect(response.headers.get("x-total-count")).toBe("1");
    expect(response.headers.get("x-truncated")).toBeNull();

    // `Response.text()` efface le BOM : on le lit sur les octets bruts.
    const bytes = new Uint8Array(await response.arrayBuffer());
    expect([bytes[0], bytes[1], bytes[2]]).toEqual([0xef, 0xbb, 0xbf]);

    const body = new TextDecoder().decode(bytes);
    expect(body).toContain('"Date";"Action";"Libellé";"Cible";"Auteur"');
    expect(body).toContain('"auth.login";"Connexion"');
  });

  it("échappe les guillemets, les retours à la ligne et utilise « ; »", async () => {
    authenticate();
    vi.mocked(searchActivity).mockResolvedValue({
      rows: [
        row({
          action: "quote.status_changed",
          target: 'Devis #1 → "traité";\nsuite',
          email: "admin@test.local",
        }),
      ],
      total: 1,
    });

    const body = await (await GET(new Request(URL_EXPORT))).text();

    expect(body).toContain('"quote.status_changed";"Devis : statut modifié"');
    // Guillemets doublés, saut de ligne remplacé par une espace, cellule close.
    expect(body).toContain('"Devis #1 → ""traité""; suite"');
    // Aucune cellule ne contient de saut de ligne : les seuls retours à la
    // ligne du corps sont les séparateurs CRLF.
    expect(body.replace(/\r\n/g, "")).not.toContain("\n");
  });

  it("transmet la recherche et le filtre d'action", async () => {
    authenticate();
    vi.mocked(searchActivity).mockResolvedValue({ rows: [], total: 0 });

    await GET(new Request(`${URL_EXPORT}?q=ada&action=invite.created`));

    expect(searchActivity).toHaveBeenCalledWith(
      { q: "ada", action: "invite.created" },
      5000,
      0
    );
  });

  it("signale un export tronqué quand le plafond est atteint", async () => {
    authenticate();
    vi.mocked(searchActivity).mockResolvedValue({
      rows: [row()],
      total: 5001,
    });

    const response = await GET(new Request(URL_EXPORT));

    expect(response.headers.get("x-truncated")).toBe("true");
    expect(response.headers.get("x-total-count")).toBe("5001");
  });
});
