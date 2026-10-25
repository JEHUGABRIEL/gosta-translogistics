import { NextResponse } from "next/server";
import { createContactMessage } from "@/lib/db/queries";
import { isRateLimited } from "@/lib/rate-limit";
import { getClientIpFromRequest } from "@/lib/request-ip";

// 10 messages / 10 minutes par IP : même seuil que les demandes de devis.
const CONTACT_MAX = 10;
const CONTACT_WINDOW_MS = 10 * 60 * 1000;

const MAX_NAME = 200;
const MAX_EMAIL = 320;
const MAX_PHONE = 30;
const MAX_MESSAGE = 2000;

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/** Retire les caractères de contrôle (sauts de ligne inclus) des champs courts. */
function clean(value: string) {
  return value.replace(/[\u0000-\u001F\u007F]/g, " ").replace(/\s+/g, " ").trim();
}

export async function POST(request: Request) {
  const ip = getClientIpFromRequest(request);

  if (await isRateLimited("contact", ip, CONTACT_MAX, CONTACT_WINDOW_MS)) {
    return NextResponse.json(
      { error: "Trop de messages. Réessayez dans quelques minutes." },
      { status: 429 }
    );
  }

  const body = await request.json().catch(() => null);

  // Honeypot : succès simulé, rien n'est enregistré.
  if (typeof body?.website === "string" && body.website.trim() !== "") {
    return NextResponse.json({ ok: true });
  }

  const name = typeof body?.name === "string" ? clean(body.name).slice(0, MAX_NAME) : "";
  const email = typeof body?.email === "string" ? clean(body.email).slice(0, MAX_EMAIL) : "";
  const phone = typeof body?.phone === "string" ? clean(body.phone).slice(0, MAX_PHONE) : "";
  const message =
    typeof body?.message === "string" ? body.message.trim().slice(0, MAX_MESSAGE) : "";

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
