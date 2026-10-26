import { NextResponse } from "next/server";
import { requireAdmin } from "@/app/admin/actions";
import { searchActivity } from "@/lib/db/queries";
import { ADMIN_ACTION_LABELS } from "@/lib/admin-activity";

export const dynamic = "force-dynamic";

/** Plafond d'export : au-delà, le journal se télécharge par tranches. */
const MAX_ROWS = 5000;

const dateFormat = new Intl.DateTimeFormat("fr-FR", {
  dateStyle: "short",
  timeStyle: "short",
  timeZone: "Africa/Bangui",
});

/** Échappement CSV (guillemets doublés, séparateur point-virgule pour Excel FR). */
function cell(value: string | null | undefined) {
  const text = (value ?? "").replace(/\r?\n/g, " ");
  return `"${text.replace(/"/g, '""')}"`;
}

export async function GET(request: Request) {
  try {
    await requireAdmin();
  } catch {
    return NextResponse.json({ error: "Non autorisé." }, { status: 401 });
  }

  const url = new URL(request.url);
  const q = (url.searchParams.get("q") ?? "").slice(0, 80);
  const action = (url.searchParams.get("action") ?? "").slice(0, 80);

  const { rows, total } = await searchActivity({ q, action }, MAX_ROWS, 0);

  const lines = [
    ["Date", "Action", "Libellé", "Cible", "Auteur"].map(cell).join(";"),
    ...rows.map((row) =>
      [
        dateFormat.format(new Date(row.created_at)),
        row.action,
        ADMIN_ACTION_LABELS[row.action] ?? row.action,
        row.target,
        row.email,
      ]
        .map(cell)
        .join(";")
    ),
  ];

  // BOM UTF-8 : Excel ouvre correctement les accents français.
  const body = `\uFEFF${lines.join("\r\n")}\r\n`;
  const truncated = total > rows.length;

  return new NextResponse(body, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="journal-activite-gosta-trans.csv"`,
      "Cache-Control": "no-store",
      "X-Total-Count": String(total),
      ...(truncated ? { "X-Truncated": "true" } : {}),
    },
  });
}