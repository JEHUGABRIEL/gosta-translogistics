import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/admin-auth";
import { listContactMessages, listQuoteRequests } from "@/lib/db/queries";
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
  const sinceMs = Date.parse(new URL(request.url).searchParams.get("since") ?? "");
  const isNotified = (createdAt: string) =>
    Number.isNaN(sinceMs) || Date.parse(createdAt) > sinceMs;

  const [quotes, messages] = await Promise.all([
    listQuoteRequests(),
    listContactMessages(),
  ]);

  const newQuotes = quotes.filter(
    (quote) => quote.status === "new" && isNotified(quote.created_at)
  );
  const newMessages = messages.filter(
    (message) => message.status === "new" && isNotified(message.created_at)
  );

  const payload: NotificationsPayload = {
    quotes: {
      count: newQuotes.length,
      items: newQuotes.slice(0, 3).map((quote) => ({
        id: quote.id,
        name: quote.name,
        createdAt: quote.created_at,
      })),
    },
    messages: {
      count: newMessages.length,
      items: newMessages.slice(0, 3).map((message) => ({
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
