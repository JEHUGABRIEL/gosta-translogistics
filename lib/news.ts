/**
 * Actualités éditoriales du site : source unique des cartes de la home et des
 * pages d'article `/actualites/[slug]`.
 *
 * Les actualités publiées depuis le dashboard (table `news_posts`) s'y ajoutent
 * à l'affichage et sont accessibles de la même façon, avec un slug dérivé du
 * titre français (`newsSlug`) pour rester identique dans les deux langues.
 */

export type NewsPostItem = {
  /** Identifiant d'URL, identique en FR et en EN. */
  slug: string;
  date: string;
  title: string;
  /** Galerie de photos (chemins publics) — prioritaire sur `image`. */
  gallery?: string[];
  /** Visuel unique, repris comme image d'illustration et pour les métadonnées. */
  image: string;
  /** Paragraphes de l'article. */
  body: string[];
};

// Vraies photos de la visite à Mme le Maire de Bangui (portrait 3:4)
const VISIT_GALLERY = [
  "/actualites/visite_le_maire/759752022_122106265874483606_7580724467324769210_n.jpg",
  "/actualites/visite_le_maire/760105526_122106265904483606_6123224770020097206_n.jpg",
];

// Vraies photos de la lutte contre l'insalubrité axe Gbenguewé–Marché KM5
const CLEANUP_GALLERY = [
  "/actualites/lutte_contre_insalubrite/salubrite-1.png",
  "/actualites/lutte_contre_insalubrite/salubrite-2.png",
];

const NEWS_FR: NewsPostItem[] = [
  {
    slug: "visite-maire-bangui",
    date: "Fin juillet 2026",
    title: "Visite à Mme le Maire de Bangui",
    gallery: VISIT_GALLERY,
    image: VISIT_GALLERY[0],
    body: [
      "GOSTA TRANS LOGISTIQUE ET BTP a rendu visite à Mme le Maire de Bangui, fin juillet 2026.",
      "L'entreprise intervient à Bangui dans le transport de matériaux, la location d'engins avec opérateur et l'exécution de travaux de construction, du gros œuvre aux finitions, ainsi que sur des chantiers de voirie et d'aménagement urbain.",
      "Les photos de la rencontre sont réunies ci-dessous.",
    ],
  },
  {
    slug: "lutte-insalubrite-km5",
    date: "Août 2026",
    title:
      "Lutte contre l'insalubrité sur l'axe Gbenguewé–Marché KM5 avec les jeunes",
    gallery: CLEANUP_GALLERY,
    image: CLEANUP_GALLERY[0],
    body: [
      "En août 2026, les équipes de GOSTA TRANS LOGISTIQUE ET BTP ont participé à la lutte contre l'insalubrité sur l'axe Gbenguewé–Marché KM5, aux côtés des jeunes.",
      "L'opération s'est déroulée à Bangui, où l'entreprise est installée, au quartier Gré-Vapendé, au PK16 de la route de Boali.",
      "Retrouvez les photos de l'opération ci-dessous.",
    ],
  },
  {
    slug: "transport-logistique-construction",
    date: "2026",
    title: "Transport, logistique et construction dans une même structure",
    image: "/hero_section/hero-3.png",
    body: [
      "GOSTA TRANS LOGISTIQUE ET BTP est une entreprise centrafricaine basée à Bangui. Elle réunit sous une même structure le transport de matériaux, la location d'engins avec opérateur et l'exécution de travaux de construction, du gros œuvre aux finitions.",
      "Chaque demande suit le même fil : réception du besoin, mobilisation des moyens — camions, engins, équipes — puis exécution suivie sur le terrain. Cette continuité entre logistique et chantier limite les retards liés aux ruptures d'approvisionnement.",
    ],
  },
];

const NEWS_EN: NewsPostItem[] = [
  {
    slug: "visite-maire-bangui",
    date: "End of July 2026",
    title: "Visit to the Mayor of Bangui",
    gallery: VISIT_GALLERY,
    image: VISIT_GALLERY[0],
    body: [
      "GOSTA TRANS LOGISTIQUE ET BTP visited the Mayor of Bangui at the end of July 2026.",
      "The company works in Bangui on materials transport, equipment rental with operator and construction works, from structural works to finishes, as well as on roadworks and urban development sites.",
      "Photos from the meeting are gathered below.",
    ],
  },
  {
    slug: "lutte-insalubrite-km5",
    date: "August 2026",
    title: "Fighting insalubrity on the Gbenguewé–Marché KM5 axis with young people",
    gallery: CLEANUP_GALLERY,
    image: CLEANUP_GALLERY[0],
    body: [
      "In August 2026, GOSTA TRANS LOGISTIQUE ET BTP teams took part in the fight against insalubrity on the Gbenguewé–Marché KM5 axis, alongside young people.",
      "The operation took place in Bangui, where the company is based, in the Gré-Vapendé district at PK16 on Boali Road.",
      "Photos from the operation are gathered below.",
    ],
  },
  {
    slug: "transport-logistique-construction",
    date: "2026",
    title: "Transport, logistics and construction under one structure",
    image: "/hero_section/hero-3.png",
    body: [
      "GOSTA TRANS LOGISTIQUE ET BTP is a Central African company based in Bangui. It brings together under one structure materials transport, equipment rental with operator and construction works, from structural works to finishes.",
      "Every request follows the same thread: understanding the need, mobilising the means — trucks, machinery, teams — then supervised execution on site. This continuity between logistics and construction limits delays caused by supply shortages.",
    ],
  },
];

/** Actualités éditoriales, dans l'ordre d'affichage (la plus récente d'abord). */
export function getNewsPosts(locale: string): NewsPostItem[] {
  return locale === "en" ? NEWS_EN : NEWS_FR;
}

export function getNewsPost(locale: string, slug: string): NewsPostItem | undefined {
  return getNewsPosts(locale).find((post) => post.slug === slug);
}

/**
 * Slug d'URL d'une actualité publiée depuis le dashboard. Calculé sur le titre
 * français pour que l'URL soit la même en FR et en EN.
 */
export function newsSlug(title: string): string {
  return title
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
