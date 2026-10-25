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
  Warehouse,
  HardHat,
  Snowflake,
  Sun,
  SprayCan,
  Package,
  PackageCheck,
  Container,
  CarFront,
  ShieldCheck,
  Lightbulb,
  Wind,
  PanelsTopLeft,
  Droplets,
  Hammer,
  MapPin as MapPinIcon,
  type LucideIcon,
} from "lucide-react";
import { btpServicesEn, logistiqueServicesEn, NEW_SERVICES_EN, POLES_EN } from "./services-en";

export type PoleId =
  | "transport"
  | "logistique"
  | "btp"
  | "electricite"
  | "climatisation"
  | "solaire"
  | "nettoyage";

export type Service = {
  slug: string;
  pole: PoleId;
  title: string;
  short: string;
  icon: LucideIcon;
  description: string;
  bullets: string[];
};

export type Pole = {
  id: PoleId;
  label: string;
  tagline: string;
  icon: LucideIcon;
  /** Visuel affiché sur les cartes vedette (photo réelle du dépôt public/). */
  image: string;
};

/** Pôles de prestations, dans l'ordre d'affichage (flyer « Nos services »). */
export const POLES_FR: Pole[] = [
  {
    id: "transport",
    label: "Transport routier",
    tagline: "Marchandises, bennes et fret international",
    icon: Truck,
    image: "/hero_section/hero-6.png",
  },
  {
    id: "logistique",
    label: "Logistique",
    tagline: "Stockage, manutention et traçabilité",
    icon: Warehouse,
    image: "/hero_section/hero-7.png",
  },
  {
    id: "btp",
    label: "BTP",
    tagline: "Terrassement, construction et rénovation",
    icon: HardHat,
    image: "/hero_section/hero-2.png",
  },
  {
    id: "electricite",
    label: "Électricité",
    tagline: "Installation, mise aux normes et dépannage",
    icon: Zap,
    image: "/realisations/plafonds/plafond-1.png",
  },
  {
    id: "climatisation",
    label: "Climatisation",
    tagline: "Installation, entretien et dépannage",
    icon: Snowflake,
    image: "/realisations/realisations-2.png",
  },
  {
    id: "solaire",
    label: "Panneaux solaires",
    tagline: "Étude, installation et maintenance",
    icon: Sun,
    image: "/hero_section/hero-3.png",
  },
  {
    id: "nettoyage",
    label: "Technicien de surface",
    tagline: "Bureaux, résidences et espaces communs",
    icon: SprayCan,
    image: "/actualites/lutte_contre_insalubrite/salubrite-1.png",
  },
];

export const transportServices: Service[] = [
  {
    slug: "marchandises-generales",
    pole: "transport",
    title: "Transport de marchandises générales",
    short: "Camions, bennes et conteneurs",
    icon: Truck,
    description:
      "GOSTA TRANS achemine des marchandises générales sur l'ensemble du territoire centrafricain avec un parc de camions et de bennes adapté aux pistes et aux routes locales, du chargement jusqu'à la livraison.",
    bullets: [
      "Camions plateaux, bennes et porteurs",
      "Chargement et arrimage encadrés",
      "Itinéraires adaptés aux routes de RCA",
      "Livraison suivie jusqu'au destinataire",
    ],
  },
  {
    slug: "liaison-camions-bennes",
    pole: "transport",
    title: "Liaison camions et bennes",
    short: "Rotation continue entre deux points",
    icon: Container,
    description:
      "Pour les flux réguliers — carrières, dépôts, chantiers — l'équipe organise une rotation continue de camions et de bennes, avec un point de contact unique qui suit chaque voyage.",
    bullets: [
      "Rotations planifiées sur la durée du chantier",
      "Bennes pour agrégats, terre et gravats",
      "Coordination des chargements sur site",
      "Suivi des rotations et des volumes livrés",
    ],
  },
  {
    slug: "livraison-internationale",
    pole: "transport",
    title: "Livraison en Centrafrique et à l'international",
    short: "Du port jusqu'au point de livraison",
    icon: MapPinIcon,
    description:
      "GOSTA TRANS prend en charge l'acheminement depuis les points d'entrée du pays jusqu'au lieu de livraison, y compris pour les marchandises venues de l'étranger et les envois interurbains.",
    bullets: [
      "Acheminement depuis le port ou la frontière",
      "Livraison à Bangui et en province",
      "Coordination avec les transitaires",
      "Suivi documentaire du fret",
    ],
  },
  {
    slug: "dedouanement",
    pole: "transport",
    title: "Dédouanement",
    short: "Formalités douanières et transit",
    icon: ShieldCheck,
    description:
      "Les formalités douanières sont prises en charge pour éviter que la marchandise ne s'immobilise en frontière : constitution du dossier, échanges avec les services compétents et suivi jusqu'à la mainlevée.",
    bullets: [
      "Préparation du dossier douanier",
      "Suivi du transit jusqu'à la mainlevée",
      "Coordination avec le transport routier",
      "Information du client à chaque étape",
    ],
  },
  {
    slug: "transport-vehicules",
    pole: "transport",
    title: "Transport de véhicules en RCA",
    short: "Voitures, utilitaires, engins légers",
    icon: CarFront,
    description:
      "Le transport de véhicules — voitures particulières, utilitaires, engins légers — s'effectue sur porte-voitures ou plateau, avec sécurisation de la carrosserie pendant le trajet.",
    bullets: [
      "Voitures, utilitaires, engins légers",
      "Chargement sur plateau ou porte-voitures",
      "Véhicule sécurisé pendant le trajet",
      "Livraison dans la ville de destination",
    ],
  },
  {
    slug: "messagerie",
    pole: "transport",
    title: "Messagerie et petits envois",
    short: "Colis et documents en province",
    icon: Package,
    description:
      "Pour les petits envois, le service de messagerie regroupe colis et documents et les achemine avec les convois en partance, ce qui limite les coûts d'un transport dédié.",
    bullets: [
      "Colis, pièces et documents",
      "Regroupement avec les convois en partance",
      "Dépôt et retrait à Bangui",
      "Confirmation de remise au destinataire",
    ],
  },
];

