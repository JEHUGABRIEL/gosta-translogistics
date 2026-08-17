import type { Metadata } from "next";
import { routing } from "@/i18n/routing";

// URL de base du site en production (à adapter si un domaine personnalisé est branché)
export const SITE_URL = "https://gosta-trans.vercel.app";

export const COMPANY = {
  name: "GOSTA TRANS LOGISTIQUE & BTP",
  shortName: "GOSTA TRANS",
  address: {
    streetAddress: "PK14 Route de Boali",
    addressLocality: "Bangui",
    addressCountry: "CF",
  },
  phones: ["+23670120025", "+23672600533"],
  whatsapp: "+23675200313",
  email: "gostatranslogistiquebtp@outlook.fr",
  hours: "Mo-Sa 07:30-18:00",
  social: {
    facebook:
      "https://www.facebook.com/search/top?q=Gosta%20Trans%20%26%20Logistique%20et%20BTP",
    instagram: "https://www.instagram.com/Gosta_trans_Logistique_et_BTP",
  },
} as const;

/**
 * Génère le path localisé (ex: "/fr", "/en", "/fr/contact", "/en/contact").
 */
export function localizedPath(pathname: string, locale: string) {
  const clean = pathname === "/" ? "" : pathname;
  return `/${locale}${clean}`;
}

/**
 * Alternates (canonical + hreflang) pour une page donnée.
 * `pathname` est le chemin sans locale, ex: "/contact", "/services/logistique".
 */
export function getAlternates(pathname: string, locale: string) {
  const languages = Object.fromEntries(
    routing.locales.map((l) => [l, `${SITE_URL}${localizedPath(pathname, l)}`])
  );
  // x-default : URL à proposer aux moteurs qui ne connaissent pas la langue
  return {
    canonical: `${SITE_URL}${localizedPath(pathname, locale)}`,
    languages: {
      ...languages,
      "x-default": `${SITE_URL}${localizedPath(pathname, routing.defaultLocale)}`,
    },
  };
}

/**
 * Enrichit une page avec les metadata Open Graph, Twitter et alternates,
 * à partir de son title/description déjà localisés.
 */
export function pageMetadata({
  title,
  description,
  pathname,
  locale,
  images = ["/opengraph-image.png"],
}: {
  title: string;
  description: string;
  pathname: string;
  locale: string;
  images?: string[];
}): Metadata {
  const url = `${SITE_URL}${localizedPath(pathname, locale)}`;
  return {
    title,
    description,
    alternates: getAlternates(pathname, locale),
    openGraph: {
      type: "website",
      url,
      siteName: COMPANY.shortName,
      title,
      description,
      locale: locale === "fr" ? "fr_FR" : "en_US",
      images,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images,
    },
  };
}
