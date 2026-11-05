import { NextResponse } from "next/server";
import { createContactMessage } from "@/lib/db/queries";
import { isGlobalRateLimited, isRateLimited } from "@/lib/rate-limit";
import { getClientIpFromRequest } from "@/lib/request-ip";
import {
  EMAIL_PATTERN,
  FIELD_LIMITS,
  readMultiline,
  readSingleLine,
} from "@/lib/validation";

// Mêmes seuils que les demandes de devis : 10 / 10 min par IP, avec un plafond
// global plus bas (le formulaire libre est plus facile à abuser).
const CONTACT_MAX = 10;
const CONTACT_GLOBAL_MAX = 120;
const CONTACT_WINDOW_MS = 10 * 60 * 1000;

export async function POST(request: Request) {
  if (await isGlobalRateLimited("contact", CONTACT_GLOBAL_MAX, CONTACT_WINDOW_MS)) {
    return NextResponse.json(
      { error: "Service momentanément saturé. Réessayez dans quelques minutes." },
      { status: 429 }
    );
  }

  const ip = getClientIpFromRequest(request);
  if (await isRateLimited("contact", ip, CONTACT_MAX, CONTACT_WINDOW_MS)) {
    return NextResponse.json(
      { error: "Trop de messages. Réessayez dans quelques minutes." },
      { status: 429 }
    );
  }

  const body = await request.json().catch(() => null);

  // Honeypot : succès simulé, rien n'est enregistré.
  const honeypot = (body as Record<string, unknown> | null)?.website;
  if (typeof honeypot === "string" && honeypot.trim() !== "") {
    return NextResponse.json({ ok: true });
  }

  const name = readSingleLine(body, "name", FIELD_LIMITS.name) ?? "";
  const email = readSingleLine(body, "email", FIELD_LIMITS.email) ?? "";
  const phone = readSingleLine(body, "phone", FIELD_LIMITS.phone) ?? "";
  const message = readMultiline(body, "message", FIELD_LIMITS.message) ?? "";

  if (!name || !message) {
    return NextResponse.json(
      { error: "Le nom et le message sont requis." },
      { status: 400 }
    );
  }
  if (!email && !phone) {
    return NextResponse.json(
      { error: "Indiquez un email ou un téléphone pour la réponse." },
      { status: 400 }
    );
  }
  if (email && !EMAIL_PATTERN.test(email)) {
    return NextResponse.json({ error: "Email invalide." }, { status: 400 });
  }

  try {
    await createContactMessage({
      name,
      email: email || undefined,
      phone: phone || undefined,
      message,
    });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Enregistrement impossible." }, { status: 500 });
  }
}
