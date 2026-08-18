import {
  Building2,
  PaintRoller,
  Route,
  Shovel,
  Wrench,
  Truck,
  Zap,
  Wrench as WrenchIcon,
  ClipboardList,
  Anchor,
  type LucideIcon,
} from "lucide-react";
import { btpServicesEn, logistiqueServicesEn } from "./services-en";

export type Service = {
  slug: string;
  category: "btp" | "logistique";
  title: string;
  short: string;
  icon: LucideIcon;
  description: string;
  bullets: string[];
};

export const btpServices: Service[] = [
  {
    slug: "gros-oeuvre",
    category: "btp",
    title: "Gros œuvre",
    short: "Fondations, maçonnerie et structure",
    icon: Building2,
    description:
      "De la fondation à la structure porteuse, l'équipe GOSTA TRANS prend en charge le gros œuvre des maisons individuelles, immeubles résidentiels, commerciaux et bâtiments industriels, avec une coordination directe avec l'approvisionnement en matériaux.",
    bullets: [
      "Fondations et terrassement de départ",
      "Maçonnerie et élévation des murs porteurs",
      "Coulage de dalles et structures en béton armé",
      "Coordination directe avec le transport de matériaux",
    ],
  },
  {
    slug: "second-oeuvre",
    category: "btp",
    title: "Second œuvre",
    short: "Plafond staff, électricité, plomberie",
    icon: PaintRoller,
    description:
      "Le second œuvre couvre les finitions qui rendent un bâtiment habitable et fonctionnel, dont le plafond staff, l'une des prestations les plus demandées de l'équipe, ainsi que l'électricité et la plomberie de base.",
    bullets: [
      "Pose de plafonds suspendus (plafond staff)",
      "Installations électriques et plomberie",
      "Cloisons, enduits et finitions intérieures",
      "Réalisable en complément d'un chantier gros œuvre existant",
    ],
  },
  {
    slug: "voirie-amenagement-urbain",
    category: "btp",
    title: "Voirie & aménagement urbain",
    short: "Routes, trottoirs, espaces publics",
    icon: Route,
    description:
      "GOSTA TRANS intervient sur les chantiers de voirie et d'aménagement urbain, un prolongement naturel de son activité de transport, qui lui permet de mobiliser rapidement matériaux et engins sur les axes de circulation.",
    bullets: [
      "Ouverture et remise en état de voies",
      "Aménagement de trottoirs et espaces publics",
      "Signalisation et sécurisation de chantier",
      "Mobilisation rapide grâce au parc de véhicules propre",
    ],
  },
  {
    slug: "terrassement-assainissement",
    category: "btp",
    title: "Terrassement & assainissement",
    short: "Nivellement, drainage, réseaux",
    icon: Shovel,
    description:
      "Avant toute construction ou réfection de voirie, le terrassement prépare le terrain et l'assainissement sécurise l'évacuation des eaux : deux étapes que GOSTA TRANS pilote avec ses propres engins.",
    bullets: [
      "Nivellement et préparation de terrain",
      "Creusement et pose de réseaux de drainage",
      "Gestion des eaux pluviales sur chantier urbain",
      "Location d'engins avec opérateur si besoin ponctuel",
    ],
  },
  {
    slug: "renovation-rehabilitation",
    category: "btp",
    title: "Rénovation & réhabilitation",
    short: "Remise à niveau de bâtiments existants",
    icon: Wrench,
    description:
      "Pour les bâtiments existants, l'équipe intervient sur la réhabilitation structurelle comme sur la remise à niveau des finitions (électricité, plomberie, plafonds) afin de prolonger la durée de vie d'un bien.",
    bullets: [
      "Diagnostic avant travaux",
      "Reprise de structure et de maçonnerie",
      "Remise à niveau électricité et plomberie",
      "Finitions et plafonds staff",
    ],
  },
];

