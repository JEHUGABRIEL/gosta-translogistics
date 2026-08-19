import { NextResponse } from "next/server";
import { createQuoteRequest } from "@/lib/db/queries";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const name = typeof body?.name === "string" ? body.name.trim() : "";
  const phone = typeof body?.phone === "string" ? body.phone.trim() : "";
  const service = typeof body?.service === "string" ? body.service.trim() : undefined;
  const message = typeof body?.message === "string" ? body.message.trim() : undefined;

  if (!name || !phone) {
    return NextResponse.json({ error: "name and phone are required" }, { status: 400 });
  }

  try {
    await createQuoteRequest({ name, phone, service, message });
    return NextResponse.json({ ok: true });
  } catch {
    // Le formulaire ouvre déjà WhatsApp indépendamment de cet appel : on
    // ne bloque jamais l'utilisateur si la BD est indisponible.
    return NextResponse.json({ error: "failed to save" }, { status: 500 });
  }
}
