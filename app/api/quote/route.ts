import { NextResponse } from "next/server";
import { createQuoteRequest } from "@/lib/db/queries";
import { isRateLimited } from "@/lib/rate-limit";
import { getClientIpFromRequest } from "@/lib/request-ip";

// 10 requêtes / 10 minutes par IP
const QUOTE_MAX = 10;
const QUOTE_WINDOW_MS = 10 * 60 * 1000;

// Longueurs maximales des champs
const MAX_NAME = 200;
const MAX_PHONE = 30;
const MAX_SERVICE = 200;
const MAX_MESSAGE = 2000;

/** Retire les caractères de contrôle (sauts de ligne inclus) des champs courts. */
function clean(value: string) {
  return value.replace(/[\u0000-\u001F\u007F]/g, " ").replace(/\s+/g, " ").trim();
}

export async function POST(request: Request) {
  const ip = getClientIpFromRequest(request);

  if (await isRateLimited("quote", ip, QUOTE_MAX, QUOTE_WINDOW_MS)) {
    return NextResponse.json(
      { error: "Trop de demandes. Réessayez dans quelques minutes." },
      { status: 429 }
    );
  }

  const body = await request.json().catch(() => null);

  // Honeypot : champ invisible pour les humains. Un bot qui le remplit reçoit
  // une réponse de succès mais rien n'est enregistré.
  if (typeof body?.website === "string" && body.website.trim() !== "") {
    return NextResponse.json({ ok: true });
  }

  const name = typeof body?.name === "string" ? clean(body.name).slice(0, MAX_NAME) : "";
  const phone = typeof body?.phone === "string" ? clean(body.phone).slice(0, MAX_PHONE) : "";
  const service =
    typeof body?.service === "string" ? clean(body.service).slice(0, MAX_SERVICE) : undefined;
  const message =
    typeof body?.message === "string"
      ? body.message.trim().slice(0, MAX_MESSAGE)
      : undefined;

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
