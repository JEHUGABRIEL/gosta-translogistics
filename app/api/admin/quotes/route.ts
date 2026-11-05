import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-guard";
import { countQuoteRequests, listQuoteRequests } from "@/lib/db/queries";
import type { QuoteRequest } from "@/lib/db/queries";

export const dynamic = "force-dynamic";

const PAGE_SIZE = 10;
const MAX_QUERY_LENGTH = 80;
const STATUSES: readonly QuoteRequest["status"][] = ["new", "contacted", "done"];

function parsePage(raw: string | null) {
  const page = Number(raw);
  return Number.isInteger(page) && page > 0 ? page : 1;
}

/**
 * Une page de demandes de devis, filtrée en SQL.
 * Sans `page`/`q`/`status`, renvoie la première page sans filtre.
 */
export async function GET(request: Request) {
  try {
    // `requireAdmin` redirige vers /admin/login : dans un route handler on
    // convertit cet échec en 401 plutôt que de laisser fuir une redirection.
    await requireAdmin();
  } catch {
    return NextResponse.json({ error: "Non autorisé." }, { status: 401 });
  }

  const params = new URL(request.url).searchParams;
  const page = parsePage(params.get("page"));
  const statusParam = params.get("status") ?? "all";
  const status = STATUSES.includes(statusParam as QuoteRequest["status"])
    ? (statusParam as QuoteRequest["status"])
    : "all";
  const query = (params.get("q") ?? "").slice(0, MAX_QUERY_LENGTH);

  const [quotes, total] = await Promise.all([
    listQuoteRequests({
      limit: PAGE_SIZE,
      offset: (page - 1) * PAGE_SIZE,
      query,
      status,
    }),
    countQuoteRequests({ query, status }),
  ]);

  return NextResponse.json(
    { quotes, total, page, pageSize: PAGE_SIZE },
    { headers: { "Cache-Control": "no-store" } }
  );
}
