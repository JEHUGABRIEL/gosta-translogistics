import type { PoleId } from "./services";

export type HeroImage = { src: string; alt: string };

/**
 * Photos de fond des héros, hébergées sur Unsplash (domaine autorisé dans
 * next.config.ts : remotePatterns + img-src de la CSP).
 * `w=2560` borne le poids de la source tout en couvrant les écrans 2x ;
 * c'est next/image qui redimensionne ensuite à chaque point de rupture.
 */
const unsplash = (id: string) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=2560&q=85`;

/** Hero de la page « Services » (tous pôles confondus). */
export const SERVICES_HERO_IMAGE: HeroImage = {
  src: unsplash("photo-1465447142348-e9952c393450"),
  alt: "Échangeur autoroutier vu du ciel, infrastructures et transport",
};

/** Hero de la page « À propos ». */
export const ABOUT_HERO_IMAGE: HeroImage = {
  src: unsplash("photo-1581092446327-9b52bd1570c2"),
  alt: "Équipe d'ingénieurs étudiant des plans sur un chantier",
};

/** Hero de la page « Contact ». */
export const CONTACT_HERO_IMAGE: HeroImage = {
  src: unsplash("photo-1521791136064-7986c2920216"),
  alt: "Poignée de main entre deux partenaires dans un bureau",
};

/** Hero des pages de pôle et des fiches prestation. */
export const POLE_HERO_IMAGES: Record<PoleId, HeroImage> = {
  transport: {
    src: unsplash("photo-1601584115197-04ecc0da31d7"),
    alt: "Camion semi-remorque sur une route de campagne",
  },
  logistique: {
    src: unsplash("photo-1578575437130-527eed3abbec"),
    alt: "Porte-conteneurs et grues dans un terminal portuaire",
  },
  btp: {
    src: unsplash("photo-1541888946425-d81bb19240f5"),
    alt: "Équipe en casques sur un chantier de construction",
  },
  electricite: {
    src: unsplash("photo-1621905251189-08b45d6a269e"),
    alt: "Électricien intervenant sur un tableau électrique",
  },
  climatisation: {
    src: unsplash("photo-1607472586893-edb57bdc0e39"),
    alt: "Réseau de tuyauteries et de vannes d'une installation technique",
  },
  solaire: {
    src: unsplash("photo-1497440001374-f26997328c1b"),
    alt: "Panneaux solaires alignés dans une centrale photovoltaïque",
  },
  nettoyage: {
    src: unsplash("photo-1581578731548-c64695cc6952"),
    alt: "Agent de nettoyage lavant une vitre avec le matériel adapté",
  },
};
