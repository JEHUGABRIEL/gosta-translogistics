import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin();

const isDev = process.env.NODE_ENV !== "production";

// CSP — arbitrages assumés :
// - 'unsafe-inline' reste nécessaire : Next injecte des scripts inline
//   (bootstrap d'hydratation) et le layout pose un JSON-LD inline. Une CSP à
//   nonce supprimerait 'unsafe-inline', mais elle rend toutes les pages
//   dynamiques (elles sont prerendues via generateStaticParams) : on préfère
//   conserver le rendu statique, le site n'ayant aucun point d'injection
//   (tout contenu de la base est rendu comme du texte par React).
// - 'unsafe-eval' n'est utile qu'au HMR/Turbopack de développement.
// - upgrade-insecure-requests casserait le http://localhost de dev.
const scriptSrc = isDev
  ? "'self' 'unsafe-inline' 'unsafe-eval'"
  : "'self' 'unsafe-inline'";

const securityHeaders = [
  {
    key: "Content-Security-Policy",
    value: [
      "default-src 'self'",
      `script-src ${scriptSrc}`,
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' https://images.unsplash.com data: blob:",
      "font-src 'self' https://fonts.gstatic.com",
      "connect-src 'self'",
      "object-src 'none'",
      "frame-ancestors 'none'",
      "form-action 'self'",
      "base-uri 'self'",
      ...(isDev ? [] : ["upgrade-insecure-requests"]),
    ].join("; "),
  },
  {
    key: "X-Frame-Options",
    value: "DENY",
  },
  {
    key: "X-Content-Type-Options",
    value: "nosniff",
  },
  {
    key: "Referrer-Policy",
    value: "strict-origin-when-cross-origin",
  },
  {
    key: "Cross-Origin-Opener-Policy",
    value: "same-origin",
  },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=()",
  },
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
];

const nextConfig: NextConfig = {
  // N'expose pas la version du framework dans les réponses.
  poweredByHeader: false,
  turbopack: {
    root: process.cwd(),
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: securityHeaders,
      },
      {
        // Les liens d'invitation portent un token en query string : on évite
        // qu'il fuie via l'en-tête Referer vers un domaine tiers.
        source: "/admin/:path*",
        headers: [{ key: "Referrer-Policy", value: "no-referrer" }],
      },
    ];
  },
};

export default withNextIntl(nextConfig);
