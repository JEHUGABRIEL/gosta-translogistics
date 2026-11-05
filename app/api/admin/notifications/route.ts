import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/admin-auth";
import {
  countNewContactMessagesSince,
  countNewQuoteRequestsSince,
  listNewContactMessagesSince,
  listNewQuoteRequestsSince,
} from "@/lib/db/queries";
import type { NotificationsPayload } from "@/lib/admin-notifications";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const user = await getSessionUser();
  if (!user) {
    return NextResponse.json({ error: "Non autorisé." }, { status: 401 });
  }

  // `since` = horodatage de la dernière « effacement » par le client : seules
  // les nouveautés survenues après sont comptées, sans jamais modifier les
  // lignes en base. Une valeur illisible est ignorée (badge complet).
  const sinceParam = new URL(request.url).searchParams.get("since");
  const sinceMs = Date.parse(sinceParam ?? "");
  const sinceIso = Number.isNaN(sinceMs) ? null : new Date(sinceMs).toISOString();

  // Comptage et extraits filtrés en base : le badge ne dépend plus de la
  // taille de l'historique.
  const [
    quoteCount,
    quoteRows,
    messageCount,
    messageRows,
  ] = await Promise.all([
    countNewQuoteRequestsSince(sinceIso),
    listNewQuoteRequestsSince(sinceIso, 3),
    countNewContactMessagesSince(sinceIso),
    listNewContactMessagesSince(sinceIso, 3),
  ]);

  const payload: NotificationsPayload = {
    quotes: {
      count: quoteCount,
      items: quoteRows.map((quote) => ({
        id: quote.id,
        name: quote.name,
        createdAt: quote.created_at,
      })),
    },
    messages: {
      count: messageCount,
      items: messageRows.map((message) => ({
        id: message.id,
        name: message.name,
        createdAt: message.created_at,
      })),
    },
  };

  return NextResponse.json(payload, {
    headers: { "Cache-Control": "no-store" },
  });
}
