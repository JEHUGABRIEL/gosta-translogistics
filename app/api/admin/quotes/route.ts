import { NextResponse } from "next/server";
import { requireAdmin } from "@/app/admin/actions";
import { listQuoteRequests } from "@/lib/db/queries";

export const dynamic = "force-dynamic";

/** Liste des demandes de devis, consommée par le dashboard via TanStack Query. */
export async function GET() {
  try {
    // `requireAdmin` redirige vers /admin/login : dans un route handler on
    // convertit cet échec en 401 plutôt que de laisser fuir une redirection.
    await requireAdmin();
  } catch {
    return NextResponse.json({ error: "Non autorisé." }, { status: 401 });
  }

  const quotes = await listQuoteRequests();
  return NextResponse.json({ quotes });
}
