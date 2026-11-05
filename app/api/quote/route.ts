import { NextResponse } from "next/server";
import { createQuoteRequest } from "@/lib/db/queries";
import { isGlobalRateLimited, isRateLimited } from "@/lib/rate-limit";
import { getClientIpFromRequest } from "@/lib/request-ip";
import { FIELD_LIMITS, readMultiline, readSingleLine } from "@/lib/validation";

// 10 requêtes / 10 minutes par IP, plus un plafond global indépendant de l'IP
// pour résister à une attaque distribuée (IP tournantes).
const QUOTE_MAX = 10;
const QUOTE_GLOBAL_MAX = 300;
const QUOTE_WINDOW_MS = 10 * 60 * 1000;

export async function POST(request: Request) {
  if (await isGlobalRateLimited("quote", QUOTE_GLOBAL_MAX, QUOTE_WINDOW_MS)) {
    return NextResponse.json(
      { error: "Service momentanément saturé. Réessayez dans quelques minutes." },
      { status: 429 }
    );
  }

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
  const honeypot = (body as Record<string, unknown> | null)?.website;
  if (typeof honeypot === "string" && honeypot.trim() !== "") {
    return NextResponse.json({ ok: true });
  }

  const name = readSingleLine(body, "name", FIELD_LIMITS.name) ?? "";
  const phone = readSingleLine(body, "phone", FIELD_LIMITS.phone) ?? "";
  const service = readSingleLine(body, "service", FIELD_LIMITS.service);
  const message = readMultiline(body, "message", FIELD_LIMITS.message);

  if (!name || !phone) {
    return NextResponse.json(
      { error: "Le nom et le téléphone sont requis." },
      { status: 400 }
    );
  }

  try {
    await createQuoteRequest({ name, phone, service, message });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Enregistrement impossible." }, { status: 500 });
  }
}
