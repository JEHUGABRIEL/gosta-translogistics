import createMiddleware from "next-intl/middleware";
import { NextResponse, type NextRequest } from "next/server";
import { routing } from "./i18n/routing";

const intlMiddleware = createMiddleware(routing);

// Pages du dashboard accessibles sans session (connexion + parcours d'invitation).
const PUBLIC_ADMIN_PREFIXES = ["/admin/login", "/admin/accept-invite"];

function isPublicAdminPath(pathname: string) {
  return PUBLIC_ADMIN_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`)
  );
}

export default function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname === "/admin" || pathname.startsWith("/admin/")) {
    if (isPublicAdminPath(pathname)) return NextResponse.next();

    // Première barrière, volontairement légère : simple présence du cookie de
    // session, sans requête base (elle serait coûteuse sur chaque asset admin).
    // La vérification réelle (session valide en base) reste dans le layout
    // protégé, les pages et chaque Server Action.
    if (!request.cookies.has("admin_session")) {
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }
    return NextResponse.next();
  }

  return intlMiddleware(request);
}

export const config = {
  // `admin` n'est plus exclu : il est traité par la branche ci-dessus, donc
  // jamais préfixé par une locale.
  matcher: ["/((?!api|trpc|_next|_vercel|.*\\..*).*)"],
};
