import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/admin-auth";
import { listContactMessages, listQuoteRequests } from "@/lib/db/queries";
import type { NotificationsPayload } from "@/lib/admin-notifications";

export const dynamic = "force-dynamic";

export async function GET() {
  const user = await getSessionUser();
  if (!user) {
    return NextResponse.json({ error: "Non autorisé." }, { status: 401 });
  }

  const [quotes, messages] = await Promise.all([
    listQuoteRequests(),
    listContactMessages(),
  ]);

  const newQuotes = quotes.filter((quote) => quote.status === "new");
  const newMessages = messages.filter((message) => message.status === "new");

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
