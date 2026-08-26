import { NextResponse } from "next/server";
import { createQuoteRequest } from "@/lib/db/queries";
import { isRateLimited } from "@/lib/rate-limit";

// 10 requêtes / 10 minutes par IP
const QUOTE_MAX = 10;
const QUOTE_WINDOW_MS = 10 * 60 * 1000;

// Longueurs maximales des champs
const MAX_NAME = 200;
const MAX_PHONE = 30;
const MAX_SERVICE = 200;
const MAX_MESSAGE = 2000;

function getClientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  return "unknown";
}

export async function POST(request: Request) {
  const ip = getClientIp(request);

  if (isRateLimited(ip, QUOTE_MAX, QUOTE_WINDOW_MS)) {
    return NextResponse.json(
      { error: "Trop de demandes. Réessayez dans quelques minutes." },
      { status: 429 }
    );
  }

  const body = await request.json().catch(() => null);
  const name = typeof body?.name === "string" ? body.name.trim().slice(0, MAX_NAME) : "";
  const phone = typeof body?.phone === "string" ? body.phone.trim().slice(0, MAX_PHONE) : "";
  const service = typeof body?.service === "string" ? body.service.trim().slice(0, MAX_SERVICE) : undefined;
  const message = typeof body?.message === "string" ? body.message.trim().slice(0, MAX_MESSAGE) : undefined;

  if (!name || !phone) {
    return NextResponse.json({ error: "name and phone are required" }, { status: 400 });
  }

  try {
    await createQuoteRequest({ name, phone, service, message });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "failed to save" }, { status: 500 });
  }
}
