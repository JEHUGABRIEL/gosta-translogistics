import { getServices } from "./services";

/** Forme sérialisable envoyée par /api/services et hydratée dans TanStack Query.
 *  Les icônes (composants) sont volontairement exclues : seule la donnée circule. */
export type ServicesPayload = {
  locale: string;
  poles: {
    id: string;
    label: string;
    tagline: string;
    image: string;
    services: { slug: string; title: string; short: string }[];
  }[];
};

export function buildServicesPayload(locale: string): ServicesPayload {
  const { poles, byPole } = getServices(locale);

  return {
    locale: locale === "en" ? "en" : "fr",
    poles: poles.map((pole) => ({
      id: pole.id,
      label: pole.label,
      tagline: pole.tagline,
      image: pole.image,
      services: byPole[pole.id].map((s) => ({
        slug: s.slug,
        title: s.title,
        short: s.short,
      })),
    })),
  };
}
