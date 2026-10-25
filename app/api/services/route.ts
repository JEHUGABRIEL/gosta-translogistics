import { NextResponse } from "next/server";
import { buildServicesPayload } from "@/lib/services-payload";

/**
 * Catalogue des prestations, consommé par les cartes vedette via TanStack Query.
 * Donnée statique : cache long côté CDN, la réponse ne dépend que de `locale`.
 */
export async function GET(request: Request) {
  const locale = new URL(request.url).searchParams.get("locale") === "en" ? "en" : "fr";

  return NextResponse.json(buildServicesPayload(locale), {
    headers: {
      "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}