export const logistiqueServices: Service[] = [
  {
    slug: "transport-materiaux",
    category: "logistique",
    title: "Transport de matériaux de construction",
    short: "Ciment, fer, agrégats, bois…",
    icon: Truck,
    description:
      "Le cœur historique de GOSTA TRANS&nbsp;: l'acheminement de matériaux de construction depuis le point d'approvisionnement jusqu'au chantier, avec un parc de véhicules adapté aux routes centrafricaines.",
    bullets: [
      "Ciment, fer à béton, agrégats, bois",
      "Chargement et déchargement encadrés",
      "Itinéraires adaptés à Bangui et ses environs",
      "Suivi jusqu'à la livraison sur site",
    ],
  },
  {
    slug: "livraison-rapide",
    category: "logistique",
    title: "Livraison rapide & sécurisée",
    short: "Délais courts, marchandise suivie",
    icon: Zap,
    description:
      "Pour les besoins urgents de chantier, GOSTA TRANS priorise la rapidité sans sacrifier la sécurité de la marchandise transportée, du point de départ jusqu'à la réception.",
    bullets: [
      "Mobilisation sous courts délais",
      "Marchandise arrimée et suivie",
      "Interlocuteur unique du départ à l'arrivée",
      "Adapté aux imprévus de chantier",
    ],
  },
  {
    slug: "location-engins",
    category: "logistique",
    title: "Location d'engins avec opérateur",
    short: "Engins de chantier, opérateur inclus",
    icon: WrenchIcon,
    description:
      "GOSTA TRANS met à disposition des engins de chantier accompagnés d'un opérateur qualifié : une solution pour les entreprises et particuliers qui n'ont pas leur propre parc matériel.",
    bullets: [
      "Engins pour terrassement, nivellement, manutention",
      "Opérateur qualifié inclus",
      "Location ponctuelle ou pour la durée du chantier",
      "Combinable avec le transport de matériaux",
    ],
  },
  {
    slug: "gestion-logistique",
    category: "logistique",
    title: "Gestion logistique complète",
    short: "Un seul interlocuteur, tout le flux",
    icon: ClipboardList,
    description:
      "Plutôt que de multiplier les prestataires, GOSTA TRANS centralise l'organisation logistique d'un projet&nbsp;: planification des livraisons, coordination des engins et suivi jusqu'au chantier.",
    bullets: [
      "Planification des flux de matériaux",
      "Coordination transport + engins + main d'œuvre",
      "Point de contact unique pour le client",
      "Adapté aux chantiers multi-phases",
    ],
  },
  {
    slug: "approvisionnement-chantiers",
    category: "logistique",
    title: "Approvisionnement de chantiers",
    short: "Du port au site, sans rupture",
    icon: Anchor,
    description:
      "En lien avec le volet maritime de l'entreprise, GOSTA TRANS organise l'approvisionnement de chantiers depuis la réception de fret jusqu'à la livraison finale, en limitant les ruptures de charge.",
    bullets: [
      "Suivi de fret dès la réception portuaire",
      "Acheminement direct vers le site",
      "Réduction des ruptures d'approvisionnement",
      "Coordination avec les équipes de chantier",
    ],
  },
];

export const allServices = [...btpServices, ...logistiqueServices];

const catalogByLocale = new Map<
  string,
  { btp: Service[]; logistique: Service[]; all: Service[] }
>();

/**
 * Returns the service catalogs for the given locale (defaults to French).
 * Slugs and categories are identical across locales — only the content differs.
 */
export function getServices(locale: string) {
  const key = locale === "en" ? "en" : "fr";
  const cached = catalogByLocale.get(key);
  if (cached) return cached;

  const btp = key === "en" ? btpServicesEn : btpServices;
  const logistique = key === "en" ? logistiqueServicesEn : logistiqueServices;
  const result = { btp, logistique, all: [...btp, ...logistique] };
  catalogByLocale.set(key, result);
  return result;
}

export function getServiceBySlug(
  locale: string,
  category: "btp" | "logistique",
  slug: string
) {
  const { btp, logistique } = getServices(locale);
  const list = category === "btp" ? btp : logistique;
  return list.find((s) => s.slug === slug);
}