export const logistiqueServices: Service[] = [
  {
    slug: "transport-materiaux",
    pole: "logistique",
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
    pole: "logistique",
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
    pole: "logistique",
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
    pole: "logistique",
    title: "Gestion de la chaîne d'approvisionnement",
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
    pole: "logistique",
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
  {
    slug: "stockage-entreposage",
    pole: "logistique",
    title: "Stockage et entreposage",
    short: "Marchandises gardées avant livraison",
    icon: Warehouse,
    description:
      "Les marchandises peuvent être réceptionnées et conservées avant d'être livrées au rythme du chantier, ce qui évite d'encombrer le site et limite les pertes de matériaux.",
    bullets: [
      "Réception et mise en stock",
      "Livraisons échelonnées selon le chantier",
      "Manutention par engins de levage",
      "Inventaire des entrées et sorties",
    ],
  },
  {
    slug: "manutention-distribution",
    pole: "logistique",
    title: "Manutention et distribution",
    short: "Chargement, tri et répartition",
    icon: PackageCheck,
    description:
      "Chargement, déchargement, tri et répartition des marchandises entre plusieurs destinations : la manutention est assurée par des opérateurs équipés, en complément du transport.",
    bullets: [
      "Chargement et déchargement sur site",
      "Tri et répartition par destination",
      "Opérateurs et engins de levage",
      "Réduction des avaries de manutention",
    ],
  },
  {
    slug: "suivi-tracabilite",
    pole: "logistique",
    title: "Suivi et traçabilité des marchandises",
    short: "Savoir où en est chaque envoi",
    icon: MapPinIcon,
    description:
      "Chaque envoi est suivi de l'enlèvement à la livraison, avec un état des quantités et un compte rendu au client : de quoi savoir précisément ce qui est parti, ce qui est arrivé et ce qui reste dû.",
    bullets: [
      "Suivi de l'état de chaque envoi",
      "Contrôle des quantités au départ et à l'arrivée",
      "Compte rendu de livraison au client",
      "Signalement immédiat des écarts",
    ],
  },
];

export const btpServices: Service[] = [
  {
    slug: "gros-oeuvre",
    pole: "btp",
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
    pole: "btp",
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
    pole: "btp",
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
    pole: "btp",
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
    pole: "btp",
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
  {
    slug: "construction-batiments",
    pole: "btp",
    title: "Construction de bâtiments",
    short: "Maisons, immeubles, bâtiments industriels",
    icon: Hammer,
    description:
      "De la maison individuelle au bâtiment industriel, GOSTA TRANS conduit le chantier du terrassement à la remise des clés, avec les mêmes équipes pour le gros œuvre et les finitions.",
    bullets: [
      "Maisons individuelles et immeubles",
      "Bâtiments commerciaux et industriels",
      "Un seul interlocuteur du début à la fin",
      "Approvisionnement intégré en matériaux",
    ],
  },
  {
    slug: "maconnerie-vrd",
    pole: "btp",
    title: "Maçonnerie & VRD",
    short: "Ouvrages, réseaux divers, dallages",
    icon: Building2,
    description:
      "Au-delà des bâtiments, l'équipe réalise les ouvrages de maçonnerie et de voirie-réseaux divers : dallages, murets, regards, caniveaux et raccordements nécessaires à un site fonctionnel.",
    bullets: [
      "Dallages et ouvrages en béton",
      "Murets, regards et caniveaux",
      "Réseaux divers et raccordements",
      "Petits ouvrages d'aménagement",
    ],
  },
];

export const electriciteServices: Service[] = [
  {
    slug: "installation-electrique",
    pole: "electricite",
    title: "Installation électrique bâtiment et industriel",
    short: "Tableaux, circuits, éclairage",
    icon: Lightbulb,
    description:
      "L'installation électrique est réalisée pour les bâtiments résidentiels et professionnels : tableaux, circuits, éclairage et prises, dimensionnés selon l'usage réel des locaux.",
    bullets: [
      "Tableaux et circuits de distribution",
      "Éclairage intérieur et extérieur",
      "Prises, commandes et protections",
      "Installation pour batiment industriel",
    ],
  },
  {
    slug: "renovation-armoires-normes",
    pole: "electricite",
    title: "Rénovation d'armoires aux normes",
    short: "Mise en conformité des tableaux",
    icon: ShieldCheck,
    description:
      "Les tableaux et armoires anciens sont repris pour revenir aux règles de sécurité : identification des circuits, protections différentielles et repérage clair des départs.",
    bullets: [
      "Diagnostic de l'installation existante",
      "Remplacement des protections vétustes",
      "Repérage et étiquetage des circuits",
      "Mise en conformité des armoires",
    ],
  },
  {
    slug: "depannage-electrique",
    pole: "electricite",
    title: "Dépannage électrique 24h/24",
    short: "Panne, court-circuit, coupure",
    icon: Zap,
    description:
      "En cas de panne — coupure, court-circuit, tableau qui disjoncte — l'équipe intervient rapidement pour rétablir l'alimentation et identifier l'origine du défaut.",
    bullets: [
      "Intervention rapide 24h/24",
      "Recherche de défaut et remise en service",
      "Remplacement des éléments défaillants",
      "Conseils pour éviter la récidive",
    ],
  },
];

export const climatisationServices: Service[] = [
  {
    slug: "installation-entretien-clim",
    pole: "climatisation",
    title: "Installation et entretien",
    short: "Montage, charge et entretien courant",
    icon: Snowflake,
    description:
      "L'installation des climatiseurs couvre le montage des unités, la charge du circuit et les essais de fonctionnement, suivis d'un entretien régulier pour tenir la performance dans le temps.",
    bullets: [
      "Montage des unités intérieures et extérieures",
      "Charge et vérification du circuit frigorifique",
      "Essais de fonctionnement",
      "Entretien et nettoyage périodiques",
    ],
  },
  {
    slug: "depannage-climatisation",
    pole: "climatisation",
    title: "Dépannage rapide",
    short: "Appareil qui ne refroidit plus",
    icon: Wind,
    description:
      "Quand un climatiseur ne refroidit plus, fuit ou fait disjoncter, le dépannage identifie la cause — gaz, filtre, carte, alimentation — et remet l'appareil en service.",
    bullets: [
      "Diagnostic sur site",
      "Recherche de fuite de gaz",
      "Remplacement des pièces défaillantes",
      "Remise en service et contrôle",
    ],
  },
  {
    slug: "climatisation-residentielle",
    pole: "climatisation",
    title: "Climatisation résidentielle et professionnelle",
    short: "Maisons, bureaux, commerces",
    icon: Snowflake,
    description:
      "Le dimensionnement se fait selon la surface, l'exposition et l'usage des locaux : maisons, bureaux, commerces ou salles techniques, avec un choix de matériel adapté à la charge réelle.",
    bullets: [
      "Étude de la charge thermique",
      "Maisons, bureaux et commerces",
      "Monosplit et multisplit",
      "Contrats d'entretien pour les professionnels",
    ],
  },
];

export const solaireServices: Service[] = [
  {
    slug: "etude-dimensionnement",
    pole: "solaire",
    title: "Étude et dimensionnement",
    short: "Calcul des besoins et du champ solaire",
    icon: PanelsTopLeft,
    description:
      "Avant d'installer, l'équipe mesure les besoins réels du site — consommation, autonomie souhaitée, ensoleillement — et dimensionne le champ de panneaux, les batteries et l'onduleur en conséquence.",
    bullets: [
      "Évaluation de la consommation",
      "Dimensionnement des panneaux et batteries",
      "Choix de l'onduleur et des protections",
      "Devis détaillé du matériel",
    ],
  },
  {
    slug: "installation-systemes-solaires",
    pole: "solaire",
    title: "Installation de systèmes solaires",
    short: "Pose, raccordement, mise en service",
    icon: Sun,
    description:
      "La pose couvre la fixation des panneaux, le câblage, le raccordement aux batteries et la mise en service, avec vérification de la production réelle avant réception.",
    bullets: [
      "Fixation et orientation des panneaux",
      "Câblage et protections DC/AC",
      "Raccordement batteries et onduleur",
      "Mise en service et mesures de production",
    ],
  },
  {
    slug: "maintenance-suivi",
    pole: "solaire",
    title: "Maintenance et suivi",
    short: "Nettoyage, contrôle, remplacement",
    icon: Droplets,
    description:
      "Un champ solaire perd en rendement s'il n'est pas entretenu : nettoyage des modules, contrôle des connexions et remplacement des batteries en fin de vie font partie du suivi.",
    bullets: [
      "Nettoyage des modules",
      "Contrôle des connexions et protections",
      "Mesure de la production",
      "Remplacement des batteries usagées",
    ],
  },
];

export const nettoyageServices: Service[] = [
  {
    slug: "nettoyage-bureaux",
    pole: "nettoyage",
    title: "Nettoyage de bureaux et locaux",
    short: "Interventions régulières ou ponctuelles",
    icon: SprayCan,
    description:
      "Le nettoyage des bureaux et locaux professionnels s'organise en passages réguliers ou en intervention ponctuelle, selon les horaires d'activité du client.",
    bullets: [
      "Bureaux, salles de réunion, sanitaires",
      "Passages réguliers ou ponctuels",
      "Intervention hors horaires d'ouverture",
      "Équipe et matériel fournis",
    ],
  },
  {
    slug: "entretien-espaces-communs",
    pole: "nettoyage",
    title: "Entretien des espaces communs",
    short: "Résidences, cours, abords",
    icon: SprayCan,
    description:
      "Les parties communes — cours, couloirs, escaliers, abords — sont entretenues pour rester praticables et propres, y compris sur les sites qui reçoivent du public.",
    bullets: [
      "Cours, couloirs et escaliers",
      "Abords et zones de passage",
      "Évacuation des déchets courants",
      "Fréquence adaptée à la fréquentation",
    ],
  },
  {
    slug: "produits-materiels",
    pole: "nettoyage",
    title: "Produits et matériels professionnels",
    short: "Consommables et équipement inclus",
    icon: ShieldCheck,
    description:
      "Les prestations incluent les produits et le matériel professionnels nécessaires : pas de consommables à fournir côté client, et des produits choisis selon la nature des surfaces.",
    bullets: [
      "Produits adaptés aux surfaces",
      "Matériel professionnel fourni",
      "Protocole d'intervention écrit",
      "Reprise en cas de prestation non conforme",
    ],
  },
];

export const allServicesFr: Service[] = [
  ...transportServices,
  ...logistiqueServices,
  ...btpServices,
  ...electriciteServices,
  ...climatisationServices,
  ...solaireServices,
  ...nettoyageServices,
];

const catalogByLocale = new Map<
  string,
  { poles: Pole[]; all: Service[]; byPole: Record<PoleId, Service[]> }
>();

/**
 * Returns the service catalogs for the given locale (defaults to French).
 * Slugs and poles are identical across locales — only the content differs.
 */
export function getServices(locale: string) {
  const key = locale === "en" ? "en" : "fr";
  const cached = catalogByLocale.get(key);
  if (cached) return cached;

  const isEn = key === "en";
  const poles = isEn ? POLES_EN : POLES_FR;

  const byPole = {
    transport: isEn ? NEW_SERVICES_EN.transport : transportServices,
    logistique: isEn ? logistiqueServicesEn : logistiqueServices,
    btp: isEn ? btpServicesEn : btpServices,
    electricite: isEn ? NEW_SERVICES_EN.electricite : electriciteServices,
    climatisation: isEn ? NEW_SERVICES_EN.climatisation : climatisationServices,
    solaire: isEn ? NEW_SERVICES_EN.solaire : solaireServices,
    nettoyage: isEn ? NEW_SERVICES_EN.nettoyage : nettoyageServices,
  } as Record<PoleId, Service[]>;

  const result = { poles, byPole, all: poles.flatMap((p) => byPole[p.id]) };
  catalogByLocale.set(key, result);
  return result;
}

export function getPole(locale: string, pole: PoleId) {
  return getServices(locale).poles.find((p) => p.id === pole);
}

export function getServicesByPole(locale: string, pole: PoleId) {
  return getServices(locale).byPole[pole] ?? [];
}

/** Le slug d'une prestation est unique : le pôle se déduit du service. */
export function getServiceBySlug(locale: string, slug: string) {
  return getServices(locale).all.find((s) => s.slug === slug);
}

export function isPoleId(value: string): value is PoleId {
  return (
    value === "transport" ||
    value === "logistique" ||
    value === "btp" ||
    value === "electricite" ||
    value === "climatisation" ||
    value === "solaire" ||
    value === "nettoyage"
  );
}
